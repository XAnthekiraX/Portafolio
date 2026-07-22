import { supabaseAdmin } from "../config/supabase.js";

export const notificationService = {
  async getUnread() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [messagesResult, unreadResult, todayResult] = await Promise.all([
      supabaseAdmin
        .from("contact_messages")
        .select("id, name, email, subject, message, created_at")
        .eq("status", "unread")
        .order("created_at", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "unread"),
      supabaseAdmin
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("status", "unread")
        .gte("created_at", todayStart.toISOString()),
    ]);

    return {
      unreadCount: unreadResult.count ?? 0,
      todayCount: todayResult.count ?? 0,
      recent: (messagesResult.data ?? []).map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message.length > 100 ? m.message.slice(0, 100) + "..." : m.message,
        createdAt: m.created_at,
      })),
    };
  },
};
