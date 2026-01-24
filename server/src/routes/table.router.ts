import express from 'express';
import * as tableController from '../controllers/table.controller.ts';
import { protect } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.get('/', protect, tableController.getAllTables);
router.delete('/:id', protect, tableController.deleteTable);
router.post('/generate-qr', tableController.generateQR);
router.post('/init', tableController.initVirtualTable);
router.get('/lookup', tableController.lookupTable);
router.get('/:id/has-active-order', protect, tableController.hasActiveOrder);

export default router;
