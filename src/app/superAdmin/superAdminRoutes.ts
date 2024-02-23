import {
  deleteUserById,
  getAllUsers,
  getUserById,
  promoteUser,
  updateUserById,
} from './superAdminController';
import express from 'express';

import { authenticateToken, isSuperAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Get all users
router.get('/users', getAllUsers);

// Get user by ID
router.get('/user/:id', getUserById);

// Delete user by ID
router.delete('/user/:id', authenticateToken, isSuperAdmin, deleteUserById);

// Update user by ID
router.put('/user/:id', updateUserById);

// Promote user by ID (requires authentication and super admin privileges)
router.post('/promote/:id', authenticateToken, isSuperAdmin, promoteUser);

export default router;
