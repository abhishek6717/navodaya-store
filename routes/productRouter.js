import express from "express";
import formidable from "express-formidable";
import {
  createProductController,
  updateProductController,
  deleteProductController,
  getProductController,
  getAllProductsController,
  getPhoto,
  relatedProductsController,
  searchProductsController,
  getProductsByCategoryController
} from "../controllers/productController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import fs from "fs";
const router = express.Router();

// preferred: auth first, then parse upload (so unauth reqs don't get parsed)
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// alternative: parse first (only if you need req.fields in auth middleware)
// router.post("/create-product", formidable(), requireSignIn, isAdmin, createProductController);

router.put("/update-product/:id", requireSignIn, isAdmin, formidable(), updateProductController);
router.delete("/delete-product/:id", requireSignIn, isAdmin, deleteProductController);
router.get("/get-product/:id", getProductController);
router.get("/get-products", getAllProductsController);
router.get("/product-photo/:id",getPhoto)
router.get("/related-products/:productId/:categoryId", relatedProductsController);
router.get("/category-products/:categoryId", getProductsByCategoryController);
router.get("/search", searchProductsController);

export default router;