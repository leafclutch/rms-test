import type { Request, Response, NextFunction } from 'express';
import * as orderService from '../service/order.service.js';

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
