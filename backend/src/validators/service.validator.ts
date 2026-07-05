import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  status: z.enum(["popular", "available", "ondemand"]).optional(),
  displayOrder: z.number().int().optional(),
});

export const updateServiceSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  status: z.enum(["popular", "available", "ondemand"]).optional(),
  displayOrder: z.number().int().optional(),
});
