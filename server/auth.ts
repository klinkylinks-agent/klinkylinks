import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage, UserRecord } from "./storage";

// Tell TypeScript to expect our user record type on req.user
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
      secret: process.env.SESSION_SECRET ?? "replace-me-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on Vercel!
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // LocalStrategy for email/password login
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        const user = await storage.getUserByEmail(email);
        if (!user) return done(null, false, { message: "No user found" });
        const valid = await storage.verifyPassword(user, password);
        if (!valid) return done(null, false, { message: "Invalid password" });
        return done(null, user);
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user: Express.User, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await storage.getUserById(id);
    done(null, user || null);
  });

  // Registration endpoint (POST /api/register)
  app.post("/api/register", express.json(), async (req, res, next) => {
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
      const user = await storage.createUser(email, password, { firstName, lastName });
      req.logIn(user, err => {
        if (err) return next(err);
        res.status(201).json({ id: user.id, email: user.email });
      });
    } catch (err) {
      next(err);
    }
  });

  // Login endpoint (POST /api/login)
  app.post("/api/login", express.json(), passport.authenticate("local"), (req, res) => {
    res.json({ id: req.user!.id, email: req.user!.email });
  });

  // Logout endpoint (POST /api/logout)
  app.post("/api/logout", (req, res) => {
    req.logout(() => res.json({ success: true }));
  });

  // Get current user info (GET /api/user)
  app.get("/api/user", (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Not signed in" });
    res.json({ id: req.user.id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName });
  });
}

// Middleware to protect routes
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
