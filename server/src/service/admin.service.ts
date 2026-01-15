import prisma from '../config/prisma.ts';
import { AppError } from '../utils/appError.ts';


interface OrderItemInput {
    menuItemId: string;
    quantity: number;
}

interface CreateOrderInput {
    tableCode: string;
    customerType: 'DINE_IN' | 'WALK_IN' | 'ONLINE';
    items: OrderItemInput[];
    mobileNumber?: string;
    customerName?: string;
}

export const createOrUpdateOrderService = async (data: CreateOrderInput) => {
    const { tableCode, items, mobileNumber, customerName } = data;

    // 1. Find Table
    const table = await prisma.table.findUnique({ where: { tableCode } });
    if (!table) throw new AppError('Table not found', 404);

    // 2. Check for OPEN (pending/preparing) order.
    const activeStatuses: any[] = ['pending', 'preparing', 'served'];

    let order: any = await prisma.order.findFirst({
        where: {
            tableId: table.id,
            status: { in: activeStatuses },
        },
        include: { items: true }
    });

    // 3. Create or Update
    if (!order) {
        order = await prisma.order.create({
            data: {
                tableId: table.id,
                customerPhone: mobileNumber ?? null,
                status: 'pending',
            },
            include: { items: true }
        });
    }

    if (!order) throw new AppError('Failed to create or retrieve order', 500);

    // Add Items
    let currentTotal = Number(order.totalAmount);

    for (const item of items) {
        // Fetch price
        const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
        if (!menuItem) continue;

        const price = Number(menuItem.price);
        const lineTotal = price * item.quantity;

        // Upsert OrderItem: If same item exists in order, increment qty
        const existingItem = await prisma.orderItem.findFirst({
            where: { orderId: order.id, menuItemId: item.menuItemId }
        });

        if (existingItem) {
            await prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { quantity: { increment: item.quantity } }
            });
        } else {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    priceSnapshot: price
                }
            });
        }

        currentTotal += lineTotal;
    }

    // 5. Update Order Total
    await prisma.order.update({
        where: { id: order.id },
        data: { totalAmount: currentTotal }
    });

    //Notify Admin (Socket.io) - TODO
    return { message: 'Order placed successfully', orderId: order.id };
};





export const getActiveOrdersService = async () => {
    // Fetch orders with status pending, preparing, served
    const orders = await prisma.order.findMany({
        where: {
            status: { in: ['pending', 'preparing', 'served'] }
        },
        include: {
            table: true,
            items: {
                include: { menuItem: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return { orders };
};

export const serveOrderService = async (orderId: string) => {
    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'served' }
    });
    return { message: 'Order marked as served', order };
};

export const getBillService = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: { include: { menuItem: true } },
            table: true
        }
    });
    if (!order) throw new AppError('Order not found', 404);

    return { order };
};

const recalculateOrderTotal = async (orderId: string, tx?: any) => {
    const p = tx || prisma;
    const items = await p.orderItem.findMany({
        where: { orderId }
    });

    const totalAmount = items.reduce((acc: number, item: any) => {
        return acc + (Number(item.priceSnapshot) * item.quantity);
    }, 0);

    await p.order.update({
        where: { id: orderId },
        data: { totalAmount }
    });

    return totalAmount;
};

export const reduceOrderItemService = async (orderId: string, menuItemId: string, quantity: number) => {
    return await prisma.$transaction(async (tx) => {
        const orderItem = await tx.orderItem.findFirst({
            where: { orderId, menuItemId }
        });

        if (!orderItem) throw new AppError('Item not found in order', 404);

        if (orderItem.quantity <= quantity) {
            // Remove item if quantity becomes 0 or less
            await tx.orderItem.delete({ where: { id: orderItem.id } });
        } else {
            // Reduce quantity
            await tx.orderItem.update({
                where: { id: orderItem.id },
                data: { quantity: { decrement: quantity } }
            });
        }

        const newTotal = await recalculateOrderTotal(orderId, tx);
        return { message: 'Item quantity reduced', newTotal };
    });
};

export const cancelOrderItemService = async (orderId: string, menuItemId: string) => {
    return await prisma.$transaction(async (tx) => {
        const orderItem = await tx.orderItem.findFirst({
            where: { orderId, menuItemId }
        });

        if (!orderItem) throw new AppError('Item not found in order', 404);

        await tx.orderItem.delete({ where: { id: orderItem.id } });

        const newTotal = await recalculateOrderTotal(orderId, tx);
        return { message: 'Item removed from order', newTotal };
    });
};

export const getOrderHistoryService = async () => {
    const orders = await prisma.order.findMany({
        where: { status: 'paid' },
        include: {
            table: true,
            items: { include: { menuItem: true } }
        },
        orderBy: { updatedAt: 'desc' }
    });
    return { orders };
};

export const addItemsToOrderService = async (orderId: string, items: { menuItemId: string, quantity: number }[]) => {
    return await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId } });
        if (!order) throw new AppError('Order not found', 404);
        if (order.status === 'paid' || order.status === 'cancelled') {
            throw new AppError('Cannot add items to a completed or cancelled order', 400);
        }

        for (const item of items) {
            const menuItem = await tx.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!menuItem) continue;

            const existingItem = await tx.orderItem.findFirst({
                where: { orderId, menuItemId: item.menuItemId }
            });

            if (existingItem) {
                await tx.orderItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: { increment: item.quantity } }
                });
            } else {
                await tx.orderItem.create({
                    data: {
                        orderId,
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        priceSnapshot: menuItem.price
                    }
                });
            }
        }

        const newTotal = await recalculateOrderTotal(orderId, tx);
        return { message: 'Items added to order', newTotal };
    });
};
