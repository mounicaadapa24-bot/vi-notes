import { Lightbulb } from "lucide-react";

interface ExplanationPanelProps {
  explanations: string[];
}

const ExplanationPanel = ({ explanations }: ExplanationPanelProps) => (
  <div className="glass-card p-4">
    <div className="flex items-center gap-2 mb-3">
      <Lightbulb className="w-4 h-4 text-primary" />
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Why this score?</h4>
    </div>
    <ul className="space-y-1.5">
      {explanations.map((exp, i) => (
        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span>{exp}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ExplanationPanel;
