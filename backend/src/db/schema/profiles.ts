import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  experienceYears: integer("experience_years").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  email: varchar("email", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  cvUrl: text("cv_url"),
  cvUpdatedAt: timestamp("cv_updated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
