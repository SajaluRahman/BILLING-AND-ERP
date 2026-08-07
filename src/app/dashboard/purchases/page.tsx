"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { ClipboardList, Plus, Search, CheckCircle2, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPurchaseOrders, mockProducts, mockWarehouses } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function PurchasesPage() {
  const [search, setSearch] = useState("");

  const filteredOrders = mockPurchaseOrders.filter(
    (po) =>
      po.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPurchases = mockPurchaseOrders.reduce((sum, po) => sum + po.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Management"
        description="Track supplier orders, purchase invoices, and incoming goods"
        icon={ClipboardList}
        actions={
          <ActionDialog
            title="Create Purchase Order"
            description="Order inventory stock directly from beverage manufacturers or bottlers"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            }
            fields={[
              { name: "supplierName", label: "Supplier / Manufacturer", placeholder: "e.g. Bisleri International Pvt Ltd", required: true },
              { name: "warehouse", label: "Destination Warehouse", type: "select", options: mockWarehouses.map((w) => ({ label: w.name, value: w.id })), defaultValue: mockWarehouses[0].id },
              { name: "product", label: "Select SKU Product", type: "select", options: mockProducts.map((p) => ({ label: p.name, value: p.id })), defaultValue: mockProducts[0].id },
              { name: "quantity", label: "Order Quantity (Jars/Boxes)", type: "number", placeholder: "500", required: true },
              { name: "unitPrice", label: "Unit Purchase Price (₹)", type: "number", placeholder: "45", required: true },
            ]}
            onSuccessMessage="New Purchase Order submitted to supplier!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Purchase Orders" value={mockPurchaseOrders.length} icon={ClipboardList} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Total Purchase Cost" value={totalPurchases} format="currency" icon={FileText} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Pending Orders" value={mockPurchaseOrders.filter((po) => po.status === "pending").length} icon={Clock} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={100} />
        <StatsCard title="Received Orders" value={mockPurchaseOrders.filter((po) => po.status === "received").length} icon={CheckCircle2} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">Supplier Purchase Orders</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PO or supplier..."
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
              <div className="col-span-2">PO Number</div>
              <div className="col-span-3">Supplier Name</div>
              <div className="col-span-2">Warehouse</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Total Amount</div>
            </div>
            {filteredOrders.map((po, i) => (
              <motion.div
                key={po.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors items-center border-b border-border/20 last:border-0 cursor-pointer"
              >
                <div className="col-span-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-primary">{po.orderNumber}</span>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-medium">{po.supplierName}</p>
                  <p className="text-xs text-muted-foreground">{po.items.length} product line(s)</p>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground">{po.warehouseName}</div>
                <div className="col-span-2 text-xs text-muted-foreground">{formatDate(po.createdAt)}</div>
                <div className="col-span-1">
                  <StatusBadge status={po.status} />
                </div>
                <div className="col-span-2 text-right font-bold text-sm font-mono text-primary">
                  {formatCurrency(po.total)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
