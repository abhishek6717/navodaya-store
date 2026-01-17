import express from "express";
// use the exact export names from your controllers file
import {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryController,
} from "../controllers/categoryController.js";

// use the correct relative path to your auth middleware file
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// single POST route — call the controller exported name
router.post("/create-category", requireSignIn, isAdmin, createCategoryController);

// update / delete / get routes (use controller names consistently)
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);
// public: allow listing and fetching categories without authentication
router.get("/get-categories", getAllCategoriesController);
router.get("/get-category/:id", getCategoryController);

export default router;
