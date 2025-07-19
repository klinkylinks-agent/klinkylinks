// server/storage.ts

import crypto from "crypto";
import { User as SelectUser } from "@shared/schema";

export interface DashboardStats {
  totalContent: number;
}

// We'll treat SelectUser as our in‐memory user shape:
export type UserRecord = SelectUser;

const users = new Map<string, UserRecord>();

export const storage = {
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    return users.get(email.toLowerCase()) || null;
  },

  async createUser(data: Omit<UserRecord, "id">): Promise<UserRecord> {
    const id = crypto.randomUUID();
    const now = new Date();
    // Supply all required SelectUser fields with sensible defaults:
    const u: UserRecord = {
      id,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      profileImageUrl: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      role: data.role,
      subscriptionStatus: data.subscriptionStatus,
      subscriptionTier: data.subscriptionTier,
      createdAt: now,
      updatedAt: now,
    };
    users.set(u.email.toLowerCase(), u);
    return u;
  },

  async getUser(id: string): Promise<UserRecord | null> {
    for (const u of users.values()) {
      if (u.id === id) return u;
    }
    return null;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return { totalContent: users.size };
  },

  async handleCheckoutSession(session: any): Promise<void> {
    console.log("[STORAGE] checkout.session.completed:", session);
  },

  async handleInvoicePaid(invoice: any): Promise<void> {
    console.log("[STORAGE] invoice.paid:", invoice);
  },
};
