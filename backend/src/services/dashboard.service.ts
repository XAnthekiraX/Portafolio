import { supabaseAdmin } from "../config/supabase.js";

export const dashboardService = {
  async getCounts() {
    const [projectsResult, skillResult, techResult, unreadResult] = await Promise.all([
      supabaseAdmin.from("projects").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("skill_categories").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("technologies").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "unread"),
    ]);

    return {
      totalProjects: projectsResult.count ?? 0,
      totalSkillCategories: skillResult.count ?? 0,
      totalTechnologies: techResult.count ?? 0,
      unreadMessages: unreadResult.count ?? 0,
    };
  },
};
