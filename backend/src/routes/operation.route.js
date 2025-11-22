import { Router } from "express";
import {
  createOperation,
  getOperations,
  validateOperation,
  cancelOperation,
} from "../controller/operation.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOperationValidator,
  operationIdValidator,
} from "../validators/index.js";

const router = Router();

// Routes
router
  .route("/")
  .get(verifyJWT, getOperations)
  .post(verifyJWT, ...createOperationValidator(), validate, createOperation);

router
  .route("/:id/validate")
  .post(verifyJWT, ...operationIdValidator(), validate, validateOperation);

router
  .route("/:id/cancel")
  .post(verifyJWT, ...operationIdValidator(), validate, cancelOperation);

export default router;
