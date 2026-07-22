import { supabaseAdmin } from "../config/supabase.js";

export const profileService = {
  async getPublic() {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (profileError || !profile) return null;

    const { data: links } = await supabaseAdmin
      .from("social_links")
      .select("id, platform, url")
      .eq("profile_id", profile.id);

    return {
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      title: profile.title,
      description: profile.description,
      location: profile.location,
      experienceYears: profile.experience_years,
      isAvailable: profile.is_available,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      socialLinks: (links ?? []).map((l) => ({
        id: l.id,
        platform: l.platform,
        url: l.url,
      })),
    };
  },

  async getAdmin() {
    return this.getPublic();
  },

  async update(id: string, data: Record<string, unknown>) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.firstName !== undefined) { updateData.first_name = data.firstName; delete updateData.firstName; }
    if (data.lastName !== undefined) { updateData.last_name = data.lastName; delete updateData.lastName; }
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.experienceYears !== undefined) { updateData.experience_years = data.experienceYears; delete updateData.experienceYears; }
    if (data.isAvailable !== undefined) { updateData.is_available = data.isAvailable; delete updateData.isAvailable; }
    if (data.email !== undefined) updateData.email = data.email;
    if (data.avatarUrl !== undefined) { updateData.avatar_url = data.avatarUrl; delete updateData.avatarUrl; }
    updateData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  async getCvUrl(id?: string) {
    let query = supabaseAdmin.from("profiles").select("cv_url").limit(1);
    if (id) query = query.eq("id", id);
    const { data } = await query.single();
    return data?.cv_url ?? null;
  },

  async updateCvUrl(id: string, cvUrl: string) {
    const now = new Date().toISOString();
    const { data: updated, error } = await supabaseAdmin
      .from("profiles")
      .update({ cv_url: cvUrl, cv_updated_at: now, updated_at: now })
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      throw new Error("Perfil no encontrado — no se pudo actualizar la URL del CV");
    }
    return updated;
  },

  async clearCvUrl(id: string) {
    const now = new Date().toISOString();
    const { data: updated, error } = await supabaseAdmin
      .from("profiles")
      .update({ cv_url: null, cv_updated_at: null, updated_at: now })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },
};
