import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by");
// Behind Cloudflare / a reverse proxy: trust the first hop so req.secure and req.ip are correct
app.set("trust proxy", 1);

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
const SESSION_SECRET_FILE = path.join(DATA_DIR, ".session-secret");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");
const IMMEDIATE_BACKUP_FILE = path.join(DATA_DIR, "site-config.backup.json");

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
const ADMIN_ROLES = Object.keys(DEFAULT_ROLE_PERMISSIONS);
const ADMIN_PAGES = DEFAULT_ROLE_PERMISSIONS["Super Admin"];

// Optional machine-to-machine publishing for scripts/ (x-publish-secret header).
// Disabled unless PUBLISH_SECRET is explicitly set on the server — there is no default.
const PUBLISH_SECRET =
  process.env.PUBLISH_SECRET && process.env.PUBLISH_SECRET.length >= 24 ? process.env.PUBLISH_SECRET : null;
if (process.env.PUBLISH_SECRET && !PUBLISH_SECRET) {
  console.warn("[security] PUBLISH_SECRET is shorter than 24 characters and has been ignored.");
}

// ── Security headers & body parsing ─────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  if (req.path.startsWith("/api/admin") || req.path.startsWith("/api/backups")) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

const smallJson = express.json({ limit: "1mb" });
const publishJson = express.json({ limit: "100mb" }); // large limit for base64 images
// /api/publish parses its (large) body only after the session has been checked
app.use((req, res, next) => (req.path === "/api/publish" ? next() : smallJson(req, res, next)));

// ── Admin authentication ────────────────────────────────────────────────────
// Passwords are stored as scrypt hashes and never leave the server. Signed-in
// admins carry an HMAC-signed, HttpOnly session cookie.
const SESSION_COOKIE = "tps_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MIN_PASSWORD_LENGTH = 8;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,40}$/;
// Shipped as the default in older versions and published in the repo — never accept it
const KNOWN_DEFAULT_PASSWORDS = new Set(["admin123"]);
const SCRYPT_KEYLEN = 64;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadSessionSecret() {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) return process.env.SESSION_SECRET;
  ensureDataDir();
  try {
    const existing = fs.readFileSync(SESSION_SECRET_FILE, "utf-8").trim();
    if (existing.length >= 32) return existing;
  } catch {}
  const generated = crypto.randomBytes(48).toString("base64url");
  fs.writeFileSync(SESSION_SECRET_FILE, generated, { mode: 0o600 });
  return generated;
}
const SESSION_SECRET = loadSessionSecret();

function hashPasswordSync(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

// Compared against a throwaway hash when the account doesn't exist, so response
// timing doesn't reveal which usernames are valid
const DUMMY_HASH = hashPasswordSync(crypto.randomBytes(16).toString("hex"));

function verifyPassword(password, stored) {
  return new Promise((resolve) => {
    const [scheme, saltB64, hashB64] = String(stored || DUMMY_HASH).split("$");
    const expected = Buffer.from(hashB64 || "", "base64");
    if (scheme !== "scrypt" || !saltB64 || expected.length !== SCRYPT_KEYLEN) return resolve(false);
    crypto.scrypt(String(password), Buffer.from(saltB64, "base64"), SCRYPT_KEYLEN, (err, derived) => {
      resolve(!err && Boolean(stored) && crypto.timingSafeEqual(derived, expected));
    });
  });
}

function sanitizeAccount(a) {
  return {
    id: a.id,
    username: a.username,
    name: a.name,
    role: a.role,
    status: a.status,
    createdAt: a.createdAt,
    lastLogin: a.lastLogin,
  };
}

function normalizeRolePermissions(input) {
  const out = {};
  for (const role of ADMIN_ROLES) {
    const pages = Array.isArray(input?.[role])
      ? input[role].filter((p) => ADMIN_PAGES.includes(p))
      : DEFAULT_ROLE_PERMISSIONS[role];
    out[role] = [...new Set(pages)];
  }
  // Super Admins must always keep accounts & settings, or nobody could undo a lockout
  out["Super Admin"] = [...new Set([...out["Super Admin"], "accounts", "settings"])];
  return out;
}

function readAccountsData() {
  if (!fs.existsSync(ACCOUNTS_FILE)) {
    return { accounts: [], rolePermissions: normalizeRolePermissions(DEFAULT_ROLE_PERMISSIONS) };
  }
  const data = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, "utf-8"));
  return {
    accounts: Array.isArray(data.accounts) ? data.accounts : [],
    rolePermissions: normalizeRolePermissions(data.rolePermissions),
  };
}

