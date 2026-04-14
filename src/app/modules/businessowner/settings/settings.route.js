import { Router } from "express";
import { SettingsController } from "./settings.controller.js";
import { SettingsValidation } from "./settings.validation.js";
import validateRequest from "../../../middleware/validateRequest.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { createMulterUpload } from "../../../config/multer.config.js";

const router = Router();
const upload = createMulterUpload({ folder: "avatars" });

router.patch(
  "/update-profile",
  checkAuthMiddleware("BUSINESS_OWNER"),
  upload.single("avatar"),
  validateRequest(SettingsValidation.updateProfileSchema),
  SettingsController.updateProfile,
);

router.get(
  "/my-profile",
  checkAuthMiddleware("BUSINESS_OWNER"),
  SettingsController.getProfile,
);

export const SettingsRouter = router;
