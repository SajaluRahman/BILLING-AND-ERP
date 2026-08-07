"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
  active: { label: "Active", variant: "default", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400" },
  inactive: { label: "Inactive", variant: "default", className: "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20 dark:text-slate-400" },
  pending: { label: "Pending", variant: "default", className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400" },
  completed: { label: "Completed", variant: "default", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", variant: "default", className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400" },
  delivered: { label: "Delivered", variant: "default", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400" },
  processing: { label: "Processing", variant: "default", className: "bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/20 dark:text-violet-400" },
  shipped: { label: "Shipped", variant: "default", className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20 dark:text-cyan-400" },
  returned: { label: "Returned", variant: "default", className: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20 dark:text-orange-400" },
  overdue: { label: "Overdue", variant: "default", className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400" },
  paid: { label: "Paid", variant: "default", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400" },
  partial: { label: "Partial", variant: "default", className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400" },
  unpaid: { label: "Unpaid", variant: "default", className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400" },
  draft: { label: "Draft", variant: "default", className: "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20 dark:text-slate-400" },
  approved: { label: "Approved", variant: "default", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400" },
  rejected: { label: "Rejected", variant: "default", className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400" },
  in_transit: { label: "In Transit", variant: "default", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400" },
  on_route: { label: "On Route", variant: "default", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400" },
  available: { label: "Available", variant: "default", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400" },
  maintenance: { label: "Maintenance", variant: "default", className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400" },
  scheduled: { label: "Scheduled", variant: "default", className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20 dark:text-indigo-400" },
  loading: { label: "Loading", variant: "default", className: "bg-violet-500/10 text-violet-600 border-violet-500/20 hover:bg-violet-500/20 dark:text-violet-400" },
  failed: { label: "Failed", variant: "default", className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400" },
  sent: { label: "Sent", variant: "default", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400" },
  received: { label: "Received", variant: "default", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400" },
  refunded: { label: "Refunded", variant: "default", className: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20 dark:text-purple-400" },
  dispatched: { label: "Dispatched", variant: "default", className: "bg-sky-500/10 text-sky-600 border-sky-500/20 hover:bg-sky-500/20 dark:text-sky-400" },
  low_stock: { label: "Low Stock", variant: "default", className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400" },
  out_of_stock: { label: "Out of Stock", variant: "default", className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400" },
  in_stock: { label: "In Stock", variant: "default", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
    variant: "outline" as const,
    className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-semibold border px-2 py-0.5 rounded-full",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
