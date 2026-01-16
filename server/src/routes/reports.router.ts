import express from 'express';
import * as reportsController from '../controllers/reports.controller.js';
 import { protect} from '../middleware/auth.middleware.js'; 

const router = express.Router();


router.get('/sales',protect, reportsController.getSalesReport);
router.get('/profit',protect, reportsController.getProfitReport);
router.get('/credit',protect, reportsController.getCreditSummary);

export default router;
