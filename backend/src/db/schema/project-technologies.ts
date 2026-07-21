import { pgTable, uuid, unique } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";
import { technologies } from "./technologies.js";

export const projectTechnologies = pgTable("project_technologies", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  technologyId: uuid("technology_id").notNull().references(() => technologies.id, { onDelete: "cascade" }),
}, (table) => ({
  uniqueProjectTechnology: unique().on(table.projectId, table.technologyId),
}));
