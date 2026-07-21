import { db } from "../db/index.js";
import { profiles } from "../db/schema/profiles.js";

export const cvService = {
  async getUrl() {
    const [profile] = await db
      .select({ cvUrl: profiles.cvUrl })
      .from(profiles)
      .limit(1);
    return profile?.cvUrl ?? null;
  },
};
