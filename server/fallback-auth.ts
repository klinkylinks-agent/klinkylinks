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
  console.log("[FALLBACK] Emergency auth");
  const users = new Map<string, any>();

  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, confirmPassword, firstName, lastName } = req.body;
      if (!email || !password || !confirmPassword) {
        return res
          .status(400)
          .json({ message: "Email, password & confirmPassword required" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (users.has(email)) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const id = `user_${Date.now()}`;
      const hashed = await hashPassword(password);
      const u = { id, email, password: hashed, firstName: firstName || null, lastName: lastName || null, role: "user", subscriptionStatus: "free", subscriptionTier: "free" };
      users.set(email, u);
      res.status(201).json(u);
    } catch (err: any) {
      console.error("[FALLBACK REGISTER] Error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email & password required" });
      }
      const u = users.get(email);
      if (!u || !(await comparePasswords(password, u.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json(u);
    } catch (err: any) {
      console.error("[FALLBACK LOGIN] Error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/user", (_req, res) => {
    res.status(401).json({ message: "Not authenticated (fallback)" });
  });

  app.post("/api/logout", (_req, res) => {
    res.json({ message: "Logged out" });
  });
}
