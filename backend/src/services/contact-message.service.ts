import { eq, desc, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { contactMessages } from "../db/schema/contact-messages.js";

export const contactMessageService = {
  async create(data: typeof contactMessages.$inferInsert) {
    const [created] = await db.insert(contactMessages).values(data).returning();
    return created;
  },

  async getAll() {
    return db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  },

  async getById(id: string) {
    const [message] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);
    return message ?? null;
  },

  async updateStatus(id: string, status: string) {
    const updateData: Partial<typeof contactMessages.$inferInsert> = {
      status,
    };
    if (status === "read") {
      updateData.readAt = new Date();
    }
    const [updated] = await db
      .update(contactMessages)
      .set(updateData)
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  },

  async remove(id: string) {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  },

  async getCount() {
    const result = await db
      .select({
        status: contactMessages.status,
        count: sql`count(*)`.mapWith(Number),
      })
      .from(contactMessages)
      .groupBy(contactMessages.status);

    const total = result.reduce((sum, r) => sum + r.count, 0);
    const counts: Record<string, number> = { total };
    for (const r of result) {
      counts[r.status] = r.count;
    }
    return counts;
  },
};
