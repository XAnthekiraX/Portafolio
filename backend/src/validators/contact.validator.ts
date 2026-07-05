import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});

export const updateContactStatusSchema = z.object({
  status: z.enum(["unread", "read", "replied"]),
});
