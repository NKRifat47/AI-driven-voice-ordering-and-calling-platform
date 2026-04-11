import { Router } from "express";
import { TenantsController } from "./tenants.controller.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = Router();

router.get(
  "/",
  checkAuthMiddleware(Role.SYSTEM_OWNER),
  TenantsController.getAllTenants,
);

export const TenantsRouter = router;
