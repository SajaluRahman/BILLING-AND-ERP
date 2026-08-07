"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Users, Plus, Search, Star, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockCustomers, mockDashboardStats } from "@/lib/mock-data";
import { formatCurrency, getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.businessName.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalOutstanding = mockCustomers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer directory and accounts"
        icon={Users}
        actions={
          <ActionDialog
            title="Add New Customer"
            description="Register a new retail store, hotel, corporate office, or distributor"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            }
            fields={[
              { name: "businessName", label: "Business / Shop Name", placeholder: "e.g. Royal Mart Supermarket", required: true },
              { name: "ownerName", label: "Owner / Contact Person", placeholder: "e.g. Rahul Sharma", required: true },
              { name: "type", label: "Customer Type", type: "select", options: [{ label: "Commercial", value: "commercial" }, { label: "Corporate", value: "corporate" }, { label: "Reseller", value: "reseller" }, { label: "Residential", value: "residential" }], defaultValue: "commercial" },
              { name: "phone", label: "Phone Number", placeholder: "+91 98765 43210", required: true },
              { name: "email", label: "Email Address", type: "email", placeholder: "customer@example.com" },
              { name: "gst", label: "GSTIN (Optional)", placeholder: "32AAAAA0000A1Z5" },
              { name: "creditLimit", label: "Credit Limit (₹)", type: "number", placeholder: "50000" },
              { name: "city", label: "City / Location", placeholder: "Kochi", required: true },
            ]}
            onSuccessMessage="New Customer registered successfully!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Customers" value={mockDashboardStats.totalCustomers} icon={Users} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Active" value={mockDashboardStats.activeCustomers} icon={Users} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Inactive" value={mockDashboardStats.inactiveCustomers} icon={Users} iconColor="text-slate-500" iconBg="bg-slate-500/10" delay={100} />
        <StatsCard title="Outstanding" value={totalOutstanding} format="currency" icon={Users} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map((customer, i) => (
          <motion.div key={customer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="border-border/50 hover:shadow-md hover:border-border transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold">
                      {getInitials(customer.businessName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold truncate">{customer.businessName}</h3>
                      <StatusBadge status={customer.isActive ? "active" : "inactive"} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{customer.ownerName}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{customer.contacts[0]?.phone}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{customer.address.city}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-medium">{customer.rating}</span>
                        <span className="text-xs text-muted-foreground capitalize">· {customer.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(customer.outstandingBalance)}</p>
                        <p className="text-[10px] text-muted-foreground">outstanding</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
