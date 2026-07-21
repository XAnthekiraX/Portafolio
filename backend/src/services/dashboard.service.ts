import { db } from "../db/index.js";
import { projects } from "../db/schema/projects.js";
import { skillCategories } from "../db/schema/skill-categories.js";
import { technologies } from "../db/schema/technologies.js";
import { contactMessages } from "../db/schema/contact-messages.js";
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
