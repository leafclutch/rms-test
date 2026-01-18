import prisma from '../config/prisma.ts';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/appError.ts';
import { TableType } from '@prisma/client';

export const generateQRService = async ({ tableCode }: { tableCode: string }) => {
    if (!tableCode) throw new AppError('Table code is required', 400);

    let table = await prisma.table.findUnique({
        where: { tableCode },
    });

    if (!table) {
        table = await prisma.table.create({
            data: {
                tableCode,
                tableType: 'PHYSICAL',
                qrToken: uuidv4(),
            },
        });
    }

    // Format: FRONTEND_URL/menu/tableCode
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
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