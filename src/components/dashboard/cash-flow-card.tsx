"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { mockDashboardStats, mockCollections } from "@/lib/mock-data";
import { ArrowUpRight, ArrowDownLeft, Wallet, Banknote, CreditCard, QrCode } from "lucide-react";

export function CashFlowCard() {
  const cashCollections = mockCollections
    .filter((c) => c.method === "cash")
    .reduce((sum, c) => sum + c.amount, 0);
  const upiCollections = mockCollections
    .filter((c) => c.method === "upi")
    .reduce((sum, c) => sum + c.amount, 0);
  const bankCollections = mockCollections
    .filter((c) => c.method === "bank_transfer" || c.method === "cheque")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cash Flow Today</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(mockDashboardStats.dailyCollection)}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Wallet className="h-5 w-5 text-emerald-500" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10">
                  <Banknote className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <span className="text-sm text-muted-foreground">Cash</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(cashCollections)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10">
                  <QrCode className="h-3.5 w-3.5 text-violet-500" />
                </div>
                <span className="text-sm text-muted-foreground">UPI</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(upiCollections)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10">
                  <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">Bank/Cheque</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(bankCollections)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
