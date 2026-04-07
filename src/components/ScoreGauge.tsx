import { useMemo } from "react";

interface ScoreGaugeProps {
  score: number;
  label: "human" | "uncertain" | "ai";
}

const ScoreGauge = ({ score, label }: ScoreGaugeProps) => {
  const { color, bgClass, textClass, labelText } = useMemo(() => {
    switch (label) {
      case "human":
        return { color: "hsl(var(--success))", bgClass: "score-bg-human", textClass: "score-human", labelText: "Likely Human" };
      case "uncertain":
        return { color: "hsl(var(--warning))", bgClass: "score-bg-uncertain", textClass: "score-uncertain", labelText: "Uncertain" };
      case "ai":
        return { color: "hsl(var(--danger))", bgClass: "score-bg-ai", textClass: "score-ai", labelText: "Likely AI" };
    }
  }, [label]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Authenticity Score</h3>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${textClass} transition-colors duration-500`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${bgClass} ${textClass} transition-all duration-500`}>
        {labelText}
      </span>
    </div>
  );
};

export default ScoreGauge;
