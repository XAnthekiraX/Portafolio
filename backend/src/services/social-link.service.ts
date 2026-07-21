import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { socialLinks } from "../db/schema/social-links.js";

export const socialLinkService = {
  async getAll(profileId: string) {
    return db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.profileId, profileId))
      .orderBy(socialLinks.platform);
  },

  async create(data: typeof socialLinks.$inferInsert) {
    const [created] = await db.insert(socialLinks).values(data).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof socialLinks.$inferInsert>) {
    const [updated] = await db
      .update(socialLinks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(socialLinks.id, id))
      .returning();
    return updated;
  },

  async remove(id: string) {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
  },
};
