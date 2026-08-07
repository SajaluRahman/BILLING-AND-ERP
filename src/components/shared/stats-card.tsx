"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  format?: "currency" | "number" | "percentage";
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  description?: string;
  className?: string;
  delay?: number;
}

function useCountUp(end: number, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime.current) startTime.current = timestamp;
        const elapsed = timestamp - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, delay]);

  return count;
}

export function StatsCard({
  title,
  value,
  format = "number",
  icon: Icon,
  iconColor = "text-blue-500",
  iconBg = "bg-blue-500/10",
  trend,
  trendValue,
  description,
  className,
  delay = 0,
}: StatsCardProps) {
  const animatedValue = useCountUp(value, 1500, delay);

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return formatCurrency(val);
      case "percentage":
        return `${val}%`;
      default:
        return formatNumber(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 group",
        className
      )}>
        {/* Glassmorphism shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {title}
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {formatValue(animatedValue)}
              </p>
              {(trend || description) && (
                <div className="flex items-center gap-1.5">
                  {trend && trendValue !== undefined && (
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-1.5 py-0.5",
                      trend === "up" ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"
                    )}>
                      {trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {trendValue}%
                    </span>
                  )}
                  {description && (
                    <span className="text-xs text-muted-foreground">{description}</span>
                  )}
                </div>
              )}
            </div>
            <div className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl shrink-0",
              iconBg
            )}>
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
