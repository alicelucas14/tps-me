/**
 * High-performance client-side image compression and resizing utility.
 * Optimizes user-uploaded images (PNG, JPEG, WebP, AVIF) into compact Data URLs
 * to ensure fast rendering, low memory footprint, and reliable persistence.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  mimeType?: "image/webp" | "image/jpeg" | "image/png";
}

const DEFAULT_OPTIONS: CompressOptions = {
  maxWidth: 1400,
  maxHeight: 800,
  quality: 0.82,
  mimeType: "image/webp",
};

/**
 * Validates whether a file is an acceptable image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: `Invalid file type (${file.type}). Please select an image file (PNG, JPG, WebP, etc.).` };
  }
  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB raw file limit before compression
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File exceeds 25MB limit. Please choose a smaller image." };
  }
  return { valid: true };
}

/**
 * Compresses and resizes an image file to an optimized base64 Data URL.
 */
export function compressImageFile(file: File, options: CompressOptions = {}): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    // If not a browser environment, reject safely
    if (typeof window === "undefined" || typeof FileReader === "undefined") {
      reject(new Error("Image compression requires a browser environment."));
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));

    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error("Empty image data."));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error("Failed to parse image format."));

      img.onload = () => {
        try {
          let { width, height } = img;
          const maxW = opts.maxWidth || 1400;
          const maxH = opts.maxHeight || 800;

          // Downscale proportionally if larger than maximum boundaries
          if (width > maxW || height > maxH) {
            const ratio = Math.min(maxW / width, maxH / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            // Fallback: return raw read result if canvas 2D context is unavailable
            resolve(src);
            return;
          }

          // Enable high-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP export, fall back to JPEG if unsupported
          let result = "";
          try {
            result = canvas.toDataURL(opts.mimeType || "image/webp", opts.quality);
          } catch {
            result = canvas.toDataURL("image/jpeg", opts.quality || 0.85);
          }

          // Check if browser actually produced the requested format or fell back to png
          if (!result || result === "data:," || result.length < 50) {
            result = canvas.toDataURL("image/jpeg", 0.85);
          }

          resolve(result);
        } catch (err: any) {
          console.warn("Canvas compression failed, falling back to original data URL:", err);
          resolve(src);
        }
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}
