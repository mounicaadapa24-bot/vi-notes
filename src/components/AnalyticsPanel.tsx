import ScoreGauge from "./ScoreGauge";
import AnalyticsCard, { StatRow } from "./AnalyticsCard";
import SuspiciousActivity from "./SuspiciousActivity";
import ExplanationPanel from "./ExplanationPanel";
import type { AnalyticsData } from "@/hooks/useWritingAnalytics";
import { Keyboard, Clock, Clipboard, PenTool, BookOpen, Timer } from "lucide-react";

interface AnalyticsPanelProps {
  analytics: AnalyticsData;
}

const AnalyticsPanel = ({ analytics }: AnalyticsPanelProps) => {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <ScoreGauge score={analytics.score} label={analytics.scoreLabel} />

      <div className="grid grid-cols-2 gap-3">
        <AnalyticsCard title="Speed" icon={<Keyboard className="w-4 h-4" />}>
          <StatRow label="WPM" value={analytics.wpm} />
          <StatRow label="Avg ms/key" value={analytics.avgKeystrokeMs} />
        </AnalyticsCard>

        <AnalyticsCard title="Pauses" icon={<Clock className="w-4 h-4" />}>
          <StatRow label="Short" value={analytics.shortPauses} />
          <StatRow label="Long" value={analytics.longPauses} />
        </AnalyticsCard>

        <AnalyticsCard title="Paste" icon={<Clipboard className="w-4 h-4" />}>
          <StatRow label="Events" value={analytics.pasteCount} />
          <StatRow label="Chars" value={analytics.pastedChars} />
        </AnalyticsCard>

        <AnalyticsCard title="Edits" icon={<PenTool className="w-4 h-4" />}>
          <StatRow label="Count" value={analytics.editCount} />
          <StatRow label="Ratio" value={analytics.editRatio} />
        </AnalyticsCard>

        <AnalyticsCard title="Diversity" icon={<BookOpen className="w-4 h-4" />}>
          <StatRow label="Unique %" value={`${analytics.wordDiversity}%`} />
          <StatRow label="Sent. var" value={analytics.sentenceLengthVariation} />
        </AnalyticsCard>

        <AnalyticsCard title="Session" icon={<Timer className="w-4 h-4" />}>
          <StatRow label="Time" value={formatDuration(analytics.sessionDuration)} />
          <StatRow label="Words" value={analytics.wordCount} />
        </AnalyticsCard>
      </div>

      <SuspiciousActivity items={analytics.suspiciousItems} />
      <ExplanationPanel explanations={analytics.explanations} />
    </div>
  );
};

export default AnalyticsPanel;
