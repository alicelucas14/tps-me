import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  X,
  Check,
  Maximize2,
  Eye,
  FileCode,
  Upload,
} from "lucide-react";
import { MarkdownRenderer } from "../../components/MarkdownRenderer";
import { compressImageFile } from "../../utils/imageCompressor";

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
  placeholder = "Write content here...",
  className = "",
  minHeight = "min-h-[160px]",
  showToolbar = true,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Link state
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Image state
  const [imgAlt, setImgAlt] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [imgTab, setImgTab] = useState<"upload" | "url" | "presets">("upload");
  const [isImgCompressing, setIsImgCompressing] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [isImgDragging, setIsImgDragging] = useState(false);
  const editorFileInputRef = useRef<HTMLInputElement>(null);

  const handleEditorFileUpload = async (file: File) => {
    try {
      setIsImgCompressing(true);
      setImgError(null);
      const dataUrl = await compressImageFile(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.85,
        mimeType: "image/webp",
      });
      setImgUrl(dataUrl);
      if (!imgAlt.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        setImgAlt(cleanName);
      }
    } catch (err: any) {
      setImgError(err?.message || "Failed to process image file");
    } finally {
      setIsImgCompressing(false);
    }
  };

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

  const handleHeadingSelect = (headingType: string) => {
    if (headingType === "p") {
      // Remove leading # if any
      const textarea = textareaRef.current;
      if (textarea) {
        const val = value || "";
        const clean = val.replace(/^#+\s?/, "");
        onChange(clean);
      }
    } else if (headingType === "h1") {
      handleInsert("# ", "", "Heading 1");
    } else if (headingType === "h2") {
      handleInsert("## ", "", "Heading 2");
    } else if (headingType === "h3") {
      handleInsert("### ", "", "Heading 3");
    }
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
      setImgAlt(selected || "");
    } else {
      setImgAlt("");
    }
    setImgUrl("");
    setImgTab("upload");
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
    const formatted = `\n![${imgAlt || "Image"}](${imgUrl})\n`;
    handleInsert(formatted);
    setShowImgModal(false);
  };

  return (
    <div className={`flex flex-col rounded-xl border border-white/15 bg-[#0b0f14] overflow-hidden shadow-2xl ${className} ${isExpanded ? "fixed inset-4 z-[9999] bg-[#070a0e] shadow-2xl" : ""}`}>
      {/* Top Bar (Matching Elementor WordPress Screenshot 1) */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#06090c] px-3.5 py-2">
        {/* Left: Add Media Button */}
        <div className="flex items-center gap-2">
          {label && (
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider mr-2">
              {label}
            </span>
          )}
          <button
            type="button"
            onClick={openImageDialog}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            title="Insert image into content"
          >
            <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>+ Add Media</span>
          </button>
        </div>

        {/* Right: Visual / Code Mode Switcher & Fullscreen */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-black/60 p-0.5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setEditorMode("visual")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                editorMode === "visual"
                  ? "bg-white/15 text-white shadow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Eye className="h-3 w-3 text-emerald-400" />
              <span>Visual</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("code")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                editorMode === "code"
                  ? "bg-white/15 text-white shadow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <FileCode className="h-3 w-3 text-amber-400" />
              <span>Code</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            title={isExpanded ? "Minimize Editor" : "Fullscreen Editor"}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* WordPress Formatting Toolbar Row (Matching Screenshot 1) */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 bg-[#0d1217] px-3 py-2 text-xs">
          {/* Format Dropdown (Paragraph, H1, H2, H3) */}
          <select
            onChange={(e) => handleHeadingSelect(e.target.value)}
            defaultValue="p"
            className="rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 text-xs font-semibold text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
            title="Format Paragraph / Heading"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <div className="h-4 w-px bg-white/10 mx-0.5" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => handleInsert("**", "**", "bold text")}
            className="rounded-lg bg-white/5 p-1.5 font-bold text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => handleInsert("*", "*", "italic text")}
            className="rounded-lg bg-white/5 p-1.5 italic text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => handleInsert("<u>", "</u>", "underlined text")}
            className="rounded-lg bg-white/5 p-1.5 underline text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            title="Underline (<u>text</u>)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => handleInsert("~~", "~~", "strikethrough text")}
            className="rounded-lg bg-white/5 p-1.5 line-through text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            title="Strikethrough (~~text~~)"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-white/10 mx-0.5" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => handleInsert("- ", "", "List item")}
            className="rounded-lg bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => handleInsert("1. ", "", "Numbered item")}
            className="rounded-lg bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>

          {/* Quote */}
          <button
            type="button"
            onClick={() => handleInsert("> ", "", "Important callout quote")}
            className="rounded-lg bg-white/5 p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>

          {/* Link */}
          <button
            type="button"
            onClick={openLinkDialog}
            className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
            title="Insert Link"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Link</span>
          </button>
        </div>
      )}

      {/* Main Text Area / Visual Mode */}
      {editorMode === "code" ? (
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[#05080b] p-4 font-mono text-[13px] leading-relaxed text-emerald-300 placeholder-white/20 focus:outline-none custom-scrollbar resize-y ${minHeight}`}
        />
      ) : (
        <div className="relative flex flex-col flex-1">
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-transparent p-4 font-mono text-[13px] leading-relaxed text-white placeholder-white/20 focus:outline-none custom-scrollbar resize-y ${minHeight}`}
          />
          {value && (
            <div className="border-t border-white/10 bg-black/40 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">Live Formatted Preview:</div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/90">
                <MarkdownRenderer content={value} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
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
                  placeholder="e.g. Download Guide"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70">URL / Path</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /#/about-us"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-emerald-300 font-mono focus:border-emerald-400 focus:outline-none"
                />
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

      {/* IMAGE MODAL */}
      {showImgModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0f14] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <ImageIcon className="h-4 w-4" />
                <span>Add Media / Insert Image</span>
              </div>
              <button
                type="button"
                onClick={() => setShowImgModal(false)}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex rounded-lg bg-black/40 p-1 border border-white/10 mb-4">
              <button
                type="button"
                onClick={() => setImgTab("upload")}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                  imgTab === "upload"
                    ? "bg-blue-500 text-white shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImgTab("url")}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                  imgTab === "url"
                    ? "bg-blue-500 text-white shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Web URL
              </button>
              <button
                type="button"
                onClick={() => setImgTab("presets")}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                  imgTab === "presets"
                    ? "bg-blue-500 text-white shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Presets
              </button>
            </div>

            <div className="space-y-3">
              {/* TAB 1: UPLOAD */}
              {imgTab === "upload" && (
                <div>
                  <input
                    type="file"
                    ref={editorFileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleEditorFileUpload(file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsImgDragging(true);
                    }}
                    onDragLeave={() => setIsImgDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsImgDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleEditorFileUpload(file);
                    }}
                    onClick={() => editorFileInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      isImgDragging
                        ? "border-blue-400 bg-blue-500/15"
                        : "border-white/15 bg-black/40 hover:border-blue-400/50 hover:bg-black/60"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="rounded-full bg-blue-500/15 p-3 text-blue-400">
                        {isImgCompressing ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                        ) : (
                          <Upload className="h-5 w-5" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-white">
                        {isImgCompressing ? "Processing & compressing image..." : "Drag & drop image here"}
                      </div>
                      <div className="text-[11px] text-white/50">
                        or <span className="text-blue-400 underline">browse files from your device</span>
                      </div>
                    </div>
                  </div>
                  {imgError && <div className="mt-1 text-xs text-rose-400">{imgError}</div>}
                </div>
              )}

              {/* TAB 2: URL */}
              {imgTab === "url" && (
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
              )}

              {/* TAB 3: PRESETS */}
              {imgTab === "presets" && (
                <div>
                  <label className="text-[10px] text-white/40 uppercase font-semibold">Select High Quality Preset Media:</label>
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
              )}

              <div>
                <label className="text-[11px] font-semibold text-white/70">Alt Text / Caption</label>
                <input
                  type="text"
                  value={imgAlt}
                  onChange={(e) => setImgAlt(e.target.value)}
                  placeholder="Image description"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Selected Image Preview */}
              {imgUrl && (
                <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 flex items-center gap-3">
                  <img
                    src={imgUrl}
                    alt={imgAlt || "Preview"}
                    className="h-14 w-20 rounded-lg object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {imgUrl.startsWith("data:image/") ? "Custom Uploaded Image" : "Web Image"}
                    </div>
                    <div className="text-[10px] text-white/40 truncate">
                      {imgAlt || "(No caption)"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImgUrl("");
                      setImgAlt("");
                    }}
                    className="text-white/40 hover:text-rose-400 text-xs px-2 py-1"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
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
                disabled={!imgUrl || isImgCompressing}
                className="flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-400 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
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
