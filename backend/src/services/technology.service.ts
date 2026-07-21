import { eq, asc, desc, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { technologies } from "../db/schema/technologies.js";
import { projectTechnologies } from "../db/schema/project-technologies.js";

export const technologyService = {
  async getAll() {
    const result = await db
      .select({
        id: technologies.id,
        name: technologies.name,
        icon: technologies.icon,
        createdAt: technologies.createdAt,
        updatedAt: technologies.updatedAt,
        usageCount: sql<number>`count(${projectTechnologies.id})`.as("usage_count"),
      })
      .from(technologies)
      .leftJoin(projectTechnologies, eq(technologies.id, projectTechnologies.technologyId))
      .groupBy(technologies.id)
      .orderBy(desc(sql`count(${projectTechnologies.id})`), asc(technologies.name));
    return result;
  },

  async create(data: typeof technologies.$inferInsert) {
    const [created] = await db.insert(technologies).values(data).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof technologies.$inferInsert>) {
    const [updated] = await db
      .update(technologies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(technologies.id, id))
      .returning();
    return updated;
  },

  async remove(id: string) {
    await db.delete(technologies).where(eq(technologies.id, id));
  },
};
