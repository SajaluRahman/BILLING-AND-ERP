"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { ROLE_PERMISSIONS } from "@/lib/constants";
import {
  LayoutDashboard,
  Building2,
  Tags,
  Package,
  Warehouse,
  Boxes,
  ShoppingCart,
  Users,
  Route as RouteIcon,
  Truck,
  Car,
  UserCircle,
  Receipt,
  CreditCard,
  Wallet,
  PiggyBank,
  BookOpen,
  BarChart3,
  Bell,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronDown,
  Droplets,
  X,
  LogOut,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  permissions?: string[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permissions: ["dashboard.view"] },
    ],
  },
  {
    title: "Organization",
    items: [
      { title: "Companies", href: "/dashboard/companies", icon: Building2, permissions: ["companies.view"] },
      { title: "Brands", href: "/dashboard/brands", icon: Tags, permissions: ["brands.view"] },
    ],
  },
  {
    title: "Inventory",
    items: [
      { title: "Products", href: "/dashboard/products", icon: Package, permissions: ["products.view"] },
      { title: "Inventory", href: "/dashboard/inventory", icon: Boxes, permissions: ["inventory.view"] },
      { title: "Warehouses", href: "/dashboard/warehouse", icon: Warehouse, permissions: ["warehouse.view"] },
    ],
  },
  {
    title: "Sales & Billing",
    items: [
      { title: "Sales Orders", href: "/dashboard/sales", icon: ShoppingCart, permissions: ["sales.view"] },
      { title: "Billing", href: "/dashboard/billing", icon: Receipt, permissions: ["billing.view"] },
      { title: "Purchases", href: "/dashboard/purchases", icon: ClipboardList, permissions: ["purchases.view"] },
    ],
  },
  {
    title: "Distribution",
    items: [
      { title: "Customers", href: "/dashboard/customers", icon: Users, permissions: ["customers.view"] },
      { title: "Routes", href: "/dashboard/routes", icon: RouteIcon, permissions: ["routes.view"] },
      { title: "Deliveries", href: "/dashboard/deliveries", icon: Truck, permissions: ["deliveries.view"] },
      { title: "Vehicles", href: "/dashboard/vehicles", icon: Car, permissions: ["vehicles.view"] },
      { title: "Drivers", href: "/dashboard/drivers", icon: UserCircle, permissions: ["drivers.view"] },
    ],
  },
  {
    title: "Finance",
    items: [
      { title: "Collections", href: "/dashboard/collections", icon: Wallet, permissions: ["collections.view"] },
      { title: "Expenses", href: "/dashboard/expenses", icon: CreditCard, permissions: ["expenses.view"] },
      { title: "Accounting", href: "/dashboard/accounting", icon: BookOpen, permissions: ["accounting.view"] },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Reports", href: "/dashboard/reports", icon: BarChart3, permissions: ["reports.view"] },
      { title: "Notifications", href: "/dashboard/notifications", icon: Bell, permissions: ["notifications.view"] },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Users", href: "/dashboard/users", icon: UserCog, permissions: ["users.view"] },
      { title: "Settings", href: "/dashboard/settings", icon: Settings, permissions: ["settings.view"] },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuthStore();
  const { isCollapsed, isMobileOpen, toggle, setMobileOpen } = useSidebarStore();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Overview"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const filteredGroups = navigationGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (!item.permissions) return true;
      if (!user) return false;
      const rolePerms = ROLE_PERMISSIONS[user.role] || [];
      if (rolePerms.includes("*")) return true;
      return item.permissions.some((p) => rolePerms.includes(p));
    }),
  })).filter((group) => group.items.length > 0);

  if (!mounted) return null;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-border/50",
        isCollapsed && "justify-center px-2"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/25 shrink-0">
            <Droplets className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold tracking-tight">AquaFlow</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">ERP System</span>
            </motion.div>
          )}
        </Link>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden h-8 w-8"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:flex h-8 w-8 hover:bg-accent"
          onClick={toggle}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-200",
            isCollapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-4 space-y-1">
        <nav className="space-y-1">
          {filteredGroups.map((group) => (
            <div key={group.title} className="mb-4">
              {!isCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                >
                  {group.title}
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    expandedGroups.includes(group.title) && "rotate-180"
                  )} />
                </button>
              ) : (
                <Separator className="my-2" />
              )}

              <AnimatePresence initial={false}>
                {(isCollapsed || expandedGroups.includes(group.title)) && (
                  <motion.div
                    initial={isCollapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 mt-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;

                        const link = (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent",
                              isCollapsed && "justify-center px-2"
                            )}
                          >
                            <Icon className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            {!isCollapsed && (
                              <>
                                <span className="truncate">{item.title}</span>
                                {item.badge !== undefined && item.badge > 0 && (
                                  <span className={cn(
                                    "ml-auto text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center",
                                    isActive
                                      ? "bg-primary-foreground/20 text-primary-foreground"
                                      : "bg-destructive/10 text-destructive"
                                  )}>
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active"
                                className="absolute inset-0 rounded-lg bg-primary -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </Link>
                        );

                        if (isCollapsed) {
                          return (
                            <Tooltip key={item.href}>
                              <TooltipTrigger render={link} />
                              <TooltipContent side="right" className="font-medium">
                                {item.title}
                              </TooltipContent>
                            </Tooltip>
                          );
                        }

                        return link;
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className={cn(
        "border-t border-border/50 p-3",
        isCollapsed && "flex justify-center"
      )}>
        {user && (
          <div className={cn(
            "flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors",
            isCollapsed && "justify-center p-1"
          )}>
            <Avatar className="h-8 w-8 ring-2 ring-border">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {user.role.replace(/_/g, " ")}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 272 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden md:flex h-screen flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl fixed left-0 top-0 z-40"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 z-50 h-screen w-[272px] border-r border-border/50 bg-card md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
