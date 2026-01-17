import express from 'express';
import * as menuController from '../controllers/menu.controller.ts';
import { protect } from '../middleware/auth.middleware.ts';

const router = express.Router();

// Public route - No authentication required
router.get('/', menuController.getPublicMenu);

// Admin routes - Authentication required
router.post('/admin', protect, menuController.createMenuItem);
router.put('/admin/:id', protect, menuController.updateMenuItem);
router.delete('/admin/:id', protect, menuController.deleteMenuItem);
router.patch('/admin/:id/availability', protect, menuController.toggleAvailability);
router.patch('/admin/:id/special', protect, menuController.toggleSpecial);

// Admin Category routes
router.get('/admin/category', protect, menuController.getCategories);
router.post('/admin/category', protect, menuController.createCategory);
router.put('/admin/category/:id', protect, menuController.updateCategory);
router.delete('/admin/category/:id', protect, menuController.deleteCategory);

export default router;