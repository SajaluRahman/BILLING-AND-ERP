"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { mockCustomers } from "@/lib/mock-data";
import { formatCurrency, getInitials } from "@/lib/utils";
import { Star } from "lucide-react";

export function TopCustomers() {
  const sortedCustomers = [...mockCustomers]
    .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Top Customers</CardTitle>
          <p className="text-xs text-muted-foreground">By outstanding balance</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedCustomers.map((customer, i) => (
            <div
              key={customer.id}
              className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400">
                  {getInitials(customer.businessName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{customer.businessName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-muted-foreground">{customer.rating}</span>
                  <span className="text-xs text-muted-foreground">· {customer.type}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {formatCurrency(customer.outstandingBalance)}
                </p>
                <p className="text-[10px] text-muted-foreground">outstanding</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
