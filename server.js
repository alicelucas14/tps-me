import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Gzip/Brotli compress all responses if compression package is available
try {
  const compressionModule = await import("compression");
  const compression = compressionModule.default || compressionModule;
  app.use(compression());
} catch {
  // Compression optional fallback
}
const PORT = process.env.PORT || 3001;

// Config file lives in dist/ so it's accessible as a static file fallback too
const DIST_DIR = path.join(__dirname, "dist");
// data/ lives OUTSIDE dist/ so npm run build never deletes it
const DATA_DIR = path.join(__dirname, "data");
const CONFIG_FILE = path.join(DATA_DIR, "site-config.json");
const BLOBS_FILE = path.join(DATA_DIR, "site-blobs.json");
const ACCOUNTS_FILE = path.join(DATA_DIR, "admin-accounts.json");

const DEFAULT_ROLE_PERMISSIONS = {
  "Super Admin": [
    "dashboard",
    "pages",
    "posts",
    "builder",
    "tournaments",
    "bonuses",
    "accounts",
    "footer",
    "settings",
  ],
  "Operations Manager": [
    "dashboard",
    "pages",
    "posts",
    "builder",
    "tournaments",
    "bonuses",
    "footer",
  ],
  "Content Editor": ["dashboard", "pages", "posts", "builder"],
  "Support Lead": ["dashboard", "tournaments", "bonuses"],
};

const DEFAULT_ACCOUNTS = [
  {
    id: "acc_root_master",
    username: "admin",
    name: "Master Administrator",
    role: "Super Admin",
    password: "admin123",
    status: "active",
    createdAt: "2026-01-01",
  },
];

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

// ── GET /api/admin/accounts ──────────────────────────────────────────────────
// Returns the server-side accounts and role permissions (initializes if missing)
app.get("/api/admin/accounts", (req, res) => {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, "utf-8"));
      return res.json({
        accounts: data.accounts || DEFAULT_ACCOUNTS,
        rolePermissions: data.rolePermissions || DEFAULT_ROLE_PERMISSIONS,
      });
    }

    // Initialize with defaults if not created yet
    const initialData = {
      accounts: DEFAULT_ACCOUNTS,
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,
    };
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(initialData, null, 2));
    res.json(initialData);
  } catch (err) {
    console.error("Error loading admin accounts:", err);
    res.status(500).json({ error: "Failed to load admin accounts" });
  }
});

// ── POST /api/admin/accounts ─────────────────────────────────────────────────
// Saves updated accounts and role permissions to disk. Requires secret header.
app.post("/api/admin/accounts", (req, res) => {
  const secret = req.headers["x-publish-secret"];
  if (secret !== PUBLISH_SECRET) {
    return res.status(401).json({ error: "Unauthorized — wrong publish secret" });
  }

  try {
    const { accounts, rolePermissions } = req.body;
    if (!Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({ error: "Invalid accounts payload" });
    }

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    const payload = {
      accounts,
      rolePermissions: rolePermissions || DEFAULT_ROLE_PERMISSIONS,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(payload, null, 2));
    console.log(`[${new Date().toISOString()}] Admin accounts synced (${accounts.length} accounts)`);
    res.json({ success: true, timestamp: payload.updatedAt });
  } catch (err) {
    console.error("Error saving admin accounts:", err);
    res.status(500).json({ error: "Failed to save admin accounts" });
  }
});

// ── POST /api/admin/login ────────────────────────────────────────────────────
// Verifies credentials directly against server-stored accounts
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username and password are required." });
  }

  try {
    let accountsData = { accounts: DEFAULT_ACCOUNTS, rolePermissions: DEFAULT_ROLE_PERMISSIONS };
    if (fs.existsSync(ACCOUNTS_FILE)) {
      try {
        accountsData = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, "utf-8"));
      } catch {}
    } else {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accountsData, null, 2));
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    const account = (accountsData.accounts || []).find(
      (a) => a.username.toLowerCase() === cleanUser
    );

    if (!account) {
      return res.status(401).json({ success: false, error: "Invalid username. Please check your credentials." });
    }

    if (account.status === "suspended") {
      return res.status(403).json({
        success: false,
        error: "This administrator account has been suspended. Please contact a Super Admin.",
      });
    }

    if (cleanPass !== account.password) {
      return res.status(401).json({ success: false, error: "Incorrect password. Access denied." });
    }

    const nowStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "numeric",
      month: "short",
    });

    // Update lastLogin for account
    account.lastLogin = nowStr;
    try {
      fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accountsData, null, 2));
    } catch {}

    res.json({
      success: true,
      user: {
        id: account.id,
        username: account.username,
        name: account.name,
        role: account.role,
        lastLogin: nowStr,
      },
      accounts: accountsData.accounts,
      rolePermissions: accountsData.rolePermissions || DEFAULT_ROLE_PERMISSIONS,
    });
  } catch (err) {
    console.error("Login verification error:", err);
    res.status(500).json({ success: false, error: "Server error during authentication" });
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
