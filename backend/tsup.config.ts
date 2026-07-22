import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  platform: "node",
  target: "node22",
  bundle: true,
  splitting: false,
  external: [
    "express",
    "cors",
    "helmet",
    "cookie-parser",
    "dotenv",
    "multer",
    "zod",
    "@supabase/supabase-js",
  ],
});
