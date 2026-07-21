import { pgTable, uuid, varchar, integer, unique } from "drizzle-orm/pg-core";
import { skillCategories } from "./skill-categories.js";

export const skillTechnologies = pgTable("skill_technologies", {
  id: uuid("id").primaryKey().defaultRandom(),
  skillCategoryId: uuid("skill_category_id").notNull().references(() => skillCategories.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  displayOrder: integer("display_order").notNull().default(0),
}, (table) => ({
  uniqueCategoryName: unique().on(table.skillCategoryId, table.name),
}));
