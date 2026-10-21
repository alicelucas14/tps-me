// Utility for reliable, high-resolution preview & cover images across blogs, posts, and pages
// Provides themed fallbacks for card games, Teen Patti, Rummy, Poker, Tournaments, Banking, and Strategy.

/**
 * The 4 stock photo IDs that were repetitively assigned to ~245 older imported posts.
 * Posts with these generic IDs are dynamically diversified across the themed pools below.
 */
export const GENERIC_STOCK_IMAGES = new Set([
  "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
]);

export const THEMED_IMAGE_POOLS = {
  teenPatti: [
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
  ],
  rummy: [
    "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=80",
  ],
  poker: [
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  ],
  tournaments: [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
  ],
  banking: [
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  ],
  lottery: [
    "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
  ],
  strategy: [
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  ],
  general: [
    "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=1200&q=80",
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
 * Returns true if the image is one of the repetitive generic stock photos
 * that should be upgraded to a diverse themed photo for older posts.
 */
export function isGenericStockImage(url?: string | null): boolean {
  if (!url || typeof url !== "string") return true;
  return GENERIC_STOCK_IMAGES.has(url.trim());
}

/**
 * Resolves an appropriate, high-resolution preview image based on the post metadata.
 * Prioritizes user-created/uploaded images (Data URLs or custom URLs), while
 * diversifying generic stock or missing images using deterministic keyword hashing.
 */
export function getPostCoverImage(post: {
  coverImage?: string;
  category?: string;
  title?: string;
  slug?: string;
  id?: string;
}): string {
  // If explicitly cleared/removed by the user (empty string, "none"), respect the removal!
  if (post.coverImage === "" || post.coverImage === "none" || post.coverImage === null) {
    return "";
  }

  // If the post has an existing image and it's not a dead/broken legacy WP upload link, keep it!
  if (post.coverImage && !isBrokenImageUrl(post.coverImage)) {
    return post.coverImage.trim();
  }

  const text = `${post.title || ""} ${post.category || ""} ${post.slug || ""}`.toLowerCase();
  const seed = `${post.slug || post.id || post.title || "tps"}`;
  const index = hashString(seed);

  let pool = THEMED_IMAGE_POOLS.general;

  if (text.includes("rummy") || text.includes("13 card") || text.includes("meld") || text.includes("deck")) {
    pool = THEMED_IMAGE_POOLS.rummy;
  } else if (text.includes("poker") || text.includes("texas") || text.includes("holdem") || text.includes("chips")) {
    pool = THEMED_IMAGE_POOLS.poker;
  } else if (text.includes("teen patti") || text.includes("3 patti") || text.includes("flush") || text.includes("blind") || text.includes("chaal")) {
    pool = THEMED_IMAGE_POOLS.teenPatti;
  } else if (text.includes("tournament") || text.includes("gala") || text.includes("trophy") || text.includes("leaderboard") || text.includes("championship")) {
    pool = THEMED_IMAGE_POOLS.tournaments;
  } else if (text.includes("upi") || text.includes("payout") || text.includes("withdraw") || text.includes("banking") || text.includes("deposit") || text.includes("cashout") || text.includes("kyc")) {
    pool = THEMED_IMAGE_POOLS.banking;
  } else if (text.includes("lottery") || text.includes("lucky") || text.includes("jackpot") || text.includes("bonus") || text.includes("coin")) {
    pool = THEMED_IMAGE_POOLS.lottery;
  } else if (text.includes("strateg") || text.includes("guide") || text.includes("hack") || text.includes("tip") || text.includes("rule") || text.includes("trick") || text.includes("learn")) {
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
  if (page.coverImage === "" || page.coverImage === "none" || page.coverImage === null) {
    return "";
  }
  if (page.coverImage && !isBrokenImageUrl(page.coverImage)) {
    return page.coverImage.trim();
  }
  return "";
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
