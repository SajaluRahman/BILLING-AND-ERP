"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Route as RouteIcon, Plus, Truck, Clock, Users, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRoutes, mockDrivers, mockVehicles } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function RoutesPage() {
  const totalCustomersOnRoutes = mockRoutes.reduce((sum, r) => sum + r.customers.length, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Routes"
        description="Configure distribution routes, assign drivers, vehicles, and customer sequences"
        icon={RouteIcon}
        actions={
          <ActionDialog
            title="Add Delivery Route"
            description="Set up a new geographical distribution route"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            }
            fields={[
              { name: "name", label: "Route Name", placeholder: "e.g. West Hub & Suburbs Route", required: true },
              { name: "code", label: "Route Code", placeholder: "e.g. RT-WEST-01", required: true },
              { name: "driver", label: "Assigned Driver", type: "select", options: mockDrivers.map((d) => ({ label: d.name, value: d.id })), defaultValue: mockDrivers[0].id },
              { name: "vehicle", label: "Assigned Vehicle", type: "select", options: mockVehicles.map((v) => ({ label: `${v.number} (${v.model})`, value: v.id })), defaultValue: mockVehicles[0].id },
              { name: "estimatedTime", label: "Est. Duration", placeholder: "e.g. 4.5 Hours" },
              { name: "description", label: "Route Notes", type: "textarea", placeholder: "Key landmark stops & sequence notes..." },
            ]}
            onSuccessMessage="New Delivery Route configured!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Routes" value={mockRoutes.length} icon={RouteIcon} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Assigned Drivers" value={mockRoutes.filter((r) => r.driverId).length} icon={Truck} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Total Route Customers" value={totalCustomersOnRoutes} icon={Users} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Avg Route Distance" value={34} description="km" icon={Navigation} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRoutes.map((route, i) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/50 hover:shadow-lg hover:border-border transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-md">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <StatusBadge status={route.isActive ? "active" : "inactive"} />
                </div>
                <CardTitle className="text-lg mt-3">{route.name}</CardTitle>
                <p className="text-xs font-mono text-muted-foreground">{route.code}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">{route.description}</p>
                <div className="space-y-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-blue-500" />Driver:</span>
                    <strong className="text-foreground">{route.driverName || "Unassigned"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5 text-emerald-500" />Vehicle:</span>
                    <strong className="font-mono text-foreground">{route.vehicleNumber || "Unassigned"}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-violet-500" />Customers:</span>
                    <strong className="text-foreground">{route.customers.length} stops</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-amber-500" />Est. Duration:</span>
                    <strong className="text-foreground">{route.estimatedTime || "4 hours"}</strong>
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
