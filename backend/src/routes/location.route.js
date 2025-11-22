import { Router } from "express";
import { createLocation, getLocations } from "../controller/location.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createLocationValidator } from "../validators/index.js";

const router = Router();

// Routes
router
  .route("/")
  .get(verifyJWT, getLocations)
  .post(verifyJWT, createLocationValidator(), validate, createLocation);

export default router;