import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const THEMED_IMAGE_POOLS = {
  teenPatti: [
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
  ],
  rummy: [
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
  ],
  poker: [
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
  ],
  tournaments: [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
  ],
  banking: [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  ],
  lottery: [
    "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
  ],
  strategy: [
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
  ],
  general: [
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
  ],
};


function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getCoverFor(item) {
  const text = `${item.title || ""} ${item.category || ""} ${item.slug || ""}`.toLowerCase();
  const seed = `${item.slug || item.id || item.title || "tps"}`;
  const index = hashString(seed);

  let pool = THEMED_IMAGE_POOLS.general;

  if (text.includes("rummy") || text.includes("13 card") || text.includes("meld")) {
    pool = THEMED_IMAGE_POOLS.rummy;
  } else if (text.includes("poker") || text.includes("texas") || text.includes("holdem")) {
    pool = THEMED_IMAGE_POOLS.poker;
  } else if (text.includes("teen patti") || text.includes("3 patti") || text.includes("flush") || text.includes("blind")) {
    pool = THEMED_IMAGE_POOLS.teenPatti;
  } else if (text.includes("tournament") || text.includes("gala") || text.includes("trophy") || text.includes("leaderboard") || text.includes("championship")) {
    pool = THEMED_IMAGE_POOLS.tournaments;
  } else if (text.includes("upi") || text.includes("payout") || text.includes("withdraw") || text.includes("banking") || text.includes("deposit") || text.includes("kyc")) {
    pool = THEMED_IMAGE_POOLS.banking;
  } else if (text.includes("lottery") || text.includes("lucky") || text.includes("jackpot") || text.includes("coin")) {
    pool = THEMED_IMAGE_POOLS.lottery;
  } else if (text.includes("strateg") || text.includes("guide") || text.includes("hack") || text.includes("tip") || text.includes("rule")) {
    pool = THEMED_IMAGE_POOLS.strategy;
  }

  return pool[index % pool.length];
}

const postsPath = path.join(__dirname, "../src/data/wpPosts.json");
const pagesPath = path.join(__dirname, "../src/data/wpPages.json");

const posts = JSON.parse(fs.readFileSync(postsPath, "utf-8"));
let fixedPostsCount = 0;
let fixedContentImages = 0;

posts.forEach((post) => {
  if (!post.coverImage || post.coverImage.includes("teenpattistars.me") || post.coverImage.includes("photo-1518609878373") || post.coverImage.includes("photo-1516939884455") || post.coverImage.includes("photo-1528722828814")) {
    post.coverImage = getCoverFor(post);
    fixedPostsCount++;
  }
  if (post.content && post.content.includes("teenpattistars.me/wp-content/uploads/")) {
    post.content = post.content.replace(/https?:\/\/teenpattistars\.me\/wp-content\/uploads\/[^\s\)\"\']+/gi, (url) => {
      fixedContentImages++;
      const h = hashString(url);
      const pool = THEMED_IMAGE_POOLS.general;
      return pool[h % pool.length];
    });
  }
});

fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), "utf-8");
console.log(`Updated wpPosts.json: fixed ${fixedPostsCount} cover images, ${fixedContentImages} content image URLs.`);

const pages = JSON.parse(fs.readFileSync(pagesPath, "utf-8"));
let fixedPagesCount = 0;
pages.forEach((page) => {
  if (!page.coverImage || page.coverImage.includes("teenpattistars.me") || page.coverImage.includes("photo-1518609878373") || page.coverImage.includes("photo-1516939884455") || page.coverImage.includes("photo-1528722828814")) {
    page.coverImage = getCoverFor(page);
    fixedPagesCount++;
  }
  if (page.content && page.content.includes("teenpattistars.me/wp-content/uploads/")) {
    page.content = page.content.replace(/https?:\/\/teenpattistars\.me\/wp-content\/uploads\/[^\s\)\"\']+/gi, (url) => {
      const h = hashString(url);
      const pool = THEMED_IMAGE_POOLS.general;
      return pool[h % pool.length];
    });
  }
});


fs.writeFileSync(pagesPath, JSON.stringify(pages, null, 2), "utf-8");
console.log(`Updated wpPages.json: fixed ${fixedPagesCount} cover images.`);
