import express from "express";
import { isAuthenticated } from "./auth";

export function registerRoutes(app: express.Express) {
  app.get("/api/user", isAuthenticated, (req, res) => {
    res.json({ id: req.user!.id, email: req.user!.email });
  });
}
