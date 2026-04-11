import { z } from "zod";

const updateTenantSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(1, "Name cannot be empty"),
  }).strict(), // .strict() ensures no other fields are allowed in the body
});

export const TenantsValidation = {
  updateTenantSchema,
};
