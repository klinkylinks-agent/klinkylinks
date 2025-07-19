// server/storage.ts

import crypto from "crypto";

// A simple in-memory user record
export interface UserRecord {
  id: string;
  email: string;
  password: string;
}

const users = new Map<string, UserRecord>();

export const storage = {
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    return users.get(email.toLowerCase()) || null;
  },

  async createUser(email: string, password: string): Promise<UserRecord> {
    const id = crypto.randomUUID();
    const user: UserRecord = { id, email, password };
    users.set(email.toLowerCase(), user);
    return user;
  },
};
