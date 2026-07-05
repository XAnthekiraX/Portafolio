import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  experienceYears: z.number().int().min(0).optional(),
  isAvailable: z.boolean().optional(),
  email: z.string().email().max(255).optional(),
});
