import { pgTable, uuid, varchar, text, integer, date, timestamp } from "drizzle-orm/pg-core";

export const educationItems = pgTable("education_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }),
  institution: varchar("institution", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
