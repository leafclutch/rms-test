// admin.ts
import api from "./axios";

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

