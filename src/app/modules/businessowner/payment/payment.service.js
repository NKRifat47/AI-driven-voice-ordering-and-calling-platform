import Stripe from "stripe";
import prisma from "../../../prisma/client.js";
import DevBuildError from "../../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeCheckoutSession = async (user, planId, billingCycle) => {
  // Find business for the user
  const business = await prisma.business.findFirst({
    where: { owner_id: user.id },
  });

  if (!business) {
    throw new DevBuildError(
      "Business not found for this user",
      StatusCodes.NOT_FOUND,
    );
  }

  // Find the plan
  const plan = await prisma.plans.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new DevBuildError("Plan not found", StatusCodes.NOT_FOUND);
  }

  // Determine Stripe Price ID
  const priceId =
    billingCycle === "yearly"
      ? plan.stripeYearlyPriceId
      : plan.stripeMonthlyPriceId;

  if (!priceId) {
    throw new DevBuildError(
      `Stripe price ID for ${billingCycle} is not configured for this plan`,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  // Frontend Success/Cancel URLs
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const successUrl = `${frontendUrl}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${frontendUrl}/dashboard/subscription`;

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    client_reference_id: business.id,
    customer_email: user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      businessId: business.id,
      planId: plan.id,
      billingCycle: billingCycle,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return { url: session.url };
};

const processStripeWebhook = async (event) => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const businessId =
      session.metadata?.businessId || session.client_reference_id;
    const planId = session.metadata?.planId;

    // We get billing cycle from metadata, or we can fetch subscription details from stripe
    const billingCycle = session.metadata?.billingCycle || "monthly";

    if (businessId && planId) {
      // Deactivate any existing active subscription
      await prisma.subscriptions.updateMany({
        where: { business_id: businessId, status: "active" },
        data: { status: "canceled" },
      });

      // Calculate end date based on billing cycle
      const startDate = new Date();
      const endDate = new Date(startDate);
      if (billingCycle === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Create new active subscription
      const newSubscription = await prisma.subscriptions.create({
        data: {
          business_id: businessId,
          plan_id: planId,
          status: "active",
          start_date: startDate,
          end_date: endDate,
        },
      });

      // Get plan price to record invoice
      const plan = await prisma.plans.findUnique({ where: { id: planId } });
      const amount =
        billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

      // Create an invoice record
      await prisma.invoices.create({
        data: {
          business_id: businessId,
          subscription_id: newSubscription.id,
          invoice_no: session.invoice || `INV-${Date.now()}`,
          amount: amount,
          status: "paid", // Mark as paid
          billing_cycle: billingCycle,
        },
      });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
  }
};

export const PaymentService = {
  createStripeCheckoutSession,
  processStripeWebhook,
};
