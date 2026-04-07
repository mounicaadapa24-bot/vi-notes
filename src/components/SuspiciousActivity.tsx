import type { SuspiciousItem } from "@/hooks/useWritingAnalytics";
import { AlertTriangle, Info } from "lucide-react";

interface SuspiciousActivityProps {
  items: SuspiciousItem[];
}

const SuspiciousActivity = ({ items }: SuspiciousActivityProps) => {
  if (items.length === 0) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-success" />
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activity Status</h4>
        </div>
        <p className="text-sm text-success">No suspicious activity detected</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suspicious Activity</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-sm flex items-start gap-2 p-2 rounded-lg ${
            item.severity === "high" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
          }`}>
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuspiciousActivity;
