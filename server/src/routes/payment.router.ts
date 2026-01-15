import express from 'express';
import * as paymentController from '../controllers/payment.controller.ts';

const router = express.Router();

router.post('/cash', paymentController.payCash);
router.post('/online', paymentController.payOnline);
router.post('/mixed', paymentController.payMixed);
router.post('/credit', paymentController.payCredit);

export default router;
