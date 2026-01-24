import type { Request, Response, NextFunction } from 'express';
import * as orderService from '../service/order.service.ts';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await orderService.createOrUpdateOrderService(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') throw new Error('Order ID is required');
        const result = await orderService.getOrderService(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') throw new Error('Order ID is required');

        const result = await orderService.cancelOrderService(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, itemId } = req.params;
        const { action } = req.body;

        if (!id || typeof id !== 'string') throw new Error('Order ID is required');
        if (!itemId || typeof itemId !== 'string') throw new Error('Item ID is required');

        if (!action || (action !== 'increment' && action !== 'decrement')) {
            // throw new AppError('Action must be increment or decrement', 400); // Need to import AppError or just throw generic
            throw new Error('Action must be increment or decrement');
        }

        const result = await orderService.updateOrderItemQuantityService(id, itemId, action);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
