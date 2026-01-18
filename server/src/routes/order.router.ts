import express from 'express';
import * as orderController from '../controllers/order.controller.ts';

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);

export default router;
