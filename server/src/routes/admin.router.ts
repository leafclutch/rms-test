import express from 'express';
import * as adminController from '../controllers/admin.controller.ts';

const router = express.Router();
//order management
router.get('/orders/active', adminController.getActiveOrders);
router.get('/orders/history', adminController.getOrderHistory);
router.patch('/orders/:orderId/serve', adminController.serveOrder);
router.get('/orders/:orderId/bill', adminController.getBill);

// Item management
router.post('/orders/:orderId/items', adminController.addItemsToOrder);
router.patch('/orders/:orderId/items/:menuItemId/reduce', adminController.reduceOrderItem);
router.delete('/orders/:orderId/items/:menuItemId', adminController.cancelOrderItem);

export default router;
