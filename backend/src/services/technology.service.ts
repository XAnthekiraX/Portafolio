import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { technologies } from "../db/schema";

export const technologyService = {
  async getAll() {
    return db.select().from(technologies).orderBy(asc(technologies.name));
  },

  async create(data: typeof technologies.$inferInsert) {
    const [created] = await db.insert(technologies).values(data).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof technologies.$inferInsert>) {
    const [updated] = await db
      .update(technologies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(technologies.id, id))
      .returning();
    return updated;
  },

  async remove(id: string) {
    await db.delete(technologies).where(eq(technologies.id, id));
  },
};
