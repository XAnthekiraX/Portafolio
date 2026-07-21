import { pgTable, uuid, varchar, text, timestamp, unique } from "drizzle-orm/pg-core";
import { profiles } from "./profiles.js";

export const socialLinks = pgTable("social_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 50 }).notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniqueProfilePlatform: unique().on(table.profileId, table.platform),
}));
