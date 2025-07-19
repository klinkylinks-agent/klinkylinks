import { Express, Request, Response } from "express";
import { isAuthenticated } from "./auth";
import { storage } from "./storage";
import { generateFingerprint, generateDmcaNotice, generateTemplate, reviewAndApprove } from "./some-utils"; 
// (assume these helpers are implemented in `server/some-utils.ts`)

export function setupRoutes(app: Express) {
  app.get("/api/user", isAuthenticated, (req: Request, res: Response) => {
    res.json(req.user);
  });

  app.get("/api/dashboard/stats", isAuthenticated, async (_req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  app.post("/api/content/analyze", isAuthenticated, async (req, res) => {
    const { contentType, suggestionsCount } = req.body;
    const result = await generateFingerprint(contentType, suggestionsCount);
    res.json(result);
  });

  app.post("/api/content/notice", isAuthenticated, async (req, res) => {
    const { matchData } = req.body;
    const notice = await generateDmcaNotice(matchData);
    res.json(notice);
  });

  app.post("/api/content/template", isAuthenticated, async (req, res) => {
    const { matchData } = req.body;
    const tpl = await generateTemplate(matchData);
    res.json(tpl);
  });

  app.post("/api/content/review", isAuthenticated, async (req, res) => {
    const { matchData, approve } = req.body;
    const out = await reviewAndApprove(matchData, approve);
    res.json(out);
  });

  // … other protected routes …

  // fallback for unmatched
  app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });
}
