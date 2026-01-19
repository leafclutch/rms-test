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
    const { tableCode, items, mobileNumber, customerName, customerType } = data;
    let targetTableCode = tableCode;

    if (customerType === 'WALK_IN' && !targetTableCode) {
        // Generate a unique virtual table for each walk-in to prevent merging
        targetTableCode = `WALKIN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    if (!targetTableCode) {
        if (customerType === 'ONLINE') targetTableCode = 'ONLINE';
        else throw new AppError('Table code is required', 400);
    }

    // 1. Find or Create Table (Virtual if needed)
    let table = await prisma.table.findUnique({ where: { tableCode: targetTableCode } });
    if (!table) {
        if (customerType === 'ONLINE' || customerType === 'WALK_IN') {
            const { v4: uuidv4 } = await import('uuid');
            // Map DINE_IN (if it somehow got here) or others to correct enum
            const tableTypeMap: any = {
                'DINE_IN': 'PHYSICAL',
                'WALK_IN': 'WALK_IN',
                'ONLINE': 'ONLINE'
            };

            table = await prisma.table.create({
                data: {
                    tableCode: targetTableCode,
                    tableType: tableTypeMap[customerType] || 'PHYSICAL',
                    qrToken: uuidv4(),
                }
            });
        } else {
            throw new AppError(`Table with code "${targetTableCode}" not found. Please ensure the table is registered in the system.`, 400);
        }
    }

    // 2. Resolve Customer Account (if mobile number provided)
    let customerId: string | undefined = undefined;
    if (mobileNumber) {
        const customer = await prisma.customer.findUnique({ where: { phoneNumber: mobileNumber } });
        if (customer) {
            customerId = customer.id;
        }
    }

    // 3. Check for OPEN (pending/preparing/served) order on this table.
    const activeStatuses: any[] = ['pending', 'preparing', 'served'];

    let order: any = await prisma.order.findFirst({
        where: {
            tableId: table.id,
            status: { in: activeStatuses },
        },
        include: { items: true }
    });

    // 4. Create or Update
    if (!order) {
        order = await prisma.order.create({
            data: {
                tableId: table.id,
                customerId: customerId ?? null,
                customerName: customerName ?? null,
                customerPhone: mobileNumber ?? null,
                status: 'pending',
            },
            include: { items: true }
        });
    } else {
        // Update existing order info if provided
        await prisma.order.update({
            where: { id: order.id },
            data: {
                customerName: customerName ?? order.customerName,
                customerPhone: mobileNumber ?? order.customerPhone,
                customerId: customerId ?? order.customerId
            }
        });
    }

    if (!order) throw new AppError('Failed to create or retrieve order', 500);

    // Add Items
    for (const item of items) {
        // Fetch price
        const menuItem = await prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
        if (!menuItem) continue;

        const price = Number(menuItem.price);

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
    }

    // Recalculate total from scratch to ensure accuracy and prevent double counting
    const allItems = await prisma.orderItem.findMany({
        where: { orderId: order.id },
        select: { priceSnapshot: true, quantity: true }
    });

    const calculatedTotal = allItems.reduce((acc, item) => {
        return acc + (Number(item.priceSnapshot) * item.quantity);
    }, 0);

    await prisma.order.update({
        where: { id: order.id },
        data: { totalAmount: calculatedTotal }
    });

    try {
        await import('./inventory.service.js').then(s => s.deductStockForOrderService(order.id, items));
    } catch (err) {
        console.error("Failed to deduct inventory:", err);
    }

    // Emit socket event with fresh data
    try {
        const { getIO } = await import('../socket.ts');
        const io = getIO();

        // Fetch the updated order with items for the socket payload
        const updatedOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: { items: true }
        });

        if (updatedOrder) {
            // If it was just created (status pending and no items until now), it's 'order:new'
            // Otherwise it's 'order:updated'. 
            // A more robust way: check if this was the first time items were added to an empty order.
            // For now, if the original order we found/created was just created (id matches the newly created one), call it 'new'
            const eventName = order.status === 'pending' && (!order.items || order.items.length === 0)
                ? 'order:new'
                : 'order:updated';

            io.emit(eventName, {
                orderId: updatedOrder.id,
                tableCode: targetTableCode,
                totalAmount: Number(updatedOrder.totalAmount),
                items: updatedOrder.items,
                status: updatedOrder.status
            });
        }
    } catch (err) {
        console.error("Socket emit failed:", err);
    }

    // Re-fetch the full order with items and table details to return to the frontend
    const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
            items: {
                include: {
                    menuItem: {
                        select: {
                            name: true,
                            price: true
                        }
                    }
                }
            },
            table: {
                select: {
                    tableCode: true
                }
            }
        }
    });

    if (!fullOrder) throw new AppError('Order not found after creation', 500);

    return {
        message: 'Order placed successfully',
        order: {
            ...fullOrder,
            orderId: fullOrder.id, // for frontend compatibility
            totalAmount: Number(fullOrder.totalAmount)
        }
    };
};

export const getOrderService = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    menuItem: {
                        select: {
                            name: true,
                            price: true,
                            isVeg: true
                        }
                    }
                }
            }
        }
    });

    if (!order) throw new AppError('Order not found', 404);

    return { order };
};
