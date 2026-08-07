"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { Building2, Plus, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCompanies } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies & Sister Concerns"
        description="Manage multi-company distribution entities, GSTIN records, and bank accounts"
        icon={Building2}
        actions={
          <ActionDialog
            title="Add Company Entity"
            description="Register a new distribution business entity or sister concern"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            }
            fields={[
              { name: "name", label: "Company Legal Name", placeholder: "e.g. AquaFlow Beverages Pvt Ltd", required: true },
              { name: "code", label: "Company Code", placeholder: "e.g. AF-BEV-02", required: true },
              { name: "gst", label: "GSTIN", placeholder: "32AABCU9603R1ZM", required: true },
              { name: "pan", label: "PAN Number", placeholder: "AABCU9603R", required: true },
              { name: "phone", label: "Phone", placeholder: "+91 484 2345678", required: true },
              { name: "email", label: "Email", type: "email", placeholder: "info@aquaflow.in", required: true },
              { name: "bankName", label: "Primary Bank Name", placeholder: "HDFC Bank", required: true },
              { name: "accountNumber", label: "Bank Account Number", placeholder: "50200012345678", required: true },
              { name: "ifscCode", label: "IFSC Code", placeholder: "HDFC0001234", required: true },
            ]}
            onSuccessMessage="New Company registered!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Companies" value={mockCompanies.length} icon={Building2} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Active Entities" value={mockCompanies.filter((c) => c.isActive).length} icon={Building2} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Total Warehouses" value={3} icon={Building2} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Linked GSTINs" value={mockCompanies.length} icon={Building2} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCompanies.map((comp, i) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border/50 hover:shadow-lg hover:border-border transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-md">
                    {comp.name.slice(0, 2).toUpperCase()}
                  </div>
                  <StatusBadge status={comp.isActive ? "active" : "inactive"} />
                </div>
                <CardTitle className="text-lg mt-3">{comp.name}</CardTitle>
                <p className="text-xs font-mono text-muted-foreground">{comp.code}</p>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>GSTIN: <strong className="font-mono text-foreground">{comp.gst}</strong></div>
                  <div>PAN: <strong className="font-mono text-foreground">{comp.pan}</strong></div>
                </div>

                <div className="space-y-1.5 text-muted-foreground border-t border-border/50 pt-3">
                  <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-blue-500" />{comp.phone}</div>
                  <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-emerald-500" />{comp.email}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-violet-500" />{comp.address.line1}, {comp.address.city}</div>
                </div>

                <div className="border-t border-border/50 pt-3 space-y-1 text-muted-foreground">
                  <div className="font-semibold text-foreground flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-amber-500" />Bank Details:</div>
                  <div className="font-mono text-[11px]">{comp.bankDetails.bankName} - A/C: {comp.bankDetails.accountNumber} ({comp.bankDetails.ifscCode})</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
