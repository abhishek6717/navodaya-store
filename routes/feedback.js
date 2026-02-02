import express from 'express';
const router = express.Router();
import feedbackController from '../controllers/feedbackController.js';

// POST /api/feedback/submit
router.post('/submit', feedbackController.submitFeedback);

export default router;

