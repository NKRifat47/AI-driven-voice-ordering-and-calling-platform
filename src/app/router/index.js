import { Router } from "express";
import { OtpRouter } from "../modules/otp/otp.route.js";
import { AuthRouter as SystemOwnerAuthRouter } from "../modules/systemOwner/auth/auth.route.js";
import { TenantsRouter as SystemOwnerTenantsRouter } from "../modules/systemOwner/tenants/tenants.route.js";
import { SubscriptionBillingRouter } from "../modules/systemOwner/subscription_billing/subscription_billing.route.js";
import { SettingsRouter } from "../modules/systemOwner/settings/settings.route.js";
import { AuthRouter as BusinessOwnerAuthRouter } from "../modules/businessowner/auth/auth.route.js";
import { SettingsRouter as BusinessOwnerSettingsRouter } from "../modules/businessowner/settings/settings.route.js";
import { SubscriptionRouter as BusinessOwnerSubscriptionRouter } from "../modules/businessowner/subscription/subscription.route.js";
import { PaymentRouter as BusinessOwnerPaymentRouter } from "../modules/businessowner/payment/payment.route.js";

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

  {
    path: "/system-owner/subscription-billing",
    route: SubscriptionBillingRouter,
  },

  {
    path: "/system-owner/settings",
    route: SettingsRouter,
  },

  // Business Owner Routes
  {
    path: "/business-owner/auth",
    route: BusinessOwnerAuthRouter,
  },
  {
    path: "/business-owner/settings",
    route: BusinessOwnerSettingsRouter,
  },
  {
    path: "/business-owner/subscription",
    route: BusinessOwnerSubscriptionRouter,
  },
  {
    path: "/business-owner/payment",
    route: BusinessOwnerPaymentRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
