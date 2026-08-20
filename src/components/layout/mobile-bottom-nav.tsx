"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Plus,
  Users,
  Menu,
  Receipt,
  PackagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { ActionDialog } from "@/components/shared/action-dialog";
import { mockBrands } from "@/lib/mock-data";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { setMobileOpen } = useSidebarStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const navItemsLeft = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
      exact: false,
    },
  ];

  const navItemsRight = [
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
      exact: false,
    },
  ];

  const isItemActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isNewBillingActive = pathname === "/dashboard/billing/new";

  const handleNewBillClick = () => {
    setIsOpen(false);
    router.push("/dashboard/billing/new");
  };

  const handleAddProductClick = () => {
    setIsOpen(false);
    setShowAddProductModal(true);
  };

  return (
    <>
      {/* Backdrop overlay when speed dial is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Hidden ActionDialog for Add Product on Mobile */}
      <ActionDialog
        open={showAddProductModal}
        onOpenChange={setShowAddProductModal}
        title="Add New Product"
        description="Add a new bottled water SKU or beverage to the inventory catalog"
        trigger={null}
        fields={[
          { name: "name", label: "Product Name", placeholder: "e.g. AquaFlow 20L Jar", required: true },
          { name: "sku", label: "SKU Code", placeholder: "e.g. AF-20L", required: true },
          { name: "brand", label: "Brand", type: "select", options: mockBrands.map((b) => ({ label: b.name, value: b.id })), defaultValue: mockBrands[0].id },
          { name: "bottleSize", label: "Bottle Size / Capacity", placeholder: "e.g. 20 Litre / 1 Litre", required: true },
          { name: "sellingPrice", label: "Selling Price (₹)", type: "number", placeholder: "80", required: true },
          { name: "purchasePrice", label: "Purchase Cost (₹)", type: "number", placeholder: "50", required: true },
          { name: "gstRate", label: "GST Rate (%)", type: "select", options: [{ label: "18%", value: "18" }, { label: "12%", value: "12" }, { label: "5%", value: "5" }], defaultValue: "18" },
          { name: "hsnCode", label: "HSN Code", placeholder: "2201", defaultValue: "2201" },
          { name: "minimumStock", label: "Minimum Stock Threshold", type: "number", placeholder: "50" },
          { name: "currentStock", label: "Initial Stock Quantity", type: "number", placeholder: "500" },
        ]}
        onSuccessMessage="New Product created successfully!"
      />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe shadow-xl">
        <div className="flex h-16 items-center justify-around px-2 relative">
          {/* Left Navigation Items */}
          {navItemsLeft.map((item) => {
            const active = isItemActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-1 gap-1 transition-colors relative",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] tracking-tight">{item.title}</span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Center Plus Trigger & Pop-up Sub-Actions */}
          <div className="relative flex justify-center flex-1">
            {/* Pop-up Action 1: LEFT -> New Bill */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x: -54, y: -72 }}
                  exit={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute z-50 flex flex-col items-center"
                >
                  <button
                    type="button"
                    onClick={handleNewBillClick}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/40 ring-2 ring-background hover:scale-105 transition-transform active:scale-95"
                    aria-label="New Bill"
                  >
                    <Receipt className="h-5 w-5" />
                  </button>
                  <span className="mt-1.5 px-2 py-0.5 rounded-full bg-popover/90 text-popover-foreground text-[10px] font-bold shadow-xs whitespace-nowrap border border-border/50">
                    New Bill
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pop-up Action 2: RIGHT -> Add Product */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x: 54, y: -72 }}
                  exit={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute z-50 flex flex-col items-center"
                >
                  <button
                    type="button"
                    onClick={handleAddProductClick}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/40 ring-2 ring-background hover:scale-105 transition-transform active:scale-95"
                    aria-label="Add Product"
                  >
                    <PackagePlus className="h-5 w-5" />
                  </button>
                  <span className="mt-1.5 px-2 py-0.5 rounded-full bg-popover/90 text-popover-foreground text-[10px] font-bold shadow-xs whitespace-nowrap border border-border/50">
                    Add Product
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Center Floating Plus Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Quick Actions Menu"
              className="group relative -top-5 flex flex-col items-center justify-center focus:outline-none"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/35 ring-4 ring-background transition-all group-hover:shadow-blue-500/50",
                  (isNewBillingActive || isOpen) && "ring-primary shadow-blue-500/60"
                )}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 135 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Plus className="h-6 w-6 stroke-[2.5]" />
                </motion.div>
              </motion.div>
              <span className="mt-1 text-[10px] font-semibold text-primary">
                Actions
              </span>
            </button>
          </div>

          {/* Right Navigation Items */}
          {navItemsRight.map((item) => {
            const active = isItemActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-1 gap-1 transition-colors relative",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] tracking-tight">{item.title}</span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* More Button to trigger Sidebar Drawer */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setMobileOpen(true);
            }}
            className="flex flex-1 flex-col items-center justify-center py-1 gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
