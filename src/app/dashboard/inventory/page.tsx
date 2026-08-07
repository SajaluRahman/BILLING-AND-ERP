"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Boxes, Plus, Search, ArrowUpRight, ArrowDownLeft, AlertTriangle, Warehouse, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts, mockStockMovements, mockWarehouses } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("stock");

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalStockUnits = mockProducts.reduce((sum, p) => sum + p.currentStock, 0);
  const totalValuation = mockProducts.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);
  const lowStockCount = mockProducts.filter((p) => p.currentStock <= p.minimumStock).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="Live stock tracking, stock movement timeline, and inventory valuation"
        icon={Boxes}
        actions={
          <div className="flex items-center gap-2">
            <ActionDialog
              title="Stock Adjustment"
              description="Adjust product stock quantity due to damage, breakage, or physical count variance"
              trigger={
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Stock Adjustment
                </Button>
              }
              fields={[
                { name: "product", label: "Select Product", type: "select", options: mockProducts.map((p) => ({ label: `${p.name} (Stock: ${p.currentStock})`, value: p.id })), defaultValue: mockProducts[0].id },
                { name: "adjustmentType", label: "Adjustment Type", type: "select", options: [{ label: "Increase Stock (+)", value: "add" }, { label: "Decrease Stock (-)", value: "remove" }, { label: "Damage / Leakage (-)", value: "damage" }], defaultValue: "add" },
                { name: "quantity", label: "Quantity (Units)", type: "number", placeholder: "10", required: true },
                { name: "reason", label: "Adjustment Reason", type: "textarea", placeholder: "e.g. Broken jar replaced during transport", required: true },
              ]}
              onSuccessMessage="Stock adjustment recorded successfully!"
            />

            <ActionDialog
              title="Stock Transfer"
              description="Transfer product inventory between warehouse locations"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Stock Transfer
                </Button>
              }
              fields={[
                { name: "fromWarehouse", label: "From Warehouse", type: "select", options: mockWarehouses.map((w) => ({ label: w.name, value: w.id })), defaultValue: mockWarehouses[0].id },
                { name: "toWarehouse", label: "To Warehouse", type: "select", options: mockWarehouses.map((w) => ({ label: w.name, value: w.id })), defaultValue: mockWarehouses[1]?.id || mockWarehouses[0].id },
                { name: "product", label: "Product", type: "select", options: mockProducts.map((p) => ({ label: p.name, value: p.id })), defaultValue: mockProducts[0].id },
                { name: "quantity", label: "Transfer Quantity", type: "number", placeholder: "100", required: true },
              ]}
              onSuccessMessage="Stock transfer order generated!"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Stock Units" value={totalStockUnits} icon={Boxes} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Stock Valuation (Cost)" value={totalValuation} format="currency" icon={Layers} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Low Stock Alerts" value={lowStockCount} icon={AlertTriangle} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={100} />
        <StatsCard title="Active Warehouses" value={mockWarehouses.length} icon={Warehouse} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="stock">Live Stock Overview</TabsTrigger>
                <TabsTrigger value="movements">Stock Movement Timeline</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stock..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "stock" ? (
            <div className="space-y-1">
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                <div className="col-span-4">Product Details</div>
                <div className="col-span-2 text-center">Unit / Size</div>
                <div className="col-span-2 text-right">Current Stock</div>
                <div className="col-span-2 text-right">Unit Cost</div>
                <div className="col-span-2 text-right">Total Valuation</div>
              </div>
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors items-center border-b border-border/20 last:border-0"
                >
                  <div className="col-span-4">
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brandName} · SKU: {product.sku}</p>
                  </div>
                  <div className="col-span-2 text-center text-xs text-muted-foreground capitalize">
                    {product.unit} ({product.bottleSize})
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-sm font-bold ${
                      product.currentStock <= product.minimumStock ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {formatNumber(product.currentStock)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">Min: {product.minimumStock}</p>
                  </div>
                  <div className="col-span-2 text-right text-sm font-mono">{formatCurrency(product.purchasePrice)}</div>
                  <div className="col-span-2 text-right text-sm font-bold font-mono text-primary">
                    {formatCurrency(product.currentStock * product.purchasePrice)}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {mockStockMovements.map((movement, i) => (
                <motion.div
                  key={movement.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                    movement.quantity > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                  }`}>
                    {movement.quantity > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{movement.productName}</p>
                      <span className={`text-sm font-bold font-mono ${movement.quantity > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity} units
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                      Type: <span className="font-semibold text-foreground">{movement.type.replace('_', ' ')}</span> · Ref: {movement.referenceId || "N/A"}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{formatDate(movement.createdAt)} by {movement.createdBy}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
