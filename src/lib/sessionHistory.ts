import type { AnalyticsData } from "@/hooks/useWritingAnalytics";

export interface SessionRecord {
  id: string;
  date: string;
  textPreview: string;
  wordCount: number;
  score: number;
  scoreLabel: "human" | "uncertain" | "ai";
  wpm: number;
  duration: number;
  pasteCount: number;
  analytics: AnalyticsData;
}

const STORAGE_KEY = "writeguard-sessions";

export function getSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(analytics: AnalyticsData, text: string): SessionRecord | null {
  if (text.trim().length < 10) return null;

  const session: SessionRecord = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    textPreview: text.slice(0, 120).trim() + (text.length > 120 ? "..." : ""),
    wordCount: analytics.wordCount,
    score: analytics.score,
    scoreLabel: analytics.scoreLabel,
    wpm: analytics.wpm,
    duration: analytics.sessionDuration,
    pasteCount: analytics.pasteCount,
    analytics,
  };

  const sessions = getSessions();
  sessions.unshift(session);
  
  // Keep last 50
  if (sessions.length > 50) {
    sessions.length = 50;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return session;
}

export function deleteSession(id: string) {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function clearAllSessions() {
  localStorage.removeItem(STORAGE_KEY);
}
