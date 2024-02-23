/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from 'express';

import { JwtPayload } from 'jsonwebtoken';
import { CartModel, cartValidation } from './cartModel';
import { isValidObjectId } from 'mongoose';

export const addCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = cartValidation(req.body);
    const user = req.body?.user as JwtPayload;
    // Check if the user has permission to add this product
    if (!user) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }
    const cartData = {
      ...validatedData,
      createdCart: user?._id,
    };

    const cart = await CartModel.create(cartData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'cart created successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cartId = req.params?.id;

    // Validate cartId
    if (!isValidObjectId(cartId)) {
      res.status(400).json({ message: 'Invalid cartId format' });
      return;
    }

    const user = req.body?.user as JwtPayload;

    // Check if the user has permission to delete this product
    const cartToDelete = await CartModel.findOne({
      _id: cartId,
      createdCart: user?._id,
    });

    if (!cartToDelete) {
      res.status(403).json({ message: 'Permission denied to delete the cart' });
      return;
    }

    const cart = await CartModel.findByIdAndDelete(cartId);

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    res.status(200).json({
      message: 'Cart deleted successfully',
      deletedCart: cart,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    next(error);
  }
};

export const getCartInfo = async (req: Request, res: Response) => {
  try {
    const user = req.body?.user as JwtPayload;

    // Find electric gadgets created by the current user
    const allcarts = await CartModel.find({
      createdCart: user?._id,
    }).populate({
      path: 'createdBy',
      select: '-password -passwordChangeHistory',
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'All cart information with user info retrieved successfully',
      data: allcarts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};
export const getCartById = async (req: Request, res: Response) => {
  try {
    const cartId = req.params?.id;

    // Validate cartId
    if (!isValidObjectId(cartId)) {
      res.status(400).json({ message: 'Invalid cartId format' });
      return;
    }

    const user = req.body?.user as JwtPayload;

    // Find the cart by ID and check if it's associated with the user
    const cart = await CartModel.findOne({
      _id: cartId,
      createdCart: user?._id,
    }).populate({
      path: 'createdBy',
      select: '-password -passwordChangeHistory',
    });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found or permission denied' });
      return;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cart information retrieved successfully',
      data: cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};
export const updateCart = async (req: Request, res: Response) => {
  try {
    const cartId = req.params?.id;
    const updatedData = req.body;

    // Validate cartId
    if (!isValidObjectId(cartId)) {
      res.status(400).json({ message: 'Invalid cartId format' });
      return;
    }

    const user = req.body?.user as JwtPayload;

    // Find the cart by ID and check if it's associated with the user
    const cartToUpdate = await CartModel.findOne({
      _id: cartId,
      createdCart: user?._id,
    });

    if (!cartToUpdate) {
      res.status(404).json({ message: 'Cart not found or permission denied' });
      return;
    }

    // Update the cart with the provided data
    const updatedCart = await CartModel.findByIdAndUpdate(
      cartId,
      { $set: updatedData },
      { new: true },
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Cart updated successfully',
      data: updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};
