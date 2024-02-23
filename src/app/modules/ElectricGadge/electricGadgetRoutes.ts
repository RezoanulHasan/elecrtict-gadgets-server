import express from 'express';
import {
  addElectricGadget,
  deleteElectricGadget,
  updateElectricGadget,
  getAllElectricGadgets,
  bulkDeleteElectricGadgets,
  getElectricGadgetById,
  addAdminElectricGadget, // Import the new controller function
} from './electricGadgetController';
import {
  addSingleElectricGadget,
  bulkSingleDeleteElectricGadgets,
  deleteSingleElectricGadget,
  getSingleAllElectricGadgets,
  getSingleElectricGadgetById,
  updateSingleElectricGadget,
} from './singleGadgetController';
import {
  authenticateToken,
  isManager,
  isSuperAdmin,
  isUser,
} from '../../middlewares/authMiddleware';

const router = express.Router();

// Create a new electric gadget
router.post(
  '/electric-gadgets',
  authenticateToken,
  isManager,
  addElectricGadget,
);
router.post(
  '/admin-electric-gadgets',
  authenticateToken,
  isSuperAdmin,
  addAdminElectricGadget,
);

// Delete an electric gadget
router.delete('/electric-gadgets/:id', deleteElectricGadget);

// Update an electric gadget
router.put('/electric-gadgets/:id', updateElectricGadget);

// Get a specific electric gadget by ID
router.get('/electric-gadgets/:id', getElectricGadgetById);

// Bulk delete electric gadgets
router.post('/bulk-delete', bulkDeleteElectricGadgets);

//Get all electric gadgets with optional filters

router.get('/electric-gadgets', getAllElectricGadgets);
//.......................single........................................
// Get all electric gadgets with optional filters

router.get(
  '/single-electric-gadgets',
  authenticateToken,
  isUser,
  getSingleAllElectricGadgets,
);

// Create a new electric gadget
router.post(
  '/single-electric-gadgets',
  authenticateToken,
  isUser,
  addSingleElectricGadget,
);

// Delete an electric gadget
router.delete(
  '/single-electric-gadgets/:id',
  authenticateToken,
  isUser,
  deleteSingleElectricGadget,
);

// Update an electric gadget
router.put(
  '/single-electric-gadgets/:id',
  authenticateToken,
  isUser,
  updateSingleElectricGadget,
);

// Get a specific electric gadget by ID
router.get(
  '/single-electric-gadgets/:id',
  authenticateToken,
  isUser,
  getSingleElectricGadgetById,
);

// Bulk delete electric gadgets
router.post(
  '/single-bulk-delete',
  authenticateToken,
  isUser,
  bulkSingleDeleteElectricGadgets,
);

export default router;
