import prisma from "../../../prisma/client.js";

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

export const TenantsService = {
  getAllTenantsFromDB,
};
