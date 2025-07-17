import { 
  users, 
  contentItems,
  infringements,
  dmcaNotices,
  monitoringScans,
  type User, 
  type UpsertUser,
  type ContentItem,
  type InsertContentItem,
  type Infringement,
  type InsertInfringement,
  type DmcaNotice,
  type InsertDmcaNotice,
  type MonitoringScan,
  type InsertMonitoringScan
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  updateUserSubscription(userId: string, status: string, tier: string): Promise<User>;

  // Content operations
  getContentItems(userId: string): Promise<ContentItem[]>;
  getContentItem(id: number): Promise<ContentItem | undefined>;
  createContentItem(contentItem: InsertContentItem): Promise<ContentItem>;
  updateContentFingerprint(id: number, fingerprint: string): Promise<ContentItem>;

  // Infringement operations
  getInfringements(userId: string, limit?: number): Promise<Infringement[]>;
  getInfringement(id: number): Promise<Infringement | undefined>;
  createInfringement(infringement: InsertInfringement): Promise<Infringement>;
  updateInfringementStatus(id: number, status: string): Promise<Infringement>;
  updateInfringementScreenshot(id: number, screenshotS3Key: string, screenshotUrl: string): Promise<Infringement>;

  // DMCA operations
  getDmcaNotices(userId: string): Promise<DmcaNotice[]>;
  createDmcaNotice(notice: InsertDmcaNotice): Promise<DmcaNotice>;
  updateDmcaStatus(id: number, status: string): Promise<DmcaNotice>;
  approveDmca(id: number): Promise<DmcaNotice>;

  // Monitoring operations
  createMonitoringScan(scan: InsertMonitoringScan): Promise<MonitoringScan>;
  updateScanResults(id: number, resultsFound: number, newInfringements: number): Promise<MonitoringScan>;
  completeScan(id: number, status: string, errorMessage?: string): Promise<MonitoringScan>;

  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    totalContent: number;
    totalViolations: number;
    dmcaSent: number;
    successRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserSubscription(userId: string, status: string, tier: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionStatus: status,
        subscriptionTier: tier,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getContentItems(userId: string): Promise<ContentItem[]> {
    return await db
      .select()
      .from(contentItems)
      .where(and(eq(contentItems.userId, userId), eq(contentItems.isActive, true)))
      .orderBy(desc(contentItems.createdAt));
  }

  async getContentItem(id: number): Promise<ContentItem | undefined> {
    const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id));
    return item || undefined;
  }

  async createContentItem(contentItem: InsertContentItem): Promise<ContentItem> {
    const [item] = await db
      .insert(contentItems)
      .values(contentItem)
      .returning();
    return item;
  }

  async updateContentFingerprint(id: number, fingerprint: string): Promise<ContentItem> {
    const [item] = await db
      .update(contentItems)
      .set({ fingerprint, updatedAt: new Date() })
      .where(eq(contentItems.id, id))
      .returning();
    return item;
  }

  async getInfringements(userId: string, limit = 50): Promise<Infringement[]> {
    return await db
      .select()
      .from(infringements)
      .where(eq(infringements.userId, userId))
      .orderBy(desc(infringements.detectedAt))
      .limit(limit);
  }

  async getInfringement(id: number): Promise<Infringement | undefined> {
    const [infringement] = await db.select().from(infringements).where(eq(infringements.id, id));
    return infringement || undefined;
  }

  async createInfringement(infringement: InsertInfringement): Promise<Infringement> {
    const [item] = await db
      .insert(infringements)
      .values(infringement)
      .returning();
    return item;
  }

  async updateInfringementStatus(id: number, status: string): Promise<Infringement> {
    const [infringement] = await db
      .update(infringements)
      .set({ status, updatedAt: new Date() })
      .where(eq(infringements.id, id))
      .returning();
    return infringement;
  }

  async updateInfringementScreenshot(id: number, screenshotS3Key: string, screenshotUrl: string): Promise<Infringement> {
    const [infringement] = await db
      .update(infringements)
      .set({ 
        screenshotS3Key, 
        screenshotUrl, 
        updatedAt: new Date() 
      })
      .where(eq(infringements.id, id))
      .returning();
    return infringement;
  }

  async getDmcaNotices(userId: string): Promise<DmcaNotice[]> {
    return await db
      .select()
      .from(dmcaNotices)
      .where(eq(dmcaNotices.userId, userId))
      .orderBy(desc(dmcaNotices.createdAt));
  }

  async createDmcaNotice(notice: InsertDmcaNotice): Promise<DmcaNotice> {
    const [dmca] = await db
      .insert(dmcaNotices)
      .values(notice)
      .returning();
    return dmca;
  }

  async updateDmcaStatus(id: number, status: string): Promise<DmcaNotice> {
    const [notice] = await db
      .update(dmcaNotices)
      .set({ status, updatedAt: new Date() })
      .where(eq(dmcaNotices.id, id))
      .returning();
    return notice;
  }

  async approveDmca(id: number): Promise<DmcaNotice> {
    const [notice] = await db
      .update(dmcaNotices)
      .set({ 
        status: 'approved', 
        sentAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(dmcaNotices.id, id))
      .returning();
    return notice;
  }

  async createMonitoringScan(scan: InsertMonitoringScan): Promise<MonitoringScan> {
    const [monitoring] = await db
      .insert(monitoringScans)
      .values(scan)
      .returning();
    return monitoring;
  }

  async updateScanResults(id: number, resultsFound: number, newInfringements: number): Promise<MonitoringScan> {
    const [scan] = await db
      .update(monitoringScans)
      .set({ 
        resultsFound, 
        newInfringements
      })
      .where(eq(monitoringScans.id, id))
      .returning();
    return scan;
  }

  async completeScan(id: number, status: string, errorMessage?: string): Promise<MonitoringScan> {
    const [scan] = await db
      .update(monitoringScans)
      .set({ 
        status,
        errorMessage,
        completedAt: new Date()
      })
      .where(eq(monitoringScans.id, id))
      .returning();
    return scan;
  }

  async getDashboardStats(userId: string): Promise<{
    totalContent: number;
    totalViolations: number;
    dmcaSent: number;
    successRate: number;
  }> {
    const [contentCount] = await db
      .select({ count: count() })
      .from(contentItems)
      .where(and(eq(contentItems.userId, userId), eq(contentItems.isActive, true)));

    const [violationsCount] = await db
      .select({ count: count() })
      .from(infringements)
      .where(eq(infringements.userId, userId));

    const [dmcaCount] = await db
      .select({ count: count() })
      .from(dmcaNotices)
      .where(eq(dmcaNotices.userId, userId));

    const [resolvedCount] = await db
      .select({ count: count() })
      .from(infringements)
      .where(and(eq(infringements.userId, userId), eq(infringements.status, 'resolved')));

    const successRate = violationsCount.count > 0 
      ? Math.round((resolvedCount.count / violationsCount.count) * 100)
      : 0;

    return {
      totalContent: contentCount.count,
      totalViolations: violationsCount.count,
      dmcaSent: dmcaCount.count,
      successRate,
    };
  }
}

export const storage = new DatabaseStorage();
