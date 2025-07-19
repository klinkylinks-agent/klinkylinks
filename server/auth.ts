import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { setupFallbackAuth } from "./fallback-auth";

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
    
    // More graceful environment variable handling for Vercel
    if (!process.env.DATABASE_URL) {
      console.error("[AUTH] DATABASE_URL missing - using fallback auth");
      return setupFallbackAuth(app);
    }
    if (!process.env.SESSION_SECRET) {
      console.error("[AUTH] SESSION_SECRET missing - using fallback auth");
      return setupFallbackAuth(app);
    }
    
    // Session configuration with Vercel compatibility
    let sessionStore;
    try {
      const PostgresSessionStore = connectPg(session);
      sessionStore = new PostgresSessionStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        tableName: "sessions",
      });
      console.log("[AUTH] PostgreSQL session store configured successfully");
    } catch (sessionError) {
      console.error("[AUTH] PostgreSQL session store failed, using memory store:", sessionError);
      const MemoryStore = require("memorystore")(session);
      sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    }

    const sessionSettings: session.SessionOptions = {
      secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
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
        console.log("[REGISTER] Request body keys:", Object.keys(req.body || {}));
        
        const { email, password, firstName, lastName, confirmPassword } = req.body || {};
        console.log(
          "[REGISTER] Details:",
          { email, firstName, lastName, hasPassword: !!password, hasConfirmPassword: !!confirmPassword }
        );
        
        if (!email || !password || !confirmPassword) {
          console.log("[REGISTER] Validation failed:", { email: !!email, password: !!password, confirmPassword: !!confirmPassword });
          return res.status(400).json({ message: "Email, password, and confirm password are required" });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }

        console.log("[REGISTER] Checking for existing user");
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await storage.createUser({
          email,
          password: hashedPassword,
          firstName: firstName || null,
          lastName: lastName || null,
          role: "user",
          subscriptionStatus: "free",
          subscriptionTier: "free",
        });
        console.log("[REGISTER] User created:", { userId: newUser.id });

        // Auto-login
        req.logIn(newUser, (err) => {
          if (err) return next(err);
          res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            subscriptionStatus: newUser.subscriptionStatus,
            subscriptionTier: newUser.subscriptionTier,
          });
        });
      } catch (error) {
        console.error("[REGISTER] Error:", error);
        res.status(500).json({ message: "Registration failed. Please try again." });
      }
    });

    // (Other endpoints—login, logout, user—go here or in fallback)

  } catch (error) {
    console.error("[AUTH] Setup error, falling back:", error);
    setupFallbackAuth(app);
  }
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
