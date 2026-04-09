import { Router } from "express";
import { OtpRouter } from "../modules/otp/otp.route.js";
import { AuthRouter as SystemOwnerAuthRouter } from "../modules/systemOwner/auth/auth.route.js";


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

];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
