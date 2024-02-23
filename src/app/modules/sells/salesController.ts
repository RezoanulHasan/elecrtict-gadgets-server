/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// sales.controller.ts

import { JwtPayload } from 'jsonwebtoken';

import { SalesModel } from './saleModel';
import { Request, Response } from 'express';
import { CartModel } from '../Cart/cartModel';
import { ElectricGadgetModel } from '../ElectricGadge/ElectricGadgetModel';
//creat sell for enquire  with user
export const createSale = async (req: Request, res: Response) => {
  try {
    const {
      name,
      productId,
      quantity,
      buyerName,
      saleDate,
      phoneNumber,
      price,
      image,
    } = req.body;
    const user = req.body?.user as JwtPayload;

    // Check if the product exists and has enough stock
    const product = await CartModel.findById(productId);
    if (!product || product?.quantity < quantity) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid product or insufficient stock.',
      });
    }

    // Update product stock
    product.quantity -= quantity;

    // Check if the updated quantity is zero and remove the product from the inventory
    if (product?.quantity === 0) {
      await CartModel.findOneAndDelete({ _id: productId }).exec();
      // also remove the product from ElectricGadgetModel
      await ElectricGadgetModel.findOneAndDelete({ _id: productId }).exec();
    } else {
      await product.save();
    }

    const createdAt = new Date();

    // Create a sale record with saleDate
    const sale = await SalesModel?.create({
      product: productId,
      quantity,
      buyerName,
      phoneNumber,
      image,
      name,
      price,
      saleDate: createdAt,
      createdBy: user?._id,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Product sold successfully',
      data: {
        product: sale.product,
        quantity: sale.quantity,
        buyerName: sale.buyerName,
        ProductName: sale.name,
        phoneNumber: sale.phoneNumber,
        image: sale.image,
        price: sale.price,
        _id: sale._id,
        saleDate: sale.createdAt,
        createdBy: user?._id,
        __v: sale.__v,
      },
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

//creat sell for Manager
export const createManagerSale = async (req: Request, res: Response) => {
  try {
    const {
      name,
      productId,
      quantity,
      buyerName,
      saleDate,
      phoneNumber,
      price,
      image,
    } = req.body;
    const user = req.body?.user as JwtPayload;

    // Check if the product exists and has enough stock
    const product = await ElectricGadgetModel.findById(productId);
    if (!product || product?.quantity < quantity) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid product or insufficient stock.',
      });
    }

    // Update product stock
    product.quantity -= quantity;

    // Check if the updated quantity is zero and remove the product from the inventory
    if (product?.quantity === 0) {
      await ElectricGadgetModel.findOneAndDelete({ _id: productId }).exec();
    } else {
      await product.save();
    }

    const createdAt = new Date();

    // Create a sale record with saleDate
    const sale = await SalesModel?.create({
      product: productId,
      quantity,
      buyerName,
      phoneNumber,
      image,
      name,
      price,
      saleDate: createdAt,
      createdBy: user?._id,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Product sold successfully',
      data: {
        product: sale.product,
        quantity: sale.quantity,
        buyerName: sale.buyerName,
        ProductName: sale.name,
        phoneNumber: sale.phoneNumber,
        image: sale.image,
        price: sale.price,
        _id: sale._id,
        saleDate: sale.createdAt,
        createdBy: user?._id,
        __v: sale.__v,
      },
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
export const createSuperAdminSale = async (req: Request, res: Response) => {
  try {
    const {
      name,
      productId,
      quantity,
      buyerName,
      saleDate,
      phoneNumber,
      price,
      image,
    } = req.body;
    const user = req.body?.user as JwtPayload;

    // Check if the product exists and has enough stock
    const product = await ElectricGadgetModel.findById(productId);
    if (!product || product?.quantity < quantity) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid product or insufficient stock.',
      });
    }

    // Update product stock
    product.quantity -= quantity;

    // Check if the updated quantity is zero and remove the product from the inventory
    if (product?.quantity === 0) {
      await ElectricGadgetModel.findOneAndDelete({ _id: productId }).exec();
    } else {
      await product.save();
    }

    const createdAt = new Date();

    // Create a sale record with saleDate
    const sale = await SalesModel?.create({
      product: productId,
      quantity,
      buyerName,
      phoneNumber,
      image,
      name,
      price,
      saleDate: createdAt,
      createdBy: user?._id,
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Product sold successfully',
      data: {
        product: sale.product,
        quantity: sale.quantity,
        buyerName: sale.buyerName,
        ProductName: sale.name,
        phoneNumber: sale.phoneNumber,
        image: sale.image,
        price: sale.price,
        _id: sale._id,
        saleDate: sale.createdAt,
        createdBy: user?._id,
        __v: sale.__v,
      },
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

export const getAllSalesWithUserInfo = async (req: Request, res: Response) => {
  try {
    // Retrieve all sell records from the database and populate the createdBy field with user information
    const allSales = await SalesModel.find().populate({
      path: 'createdBy',
      select: '-password -passwordChangeHistory', // Exclude password and passwordChangeHistory fields
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'All sell information with user info retrieved successfully',
      data: allSales,
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

export const getSalesHistory = async (req: Request, res: Response) => {
  try {
    const { period } = req.params;

    let startDate, endDate;

    // Calculate start and end dates based on the specified period
    switch (period) {
      case 'weekly':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'daily':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'monthly':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'yearly':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Invalid period specified.',
        });
    }

    const salesHistory = await SalesModel.find({
      saleDate: { $gte: startDate, $lte: endDate },
    }).exec();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Sales history fetched successfully',
      data: salesHistory,
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

export const getSingleSalesHistory = async (req: Request, res: Response) => {
  try {
    const { period } = req.params;

    let startDate, endDate;

    // Calculate start and end dates based on the specified period
    switch (period) {
      case 'weekly':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'daily':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'monthly':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'yearly':
        endDate = new Date();
        startDate = new Date(endDate);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Invalid period specified.',
        });
    }

    // Assuming req.body.user contains the user information
    const user = req.body?.user as JwtPayload;

    const salesHistory = await SalesModel.find({
      saleDate: { $gte: startDate, $lte: endDate },
      createdBy: user?._id,
    }).exec();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Sales history fetched successfully',
      data: salesHistory,
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
