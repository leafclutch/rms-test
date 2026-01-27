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

    // Fetch paid orders in date range with items
    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate
            },
            status: OrderStatus.paid
        },
        include: {
            items: {
                include: {
                    menuItem: true
                }
            }
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

    const byDepartment: Record<string, { 
        revenue: number; 
        items: number; 
        cash: number; 
        online: number; 
        credit: number;
        itemBreakdown: Record<string, { quantity: number; revenue: number }> 
    }> = {
        KITCHEN: { revenue: 0, items: 0, cash: 0, online: 0, credit: 0, itemBreakdown: {} },
        DRINK: { revenue: 0, items: 0, cash: 0, online: 0, credit: 0, itemBreakdown: {} },
        BAKERY: { revenue: 0, items: 0, cash: 0, online: 0, credit: 0, itemBreakdown: {} },
        HUKKA: { revenue: 0, items: 0, cash: 0, online: 0, credit: 0, itemBreakdown: {} }
    };

    for (const order of orders) {
        const amount = Number(order.totalAmount);
        const discount = Number(order.discountAmount);
        const net = amount - discount;

        totalRevenue += amount;
        totalDiscount += discount;
        netRevenue += net;

        // Payment Method Breakdown
        const method = order.paymentMethod || 'UNKNOWN';
        if (byPaymentMethod[method]) {
            byPaymentMethod[method].count++;
            byPaymentMethod[method].amount += net;
        } else {
             byPaymentMethod[method] = { count: 1, amount: net };
        }

        // Department Breakdown Logic
        let orderCash = Number(order.cashAmount || 0);
        let orderOnline = Number(order.onlineAmount || 0);
        let orderCredit = Number(order.creditAmount || 0);

        const orderTotalForRatio = amount > 0 ? amount : 1; 

        for(const item of order.items) {
           const dept = item.menuItem?.department || 'KITCHEN';
           
           if (!byDepartment[dept]) {
               byDepartment[dept] = { revenue: 0, items: 0, cash: 0, online: 0, credit: 0, itemBreakdown: {} };
           }

           const itemPrice = Number(item.priceSnapshot);
           const itemTotal = itemPrice * item.quantity;
           const itemName = item.menuItem?.name || 'Unknown Item';
           
           byDepartment[dept].revenue += itemTotal;
           byDepartment[dept].items += item.quantity;

           // Item Breakdown
           if (!byDepartment[dept].itemBreakdown[itemName]) {
               byDepartment[dept].itemBreakdown[itemName] = { quantity: 0, revenue: 0 };
           }
           byDepartment[dept].itemBreakdown[itemName].quantity += item.quantity;
           byDepartment[dept].itemBreakdown[itemName].revenue += itemTotal;

           // Proportional Revenue
           const itemRatio = itemTotal / orderTotalForRatio;
           byDepartment[dept].cash += orderCash * itemRatio;
           byDepartment[dept].online += orderOnline * itemRatio;
           byDepartment[dept].credit += orderCredit * itemRatio;
        }
    }

    // Query for debt settlements in the same period
    const settlements = await prisma.debtSettlement.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const totalDebtSettled = settlements.reduce((sum, s) => sum + Number(s.amount), 0);

    // Format final response to include sorted arrays for items
    const formattedByDepartment: any = {};
    for (const [dept, stats] of Object.entries(byDepartment)) {
        const sortedItems = Object.entries(stats.itemBreakdown)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue); // Sort by revenue desc
            
        formattedByDepartment[dept] = {
            ...stats,
            topItems: sortedItems
        };
        delete formattedByDepartment[dept].itemBreakdown; // Clean up intermediate object
    }

    return {
        period: { startDate, endDate },
        summary: {
            totalRevenue, // Gross Sales (Paid)
            totalOrders: orders.length,
            totalDiscount,
            netRevenue,
            totalDebtSettled
        },
        byPaymentMethod,
        byDepartment: formattedByDepartment
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
