// reports.ts
import api from "./axios";

export const getDailyReport = async (date?: string) => {
    const response = await api.get("/admin/reports/daily", { params: { date } });
    return response.data;
};

export const getCategorySalesReport = async () => {
    const response = await api.get("/admin/reports/category-sales");
    return response.data;
};
