// admin.ts
import api from "./axios";

export async function getAllTablesApi() {
  const response = await api.get("/tables");
  return response.data;
}

export async function createTableApi(tableType: "PHYSICAL" | "WALK_IN" | "ONLINE", tableCode?: string) {
  const response = await api.post("/tables/generate-qr", { tableType, tableCode });
  return response.data;
}

export async function deleteTableApi(tableId: string) {
  const response = await api.delete(`/tables/${tableId}`);
  return response.data;
}

export async function generateQrApi(tableCode: string) {
  const response = await api.post("/tables/generate-qr", { tableCode });
  return response.data;
}

export async function initVirtualTableApi(type: "WALK_IN" | "ONLINE", identifier: string) {
  const response = await api.post("/tables/init", { type, identifier });
  return response.data;
}

export async function lookupTableApi(tableCode: string) {
  const response = await api.get("/tables/lookup", { params: { table: tableCode } });
  return response.data;
}

export async function hasActiveOrderApi(tableId: string) {
    const response = await api.get(`/tables/${tableId}/has-active-order`);
    return response.data;
}

