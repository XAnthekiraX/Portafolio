import { z } from "zod";

export const createEducationSchema = z.object({
  title: z.string().min(1).max(255),
  degree: z.string().max(255).optional().nullable(),
  institution: z.string().min(1).max(255),
  type: z.enum(["academic", "certification"]),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(["active", "expiring", "expired"]).optional(),
  displayOrder: z.number().int().optional(),
});

export const updateEducationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  degree: z.string().max(255).optional().nullable(),
  institution: z.string().min(1).max(255).optional(),
  type: z.enum(["academic", "certification"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(["active", "expiring", "expired"]).optional(),
  displayOrder: z.number().int().optional(),
});
