"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ShoppingCart, Plus, Search, CheckCircle2, Clock, Truck, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSalesOrders } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SalesPage() {
  const [search, setSearch] = useState("");

  const filteredOrders = mockSalesOrders.filter(
    (so) =>
      so.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      so.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalSalesValue = mockSalesOrders.reduce((sum, so) => sum + so.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Orders"
        description="Manage customer orders, quotations, and fulfillment pipeline"
        icon={ShoppingCart}
        actions={
          <Link href="/dashboard/billing/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Sales Order
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Sales Orders" value={mockSalesOrders.length} icon={ShoppingCart} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Total Order Value" value={totalSalesValue} format="currency" icon={IndianRupee} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Pending Fulfillment" value={mockSalesOrders.filter((so) => so.status === "pending" || so.status === "processing").length} icon={Clock} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={100} />
        <StatsCard title="Delivered Orders" value={mockSalesOrders.filter((so) => so.status === "delivered").length} icon={CheckCircle2} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">Sales Pipeline</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search order or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <div className="col-span-2">Order #</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Fulfillment</div>
              <div className="col-span-1">Payment</div>
              <div className="col-span-2 text-right">Total Amount</div>
            </div>
            {filteredOrders.map((so, i) => (
              <motion.div
                key={so.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors items-center border-b border-border/20 last:border-0 cursor-pointer"
              >
                <div className="col-span-2 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-primary">{so.orderNumber}</span>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-medium">{so.customerName}</p>
                  <p className="text-xs text-muted-foreground">{so.items.length} item line(s)</p>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground">{formatDate(so.createdAt)}</div>
                <div className="col-span-2">
                  <StatusBadge status={so.status} />
                </div>
                <div className="col-span-1">
                  <StatusBadge status={so.paymentStatus} />
                </div>
                <div className="col-span-2 text-right font-bold text-sm font-mono text-primary">
                  {formatCurrency(so.total)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
