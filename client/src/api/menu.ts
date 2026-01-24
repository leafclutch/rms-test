// Menu API functions for add, edit, update, delete using exios (local axios instance)

import api from './axios';

// Add menu item
export async function addMenuItem(data: any): Promise<any> {
  const response = await api.post('/menu/admin', data);
  return response.data;
}

// Update/Edit menu item by ID
export async function updateMenuItem(id: string, data: any): Promise<any> {
  const response = await api.put(`/menu/admin/${id}`, data);
  return response.data;
}

// Delete menu item by ID
export async function deleteMenuItem(id: string): Promise<void> {
  await api.delete(`/menu/admin/${id}`);
}

// Fetch all menu items
export async function fetchMenuItems(): Promise<any[]> {
  const response = await api.get('/menu');
  return response.data.menu || [];
}

// --- CATEGORY API ---

// Fetch all categories
export async function fetchCategories(): Promise<any[]> {
  const response = await api.get('/menu/admin/category');
  return response.data.categories || [];
}

// Add category
export async function addCategory(name: string): Promise<any> {
  const response = await api.post('/menu/admin/category', { name });
  return response.data;
}

// Update category
export async function updateCategory(id: string, name: string): Promise<any> {
  const response = await api.put(`/menu/admin/category/${id}`, { name });
  return response.data;
}

// Delete category
export async function deleteCategory(id: string): Promise<any> {
  const response = await api.delete(`/menu/admin/category/${id}`);
  return response.data;
}

// Update menu item availability (toggle isAvailable by ID)
export async function updateMenuItemAvailability(id: string, isAvailable: boolean): Promise<any> {
  const response = await api.patch(`/menu/admin/${id}/availability`, { isAvailable });
  return response.data;
}

// Toggle the "isSpecial" flag for a menu item by ID
export async function toggleSpecial(id: string, isSpecial: boolean): Promise<any> {
  const response = await api.patch(`/menu/admin/${id}/special`, { isSpecial });
  return response.data;
}




