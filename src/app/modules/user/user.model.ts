import mongoose, { Schema, Document } from 'mongoose';
import { UserSchema as ValidationUserSchema } from '../../utils/validation';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  userImage?: string;
  role: 'superAdmin' | 'user' | 'manager';
  passwordChangeHistory: { password: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userImage: { type: String },
    phoneNumber: { type: String },

    role: {
      type: String,
      enum: ['user', 'manager', 'superAdmin'],
      default: 'user',
    },

    passwordChangeHistory: [
      {
        password: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Add timestamps option as an object
  },
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateUser = (data: Record<string, any>) =>
  ValidationUserSchema.parse(data);
