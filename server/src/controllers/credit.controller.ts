import type { Request, Response, NextFunction } from 'express';
import * as creditService from '../service/credit.service.ts';
import { AppError } from '../utils/appError.ts';

export const createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, phoneNumber } = req.body;
        if (!fullName || !phoneNumber) throw new AppError('Full name and phone number are required', 400);

        const result = await creditService.createCreditAccount({ fullName, phoneNumber });
        res.status(201).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const searchAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryStr = req.query.query as string;
        if (!queryStr) throw new AppError('Search query is required', 400);

        const result = await creditService.searchCreditAccounts(queryStr);
        res.status(200).json({
            status: 'success',
            results: result.length,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getAccountDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accountId = req.params.accountId as string;
        if (!accountId) throw new AppError('Account ID is required', 400);

        const result = await creditService.getCreditAccountDetails(accountId);
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const recordPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accountId = req.params.accountId as string;
        const { amount, description } = req.body;
        if (!accountId) throw new AppError('Account ID is required', 400);
        if (amount === undefined) throw new AppError('Payment amount is required', 400);

        const result = await creditService.recordDebtPayment(accountId, Number(amount), description as string | undefined);
        res.status(200).json({
            status: 'success',
            message: 'Payment recorded successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const listAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await creditService.listAllCreditAccounts();
        res.status(200).json({
            status: 'success',
            results: result.length,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accountId = req.params.accountId as string;
        const { fullName, phoneNumber } = req.body;
        const result = await creditService.updateAccount(accountId, { fullName, phoneNumber });
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accountId = req.params.accountId as string;
        await creditService.deleteAccount(accountId);
        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