function writeAccountsData(data) {
  ensureDataDir();
  const payload = { ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(payload, null, 2), { mode: 0o600 });
}

function newAccountId() {
  return `acc_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
}

function formatLoginTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "numeric",
    month: "short",
  });
}

// One-time migration: older versions stored plaintext passwords (and shipped admin/admin123)
function migrateAccounts() {
  if (!fs.existsSync(ACCOUNTS_FILE)) return;
  const data = readAccountsData();
  let changed = false;
  for (const a of data.accounts) {
    if (typeof a.password !== "string") continue;
    const plain = a.password.trim();
    if (KNOWN_DEFAULT_PASSWORDS.has(plain)) {
      a.passwordHash = null;
      console.warn(`[security] '${a.username}' was using the public default password, so it has been disabled.`);
    } else {
      a.passwordHash = hashPasswordSync(plain);
    }
    delete a.password;
    a.sessionVersion = (a.sessionVersion || 0) + 1;
    changed = true;
  }
  if (changed) {
    writeAccountsData(data);
    console.log("[security] Migrated admin passwords to scrypt hashes.");
  }
}

function signSession(account, remember) {
  const ttl = remember ? REMEMBER_TTL_MS : SESSION_TTL_MS;
  const payload = Buffer.from(
    JSON.stringify({ u: account.id, v: account.sessionVersion || 0, r: remember ? 1 : 0, e: Date.now() + ttl })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function readSession(token) {
  if (typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return session.e > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function getCookie(req, name) {
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

function isHttps(req) {
  return (
    req.secure ||
    String(req.headers["x-forwarded-proto"] || "").includes("https") ||
    String(req.headers["cf-visitor"] || "").includes("https")
  );
}

function cookieOptions(req) {
  return { httpOnly: true, sameSite: "strict", secure: isHttps(req), path: "/" };
}

function setSessionCookie(req, res, account, remember) {
  res.cookie(SESSION_COOKIE, signSession(account, remember), {
    ...cookieOptions(req),
    // Without "remember me" the cookie ends with the browser session (the token itself expires after 12h)
    ...(remember ? { maxAge: REMEMBER_TTL_MS } : {}),
  });
}

function getSessionAccount(req) {
  const session = readSession(getCookie(req, SESSION_COOKIE));
  if (!session) return null;
  const data = readAccountsData();
  const account = data.accounts.find((a) => a.id === session.u);
  if (!account || account.status !== "active" || (account.sessionVersion || 0) !== session.v) return null;
  return { account, session, data };
}

function hasValidPublishSecret(req) {
  if (!PUBLISH_SECRET) return false;
  const given = Buffer.from(String(req.headers["x-publish-secret"] || ""));
  const expected = Buffer.from(PUBLISH_SECRET);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

// permission: the admin page the user's role must have, or null for any signed-in admin
function requireAdmin(permission = null, { allowPublishSecret = false } = {}) {
  return (req, res, next) => {
    if (allowPublishSecret && hasValidPublishSecret(req)) return next();
    let auth;
    try {
      auth = getSessionAccount(req);
    } catch (err) {
      console.error("Session check failed:", err);
      return res.status(500).json({ error: "Failed to verify session" });
    }
    if (!auth) return res.status(401).json({ error: "Your admin session has expired. Please sign in again." });
    if (permission && !(auth.data.rolePermissions[auth.account.role] || []).includes(permission)) {
      return res.status(403).json({ error: "Your role does not have access to this action." });
    }
    req.admin = auth;
    next();
  };
}

function sessionPayload(account, data) {
  const permissions = data.rolePermissions[account.role] || [];
  return {
    user: {
      id: account.id,
      username: account.username,
      name: account.name,
      role: account.role,
      lastLogin: account.lastLogin || "",
    },
    rolePermissions: data.rolePermissions,
    accounts: permissions.includes("accounts") ? data.accounts.map(sanitizeAccount) : [],
  };
}

// Brute-force protection: failed logins are counted per client IP and per username
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IP = 10;
const MAX_FAILURES_PER_USER = 20;
const loginFailures = new Map();

function clientIp(req) {
  return String(req.headers["cf-connecting-ip"] || req.ip || "unknown");
}

function isLoginBlocked(keys) {
  const now = Date.now();
  return keys.some(([key, max]) => {
    const entry = loginFailures.get(key);
    return entry && entry.resetAt > now && entry.count >= max;
  });
}

function recordLoginFailure(keys) {
  const now = Date.now();
  if (loginFailures.size > 10000) {
    for (const [key, entry] of loginFailures) if (entry.resetAt <= now) loginFailures.delete(key);
  }
  for (const [key] of keys) {
    const entry = loginFailures.get(key);
    if (!entry || entry.resetAt <= now) loginFailures.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    else entry.count++;
  }
}

// ── CLI: node server.js reset-password <username> [new-password] ────────────
// Sets (or creates, as a Super Admin) an account's password. Without a password
// argument a strong random one is generated and printed once.
if (process.argv[2] === "reset-password") {
  const username = String(process.argv[3] || "").trim();
  if (!USERNAME_PATTERN.test(username)) {
    console.error("Usage: node server.js reset-password <username> [new-password]");
    process.exit(1);
  }
  const password = process.argv[4] || crypto.randomBytes(12).toString("base64url");
  if (password.length < MIN_PASSWORD_LENGTH || KNOWN_DEFAULT_PASSWORDS.has(password)) {
    console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters and not a known default.`);
    process.exit(1);
  }
  migrateAccounts();
  const data = readAccountsData();
  let account = data.accounts.find((a) => String(a.username).toLowerCase() === username.toLowerCase());
  if (!account) {
    account = {
      id: newAccountId(),
      username,
      name: username,
      role: "Super Admin",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    data.accounts.push(account);
  }
  account.passwordHash = hashPasswordSync(password);
  account.sessionVersion = (account.sessionVersion || 0) + 1;
  account.status = "active";
  writeAccountsData(data);
  console.log(`Password for '${account.username}' (${account.role}) has been set.`);
  if (!process.argv[4]) console.log(`New password: ${password}`);
  process.exit(0);
}

