import prisma from '../config/prisma.ts';
import { AppError } from '../utils/appError.ts';
import { CreditTransactionType } from '@prisma/client';

export const createCreditAccount = async (data: { fullName: string; phoneNumber: string }) => {
    const existing = await prisma.customer.findUnique({ where: { phoneNumber: data.phoneNumber } });
    if (existing) throw new AppError('A customer with this phone number already exists', 400);

    return await prisma.customer.create({
        data: {
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
        }
    });
};

export const searchCreditAccounts = async (query: string) => {
    return await prisma.customer.findMany({
        where: {
            OR: [
                { fullName: { contains: query, mode: 'insensitive' } },
                { phoneNumber: { contains: query } }
            ]
        }
    });
};

export const getCreditAccountDetails = async (accountId: string) => {
    const customer = await prisma.customer.findUnique({
        where: { id: accountId },
        include: {
            ledger: {
                orderBy: { createdAt: 'desc' },
                include: { order: true }
            }
        }
    });

    if (!customer) throw new AppError('Customer not found', 404);
    return customer;
};

export const recordDebtPayment = async (accountId: string, amount: number, description?: string) => {
    return await prisma.$transaction(async (tx) => {
        const customer = await tx.customer.findUnique({ where: { id: accountId } });
        if (!customer) throw new AppError('Customer not found', 404);

        const paymentAmount = Number(amount);
        if (paymentAmount <= 0) throw new AppError('Payment amount must be greater than 0', 400);

        // Record the transaction
        const transaction = await tx.creditTransaction.create({
            data: {
                customerId: accountId,
                amount: paymentAmount,
                type: CreditTransactionType.PAYMENT,
                description: description || 'Debt payment settlement'
            }
        });

        // Update customer balance
        const updatedCustomer = await tx.customer.update({
            where: { id: accountId },
            data: {
                totalDue: { decrement: paymentAmount }
            }
        });

        // Mock WhatsApp Notification
        console.log(`[WhatsApp Mock] To: ${customer.phoneNumber} | Message: Payment of Rs. ${paymentAmount} received. Your new balance is Rs. ${updatedCustomer.totalDue}.`);

        return { transaction, updatedCustomer };
    });
};

export const listAllCreditAccounts = async () => {
    return await prisma.customer.findMany({
        orderBy: { fullName: 'asc' }
    });
};

export const updateAccount = async (accountId: string, data: { fullName?: string; phoneNumber?: string }) => {
    try {
        return await prisma.customer.update({
            where: { id: accountId },
            data
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new AppError('A customer with this phone number already exists', 400);
        }
        throw error;
    }
};

export const deleteAccount = async (accountId: string) => {
    const customer = await prisma.customer.findUnique({ where: { id: accountId } });
    if (!customer) throw new AppError('Customer not found', 404);

    if (Number(customer.totalDue) !== 0) {
        throw new AppError('Cannot delete a credit account with an outstanding balance. Please settle the debt first.', 400);
    }

    return await prisma.customer.delete({ where: { id: accountId } });
};
