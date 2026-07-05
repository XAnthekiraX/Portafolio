import { db } from "../db";
import { profiles } from "../db/schema";

export const cvService = {
  async getUrl() {
    const [profile] = await db
      .select({ cvUrl: profiles.cvUrl })
      .from(profiles)
      .limit(1);
    return profile?.cvUrl ?? null;
  },
};
