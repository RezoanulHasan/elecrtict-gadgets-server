import { Request, Response, NextFunction } from 'express';
import { IUser, UserModel } from '../modules/user/user.model';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users: IUser[] = await UserModel.find();

    if (users.length > 0) {
      // Check if there are users
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Successfully retrieved all users',
        users,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: 'No user information found',
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.params?.id;

  try {
    const user: IUser | null = await UserModel.findById(userId);

    if (user) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Successfully retrieved user by ID',
        user,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.params.id;

  try {
    // Find the user by ID and update the isDeleted field
    const deletedUser: IUser | null = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true }, // Setting isDeleted to true
      { new: true },
    );

    if (deletedUser) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
        deletedUser,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.params.id;
  const updatedUserInfo = req.body; // Assuming the request body contains updated user information

  try {
    // Find the user by ID and update the user information
    const updatedUser: IUser | null = await UserModel.findByIdAndUpdate(
      userId,
      updatedUserInfo,
      { new: true },
    );

    if (updatedUser) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'User information updated successfully',
        updatedUser,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};
export const promoteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.params.id;
  const targetRole = req.body.role; // Role to promote to (any thing)

  try {
    const user: IUser | null = await UserModel.findById(userId);

    if (user) {
      // Check if the user is a super admin before promoting
      if (req.body.user?.role === 'superAdmin') {
        // Update the user role based on the targetRole parameter
        user.role = targetRole;
        await user.save();

        res.status(200).json({
          statusCode: 200,
          success: true,
          message: `User promoted to ${targetRole} successfully`,
          user,
        });
      } else {
        res.status(403).json({
          statusCode: 403,
          success: false,
          message: 'Unauthorized Access',
          error: 'Super admin rights required to promote users',
        });
      }
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};
