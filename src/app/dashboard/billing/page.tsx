"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Receipt, Plus, Search, Filter, FileText, Download, Printer, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockInvoices } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { InvoicePreviewModal } from "@/components/modules/billing/invoice-preview-modal";
import { toast } from "sonner";

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredInvoices = mockInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && inv.status === activeTab;
  });

  const totalBilled = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = mockInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalDue = mockInvoices.reduce((sum, inv) => sum + inv.amountDue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        description="Manage invoices, payments, and billing operations"
        icon={Receipt}
        actions={
          <Link href="/dashboard/billing/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Invoices" value={mockInvoices.length} icon={FileText} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Total Billed" value={totalBilled} format="currency" icon={Receipt} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={50} />
        <StatsCard title="Total Collected" value={totalPaid} format="currency" icon={Receipt} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={100} />
        <StatsCard title="Amount Due" value={totalDue} format="currency" icon={Receipt} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="partial">Partial</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 w-64" />
              </div>
              <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Invoice filter active")}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-9" onClick={() => toast.success("Invoices exported to Excel successfully!")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <div className="col-span-2">Invoice #</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {/* Table Body */}
            {filteredInvoices.map((invoice, i) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground md:hidden lg:block" />
                    <span className="text-sm font-semibold text-primary">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-medium truncate">{invoice.customerName}</p>
                    <p className="text-xs text-muted-foreground">{invoice.type.toUpperCase()} Invoice</p>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground">{formatDate(invoice.createdAt)}</div>
                  <div className="col-span-1">
                    <StatusBadge status={invoice.status} />
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-sm font-semibold">{formatCurrency(invoice.total)}</p>
                  </div>
                  <div className="col-span-2 text-right flex items-center justify-end gap-1">
                    <InvoicePreviewModal
                      invoice={invoice}
                      trigger={
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Download className="h-3.5 w-3.5" />
                          View & Download
                        </Button>
                      }
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
