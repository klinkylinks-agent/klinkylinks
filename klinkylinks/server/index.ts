import express from "express";
import { setupAuth } from "./auth";
// If you have other middleware or routers, import them here
// import { myRoutes } from "./routes";

const app = express();

// Authentication routes (register, login, logout, user info)
setupAuth(app);

// Example: API route for a protected resource
app.get("/api/protected", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ message: "This is a protected route." });
});

// Add other API routes here
// app.use("/api/items", itemsRouter);

// Catch-all for unknown routes (optional)
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running!");
});
