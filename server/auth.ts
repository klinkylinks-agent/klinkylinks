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

    if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
      console.error("[AUTH] Missing env vars, using fallback auth");
      return setupFallbackAuth(app);
    }

    // Configure session store
    let sessionStore: session.Store;
    try {
      const PostgresStore = connectPg(session);
      sessionStore = new PostgresStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        tableName: "sessions",
      });
      console.log("[AUTH] PostgreSQL session store configured");
    } catch (err) {
      console.error("[AUTH] Postgres store failed, using memory store:", err);
      const MemoryStore = require('memorystore')(session);
      sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    }

    const sessionSettings: session.SessionOptions = {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
            const valid = await comparePasswords(password, user.password);
            if (!valid) {
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
        const { email, password, confirmPassword, firstName, lastName } = req.body;
        if (!email || !password || !confirmPassword) {
          return res.status(400).json({ message: "Email, password, and confirm password are required" });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }
        const existing = await storage.getUserByEmail(email);
        if (existing) {
          return res.status(400).json({ message: "Email already registered" });
        }
        const hashed = await hashPassword(password);
        const newUser = await storage.createUser({
          email,
          password: hashed,
          firstName: firstName || null,
          lastName: lastName || null,
          role: "user",
          subscriptionStatus: "free",
          subscriptionTier: "free",
        });
        req.logIn(newUser, (err) => {
          if (err) return next(err);
          res.status(201).json(newUser);
        });
      } catch (error: any) {
        console.error("[REGISTER] Error:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
      }
    });

    // Other routes (login, logout, user) handled elsewhere or via Passport
  } catch (error) {
    console.error("[AUTH] Setup failed:", error);
    setupFallbackAuth(app);
  }
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
