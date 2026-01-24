import type { Request, Response, NextFunction } from 'express';
import * as tableService from '../service/table.service.ts';
import { AppError } from '../utils/appError.ts';

export const getAllTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await tableService.getAllTablesService();
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new AppError('Table ID is required', 400);
        }
        const result = await tableService.deleteTableService(id);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export const generateQR = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await tableService.generateQRService(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export const lookupTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { table } = req.query;
        if (typeof table !== 'string') {
            throw new AppError('Table parameter is required and must be a string', 400);
        }

        const result = await tableService.getTableInfoService(table);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export const hasActiveOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new AppError('Table ID is required', 400);
        }
        const result = await tableService.hasActiveOrderService(id);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

export const initVirtualTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await tableService.initVirtualTableService(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};
