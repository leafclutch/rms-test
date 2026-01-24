// payment.ts
import api from "./axios";

export interface Discount {
    type: "FIXED" | "PERCENT";
    value: number;
}

export interface PaymentPayload {
    orderId: string;
    discount?: Discount;
    cashAmount?: number;
    onlineAmount?: number;
    customerPhone?: string;
}

export const payCash = async (payload: PaymentPayload) => {
    const response = await api.post("/payments/cash", payload);
    return response.data;
};

export const payOnline = async (payload: PaymentPayload) => {
    const response = await api.post("/payments/online", payload);
    return response.data;
};

export const payMixed = async (payload: PaymentPayload) => {
    const response = await api.post("/payments/mixed", payload);
    return response.data;
};

export const payCredit = async (payload: PaymentPayload) => {
    const response = await api.post("/payments/credit", payload);
    return response.data;
};
