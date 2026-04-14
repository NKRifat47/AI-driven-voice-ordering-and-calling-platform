import prisma from "../../../prisma/client.js";

const updateProfileInDB = async (userId, data) => {
  return await prisma.users.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      avatar: true,
      role: true,
    },
  });
};

const getProfileFromDB = async (userId) => {
  return await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      avatar: true,
      role: true,
    },
  });
};

const getContactInfoFromDB = async (userId) => {
  return await prisma.users.findUnique({
    where: { id: userId },
    select: {
      email: true,
      phone: true,
    },
  });
};

const updatePhoneInDB = async (userId, phone) => {
  return await prisma.users.update({
    where: { id: userId },
    data: { phone },
  });
};

const getBusinessDetailsFromDB = async (userId) => {
  const business = await prisma.business.findFirst({
    where: { owner_id: userId },
    include: { settings: true },
  });

  if (!business) {
    return null;
  }

  return {
    name: business.name,
    address: business.settings?.business_address || "",
  };
};

const updateBusinessDetailsInDB = async (userId, data) => {
  const business = await prisma.business.findFirst({
    where: { owner_id: userId },
  });

  if (!business) {
    throw new DevBuildError("Business not found", StatusCodes.NOT_FOUND);
  }

  return await prisma.$transaction(async (tx) => {
    const updatedBusiness = await tx.business.update({
      where: { id: business.id },
      data: { name: data.name },
    });

    await tx.business_settings.upsert({
      where: { business_id: business.id },
      update: {
        business_name: data.name,
        business_address: data.address,
      },
      create: {
        business_id: business.id,
        business_name: data.name || updatedBusiness.name,
        business_address: data.address || "",
      },
    });

    return updatedBusiness;
  });
};

export const SettingsService = {
  updateProfileInDB,
  getProfileFromDB,
  getContactInfoFromDB,
  updatePhoneInDB,
  getBusinessDetailsFromDB,
  updateBusinessDetailsInDB,
};
