import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../../middleware/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";

const router = Router();

router.post(
  "/signup",
  validateRequest(AuthValidation.signupSchema),
  AuthController.signup,
);

router.post(
  "/send-otp",
  validateRequest(AuthValidation.sendOtpSchema),
  AuthController.sendOtp,
);

router.post(
  "/verify-otp",
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthController.verifyOtp,
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginSchema),
  AuthController.login,
);

router.post("/refresh-token", AuthController.refreshAccessToken);

router.post(
  "/logout",
  checkAuthMiddleware("BUSINESS_OWNER"),
  AuthController.logout,
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.sendForgotPasswordOtp,
);

router.post(
  "/verify-forgot-password-otp",
  validateRequest(AuthValidation.verifyForgotPasswordOtpSchema),
  AuthController.verifyForgotPasswordOtp,
);

router.post(
  "/reset-password",
  checkAuthMiddleware("BUSINESS_OWNER"),
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword,
);

router.patch(
  "/change-password",
  checkAuthMiddleware("BUSINESS_OWNER"),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword,
);

export const AuthRouter = router;
