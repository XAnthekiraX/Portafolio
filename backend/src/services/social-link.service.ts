import { supabaseAdmin } from "../config/supabase.js";

export const socialLinkService = {
  async getAll(profileId: string) {
    const { data, error } = await supabaseAdmin
      .from("social_links")
      .select("*")
      .eq("profile_id", profileId)
      .order("platform");

    if (error) throw error;
    return data ?? [];
  },

  async create(data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.profileId !== undefined) dbData.profile_id = data.profileId;
    if (data.platform !== undefined) dbData.platform = data.platform;
    if (data.url !== undefined) dbData.url = data.url;

    const { data: created, error } = await supabaseAdmin
      .from("social_links")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return created;
  },

  async update(id: string, data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.platform !== undefined) dbData.platform = data.platform;
    if (data.url !== undefined) dbData.url = data.url;
    dbData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from("social_links")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  async remove(id: string) {
    const { error } = await supabaseAdmin.from("social_links").delete().eq("id", id);
    if (error) throw error;
  },
};
