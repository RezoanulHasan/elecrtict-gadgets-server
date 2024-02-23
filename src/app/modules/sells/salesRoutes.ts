// sales.route.ts
import express, { Router } from 'express';
import {
  createManagerSale,
  createSale,
  createSuperAdminSale,
  getAllSalesWithUserInfo,
  getSalesHistory,
  getSingleSalesHistory,
} from './salesController';
import {
  authenticateToken,
  isManager,
  isSuperAdmin,
  isUser,
} from '../../middlewares/authMiddleware';

const router: Router = express.Router();

// Create a sale
router.post('/sell', authenticateToken, isUser, createSale);
// Create a sale
router.post('/sells', authenticateToken, isManager, createManagerSale);
router.post(
  '/admin-sell',
  authenticateToken,
  isSuperAdmin,
  createSuperAdminSale,
);
// Create a sale

router.get('/sell', getAllSalesWithUserInfo);
// Get sales history
router.get('/sales-history/:period', getSalesHistory);
// Get single history
router.get(
  '/single-sales-history/:period',
  authenticateToken,
  isUser,
  getSingleSalesHistory,
);

export default router;
