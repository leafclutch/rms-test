import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './config/env.ts';
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer;

export const initializeSocket = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.token;

        if (!token) {
            // Allow connection without token (for customers or initial admin load)
            return next();
        }

        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            (socket as any).user = decoded;
            next();
        } catch (err) {
            // If token is provided but invalid, we still allow connection but without user info
            console.error("Socket Auth Error:", (err as Error).message);
            next();
        }
    });

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
