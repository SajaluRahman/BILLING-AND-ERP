"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Truck, Plus, MapPin, CheckCircle2, Clock, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockDeliveries, mockRoutes, mockDrivers, mockVehicles } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DeliveriesPage() {
  const totalStops = mockDeliveries.reduce((sum, d) => sum + d.totalItems, 0);
  const totalCompletedStops = mockDeliveries.reduce((sum, d) => sum + d.deliveredItems, 0);

  const handleLoadingSheet = () => {
    toast.success("Today's Loading Sheet generated & downloaded!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Operations"
        description="Schedule deliveries, track real-time route progress, and generate loading sheets"
        icon={Truck}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadingSheet}>
              <FileText className="h-4 w-4 mr-2" />
              Loading Sheet
            </Button>

            <ActionDialog
              title="Schedule Delivery Trip"
              description="Dispatch a vehicle and driver on a delivery route"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Delivery
                </Button>
              }
              fields={[
                { name: "route", label: "Delivery Route", type: "select", options: mockRoutes.map((r) => ({ label: r.name, value: r.id })), defaultValue: mockRoutes[0].id },
                { name: "driver", label: "Assigned Driver", type: "select", options: mockDrivers.map((d) => ({ label: d.name, value: d.id })), defaultValue: mockDrivers[0].id },
                { name: "vehicle", label: "Assigned Vehicle", type: "select", options: mockVehicles.map((v) => ({ label: `${v.number} (${v.model})`, value: v.id })), defaultValue: mockVehicles[0].id },
                { name: "date", label: "Delivery Date", type: "text", defaultValue: new Date().toISOString().split("T")[0] },
                { name: "notes", label: "Trip Notes", type: "textarea", placeholder: "Special handling instructions..." },
              ]}
              onSuccessMessage="Delivery trip scheduled and loading sheet generated!"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Deliveries" value={mockDeliveries.length} icon={Truck} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Total Stops" value={totalStops} icon={MapPin} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={50} />
        <StatsCard title="Completed Stops" value={totalCompletedStops} icon={CheckCircle2} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={100} />
        <StatsCard title="Pending Deliveries" value={mockDeliveries.filter((d) => d.status !== "delivered").length} icon={Clock} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="space-y-4">
        {mockDeliveries.map((delivery, i) => {
          const pct = Math.round((delivery.deliveredItems / delivery.totalItems) * 100);
          return (
            <motion.div
              key={delivery.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/50 hover:border-border transition-all">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">{delivery.routeName}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {delivery.deliveryNumber} · {delivery.driverName} ({delivery.vehicleNumber})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={delivery.status} />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(delivery.date)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Delivery Completion</span>
                      <span>{delivery.deliveredItems} / {delivery.totalItems} Stops ({pct}%)</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>

                  {/* Customer Stops Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {delivery.items.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-border/50 bg-accent/20 text-xs space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="truncate">{item.customerName}</span>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="text-muted-foreground">{item.products[0]?.productName} x {item.products[0]?.orderedQuantity}</p>
                      </div>
                    ))}
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