try {
  migrateAccounts();
  const { accounts } = readAccountsData();
  if (!accounts.some((a) => a.status === "active" && a.passwordHash)) {
    console.warn("[security] No admin account can sign in. Create one with:");
    console.warn("           node server.js reset-password <username>");
  } else {
    for (const a of accounts.filter((acc) => !acc.passwordHash)) {
      console.warn(`[security] '${a.username}' has no password. Set one with: node server.js reset-password ${a.username}`);
    }
  }
} catch (err) {
  console.error("[security] Could not read admin accounts:", err.message);
}

// ── Dedicated Favicon & Logo Handlers ──────────────────────────────────────
app.get("/favicon.ico", (req, res) => {
  const icoFile = path.join(DIST_DIR, "favicon.ico");
  if (fs.existsSync(icoFile)) {
    res.setHeader("Content-Type", "image/x-icon");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.sendFile(icoFile);
  }
  const logoFile = path.join(DIST_DIR, "logo.png");
  if (fs.existsSync(logoFile)) {
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.sendFile(logoFile);
  }
  res.status(204).end();
});

app.get("/logo.png", (req, res) => {
  const logoFile = path.join(DIST_DIR, "logo.png");
  if (fs.existsSync(logoFile)) {
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.sendFile(logoFile);
  }
  res.status(404).end();
});

// ── Dedicated SEO & Crawler Handlers ──────────────────────────────────────
const PUBLIC_DIR = path.join(__dirname, "public");

app.get("/sitemap.xml", (req, res) => {
  const distFile = path.join(DIST_DIR, "sitemap.xml");
  const pubFile = path.join(PUBLIC_DIR, "sitemap.xml");
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  if (fs.existsSync(distFile)) return res.sendFile(distFile);
  if (fs.existsSync(pubFile)) return res.sendFile(pubFile);
  res.status(404).send("<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Sitemap not found</error>");
});

