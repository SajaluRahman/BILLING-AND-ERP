"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  ShoppingCart,
  Truck,
  Warehouse,
  BarChart3,
  Settings,
  Plus,
  Search,
  Building2,
  Car,
  UserCircle,
  Wallet,
  BookOpen,
} from "lucide-react";

const quickActions = [
  { title: "New Invoice", icon: Plus, href: "/dashboard/billing/new", category: "actions" },
  { title: "New Customer", icon: Plus, href: "/dashboard/customers/new", category: "actions" },
  { title: "New Sales Order", icon: Plus, href: "/dashboard/sales/orders/new", category: "actions" },
  { title: "New Purchase Order", icon: Plus, href: "/dashboard/purchases/orders/new", category: "actions" },
  { title: "New Product", icon: Plus, href: "/dashboard/products/new", category: "actions" },
];

const pages = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard", category: "pages" },
  { title: "Products", icon: Package, href: "/dashboard/products", category: "pages" },
  { title: "Customers", icon: Users, href: "/dashboard/customers", category: "pages" },
  { title: "Billing", icon: Receipt, href: "/dashboard/billing", category: "pages" },
  { title: "Sales Orders", icon: ShoppingCart, href: "/dashboard/sales", category: "pages" },
  { title: "Purchases", icon: ShoppingCart, href: "/dashboard/purchases", category: "pages" },
  { title: "Inventory", icon: Warehouse, href: "/dashboard/inventory", category: "pages" },
  { title: "Warehouses", icon: Warehouse, href: "/dashboard/warehouse", category: "pages" },
  { title: "Deliveries", icon: Truck, href: "/dashboard/deliveries", category: "pages" },
  { title: "Vehicles", icon: Car, href: "/dashboard/vehicles", category: "pages" },
  { title: "Drivers", icon: UserCircle, href: "/dashboard/drivers", category: "pages" },
  { title: "Collections", icon: Wallet, href: "/dashboard/collections", category: "pages" },
  { title: "Accounting", icon: BookOpen, href: "/dashboard/accounting", category: "pages" },
  { title: "Reports", icon: BarChart3, href: "/dashboard/reports", category: "pages" },
  { title: "Companies", icon: Building2, href: "/dashboard/companies", category: "pages" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings", category: "pages" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, actions, customers, products..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.href}
              onSelect={() => runCommand(() => router.push(action.href))}
              className="cursor-pointer"
            >
              <action.icon className="mr-2 h-4 w-4 text-primary" />
              <span>{action.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              onSelect={() => runCommand(() => router.push(page.href))}
              className="cursor-pointer"
            >
              <page.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{page.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
