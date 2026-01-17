import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// then import express, routes, etc.
import express from "express";
import connectDB from './config/db.js';
import morgan from 'morgan';
import authRouter from './routes/authRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import productRouter from './routes/productRouter.js';
import paymentRouter from './routes/paymentRouter.js';
import orderRouter from './routes/orderRouter.js';
import cartRouter from './routes/cartRouter.js';
import cors from 'cors';    
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies
// Enable CORS for all routes
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
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
    console.log(`Server is running in ${currentRunMode} mode on port ${PORT}`);
});

