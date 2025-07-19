// File: server/index.ts

import express from "express";
import path from "path";
import { setupAuth } from "./auth";
import { registerRoutes } from "./routes";

const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve static assets (if you have a frontend build in /dist/public)
app.use(express.static(path.join(__dirname, "public")));

// Initialize authentication (Passport + sessions, with fallback)
setupAuth(app);

// Register all API routes
registerRoutes(app);

// Catch-all for frontend routes (if using client-side routing)
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
