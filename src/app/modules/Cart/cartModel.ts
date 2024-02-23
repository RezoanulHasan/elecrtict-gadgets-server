// models/ElectricGadgetModel.ts
import mongoose, { Document, Types, Schema } from 'mongoose';
import { UserModel } from '../user/user.model';
import { cartValidationSchema } from '../../utils/validation';

interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface Cart extends Document {
  name: string;
  price: number;
  image?: string;
  quantity: number;
  releaseDate: string;
  brand: string;
  modelNumber: string;
  category: string;
  operatingSystem?: string;
  connectivity?: string;
  powerSource?: string;
  features?: string[];
  weight?: number;
  dimensions?: Dimensions;
  compatibleAccessories?: string[];
  createdCart?: Types.ObjectId;
  isDeleted: boolean;

  createdBy?: {
    _id: string;
    username: string;
    email: string;
    userImage: string;
    role: string;
  } | null;
}

const cartSchema = new Schema<Cart>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true },
    releaseDate: { type: String, required: true },
    brand: { type: String, required: true },
    modelNumber: { type: String, required: true },
    category: { type: String, required: true },
    operatingSystem: String,
    connectivity: String,
    powerSource: String,
    features: { type: [String], default: [] },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    compatibleAccessories: [String],
    createdCart: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming your user collection is named 'User'
    },
    createdBy: {
      _id: { type: String },
      username: { type: String },
      email: { type: String },
      userImage: { type: String },
      role: { type: String },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Add timestamps option here
  },
);

// Middleware to automatically set createdCart before saving
cartSchema.pre<Cart>('save', async function (next) {
  try {
    if (!this.createdCart) {
      // If createdCart is not set, find and set the admin user
      const user = await UserModel.findOne({ role: 'user' }).exec();

      if (!user) {
        throw new Error('User not found.');
      }

      this.createdCart = user?._id;
    }

    next();
  } catch (error) {
    // Pass the error to the error handling middleware
    next();
  }
});

export const CartModel = mongoose.model<Cart>('Cart', cartSchema);

// Update the function name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cartValidation = (data: Record<string, any>) =>
  cartValidationSchema.parse(data);
