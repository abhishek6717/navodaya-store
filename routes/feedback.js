import express from "express";
import { submitFeedback, getAllFeedback, deleteFeedback } from "../controllers/feedbackController.js";
// import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// POST submit feedback
router.post("/submit", submitFeedback);

// GET all feedback
// You can add requireSignIn and isAdmin middleware here if you want to protect this route
router.get("/all", getAllFeedback);

// DELETE feedback
router.delete("/:id", deleteFeedback);

export default router;