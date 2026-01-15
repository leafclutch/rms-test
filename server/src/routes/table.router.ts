import express from 'express';
import * as tableController from '../controllers/table.controller.ts';

const router = express.Router();

router.post('/generate-qr', tableController.generateQR);
router.post('/init', tableController.initVirtualTable);
router.get('/lookup', tableController.lookupTable);

export default router;
