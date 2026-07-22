import { supabaseAdmin } from "../config/supabase.js";
import { toCamelCaseKeys } from "../utils/case.js";

export const serviceService = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toCamelCaseKeys);
  },

  async create(data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.icon !== undefined) dbData.icon = data.icon;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.displayOrder !== undefined) dbData.display_order = data.displayOrder;

    const { data: created, error } = await supabaseAdmin
      .from("services")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return toCamelCaseKeys(created);
  },

  async update(id: string, data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.icon !== undefined) dbData.icon = data.icon;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.displayOrder !== undefined) dbData.display_order = data.displayOrder;
    dbData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from("services")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return toCamelCaseKeys(updated);
  },

  async remove(id: string) {
    const { error } = await supabaseAdmin.from("services").delete().eq("id", id);
    if (error) throw error;
  },
};
