import { supabaseAdmin } from "../config/supabase.js";

export const contactMessageService = {
  async create(data: Record<string, unknown>) {
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.email !== undefined) dbData.email = data.email;
    if (data.subject !== undefined) dbData.subject = data.subject;
    if (data.message !== undefined) dbData.message = data.message;

    const { data: created, error } = await supabaseAdmin
      .from("contact_messages")
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    return created;
  },

  async getAll() {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const updateData: Record<string, unknown> = { status };
    if (status === "read") {
      updateData.read_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabaseAdmin
      .from("contact_messages")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  async remove(id: string) {
    const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
  },

  async getCount() {
    const { data: all } = await supabaseAdmin
      .from("contact_messages")
      .select("status");

    const counts: Record<string, number> = { total: all?.length ?? 0 };
    for (const row of all ?? []) {
      counts[row.status] = (counts[row.status] ?? 0) + 1;
    }
    return counts;
  },
};
