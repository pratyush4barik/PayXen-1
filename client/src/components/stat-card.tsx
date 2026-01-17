import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "default" | "primary" | "secondary" | "accent";
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = "default" }: StatCardProps) {
  const colorStyles = {
    default: "bg-card border-border/50",
    primary: "bg-primary/10 border-primary/20",
    secondary: "bg-secondary/50 border-white/5",
    accent: "bg-accent/10 border-accent/20",
  };

  const iconStyles = {
    default: "text-primary",
    primary: "text-primary",
    secondary: "text-muted-foreground",
    accent: "text-accent",
  };

  return (
    <Card className={`p-6 ${colorStyles[color]} shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-display text-foreground tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-background/50 backdrop-blur-sm ${iconStyles[color]} shadow-inner`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs font-medium">
          <span className={trendUp ? "text-green-500" : "text-red-500"}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
          <span className="text-muted-foreground ml-2">vs last month</span>
        </div>
      )}
    </Card>
  );
}
