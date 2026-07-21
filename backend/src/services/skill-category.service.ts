import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { skillCategories } from "../db/schema/skill-categories";
import { skillTechnologies } from "../db/schema/skill-technologies";

export const skillCategoryService = {
  async getAll() {
    const categories = await db
      .select()
      .from(skillCategories)
      .orderBy(asc(skillCategories.displayOrder));

    const techResults = await Promise.all(
      categories.map((cat) =>
        db
          .select()
          .from(skillTechnologies)
          .where(eq(skillTechnologies.skillCategoryId, cat.id))
          .orderBy(asc(skillTechnologies.displayOrder))
          .then((techs) => ({
            ...cat,
            technologies: techs.map((t) => ({
              id: t.id,
              name: t.name,
              displayOrder: t.displayOrder,
            })),
          }))
      )
    );
    return techResults;
  },

  async create(data: typeof skillCategories.$inferInsert) {
    const [created] = await db.insert(skillCategories).values(data).returning();
    return created;
  },

  async update(id: string, data: Partial<typeof skillCategories.$inferInsert>) {
    const [updated] = await db
      .update(skillCategories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(skillCategories.id, id))
      .returning();
    return updated;
  },

  async remove(id: string) {
    await db.delete(skillCategories).where(eq(skillCategories.id, id));
  },

  async replaceTechnologies(categoryId: string, techs: { name: string; displayOrder?: number }[]) {
    await db.delete(skillTechnologies).where(eq(skillTechnologies.skillCategoryId, categoryId));

    if (techs.length === 0) return [];

    const values = techs.map((t, i) => ({
      skillCategoryId: categoryId,
      name: t.name,
      displayOrder: t.displayOrder ?? i,
    }));
    return db.insert(skillTechnologies).values(values).returning();
  },
};
