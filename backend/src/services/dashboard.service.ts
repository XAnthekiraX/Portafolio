import { db } from "../db";
import { projects } from "../db/schema/projects";
import { skillCategories } from "../db/schema/skill-categories";
import { technologies } from "../db/schema/technologies";
import { contactMessages } from "../db/schema/contact-messages";
import { count, eq } from "drizzle-orm";

export const dashboardService = {
  async getCounts() {
    const [[projectCount], [skillCount], [techCount], [unreadMessages]] = await Promise.all([
      db.select({ value: count() }).from(projects),
      db.select({ value: count() }).from(skillCategories),
      db.select({ value: count() }).from(technologies),
      db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.status, "unread")),
    ]);

    return {
      totalProjects: projectCount.value,
      totalSkillCategories: skillCount.value,
      totalTechnologies: techCount.value,
      unreadMessages: unreadMessages.value,
    };
  },
};
