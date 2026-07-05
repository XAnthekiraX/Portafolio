import { db } from "../db";
import { projects, skillCategories, technologies, contactMessages } from "../db/schema";
import { count, eq } from "drizzle-orm";

export const dashboardService = {
  async getCounts() {
    const [projectCount] = await db
      .select({ value: count() })
      .from(projects);

    const [skillCount] = await db
      .select({ value: count() })
      .from(skillCategories);

    const [techCount] = await db
      .select({ value: count() })
      .from(technologies);

    const [unreadMessages] = await db
      .select({ value: count() })
      .from(contactMessages)
      .where(eq(contactMessages.status, "unread"));

    return {
      totalProjects: projectCount.value,
      totalSkillCategories: skillCount.value,
      totalTechnologies: techCount.value,
      unreadMessages: unreadMessages.value,
    };
  },
};
