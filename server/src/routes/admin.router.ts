import express from 'express';
import * as adminController from '../controllers/admin.controller.ts';
import * as creditController from '../controllers/credit.controller.ts';
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

// Credit Management
// router.post('/credit-accounts', protect, creditController.createAccount);
// router.get('/credit-accounts', protect, creditController.listAccounts);
// router.get('/credit-accounts/search', protect, creditController.searchAccounts);
// router.get('/credit-accounts/:accountId', protect, creditController.getAccountDetails);
// router.patch('/credit-accounts/:accountId', protect, creditController.updateAccount);
// router.delete('/credit-accounts/:accountId', protect, creditController.deleteAccount);
// router.post('/credit-accounts/:accountId/payment', protect, creditController.recordPayment);

router.post('/credit-accounts', creditController.createAccount);
router.get('/credit-accounts', creditController.listAccounts);
router.get('/credit-accounts/search', creditController.searchAccounts);
router.get('/credit-accounts/:accountId', creditController.getAccountDetails);
router.patch('/credit-accounts/:accountId', creditController.updateAccount);
router.delete('/credit-accounts/:accountId', creditController.deleteAccount);
router.post('/credit-accounts/:accountId/payment', creditController.recordPayment);

export default router;
