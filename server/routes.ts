// File: server/routes.ts

import { Express, Request, Response } from "express";
import { isAuthenticated } from "./auth";
import { storage } from "./storage";
import {
  generateFingerprint,
  generateDmcaNotice,
  generateTemplate,
  reviewAndApprove,
} from "./some-utils";

// Rename setupRoutes to registerRoutes so server/index.ts can import it
export function registerRoutes(app: Express) {
  // Return the authenticated user
  app.get("/api/user", isAuthenticated, (req: Request, res: Response) => {
    res.json(req.user);
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (_req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Analyze content
  app.post("/api/content/analyze", isAuthenticated, async (req: Request, res: Response) => {
    const { contentType, suggestionsCount } = req.body;
    const result = await generateFingerprint(contentType, suggestionsCount);
    res.json(result);
  });

  // Generate DMCA notice
  app.post("/api/content/notice", isAuthenticated, async (req: Request, res: Response) => {
    const { matchData } = req.body;
    const notice = await generateDmcaNotice(matchData);
    res.json(notice);
  });

  // Generate a template
  app.post("/api/content/template", isAuthenticated, async (req: Request, res: Response) => {
    const { matchData } = req.body;
    const tpl = await generateTemplate(matchData);
    res.json(tpl);
  });

  // Review & approve
  app.post("/api/content/review", isAuthenticated, async (req: Request, res: Response) => {
    const { matchData, approve } = req.body;
    const out = await reviewAndApprove(matchData, approve);
    res.json(out);
  });

  // Catch-all 404
  app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });
}