app.get("/robots.txt", (req, res) => {
  const distFile = path.join(DIST_DIR, "robots.txt");
  const pubFile = path.join(PUBLIC_DIR, "robots.txt");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  if (fs.existsSync(distFile)) return res.sendFile(distFile);
  if (fs.existsSync(pubFile)) return res.sendFile(pubFile);
  res.send("User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://teenpattistars.me/sitemap.xml\n");
});

app.get("/llms.txt", (req, res) => {
  const distFile = path.join(DIST_DIR, "llms.txt");
  const pubFile = path.join(PUBLIC_DIR, "llms.txt");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  if (fs.existsSync(distFile)) return res.sendFile(distFile);
  if (fs.existsSync(pubFile)) return res.sendFile(pubFile);
  res.status(404).send("# Teen Patti Stars — AI Guide\n");
});

// ── Serve static dist files first ──────────────────────────────────────────
app.use(express.static(DIST_DIR));

// ── Auto-heal & sanitize site config on server ──────────────────────────────
// Mirrors isLoremPlaceholder() in src/store/siteStore.ts
function isPlaceholderContent(value) {
  const serialized = JSON.stringify(value) || "";
  const lower = serialized.toLowerCase();
  return (
    lower.includes("lorem ipsum") ||
    lower.includes("dolor sit amet") ||
    lower.includes("placeholder-wire") ||
    serialized.includes("photo-1518609878373-06d740f60d8b") ||
    (lower.includes("1. idea") && lower.includes("2. prototype"))
  );
}

function sanitizeConfig(config) {
  if (!config || !Array.isArray(config.pages)) return { config, modified: false };
  let modified = false;

  let wpPages = [];
  try {
    const wpPagesFile = path.join(__dirname, "src", "data", "wpPages.json");
    if (fs.existsSync(wpPagesFile)) {
      wpPages = JSON.parse(fs.readFileSync(wpPagesFile, "utf-8"));
    }
  } catch (err) {
    console.warn("Could not read wpPages.json for server sanitizer:", err.message);
  }

  config.pages = config.pages.map((p) => {
    if (!p || !isPlaceholderContent(p)) return p;

    const cleanSlug = (p.slug || "").replace(/^\/+|\/+$/g, "").toLowerCase();
    const wpMatch = wpPages.find(
      (wp) => (wp.slug || "").replace(/^\/+|\/+$/g, "").toLowerCase() === cleanSlug
    );
    // Only heal when the bundled copy is real content; otherwise every request would "heal" again
    if (!wpMatch || isPlaceholderContent(wpMatch)) return p;

    modified = true;
    return {
      ...p,
      id: p.id || wpMatch.id,
      slug: wpMatch.slug.startsWith("/") ? wpMatch.slug : `/${wpMatch.slug}`,
      title: wpMatch.title,
      excerpt: wpMatch.excerpt,
      content: wpMatch.content,
      status: "published",
      coverImage: wpMatch.coverImage || "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
      createdAt: wpMatch.date || "2026-01-01",
      seo: {
        title: `${wpMatch.title} | Teen Patti Stars`,
        description: wpMatch.excerpt || `Official details and guide for ${wpMatch.title}`,
      },
      sections: [
        {
          id: `sec_text_${wpMatch.id || "clean"}`,
          type: "rich_text",
          label: "Page Document & Content",
          visible: true,
          data: {
            eyebrow: "Official Document",
            title: wpMatch.title,
            titleAccent: "Overview",
            subtitle: wpMatch.excerpt || `Official details regarding ${wpMatch.title}.`,
            content: wpMatch.content || `Content for ${wpMatch.title}`,
          },
        },
      ],
    };
  });

  // Ensure root sections always represent the home landing page
  const homePage = (config.pages || []).find((p) => p && (p.isHome || p.id === "page_home" || p.slug === "/"));
  const hasValidHeroSection = Array.isArray(config.sections) && config.sections.some((s) => s && (s.type === "hero" || s.id === "sec_hero"));

  if (!hasValidHeroSection) {
    if (homePage && Array.isArray(homePage.sections) && homePage.sections.some((s) => s && (s.type === "hero" || s.id === "sec_hero"))) {
      config.sections = homePage.sections;
      config.currentPageId = "page_home";
      modified = true;
    }
  }

  return { config, modified };
}

