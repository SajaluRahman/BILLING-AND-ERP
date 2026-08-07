"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle, Package } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function LowStockAlerts() {
  const lowStockProducts = mockProducts
    .filter((p) => p.currentStock <= p.minimumStock * 2)
    .sort((a, b) => (a.currentStock / a.minimumStock) - (b.currentStock / b.minimumStock))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Products running low on stock</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => {
              const ratio = product.currentStock / product.minimumStock;
              const isVeryLow = ratio <= 1;
              const isCritical = product.currentStock === 0;

              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-3 transition-colors cursor-pointer",
                    isCritical ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-accent/50"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                    isCritical ? "bg-red-500/10" : isVeryLow ? "bg-amber-500/10" : "bg-blue-500/10"
                  )}>
                    <Package className={cn(
                      "h-4 w-4",
                      isCritical ? "text-red-500" : isVeryLow ? "text-amber-500" : "text-blue-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brandName} · {product.bottleSize}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn(
                      "text-sm font-bold",
                      isCritical ? "text-red-500" : isVeryLow ? "text-amber-500" : "text-foreground"
                    )}>
                      {product.currentStock}
                    </p>
                    <p className="text-[10px] text-muted-foreground">min: {product.minimumStock}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              All products are well stocked! 🎉
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
