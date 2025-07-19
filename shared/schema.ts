import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for standalone authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  password: text("password").notNull(), // hashed password
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("free"), // free, active, cancelled, past_due
  subscriptionTier: text("subscription_tier").default("free"), // free, basic, pro, enterprise
  role: text("role").default("user"), // user, admin, super_admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content items table
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  contentType: text("content_type").notNull(), // image, video, document
  fileSize: integer("file_size").notNull(),
  s3Key: text("s3_key").notNull(),
  s3Url: text("s3_url").notNull(),
  fingerprint: text("fingerprint"), // perceptual hash
  metadata: jsonb("metadata"), // title, description, tags, etc.
  searchUsernames: text("search_usernames").array(), // up to 3 usernames for guided search
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Infringements/violations table
export const infringements = pgTable("infringements", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull().references(() => contentItems.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // google_images, google_videos, bing_images, bing_videos
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  screenshotS3Key: text("screenshot_s3_key"),
  screenshotUrl: text("screenshot_url"),
  priority: text("priority").default("medium"), // low, medium, high
  status: text("status").default("detected"), // detected, dmca_pending, dmca_sent, resolved, ignored
  similarity: decimal("similarity", { precision: 5, scale: 4 }), // 0.0000 to 1.0000
  detectedAt: timestamp("detected_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// DMCA notices table
export const dmcaNotices = pgTable("dmca_notices", {
  id: serial("id").primaryKey(),
  infringementId: integer("infringement_id").notNull().references(() => infringements.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  recipientEmail: text("recipient_email"),
  platform: text("platform").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").default("pending"), // pending, approved, sent, responded, resolved
  sentAt: timestamp("sent_at"),
  responseReceived: boolean("response_received").default(false),
  responseDate: timestamp("response_date"),
  responseText: text("response_text"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Monitoring scans table
export const monitoringScans = pgTable("monitoring_scans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  contentId: integer("content_id").references(() => contentItems.id),
  platform: text("platform").notNull(),
  query: text("query").notNull(),
  resultsFound: integer("results_found").default(0),
  newInfringements: integer("new_infringements").default(0),
  status: text("status").default("pending"), // pending, running, completed, failed
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  contentItems: many(contentItems),
  infringements: many(infringements),
  dmcaNotices: many(dmcaNotices),
  monitoringScans: many(monitoringScans),
}));

export const contentItemsRelations = relations(contentItems, ({ one, many }) => ({
  user: one(users, {
    fields: [contentItems.userId],
    references: [users.id],
  }),
  infringements: many(infringements),
  monitoringScans: many(monitoringScans),
}));

export const infringementsRelations = relations(infringements, ({ one, many }) => ({
  contentItem: one(contentItems, {
    fields: [infringements.contentId],
    references: [contentItems.id],
  }),
  user: one(users, {
    fields: [infringements.userId],
    references: [users.id],
  }),
  dmcaNotices: many(dmcaNotices),
}));

export const dmcaNoticesRelations = relations(dmcaNotices, ({ one }) => ({
  infringement: one(infringements, {
    fields: [dmcaNotices.infringementId],
    references: [infringements.id],
  }),
  user: one(users, {
    fields: [dmcaNotices.userId],
    references: [users.id],
  }),
}));

export const monitoringScansRelations = relations(monitoringScans, ({ one }) => ({
  user: one(users, {
    fields: [monitoringScans.userId],
    references: [users.id],
  }),
  contentItem: one(contentItems, {
    fields: [monitoringScans.contentId],
    references: [contentItems.id],
  }),
}));

// Insert schemas for Replit Auth
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const upsertUserSchema = createInsertSchema(users);

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInfringementSchema = createInsertSchema(infringements).omit({
  id: true,
  detectedAt: true,
  updatedAt: true,
});

export const insertDmcaNoticeSchema = createInsertSchema(dmcaNotices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMonitoringScanSchema = createInsertSchema(monitoringScans).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type ContentItem = typeof contentItems.$inferSelect;
export type InsertInfringement = z.infer<typeof insertInfringementSchema>;
export type Infringement = typeof infringements.$inferSelect;
export type InsertDmcaNotice = z.infer<typeof insertDmcaNoticeSchema>;
export type DmcaNotice = typeof dmcaNotices.$inferSelect;
export type InsertMonitoringScan = z.infer<typeof insertMonitoringScanSchema>;
export type MonitoringScan = typeof monitoringScans.$inferSelect;
