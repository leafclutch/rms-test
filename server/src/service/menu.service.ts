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
    isAvailable?: boolean;
    isSpecial?: boolean;
}) => {
    const { name, categoryId, price, isAvailable, isSpecial } = data;

    if (!name || !categoryId || price === undefined) {
        throw new AppError('Name, categoryId, and price are required', 400);
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
            price,
            isAvailable: isAvailable ?? true,
            isSpecial: isSpecial ?? false,
        },
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
        price?: number;
        isAvailable?: boolean;
        isSpecial?: boolean;
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

    const updatedItem = await prisma.menuItem.update({
        where: { id },
        data,
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
