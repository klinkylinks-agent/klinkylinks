import crypto from "crypto";

export interface UserRecord { id: string; email: string; password: string }

const users = new Map<string, UserRecord>();

export const storage = {
  async getUserByEmail(email: string) {
    return users.get(email.toLowerCase()) || null;
  },
  async createUser(email: string, password: string) {
    const id = crypto.randomUUID();
    const u = { id, email, password };
    users.set(email.toLowerCase(), u);
    return u;
  },
};
