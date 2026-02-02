import FeedbackModel from '../models/feedbackModel.js';

// POST /api/feedback/submit
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, message, rating, comments } = req.body;  
    const feedback = new FeedbackModel({ name, email, message, rating, comments });
    await feedback.save();  
    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};  
export default { submitFeedback };