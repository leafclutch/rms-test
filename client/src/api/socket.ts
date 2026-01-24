import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

export const connectSocket = (token: string) => {
    if (token) {
        socket.auth = { token };
        socket.disconnect().connect();
    }
};

socket.on("connect", () => {
    // console.log("Connected to socket server:", socket.id);
});

socket.on("disconnect", () => {
    // console.log("Disconnected from socket server");
});
