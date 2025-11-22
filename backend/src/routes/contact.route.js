import { Router } from "express";
import { createContact, getContacts } from "../controller/contact.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createContactValidator } from "../validators/index.js";

const router = Router();

// Routes
router
  .route("/")
  .get(verifyJWT, getContacts)
  .post(verifyJWT, createContactValidator(), validate, createContact);

export default router;