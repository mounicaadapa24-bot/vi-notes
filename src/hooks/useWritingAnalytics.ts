import { useState, useCallback, useRef } from "react";

export interface PasteEvent {
  position: number;
  endPosition: number;
  length: number;
  timestamp: number;
}

export interface SuspiciousItem {
  type: "paste" | "no-pauses" | "speed-spike" | "constant-speed";
  message: string;
  severity: "high" | "medium" | "low";
}

export interface AnalyticsData {
  wpm: number;
  avgKeystrokeMs: number;
  shortPauses: number;
  longPauses: number;
  totalPauses: number;
  pasteCount: number;
  pastedChars: number;
  pasteEvents: PasteEvent[];
  editCount: number;
  editRatio: number;
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  paragraphCount: number;
  wordDiversity: number;
  sentenceLengthVariation: number;
  sessionDuration: number;
  score: number;
  scoreLabel: "human" | "uncertain" | "ai";
  suspiciousItems: SuspiciousItem[];
  explanations: string[];
}

const initialAnalytics: AnalyticsData = {
  wpm: 0,
  avgKeystrokeMs: 0,
  shortPauses: 0,
  longPauses: 0,
  totalPauses: 0,
  pasteCount: 0,
  pastedChars: 0,
  pasteEvents: [],
  editCount: 0,
  editRatio: 0,
  wordCount: 0,
  charCount: 0,
  sentenceCount: 0,
  paragraphCount: 0,
  wordDiversity: 0,
  sentenceLengthVariation: 0,
  sessionDuration: 0,
  score: 50,
  scoreLabel: "uncertain",
  suspiciousItems: [],
  explanations: [],
};

