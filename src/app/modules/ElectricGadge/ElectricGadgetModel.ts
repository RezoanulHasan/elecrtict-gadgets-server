// models/ElectricGadgetModel.ts
import mongoose, { Document, Types } from 'mongoose';
import { UserModel } from '../user/user.model';
import { electricGadgetValidationSchema } from '../../utils/validation';
interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
}
export interface ElectricGadget extends Document {
  name: string;
  price: number;
  image?: string;
  quantity: number;
  //releaseDate: Date;
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

  createdBy?: Types.ObjectId;
  isDeleted?: boolean;
}

const electricGadgetSchema = new mongoose.Schema<ElectricGadget>(
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
    features: [String],
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    compatibleAccessories: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your user collection is named 'User'
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

// Middleware to automatically set createdBy before saving
electricGadgetSchema.pre<ElectricGadget>('save', async function (next) {
  try {
    if (!this.createdBy) {
      // If createdBy is not set, find and set the admin user
      const user = await UserModel.findOne({ role: 'user' }).exec();

      if (!user) {
        throw new Error('user not found.');
      }

      this.createdBy = user?._id;
    }

    next();
  } catch (error) {
    // Pass the error to the error handling middleware
    next();
  }
});

export const ElectricGadgetModel = mongoose.model<ElectricGadget>(
  'ElectricGadget',
  electricGadgetSchema,
);

// Update the function name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const electricGadgetValidation = (data: Record<string, any>) =>
  electricGadgetValidationSchema.parse(data);
