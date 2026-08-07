"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Car, Plus, Fuel, ShieldCheck, User, Wrench, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockVehicles, mockDrivers } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet & Vehicle Management"
        description="Monitor vehicle status, load capacities, fuel logs, and maintenance schedules"
        icon={Car}
        actions={
          <ActionDialog
            title="Add New Vehicle"
            description="Register a delivery van, pickup truck, or mini truck into fleet"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            }
            fields={[
              { name: "number", label: "Registration Number", placeholder: "e.g. KL-07-CD-9988", required: true },
              { name: "type", label: "Vehicle Category", type: "select", options: [{ label: "Mini Pickup Truck", value: "Pickup" }, { label: "Delivery Van", value: "Van" }, { label: "Heavy Commercial Truck", value: "Truck" }], defaultValue: "Pickup" },
              { name: "makeModel", label: "Make & Model", placeholder: "e.g. Tata Ace Gold", required: true },
              { name: "capacity", label: "Payload Capacity (kg)", type: "number", placeholder: "1000", required: true },
              { name: "fuelType", label: "Fuel Type", type: "select", options: [{ label: "Diesel", value: "Diesel" }, { label: "EV (Electric)", value: "Electric" }, { label: "CNG", value: "CNG" }], defaultValue: "Diesel" },
              { name: "driver", label: "Default Driver", type: "select", options: mockDrivers.map((d) => ({ label: d.name, value: d.id })), defaultValue: mockDrivers[0].id },
            ]}
            onSuccessMessage="New Vehicle registered to fleet!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Vehicles" value={mockVehicles.length} icon={Car} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Vehicles On Route" value={mockVehicles.filter((v) => v.status === "on_route").length} icon={Car} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Available Vehicles" value={mockVehicles.filter((v) => v.status === "available").length} icon={CheckCircle2} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Under Maintenance" value={mockVehicles.filter((v) => v.status === "maintenance").length} icon={Wrench} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVehicles.map((veh, i) => {
          const loadPct = Math.round((veh.currentLoad / veh.capacity) * 100);
          return (
            <motion.div
              key={veh.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/50 hover:shadow-lg hover:border-border transition-all cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                      <Car className="h-6 w-6" />
                    </div>
                    <StatusBadge status={veh.status} />
                  </div>
                  <CardTitle className="text-lg mt-3">{veh.number}</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">{veh.make} {veh.model} ({veh.type})</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5 text-amber-500" />Fuel: <strong className="text-foreground">{veh.fuelType}</strong></div>
                    <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-blue-500" />Driver: <strong className="text-foreground">{veh.driverName || "None"}</strong></div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Current Load</span>
                      <span>{veh.currentLoad} / {veh.capacity} kg ({loadPct}%)</span>
                    </div>
                    <Progress value={loadPct} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Insurance Exp:</span>
                    <span>{formatDate(veh.insuranceExpiry)}</span>
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
