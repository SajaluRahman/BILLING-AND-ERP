import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculateGST(
  amount: number,
  gstRate: number
): { cgst: number; sgst: number; igst: number; total: number } {
  const gstAmount = (amount * gstRate) / 100;
  return {
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
    igst: gstAmount,
    total: amount + gstAmount,
  };
}

export function roundOff(amount: number): number {
  return Math.round(amount);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    delivered: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    processing: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    shipped: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    returned: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
    paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    partial: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    unpaid: "bg-red-500/10 text-red-500 border-red-500/20",
    draft: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    "in-transit": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "out-of-stock": "bg-red-500/10 text-red-500 border-red-500/20",
    "low-stock": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "in-stock": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };
  return colors[status.toLowerCase()] || colors.pending;
}
