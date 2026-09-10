import type { BackgroundConfig } from "../store/siteStore";

interface GlobalBackgroundProps {
  background?: BackgroundConfig;
  colorMode?: "dark" | "light";
  isCanvas?: boolean;
}

export function GlobalBackground({
  background,
  colorMode = "dark",
  isCanvas = false,
}: GlobalBackgroundProps) {
  // If background configuration is not set, use default theme mode background
  const bgType = background?.type || "color";
  const defaultBgColor = colorMode === "light" ? "#f8fafc" : "#05080a";
  const positionClass = isCanvas ? "absolute" : "fixed";

  if (bgType === "color") {
    const color = background?.color || defaultBgColor;
    return (
      <div
        className={`${positionClass} inset-0 pointer-events-none z-0 transition-colors duration-300`}
        style={{ backgroundColor: color }}
      />
    );
  }

  if (bgType === "gradient") {
    const gradient =
      background?.gradient ||
      "linear-gradient(135deg, #05080a 0%, #062b1e 50%, #05080a 100%)";
    return (
      <div
        className={`${positionClass} inset-0 pointer-events-none z-0 transition-all duration-300`}
        style={{ background: gradient }}
      />
    );
  }

  if (bgType === "image") {
    const imageUrl = background?.imageUrl;
    const overlayOpacity = (background?.imageOverlayOpacity ?? 60) / 100;
    const overlayColor = background?.imageOverlayColor || (colorMode === "light" ? "#ffffff" : "#05080a");
    const blur = background?.imageBlur ?? 0;
    const size = background?.imageSize || "cover";
    const position = background?.imagePosition || "center";
    const attachment = isCanvas ? "scroll" : (background?.imageAttachment || "fixed");

    if (!imageUrl) {
      return (
        <div
          className={`${positionClass} inset-0 pointer-events-none z-0 transition-colors duration-300`}
          style={{ backgroundColor: defaultBgColor }}
        />
      );
    }

    return (
      <div className={`${positionClass} inset-0 pointer-events-none z-0 overflow-hidden`}>
        {/* Base solid color fallback */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />

        {/* Dynamic Background Image Layer */}
        <div
          className="absolute inset-0 transition-all duration-500 ease-out"
          style={{
            backgroundImage: `url("${imageUrl}")`,
            backgroundSize: size,
            backgroundPosition: position,
            backgroundRepeat: size === "repeat" ? "repeat" : "no-repeat",
            backgroundAttachment: attachment,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            transform: blur > 0 ? "scale(1.08)" : "none",
          }}
        />

        {/* Overlay Color & Opacity Layer for Readability */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${positionClass} inset-0 pointer-events-none z-0 ${
        colorMode === "light" ? "bg-[#f8fafc]" : "bg-[#05080a]"
      }`}
    />
  );
}
