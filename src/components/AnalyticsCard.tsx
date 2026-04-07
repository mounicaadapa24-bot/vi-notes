import { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const AnalyticsCard = ({ title, icon, children }: AnalyticsCardProps) => (
  <div className="glass-card p-4 transition-all duration-200 hover:shadow-md">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-primary">{icon}</span>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h4>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

export const StatRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold text-foreground">{value}</span>
  </div>
);

export default AnalyticsCard;
