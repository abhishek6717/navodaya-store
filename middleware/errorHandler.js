/**
 * Centralized Error Handler Middleware
 * Catches and formats all errors in a consistent way
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error for debugging (use logger in production)
  console.error({
    timestamp: new Date().toISOString(),
    statusCode,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Send error response
  return res.status(statusCode).json({
    success: false,
    status: false,
    statusCode,
    message,
    ...(process.env.CURRENT_RUN_MODE === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
