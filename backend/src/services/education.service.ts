import { eq, asc, and } from "drizzle-orm";
import { db } from "../db";
import { educationItems } from "../db/schema";

export const educationService = {
  async getPublic() {
    return db
      .select()
      .from(educationItems)
      .where(
        and(
          eq(educationItems.type, "academic"),
          eq(educationItems.status, "active")
        )
      )
      .orderBy(asc(educationItems.displayOrder));
  },

  async getAll() {
    return db
      .select()
      .from(educationItems)
      .orderBy(asc(educationItems.displayOrder));
  },

  async create(data: typeof educationItems.$inferInsert) {
    const [created] = await db.insert(educationItems).values(data).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof educationItems.$inferInsert>) {
    const [updated] = await db
      .update(educationItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(educationItems.id, id))
      .returning();
    return updated;
  },

  async remove(id: string) {
    await db.delete(educationItems).where(eq(educationItems.id, id));
  },
};
