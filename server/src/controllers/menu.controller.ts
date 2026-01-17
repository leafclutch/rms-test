import type { Request, Response, NextFunction } from 'express';
import * as menuService from '../service/menu.service.ts';

// GET /menu - Public: Fetch all menu items
export const getPublicMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await menuService.getPublicMenuService();
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

// POST /admin/menu - Create menu item
export const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await menuService.createMenuItemService(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        next(error);
    }
};

// PUT /admin/menu/:id - Update menu item
export const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid menu item ID');
        }
        const result = await menuService.updateMenuItemService(id, req.body);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

// DELETE /admin/menu/:id - Delete menu item
export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid menu item ID');
        }
        const result = await menuService.deleteMenuItemService(id);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

// PATCH /admin/menu/:id/availability - Toggle availability
export const toggleAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid menu item ID');
        }
        const { isAvailable } = req.body;
        const result = await menuService.toggleAvailabilityService(id, isAvailable);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

// PATCH /admin/menu/:id/special - Toggle today's special
export const toggleSpecial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid menu item ID');
        }
        const { isSpecial } = req.body;
        const result = await menuService.toggleSpecialService(id, isSpecial);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

// --- CATEGORY CONTROLLERS ---

// GET /menu/admin/category - Fetch all categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await menuService.getCategoriesService();
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

// POST /menu/admin/category - Create category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const result = await menuService.createCategoryService(name);
        res.status(201).json(result);
    } catch (error: any) {
        next(error);
    }
};

// PUT /menu/admin/category/:id - Update category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid category ID');
        }
        const { name } = req.body;
        const result = await menuService.updateCategoryService(id, name);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};

// DELETE /menu/admin/category/:id - Delete category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid category ID');
        }
        const result = await menuService.deleteCategoryService(id);
        res.status(200).json(result);
    } catch (error: any) {
        next(error);
    }
};
