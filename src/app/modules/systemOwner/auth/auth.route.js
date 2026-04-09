import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../../middleware/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginSchema),
  AuthController.login,
);


export const AuthRouter = router;
