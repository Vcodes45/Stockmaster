import { Router } from "express";
import { getDashboardStats } from "../controller/dashboard.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Routes
router.route("/stats").get(verifyJWT, getDashboardStats);

export default router;