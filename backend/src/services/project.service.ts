import { eq, asc, sql } from "drizzle-orm";
import { db } from "../db";
import { projects } from "../db/schema/projects";
import { projectTechnologies } from "../db/schema/project-technologies";
import { technologies } from "../db/schema/technologies";

export const projectService = {
  async getPublic() {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.displayOrder));

    return Promise.all(result.map((p) => this.enrich(p)));
  },

  async getAll() {
    const result = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.displayOrder));

    return Promise.all(result.map((p) => this.enrich(p)));
  },

  async getById(id: string) {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!project) return null;
    return this.enrich(project);
  },

  async create(data: typeof projects.$inferInsert) {
    const [created] = await db.insert(projects).values(data).returning();
    return this.enrich(created);
  },

  async update(id: string, data: Partial<typeof projects.$inferInsert>) {
    const [updated] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return this.enrich(updated);
  },

  async remove(id: string) {
    await db.delete(projects).where(eq(projects.id, id));
  },

  async incrementVisits(id: string) {
    await db
      .update(projects)
      .set({ visits: sql`visits + 1` })
      .where(eq(projects.id, id));
  },

  async replaceTechnologies(projectId: string, techIds: string[]) {
    await db.delete(projectTechnologies).where(eq(projectTechnologies.projectId, projectId));

    if (techIds.length === 0) return [];

    const values = techIds.map((technologyId) => ({
      projectId,
      technologyId,
    }));
    return db.insert(projectTechnologies).values(values).returning();
  },

  async enrich(project: typeof projects.$inferSelect) {
    const techRows = await db
      .select({
        id: technologies.id,
        name: technologies.name,
        icon: technologies.icon,
      })
      .from(projectTechnologies)
      .innerJoin(technologies, eq(projectTechnologies.technologyId, technologies.id))
      .where(eq(projectTechnologies.projectId, project.id));

    return {
      ...project,
      features: (project.features as string[]) ?? [],
      technologies: techRows,
    };
  },
};
