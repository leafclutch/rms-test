import prisma from '../config/prisma.ts';
import { AppError } from '../utils/appError.ts';
import { OrderStatus, PaymentMethod } from '@prisma/client';

interface Discount {
    type: 'FIXED' | 'PERCENT';
    value: number;
}

interface PaymentPayload {
    orderId: string;
    discount?: Discount;
    cashAmount?: number;
    onlineAmount?: number;
    customerPhone?: string; // For credit
}

// Helper: Calculate final payable amount
export const calculateFinalPayable = (totalAmount: number, discount?: Discount) => {
    let finalAmount = Number(totalAmount);
    let discountAmount = 0;

    if (discount) {
        if (discount.type === 'FIXED') {
            discountAmount = discount.value;
        } else if (discount.type === 'PERCENT') {
            discountAmount = (finalAmount * discount.value) / 100;
        }
        finalAmount = finalAmount - discountAmount;
    }

    // Ensure no negative amount
    finalAmount = Math.max(0, finalAmount);

    return { finalAmount, discountAmount };
};

// Helper: Validate order and get details
const getOrder = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payments: true }
    });

    if (!order) throw new AppError('Order not found', 404);
    if (order.status === OrderStatus.paid) throw new AppError('Order is already paid', 400);

    return order;
};

// Helper: Log details for "Print Bill" (mock)
const generateBillData = (order: any, finalAmount: number, discountAmount: number) => {
    return {
        orderId: order.id,
        tableId: order.tableId,
        totalAmount: Number(order.totalAmount),
        discountAmount: discountAmount,
        finalPayable: finalAmount,
        timestamp: new Date()
    };
};

export const processCashPayment = async ({ orderId, discount, cashAmount }: PaymentPayload) => {
    const order = await getOrder(orderId);
    const { finalAmount, discountAmount } = calculateFinalPayable(Number(order.totalAmount), discount);

    if (!cashAmount || cashAmount < finalAmount) {
        throw new AppError(`Insufficient cash amount. Expected: ${finalAmount}`, 400);
    }

    const change = cashAmount - finalAmount;

    // Transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
        // Create Payment Record
        await tx.payment.create({
            data: {
                orderId,
                method: PaymentMethod.CASH,
                cashAmount: finalAmount, // We record what was paid towards the bill
            }
        });

        // Update Order
        return await tx.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.paid,
                discountAmount: discountAmount,
                dueAmount: 0,
                cashAmount: finalAmount, // Store actual paid towards bill
                paymentMethod: PaymentMethod.CASH,
            }
        });
    });

    return {
        message: 'Cash payment successful',
        change,
        bill: generateBillData(order, finalAmount, discountAmount)
    };
};

export const processOnlinePayment = async ({ orderId, discount }: PaymentPayload) => {
    const order = await getOrder(orderId);
    const { finalAmount, discountAmount } = calculateFinalPayable(Number(order.totalAmount), discount);

    // Assume online payment is exact for now (integration would verify this)

    const updatedOrder = await prisma.$transaction(async (tx) => {
        await tx.payment.create({
            data: {
                orderId,
                method: PaymentMethod.ONLINE,
                onlineAmount: finalAmount,
            }
        });

        return await tx.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.paid,
                discountAmount: discountAmount,
                dueAmount: 0,
                onlineAmount: finalAmount,
                paymentMethod: PaymentMethod.ONLINE,
            }
        });
    });

    return {
        message: 'Online payment successful',
        bill: generateBillData(order, finalAmount, discountAmount)
    };
};

export const processMixedPayment = async ({ orderId, discount, cashAmount, onlineAmount }: PaymentPayload) => {
    const order = await getOrder(orderId);
    const { finalAmount, discountAmount } = calculateFinalPayable(Number(order.totalAmount), discount);

    const cAmount = Number(cashAmount || 0);
    const oAmount = Number(onlineAmount || 0);

    if (Math.abs((cAmount + oAmount) - finalAmount) > 0.01) { // Floating point tolerance
        throw new AppError(`Total payment (${cAmount + oAmount}) does not match final payable (${finalAmount})`, 400);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
        await tx.payment.create({
            data: {
                orderId,
                method: PaymentMethod.MIXED,
                cashAmount: cAmount,
                onlineAmount: oAmount,
            }
        });

        return await tx.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.paid,
                discountAmount: discountAmount,
                dueAmount: 0,
                cashAmount: cAmount,
                onlineAmount: oAmount,
                paymentMethod: PaymentMethod.MIXED,
            }
        });
    });

    return {
        message: 'Mixed payment successful',
        bill: generateBillData(order, finalAmount, discountAmount)
    };
};

export const processCreditPayment = async ({ orderId, customerPhone }: PaymentPayload) => {
    if (!customerPhone) throw new AppError('Customer phone required for credit payment', 400);

    const order = await getOrder(orderId);
    // Credit payments don't usually get ad-hoc discounts at the counter in this logic, 
    // but if requested we could add it. Assuming full amount for now or add discount param if needed.
    const finalAmount = Number(order.totalAmount); 
    
    // Find or Create Customer
    let customer = await prisma.customer.findUnique({ where: { phoneNumber: customerPhone } });
    if (!customer) {
        // Optionally create simplified customer if name not provided, or throw
        throw new AppError('Customer not found. Please create customer profile first.', 404);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
        // Create Credit Transaction
        await tx.creditTransaction.create({
            data: {
                customerId: customer!.id,
                orderId,
                amount: finalAmount,
            }
        });

        // Update Customer Balance
        await tx.customer.update({
            where: { id: customer!.id },
            data: {
                totalDue: { increment: finalAmount }
            }
        });

        // Update Order
        return await tx.order.update({
            where: { id: orderId },
            data: {
                status: OrderStatus.paid,
                paymentMethod: PaymentMethod.CREDIT,
                customerId: customer!.id, // Link customer if not already
                dueAmount: finalAmount // Technically "due" from customer, but order is closed
            }
        });
    });

    // Mock WhatsApp Notification
    console.log(`[WhatsApp Mock] To: ${customerPhone} | Message: An item worth Rs. ${finalAmount} has been added to your credit account.`);

    return {
        message: 'Credit payment successful',
        bill: generateBillData(order, finalAmount, 0)
    };
};
