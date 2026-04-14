import { z } from "zod";

const updateProfileSchema = z.object({
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
});

export const SettingsValidation = {
  updateProfileSchema,
};
