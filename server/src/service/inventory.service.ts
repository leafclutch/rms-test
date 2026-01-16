import prisma from '../config/prisma.js';
import { AppError } from '../utils/appError.ts';

interface PurchaseInput {
    itemName: string;
    quantity: number;
    unit?: string;
    costPerUnit?: number;
    totalCost?: number;
    supplierName?: string;
    supplierPhone?: string;
}

// GET /admin/inventory
export const getAllInventoryService = async () => {
    return await prisma.inventoryItem.findMany({
        orderBy: { name: 'asc' }
    });
};

// POST /admin/inventory/purchase
export const recordPurchaseService = async (data: PurchaseInput) => {
    const { itemName, quantity, unit, costPerUnit, totalCost, supplierName, supplierPhone } = data;

    // 1. Create Purchase Record (for history/auditing costs)
    const purchase = await prisma.purchaseRecord.create({
        data: {
            itemName,
            quantity: quantity,
            unit: unit || 'pcs',
            costPerUnit: costPerUnit || 0,
            totalCost: totalCost || 0,
            supplierName: supplierName ?? null,
            supplierPhone: supplierPhone ?? null
        }
    });

    let item = await prisma.inventoryItem.findUnique({
        where: { name: itemName }
    });

    if (item) {
        // Update stock
        item = await prisma.inventoryItem.update({
            where: { id: item.id },
            data: {
                currentStock: { increment: quantity }
            }
        });
    } else {
        // Create new item
        item = await prisma.inventoryItem.create({
            data: {
                name: itemName,
                currentStock: quantity,
                unit: unit || 'pcs',
                minimumStock: 5 // Updated later if needed
            }
        });
    }

    await prisma.inventoryTransaction.create({
        data: {
            inventoryItemId: item.id,
            type: 'PURCHASE',
            quantity: quantity,
            referenceId: purchase.id
        }
    });

    return { message: 'Purchase recorded and stock updated', purchaseId: purchase.id, currentStock: item.currentStock };
};

// GET /admin/inventory/:itemId/transactions
export const getInventoryTransactionsService = async (itemId: string) => {
    return await prisma.inventoryTransaction.findMany({
        where: { inventoryItemId: itemId },
        orderBy: { createdAt: 'desc' },
        include: { inventoryItem: true }
    });
};

// Helper: Deduct Stock (called by Order Service)
export const deductStockForOrderService = async (orderId: string, orderItems: any[]) => {
    for (const item of orderItems) {
        // Find Recipe
        const recipe = await prisma.itemRecipe.findFirst({
            where: { menuItemId: item.menuItemId }
        });

        if (recipe) {
            // Deduct Stock
             const deductAmount = recipe.quantityRequired * item.quantity;
             
             // Update Stock
             await prisma.inventoryItem.update({
                 where: { id: recipe.inventoryItemId },
                 data: { currentStock: { decrement: deductAmount } }
             });

             // Record Transaction
             await prisma.inventoryTransaction.create({
                 data: {
                     inventoryItemId: recipe.inventoryItemId,
                     type: 'ORDER_CONSUMPTION',
                     quantity: -deductAmount, 
                     referenceId: orderId
                 }
             });
        }
    }
};
