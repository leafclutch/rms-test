import api from "./axios";

// Fetch all customers
export const fetchCustomers = () => {
  return api.get("/credit/customers");
};

// Add a new customer
export const addCustomer = async (fullName:string, phoneNumber:string) => {
  const response = await api.post("/admin/credit-accounts", {fullName, phoneNumber});
  return response.data
};

// Update a customer
export const updateCustomer = (
  customerId: string,
  updates: Partial<{
    name: string;
    phone: string;
    email: string;
    creditLimit: number;
  }>
) => {
  return api.put(`/credit/customers/${customerId}`, updates);
};

// Delete a customer
export const deleteCustomer = (customerId: string) => {
  return api.delete(`/credit/customers/${customerId}`);
};

// Search customers
export const searchCustomers = (query: string) => {
  return api.get(`/credit/customers/search`, {
    params: { q: query }
  });
};

// Get credit history for a customer
export const getCreditHistory = (customerId: string) => {
  return api.get(`/credit/customers/${customerId}/history`);
};

// Add a credit transaction for a customer
export const addCreditTransaction = (
  customerId: string,
  transaction: {
    type: "borrow" | "repayment";
    amount: number;
    notes?: string;
  }
) => {
  return api.post(`/credit/customers/${customerId}/transactions`, transaction);
};

// Settle (repay) customer debt
export const settleDebt = (
  customerId: string,
  amount: number,
  notes?: string
) => {
  return api.post(`/credit/customers/${customerId}/settle`, { amount, notes });
};

