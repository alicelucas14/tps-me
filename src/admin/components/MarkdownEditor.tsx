import React, { useState, useRef } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  HelpCircle,
  X,
  Check,
  Globe,
  Sparkles,
} from "lucide-react";

export interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  showToolbar?: boolean;
}

const PRESET_IMAGES = [
  {
    label: "Teen Patti Table",
    url: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Casino Poker Chips",
    url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "VIP Cards & Gold",
    url: "https://images.unsplash.com/photo-1541278107931-e006523892df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Mobile Gaming & Banking",
    url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
  },
];

export function MarkdownEditor({
  label,
  value,
  onChange,
  rows = 8,
  placeholder = "Write content here using markdown formatting or the toolbar above...",
  className = "",
  minHeight = "min-h-[140px]",
  showToolbar = true,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Link state
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Image state
  const [imgAlt, setImgAlt] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const handleInsert = (prefix: string, suffix: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    const currentVal = value || "";

    if (!textarea) {
      onChange(currentVal + `${prefix}${defaultText}${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textBefore = currentVal.substring(0, start);
    const textAfter = currentVal.substring(end);
    const selectedText = currentVal.substring(start, end);
    const textToInsert = selectedText || defaultText;

    // Line prefix handling for headings, quotes, lists
    let actualPrefix = prefix;
    if (
      (prefix.startsWith("#") || prefix.startsWith("-") || prefix.startsWith(">") || prefix.startsWith("1.")) &&
      start > 0 &&
      !textBefore.endsWith("\n")
    ) {
      actualPrefix = "\n" + prefix;
    }

    const replacement = `${actualPrefix}${textToInsert}${suffix}`;
    const newVal = textBefore + replacement + textAfter;

    onChange(newVal);

    setTimeout(() => {
      textarea.focus();
      const newStart = start + actualPrefix.length;
      const newEnd = newStart + textToInsert.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 10);
  };

  const openLinkDialog = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = (value || "").substring(start, end);
      setLinkText(selected || "Click Here");
    } else {
      setLinkText("Click Here");
    }
    setLinkUrl("https://");
    setShowLinkModal(true);
  };

  const openImageDialog = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = (value || "").substring(start, end);
      setImgAlt(selected || "Image Description");
    } else {
      setImgAlt("Image Description");
    }
    setImgUrl(PRESET_IMAGES[0].url);
    setShowImgModal(true);
  };

  const confirmInsertLink = () => {
    if (!linkUrl) return;
    const formatted = `[${linkText || "Link"}](${linkUrl})`;
    handleInsert(formatted);
    setShowLinkModal(false);
  };

  const confirmInsertImage = () => {
    if (!imgUrl) return;
    const formatted = `![${imgAlt || "Image"}](${imgUrl})\n`;
    handleInsert(formatted);
    setShowImgModal(false);
  };

  return (
    <div className={`flex flex-col rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-inner ${className}`}>
      {/* Optional Top Label Bar */}
      {label && (
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3.5 py-2">
          <label className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">{label}</label>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Formatting Cheat Sheet"
          >
            <HelpCircle className="h-3 w-3" />
            <span>Markdown Help</span>
          </button>
        </div>
      )}

      {/* Quick Markdown Cheat Sheet */}
      {showHelp && (
        <div className="border-b border-white/10 bg-emerald-950/40 p-3 text-[11px] text-white/70 space-y-1">
          <div className="font-semibold text-emerald-400 mb-1">Markdown Shortcuts:</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px]">
            <div><span className="text-amber-300"># Heading 1</span> &rarr; Large Title</div>
            <div><span className="text-amber-300">## Heading 2</span> &rarr; Section Title</div>
            <div><span className="text-amber-300">### Heading 3</span> &rarr; Subheading</div>
            <div><span className="text-emerald-300">[Text](URL)</span> &rarr; Hyperlink</div>
            <div><span className="text-emerald-300">![Alt](URL)</span> &rarr; Image</div>
            <div><span className="text-purple-300">**Bold**</span> &rarr; Bold Text</div>
            <div><span className="text-purple-300">*Italic*</span> &rarr; Italic Text</div>
            <div><span className="text-blue-300">- Item</span> &rarr; Bullet List</div>
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-black/60 px-2 py-1.5 overflow-x-auto custom-scrollbar">
          {/* Headings */}
          <div className="flex items-center gap-0.5 border-r border-white/10 pr-1.5 mr-1">
            <button
              type="button"
              onClick={() => handleInsert("# ", "", "Main Heading H1")}
              className="flex items-center gap-0.5 rounded px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Add Heading 1 (# H1)"
            >
              <Heading1 className="h-3.5 w-3.5" />
              <span>H1</span>
            </button>
            <button
              type="button"
              onClick={() => handleInsert("## ", "", "Section Heading H2")}
              className="flex items-center gap-0.5 rounded px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Add Heading 2 (## H2)"
            >
              <Heading2 className="h-3.5 w-3.5" />
              <span>H2</span>
            </button>
            <button
              type="button"
              onClick={() => handleInsert("### ", "", "Subheading H3")}
              className="flex items-center gap-0.5 rounded px-2 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Add Heading 3 (### H3)"
            >
              <Heading3 className="h-3.5 w-3.5" />
              <span>H3</span>
            </button>
          </div>

          {/* Inline Styles */}
          <div className="flex items-center gap-0.5 border-r border-white/10 pr-1.5 mr-1">
            <button
              type="button"
              onClick={() => handleInsert("**", "**", "bold text")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsert("*", "*", "italic text")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsert("~~", "~~", "strikethrough text")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Strikethrough (~~text~~)"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Links & Media Buttons */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-1.5 mr-1">
            <button
              type="button"
              onClick={openLinkDialog}
              className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
              title="Insert Link ([Text](URL))"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Link</span>
            </button>
            <button
              type="button"
              onClick={openImageDialog}
              className="flex items-center gap-1 rounded bg-blue-500/20 px-2 py-1 text-[11px] font-semibold text-blue-300 hover:bg-blue-500/30 transition-colors"
              title="Insert Image (![Alt](URL))"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Image</span>
            </button>
          </div>

          {/* Lists & Blockquote */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleInsert("- ", "", "List item")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Bullet List (- item)"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsert("1. ", "", "Numbered item")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Numbered List (1. item)"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsert("> ", "", "Important callout quote")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Quote (> text)"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsert("\n```\n", "\n```\n", "code block")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Code Block (``` code ```)"
            >
              <Code className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsert("\n---\n", "", "")}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              title="Horizontal Divider (---)"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Text Area */}
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent p-3.5 font-mono text-[13px] leading-relaxed text-white placeholder-white/20 focus:outline-none custom-scrollbar resize-y ${minHeight}`}
      />

      {/* LINK MODAL / POPOVER */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b0f14] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <LinkIcon className="h-4 w-4" />
                <span>Insert Hyperlink</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70">Display Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Official Download Guide"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Destination URL or Internal Path</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="e.g. https://example.com or /#/how-to-play"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-emerald-300 font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* Quick Internal Links */}
              <div>
                <label className="text-[10px] text-white/40 uppercase font-semibold">Quick Link Shortcuts:</label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {["/#/how-to-play", "/#/about-us", "/#/privacy-policy", "/#/download"].map((shortcut) => (
                    <button
                      key={shortcut}
                      type="button"
                      onClick={() => setLinkUrl(shortcut)}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/80 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300 transition-all"
                    >
                      {shortcut}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmInsertLink}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Insert Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL / POPOVER */}
      {showImgModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0f14] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <ImageIcon className="h-4 w-4" />
                <span>Insert Image into Article</span>
              </div>
              <button
                type="button"
                onClick={() => setShowImgModal(false)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70">Image Source URL</label>
                <input
                  type="text"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://domain.com/image.jpg"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-blue-300 font-mono focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">Alt Text / Caption</label>
                <input
                  type="text"
                  value={imgAlt}
                  onChange={(e) => setImgAlt(e.target.value)}
                  placeholder="e.g. Game table preview"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Preset Stock Images */}
              <div>
                <label className="text-[10px] text-white/40 uppercase font-semibold">Select High Quality Preset Image:</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {PRESET_IMAGES.map((preset) => (
                    <div
                      key={preset.url}
                      onClick={() => {
                        setImgUrl(preset.url);
                        setImgAlt(preset.label);
                      }}
                      className={`cursor-pointer overflow-hidden rounded-xl border p-2 text-left transition-all ${
                        imgUrl === preset.url
                          ? "border-blue-500 bg-blue-500/15"
                          : "border-white/10 bg-black/40 hover:border-white/20"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-16 w-full object-cover rounded-lg mb-1.5"
                      />
                      <span className="block text-[11px] font-semibold text-white/90 truncate">{preset.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowImgModal(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmInsertImage}
                className="flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Insert Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
