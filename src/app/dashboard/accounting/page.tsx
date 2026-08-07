"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { BookOpen, IndianRupee, FileSpreadsheet, Scale, TrendingUp, Download, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardStats, mockInvoices, mockExpenses, mockCollections } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("pl");

  const totalSales = mockDashboardStats.monthlySales;
  const totalPurchases = mockDashboardStats.purchaseCost;
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - (totalPurchases + totalExpenses);

  const totalGSTOutput = mockInvoices.reduce((sum, inv) => sum + inv.cgst + inv.sgst, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounting & Financial Books"
        description="General Ledgers, Trial Balance, Profit & Loss Statement, Cash Book, and GST Reports"
        icon={BookOpen}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Printing Profit & Loss Statement...")}>
              <Printer className="h-4 w-4 mr-2" />
              Print P&L
            </Button>
            <Button size="sm" onClick={() => toast.success("Exporting financial statements to Excel & PDF...")}>
              <Download className="h-4 w-4 mr-2" />
              Export Statements
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Gross Sales Revenue" value={totalSales} format="currency" icon={TrendingUp} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={0} />
        <StatsCard title="Purchase Cost (COGS)" value={totalPurchases} format="currency" icon={FileSpreadsheet} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={50} />
        <StatsCard title="Operating Expenses" value={totalExpenses} format="currency" icon={Scale} iconColor="text-rose-500" iconBg="bg-rose-500/10" delay={100} />
        <StatsCard title="Net Operating Profit" value={netProfit} format="currency" icon={IndianRupee} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="pl">Profit & Loss</TabsTrigger>
              <TabsTrigger value="tb">Trial Balance</TabsTrigger>
              <TabsTrigger value="cash">Cash & Bank Book</TabsTrigger>
              <TabsTrigger value="gst">GST Reports (GSTR-1/3B)</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4">
          {activeTab === "pl" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
              <div className="border rounded-xl p-6 bg-accent/10 space-y-4">
                <h3 className="font-bold text-base text-center border-b pb-3 uppercase tracking-wider">Profit & Loss Statement (Current Month)</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span>A. Revenue from Operations (Sales)</span>
                    <span>{formatCurrency(totalSales)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pl-4">
                    <span>Bottled Water Sales</span>
                    <span>{formatCurrency(totalSales * 0.85)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pl-4">
                    <span>Beverage & Soda Sales</span>
                    <span>{formatCurrency(totalSales * 0.15)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t pt-3">
                  <div className="flex justify-between font-bold text-rose-600 dark:text-rose-400">
                    <span>B. Cost of Goods Sold (COGS)</span>
                    <span>-{formatCurrency(totalPurchases)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                    <span>Gross Profit (A - B)</span>
                    <span>{formatCurrency(totalSales - totalPurchases)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t pt-3">
                  <div className="flex justify-between font-bold text-rose-600">
                    <span>C. Operating Expenses</span>
                    <span>-{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pl-4">
                    <span>Salaries & Payroll</span>
                    <span>{formatCurrency(56000)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pl-4">
                    <span>Rent & Electricity</span>
                    <span>{formatCurrency(47000)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pl-4">
                    <span>Fuel & Maintenance</span>
                    <span>{formatCurrency(13500)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-extrabold border-t-2 border-primary pt-4 text-primary">
                  <span>NET PROFIT BEFORE TAX</span>
                  <span>{formatCurrency(netProfit)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tb" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b">
                <div className="col-span-6">Account Ledger Name</div>
                <div className="col-span-3 text-right">Debit (₹)</div>
                <div className="col-span-3 text-right">Credit (₹)</div>
              </div>
              {[
                { name: "Capital Account", dr: 0, cr: 1000000 },
                { name: "Sales Account", dr: 0, cr: totalSales },
                { name: "Purchase Account", dr: totalPurchases, cr: 0 },
                { name: "Customer Sundry Debtors", dr: mockDashboardStats.outstandingPayments, cr: 0 },
                { name: "Cash in Hand", dr: 125800, cr: 0 },
                { name: "Bank Balance (HDFC)", dr: 450000, cr: 0 },
                { name: "Salaries Expense", dr: 56000, cr: 0 },
                { name: "Rent Expense", dr: 35000, cr: 0 },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-2 text-xs border-b border-border/30">
                  <div className="col-span-6 font-semibold">{row.name}</div>
                  <div className="col-span-3 text-right font-mono">{row.dr ? formatCurrency(row.dr) : "-"}</div>
                  <div className="col-span-3 text-right font-mono">{row.cr ? formatCurrency(row.cr) : "-"}</div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "cash" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-emerald-600">Cash Book Balance</h4>
                <p className="text-2xl font-extrabold">{formatCurrency(125800)}</p>
                <p className="text-xs text-muted-foreground">Cash in office safe</p>
              </div>
              <div className="p-4 border rounded-xl space-y-3">
                <h4 className="font-bold text-sm text-blue-600">Bank Balance (HDFC Main)</h4>
                <p className="text-2xl font-extrabold">{formatCurrency(450000)}</p>
                <p className="text-xs text-muted-foreground">Account: 50200012345678</p>
              </div>
            </motion.div>
          )}

          {activeTab === "gst" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 border rounded-xl bg-blue-500/5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">GSTR-1 Sales Output Tax</h4>
                  <p className="text-xs text-muted-foreground">Total CGST + SGST collected from customers</p>
                </div>
                <span className="text-lg font-bold font-mono text-primary">{formatCurrency(totalGSTOutput)}</span>
              </div>
              <div className="p-4 border rounded-xl bg-emerald-500/5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">GSTR-3B Input Tax Credit (ITC)</h4>
                  <p className="text-xs text-muted-foreground">Eligible tax credit on purchases</p>
                </div>
                <span className="text-lg font-bold font-mono text-emerald-600">{formatCurrency(totalPurchases * 0.18)}</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
