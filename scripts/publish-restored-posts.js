import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { restoredPosts } from "./restore-hyderabad-posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("1. Fetching current live config from https://teenpattistars.me/api/config...");
  const configRes = await fetch("https://teenpattistars.me/api/config", { cache: "no-store" });
  if (!configRes.ok) {
    throw new Error(`Failed to fetch config: HTTP ${configRes.status}`);
  }
  const liveConfig = await configRes.json();
  console.log(`Live config currently has ${liveConfig.posts?.length || 0} posts.`);

  // Merge restored posts into liveConfig.posts
  const currentPosts = [...(liveConfig.posts || [])];
  let addedCount = 0;

  for (const post of restoredPosts) {
    const existingIndex = currentPosts.findIndex(
      (p) => p.slug === post.slug || (p.id && p.id === post.id)
    );
    if (existingIndex !== -1) {
      console.log(`Updating existing post: ${post.slug}`);
      currentPosts[existingIndex] = { ...currentPosts[existingIndex], ...post };
    } else {
      console.log(`Adding missing post: ${post.slug}`);
      // Add right after or alongside the other Hyderabad posts
      const firstHydIdx = currentPosts.findIndex((p) => p.slug?.includes("hyderabad"));
      if (firstHydIdx !== -1) {
        currentPosts.splice(firstHydIdx, 0, post);
      } else {
        currentPosts.unshift(post);
      }
      addedCount++;
    }
  }

  liveConfig.posts = currentPosts;
  console.log(`Updated post count: ${currentPosts.length} (${addedCount} newly added).`);

  // Publish to live server
  console.log("2. Publishing updated config to https://teenpattistars.me/api/publish...");
  const publishRes = await fetch("https://teenpattistars.me/api/publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publish-secret": "tps-publish-2025",
    },
    body: JSON.stringify(liveConfig),
  });

  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.success) {
    throw new Error(`Publish failed: ${JSON.stringify(publishData)}`);
  }
  console.log("Publish success! Timestamp:", publishData.timestamp);

  // 3. Update local src/data/wpPosts.json to permanently retain these posts in repo
  const wpPostsPath = path.join(__dirname, "../src/data/wpPosts.json");
  if (fs.existsSync(wpPostsPath)) {
    const localPosts = JSON.parse(fs.readFileSync(wpPostsPath, "utf-8"));
    let localAdded = 0;
    for (const post of restoredPosts) {
      const idx = localPosts.findIndex((p) => p.slug === post.slug);
      if (idx !== -1) {
        localPosts[idx] = { ...localPosts[idx], ...post };
      } else {
        localPosts.unshift(post);
        localAdded++;
      }
    }
    fs.writeFileSync(wpPostsPath, JSON.stringify(localPosts, null, 2), "utf-8");
    console.log(`Updated ${wpPostsPath} with ${localAdded} posts.`);
  }

  // 4. Verification
  console.log("4. Verifying live posts via HTTP request...");
  const testSlugs = [
    "teen-patti-hyderabad-registration-easy-sign-up",
    "teen-patti-hyderabad-cash-game-play-online-win",
    "teen-patti-hyderabad-live-game-play-win-online",
  ];

  // Fetch updated config to verify
  const verifyRes = await fetch("https://teenpattistars.me/api/config", { cache: "no-store" });
  const verifyConfig = await verifyRes.json();
  for (const slug of testSlugs) {
    const found = verifyConfig.posts?.find((p) => p.slug === slug);
    console.log(`- /blog/${slug}: ${found ? "FOUND (" + found.title + ")" : "NOT FOUND!"}`);
  }

  console.log("All done!");
}

main().catch((err) => {
  console.error("Error in publish script:", err);
  process.exit(1);
});
