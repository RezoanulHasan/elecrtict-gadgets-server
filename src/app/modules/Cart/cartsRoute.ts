import express, { Router } from 'express';
import { authenticateToken, isUser } from '../../middlewares/authMiddleware';
import {
  addCart,
  deleteCartInfo,
  getCartById,
  getCartInfo,
  updateCart,
} from './cartController';

const router: Router = express.Router();

// Create a cart
router.post('/cart', authenticateToken, isUser, addCart);
// get all cart

router.get('/cart', authenticateToken, isUser, getCartInfo);
// get all for update

router.put('/cart/:id', authenticateToken, isUser, updateCart);
// get all cart by id
router.get('/cart/:id', authenticateToken, isUser, getCartById);
// Delete an electric gadget
router.delete('/cart/:id', authenticateToken, isUser, deleteCartInfo);

export default router;
