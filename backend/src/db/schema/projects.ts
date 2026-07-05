import { pgTable, uuid, varchar, text, jsonb, integer, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  imageUrl: text("image_url"),
  features: jsonb("features").default([]),
  repoUrl: text("repo_url"),
  demoUrl: text("demo_url"),
  url: text("url"),
  repository: text("repository"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  visits: integer("visits").notNull().default(0),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
