import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from "../validators/index.js";

const router = Router();

// Routes
router
  .route("/")
  .get(verifyJWT, getCategories)
  .post(verifyJWT, createCategoryValidator(), validate, createCategory);

router
  .route("/:id")
  .get(verifyJWT, categoryIdValidator(), validate, getCategoryById)
  .put(verifyJWT, categoryIdValidator(), updateCategoryValidator(), validate, updateCategory)
  .delete(verifyJWT, categoryIdValidator(), validate, deleteCategory);

export default router;
