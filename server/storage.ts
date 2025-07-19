import crypto from "crypto";
import { User as SelectUser } from "@shared/schema";

export interface DashboardStats {
  totalContent: number;
}

// We’ll treat SelectUser as our in-memory user shape:
export type UserRecord = SelectUser;

const users = new Map<string, UserRecord>();

export const storage = {
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    return users.get(email.toLowerCase()) || null;
  },

  async createUser(data: Omit<UserRecord, "id">): Promise<UserRecord> {
    const id = crypto.randomUUID();
    const u: UserRecord = { id, ...data };
    users.set(u.email.toLowerCase(), u);
    return u;
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
