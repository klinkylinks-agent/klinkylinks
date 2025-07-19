// File: server/storage.ts

import { drizzle, sql } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrations } from "./drizzle";
import { users, contentItems } from "@shared/schema";
import { eq } from "drizzle-orm";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle(client, { migrations });

export interface DashboardStats {
  totalContent: number;
}

export class DatabaseStorage {
  async createUser(data: {
    email: string;
    password: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    subscriptionStatus: string;
    subscriptionTier: string;
  }) {
    // Insert, relying on DB defaults for id/timestamps:
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async getUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user ?? null;
  }

  async getUser(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user ?? null;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    // count(*) on contentItems
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contentItems);
    return { totalContent: Number(row.count) };
  }

  // Stub out Stripe handlers for now—replace with real logic
  async handleCheckoutSession(session: any): Promise<void> {
    console.log("[STORAGE] checkout.session.completed:", session);
  }

  async handleInvoicePaid(invoice: any): Promise<void> {
    console.log("[STORAGE] invoice.paid:", invoice);
  }
}

export const storage = new DatabaseStorage();
