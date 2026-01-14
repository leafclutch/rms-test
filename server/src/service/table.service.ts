import prisma from '../config/prisma.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { AppError } from '../utils/appError.ts';

export const generateQRService = async ({ tableCode }: { tableCode: string }) => {
    if (!tableCode) throw new AppError('Table code is required', 400);

    // Check if table exists
    let table = await prisma.table.findUnique({
        where: { tableCode },
    });

    // Create if not exists
    if (!table) {
        table = await prisma.table.create({
            data: {
                tableCode,
                tableType: 'PHYSICAL',
                qrToken: uuidv4(),
            },
        });
    }

    // Format: FRONTEND_URL/menu?table=tableCode
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrData = `${frontendUrl}/menu?table=${table.tableCode}`;

    // Generate QR Code File
    // We save it to 'public/qrcodes/[tableCode].png'
    const qrFileName = `${table.tableCode}.png`;
    const qrFilePath = path.join(process.cwd(), 'public', 'qrcodes', qrFileName);

    // Save to file
    await QRCode.toFile(qrFilePath, qrData);

    // URL to access the file
    // Assumes server is running on same host, client constructs full URL or we return relative
    const qrImage = `/public/qrcodes/${qrFileName}`;

    return {
        message: 'QR Code generated successfully',
        table: {
            id: table.id,
            tableCode: table.tableCode,
            qrToken: table.qrToken,
            qrCodeData: qrData, // Frontend can use this to generate QR
            qrImage, // URL to static image
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
