/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from './user.model';
import config from '../../config';

interface TokenPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;
}

const sendResponse = (
  res: Response,
  { statusCode, success, message, data }: ApiResponse,
) => {
  res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
  });
};

//.........................register ..................................

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password, email, userImage, role } = req.body;

    // Check if the password meets the minimum length requirement
    if (password.length < 6) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'Password must be at least 6 characters long',
        data: null,
      });
    }

    // Check if the password contains at least one uppercase letter and one lowercase letter
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message:
          'Password must contain at least one uppercase letter and one lowercase letter',
        data: null,
      });
    }

    // Check if the username is already taken
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'Username is already taken',
        data: null,
      });
    }

    const existingUserEmail = await UserModel.findOne({ email });
    if (existingUserEmail) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'This email is already in use',
        data: null,
      });
    }

    // Check if the username starts with an uppercase letter
    if (!/^[A-Z]/.test(username)) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'Username must start with an uppercase letter',
        data: null,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      userImage,
      role: role || 'user', // Set a default role if not provided
    });

    await newUser.save();

    // Generate a token for the newly registered user
    const token = jwt.sign(
      {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      config.SECRET_KEY as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'User registered successfully',
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        userImage: newUser.userImage,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

//.........................login..................................
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;

    // Fetch the user from the database based on the provided username
    const user = await UserModel.findOne({ username });

    if (user) {
      // User is found, now check the password
      if (await bcrypt.compare(password, user.password)) {
        // User is authenticated

        // Additional user data to include in the token payload
        const { _id, email, role } = user;

        // Combine user data and additional data in the payload
        const tokenPayload = { _id, username: user.username, email, role };

        // Sign the access token
        const accessToken = jwt.sign(
          tokenPayload,
          config.SECRET_KEY as string,
          { expiresIn: config.jwt_access_expires_in as string },
        );

        // Sign the refresh token
        const refreshToken = jwt.sign(
          tokenPayload,
          config.REFRESH_SECRET_KEY as string,
          { expiresIn: config.jwt_refresh_expires_in as string },
        );

        // Set the access token as a cookie
        res.cookie('token', accessToken, {
          httpOnly: true,
          maxAge: 43200000, // Access token expires in 12 hour
        });

        // Set the refresh token as a separate cookie
        res.cookie('refreshToken', refreshToken, {
          secure: config.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // Refresh token expires in 7 days
        });

        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: 'User login successful',
          data: {
            user: { _id, username: user.username, email, role },
            accessToken,
          },
        });
      } else {
        // Incorrect password
        sendResponse(res, {
          success: false,
          statusCode: 401,
          message: 'Incorrect password',
          data: null,
        });
      }
    } else {
      // User not found by username
      sendResponse(res, {
        success: false,
        statusCode: 401,
        message: 'Incorrect username',
        data: null,
      });
    }
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

//.........................logout..................................

export const logout = (req: Request, res: Response) => {
  // Clear the token cookie
  res.clearCookie('token');

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User logged out successfully',
    data: null,
  });
};

//..........................refreshToken ................................
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract the refresh token from the request cookies
    const refreshToken = req.cookies.refreshToken;

    // Verify the refresh token
    const decodedToken = jwt.verify(
      refreshToken,
      config.REFRESH_SECRET_KEY as string,
    ) as TokenPayload;

    // Fetch the user from the database based on the ID in the decoded token
    const user = await UserModel.findById(decodedToken._id);

    if (user) {
      // Additional user data to include in the new access token payload
      const { _id, username, email, role } = user;

      // Create a new access token
      const newAccessToken = jwt.sign(
        { _id, username, email, role },
        config.SECRET_KEY as string,
        { expiresIn: config.jwt_access_expires_in as string },
      );

      // Send the new access token as a cookie
      res.cookie('token', newAccessToken, {
        httpOnly: true,
        maxAge: 43200000, // New access token expires in 12 hour
      });

      // Send a response indicating success
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: { user: { _id, username, email, role }, newAccessToken },
      });
    } else {
      // User not found by ID
      sendResponse(res, {
        success: false,
        statusCode: 401,
        message: 'Invalid refresh token',
        data: null,
      });
    }
  } catch (error) {
    // Send an error response
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Error refreshing token',
      data: null,
    });
  }
};

//...............changePassword.............................
const PASSWORD_HISTORY_LIMIT = 2;

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // try {
  const { currentPassword, newPassword } = req.body;
  const userId = req.body.userId;
  //const user = await UserModel.findById(userId);
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: 'User not found',
        data: null,
      });
    }

    // Check if the current password is correct
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'Current password is incorrect',
        data: null,
      });
    }

    // Check if the new password is different from the current one
    const isNewPasswordDifferent = await bcrypt.compare(
      newPassword,
      user.password,
    );

    if (isNewPasswordDifferent) {
      return sendResponse(res, {
        success: false,
        statusCode: 400,
        message: 'New password must be different from the current password',
        data: null,
      });
    }

    // Check if the new password is not among the last N used
    const lastNPasswords = user.passwordChangeHistory.slice(
      -PASSWORD_HISTORY_LIMIT,
    );

    for (const entry of lastNPasswords) {
      const isPasswordUsed = await bcrypt.compare(newPassword, entry.password);

      if (isPasswordUsed) {
        return sendResponse(res, {
          success: false,
          statusCode: 400,
          message: `Password change failed. Ensure the new password is unique and not among the last ${PASSWORD_HISTORY_LIMIT} used (last used on ${entry.timestamp}).`,
          data: null,
        });
      }
    }

    // Hash the new password and update the user
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // Add the new password to the change history
    user.passwordChangeHistory.push({
      password: hashedNewPassword,
      timestamp: new Date(),
    });

    // Save the updated user in the database
    await user.save();

    // Respond with the updated user data
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Password changed successfully',
      data: {
        _id: user._id,
        email: user.email,
        name: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};
