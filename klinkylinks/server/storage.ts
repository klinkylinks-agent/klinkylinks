import bcrypt from "bcrypt";

// User record type
export interface UserRecord {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// In-memory user store (replace with DB logic for production)
const users = new Map<string, UserRecord>();

// Create a user
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

// Get user by email
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  return users.get(email) || null;
}

// Get user by id
export async function getUserById(id: string): Promise<UserRecord | null> {
  for (const user of users.values()) {
    if (user.id === id) return user;
  }
  return null;
}

// Verify password
export async function verifyPassword(user: UserRecord, password: string): Promise<boolean> {
  return await bcrypt.compare(password, user.password);
}

// Export as storage object
export const storage = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
};
