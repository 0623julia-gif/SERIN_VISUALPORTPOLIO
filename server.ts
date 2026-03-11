import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("projects.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for large images (100MB)
  app.use(express.json({ limit: "110mb" }));
  app.use(express.urlencoded({ limit: "110mb", extended: true }));

  // API Routes
  app.get("/api/projects", (req, res) => {
    const rows = db.prepare("SELECT data FROM projects").all();
    const projects = rows.map((row: any) => JSON.parse(row.data));
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const project = req.body;
    db.prepare("INSERT OR REPLACE INTO projects (id, data) VALUES (?, ?)")
      .run(project.id, JSON.stringify(project));
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
