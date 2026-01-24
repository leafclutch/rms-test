import prisma from '../config/prisma.ts';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/appError.ts';
import { TableType } from '@prisma/client';

// Helper function to extract prefix and number from table code (e.g., "T05" -> ["T", 5])
const parseTableCode = (code: string): { prefix: string; number: number } | null => {
    const match = code.match(/^([A-Z]+)(\d+)$/);
    if (!match || !match[1] || !match[2]) return null;
    return { prefix: match[1], number: parseInt(match[2], 10) };
};

// Helper function to get the next table code for a given type
const getNextTableCode = async (tableType: TableType): Promise<string> => {
    let prefix: string;
    let startNumber = 1;

    switch (tableType) {
        case 'PHYSICAL':
            prefix = 'T';
            break;
        case 'WALK_IN':
            prefix = 'W';
            break;
        case 'ONLINE':
            prefix = 'WEB';
            break;
        default:
            throw new AppError('Invalid table type', 400);
    }

    // Find all tables with this prefix
    const tables = await prisma.table.findMany({
        where: { tableType },
        select: { tableCode: true }
    });

    // Extract numbers and find the max
    let maxNumber = startNumber - 1;
    tables.forEach(table => {
        const parsed = parseTableCode(table.tableCode);
        if (parsed && parsed.prefix === prefix && parsed.number > maxNumber) {
            maxNumber = parsed.number;
        }
    });

    // No padding for single digits as requested (T1, C1, O1)
    const nextNumber = maxNumber + 1;
    return `${prefix}${nextNumber}`;
};

export const getAllTablesService = async () => {
    const tables = await prisma.table.findMany({
        select: {
            id: true,
            tableCode: true,
            tableType: true,
            isActive: true,
            createdAt: true
        }
    });

    // Custom sort function to sort by prefix and number
    const sortByTableCode = (a: any, b: any) => {
        const parsedA = parseTableCode(a.tableCode);
        const parsedB = parseTableCode(b.tableCode);

        if (!parsedA || !parsedB) return 0;

        // First sort by prefix
        if (parsedA.prefix !== parsedB.prefix) {
            return parsedA.prefix.localeCompare(parsedB.prefix);
        }

        // Then sort by number
        return parsedA.number - parsedB.number;
    };

    // Sort all tables
    const sortedTables = tables.sort(sortByTableCode);

    // Group by type
    const grouped = {
        PHYSICAL: sortedTables.filter(t => t.tableType === 'PHYSICAL'),
        WALK_IN: sortedTables.filter(t => t.tableType === 'WALK_IN'),
        ONLINE: sortedTables.filter(t => t.tableType === 'ONLINE')
    };

    return { tables: grouped };
};

export const deleteTableService = async (tableId: string) => {
    // Check if table has any orders
    const ordersCount = await prisma.order.count({
        where: { tableId }
    });

    if (ordersCount > 0) {
        throw new AppError('Cannot delete table with existing orders', 400);
    }

    await prisma.table.delete({
        where: { id: tableId }
    });

    return { message: 'Table deleted successfully' };
};

export const generateQRService = async ({ tableCode, tableType }: { tableCode?: string; tableType?: TableType }) => {
    let finalTableCode = tableCode;
    let finalTableType = tableType || 'PHYSICAL';

    // If no tableCode provided, auto-generate the next one
    if (!finalTableCode) {
        if (!tableType) {
            throw new AppError('Either tableCode or tableType must be provided', 400);
        }
        finalTableCode = await getNextTableCode(tableType);
    }

    let table = await prisma.table.findUnique({
        where: { tableCode: finalTableCode },
    });

    if (!table) {
        table = await prisma.table.create({
            data: {
                tableCode: finalTableCode,
                tableType: finalTableType,
                qrToken: uuidv4(),
            },
        });
    } else {
        // Fix for legacy data: Ensure T*, C*, O* are always PHYSICAL
        // The user requirement says "in backend all are register as Physical table"
        const upperCode = finalTableCode.toUpperCase();
        if (
            (upperCode.startsWith('T') || upperCode.startsWith('C') || upperCode.startsWith('O')) &&
            table.tableType !== 'PHYSICAL'
        ) {
            table = await prisma.table.update({
                where: { id: table.id },
                data: { tableType: 'PHYSICAL' }
            });
        }
    }

    // Format: FRONTEND_URL/menu/tableCode
    let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Remove trailing slash if exists to avoid double slashes when joining
    if (frontendUrl.endsWith('/')) {
        frontendUrl = frontendUrl.slice(0, -1);
    }

    const qrData = `${frontendUrl}/menu/${table.tableCode}`;

    // Generate QR Code as Base64 (Production Safe)
    const qrImage = await QRCode.toDataURL(qrData);

    return {
        message: 'QR Code generated successfully',
        table: {
            id: table.id,
            tableCode: table.tableCode,
            qrToken: table.qrToken,
            qrCodeData: qrData,
            qrImage,
        },
    };
};

export const getTableInfoService = async (tableCode: string) => {
    if (!tableCode) throw new AppError('Table ID/Code is required', 400);

    // Try finding by tableCode first
    const table = await prisma.table.findUnique({
        where: { tableCode },
    });

    if (!table) throw new AppError(`Table with code '${tableCode}' not found`, 404);

    if (!table.isActive) throw new AppError('Table is currently inactive', 400);

    return {
        table,
    };
};

export const hasActiveOrderService = async (tableId: string) => {
    const activeOrder = await prisma.order.findFirst({
        where: {
            tableId,
            status: {
                in: ['pending', 'preparing', 'served']
            }
        }
    });
    return { hasActiveOrder: !!activeOrder };
};

export const initVirtualTableService = async (data: { type: TableType; identifier: string }) => {
    const { type, identifier } = data;
    if (!identifier) throw new AppError('Identifier (Name or Mobile) is required', 400);

    let table = await prisma.table.findUnique({
        where: { tableCode: identifier },
    });

    if (!table) {
        table = await prisma.table.create({
            data: {
                tableCode: identifier,
                tableType: type,
                qrToken: uuidv4(),
            },
        });
    }

    return { table };
};