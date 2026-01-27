// reports.ts
import api from "./axios";

export const getSalesReport = async (startDate?: string, endDate?: string) => {
    // If only one date is provided (e.g. for daily view), use it for both start and end if backend requires range,
    // OR just pass what we have.
    // Backend expects start_date and end_date query params.
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await api.get("/admin/reports/sales", { params });
    return response.data;
};

export const getProfitReport = async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get("/admin/reports/profit", { params });
    return response.data;
};

export const getCreditSummary = async () => {
    const response = await api.get("/admin/reports/credit");
    return response.data;
};