// Auto-heal CONFIG_FILE on disk at server launch
try {
  if (fs.existsSync(CONFIG_FILE)) {
    const raw = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    const { config: healed, modified } = sanitizeConfig(raw);
    if (modified) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(healed, null, 2), "utf-8");
      console.log("[server] Auto-healed site-config.json on startup (removed placeholder pages).");
    }
  }
} catch (bootErr) {
  console.warn("[server] Startup config sanitizer warning:", bootErr.message);
}

// Copies the current config into the rolling backups before it gets overwritten
function snapshotCurrentConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  const existingRaw = fs.readFileSync(CONFIG_FILE, "utf-8");
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  // Save immediate previous state
  fs.writeFileSync(IMMEDIATE_BACKUP_FILE, existingRaw);
  // Save timestamped rolling backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(BACKUPS_DIR, `site-config-${timestamp}.json`), existingRaw);

  // Keep at most 20 recent backups
  const backupFiles = fs.readdirSync(BACKUPS_DIR)
    .filter((f) => f.startsWith("site-config-") && f.endsWith(".json"))
    .sort();
  if (backupFiles.length > 20) {
    backupFiles.slice(0, backupFiles.length - 20).forEach((f) => {
      try { fs.unlinkSync(path.join(BACKUPS_DIR, f)); } catch {}
    });
  }
  return existingRaw;
}

// ── GET /api/config ─────────────────────────────────────────────────────────
// Returns the server-side published config (or null if none saved yet).
// The serialized response is cached until the files on disk change, and sent with
// an ETag so returning visitors get a 304 instead of re-downloading it.
let configCache = null;

function fileStamp(file) {
  try {
    const s = fs.statSync(file);
    return `${s.mtimeMs}:${s.size}`;
  } catch {
    return "none";
  }
}

function buildConfigResponse() {
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  const { config: cleanConfig, modified } = sanitizeConfig(config);
  if (modified) {
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(cleanConfig, null, 2), "utf-8");
      console.log("[server] Auto-healed and updated site-config.json to remove placeholder pages.");
    } catch (writeErr) {
      console.warn("[server] Could not rewrite sanitized config:", writeErr.message);
    }
  }
  const body = JSON.stringify(cleanConfig);
  // Attach only the blobs the config still references as __blob__<id>__ placeholders
  if (fs.existsSync(BLOBS_FILE)) {
    const referenced = new Set([...body.matchAll(/__blob__(.+?)__/g)].map((m) => m[1]));
    if (referenced.size > 0) {
      const blobs = JSON.parse(fs.readFileSync(BLOBS_FILE, "utf-8"));
      cleanConfig.__blobs = Object.fromEntries(Object.entries(blobs).filter(([id]) => referenced.has(id)));
      return JSON.stringify(cleanConfig);
    }
  }
  return body;
}

app.get("/api/config", (req, res) => {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return res.json(null);
    const stamp = () => `${fileStamp(CONFIG_FILE)}|${fileStamp(BLOBS_FILE)}`;
    if (!configCache || configCache.key !== stamp()) {
      const body = buildConfigResponse();
      configCache = {
        key: stamp(),
        body,
        etag: `"${crypto.createHash("sha1").update(body).digest("base64url")}"`,
      };
    }
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("ETag", configCache.etag);
    // Express answers 304 itself when If-None-Match matches the ETag
    res.type("application/json").send(configCache.body);
  } catch (err) {
    console.error("Error reading config:", err);
    res.status(500).json({ error: "Failed to read config" });
  }
});

