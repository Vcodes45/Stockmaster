import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controller/product.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProductValidator,
  productIdValidator,
} from "../validators/index.js";

const router = Router();

// Routes
router
  .route("/")
  .get(verifyJWT, getProducts)
  .post(verifyJWT, ...createProductValidator(), validate, createProduct);

router
  .route("/:id")
  .get(verifyJWT, ...productIdValidator(), validate, getProductById);

export default router;
