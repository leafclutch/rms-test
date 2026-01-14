import express from 'express';
import * as tableController from '../controllers/table.controller.js';

const router = express.Router();

router.post('/generate-qr', tableController.generateQR);
router.get('/lookup', tableController.lookupTable);

export default router;
