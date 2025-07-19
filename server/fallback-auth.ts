import { Express, Request, Response } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Fallback in-memory storage for emergency situations
const fallbackUsers = new Map<string, any>();
const fallbackSessions = new Map<string, any>();

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

  // Fallback registration endpoint
  app.post("/api/fallback/register", async (req, res) => {
    try {
      console.log("[FALLBACK] Registration attempt");
      
      if (!req.body) {
        return res.status(400).json({ message: "No data received" });
      }

      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Check if user exists in fallback storage
      if (fallbackUsers.has(email)) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Create user in fallback storage
      const hashedPassword = await hashPassword(password);
      const user = {
        id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        password: hashedPassword,
        role: "user",
        subscriptionStatus: "free",
        subscriptionTier: "free",
        createdAt: new Date().toISOString()
      };

      fallbackUsers.set(email, user);
      
      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      fallbackSessions.set(sessionId, { userId: user.id, createdAt: Date.now() });

      res.cookie('fallback_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      console.log("[FALLBACK] User created successfully:", user.id);
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionTier: user.subscriptionTier,
        fallbackMode: true
      });

    } catch (error) {
      console.error("[FALLBACK] Registration error:", error);
      res.status(500).json({ 
        message: "Fallback registration failed", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  });

  // Fallback login endpoint
  app.post("/api/fallback/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = fallbackUsers.get(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      fallbackSessions.set(sessionId, { userId: user.id, createdAt: Date.now() });

      res.cookie('fallback_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionTier: user.subscriptionTier,
        fallbackMode: true
      });

    } catch (error) {
      console.error("[FALLBACK] Login error:", error);
      res.status(500).json({ message: "Fallback login failed" });
    }
  });

  // Fallback user info endpoint
  app.get("/api/fallback/user", (req, res) => {
    try {
      const sessionId = req.cookies?.fallback_session;
      if (!sessionId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const session = fallbackSessions.get(sessionId);
      if (!session) {
        return res.status(401).json({ message: "Invalid session" });
      }

      // Check if session is expired (7 days)
      if (Date.now() - session.createdAt > 7 * 24 * 60 * 60 * 1000) {
        fallbackSessions.delete(sessionId);
        return res.status(401).json({ message: "Session expired" });
      }

      // Find user
      const user = Array.from(fallbackUsers.values()).find(u => u.id === session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionTier: user.subscriptionTier,
        fallbackMode: true
      });

    } catch (error) {
      console.error("[FALLBACK] User info error:", error);
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  console.log("[FALLBACK] Emergency authentication system ready");
}