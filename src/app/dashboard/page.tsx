"use client";

import { StatsCard } from "@/components/shared/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesTrendChart } from "@/components/dashboard/sales-trend-chart";
import { InventoryChart } from "@/components/dashboard/inventory-chart";
import { DeliveryStatus } from "@/components/dashboard/delivery-status";
import { TopProducts } from "@/components/dashboard/top-products";
import { TopCustomers } from "@/components/dashboard/top-customers";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { CashFlowCard } from "@/components/dashboard/cash-flow-card";
import { PageHeader } from "@/components/shared/page-header";
import { mockDashboardStats } from "@/lib/mock-data";
import {
  IndianRupee,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Package,
  PackageX,
  Truck,
  CheckCircle2,
  Car,
  Wallet,
  PiggyBank,
  ShoppingCart,
  LayoutDashboard,
} from "lucide-react";

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your business."
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Sales"
          value={stats.todaySales}
          format="currency"
          icon={IndianRupee}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          trend="up"
          trendValue={12.5}
          description="vs yesterday"
          delay={0}
        />
        <StatsCard
          title="Monthly Sales"
          value={stats.monthlySales}
          format="currency"
          icon={TrendingUp}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
          trend="up"
          trendValue={8.2}
          description="vs last month"
          delay={50}
        />
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          format="currency"
          icon={PiggyBank}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
          trend="up"
          trendValue={15.3}
          description="this year"
          delay={100}
        />
        <StatsCard
          title="Outstanding"
          value={stats.outstandingPayments}
          format="currency"
          icon={Wallet}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          trend="down"
          trendValue={3.1}
          description="total due"
          delay={150}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
          delay={200}
        />
        <StatsCard
          title="Active Customers"
          value={stats.activeCustomers}
          icon={UserCheck}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          delay={250}
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={Package}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          delay={300}
        />
        <StatsCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={Truck}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
          delay={350}
        />
        <StatsCard
          title="Completed Deliveries"
          value={stats.completedDeliveries}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          delay={400}
        />
        <StatsCard
          title="Vehicles On Route"
          value={stats.vehiclesOnRoute}
          icon={Car}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
          delay={450}
        />
        <StatsCard
          title="Daily Collection"
          value={stats.dailyCollection}
          format="currency"
          icon={ShoppingCart}
          iconColor="text-cyan-500"
          iconBg="bg-cyan-500/10"
          delay={500}
        />
        <StatsCard
          title="Monthly Profit"
          value={stats.profit}
          format="currency"
          icon={PiggyBank}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          trend="up"
          trendValue={5.4}
          description="vs last month"
          delay={550}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <SalesTrendChart />
      </div>

      {/* Quick Actions + Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <CashFlowCard />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopProducts />
        <InventoryChart />
        <TopCustomers />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentInvoices />
        </div>
        <LowStockAlerts />
      </div>

      {/* Deliveries */}
      <DeliveryStatus />
    </div>
  );
}
