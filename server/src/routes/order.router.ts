import express from 'express';
import { createOrder, getOrder } from '../controllers/order.controller.ts';

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrder);
router.patch('/:id/cancel', (req, res, next) => {
    import('../controllers/order.controller.ts').then(c => c.cancelOrder(req, res, next)).catch(next);
});
router.patch('/:id/items/:itemId', (req, res, next) => {
    import('../controllers/order.controller.ts').then(c => c.updateOrderItem(req, res, next)).catch(next);
});

export default router;
