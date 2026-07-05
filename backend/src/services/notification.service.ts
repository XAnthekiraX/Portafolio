import { eq, desc, and, gte, sql } from "drizzle-orm";
import { db } from "../db";
import { contactMessages } from "../db/schema";

export const notificationService = {
  async getUnread() {
    const messages = await db
      .select({
        id: contactMessages.id,
        name: contactMessages.name,
        email: contactMessages.email,
        subject: contactMessages.subject,
        message: contactMessages.message,
        createdAt: contactMessages.createdAt,
      })
      .from(contactMessages)
      .where(eq(contactMessages.status, "unread"))
      .orderBy(desc(contactMessages.createdAt))
      .limit(10);

    const [unreadResult] = await db
      .select({ value: sql`count(*)` })
      .from(contactMessages)
      .where(eq(contactMessages.status, "unread"));

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayResult] = await db
      .select({ value: sql`count(*)` })
      .from(contactMessages)
      .where(
        and(
          gte(contactMessages.createdAt, todayStart),
          eq(contactMessages.status, "unread"),
        ),
      );

    return {
      unreadCount: Number(unreadResult.value),
      todayCount: Number(todayResult.value),
      recent: messages.map((m) => ({
        ...m,
        message: m.message.length > 100 ? m.message.slice(0, 100) + "..." : m.message,
      })),
    };
  },
};
