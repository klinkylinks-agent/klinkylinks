// server/routes.ts

import express from "express";
import { isAuthenticated } from "./auth";

export function registerRoutes(app: express.Express) {
  // A protected example route
  app.get("/api/user", isAuthenticated, (req, res) => {
    // req.user is typed
    res.json({ id: req.user!.id, email: req.user!.email });
  });
}
