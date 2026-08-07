"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Bell, CheckCheck, Trash2, AlertTriangle, Clock, CheckCircle2, Package, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotificationStore } from "@/stores/notification-store";
import { formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications & Alerts Center"
        description="System warnings, low stock alerts, payment reminders, and order notifications"
        icon={Bell}
        actions={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )
        }
      />

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className={`border-border/50 transition-all ${!notif.isRead ? "bg-primary/5 border-primary/20 shadow-xs" : ""}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                  notif.type === "low_stock" ? "bg-amber-500/10 text-amber-500" :
                  notif.type === "payment_due" ? "bg-rose-500/10 text-rose-500" :
                  notif.type === "delivery_completed" ? "bg-emerald-500/10 text-emerald-500" :
                  "bg-blue-500/10 text-blue-500"
                }`}>
                  {notif.type === "low_stock" && <Package className="h-5 w-5" />}
                  {notif.type === "payment_due" && <Clock className="h-5 w-5" />}
                  {notif.type === "delivery_completed" && <CheckCircle2 className="h-5 w-5" />}
                  {notif.type === "system_alert" && <ShieldAlert className="h-5 w-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{notif.title}</h4>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(notif.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                </div>

                <div className="flex items-center gap-1">
                  {!notif.isRead && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-primary" onClick={() => markAsRead(notif.id)}>
                      Mark Read
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeNotification(notif.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
