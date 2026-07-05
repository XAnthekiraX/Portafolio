import { z } from "zod";

const validPlatforms = [
  "github", "linkedin", "twitter", "x",
  "dribbble", "website", "youtube", "instagram", "tiktok",
] as const;

export const createSocialLinkSchema = z.object({
  platform: z.enum(validPlatforms),
  url: z.string().url().max(2048),
});

export const updateSocialLinkSchema = z.object({
  platform: z.enum(validPlatforms).optional(),
  url: z.string().url().max(2048).optional(),
});
