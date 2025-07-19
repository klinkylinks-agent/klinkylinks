import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage, UserRecord } from "./storage";

declare module "express-session" {
  interface Session { passport?: { user: string } }
}
declare global {
  namespace Express { interface User extends UserRecord {} }
}

export function setupAuth(app: express.Express) {
  app.use(session({ secret: "dev-secret", resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (email, password, done) => {
    const u = await storage.getUserByEmail(email);
    return done(null, (!u || u.password !== password) ? false : u);
  }));

  passport.serializeUser((u, d) => d(null, u.id));
  passport.deserializeUser(async (id, d) => {
    const all = Array.from((storage as any).users.values());
    d(null, all.find(u => u.id === id) || null);
  });

  app.post("/api/register", express.json(), async (req, res, next) => {
    const { email, password } = req.body as any;
    if (!email || !password) return res.status(400).json({ message: "email+password required" });
    if (await storage.getUserByEmail(email)) return res.status(400).json({ message: "already registered" });
    const u = await storage.createUser(email, password);
    req.logIn(u, err => err ? next(err) : res.status(201).json({ id: u.id, email: u.email }));
  });

  app.post("/api/login", express.json(), passport.authenticate("local"), (req, res) => {
    res.json({ id: req.user!.id, email: req.user!.email });
  });

  app.post("/api/logout", (req, res) => req.logout(() => res.json({ ok: true })));
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  req.isAuthenticated() ? next() : res.status(401).json({ message: "unauthorized" });
}
