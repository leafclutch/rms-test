import express from 'express';
import * as adminController from '../controllers/admin.controller.ts';
import { protect } from '../middleware/auth.middleware.ts';

const router = express.Router();
//order management
router.get('/orders/active', protect, adminController.getActiveOrders);
router.get('/orders/history', protect, adminController.getOrderHistory);
router.patch('/orders/:orderId/serve', protect, adminController.serveOrder);
router.get('/orders/:orderId/bill', protect, adminController.getBill);

// Item management
router.post('/orders/:orderId/items', protect, adminController.addItemsToOrder);
router.patch('/orders/:orderId/items/:menuItemId/reduce', protect, adminController.reduceOrderItem);
router.delete('/orders/:orderId/items/:menuItemId', protect, adminController.cancelOrderItem);

export default router;
