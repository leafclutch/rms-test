import express from 'express';
import * as paymentController from '../controllers/payment.controller.ts';
import { protect } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post('/cash',protect, paymentController.payCash);
router.post('/online',protect, paymentController.payOnline);
router.post('/mixed',protect, paymentController.payMixed);
router.post('/credit',protect, paymentController.payCredit);

export default router;
