import mongoose from "mongoose";
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  comments: { type: String },
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;