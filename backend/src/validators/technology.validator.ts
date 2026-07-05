import { z } from "zod";

export const createTechnologySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(100).optional().nullable(),
});

export const updateTechnologySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(100).optional().nullable(),
});
