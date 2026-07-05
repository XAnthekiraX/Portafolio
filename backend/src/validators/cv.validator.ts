import { z } from "zod";

export const cvUploadSchema = z.object({
  url: z.string().url().max(2048),
});
