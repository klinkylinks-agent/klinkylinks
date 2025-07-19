import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

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

export function setupAuth(app: Express) {
  try {
    console.log("[AUTH] Setting up authentication...");
    console.log("[AUTH] DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("[AUTH] SESSION_SECRET exists:", !!process.env.SESSION_SECRET);
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET environment variable is required");
    }
    
    // Session configuration
    const PostgresSessionStore = connectPg(session);
    const sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      tableName: "sessions"
    });
    
    console.log("[AUTH] Session store configured successfully");

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "klinkylinks-dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          const isValid = await comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("[REGISTER] Starting registration process");
      console.log("[REGISTER] Environment check - DATABASE_URL exists:", !!process.env.DATABASE_URL);
      console.log("[REGISTER] Request body keys:", Object.keys(req.body || {}));
      
      const { email, password, firstName, lastName } = req.body || {};
      
      if (!email || !password) {
        console.log("[REGISTER] Validation failed - email:", !!email, "password:", !!password);
        return res.status(400).json({ message: "Email and password are required" });
      }

      console.log("[REGISTER] Checking database connection...");
      
      // Test database connection first
      try {
        console.log("[REGISTER] Testing storage connection...");
        const existingUser = await storage.getUserByEmail(email);
        console.log("[REGISTER] Database query successful, existing user:", !!existingUser);
        
        if (existingUser) {
          console.log("[REGISTER] User already exists:", email);
          return res.status(400).json({ message: "User already exists with this email" });
        }
      } catch (dbError) {
        console.error("[REGISTER] Database connection failed:", dbError);
        return res.status(500).json({ message: "Database connection failed. Please check environment variables." });
      }

      console.log("[REGISTER] Hashing password...");
      const hashedPassword = await hashPassword(password);
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log("[REGISTER] Creating user with ID:", userId);
      const user = await storage.createUser({
        id: userId,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        password: hashedPassword,
        profileImageUrl: null,
        role: "user",
        subscriptionStatus: "free",
        subscriptionTier: "free"
      });

      console.log("[REGISTER] User created successfully, logging in...");
      req.login(user, (err) => {
        if (err) {
          console.error("[REGISTER] Passport login error:", err);
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        console.log("[REGISTER] Registration and login successful for:", user.id);
        res.status(201).json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionTier: user.subscriptionTier
        });
      });
    } catch (error) {
      console.error("[REGISTER] Unexpected error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ 
        message: "Registration failed", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: SelectUser, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
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
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = req.user as SelectUser;
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
      console.error("[AUTH] /api/user error:", error);
      res.status(500).json({ message: "Authentication check failed" });
    }
  });
  
  console.log("[AUTH] Authentication setup completed successfully");
  } catch (error) {
    console.error("[AUTH] Failed to setup authentication:", error);
    throw error;
  }
}

// Authentication middleware
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
}