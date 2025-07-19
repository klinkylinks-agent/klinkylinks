// server/auth.ts

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage, CreateUserInput } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { setupFallbackAuth } from "./fallback-auth";

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

declare module "express" {
  interface User extends SelectUser {}
}

export function setupAuth(app: express.Express) {
  if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
    console.error("[AUTH] Missing env vars, using fallback auth");
    return setupFallbackAuth(app);
  }

  // Configure session store (Postgres or in-memory)
  let store: session.Store;
  try {
    const PgStore = connectPg(session);
    store = new PgStore({
      conString: process.env.DATABASE_URL,
      tableName: "sessions",
      createTableIfMissing: true,
    });
  } catch (err) {
    console.error("[AUTH] Postgres store failed, using memory store:", err);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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

  passport.serializeUser((user, done) => done(null, (user as SelectUser).id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (e) {
      done(e as Error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, confirmPassword, firstName, lastName } = req.body;

      if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: "Email, password & confirmPassword required" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (await storage.getUserByEmail(email)) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashed = await hashPassword(password);
      const input: CreateUserInput = {
        email,
        password: hashed,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        role: "user",
        subscriptionStatus: "free",
        subscriptionTier: "free",
      };

      const newUser = await storage.createUser(input);
      req.logIn(newUser, (err) => {
        if (err) return next(err);
        res.status(201).json(newUser);
      });
    } catch (err: any) {
      console.error("[REGISTER] Error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // Login, logout, other endpoints… add as needed
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
