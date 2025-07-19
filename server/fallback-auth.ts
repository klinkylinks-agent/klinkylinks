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
  console.log("[FALLBACK] Setting up emergency authentication system");
  
  // Simple in-memory user storage for emergency use
  const users = new Map();
  
  app.post("/api/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      if (users.has(email)) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      const userId = `user_${Date.now()}`;
      const hashedPassword = await hashPassword(password);
      
      const user = {
        id: userId,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        password: hashedPassword,
        role: "user",
        subscriptionStatus: "free",
        subscriptionTier: "free"
      };
      
      users.set(email, user);
      
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error) {
      console.error("[FALLBACK] Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
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
      
      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error) {
      console.error("[FALLBACK] Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.get("/api/user", (req, res) => {
    res.status(401).json({ message: "Not authenticated - fallback mode" });
  });
  
  app.post("/api/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
}