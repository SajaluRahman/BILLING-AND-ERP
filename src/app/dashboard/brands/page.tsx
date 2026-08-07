"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Tags, Plus, Search, Building2, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockBrands, mockProducts } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function BrandsPage() {
  const [search, setSearch] = useState("");

  const filteredBrands = mockBrands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase())
  );

  const getProductCount = (brandId: string) =>
    mockProducts.filter((p) => p.brandId === brandId).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brand Management"
        description="Manage water & beverage product brands across companies"
        icon={Tags}
        actions={
          <ActionDialog
            title="Add New Brand"
            description="Create a new water or beverage brand portfolio"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            }
            fields={[
              { name: "name", label: "Brand Name", placeholder: "e.g. Bisleri Premium", required: true },
              { name: "code", label: "Brand Code", placeholder: "e.g. BSL-01", required: true },
              { name: "company", label: "Company", type: "select", options: [{ label: "AquaFlow Distributors", value: "comp-1" }], defaultValue: "comp-1" },
              { name: "description", label: "Description", type: "textarea", placeholder: "Brand details & product line overview..." },
            ]}
            onSuccessMessage="New Brand added to catalog!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Brands" value={mockBrands.length} icon={Tags} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Active Brands" value={mockBrands.filter((b) => b.isActive).length} icon={CheckCircle} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Total Products" value={mockProducts.length} icon={Package} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Companies Linked" value={1} icon={Building2} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brands by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand, i) => {
          const productCount = getProductCount(brand.id);
          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/50 hover:shadow-lg hover:border-border transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-md">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </div>
                    <StatusBadge status={brand.isActive ? "active" : "inactive"} />
                  </div>
                  <CardTitle className="text-lg mt-3">{brand.name}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground">{brand.code}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground line-clamp-2">{brand.description || "Premium bottled water product line."}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground">Products in catalog</span>
                    <Badge variant="secondary" className="font-bold">{productCount} SKUs</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
