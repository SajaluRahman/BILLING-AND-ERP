"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Wallet, Plus, Search, Banknote, QrCode, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCollections, mockCustomers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function CollectionsPage() {
  const [search, setSearch] = useState("");

  const filteredCollections = mockCollections.filter(
    (c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.collectedBy.toLowerCase().includes(search.toLowerCase()) ||
      (c.invoiceNumber && c.invoiceNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const totalCollected = mockCollections.reduce((sum, c) => sum + c.amount, 0);
  const cashTotal = mockCollections.filter((c) => c.method === "cash").reduce((sum, c) => sum + c.amount, 0);
  const upiTotal = mockCollections.filter((c) => c.method === "upi").reduce((sum, c) => sum + c.amount, 0);
  const bankTotal = mockCollections.filter((c) => c.method === "bank_transfer" || c.method === "cheque").reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections & Cash Flow"
        description="Track daily customer payment collections, payment modes, and deposit ledgers"
        icon={Wallet}
        actions={
          <ActionDialog
            title="Record Customer Payment"
            description="Log cash, UPI, cheque, or bank payment received from customer"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            }
            fields={[
              { name: "customer", label: "Customer Name", type: "select", options: mockCustomers.map((c) => ({ label: c.businessName, value: c.id })), defaultValue: mockCustomers[0].id },
              { name: "amount", label: "Payment Amount (₹)", type: "number", placeholder: "5000", required: true },
              { name: "method", label: "Payment Mode", type: "select", options: [{ label: "Cash", value: "cash" }, { label: "UPI / QR", value: "upi" }, { label: "Bank Transfer", value: "bank_transfer" }, { label: "Cheque", value: "cheque" }], defaultValue: "cash" },
              { name: "referenceNumber", label: "UPI / Txn / Cheque Ref No", placeholder: "UPI-99882233" },
              { name: "notes", label: "Payment Notes", type: "textarea", placeholder: "Payment settled against invoice INV-2024-001" },
            ]}
            onSuccessMessage="Payment recorded in cash book!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Collections" value={totalCollected} format="currency" icon={Wallet} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={0} />
        <StatsCard title="Cash Collections" value={cashTotal} format="currency" icon={Banknote} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={50} />
        <StatsCard title="UPI Collections" value={upiTotal} format="currency" icon={QrCode} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Bank / Cheque" value={bankTotal} format="currency" icon={Building2} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">Collection History</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collection or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Invoice #</div>
              <div className="col-span-2">Payment Mode</div>
              <div className="col-span-2">Collected By</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            {filteredCollections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors items-center border-b border-border/20 last:border-0 cursor-pointer"
              >
                <div className="col-span-3">
                  <p className="text-sm font-semibold">{col.customerName}</p>
                  {col.referenceNumber && <p className="text-xs font-mono text-muted-foreground">Ref: {col.referenceNumber}</p>}
                </div>
                <div className="col-span-2 text-xs font-mono text-primary">{col.invoiceNumber || "Direct Payment"}</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md bg-accent text-foreground capitalize">
                    {col.method === "cash" && <Banknote className="h-3.5 w-3.5 text-emerald-500" />}
                    {col.method === "upi" && <QrCode className="h-3.5 w-3.5 text-violet-500" />}
                    {(col.method === "bank_transfer" || col.method === "cheque") && <Building2 className="h-3.5 w-3.5 text-blue-500" />}
                    {col.method.replace('_', ' ')}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground">{col.collectedBy}</div>
                <div className="col-span-1 text-xs text-muted-foreground">{formatDate(col.date)}</div>
                <div className="col-span-2 text-right font-bold text-sm font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(col.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
