// server/storage.ts

import crypto from "crypto";
import { User as SelectUser } from "@shared/schema";

/**
 * In-memory stub of your User table.
 * We only require the fields you pass in; everything else is defaulted.
 */
export interface DashboardStats {
  totalContent: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  subscriptionStatus: string;
  subscriptionTier: string;
}

export type UserRecord = SelectUser;

const users = new Map<string, UserRecord>();

export const storage = {
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    return users.get(email.toLowerCase()) || null;
  },

  async createUser(data: CreateUserInput): Promise<UserRecord> {
    const id = crypto.randomUUID();
    const now = new Date();

    const user: UserRecord = {
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

    users.set(user.email.toLowerCase(), user);
    return user;
  },

  async getUser(id: string): Promise<UserRecord | null> {
    return Array.from(users.values()).find((u) => u.id === id) || null;
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
