"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/shared/status-badge";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export function RecentInvoices() {
  const recentInvoices = mockInvoices.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
          <p className="text-xs text-muted-foreground">Latest billing activity</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{invoice.invoiceNumber}</span>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{invoice.customerName}</span>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-semibold">{formatCurrency(invoice.total)}</p>
                  <p className="text-[10px] text-muted-foreground">{formatDate(invoice.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
