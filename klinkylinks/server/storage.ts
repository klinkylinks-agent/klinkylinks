import bcrypt from "bcrypt";

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// In-memory user store
const users = new Map<string, UserRecord>();

export async function createUser(
  email: string,
  password: string,
  extra?: { firstName?: string; lastName?: string }
): Promise<UserRecord> {
  const hashed = await bcrypt.hash(password, 10);
  const id = `user_${Date.now()}`;
  const user: UserRecord = {
    id,
    email,
    password: hashed,
    firstName: extra?.firstName ?? "",
    lastName: extra?.lastName ?? "",
  };
  users.set(email, user);
  return user;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  return users.get(email) || null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function verifyPassword(user: UserRecord, password: string): Promise<boolean> {
  return await bcrypt.compare(password, user.password);
}

export const storage = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
};
