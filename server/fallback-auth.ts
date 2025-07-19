import { Express } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupFallbackAuth(app: Express) {
  console.log("[FALLBACK] Emergency auth enabled");
  const users = new Map<string, any>();

  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, confirmPassword, firstName, lastName } = req.body;
      if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Email, password, and confirm password are required" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (users.has(email)) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const id = `user_${Date.now()}`;
      const hashed = await hashPassword(password);
      const user = { id, email, firstName: firstName || null, lastName: lastName || null, password: hashed, role: "user", subscriptionStatus: "free", subscriptionTier: "free" };
      users.set(email, user);
      res.status(201).json(user);
    } catch (error: any) {
      console.error("[FALLBACK REGISTER] Error:", error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = users.get(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const valid = await comparePasswords(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json(user);
    } catch (error: any) {
      console.error("[FALLBACK LOGIN] Error:", error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  });

  app.get("/api/user", (_req, res) => {
    res.status(401).json({ message: "Not authenticated - fallback mode" });
  });

  app.post("/api/logout", (_req, res) => {
    res.json({ message: "Logged out" });
  });
}
