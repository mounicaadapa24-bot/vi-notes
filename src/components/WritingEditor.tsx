import { useRef, useEffect } from "react";
import type { PasteEvent } from "@/hooks/useWritingAnalytics";

interface WritingEditorProps {
  text: string;
  pasteRanges: PasteEvent[];
  onKeyDown: (e: React.KeyboardEvent) => void;
  onChange: (text: string) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}

const WritingEditor = ({ text, pasteRanges, onKeyDown, onChange, onPaste }: WritingEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and highlight layer
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Build highlighted text with paste ranges
  const renderHighlightedText = () => {
    if (pasteRanges.length === 0) return text;

    const sorted = [...pasteRanges].sort((a, b) => a.position - b.position);
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((range, i) => {
      const start = Math.min(range.position, text.length);
      const end = Math.min(range.endPosition, text.length);
      if (start > lastIndex) {
        parts.push(<span key={`t-${i}`}>{text.slice(lastIndex, start)}</span>);
      }
      if (start < end) {
        parts.push(
          <mark key={`p-${i}`} className="bg-danger/15 text-foreground rounded px-0.5">
            {text.slice(start, end)}
          </mark>
        );
      }
      lastIndex = end;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="end">{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger/60" />
          <div className="w-3 h-3 rounded-full bg-warning/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {text.length > 0 ? `${text.split(/\s+/).filter(Boolean).length} words` : "editor"}
        </span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {/* Highlight underlay */}
        {pasteRanges.length > 0 && (
          <div
            ref={highlightRef}
            className="absolute inset-0 p-6 text-lg leading-relaxed whitespace-pre-wrap break-words overflow-auto pointer-events-none opacity-100"
            style={{ fontFamily: "'Inter', sans-serif", color: "transparent" }}
            aria-hidden
          >
            {renderHighlightedText()}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onScroll={handleScroll}
          placeholder="Start typing your thoughts..."
          className="w-full h-full p-6 text-lg leading-relaxed bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground/40"
          style={{ fontFamily: "'Inter', sans-serif", caretColor: "hsl(var(--primary))" }}
          spellCheck
        />
      </div>
    </div>
  );
};

export default WritingEditor;
