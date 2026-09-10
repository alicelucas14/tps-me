import React from "react";
import { ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Split by double newline for blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className={`space-y-5 leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 1
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="mt-8 mb-4 text-2xl md:text-3xl font-bold tracking-tight text-white border-b border-white/10 pb-3">
              {renderInline(trimmed.substring(2))}
            </h1>
          );
        }

        // Heading 2
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="mt-7 mb-3 text-xl md:text-2xl font-bold tracking-tight text-emerald-300">
              {renderInline(trimmed.substring(3))}
            </h2>
          );
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="mt-6 mb-2 text-lg md:text-xl font-bold text-amber-300">
              {renderInline(trimmed.substring(4))}
            </h3>
          );
        }

        // Horizontal divider
        if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
          return <hr key={idx} className="my-8 border-t border-white/10" />;
        }

        // Blockquote
        if (trimmed.startsWith("> ")) {
          const quoteLines = trimmed
            .split("\n")
            .map((l) => l.replace(/^>\s?/, ""))
            .join("\n");
          return (
            <blockquote
              key={idx}
              className="my-4 rounded-xl border-l-4 border-emerald-400 bg-emerald-500/10 px-5 py-3.5 italic text-emerald-100"
            >
              {renderInline(quoteLines)}
            </blockquote>
          );
        }

        // Standalone Image: ![alt](url) or loose !alt(url)
        const imageMatch = trimmed.match(/^!?\[?([^\]]*)\]?\((https?:\/\/[^)]+)\)$/i);
        if (imageMatch && (trimmed.startsWith("!") || /\.(png|jpe?g|webp|gif)/i.test(imageMatch[2]))) {
          const [, alt, src] = imageMatch;
          return (
            <figure key={idx} className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
              <img src={src} alt={alt || "Illustration"} className="w-full object-cover max-h-[480px]" />
              {alt && alt.trim() && (
                <figcaption className="px-4 py-2 text-center text-xs text-white/50 bg-black/60 border-t border-white/5">
                  {alt.replace(/!featured image - /i, "")}
                </figcaption>
              )}
            </figure>
          );
        }

        // Unordered List
        if (trimmed.split("\n").every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))) {
          const items = trimmed.split("\n").map((line) => line.trim().replace(/^[-*]\s+/, ""));
          return (
            <ul key={idx} className="my-4 space-y-2 pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5 text-white/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Ordered List
        if (trimmed.split("\n").every((line) => /^\d+\.\s+/.test(line.trim()))) {
          const items = trimmed.split("\n").map((line) => line.trim().replace(/^\d+\.\s+/, ""));
          return (
            <ol key={idx} className="my-4 space-y-2 pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-white/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-300">
                    {itemIdx + 1}
                  </span>
                  <span className="pt-0.5">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Code block
        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
          const codeLines = trimmed.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
          return (
            <pre key={idx} className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-300">
              <code>{codeLines}</code>
            </pre>
          );
        }

        // Regular Paragraph
        return (
          <p key={idx} className="text-white/80 text-[15px] leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Normalizes any internal/WP link to a clean working SPA path
 */
function normalizeLinkUrl(rawUrl: string): { href: string; isInternal: boolean } {
  let url = rawUrl.trim();
  
  // Clean WordPress domain links
  url = url.replace(/^https?:\/\/(www\.)?teenpattistars\.(me|com|in)\/?/i, "/");
  
  if (url === "/" || url === "") {
    return { href: "/", isInternal: true };
  }
  
  if (url.startsWith("/")) {
    const clean = url.replace(/^\/+|\/+$/g, "");
    return { href: clean ? `/${clean}` : "/", isInternal: true };
  }
  
  if (url.startsWith("#")) {
    return { href: url, isInternal: true };
  }

  return { href: url, isInternal: false };
}

/**
 * Parses inline elements: **bold**, *italic*, [link text](url), ![img](url), and `code`
 */
function renderInline(text: string): React.ReactNode {
  const tokenRegex = /(!\[([^\]]*)\]\(([^)]+)\))|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    const matchIndex = match.index;

    // Append text before match
    if (matchIndex > lastIndex) {
      elements.push(text.substring(lastIndex, matchIndex));
    }

    if (match[1]) {
      // Inline Image ![alt](url)
      const alt = match[2];
      const url = match[3];
      elements.push(
        <img
          key={matchIndex}
          src={url}
          alt={alt || "Illustration"}
          className="my-3 inline-block rounded-xl border border-white/10 max-h-72 object-cover shadow-lg"
        />
      );
    } else if (match[4]) {
      // Link [text](url) -> Backlinks & external links
      const linkText = match[5];
      const rawUrl = match[6];
      const { href, isInternal } = normalizeLinkUrl(rawUrl);

      elements.push(
        <a
          key={matchIndex}
          href={href}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className="inline-flex items-center gap-1 font-semibold text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 transition-all hover:text-emerald-300 hover:decoration-emerald-400"
        >
          <span>{linkText}</span>
          {!isInternal && <ExternalLink className="h-3 w-3 opacity-70" />}
        </a>
      );
    } else if (match[7]) {
      // Bold **text**
      elements.push(
        <strong key={matchIndex} className="font-bold text-white">
          {match[8]}
        </strong>
      );
    } else if (match[9]) {
      // Italic *text*
      elements.push(
        <em key={matchIndex} className="italic text-white/90">
          {match[10]}
        </em>
      );
    } else if (match[11]) {
      // Code `code`
      elements.push(
        <code key={matchIndex} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
          {match[12]}
        </code>
      );
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

