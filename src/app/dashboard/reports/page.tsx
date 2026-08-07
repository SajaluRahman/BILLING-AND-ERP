"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { BarChart3, FileSpreadsheet, Download, Printer, Filter, FileText, TrendingUp, Boxes, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

const reportCards = [
  { id: "rep-1", title: "Sales Analysis Report", category: "Sales", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Detailed breakdown of daily/monthly sales by product and route." },
  { id: "rep-2", title: "Inventory Valuation Report", category: "Inventory", icon: Boxes, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Current stock quantity, unit cost valuation, and FIFO stock balance." },
  { id: "rep-3", title: "GST Returns (GSTR-1 & 3B)", category: "Taxation", icon: FileText, color: "text-violet-500", bg: "bg-violet-500/10", desc: "GST tax liability, Output GST, Input Tax Credit (ITC), and HSN summary." },
  { id: "rep-4", title: "Customer Ledger & Aging", category: "Accounts", icon: Users, color: "text-amber-500", bg: "bg-amber-500/10", desc: "Outstanding payment aging breakdown (0-30, 31-60, 60+ days)." },
  { id: "rep-5", title: "Route & Driver Efficiency", category: "Logistics", icon: Truck, color: "text-cyan-500", bg: "bg-cyan-500/10", desc: "Delivery completion rates, trip turnaround times, and fuel usage." },
  { id: "rep-6", title: "Monthly Expense Summary", category: "Finance", icon: FileSpreadsheet, color: "text-rose-500", bg: "bg-rose-500/10", desc: "Categorized expenses: payroll, rent, utilities, fuel, and servicing." },
];

export default function ReportsPage() {
  const handleExport = (name: string, format: string) => {
    toast.success(`Exporting ${name} as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Business Intelligence"
        description="Generate and export comprehensive reports for decision making"
        icon={BarChart3}
        actions={
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Date Range Filter
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/50 hover:shadow-lg hover:border-border transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.bg} ${report.color}`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-foreground">
                    {report.category}
                  </span>
                </div>
                <CardTitle className="text-base mt-3">{report.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">{report.desc}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => handleExport(report.title, "pdf")}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => handleExport(report.title, "excel")}>
                    <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                    Excel
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleExport(report.title, "print")}>
                    <Printer className="h-3.5 w-3.5" />
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
