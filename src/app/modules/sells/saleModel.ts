import mongoose, { Document, Schema, Types } from 'mongoose';
import { SaleValidationSchema } from '../../utils/validation';

export interface Sale extends Document {
  product: Types.ObjectId;
  quantity: number;
  buyerName?: string;
  phoneNumber?: string;
  saleDate?: Date;
  createdAt?: Date;
  name?: string;
  price: number;
  image?: string;
  createdBy?: Types.ObjectId;
}

const salesSchema = new Schema<Sale>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'ElectricGadget',
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your user collection is named 'User'
    },
    quantity: { type: Number, required: true },
    buyerName: { type: String },
    saleDate: { type: Date },
    createdAt: { type: Date },
    name: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    phoneNumber: { type: String },
  },

  { timestamps: true },
);

export const SalesModel = mongoose.model<Sale>('Sale', salesSchema);

// Validation function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateSale = (data: Record<string, any>) =>
  SaleValidationSchema.parse(data);
