"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionDialog } from "@/components/shared/action-dialog";
import { UserCog, Plus, Search, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockUsers } from "@/lib/mock-data";
import { ROLE_LABELS } from "@/lib/constants";
import { getInitials, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & RBAC Management"
        description="Configure system access roles, user permissions, and user accounts"
        icon={UserCog}
        actions={
          <ActionDialog
            title="Create System User"
            description="Invite a staff member and assign Role-Based Access Control (RBAC)"
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            }
            fields={[
              { name: "name", label: "Full Name", placeholder: "e.g. Anand Varma", required: true },
              { name: "email", label: "Work Email", type: "email", placeholder: "anand@aquaflow.in", required: true },
              { name: "phone", label: "Mobile Number", placeholder: "+91 98765 11223", required: true },
              { name: "role", label: "Assign RBAC Role", type: "select", options: Object.entries(ROLE_LABELS).map(([val, lbl]) => ({ label: lbl, value: val })), defaultValue: "sales_executive" },
              { name: "password", label: "Initial Password", type: "text", placeholder: "Auto-generated password", defaultValue: "AquaFlow@2026" },
            ]}
            onSuccessMessage="New system user invited with assigned RBAC role!"
          />
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total System Users" value={mockUsers.length} icon={UserCog} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={0} />
        <StatsCard title="Active Users" value={mockUsers.filter((u) => u.isActive).length} icon={ShieldCheck} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={50} />
        <StatsCard title="Configured Roles" value={11} icon={Lock} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={100} />
        <StatsCard title="Admins & Owners" value={2} icon={UserCog} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">System User Directory</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search user name or role..."
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
              <div className="col-span-4">User Details</div>
              <div className="col-span-3">Role / Permission Level</div>
              <div className="col-span-2">Phone Number</div>
              <div className="col-span-2">Last Login</div>
              <div className="col-span-1 text-right">Status</div>
            </div>
            {filteredUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors items-center border-b border-border/20 last:border-0 cursor-pointer"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="col-span-3">
                  <Badge variant="outline" className="font-semibold text-xs capitalize bg-primary/5 text-primary border-primary/20">
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground">{user.phone}</div>
                <div className="col-span-2 text-xs text-muted-foreground">{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</div>
                <div className="col-span-1 text-right">
                  <StatusBadge status={user.isActive ? "active" : "inactive"} />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
