"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/shared/status-badge";
import { mockDeliveries } from "@/lib/mock-data";
import { Truck, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function DeliveryStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Today&apos;s Deliveries</CardTitle>
          <p className="text-xs text-muted-foreground">Active routes and delivery status</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockDeliveries.map((delivery) => {
            const progress = delivery.totalItems > 0
              ? Math.round((delivery.deliveredItems / delivery.totalItems) * 100)
              : 0;
            return (
              <div
                key={delivery.id}
                className="group flex flex-col gap-3 rounded-xl border border-border/50 p-4 hover:border-border hover:bg-accent/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      delivery.status === "delivered" ? "bg-emerald-500/10" : "bg-blue-500/10"
                    )}>
                      <Truck className={cn(
                        "h-4 w-4",
                        delivery.status === "delivered" ? "text-emerald-500" : "text-blue-500"
                      )} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{delivery.routeName}</p>
                      <p className="text-xs text-muted-foreground">{delivery.driverName} · {delivery.vehicleNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={delivery.status} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{delivery.deliveredItems}/{delivery.totalItems} stops</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {delivery.totalItems} stops
                  </span>
                  {delivery.startTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Started {new Date(delivery.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                  {delivery.status === "delivered" && (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