// ── POST /api/publish ────────────────────────────────────────────────────────
// Saves the published config to disk. Requires a signed-in admin.
app.post("/api/publish", requireAdmin(null, { allowPublishSecret: true }), publishJson, (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "Invalid config payload" });
  }

  try {
    const { __blobs, deletedPostIds = [], deletedPageIds = [], ...config } = req.body;

    // Ensure data/ exists (not dist/ — build never touches data/)
    ensureDataDir();

    try {
      // Automated rolling backup before modifying config
      const existingRaw = snapshotCurrentConfig();

      // Safe merging: prevent accidental erasure of posts from older client drafts
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        if (Array.isArray(existing.posts) && Array.isArray(config.posts)) {
          const deletedSet = new Set((deletedPostIds || []).map(String));
          const incomingSlugs = new Set(config.posts.map((p) => (p.slug || "").replace(/^\/+|\/+$/g, "").toLowerCase()));
          const incomingIds = new Set(config.posts.map((p) => String(p.id)));

          // Retain existing posts unless they were explicitly deleted or already updated in payload
          const retained = existing.posts.filter((ep) => {
            const epSlug = (ep.slug || "").replace(/^\/+|\/+$/g, "").toLowerCase();
            const epId = String(ep.id);
            if (deletedSet.has(epId)) return false;
            return !incomingSlugs.has(epSlug) && !incomingIds.has(epId);
          });

          if (retained.length > 0) {
            console.log(`[Publish Safety] Retained ${retained.length} existing posts not present in payload.`);
            config.posts = [...config.posts, ...retained];
          }
        }
      }
    } catch (err) {
      console.warn("[Publish Safety] Error during backup or safe merge:", err);
    }

    // Save main config (without raw blobs — keep file size manageable)
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 0));

    // Save blobs (base64 images) separately
    if (__blobs && Object.keys(__blobs).length > 0) {
      fs.writeFileSync(BLOBS_FILE, JSON.stringify(__blobs, null, 0));
    }

    const who = req.admin ? `by ${req.admin.account.username}` : "via publish secret";
    console.log(`[${new Date().toISOString()}] Config published successfully ${who}`);
    res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Error saving config:", err);
    res.status(500).json({ error: "Failed to save config" });
  }
});

// ── GET /api/backups ────────────────────────────────────────────────────────
// Lists available rolling backups and inspects them
app.get("/api/backups", requireAdmin("settings", { allowPublishSecret: true }), (req, res) => {
  try {
    const files = fs.existsSync(BACKUPS_DIR)
      ? fs.readdirSync(BACKUPS_DIR).filter((f) => f.endsWith(".json")).sort().reverse()
      : [];

    const fileToGet = req.query.file;
    if (fileToGet) {
      const target = fileToGet === "immediate"
        ? IMMEDIATE_BACKUP_FILE
        : path.join(BACKUPS_DIR, path.basename(String(fileToGet)));
      if (fs.existsSync(target)) {
        return res.json(JSON.parse(fs.readFileSync(target, "utf-8")));
      }
      return res.status(404).json({ error: "Backup file not found" });
    }

    res.json({
      hasImmediateBackup: fs.existsSync(IMMEDIATE_BACKUP_FILE),
      backups: files,
    });
  } catch (err) {
    console.error("Error reading backups:", err);
    res.status(500).json({ error: "Failed to read backups" });
  }
});

// ── POST /api/backups/restore ───────────────────────────────────────────────
// Restores a specified backup or the immediate backup
app.post("/api/backups/restore", requireAdmin("settings", { allowPublishSecret: true }), (req, res) => {
  const { file } = req.body || {};
  const target = (file && file !== "immediate")
    ? path.join(BACKUPS_DIR, path.basename(String(file)))
    : IMMEDIATE_BACKUP_FILE;

  if (!fs.existsSync(target)) {
    return res.status(404).json({ error: "Backup target not found" });
  }

  try {
    const backupData = JSON.parse(fs.readFileSync(target, "utf-8"));
    // Snapshot first so a restore can itself be undone
    snapshotCurrentConfig();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(backupData, null, 0));
    console.log(`[Backups] Restored site-config from ${path.basename(target)}`);
    return res.json({ success: true, restoredFrom: path.basename(target) });
  } catch (err) {
    console.error("Error restoring backup:", err);
    return res.status(500).json({ error: "Failed to restore backup" });
  }
});

