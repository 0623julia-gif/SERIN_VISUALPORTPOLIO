import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

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

const POST_PASSWORD = "0613";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
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
    const { project, password } = req.body;
    
    if (password !== POST_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    db.prepare("INSERT OR REPLACE INTO projects (id, data) VALUES (?, ?)")
      .run(project.id, JSON.stringify(project));
    
    // Broadcast update to all clients
    io.emit("projects:updated");
    
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { password } = req.body;

    if (password !== POST_PASSWORD) {
      return res.status(401).json({ error: "Invalid password" });
    }

    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    
    // Broadcast update to all clients
    io.emit("projects:updated");
    
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
