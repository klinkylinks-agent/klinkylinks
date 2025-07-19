// File: server/storage.ts

export interface DashboardStats { totalContent: number; }
export interface UserRecord {
  id: string; email: string; password?: string;
  firstName?: string | null; lastName?: string | null;
  role?: string; subscriptionStatus?: string; subscriptionTier?: string;
}

const users = new Map<string, UserRecord>();

export const storage = {
  async getUserByEmail(email: string) {
    return users.get(email.toLowerCase()) || null;
  },
  async createUser(data: Omit<UserRecord, "id">) {
    const id = crypto.randomUUID();
    const u: UserRecord = { id, ...data };
    users.set(u.email.toLowerCase(), u);
    return u;
  },
  async getUser(id: string) {
    return Array.from(users.values()).find(u => u.id === id) || null;
  },
  async getDashboardStats(): Promise<DashboardStats> {
    return { totalContent: users.size };
  },
  async handleCheckoutSession(session: any) {
    console.log("[STORAGE] checkout.session.completed:", session);
  },
  async handleInvoicePaid(invoice: any) {
    console.log("[STORAGE] invoice.paid:", invoice);
  },
};
