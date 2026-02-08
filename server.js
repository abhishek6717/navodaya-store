import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// then import express, routes, etc.
import express from "express";
import connectDB from './config/db.js';
import morgan from 'morgan';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import productRouter from './routes/productRouter.js';
import paymentRouter from './routes/paymentRouter.js';
import orderRouter from './routes/orderRouter.js';
import cartRouter from './routes/cartRouter.js';
import feedbackRouter from './routes/feedback.js';
import errorHandler from './middleware/errorHandler.js';
import validateEnv from './utils/envValidator.js';
import logger from './utils/logger.js';    
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables on startup
validateEnv();

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

// Security Middleware
// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Middleware to parse JSON bodies
// Enable CORS for all routes
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Increase request size limits to avoid PayloadTooLargeError for large requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Use morgan with appropriate format based on environment
const morganFormat = process.env.CURRENT_RUN_MODE === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// Import routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/cart',cartRouter);
app.use('/api/v1/feedback', feedbackRouter);

// 404 Handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found',
//     path: req.path,
//   });
// });

// Error Handling Middleware (must be last)
app.use(errorHandler);

// In production, serve static files from the client build
if (process.env.CURRENT_RUN_MODE === 'production') {
  const clientBuildPath = path.join(__dirname, 'client', 'dist');
  app.use(express.static(clientBuildPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Welcome to the my ecommerce website and API');
  });
}

// port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;
const currentRunMode = process.env.CURRENT_RUN_MODE || 'development';

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running in ${currentRunMode} mode on port ${PORT}`);
});

