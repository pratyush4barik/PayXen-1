import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { runMigrations } from "./migrate";
import { seed } from "./seed";

const app = express();
const httpServer = createServer(app);

/* ---------- middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ---------- routes ---------- */
registerRoutes(app);
serveStatic(app);

/* ---------- error handler ---------- */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* ---------- startup ---------- */
(async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      await runMigrations();
      await seed();
      console.log("✅ DB ready");
    }
  } catch (err) {
    console.error("❌ DB setup failed", err);
    // DO NOT EXIT
  }

  const PORT = Number(process.env.PORT) || 5000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
