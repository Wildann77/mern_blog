// utils/verifyUser.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Import User model
import { errorHandler } from './error.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Please Login First'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get full user data from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(errorHandler(401, 'User not found'));
    }

    // Attach full user object to req
    req.user = user;
    next();
  } catch (err) {
    return next(errorHandler(401, 'Token is invalid'));
  }
};
