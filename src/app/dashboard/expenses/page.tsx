"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { CreditCard, Plus, Search, Fuel, Building, Wrench, Zap, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockExpenses } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ExpensesPage() {
  const [search, setSearch] = useState("");

  const filteredExpenses = mockExpenses.filter(
    (e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const fuelExpenses = mockExpenses.filter((e) => e.category === "fuel").reduce((sum, e) => sum + e.amount, 0);
  const salaryExpenses = mockExpenses.filter((e) => e.category === "salary").reduce((sum, e) => sum + e.amount, 0);
  const rentExpenses = mockExpenses.filter((e) => e.category === "rent" || e.category === "electricity").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense Management"
        description="Track business expenditures, vehicle fuel logs, facility rent, and payroll"
        icon={CreditCard}
        actions={
          <ActionDialog
            title="Log New Expense"
            description="Record company operating expenditure, fuel bill, or maintenance cost"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            }
            fields={[
              { name: "description", label: "Expense Description", placeholder: "e.g. Fuel refill for Tata Ace (KL-07-CD-1122)", required: true },
              { name: "category", label: "Category", type: "select", options: [{ label: "Fuel", value: "fuel" }, { label: "Salaries", value: "salary" }, { label: "Rent", value: "rent" }, { label: "Electricity / Utilities", value: "electricity" }, { label: "Vehicle Maintenance", value: "maintenance" }, { label: "Other Operating", value: "other" }], defaultValue: "fuel" },
              { name: "amount", label: "Expense Amount (₹)", type: "number", placeholder: "2500", required: true },
              { name: "paymentMethod", label: "Paid Via", type: "select", options: [{ label: "Cash", value: "cash" }, { label: "UPI", value: "upi" }, { label: "Bank Account", value: "bank_transfer" }, { label: "Credit Card", value: "card" }], defaultValue: "cash" },
              { name: "referenceNumber", label: "Bill / Receipt Ref No", placeholder: "PETROL-BILL-8822" },
            ]}
            onSuccessMessage="Expense logged into accounting ledger!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Monthly Expenses" value={totalExpenses} format="currency" icon={CreditCard} iconColor="text-rose-500" iconBg="bg-rose-500/10" delay={0} />
        <StatsCard title="Salaries & Payroll" value={salaryExpenses} format="currency" icon={UserCheck} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={50} />
        <StatsCard title="Rent & Electricity" value={rentExpenses} format="currency" icon={Building} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Vehicle Fuel Costs" value={fuelExpenses} format="currency" icon={Fuel} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">Expense Records</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expense description..."
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
              <div className="col-span-3">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Payment Method</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            {filteredExpenses.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors items-center border-b border-border/20 last:border-0 cursor-pointer"
              >
                <div className="col-span-3">
                  <p className="text-sm font-semibold">{exp.description}</p>
                  {exp.referenceNumber && <p className="text-xs font-mono text-muted-foreground">Ref: {exp.referenceNumber}</p>}
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md bg-accent text-foreground capitalize">
                    {exp.category === "fuel" && <Fuel className="h-3 w-3 text-amber-500" />}
                    {exp.category === "salary" && <UserCheck className="h-3 w-3 text-blue-500" />}
                    {exp.category === "rent" && <Building className="h-3 w-3 text-violet-500" />}
                    {exp.category === "electricity" && <Zap className="h-3 w-3 text-yellow-500" />}
                    {exp.category === "maintenance" && <Wrench className="h-3 w-3 text-rose-500" />}
                    {exp.category}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground capitalize">{exp.paymentMethod.replace('_', ' ')}</div>
                <div className="col-span-2 text-xs text-muted-foreground">{formatDate(exp.date)}</div>
                <div className="col-span-1">
                  <StatusBadge status={exp.status} />
                </div>
                <div className="col-span-2 text-right font-bold text-sm font-mono text-rose-600 dark:text-rose-400">
                  {formatCurrency(exp.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
