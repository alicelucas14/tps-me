import express from "express";
import compression from "compression";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Gzip/Brotli compress all responses — critical for the 4.3 MB index.html
app.use(compression());
const PORT = process.env.PORT || 3001;

// Config file lives in dist/ so it's accessible as a static file fallback too
const DIST_DIR = path.join(__dirname, "dist");
// data/ lives OUTSIDE dist/ so npm run build never deletes it
const DATA_DIR = path.join(__dirname, "data");
const CONFIG_FILE = path.join(DATA_DIR, "site-config.json");
const BLOBS_FILE = path.join(DATA_DIR, "site-blobs.json");


// Secret header to prevent random people from wiping config
// Set PUBLISH_SECRET env var on your server, e.g. in PM2 ecosystem.config.js
const PUBLISH_SECRET = process.env.PUBLISH_SECRET || "tps-publish-2025";

app.use(express.json({ limit: "100mb" })); // large limit for base64 images

// ── Serve static dist files first ──────────────────────────────────────────
app.use(express.static(DIST_DIR));

// ── GET /api/config ─────────────────────────────────────────────────────────
// Returns the server-side published config (or null if none saved yet)
app.get("/api/config", (req, res) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      // Attach blobs if they exist
      if (fs.existsSync(BLOBS_FILE)) {
        config.__blobs = JSON.parse(fs.readFileSync(BLOBS_FILE, "utf-8"));
      }
      return res.json(config);
    }
    res.json(null);
  } catch (err) {
    console.error("Error reading config:", err);
    res.status(500).json({ error: "Failed to read config" });
  }
});

// ── POST /api/publish ────────────────────────────────────────────────────────
// Saves the published config to disk. Requires secret header.
app.post("/api/publish", (req, res) => {
  const secret = req.headers["x-publish-secret"];
  if (secret !== PUBLISH_SECRET) {
    return res.status(401).json({ error: "Unauthorized — wrong publish secret" });
  }

  try {
    const { __blobs, ...config } = req.body;

    // Ensure data/ exists (not dist/ — build never touches data/)
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });


    // Save main config (without raw blobs — keep file size manageable)
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 0));

    // Save blobs (base64 images) separately
    if (__blobs && Object.keys(__blobs).length > 0) {
      fs.writeFileSync(BLOBS_FILE, JSON.stringify(__blobs, null, 0));
    }

    console.log(`[${new Date().toISOString()}] Config published successfully`);
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Error saving config:", err);
    res.status(500).json({ error: "Failed to save config" });
  }
});

// ── SPA fallback ─────────────────────────────────────────────────────────────
// All non-API, non-static routes serve index.html (for React Router)
app.get("*", (req, res) => {
  const indexFile = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(503).send("Site not built yet. Run: npm run build");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Teen Patti Stars server running on http://localhost:${PORT}`);
  console.log(`   Config file: ${CONFIG_FILE}`);
  console.log(`   To publish changes, use the admin panel Publish button.`);
});
