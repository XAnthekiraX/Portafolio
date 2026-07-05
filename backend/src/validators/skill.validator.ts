import { z } from "zod";

export const createSkillCategorySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(100).optional().nullable(),
  displayOrder: z.number().int().optional(),
  technologies: z.array(z.object({
    name: z.string().min(1).max(100),
    displayOrder: z.number().int().optional(),
  })).optional(),
});

export const updateSkillCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(100).optional().nullable(),
  displayOrder: z.number().int().optional(),
  technologies: z.array(z.object({
    name: z.string().min(1).max(100),
    displayOrder: z.number().int().optional(),
  })).optional(),
});
