import { Router } from "express";
import { OtpRouter } from "../modules/otp/otp.route.js";
import { AuthRouter as SystemOwnerAuthRouter } from "../modules/systemOwner/auth/auth.route.js";
import { TenantsRouter as SystemOwnerTenantsRouter } from "../modules/systemOwner/tenants/tenants.route.js";


export const router = Router();
const moduleRoutes = [
  {
    path: "/otp",
    route: OtpRouter,
  },
  {
    path: "/system-owner/auth",
    route: SystemOwnerAuthRouter,
  },
  {
    path: "/system-owner/tenants",
    route: SystemOwnerTenantsRouter,
  },

];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
