import prisma from "../../../prisma/client.js";

const getMySubscriptionFromDB = async (userId) => {
  // Find the business owned by this user
  const business = await prisma.business.findFirst({
    where: { owner_id: userId },
  });

  if (!business) {
    return null;
  }

  // Find active subscription for this business
  const subscription = await prisma.subscriptions.findFirst({
    where: {
      business_id: business.id,
      status: "active",
    },
    include: {
      plan: true,
    },
  });

  return subscription;
};

const getAllPlansFromDB = async () => {
  return await prisma.plans.findMany({
    orderBy: {
      priceMonthly: "asc",
    },
  });
};

const getBillingHistoryFromDB = async (userId) => {
  const business = await prisma.business.findFirst({
    where: { owner_id: userId },
  });

  if (!business) {
    return [];
  }

  const invoices = await prisma.invoices.findMany({
    where: {
      business_id: business.id,
    },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return invoices;
};

export const SubscriptionService = {
  getMySubscriptionFromDB,
  getAllPlansFromDB,
  getBillingHistoryFromDB,
};
