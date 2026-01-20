import api from "./axios";

// Fetch all customers
export const fetchCustomers = async () => {
  const response = await api.get("/admin/credit-accounts");
  return response.data;
};

// Add a customer
export const addCustomer = async (fullName: string, phoneNumber: string) => {
  const response = await api.post("/admin/credit-accounts", { fullName, phoneNumber });
  return response.data;
};

// Search customers
export const searchCustomers = async (query: string) => {
  const response = await api.get(`/admin/credit-accounts/search`, {
    params: { query }
  });
  return response.data;
};

// Get customer details (including history)
export const getCustomerDetails = async (customerId: string) => {
  const response = await api.get(`/admin/credit-accounts/${customerId}`);
  return response.data;
};

// Settle (repay) customer debt (Record Payment)
export const settleDebt = async (
  customerId: string,
  amount: number,
  notes?: string
) => {
  const response = await api.post(`/admin/credit-accounts/${customerId}/payment`, {
    amount,
    description: notes
  });
  return response.data;
};

// Add debt to customer account
export const addDebt = async (
  customerId: string,
  amount: number,
  notes?: string
) => {
  const response = await api.post(`/admin/credit-accounts/${customerId}/charge`, {
    amount,
    description: notes
  });
  return response.data;
};


// Update a customer
export const updateCustomer = (
  customerId: string,
  updates: { fullName?: string; phoneNumber?: string }
) => {
  return api.patch(`/admin/credit-accounts/${customerId}`, updates);
};

// Delete a customer
export const deleteCustomer = (customerId: string) => {
  return api.delete(`/admin/credit-accounts/${customerId}`);
};


