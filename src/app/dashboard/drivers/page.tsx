"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { UserCircle, Plus, Phone, Navigation, Star, IndianRupee, ShieldCheck, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockDrivers, mockRoutes, mockVehicles } from "@/lib/mock-data";
import { formatCurrency, getInitials } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DriversPage() {
  const totalCollections = mockDrivers.reduce((sum, d) => sum + d.totalCollections, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Management"
        description="Manage delivery drivers, license validity, route assignments, and cash collections"
        icon={UserCircle}
        actions={
          <ActionDialog
            title="Add New Driver"
            description="Register a delivery driver with license details & route assignment"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            }
            fields={[
              { name: "name", label: "Driver Full Name", placeholder: "e.g. Ramesh Kumar", required: true },
              { name: "phone", label: "Phone Number", placeholder: "+91 98765 00112", required: true },
              { name: "licenseNumber", label: "Driving License Number", placeholder: "KL-07-2021008899", required: true },
              { name: "route", label: "Assigned Route", type: "select", options: mockRoutes.map((r) => ({ label: r.name, value: r.id })), defaultValue: mockRoutes[0].id },
              { name: "vehicle", label: "Assigned Vehicle", type: "select", options: mockVehicles.map((v) => ({ label: v.number, value: v.id })), defaultValue: mockVehicles[0].id },
            ]}
            onSuccessMessage="New Driver onboarded!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Drivers" value={mockDrivers.length} icon={UserCircle} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Active Drivers" value={mockDrivers.filter((d) => d.isActive).length} icon={UserCircle} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Total Collections" value={totalCollections} format="currency" icon={IndianRupee} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Avg Driver Rating" value={4.5} description="⭐" icon={Star} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDrivers.map((driver, i) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/50 hover:shadow-lg hover:border-border transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-base">
                      {getInitials(driver.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base truncate">{driver.name}</CardTitle>
                      <StatusBadge status={driver.isActive ? "active" : "inactive"} />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3" />
                      {driver.phone}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Navigation className="h-3.5 w-3.5 text-blue-500" />Route:</span>
                    <strong className="text-foreground">{driver.routeName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-emerald-500" />Vehicle:</span>
                    <strong className="font-mono text-foreground">{driver.vehicleNumber}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-violet-500" />License:</span>
                    <strong className="font-mono text-foreground">{driver.licenseNumber}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                  <div>
                    <p className="text-muted-foreground">Collections</p>
                    <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{formatCurrency(driver.totalCollections)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-bold text-sm text-amber-500 flex items-center gap-1 justify-end">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      {driver.rating}
                    </p>
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
