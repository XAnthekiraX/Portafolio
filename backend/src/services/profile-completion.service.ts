import { db } from "../db";
import { profiles } from "../db/schema";
import { socialLinks } from "../db/schema";
import { eq } from "drizzle-orm";

export const profileCompletionService = {
  async getCompletion(userId: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!profile) {
      return { percentage: 0, checks: [] };
    }

    const links = await db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.profileId, userId));

    const checks = [
      { label: "Foto de perfil", done: profile.avatarUrl !== null },
      { label: "Descripción profesional", done: profile.description !== null && profile.description.length > 0 },
      { label: "CV adjunto", done: profile.cvUrl !== null },
      { label: "Redes sociales", done: links.length > 0 },
      { label: "Título profesional", done: profile.title !== null && profile.title.length > 0 },
      { label: "Ubicación", done: profile.location !== null && profile.location.length > 0 },
    ];

    const doneCount = checks.filter((c) => c.done).length;
    const percentage = Math.round((doneCount / checks.length) * 100);

    return { percentage, checks };
  },
};
