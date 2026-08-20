"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { BulkImportModal } from "@/components/modules/products/bulk-import-modal";
import { BulkEditModal } from "@/components/modules/products/bulk-edit-modal";
import { Package, Plus, Search, Filter, Grid3X3, List, CheckSquare, Square, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { mockProducts, mockBrands } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types";

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>(mockProducts);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter products by search
  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = productList.reduce((sum, p) => sum + p.currentStock, 0);
  const lowStockCount = productList.filter((p) => p.currentStock <= p.minimumStock).length;
  const totalValue = productList.reduce((sum, p) => sum + p.currentStock * p.sellingPrice, 0);

  // Toggle selection
  const toggleSelectProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  // Bulk Import handler
  const handleImportProducts = (newItems: Partial<Product>[]) => {
    const formatted: Product[] = newItems.map((item, idx) => ({
      id: item.id || `prod-imp-${Date.now()}-${idx}`,
      companyId: "comp-1",
      brandId: "brand-1",
      brandName: item.brandName || "AquaFlow",
      name: item.name || "Untitled Product",
      category: "mineral_water",
      sku: item.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: item.barcode || `8901234${Math.floor(100000 + Math.random() * 900000)}`,
      unit: "jar",
      bottleSize: item.bottleSize || "1 Litre",
      purchasePrice: item.purchasePrice || 50,
      sellingPrice: item.sellingPrice || 80,
      distributorPrice: item.purchasePrice || 50,
      wholesalePrice: item.sellingPrice || 75,
      retailPrice: item.sellingPrice || 80,
      gstRate: item.gstRate || 18,
      hsnCode: item.hsnCode || "2201",
      openingStock: item.currentStock || 100,
      currentStock: item.currentStock || 100,
      minimumStock: item.minimumStock || 20,
      maximumStock: (item.currentStock || 100) * 10,
      images: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setProductList((prev) => [...formatted, ...prev]);
  };

  // Bulk Edit Handler (GST Rate, Price Markup, HSN Code)
  const handleBulkUpdate = (updates: {
    gstRate?: number;
    hsnCode?: string;
    sellingPriceMarkupPct?: number;
  }) => {
    setProductList((prev) =>
      prev.map((prod) => {
        if (!selectedIds.includes(prod.id)) return prod;

        let updatedSellingPrice = prod.sellingPrice;
        if (updates.sellingPriceMarkupPct !== undefined) {
          const factor = 1 + updates.sellingPriceMarkupPct / 100;
          updatedSellingPrice = Math.round(prod.sellingPrice * factor * 100) / 100;
        }

        return {
          ...prod,
          gstRate: updates.gstRate !== undefined ? updates.gstRate : prod.gstRate,
          hsnCode: updates.hsnCode !== undefined ? updates.hsnCode : prod.hsnCode,
          sellingPrice: updatedSellingPrice,
        };
      })
    );

    setSelectedIds([]);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    const count = selectedIds.length;
    setProductList((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    toast.success(`Removed ${count} products from inventory catalog!`);
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Products & Inventory Catalog"
        description="Manage your product catalog, pricing, GST rates, and bulk imports"
        icon={Package}
        actions={
          <div className="flex items-center gap-2">
            {/* Bulk Import & Scan Button */}
            <BulkImportModal onImportProducts={handleImportProducts} />

            {/* Single Add Product Modal */}
            <ActionDialog
              title="Add Single Product"
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
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Products" value={productList.length} icon={Package} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Total Stock" value={totalStock} icon={Package} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Low Stock" value={lowStockCount} icon={Package} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={100} />
        <StatsCard title="Stock Value" value={totalValue} format="currency" icon={Package} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={150} />
      </div>

      {/* Control Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products by name, SKU, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Filters applied")}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs"
            onClick={handleSelectAll}
          >
            {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
              <CheckSquare className="h-4 w-4 mr-1.5 text-primary" />
            ) : (
              <Square className="h-4 w-4 mr-1.5 text-muted-foreground" />
            )}
            Select All ({filteredProducts.length})
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
      </div>

      {/* Product List / Grid */}
      <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}>
        {filteredProducts.map((product, i) => {
          const isSelected = selectedIds.includes(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Card
                className={`border transition-all cursor-pointer group relative ${
                  isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border/50 hover:shadow-md hover:border-border"
                }`}
                onClick={() => toggleSelectProduct(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectProduct(product.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                        <Package className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{product.brandName} · {product.bottleSize}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-primary">{formatCurrency(product.sellingPrice)}</span>
                        <span className="text-xs font-mono text-muted-foreground">GST: {product.gstRate}%</span>
                        <span className="text-[10px] font-mono text-muted-foreground/70">HSN: {product.hsnCode}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
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
          );
        })}
      </div>

      {/* Floating Sticky Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-[84px] md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-popover/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between sm:justify-start gap-2 sm:gap-4 text-[11px] sm:text-xs w-[94vw] sm:w-auto max-w-lg"
          >
            <span className="font-bold text-foreground shrink-0">
              {selectedIds.length} Selected
            </span>

            <div className="h-4 w-px bg-border shrink-0" />

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Bulk Edit Modal Trigger */}
              <BulkEditModal
                selectedCount={selectedIds.length}
                onBulkUpdate={handleBulkUpdate}
                onClearSelection={() => setSelectedIds([])}
              />

              <Button variant="destructive" size="sm" className="h-8 px-2 sm:px-3 text-[11px] sm:text-xs" onClick={handleBulkDelete}>
                <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Delete</span> ({selectedIds.length})
              </Button>

              <Button variant="ghost" size="sm" className="h-8 px-2 text-[11px] sm:text-xs text-muted-foreground" onClick={() => setSelectedIds([])}>
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
