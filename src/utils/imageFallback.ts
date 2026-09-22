// Utility for reliable, high-resolution preview & cover images across blogs, posts, and pages
// Provides themed fallbacks for card games, Teen Patti, Rummy, Poker, Tournaments, Banking, and Strategy.

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


export const DEFAULT_FALLBACK_IMAGE = THEMED_IMAGE_POOLS.teenPatti[0];

/**
 * Compute a deterministic positive integer hash from a string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns true if an image URL is considered broken or inaccessible
 * (e.g. Empty, or pointing to dead WordPress uploads on teenpattistars.me)
 */
export function isBrokenImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.includes("teenpattistars.me/wp-content/uploads/")) return true;
  return false;
}

/**
 * Resolves an appropriate, high-resolution preview image based on the post metadata.
 */
export function getPostCoverImage(post: {
  coverImage?: string;
  category?: string;
  title?: string;
  slug?: string;
  id?: string;
}): string {
  // If the post already has a valid non-broken image, use it!
  if (post.coverImage && !isBrokenImageUrl(post.coverImage)) {
    return post.coverImage;
  }

  const text = `${post.title || ""} ${post.category || ""} ${post.slug || ""}`.toLowerCase();
  const seed = `${post.slug || post.id || post.title || "tps"}`;
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

/**
 * Resolves a cover image for static pages.
 */
export function getPageCoverImage(page: {
  coverImage?: string;
  title?: string;
  slug?: string;
  id?: string;
}): string {
  if (page.coverImage && !isBrokenImageUrl(page.coverImage)) {
    return page.coverImage;
  }
  return getPostCoverImage({
    coverImage: page.coverImage,
    title: page.title,
    slug: page.slug,
    id: page.id,
    category: "Official Page",
  });
}

/**
 * Replace broken teenpattistars.me image URLs inside markdown/content with working theme assets.
 */
export function resolveContentImageUrl(src: string, seed: string = "content"): string {
  if (!isBrokenImageUrl(src)) return src;
  const idx = hashString(src + seed);
  const pool = THEMED_IMAGE_POOLS.general;
  return pool[idx % pool.length];
}

/**
 * Graceful onError handler for <img> elements to replace failed images with a reliable fallback
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc: string = DEFAULT_FALLBACK_IMAGE
) {
  const target = e.currentTarget;
  if (target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
}