// ── POST /api/admin/login ────────────────────────────────────────────────────
// Verifies credentials against the hashed server-side accounts and starts a session
app.post("/api/admin/login", async (req, res) => {
  const { username, password, remember } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Username and password are required." });
  }

  const cleanUser = String(username).trim().toLowerCase();
  const limitKeys = [
    [`ip:${clientIp(req)}`, MAX_FAILURES_PER_IP],
    [`user:${cleanUser}`, MAX_FAILURES_PER_USER],
  ];
  if (isLoginBlocked(limitKeys)) {
    return res.status(429).json({
      success: false,
      error: "Too many failed sign-in attempts. Please wait 15 minutes and try again.",
    });
  }

  try {
    const account = readAccountsData().accounts.find((a) => String(a.username).toLowerCase() === cleanUser);
    const valid = await verifyPassword(String(password).trim(), account?.passwordHash);
    if (!account || !valid) {
      recordLoginFailure(limitKeys);
      return res.status(401).json({ success: false, error: "Invalid username or password." });
    }

    if (account.status !== "active") {
      return res.status(403).json({
        success: false,
        error: "This administrator account has been suspended. Please contact a Super Admin.",
      });
    }

    // Re-read after the async hash check so concurrent account edits aren't overwritten
    const data = readAccountsData();
    const current = data.accounts.find((a) => a.id === account.id);
    if (!current) return res.status(401).json({ success: false, error: "Invalid username or password." });
    current.lastLogin = formatLoginTime();
    try {
      writeAccountsData(data);
    } catch {}

    setSessionCookie(req, res, current, Boolean(remember));
    res.json({ success: true, ...sessionPayload(current, data) });
  } catch (err) {
    console.error("Login verification error:", err);
    res.status(500).json({ success: false, error: "Server error during authentication" });
  }
});

// ── POST /api/admin/logout ───────────────────────────────────────────────────
app.post("/api/admin/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE, cookieOptions(req));
  res.json({ success: true });
});

// ── GET /api/admin/session ───────────────────────────────────────────────────
// Lets the admin panel confirm its session is still valid on load
app.get("/api/admin/session", requireAdmin(), (req, res) => {
  res.json({ success: true, ...sessionPayload(req.admin.account, req.admin.data) });
});

// ── GET /api/admin/accounts ──────────────────────────────────────────────────
// Returns the accounts (without password hashes) and role permissions
app.get("/api/admin/accounts", requireAdmin("accounts"), (req, res) => {
  const { data } = req.admin;
  res.json({ accounts: data.accounts.map(sanitizeAccount), rolePermissions: data.rolePermissions });
});

