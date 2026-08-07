"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Package, Plus, Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockProducts, mockBrands } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = mockProducts.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockCount = mockProducts.filter((p) => p.currentStock <= p.minimumStock).length;
  const totalValue = mockProducts.reduce((sum, p) => sum + p.currentStock * p.sellingPrice, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog and pricing"
        icon={Package}
        actions={
          <ActionDialog
            title="Add New Product"
            description="Add a new bottled water SKU or beverage to the inventory catalog"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            }
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
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Products" value={mockProducts.length} icon={Package} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Total Stock" value={totalStock} icon={Package} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Low Stock" value={lowStockCount} icon={Package} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={100} />
        <StatsCard title="Stock Value" value={totalValue} format="currency" icon={Package} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={150} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Filter view active")}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <div className="hidden sm:flex items-center border rounded-lg">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="sm" className="h-8 rounded-r-none" onClick={() => setView("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" className="h-8 rounded-l-none" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}>
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="border-border/50 hover:shadow-md hover:border-border transition-all cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brandName} · {product.bottleSize}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-primary">{formatCurrency(product.sellingPrice)}</span>
                      <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.purchasePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Stock: {formatNumber(product.currentStock)}</span>
                      <StatusBadge status={
                        product.currentStock === 0 ? "out_of_stock" :
                        product.currentStock <= product.minimumStock ? "low_stock" : "in_stock"
                      } />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
