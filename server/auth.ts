// server/auth.ts

import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage, UserRecord } from "./storage";

// Tell TS that req.user is our UserRecord
declare module "express-session" {
  interface Session {
    passport?: { user: string };
  }
}
declare global {
  namespace Express {
    interface User extends UserRecord {}
  }
}

export function setupAuth(app: express.Express) {
  app.use(
    session({
      secret: "dev-secret", // swap for env var in production
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport strategy for login
  passport.use(
    new LocalStrategy(async (email, password, done) => {
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return done(null, false, { message: "Invalid credentials" });
      }
      return done(null, user);
    })
  );

  // How to store user in session
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: string, done) => {
    // find by id in our map
    const all = Array.from(users.values());
    const user = all.find((u) => u.id === id) || null;
    done(null, user);
  });

  // Registration endpoint
  app.post("/api/register", express.json(), async (req, res, next) => {
    try {
      const { email, password } = req.body as { email?: any; password?: any };

      if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Email & password required" });
      }
      if (await storage.getUserByEmail(email)) {
        return res.status(400).json({ message: "Already registered" });
      }
      const user = await storage.createUser(email, password);
      // auto-login
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ id: user.id, email: user.email });
      });
    } catch (err) {
      next(err);
    }
  });

  // Login endpoint
  app.post(
    "/api/login",
    express.json(),
    passport.authenticate("local"),
    (req: Request, res: Response) => {
      // at this point, req.user is set
      res.json({ id: req.user!.id, email: req.user!.email });
    }
  );

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });
}

// middleware to protect routes
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
