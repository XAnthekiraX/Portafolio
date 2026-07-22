import { supabaseAdmin } from "../config/supabase.js";

export const technologyService = {
  async getAll() {
    const { data: techs, error: techError } = await supabaseAdmin
      .from("technologies")
      .select("*")
      .order("name");

    if (techError) throw techError;

    const { data: ptRows } = await supabaseAdmin
      .from("project_technologies")
      .select("technology_id");

    const usageMap = new Map<string, number>();
    for (const row of ptRows ?? []) {
      usageMap.set(row.technology_id, (usageMap.get(row.technology_id) ?? 0) + 1);
    }

    const result = (techs ?? []).map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
      usageCount: usageMap.get(t.id) ?? 0,
    }));

    result.sort((a, b) => {
      const cmp = b.usageCount - a.usageCount;
      return cmp !== 0 ? cmp : a.name.localeCompare(b.name);
    });

    return result;
  },

  async create(data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.icon !== undefined) dbData.icon = data.icon;

    const { data: created, error } = await supabaseAdmin
      .from("technologies")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return created;
  },

  async update(id: string, data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.icon !== undefined) dbData.icon = data.icon;
    dbData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from("technologies")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  async remove(id: string) {
    const { error } = await supabaseAdmin.from("technologies").delete().eq("id", id);
    if (error) throw error;
  },
};