// ── POST /api/admin/accounts ─────────────────────────────────────────────────
// Replaces the account list and role permissions. A `password` field on an
// account sets a new password; accounts without one keep their current hash.
app.post("/api/admin/accounts", requireAdmin("accounts"), (req, res) => {
  const fail = (status, error) => res.status(status).json({ success: false, error });

  try {
    const { accounts: incoming, rolePermissions } = req.body || {};
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return fail(400, "Invalid accounts payload");
    }

    const data = readAccountsData();
    const me = req.admin.account;
    const existingById = new Map(data.accounts.map((a) => [a.id, a]));
    const seenUsernames = new Set();
    const nextAccounts = [];

    for (const raw of incoming) {
      const username = String(raw?.username || "").trim();
      if (!USERNAME_PATTERN.test(username)) {
        return fail(400, `Invalid username '${username}'. Use 3-40 letters, numbers, dots, hyphens or underscores.`);
      }
      if (seenUsernames.has(username.toLowerCase())) {
        return fail(400, `Username '${username}' is used more than once.`);
      }
      seenUsernames.add(username.toLowerCase());

      if (!ADMIN_ROLES.includes(raw.role)) return fail(400, `Unknown role for '${username}'.`);
      const status = raw.status === "suspended" ? "suspended" : "active";
      const prev = existingById.get(raw.id);
      const password = typeof raw.password === "string" ? raw.password.trim() : "";

      if (!prev && !password) return fail(400, `A password is required for the new account '${username}'.`);
      if (password && password.length < MIN_PASSWORD_LENGTH) {
        return fail(400, `Passwords must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      }
      if (password && KNOWN_DEFAULT_PASSWORDS.has(password)) {
        return fail(400, "That password is publicly known. Please choose a different one.");
      }

      const validNewId = typeof raw.id === "string" && /^acc_[\w-]{1,60}$/.test(raw.id) && !existingById.has(raw.id);
      const passwordChanged = Boolean(password);
      const suspended = prev?.status === "active" && status === "suspended";
      nextAccounts.push({
        id: prev ? prev.id : validNewId ? raw.id : newAccountId(),
        username,
        name: String(raw.name || username).trim().slice(0, 80) || username,
        role: raw.role,
        status,
        createdAt: prev?.createdAt || new Date().toISOString().split("T")[0],
        lastLogin: prev?.lastLogin,
        passwordHash: passwordChanged ? hashPasswordSync(password) : prev.passwordHash,
        // Bumping the version signs out existing sessions for this account
        sessionVersion: (prev?.sessionVersion || 0) + (passwordChanged || suspended ? 1 : 0),
      });
    }

    if (new Set(nextAccounts.map((a) => a.id)).size !== nextAccounts.length) {
      return fail(400, "Duplicate account ids in payload.");
    }

    const meNext = nextAccounts.find((a) => a.id === me.id);
    if (!meNext || meNext.status !== "active") {
      return fail(400, "You cannot delete or suspend the account you are signed in with.");
    }
    if (!nextAccounts.some((a) => a.role === "Super Admin" && a.status === "active" && a.passwordHash)) {
      return fail(400, "There must be at least one active Super Admin.");
    }

    // Only Super Admins may touch Super Admin accounts or change what each role can do
    let nextRolePermissions = data.rolePermissions;
    if (me.role === "Super Admin") {
      if (rolePermissions) nextRolePermissions = normalizeRolePermissions(rolePermissions);
    } else {
      const touchesSuperAdmin =
        nextAccounts.some((a) => {
          const prev = existingById.get(a.id);
          if (a.role !== "Super Admin" && prev?.role !== "Super Admin") return false;
          return (
            !prev ||
            prev.role !== a.role ||
            prev.status !== a.status ||
            prev.username !== a.username ||
            prev.passwordHash !== a.passwordHash
          );
        }) ||
        data.accounts.some((a) => a.role === "Super Admin" && !nextAccounts.some((n) => n.id === a.id));
      if (touchesSuperAdmin) return fail(403, "Only a Super Admin can change Super Admin accounts.");
    }

    const nextData = { accounts: nextAccounts, rolePermissions: nextRolePermissions };
    writeAccountsData(nextData);

    // Changing your own password signs out other sessions; keep this one signed in
    if (meNext.sessionVersion !== (me.sessionVersion || 0)) {
      setSessionCookie(req, res, meNext, Boolean(req.admin.session.r));
    }

    console.log(`[${new Date().toISOString()}] Admin accounts updated by ${me.username} (${nextAccounts.length} accounts)`);
    res.json({
      success: true,
      accounts: nextAccounts.map(sanitizeAccount),
      rolePermissions: nextRolePermissions,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error saving admin accounts:", err);
    fail(500, "Failed to save admin accounts");
  }
});

// ── POST /api/admin/change-password ──────────────────────────────────────────
// Lets the signed-in admin change their own username and/or password
app.post("/api/admin/change-password", requireAdmin(), async (req, res) => {
  const fail = (status, error) => res.status(status).json({ success: false, error });
  const { currentPassword, newPassword, newUsername } = req.body || {};
  const me = req.admin.account;

  try {
    const valid = await verifyPassword(String(currentPassword || "").trim(), me.passwordHash);
    if (!valid) return fail(401, "Current password does not match.");

    const nextPassword = String(newPassword || "").trim();
    if (nextPassword && nextPassword.length < MIN_PASSWORD_LENGTH) {
      return fail(400, `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    }
    if (nextPassword && KNOWN_DEFAULT_PASSWORDS.has(nextPassword)) {
      return fail(400, "That password is publicly known. Please choose a different one.");
    }

    const username = String(newUsername || me.username).trim();
    if (!USERNAME_PATTERN.test(username)) {
      return fail(400, "Username must be 3-40 letters, numbers, dots, hyphens or underscores.");
    }

    const data = readAccountsData();
    if (data.accounts.some((a) => a.id !== me.id && String(a.username).toLowerCase() === username.toLowerCase())) {
      return fail(400, `Username '${username}' is already taken.`);
    }
    const account = data.accounts.find((a) => a.id === me.id);
    if (!account) return fail(404, "Account not found.");

    account.username = username;
    if (nextPassword) {
      account.passwordHash = hashPasswordSync(nextPassword);
      account.sessionVersion = (account.sessionVersion || 0) + 1;
    }
    writeAccountsData(data);

    setSessionCookie(req, res, account, Boolean(req.admin.session.r));
    res.json({ success: true, ...sessionPayload(account, data) });
  } catch (err) {
    console.error("Error changing password:", err);
    fail(500, "Failed to update credentials");
  }
});

// ── Unknown API routes ───────────────────────────────────────────────────────
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
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
