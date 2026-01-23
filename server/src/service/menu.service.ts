import type { Department } from '@prisma/client';
import prisma from '../config/prisma.ts';
import { AppError } from '../utils/appError.ts';

export const getPublicMenuService = async () => {
    const categories = await prisma.menuCategory.findMany({
        include: {
            items: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    isAvailable: true,
                    isSpecial: true,
                    isVeg: true,
                    department: true,
                },
                orderBy: {
                    name: 'asc',
                },
            },
        },
        orderBy: {
            name: 'asc',
        },
    });

    return {
        menu: categories.map(category => ({
            categoryId: category.id,
            categoryName: category.name,
            items: category.items,
        })),
    };
};

// POST /admin/menu - Create menu item
export const createMenuItemService = async (data: {
    name: string;
    categoryId: string;
    price: number;
    department: Department;
    isAvailable?: boolean;
    isSpecial?: boolean;
    isVeg?: boolean | null;
}) => {
    const { name, categoryId, price, department, isAvailable, isSpecial, isVeg } = data;

    if (!name || !categoryId || !department || price === undefined) {
        throw new AppError('Name, categoryId, department, and price are required', 400);
    }

    // Check if category exists
    const category = await prisma.menuCategory.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    const menuItem = await prisma.menuItem.create({
        data: {
            name,
            categoryId,
            price: Number(price),
            department,
            isAvailable: isAvailable !== undefined ? String(isAvailable) === 'true' : true,
            isSpecial: isSpecial !== undefined ? String(isSpecial) === 'true' : false,
            isVeg: isVeg === null ? null : (isVeg !== undefined ? (typeof isVeg === 'string' ? String(isVeg) === 'true' : Boolean(isVeg)) : true),
        } as any,
        include: {
            category: true,
        },
    });

    return {
        message: 'Menu item created successfully',
        menuItem,
    };
};

// PUT /admin/menu/:id - Update menu item
export const updateMenuItemService = async (
    id: string,
    data: {
        name?: string;
        categoryId?: string;
        department?: Department;
        price?: number;
        isAvailable?: boolean;
        isSpecial?: boolean;
        isVeg?: boolean | null;
    }
) => {
    if (!id) {
        throw new AppError('Menu item ID is required', 400);
    }

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
        where: { id },
    });

    if (!existingItem) {
        throw new AppError('Menu item not found', 404);
    }

    // If categoryId is being updated, check if it exists
    if (data.categoryId) {
        const category = await prisma.menuCategory.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new AppError('Category not found', 404);
        }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.isAvailable !== undefined) updateData.isAvailable = typeof data.isAvailable === 'string' ? String(data.isAvailable) === 'true' : Boolean(data.isAvailable);
    if (data.isSpecial !== undefined) updateData.isSpecial = typeof data.isSpecial === 'string' ? String(data.isSpecial) === 'true' : Boolean(data.isSpecial);
    if (data.isVeg !== undefined) updateData.isVeg = data.isVeg === null ? null : (typeof data.isVeg === 'string' ? String(data.isVeg) === 'true' : Boolean(data.isVeg));

    const updatedItem = await prisma.menuItem.update({
        where: { id },
        data: updateData,
        include: {
            category: true,
        },
    });

    return {
        message: 'Menu item updated successfully',
        menuItem: updatedItem,
    };
};

// DELETE /admin/menu/:id - Delete menu item
export const deleteMenuItemService = async (id: string) => {
    if (!id) {
        throw new AppError('Menu item ID is required', 400);
    }

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    orderItems: true,
                    recipes: true,
                }
            }
        }
    });

    if (!existingItem) {
        throw new AppError('Menu item not found', 404);
    }

    // If item is linked to orders, prevent deletion to preserve history
    if (existingItem._count.orderItems > 0) {
        throw new AppError(
            'Cannot delete this item because it is linked to previous orders. Please mark it as "Unavailable" instead to hide it from the menu.',
            400
        );
    }

    // If item has recipes, delete recipes first or prevent deletion
    if (existingItem._count.recipes > 0) {
        // Optionally, we could delete recipes automatically here, but better to be safe
        await prisma.itemRecipe.deleteMany({
            where: { menuItemId: id }
        });
    }

    await prisma.menuItem.delete({
        where: { id },
    });

    return {
        message: 'Menu item deleted successfully',
    };
};

// PATCH /admin/menu/:id/availability - Toggle availability
export const toggleAvailabilityService = async (id: string, isAvailable: boolean) => {
    if (!id) {
        throw new AppError('Menu item ID is required', 400);
    }

    if (typeof isAvailable !== 'boolean') {
        throw new AppError('isAvailable must be a boolean value', 400);
    }

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
        where: { id },
    });

    if (!existingItem) {
        throw new AppError('Menu item not found', 404);
    }

    const updatedItem = await prisma.menuItem.update({
        where: { id },
        data: { isAvailable },
        include: {
            category: true,
        },
    });

    return {
        message: `Menu item ${isAvailable ? 'marked as available' : 'marked as unavailable'}`,
        menuItem: updatedItem,
    };
};

// PATCH /admin/menu/:id/special - Toggle today's special
export const toggleSpecialService = async (id: string, isSpecial: boolean) => {
    if (!id) {
        throw new AppError('Menu item ID is required', 400);
    }

    if (typeof isSpecial !== 'boolean') {
        throw new AppError('isSpecial must be a boolean value', 400);
    }

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
        where: { id },
    });

    if (!existingItem) {
        throw new AppError('Menu item not found', 404);
    }

    const updatedItem = await prisma.menuItem.update({
        where: { id },
        data: { isSpecial },
        include: {
            category: true,
        },
    });

    return {
        message: `Menu item ${isSpecial ? 'marked as special' : 'unmarked as special'}`,
        menuItem: updatedItem,
    };
};

// --- CATEGORY SERVICES ---

export const getCategoriesService = async () => {
    const categories = await prisma.menuCategory.findMany({
        include: {
            _count: {
                select: { items: true }
            }
        },
        orderBy: { name: 'asc' }
    });
    return { categories };
};

export const createCategoryService = async (name: string) => {
    if (!name) throw new AppError('Category name is required', 400);

    const existing = await prisma.menuCategory.findUnique({ where: { name } });
    if (existing) throw new AppError('Category with this name already exists', 400);

    const category = await prisma.menuCategory.create({
        data: { name }
    });

    return {
        message: 'Category created successfully',
        category
    };
};

export const updateCategoryService = async (id: string, name: string) => {
    if (!id || !name) throw new AppError('ID and name are required', 400);

    const category = await prisma.menuCategory.findUnique({ where: { id } });
    if (!category) throw new AppError('Category not found', 404);

    const updated = await prisma.menuCategory.update({
        where: { id },
        data: { name }
    });

    return {
        message: 'Category updated successfully',
        category: updated
    };
};

export const deleteCategoryService = async (id: string) => {
    if (!id) throw new AppError('Category ID is required', 400);

    const category = await prisma.menuCategory.findUnique({
        where: { id },
        include: { _count: { select: { items: true } } }
    });

    if (!category) throw new AppError('Category not found', 404);

    if (category._count.items > 0) {
        throw new AppError('Cannot delete category because it contains menu items', 400);
    }

    await prisma.menuCategory.delete({ where: { id } });

    return {
        message: 'Category deleted successfully'
    };
};