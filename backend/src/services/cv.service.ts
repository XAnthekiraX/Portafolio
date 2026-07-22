import { supabaseAdmin } from "../config/supabase.js";

export const cvService = {
  async getUrl() {
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("cv_url")
      .limit(1)
      .single();

    return data?.cv_url ?? null;
  },
};
