import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env.js";
import * as schema from "./schema/index.js";

const queryClient = postgres(env.DATABASE_URL, {
  idle_timeout: 300,
  max_lifetime: 3600,
  max: 10,
});

export const db = drizzle(queryClient, { schema });
