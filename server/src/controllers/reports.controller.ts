import type { Request, Response, NextFunction } from 'express';
import * as reportsService from '../service/reports.service.js';

export const getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;
        const report = await reportsService.getSalesReportService(
            start_date as string, 
            end_date as string
        );
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
};

export const getProfitReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;
        const report = await reportsService.getProfitReportService(
            start_date as string, 
            end_date as string
        );
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
};

export const getCreditSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const summary = await reportsService.getCreditSummaryService();
        res.status(200).json(summary);
    } catch (error) {
        next(error);
    }
};
