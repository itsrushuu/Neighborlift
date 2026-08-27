import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const helpPosts = mysqlTable("helpPosts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: mysqlEnum("kind", ["request", "offer"]).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  displayName: varchar("displayName", { length: 80 }).notNull(),
  category: mysqlEnum("category", ["groceries", "rides", "tutoring", "translation", "accessibility"]).notNull(),
  urgency: mysqlEnum("urgency", ["flexible", "this_week", "today"]).notNull(),
  approximateArea: varchar("approximateArea", { length: 120 }).notNull(),
  skills: text("skills").notNull(),
  availability: varchar("availability", { length: 180 }).notNull(),
  accessibilityNotes: text("accessibilityNotes"),
  status: mysqlEnum("status", ["open", "matched", "completed", "closed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const helpMatches = mysqlTable("helpMatches", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull().references(() => helpPosts.id, { onDelete: "cascade" }),
  offerId: int("offerId").notNull().references(() => helpPosts.id, { onDelete: "cascade" }),
  compatibilityScore: int("compatibilityScore").notNull(),
  reasons: text("reasons").notNull(),
  aiExplanation: text("aiExplanation"),
  status: mysqlEnum("status", ["proposed", "matched", "completed", "declined"]).default("proposed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HelpPost = typeof helpPosts.$inferSelect;
export type InsertHelpPost = typeof helpPosts.$inferInsert;
export type HelpMatch = typeof helpMatches.$inferSelect;
export type InsertHelpMatch = typeof helpMatches.$inferInsert;
