import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

export const supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const supabase = supabaseAdmin;
