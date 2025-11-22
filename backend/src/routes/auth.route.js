import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendEmailVerification,
  forgotPasswordRequest,
  resetForgotPassword,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
} from "../controller/auth.controller.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
} from "../validators/index.js";
import { validate } from "../middleware/validate.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router
  .route("/register")
  .post(...userRegisterValidator(), validate, registerUser);

router.route("/login").post(...userLoginValidator(), validate, loginUser);

router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/resend-email-verification", resendEmailVerification);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password/:resetToken", resetForgotPassword);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post(
  "/change-password",
  verifyJWT,
  ...userChangeCurrentPasswordValidator(),
  validate,
  changeCurrentPassword
);

export default router;
