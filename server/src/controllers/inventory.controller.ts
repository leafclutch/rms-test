import type { Request, Response, NextFunction } from 'express';
import * as inventoryService from '../service/inventory.service.js'; // Using .js to match service patters

// GET /admin/inventory
export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await inventoryService.getAllInventoryService();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// POST /admin/inventory/purchase
export const recordPurchase = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await inventoryService.recordPurchaseService(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// GET /admin/inventory/:itemId/transactions
export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemId } = req.params;
        if (!itemId || typeof itemId !== 'string') {
            throw new Error('Invalid item ID');
        }
        const result = await inventoryService.getInventoryTransactionsService(itemId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
