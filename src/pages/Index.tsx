import { useEffect, useState } from "react";
import WritingEditor from "@/components/WritingEditor";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { useWritingAnalytics } from "@/hooks/useWritingAnalytics";
import { Shield, RotateCcw, Sun, Moon, Download } from "lucide-react";
import { exportReportPDF } from "@/lib/exportReport";

const Index = () => {
  const { text, analytics, pasteRanges, handleKeyDown, handleChange, handlePaste, reset } = useWritingAnalytics();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const handleReset = () => {
    reset();
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-card/60 backdrop-blur-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">VI Notes</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all duration-200 active:scale-95"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => exportReportPDF(analytics, text)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all duration-200 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all duration-200 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="lg:w-[70%] w-full min-h-[50vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border/50">
          <WritingEditor
            text={text}
            pasteRanges={pasteRanges}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onPaste={handlePaste}
          />
        </div>

        <div className="lg:w-[30%] w-full overflow-y-auto bg-muted/30">
          <AnalyticsPanel analytics={analytics} />
        </div>
      </div>
    </div>
  );
};

export default Index;
