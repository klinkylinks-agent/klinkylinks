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
    if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
      console.error("[AUTH] Missing env vars, using fallback auth");
      return setupFallbackAuth(app);
    }

    let store: session.Store;
    try {
      const PgStore = connectPg(session);
      store = new PgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        tableName: "sessions",
      });
      console.log("[AUTH] PostgreSQL session store configured");
    } catch (err) {
      console.error("[AUTH] Postgres store failed, using memory store:", err);
      const MemoryStore = require("memorystore")(session);
      store = new MemoryStore({ checkPeriod: 86400000 });
    }

    app.set("trust proxy", 1);
    app.use(
      session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new LocalStrategy({ usernameField: "email" }, async (email, pw, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid credentials" });
          }
          if (!(await comparePasswords(pw, user.password))) {
            return done(null, false, { message: "Invalid credentials" });
          }
          return done(null, user);
        } catch (e) {
          return done(e as Error);
        }
      })
    );
    passport.serializeUser((u, d) => d(null, u.id));
    passport.deserializeUser(async (id: string, d) => {
      try {
        const u = await storage.getUser(id);
        d(null, u);
      } catch (e) {
        d(e as Error);
      }
    });

    // Registration
    app.post("/api/register", async (req, res, next) => {
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
        if (await storage.getUserByEmail(email)) {
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
      } catch (err: any) {
        console.error("[REGISTER] Error:", err);
        res.status(500).json({ message: err.message });
      }
    });
  } catch (err) {
    console.error("[AUTH] Setup failed, falling back:", err);
    setupFallbackAuth(app);
  }
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
