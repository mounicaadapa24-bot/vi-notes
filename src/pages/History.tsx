import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSessions, deleteSession, clearAllSessions, type SessionRecord } from "@/lib/sessionHistory";
import { Shield, ArrowLeft, Trash2, Clock, FileText, Zap, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

const scoreIcon = (label: string) => {
  switch (label) {
    case "human": return <CheckCircle className="w-4 h-4 text-success" />;
    case "ai": return <AlertTriangle className="w-4 h-4 text-danger" />;
    default: return <HelpCircle className="w-4 h-4 text-warning" />;
  }
};

const scoreClass = (label: string) => {
  switch (label) {
    case "human": return "score-human score-bg-human";
    case "ai": return "score-ai score-bg-ai";
    default: return "score-uncertain score-bg-uncertain";
  }
};

const History = () => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string) => {
    deleteSession(id);
    setSessions(getSessions());
  };

  const handleClearAll = () => {
    clearAllSessions();
    setSessions([]);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
      " at " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-card/60 backdrop-blur-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/editor")}
            className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Session History</h1>
          </div>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl transition-all duration-200 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No sessions yet</h2>
            <p className="text-muted-foreground mb-6">Your writing sessions will appear here after you save them.</p>
            <button
              onClick={() => navigate("/editor")}
              className="px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 active:scale-95"
            >
              Start Writing
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="glass-card p-5 transition-all duration-200 hover:shadow-md group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {scoreIcon(session.scoreLabel)}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${scoreClass(session.scoreLabel)}`}>
                        {session.score}/100
                      </span>
                      <span className="text-xs text-muted-foreground">{formatDate(session.date)}</span>
                    </div>
                    <p className="text-sm text-foreground mb-3 line-clamp-2">{session.textPreview}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{session.wordCount} words</span>
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{session.wpm} WPM</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(session.duration)}</span>
                      {session.pasteCount > 0 && (
                        <span className="flex items-center gap-1 text-warning">📋 {session.pasteCount} paste{session.pasteCount > 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-destructive bg-secondary hover:bg-destructive/10 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
