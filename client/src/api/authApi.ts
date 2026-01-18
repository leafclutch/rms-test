import api from "./axios";

export type LoginPayload = {
  email: string;
  password: string;
};

export const loginApi = async ({ email, password }: LoginPayload) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}; 
