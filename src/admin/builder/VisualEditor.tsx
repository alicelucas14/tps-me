import { useEffect } from "react";
import { BuilderHeader } from "./BuilderHeader";
import { LeftPanel } from "./LeftPanel";
import { BuilderCanvas } from "./BuilderCanvas";
import { useSiteStore } from "../../store/siteStore";

export function VisualEditor({ onExit }: { onExit: () => void }) {
  const { undo, redo, previewOnly } = useSiteStore();

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Don't intercept Ctrl+Z / Ctrl+Y when typing inside text inputs/textareas
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#05080a] text-white select-none">
      <BuilderHeader onExit={onExit} />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Control Dock (hidden in full preview mode) */}
        {!previewOnly && <LeftPanel />}

        {/* Center Live Canvas */}
        <BuilderCanvas />
      </div>
    </div>
  );
}
