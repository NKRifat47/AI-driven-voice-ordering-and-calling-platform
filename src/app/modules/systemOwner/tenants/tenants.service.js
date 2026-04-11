import { StatusCodes } from "http-status-codes";
import prisma from "../../../prisma/client.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const getAllTenantsFromDB = async () => {
  const tenants = await prisma.business.findMany({
    include: {
      subscriptions: {
        orderBy: {
          end_date: "desc",
        },
        take: 1,
        include: {
          plan: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Format the response for the UI
  const formattedTenants = tenants.map((tenant) => {
    const latestSubscription = tenant.subscriptions[0] || null;
    return {
      id: tenant.id,
      name: tenant.name,
      plan: latestSubscription ? latestSubscription.plan.name : "No Plan",
      status: tenant.status,
      expiry_date: latestSubscription ? latestSubscription.end_date : null,
      created_at: tenant.created_at,
    };
  });

  return formattedTenants;
};

const getTenantByIdFromDB = async (id) => {
  const tenant = await prisma.business.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      },
      invoices: {
        orderBy: {
          created_at: "desc",
        },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
      },
    },
  });

  if (!tenant) {
    throw new DevBuildError("Tenant not found", StatusCodes.NOT_FOUND);
  }

  // Format billing history
  const billingHistory = tenant.invoices.map((invoice) => ({
    date: invoice.created_at,
    plan: invoice.subscription?.plan?.name || "N/A",
    invoice_no: invoice.invoice_no,
    amount: invoice.amount,
    status: invoice.status,
  }));

  return {
    id: tenant.id,
    name: tenant.name,
    email: tenant.owner?.email,
    joined_date: tenant.created_at,
    status: tenant.status,
    billing_history: billingHistory,
  };
};

const updateTenantInDB = async (id, payload) => {
  const result = await prisma.business.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteTenantFromDB = async (id) => {
  // 1. Fetch training sessions and calls to get their IDs for sub-deletion
  const trainingSessions = await prisma.training_sessions.findMany({
    where: { business_id: id },
    select: { id: true },
  });
  const sessionIds = trainingSessions.map((s) => s.id);

  const calls = await prisma.calls.findMany({
    where: { business_id: id },
    select: { id: true },
  });
  const callIds = calls.map((c) => c.id);

  // 2. Perform transactional deletion
  return await prisma.$transaction(async (tx) => {
    // Delete files in sessions
    if (sessionIds.length > 0) {
      await tx.training_files.deleteMany({
        where: { session_id: { in: sessionIds } },
      });
    }

    // Delete call data
    if (callIds.length > 0) {
      await tx.call_messages.deleteMany({
        where: { call_id: { in: callIds } },
      });
      await tx.call_summaries.deleteMany({
        where: { call_id: { in: callIds } },
      });
    }

    // Delete business-related records
    await tx.training_sessions.deleteMany({ where: { business_id: id } });
    await tx.calls.deleteMany({ where: { business_id: id } });
    await tx.invoices.deleteMany({ where: { business_id: id } });
    await tx.subscriptions.deleteMany({ where: { business_id: id } });
    await tx.api_keys.deleteMany({ where: { business_id: id } });
    await tx.faqs.deleteMany({ where: { business_id: id } });
    await tx.ai_samples.deleteMany({ where: { business_id: id } });
    await tx.usage_logs.deleteMany({ where: { business_id: id } });
    await tx.user_business.deleteMany({ where: { business_id: id } });
    await tx.business_settings.deleteMany({ where: { business_id: id } });
    await tx.integrations.deleteMany({ where: { business_id: id } });

    // Finally delete the business
    return await tx.business.delete({
      where: { id },
    });
  });
};

export const TenantsService = {
  getAllTenantsFromDB,
  getTenantByIdFromDB,
  updateTenantInDB,
  deleteTenantFromDB,
};
