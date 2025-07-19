import { drizzle } from "drizzle-orm/postgres-js";
import { migrations } from "./drizzle";
import postgres from "postgres";
import { users, contentItems, DashboardStats } from "@shared/schema";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });
export const db = drizzle(sql, { migrations });

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
    const [u] = await db
      .insert(users)
      .values(data)
      .returning();
    return u;
  }

  async getUserByEmail(email: string) {
    return await db.select().from(users).where(users.email.eq(email)).then(r => r[0] || null);
  }

  async getUser(id: string) {
    return await db.select().from(users).where(users.id.eq(id)).then(r => r[0] || null);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const row = await db.select().from(contentItems).count().as("total");
    return { totalContent: row.total };
  }

  // … any other storage methods …
}

export const storage = new DatabaseStorage();
