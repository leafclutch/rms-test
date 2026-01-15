import type { Request, Response, NextFunction } from 'express';
import * as paymentService from '../service/payment.service.ts';
import { AppError } from '../utils/appError.ts';

export const payCash = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, discount, cashAmount } = req.body;
        if (!orderId) throw new AppError('Order ID is required', 400);

        const result = await paymentService.processCashPayment({ orderId, discount, cashAmount });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const payOnline = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, discount } = req.body;
        if (!orderId) throw new AppError('Order ID is required', 400);

        const result = await paymentService.processOnlinePayment({ orderId, discount });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const payMixed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, discount, cashAmount, onlineAmount } = req.body;
        if (!orderId) throw new AppError('Order ID is required', 400);

        const result = await paymentService.processMixedPayment({ orderId, discount, cashAmount, onlineAmount });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const payCredit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, customerPhone } = req.body;
        if (!orderId) throw new AppError('Order ID is required', 400);

        const result = await paymentService.processCreditPayment({ orderId, customerPhone });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
