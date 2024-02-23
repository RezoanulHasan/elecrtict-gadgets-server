/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/validation.ts
import { z } from 'zod';

export const electricGadgetValidationSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  image: z.string().optional(),
  quantity: z.number().int().positive(),
  releaseDate: z.string(),
  brand: z.string().min(1).max(100),
  modelNumber: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  operatingSystem: z.string().min(1).max(100).optional(),
  connectivity: z.string().min(1).max(100).optional(),
  powerSource: z.string().min(1).max(100).optional(),
  features: z.array(z.string()).optional(),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    })
    .optional(),
  compatibleAccessories: z.array(z.string()).optional(),

  isDeleted: z.boolean().optional(),
  createdBy: z.string().optional(),
});

export const cartValidationSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  image: z.string().optional(),
  quantity: z.number().int().positive(),
  releaseDate: z.string(),
  brand: z.string().min(1).max(100),
  modelNumber: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  operatingSystem: z.string().min(1).max(100).optional(),
  connectivity: z.string().min(1).max(100).optional(),
  powerSource: z.string().min(1).max(100).optional(),
  features: z.array(z.string()).optional(),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    })
    .optional(),
  compatibleAccessories: z.array(z.string()).optional(),
  createdCart: z.string().optional(),

  createdBy: z
    .object({
      _id: z.string(),
      username: z.string(),
      email: z.string().email(),
      userImage: z.string().url(),
      role: z.string(),
    })
    .nullable()
    .optional(),
  isDeleted: z.boolean().optional(),
});

export const SaleValidationSchema = z.object({
  productId: z.string().refine(value),
  quantity: z.number(),
  buyerName: z.string().optional(),
  phoneNumber: z.string().optional(),
  saleDate: z.date().optional(),
  price: z.number(),
  name: z.string().optional(),
  image: z.string().optional(),
  createdBy: z.string().optional(),
});

function value(arg: string): arg is any {
  throw new Error('Function not implemented.');
}
export const UserSchema = z.object({
  username: z.string().min(1).max(255),
  role: z.string(),
  userImage: z.string().optional(),
  password: z.string().min(1),
  email: z.string().min(1),
  phoneNumber: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
