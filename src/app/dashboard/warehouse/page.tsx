"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Warehouse, Plus, ArrowRightLeft, User, MapPin, Boxes, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockWarehouses, mockProducts } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";

export default function WarehousePage() {
  const totalCapacity = mockWarehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalOccupancy = mockWarehouses.reduce((sum, w) => sum + w.currentOccupancy, 0);
  const overallOccupancyPct = Math.round((totalOccupancy / totalCapacity) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Management"
        description="Monitor warehouse locations, storage capacities, and stock transfers"
        icon={Warehouse}
        actions={
          <div className="flex items-center gap-2">
            <ActionDialog
              title="Inter-Warehouse Transfer"
              description="Move stock units between distribution hubs"
              trigger={
                <Button variant="outline" size="sm">
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Stock Transfer
                </Button>
              }
              fields={[
                { name: "source", label: "Source Warehouse", type: "select", options: mockWarehouses.map((w) => ({ label: w.name, value: w.id })), defaultValue: mockWarehouses[0].id },
                { name: "destination", label: "Destination Hub", type: "select", options: mockWarehouses.map((w) => ({ label: w.name, value: w.id })), defaultValue: mockWarehouses[1]?.id || mockWarehouses[0].id },
                { name: "product", label: "Product SKU", type: "select", options: mockProducts.map((p) => ({ label: p.name, value: p.id })), defaultValue: mockProducts[0].id },
                { name: "units", label: "Transfer Quantity", type: "number", placeholder: "100", required: true },
              ]}
              onSuccessMessage="Inter-warehouse stock transfer initiated!"
            />

            <ActionDialog
              title="Add New Warehouse"
              description="Register a new distribution center or cold storage hub"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Warehouse
                </Button>
              }
              fields={[
                { name: "name", label: "Warehouse Name", placeholder: "e.g. East Coast Distribution Hub", required: true },
                { name: "code", label: "Warehouse Code", placeholder: "e.g. WH-EAST-01", required: true },
                { name: "manager", label: "Warehouse Manager", placeholder: "e.g. Suresh Nair", required: true },
                { name: "capacity", label: "Storage Capacity (Units)", type: "number", placeholder: "15000", required: true },
                { name: "address", label: "Location Address", placeholder: "Line 1, City, State, Pincode", required: true },
              ]}
              onSuccessMessage="New Warehouse created successfully!"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Warehouses" value={mockWarehouses.length} icon={Warehouse} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Total Capacity" value={totalCapacity} icon={Boxes} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Total Occupancy" value={totalOccupancy} icon={Boxes} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Avg Occupancy Rate" value={overallOccupancyPct} format="percentage" icon={CheckCircle2} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWarehouses.map((wh, i) => {
          const pct = Math.round((wh.currentOccupancy / wh.capacity) * 100);
          return (
            <motion.div
              key={wh.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/50 hover:shadow-lg hover:border-border transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md">
                      <Warehouse className="h-6 w-6" />
                    </div>
                    <StatusBadge status={wh.isActive ? "active" : "inactive"} />
                  </div>
                  <CardTitle className="text-lg mt-3">{wh.name}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground">{wh.code}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    <span>{wh.address.line1}, {wh.address.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Manager: <strong className="text-foreground">{wh.managerName || "Unassigned"}</strong></span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Occupancy</span>
                      <span className={pct > 80 ? "text-amber-600" : "text-emerald-600"}>{pct}% Full</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Occupied: {formatNumber(wh.currentOccupancy)}</span>
                      <span>Capacity: {formatNumber(wh.capacity)}</span>
                    </div>
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
