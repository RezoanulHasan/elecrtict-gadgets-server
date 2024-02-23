import { applyFilters, FilterOptions } from '../../utils/filters';
import { Request, Response, NextFunction } from 'express';
import {
  electricGadgetValidation,
  ElectricGadgetModel,
} from './ElectricGadgetModel';
import { JwtPayload } from 'jsonwebtoken';
export const getSingleAllElectricGadgets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.body?.user as JwtPayload;

    // Find electric gadgets created by the current user
    const electricGadgets = await ElectricGadgetModel.find({
      createdBy: user?._id,
    }).populate({
      path: 'createdBy',
      select: '-password -passwordChangeHistory',
    });

    // Extract filters from the query parameters
    const filters: FilterOptions = {
      minPrice: Number(req.query.minPrice),
      maxPrice: Number(req.query.maxPrice),
      brand: req.query.brand ? String(req.query.brand) : undefined,
      modelNumber: req.query.modelNumber
        ? String(req.query.modelNumber)
        : undefined,
      category: req.query.category ? String(req.query.category) : undefined,
      operatingSystem: req.query.operatingSystem
        ? String(req.query.operatingSystem)
        : undefined,
      connectivity: req.query.connectivity
        ? String(req.query.connectivity)
        : undefined,
      powerSource: req.query.powerSource
        ? String(req.query.powerSource)
        : undefined,
      features: Array.isArray(req.query.features)
        ? req.query.features.map(String)
        : undefined,
      weight: req.query.weight ? Number(req.query.weight) : undefined,
      dimensions: {
        length: req.query.length ? Number(req.query.length) : undefined,
        width: req.query.width ? Number(req.query.width) : undefined,
        height: req.query.height ? Number(req.query.height) : undefined,
      },
      compatibleAccessories: Array.isArray(req.query.compatibleAccessories)
        ? req.query.compatibleAccessories.map(String)
        : undefined,
    };

    // Apply filters to electric gadgets (optional, based on your use case)
    const filteredElectricGadgets = applyFilters(electricGadgets, filters);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'ElectricGadgets retrieved successfully',
      data: filteredElectricGadgets,
    });
  } catch (error) {
    next(error);
  }
};
export const updateSingleElectricGadget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const electricGadgetId = req.params?.id;
    const updatedGadgetData = req.body;
    const user = req.body?.user as JwtPayload;

    // Validate input data
    if (!electricGadgetId || !updatedGadgetData) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    // Check if the user has permission to update this product
    const electricGadgetToUpdate = await ElectricGadgetModel.findOne({
      _id: electricGadgetId,
      createdBy: user?._id,
    });

    if (!electricGadgetToUpdate) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    // Update the electric gadget
    const electricGadget = await ElectricGadgetModel.findByIdAndUpdate(
      electricGadgetId,
      updatedGadgetData,
      { new: true, runValidators: true },
    );

    if (!electricGadget) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res
      .status(200)
      .json({ message: 'Data updated successfully', updatedGadgetData });
  } catch (error) {
    next(error);
  }
};

export const addSingleElectricGadget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = electricGadgetValidation(req.body);
    const user = req.body?.user as JwtPayload;

    // Check if the user has permission to add this product
    if (!user) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const electricGadgetData = {
      ...validatedData,
      createdBy: user?._id,
    };

    const electricGadget = await ElectricGadgetModel.create(electricGadgetData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'ElectricGadget created successfully',
      data: electricGadget,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteSingleElectricGadget = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const electricGadgetId = req.params?.id;
    const user = req.body?.user as JwtPayload;

    // Check if the user has permission to delete this product
    const electricGadgetToDelete = await ElectricGadgetModel.findOne({
      _id: electricGadgetId,
      createdBy: user?._id,
    });

    if (!electricGadgetToDelete) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    const electricGadget =
      await ElectricGadgetModel.findByIdAndDelete(electricGadgetId);

    if (!electricGadget) {
      res.status(404).json({ message: 'ElectricGadget not found' });
      return;
    }

    res.status(200).json({
      message: 'ElectricGadget deleted successfully',
      deleteElectricGadget: electricGadget,
    });
  } catch (error) {
    next(error);
  }
};
export const bulkSingleDeleteElectricGadgets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { electricGadgetIds } = req.body;
    const user = req.body?.user as JwtPayload;

    // Check if the user has permission to delete these products
    const result = await ElectricGadgetModel.deleteMany({
      _id: { $in: electricGadgetIds },
      createdBy: user?._id,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `${result.deletedCount} Electric Gadgets deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
export const getSingleElectricGadgetById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const electricGadgetId = req.params?.id;
    const user = req.body?.user as JwtPayload;

    if (!electricGadgetId) {
      res.status(400).json({ message: 'Invalid input data' });
      return;
    }

    // Check if the user has permission to get information about this product
    const electricGadget = await ElectricGadgetModel.findOne({
      _id: electricGadgetId,
      createdBy: user?._id,
    }).populate({
      path: 'createdBy',
      select: '-password -passwordChangeHistory',
    });

    if (!electricGadget) {
      res.status(404).json({ message: 'ElectricGadget not found' });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'ElectricGadget retrieved successfully',
      data: electricGadget,
    });
  } catch (error) {
    next(error);
  }
};
