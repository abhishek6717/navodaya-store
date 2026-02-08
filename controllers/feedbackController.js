import Feedback from "../models/feedbackModel.js";

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, comments } = req.body;
    if (!name || !email || !rating || !comments) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }
    const feedback = await new Feedback({ name, email, rating, comments }).save();
    res.status(201).send({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in submitting feedback",
      error,
    });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting feedback",
      error,
    });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting feedback",
      error,
    });
  }
};