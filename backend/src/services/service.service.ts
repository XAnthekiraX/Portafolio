import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { services } from "../db/schema/services";

export const serviceService = {
  async getAll() {
    return db.select().from(services).orderBy(asc(services.displayOrder));
  },

  async create(data: typeof services.$inferInsert) {
    const [created] = await db.insert(services).values(data).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof services.$inferInsert>) {
    const [updated] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updated;
  },

  async remove(id: string) {
    await db.delete(services).where(eq(services.id, id));
  },
};
