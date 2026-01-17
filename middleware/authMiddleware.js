import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const extractToken = (authHeader) => {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.split(" ")[1];
  return authHeader; // fallback if client sends raw token
};

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers.authorization;
    const token = extractToken(authHeader);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

export const requireSignIn = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers.authorization;
    const token = extractToken(authHeader);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.isAdmin !== true) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
