import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js'; // Check extension
import { isAdmin } from '../middleware/auth.middleware.js'; 
import { protect } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/',protect,inventoryController.getInventory);
router.post('/purchase',protect, inventoryController.recordPurchase);
router.get('/:itemId/transactions',protect, inventoryController.getTransactions);

export default router;
