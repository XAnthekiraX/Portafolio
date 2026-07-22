import { supabaseAdmin } from "../config/supabase.js";

export const educationService = {
  async getPublic() {
    const { data, error } = await supabaseAdmin
      .from("education_items")
      .select("*")
      .eq("type", "academic")
      .eq("status", "active")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getAll() {
    const { data, error } = await supabaseAdmin
      .from("education_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.degree !== undefined) dbData.degree = data.degree;
    if (data.institution !== undefined) dbData.institution = data.institution;
    if (data.type !== undefined) dbData.type = data.type;
    if (data.startDate !== undefined) dbData.start_date = data.startDate;
    if (data.endDate !== undefined) dbData.end_date = data.endDate;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.displayOrder !== undefined) dbData.display_order = data.displayOrder;

    const { data: created, error } = await supabaseAdmin
      .from("education_items")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return created;
  },

  async update(id: string, data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.degree !== undefined) dbData.degree = data.degree;
    if (data.institution !== undefined) dbData.institution = data.institution;
    if (data.type !== undefined) dbData.type = data.type;
    if (data.startDate !== undefined) dbData.start_date = data.startDate;
    if (data.endDate !== undefined) dbData.end_date = data.endDate;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.displayOrder !== undefined) dbData.display_order = data.displayOrder;
    dbData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from("education_items")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  async remove(id: string) {
    const { error } = await supabaseAdmin.from("education_items").delete().eq("id", id);
    if (error) throw error;
  },
};
