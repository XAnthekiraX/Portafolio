import { supabaseAdmin } from "../config/supabase.js";

export const profileCompletionService = {
  async getCompletion(userId: string) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .limit(1)
      .single();

    if (!profile) {
      return { percentage: 0, checks: [] };
    }

    const { data: links } = await supabaseAdmin
      .from("social_links")
      .select("id")
      .eq("profile_id", userId);

    const checks = [
      { label: "Foto de perfil", done: profile.avatar_url !== null },
      { label: "Descripción profesional", done: profile.description !== null && profile.description.length > 0 },
      { label: "CV adjunto", done: profile.cv_url !== null },
      { label: "Redes sociales", done: (links?.length ?? 0) > 0 },
      { label: "Título profesional", done: profile.title !== null && profile.title.length > 0 },
      { label: "Ubicación", done: profile.location !== null && profile.location.length > 0 },
    ];

    const doneCount = checks.filter((c) => c.done).length;
    const percentage = Math.round((doneCount / checks.length) * 100);

    return { percentage, checks };
  },
};
