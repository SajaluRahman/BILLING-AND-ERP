"use client";

import { motion } from "framer-motion";
import { type LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

const routeTitles: Record<string, string> = {
  dashboard: "Dashboard",
  companies: "Companies",
  brands: "Brands",
  products: "Products",
  inventory: "Inventory",
  warehouse: "Warehouses",
  purchases: "Purchases",
  customers: "Customers",
  routes: "Routes",
  deliveries: "Deliveries",
  vehicles: "Vehicles",
  drivers: "Drivers",
  sales: "Sales",
  billing: "Billing",
  collections: "Collections",
  expenses: "Expenses",
  accounting: "Accounting",
  reports: "Reports",
  notifications: "Notifications",
  settings: "Settings",
  users: "Users",
  new: "Create New",
};

export function PageHeader({ title, description, icon: Icon, actions, className }: PageHeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const titleText = routeTitles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return {
      title: titleText,
      href,
      isLast: index === segments.length - 1,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col gap-2.5", className)}
    >
      {/* Top Left Page Breadcrumb Trail */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />}
              {crumb.isLast ? (
                <span className="font-bold text-foreground">{crumb.title}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </motion.div>
  );
}
