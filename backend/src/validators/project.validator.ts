import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  features: z.array(z.string()).optional(),
  repoUrl: z.string().url().max(2048).optional().nullable(),
  demoUrl: z.string().url().max(2048).optional().nullable(),
  status: z.enum(["draft", "published", "hidden"]).optional(),
  displayOrder: z.number().int().optional(),
  technologyIds: z.array(z.string().uuid()).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  features: z.array(z.string()).optional(),
  repoUrl: z.string().url().max(2048).optional().nullable(),
  demoUrl: z.string().url().max(2048).optional().nullable(),
  status: z.enum(["draft", "published", "hidden"]).optional(),
  displayOrder: z.number().int().optional(),
  technologyIds: z.array(z.string().uuid()).optional(),
});
