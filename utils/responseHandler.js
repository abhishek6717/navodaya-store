/**
 * Standardized API Response Utility
 * Ensures consistent response format across all endpoints
 */

export const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    status: true,
    statusCode,
    message,
    ...(data && { data }),
  });
};

export const errorResponse = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    success: false,
    status: false,
    statusCode,
    message,
    ...(process.env.CURRENT_RUN_MODE === 'development' && error && { error }),
  });
};

// Custom error class for better error handling
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
