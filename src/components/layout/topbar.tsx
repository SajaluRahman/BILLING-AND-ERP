"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Building2,
  ChevronDown,
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  BookOpen,
  Settings,
  X,
  ArrowRight,
  TrendingUp,
  Truck,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/notification-store";
import { mockCompanies } from "@/lib/mock-data";
import { getInitials, formatRelativeTime, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SEARCH_PAGES = [
  { title: "Dashboard Overview", href: "/dashboard", category: "Navigation", icon: LayoutDashboard },
  { title: "Products & Stock Catalog", href: "/dashboard/products", category: "Inventory", icon: Package },
  { title: "Customer Accounts & Ledger", href: "/dashboard/customers", category: "Distribution", icon: Users },
  { title: "Billing & Invoices", href: "/dashboard/billing", category: "Sales", icon: Receipt },
  { title: "Create New Bill", href: "/dashboard/billing/new", category: "Action", icon: Plus },
  { title: "Accounting & GST Filing", href: "/dashboard/accounting", category: "Finance", icon: BookOpen },
  { title: "Sales Orders", href: "/dashboard/sales", category: "Sales", icon: TrendingUp },
  { title: "Deliveries & Routes", href: "/dashboard/deliveries", category: "Distribution", icon: Truck },
  { title: "Settings & Templates", href: "/dashboard/settings", category: "System", icon: Settings },
];

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setMobileOpen } = useSidebarStore();
  const { user, logout, companyId, switchCompany } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [mounted, setMounted] = useState(false);

  // Search Dialog State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentCompany = mockCompanies.find((c) => c.id === companyId) || mockCompanies[0];
  const recentNotifications = notifications.slice(0, 5);

  const filteredSearchPages = SEARCH_PAGES.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-6 transition-all duration-200">
      {/* Left section: Mobile menu trigger */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 shrink-0"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right actions: Search Button (No text field in topbar!), Company Switcher, Theme, Notifications, Profile */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Search Icon Button ONLY */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-foreground hover:bg-accent cursor-pointer"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Open Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Company Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 h-9 px-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium max-w-[120px] truncate">{currentCompany.name.split(" ")[0]}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockCompanies.map((company) => (
              <DropdownMenuItem
                key={company.id}
                onClick={() => {
                  switchCompany(company.id);
                  router.push("/dashboard/companies");
                }}
                className={cn(
                  "cursor-pointer",
                  companyId === company.id && "bg-accent"
                )}
              >
                <Building2 className="h-4 w-4 mr-2" />
                <div className="flex flex-col">
                  <span className="font-medium">{company.name}</span>
                  <span className="text-xs text-muted-foreground">{company.code}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                  onClick={markAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 cursor-pointer",
                    !notif.isRead && "bg-primary/5"
                  )}
                  onClick={() => {
                    markAsRead(notif.id);
                    router.push("/dashboard/notifications");
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-medium text-sm">{notif.title}</span>
                    {!notif.isRead && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-2">{notif.message}</span>
                  <span className="text-[10px] text-muted-foreground/60">{formatRelativeTime(notif.createdAt)}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-primary cursor-pointer font-medium"
              onClick={() => router.push("/dashboard/notifications")}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold">
                    {user ? getInitials(user.name) : "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            {user && (
              <>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className="w-fit text-[10px] mt-1 capitalize">
                      {user.role.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/users")}>
              Profile & Access
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/settings")}>
              Company Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* MOBILE & DESKTOP POPUP SEARCH DIALOG */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-lg max-w-[92vw] p-0 overflow-hidden border-border/50 gap-0 rounded-2xl shadow-xl">
          <DialogHeader className="p-3 border-b border-border/40 flex flex-row items-center gap-2 space-y-0 bg-muted/20">
            <Search className="h-4 w-4 text-primary shrink-0" />
            <Input
              autoFocus
              placeholder="Search products, pages, bills, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-xs sm:text-sm h-9 px-1 bg-transparent"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </DialogHeader>

          <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
            {filteredSearchPages.length > 0 ? (
              filteredSearchPages.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.href}
                    type="button"
                    onClick={() => handleNavigate(page.href)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-accent text-left transition-all group cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {page.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground">{page.category}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                <p className="font-bold">No results found for "{searchQuery}"</p>
                <p className="text-[11px]">Try searching for "products", "billing", "gst", or "customers"</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
