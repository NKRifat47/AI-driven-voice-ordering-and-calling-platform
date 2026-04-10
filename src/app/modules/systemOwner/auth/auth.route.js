import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../../middleware/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginSchema),
  AuthController.login,
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.sendForgotPasswordOtp,
);

router.post(
  "/verify-otp",
  validateRequest(AuthValidation.verifyForgotPasswordOtpSchema),
  AuthController.verifyForgotPasswordOtp,
);

router.post(
  "/reset-password",
  checkAuthMiddleware("SYSTEM_OWNER"),
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword,
);

router.post(
  "/change-password",
  checkAuthMiddleware("SYSTEM_OWNER"),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword,
);

export const AuthRouter = router;