export function useWritingAnalytics() {
  const [text, setText] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics);
  const [pasteRanges, setPasteRanges] = useState<PasteEvent[]>([]);

  const keystrokeTimes = useRef<number[]>([]);
  const sessionStart = useRef<number>(Date.now());
  const totalKeystrokes = useRef(0);
  const editCountRef = useRef(0);
  const pasteEventsRef = useRef<PasteEvent[]>([]);
  const pastedCharsRef = useRef(0);
  const wpmSamples = useRef<number[]>([]);
  const lastWpmCalc = useRef(Date.now());
  const wordsAtLastCalc = useRef(0);

  const computeAnalytics = useCallback((currentText: string) => {
    const now = Date.now();
    const sessionDuration = (now - sessionStart.current) / 1000;

    const words = currentText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = currentText.length;
    const sentences = currentText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const paragraphs = currentText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const paragraphCount = Math.max(paragraphs.length, currentText.trim() ? 1 : 0);

    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z]/g, "")));
    const wordDiversity = wordCount > 0 ? (uniqueWords.size / wordCount) * 100 : 0;

    const sentenceLengths = sentences.map((s) => s.trim().split(/\s+/).length);
    let sentenceLengthVariation = 0;
    if (sentenceLengths.length > 1) {
      const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
      const variance = sentenceLengths.reduce((a, b) => a + (b - mean) ** 2, 0) / sentenceLengths.length;
      sentenceLengthVariation = Math.sqrt(variance);
    }

    const times = keystrokeTimes.current;
    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
      intervals.push(times[i] - times[i - 1]);
    }
    const avgKeystrokeMs = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;

    const wpm = sessionDuration > 5 ? (wordCount / sessionDuration) * 60 : 0;

    if (now - lastWpmCalc.current > 3000 && sessionDuration > 5) {
      const recentWords = wordCount - wordsAtLastCalc.current;
      const recentWpm = (recentWords / 3) * 60;
      if (recentWpm > 0) wpmSamples.current.push(recentWpm);
      lastWpmCalc.current = now;
      wordsAtLastCalc.current = wordCount;
    }

    let shortPauses = 0;
    let longPauses = 0;
    intervals.forEach((iv) => {
      if (iv >= 500 && iv < 2000) shortPauses++;
      if (iv >= 2000) longPauses++;
    });

    const editRatio = totalKeystrokes.current > 0 ? editCountRef.current / totalKeystrokes.current : 0;

    let score = 50;
    const explanations: string[] = [];
    const suspiciousItems: SuspiciousItem[] = [];

    const pasteRatio = charCount > 0 ? pastedCharsRef.current / charCount : 0;
    if (pasteRatio > 0.5) {
      score -= 30;
      explanations.push("High paste activity detected — most content was pasted");
      suspiciousItems.push({ type: "paste", message: "Over 50% of content was pasted", severity: "high" });
    } else if (pasteRatio > 0.2) {
      score -= 15;
      explanations.push("Moderate paste activity detected");
    } else if (pasteEventsRef.current.length === 0 && charCount > 20) {
      score += 10;
      explanations.push("No paste events — content appears typed");
    }

    pasteEventsRef.current.forEach((pe) => {
      if (pe.length > 200) {
        suspiciousItems.push({
          type: "paste",
          message: `Large pasted block at position ${pe.position}–${pe.endPosition} (${pe.length} chars)`,
          severity: "high",
        });
      }
    });

    if (totalKeystrokes.current > 30) {
      if (longPauses === 0 && shortPauses < 3) {
        score -= 15;
        explanations.push("Very few pauses detected — unnatural typing pattern");
        suspiciousItems.push({ type: "no-pauses", message: "Almost no pauses between keystrokes", severity: "medium" });
      } else if (longPauses > 3) {
        score += 10;
        explanations.push("Natural thinking pauses detected");
      } else {
        score += 5;
        explanations.push("Some pauses detected in typing");
      }
    }

    if (wpm > 120) {
      score -= 15;
      explanations.push("Unusually high typing speed");
      suspiciousItems.push({ type: "speed-spike", message: `Typing speed ${Math.round(wpm)} WPM is abnormally fast`, severity: "high" });
    } else if (wpm > 30 && wpm < 90) {
      score += 10;
      explanations.push("Typing speed is in natural range");
    }

    if (wpmSamples.current.length > 3) {
      const mean = wpmSamples.current.reduce((a, b) => a + b, 0) / wpmSamples.current.length;
      const variance = wpmSamples.current.reduce((a, b) => a + (b - mean) ** 2, 0) / wpmSamples.current.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
      if (cv < 0.1 && wpmSamples.current.length > 5) {
        score -= 10;
        explanations.push("Very constant typing speed — may indicate non-natural input");
        suspiciousItems.push({ type: "constant-speed", message: "Typing speed has almost no variation", severity: "medium" });
      } else if (cv > 0.2) {
        score += 5;
        explanations.push("Natural typing speed variation observed");
      }
    }

    if (totalKeystrokes.current > 20) {
      if (editRatio > 0.05 && editRatio < 0.3) {
        score += 10;
        explanations.push("Healthy editing behavior — corrections made while typing");
      } else if (editRatio < 0.02) {
        score -= 5;
        explanations.push("Very few corrections — unusually clean typing");
      }
    }

    if (sentenceCount > 3) {
      if (sentenceLengthVariation > 4) {
        score += 5;
        explanations.push("Good sentence length variation");
      } else if (sentenceLengthVariation < 2) {
        score -= 5;
        explanations.push("Uniform sentence lengths — common in AI text");
      }
    }

    if (wordDiversity > 60) {
      score += 5;
      explanations.push("High word diversity");
    } else if (wordDiversity < 40 && wordCount > 20) {
      score -= 5;
      explanations.push("Low word diversity");
    }

    score = Math.max(0, Math.min(100, score));
    const scoreLabel: "human" | "uncertain" | "ai" = score >= 70 ? "human" : score >= 40 ? "uncertain" : "ai";

    if (charCount < 20) {
      explanations.length = 0;
      explanations.push("Start typing to see analysis...");
    }

    setAnalytics({
      wpm: Math.round(wpm),
      avgKeystrokeMs: Math.round(avgKeystrokeMs),
      shortPauses,
      longPauses,
      totalPauses: shortPauses + longPauses,
      pasteCount: pasteEventsRef.current.length,
      pastedChars: pastedCharsRef.current,
      pasteEvents: [...pasteEventsRef.current],
      editCount: editCountRef.current,
      editRatio: Math.round(editRatio * 100) / 100,
      wordCount,
      charCount,
      sentenceCount,
      paragraphCount,
      wordDiversity: Math.round(wordDiversity),
      sentenceLengthVariation: Math.round(sentenceLengthVariation * 10) / 10,
      sessionDuration: Math.round(sessionDuration),
      score,
      scoreLabel,
      suspiciousItems,
      explanations,
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      totalKeystrokes.current++;
      keystrokeTimes.current.push(Date.now());
      if (keystrokeTimes.current.length > 500) {
        keystrokeTimes.current = keystrokeTimes.current.slice(-500);
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        editCountRef.current++;
      }
    },
    []
  );

  const handleChange = useCallback(
    (newText: string) => {
      setText(newText);
      computeAnalytics(newText);
    },
    [computeAnalytics]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const pasted = e.clipboardData.getData("text");
      if (pasted.length > 0) {
        const target = e.target as HTMLTextAreaElement;
        const pos = target.selectionStart || 0;
        const pe: PasteEvent = {
          position: pos,
          endPosition: pos + pasted.length,
          length: pasted.length,
          timestamp: Date.now(),
        };
        pasteEventsRef.current.push(pe);
        pastedCharsRef.current += pasted.length;
        setPasteRanges([...pasteEventsRef.current]);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setText("");
    setAnalytics(initialAnalytics);
    setPasteRanges([]);
    keystrokeTimes.current = [];
    sessionStart.current = Date.now();
    totalKeystrokes.current = 0;
    editCountRef.current = 0;
    pasteEventsRef.current = [];
    pastedCharsRef.current = 0;
    wpmSamples.current = [];
    lastWpmCalc.current = Date.now();
    wordsAtLastCalc.current = 0;
  }, []);

  return {
    text,
    analytics,
    pasteRanges,
    handleKeyDown,
    handleChange,
    handlePaste,
    reset,
  };
}
