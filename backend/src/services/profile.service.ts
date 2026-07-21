import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { profiles } from "../db/schema/profiles.js";
import { socialLinks } from "../db/schema/social-links.js";

export const profileService = {
  async getPublic() {
    const result = await db
      .select()
      .from(profiles)
      .leftJoin(socialLinks, eq(profiles.id, socialLinks.profileId));

    if (!result.length) return null;

    const profile = result[0].profiles;
    const links = result.flatMap((r) =>
      r.social_links
        ? [{ id: r.social_links.id, platform: r.social_links.platform, url: r.social_links.url }]
        : []
    );

    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      description: profile.description,
      location: profile.location,
      experienceYears: profile.experienceYears,
      isAvailable: profile.isAvailable,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
      socialLinks: links,
    };
  },

  async getAdmin() {
    return this.getPublic();
  },

  async update(id: string, data: Partial<typeof profiles.$inferInsert>) {
    const [updated] = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updated;
  },

  async getCvUrl(id?: string) {
    const query = id
      ? db.select({ cvUrl: profiles.cvUrl }).from(profiles).where(eq(profiles.id, id)).limit(1)
      : db.select({ cvUrl: profiles.cvUrl }).from(profiles).limit(1);
    const [profile] = await query;
    return profile?.cvUrl ?? null;
  },

  async updateCvUrl(id: string, cvUrl: string) {
    const [updated] = await db
      .update(profiles)
      .set({ cvUrl, cvUpdatedAt: new Date(), updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    if (!updated) {
      throw new Error("Perfil no encontrado — no se pudo actualizar la URL del CV");
    }
    return updated;
  },

  async clearCvUrl(id: string) {
    const [updated] = await db
      .update(profiles)
      .set({ cvUrl: null, cvUpdatedAt: null, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updated;
  },
};
