import prisma from '../config/prisma.js';
import { AppError } from '../utils/appError.js';
import { PaymentMethod, OrderStatus } from '@prisma/client';

interface DateRange {
    startDate: Date;
    endDate: Date;
}

// Helper to validate and parse dates
const parseDateRange = (start?: string, end?: string): DateRange => {
    const endDate = end ? new Date(end) : new Date();
    const startDate = start ? new Date(start) : new Date(new Date().setDate(endDate.getDate() - 30));

    // Set times to cover the full day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new AppError('Invalid date format', 400);
    }

    return { startDate, endDate };
};

// GET /admin/reports/sales
export const getSalesReportService = async (startStr?: string, endStr?: string) => {
    const { startDate, endDate } = parseDateRange(startStr, endStr);

    // Fetch paid orders in date range
    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate
            },
            status: OrderStatus.paid
        }
    });

    let totalRevenue = 0;
    let totalDiscount = 0;
    let netRevenue = 0;
    
    // Initialize breakdown
    const byPaymentMethod: Record<string, { count: number; amount: number }> = {
        CASH: { count: 0, amount: 0 },
        ONLINE: { count: 0, amount: 0 },
        MIXED: { count: 0, amount: 0 },
        CREDIT: { count: 0, amount: 0 }
    };

    for (const order of orders) {
        const amount = Number(order.totalAmount);
        const discount = Number(order.discountAmount);
        const final = Number(order.totalAmount) - discount; // Logic check: is stored totalAmount before or after discount? 
        const net = amount - discount;

        totalRevenue += amount;
        totalDiscount += discount;
        netRevenue += net;

        // Breakdown
        const method = order.paymentMethod || 'UNKNOWN';
        if (byPaymentMethod[method]) {
            byPaymentMethod[method].count++;
            byPaymentMethod[method].amount += net;
        } else {
             // Handle unexpected methods if any
             byPaymentMethod[method] = { count: 1, amount: net };
        }
    }

    return {
        period: { startDate, endDate },
        summary: {
            totalRevenue, // Gross
            totalOrders: orders.length,
            totalDiscount,
            netRevenue
        },
        byPaymentMethod
    };
};

// GET /admin/reports/profit
export const getProfitReportService = async (startStr?: string, endStr?: string) => {
    const { startDate, endDate } = parseDateRange(startStr, endStr);

    // 1. Calculate Revenue (Net)
    const salesReport = await getSalesReportService(startStr, endStr);
    const revenue = salesReport.summary.netRevenue;

    // 2. Calculate Costs (Purchase Records)
    const purchases = await prisma.purchaseRecord.findMany({
        where: {
            purchaseDate: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const totalCosts = purchases.reduce((sum, p) => sum + Number(p.totalCost), 0);

    // 3. Profit
    const profit = revenue - totalCosts;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
        period: { startDate, endDate },
        financials: {
            revenue,
            costs: totalCosts,
            profit,
            profitMargin: Number(profitMargin.toFixed(2))
        }
    };
};

// GET /admin/reports/credit
export const getCreditSummaryService = async () => {
    const customers = await prisma.customer.findMany({
        where: {
            totalDue: {
                gt: 0
            }
        },
        orderBy: {
            totalDue: 'desc'
        }
    });

    const totalOutstanding = customers.reduce((sum, c) => sum + Number(c.totalDue), 0);

    return {
        totalOutstanding,
        customersWithDebt: customers.length,
        customers: customers.map(c => ({
            id: c.id,
            fullName: c.fullName,
            phoneNumber: c.phoneNumber,
            totalDue: Number(c.totalDue),
            createdAt: c.createdAt // could serve as 'since'
        }))
    };
};
