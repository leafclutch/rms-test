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

    await prisma.order.update({
        where: { id: order.id },
        data: { totalAmount: currentTotal }
    });
    
    try {
        await import('./inventory.service.js').then(s => s.deductStockForOrderService(order.id, items));
    } catch (err) {
        console.error("Failed to deduct inventory:", err);
    }

    try {
        const { getIO } = await import('../socket.ts');
        const io = getIO();
        const eventName = order.items.length === items.length ? 'order:new' : 'order:updated'; // Simple heuristic, refine if needed
        
        io.emit('order:updated', { 
            orderId: order.id, 
            tableCode, 
            totalAmount: currentTotal,
            items: order.items 
        });

       
        
    } catch (err) {
        console.error("Socket emit failed:", err);
    }

    return { message: 'Order placed successfully', orderId: order.id };
};
