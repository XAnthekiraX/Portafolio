import { supabaseAdmin } from "../config/supabase.js";
import { toCamelCaseKeys } from "../utils/case.js";

export const skillCategoryService = {
  async getAll() {
    const { data: categories, error } = await supabaseAdmin
      .from("skill_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    const techResults = await Promise.all(
      (categories ?? []).map(async (cat) => {
        const { data: techs } = await supabaseAdmin
          .from("skill_technologies")
          .select("id, name, display_order")
          .eq("skill_category_id", cat.id)
          .order("display_order", { ascending: true });

        return toCamelCaseKeys({
          ...cat,
          technologies: (techs ?? []).map((t) => ({
            id: t.id,
            name: t.name,
            displayOrder: t.display_order,
          })),
        });
      }),
    );
    return techResults;
  },

  async create(data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.icon !== undefined) dbData.icon = data.icon;
    if (data.displayOrder !== undefined) dbData.display_order = data.displayOrder;

    const { data: created, error } = await supabaseAdmin
      .from("skill_categories")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toCamelCaseKeys(created);
  },

  async update(id: string, data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.icon !== undefined) dbData.icon = data.icon;
    if (data.displayOrder !== undefined) dbData.display_order = data.displayOrder;
    dbData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from("skill_categories")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return toCamelCaseKeys(updated);
  },

  async remove(id: string) {
    const { error } = await supabaseAdmin.from("skill_categories").delete().eq("id", id);
    if (error) throw error;
  },

  async replaceTechnologies(categoryId: string, techs: { name: string; displayOrder?: number }[]) {
    const { error: delError } = await supabaseAdmin
      .from("skill_technologies")
      .delete()
      .eq("skill_category_id", categoryId);

    if (delError) throw delError;

    if (techs.length === 0) return [];

    const values = techs.map((t, i) => ({
      skill_category_id: categoryId,
      name: t.name,
      display_order: t.displayOrder ?? i,
    }));

    const { data: inserted, error: insError } = await supabaseAdmin
      .from("skill_technologies")
      .insert(values)
      .select();

    if (insError) throw insError;
    return (inserted ?? []).map(toCamelCaseKeys);
  },
};
