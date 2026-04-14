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

export const SettingsService = {
  updateProfileInDB,
  getProfileFromDB,
};
