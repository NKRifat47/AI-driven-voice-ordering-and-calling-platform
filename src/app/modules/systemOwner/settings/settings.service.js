import prisma from "../../../prisma/client.js";

const updatePlatformLogoInDB = async (logoUrl) => {
  // platform_settings is a singleton table
  const existingSettings = await prisma.platform_settings.findFirst();

  if (existingSettings) {
    return await prisma.platform_settings.update({
      where: { id: existingSettings.id },
      data: {
        logo_url: logoUrl,
        updated_at: new Date(),
      },
    });
  } else {
    return await prisma.platform_settings.create({
      data: {
        logo_url: logoUrl,
      },
    });
  }
};

const getPlatformLogoFromDB = async () => {
  const result = await prisma.platform_settings.findFirst();
  return result;
};

export const SettingsService = {
  updatePlatformLogoInDB,
  getPlatformLogoFromDB,
};
