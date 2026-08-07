"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Receipt, Users, Package, ShoppingCart, Truck, FileText } from "lucide-react";
import Link from "next/link";

const actions = [
  { title: "New Invoice", icon: Receipt, href: "/dashboard/billing/new", color: "from-blue-600 to-blue-500" },
  { title: "New Customer", icon: Users, href: "/dashboard/customers", color: "from-emerald-600 to-emerald-500" },
  { title: "New Product", icon: Package, href: "/dashboard/products", color: "from-violet-600 to-violet-500" },
  { title: "Sales Order", icon: ShoppingCart, href: "/dashboard/sales", color: "from-amber-600 to-amber-500" },
  { title: "New Delivery", icon: Truck, href: "/dashboard/deliveries", color: "from-cyan-600 to-cyan-500" },
  { title: "New Purchase", icon: FileText, href: "/dashboard/purchases", color: "from-rose-600 to-rose-500" },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          <p className="text-xs text-muted-foreground">Common tasks and shortcuts</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {actions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-2 p-4 hover:shadow-md transition-all border-border/50 hover:border-border group"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} shadow-lg`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">{action.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
