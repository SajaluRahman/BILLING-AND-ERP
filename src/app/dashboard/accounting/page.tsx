"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import {
  BookOpen,
  IndianRupee,
  FileSpreadsheet,
  Scale,
  TrendingUp,
  Download,
  ShieldCheck,
  FileCode,
  Share2,
  RefreshCw,
  Check,
  Plus,
  Edit2,
  Trash2,
  Zap,
  Mail,
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDashboardStats, mockInvoices, mockExpenses } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface FinancialEntry {
  id: string;
  name: string;
  category: string;
  amount: number;
}

const ACCOUNTING_TABS = [
  { id: "pl", label: "Profit & Loss", icon: TrendingUp },
  { id: "bs", label: "Balance Sheet", icon: Scale },
  { id: "gst", label: "GST Filing", icon: ShieldCheck },
  { id: "auto_billing", label: "Auto-Billing", icon: Zap },
  { id: "ca_share", label: "CA Portal", icon: Share2 },
  { id: "tally", label: "Tally Export", icon: FileCode },
];

// Initial Assets
const INITIAL_ASSETS: FinancialEntry[] = [
  { id: "ast-1", name: "Cash in Office Safe", category: "Current Asset", amount: 125800 },
  { id: "ast-2", name: "Bank Account (HDFC Main)", category: "Current Asset", amount: 450000 },
  { id: "ast-3", name: "Accounts Receivable (Debtors)", category: "Current Asset", amount: mockDashboardStats.outstandingPayments },
  { id: "ast-4", name: "Inventory Stock Valuation", category: "Current Asset", amount: 385000 },
  { id: "ast-5", name: "Delivery Fleet (Trucks/Pickups)", category: "Fixed Asset", amount: 1200000 },
  { id: "ast-6", name: "Water Purifier & Bottling Plant", category: "Fixed Asset", amount: 650000 },
];

// Initial Liabilities & Equity
const INITIAL_LIABILITIES: FinancialEntry[] = [
  { id: "lia-1", name: "Accounts Payable (Suppliers)", category: "Current Liability", amount: 210000 },
  { id: "lia-2", name: "GST Payable (Net Return)", category: "Current Liability", amount: 38500 },
  { id: "lia-3", name: "Vehicle Loan Finance", category: "Long Term Liability", amount: 450000 },
  { id: "lia-4", name: "Owner Equity & Retained Earnings", category: "Equity", amount: 2112300 },
];

// Initial Subscriptions
const RECURRING_CONTRACTS = [
  { id: "sub-1", customerName: "Royal Mart Supermarket", frequency: "Weekly (Mondays)", product: "Bisleri 20L Jar", quantity: 30, amount: 2400, nextBillingDate: "2026-08-25", status: "active" },
  { id: "sub-2", customerName: "Apex Tech Park Canteen", frequency: "Bi-Weekly", product: "Kinley 1L Case (x12)", quantity: 20, amount: 4200, nextBillingDate: "2026-08-28", status: "active" },
  { id: "sub-3", customerName: "Grand Hotel & Suites", frequency: "Monthly (1st)", product: "AquaFlow Club Soda 600ml", quantity: 50, amount: 12000, nextBillingDate: "2026-09-01", status: "active" },
  { id: "sub-4", customerName: "Horizon Corporate Office", frequency: "Weekly (Fridays)", product: "Bisleri 20L Jar", quantity: 15, amount: 1200, nextBillingDate: "2026-08-22", status: "active" },
];

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("pl");
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic Assets and Liabilities State
  const [assets, setAssets] = useState<FinancialEntry[]>(INITIAL_ASSETS);
  const [liabilities, setLiabilities] = useState<FinancialEntry[]>(INITIAL_LIABILITIES);

  // Edit Item Modal State
  const [editItem, setEditItem] = useState<{ entry: FinancialEntry; type: "asset" | "liability" } | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Add Item Modal State
  const [addType, setAddType] = useState<"asset" | "liability" | null>(null);
  const [addName, setAddName] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addCategory, setAddCategory] = useState("Current Asset");

  // CA Sharing state
  const [caEmail, setCaEmail] = useState("ca.finance@auditfirm.com");
  const [caPortalToken] = useState("CA-AUDIT-2026-882299");
  const [isCopied, setIsCopied] = useState(false);

  // Financial Calculations
  const totalSales = mockDashboardStats.monthlySales;
  const totalPurchases = mockDashboardStats.purchaseCost;
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - (totalPurchases + totalExpenses);

  const totalCGSTOutput = mockInvoices.reduce((sum, inv) => sum + inv.cgst, 0);
  const totalSGSTOutput = mockInvoices.reduce((sum, inv) => sum + inv.sgst, 0);
  const totalGSTOutput = totalCGSTOutput + totalSGSTOutput;
  const eligibleITC = Math.round(totalPurchases * 0.18);
  const netGSTPayable = Math.max(0, totalGSTOutput - eligibleITC);

  // Dynamic Assets & Liabilities Sum
  const totalAssets = assets.reduce((sum, a) => sum + a.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.amount, 0);

  // Smooth Tab Scroll
  const scrollTab = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === "left" ? -140 : 140;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Handle Edit Save
  const handleSaveEdit = () => {
    if (!editItem || !editName.trim()) return;
    const amountVal = parseFloat(editAmount) || 0;

    if (editItem.type === "asset") {
      setAssets((prev) =>
        prev.map((a) => (a.id === editItem.entry.id ? { ...a, name: editName, category: editCategory, amount: amountVal } : a))
      );
      toast.success(`Updated Asset: ${editName}`);
    } else {
      setLiabilities((prev) =>
        prev.map((l) => (l.id === editItem.entry.id ? { ...l, name: editName, category: editCategory, amount: amountVal } : l))
      );
      toast.success(`Updated Liability: ${editName}`);
    }

    setEditItem(null);
  };

  // Handle Delete Entry
  const handleDeleteEntry = (id: string, type: "asset" | "liability") => {
    if (type === "asset") {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success("Asset entry removed");
    } else {
      setLiabilities((prev) => prev.filter((l) => l.id !== id));
      toast.success("Liability entry removed");
    }
  };

  // Handle Add Entry
  const handleSaveAdd = () => {
    if (!addType || !addName.trim()) return;
    const amountVal = parseFloat(addAmount) || 0;

    const newEntry: FinancialEntry = {
      id: `entry-${Date.now()}`,
      name: addName,
      category: addCategory,
      amount: amountVal,
    };

    if (addType === "asset") {
      setAssets((prev) => [...prev, newEntry]);
      toast.success(`Added new Asset entry: ${addName}`);
    } else {
      setLiabilities((prev) => [...prev, newEntry]);
      toast.success(`Added new Liability entry: ${addName}`);
    }

    setAddType(null);
    setAddName("");
    setAddAmount("");
  };

  // Export Tally XML
  const handleExportTallyXML = () => {
    const tallyXMLContent = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC><REPORTNAME>Vouchers</REPORTNAME></REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales" ACTION="Create">
            <DATE>20260820</DATE>
            <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
            <PARTYLEDGERNAME>Royal Mart Supermarket</PARTYLEDGERNAME>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Sales Account</LEDGERNAME>
              <AMOUNT>${totalSales}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

    const blob = new Blob([tallyXMLContent], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AquaFlow_Tally_Prime_Import.xml");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Native Tally Prime XML file exported!");
  };

  // Download GSTR-1 JSON
  const handleDownloadGSTR1JSON = () => {
    const gstr1Data = {
      gstin: "32AABCU9603R1ZM",
      fp: "082026",
      b2b: mockInvoices.map((inv) => ({
        ctin: inv.customerGST || "32AAAAB1111A1Z5",
        inv: [{ inum: inv.invoiceNumber, val: inv.total, tax: inv.cgst + inv.sgst }],
      })),
    };

    const blob = new Blob([JSON.stringify(gstr1Data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "GSTR1_Monthly_Return_Aug2026.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("GSTR-1 JSON downloaded!");
  };

  return (
    <div className="space-y-6 pb-36 md:pb-12">
      <PageHeader
        title="Accounting & Financial Suite"
        description="General Ledgers, Dynamic Balance Sheet, GST Portal Filing, Auto-Billing, and Tally Prime Export"
        icon={BookOpen}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportTallyXML} className="h-8 text-xs">
              <FileCode className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
              Tally XML
            </Button>
            <Button size="sm" onClick={() => toast.success("Downloading Complete Financial Statements PDF...")} className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Statements
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard title="Gross Sales Revenue" value={totalSales} format="currency" icon={TrendingUp} iconColor="text-emerald-500" iconBg="bg-emerald-500/10" delay={0} />
        <StatsCard title="Purchase Cost (COGS)" value={totalPurchases} format="currency" icon={FileSpreadsheet} iconColor="text-blue-500" iconBg="bg-blue-500/10" delay={50} />
        <StatsCard title="Net GST Payable" value={netGSTPayable} format="currency" icon={Scale} iconColor="text-amber-500" iconBg="bg-amber-500/10" delay={100} />
        <StatsCard title="Net Operating Profit" value={netProfit} format="currency" icon={IndianRupee} iconColor="text-violet-500" iconBg="bg-violet-500/10" delay={150} />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3 border-b border-border/40 px-3 sm:px-6">
          {/* Swipeable Mobile Responsive Tab Bar */}
          <div className="relative w-full flex items-center">
            {/* Left Scroll Button (Mobile) */}
            <button
              type="button"
              onClick={() => scrollTab("left")}
              className="sm:hidden absolute left-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground border border-border shadow-md -ml-1"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Touch Swipeable Container */}
            <div
              ref={tabsContainerRef}
              className="flex items-center gap-1.5 overflow-x-auto scroll-smooth scrollbar-none touch-pan-x p-1.5 w-full max-w-full bg-muted/40 rounded-xl border border-border/40"
            >
              {ACCOUNTING_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 select-none",
                      isActive
                        ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button (Mobile) */}
            <button
              type="button"
              onClick={() => scrollTab("right")}
              className="sm:hidden absolute right-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground border border-border shadow-md -mr-1"
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-3 sm:px-6">
          {/* TAB 1: PROFIT & LOSS */}
          {activeTab === "pl" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
              <div className="border rounded-2xl p-4 sm:p-6 bg-card space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider">Profit & Loss Statement</h3>
                    <p className="text-[11px] text-muted-foreground">For Month Ending August 2026</p>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-[10px]">Audited</Badge>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span>A. Revenue from Operations (Sales)</span>
                    <span>{formatCurrency(totalSales)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground pl-3 sm:pl-4">
                    <span>Bottled Water Sales</span>
                    <span>{formatCurrency(totalSales * 0.85)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground pl-3 sm:pl-4">
                    <span>Beverage & Soda Sales</span>
                    <span>{formatCurrency(totalSales * 0.15)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm border-t pt-3">
                  <div className="flex justify-between font-bold text-rose-600 dark:text-rose-400">
                    <span>B. Cost of Goods Sold (COGS)</span>
                    <span>-{formatCurrency(totalPurchases)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                    <span>Gross Operating Margin (A - B)</span>
                    <span>{formatCurrency(totalSales - totalPurchases)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm border-t pt-3">
                  <div className="flex justify-between font-bold text-rose-600">
                    <span>C. Operating Expenses</span>
                    <span>-{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground pl-3 sm:pl-4">
                    <span>Salaries & Payroll</span>
                    <span>{formatCurrency(56000)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground pl-3 sm:pl-4">
                    <span>Rent & Electricity</span>
                    <span>{formatCurrency(47000)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] sm:text-xs text-muted-foreground pl-3 sm:pl-4">
                    <span>Vehicle Fuel & Maintenance</span>
                    <span>{formatCurrency(13500)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-extrabold border-t-2 border-primary pt-4 text-primary">
                  <span>NET PROFIT BEFORE TAX</span>
                  <span>{formatCurrency(netProfit)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DYNAMIC BALANCE SHEET */}
          {activeTab === "bs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Header Box with Responsive Wrapping Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-accent/20 p-4 rounded-2xl border border-border/50">
                <div>
                  <h3 className="font-bold text-sm">Dynamic Balance Sheet Editor</h3>
                  <p className="text-xs text-muted-foreground">Add, edit, or remove custom asset & liability ledger entries live</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] shrink-0">
                    <CheckCircle2 className="h-3 w-3 mr-1 shrink-0" />
                    Assets: ₹{formatCurrency(totalAssets)}
                  </Badge>
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/30 text-[11px] shrink-0">
                    Liabilities: ₹{formatCurrency(totalLiabilities)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ASSETS COLUMN */}
                <div className="border border-border/50 rounded-2xl p-4 sm:p-5 bg-card space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-2 gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-emerald-600 shrink-0">ASSETS</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-[11px] border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 shrink-0"
                      onClick={() => {
                        setAddType("asset");
                        setAddCategory("Current Asset");
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Asset Entry
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {assets.map((ast) => (
                      <div
                        key={ast.id}
                        className="p-3 rounded-xl border border-border/40 bg-card hover:bg-accent/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{ast.name}</p>
                          <span className="text-[10px] text-muted-foreground">{ast.category}</span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-border/30 pt-2 sm:pt-0 sm:border-0">
                          <span className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(ast.amount)}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg hover:bg-accent"
                              onClick={() => {
                                setEditItem({ entry: ast, type: "asset" });
                                setEditName(ast.name);
                                setEditAmount(ast.amount.toString());
                                setEditCategory(ast.category);
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                              onClick={() => handleDeleteEntry(ast.id, "asset")}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-bold text-xs sm:text-sm border-t-2 pt-3 text-emerald-600">
                    <span>TOTAL ASSETS</span>
                    <span>{formatCurrency(totalAssets)}</span>
                  </div>
                </div>

                {/* LIABILITIES & EQUITY COLUMN */}
                <div className="border border-border/50 rounded-2xl p-4 sm:p-5 bg-card space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-2 gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-rose-600 shrink-0">LIABILITIES & EQUITY</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-[11px] border-rose-500/30 text-rose-600 hover:bg-rose-500/10 shrink-0"
                      onClick={() => {
                        setAddType("liability");
                        setAddCategory("Current Liability");
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Liability Entry
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {liabilities.map((lia) => (
                      <div
                        key={lia.id}
                        className="p-3 rounded-xl border border-border/40 bg-card hover:bg-accent/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{lia.name}</p>
                          <span className="text-[10px] text-muted-foreground">{lia.category}</span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-border/30 pt-2 sm:pt-0 sm:border-0">
                          <span className="font-mono font-bold text-xs sm:text-sm text-rose-600 dark:text-rose-400">
                            {formatCurrency(lia.amount)}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg hover:bg-accent"
                              onClick={() => {
                                setEditItem({ entry: lia, type: "liability" });
                                setEditName(lia.name);
                                setEditAmount(lia.amount.toString());
                                setEditCategory(lia.category);
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                              onClick={() => handleDeleteEntry(lia.id, "liability")}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-bold text-xs sm:text-sm border-t-2 pt-3 text-rose-600">
                    <span>TOTAL LIABILITIES & EQUITY</span>
                    <span>{formatCurrency(totalLiabilities)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: GST FILING */}
          {activeTab === "gst" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
                  <h4 className="font-bold text-xs text-blue-600 uppercase">GSTR-1 Outward Supplies</h4>
                  <p className="text-lg sm:text-xl font-bold">{formatCurrency(totalSales)}</p>
                  <p className="text-[11px] text-muted-foreground">Total Output GST: {formatCurrency(totalGSTOutput)}</p>
                  <Button size="sm" className="w-full mt-2 text-xs h-8" onClick={handleDownloadGSTR1JSON}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download GSTR-1 JSON
                  </Button>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <h4 className="font-bold text-xs text-emerald-600 uppercase">GSTR-3B Input Tax Credit</h4>
                  <p className="text-lg sm:text-xl font-bold">{formatCurrency(eligibleITC)}</p>
                  <p className="text-[11px] text-muted-foreground">Eligible ITC on purchase invoices</p>
                  <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-8" onClick={() => toast.success("GSTR-3B Summary exported to Excel!")}>
                    <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                    Export GSTR-3B Excel
                  </Button>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <h4 className="font-bold text-xs text-amber-600 uppercase">Net GST Payable to Govt</h4>
                  <p className="text-lg sm:text-xl font-bold">{formatCurrency(netGSTPayable)}</p>
                  <p className="text-[11px] text-muted-foreground">Output Tax - Input Tax Credit</p>
                  <Button size="sm" variant="secondary" className="w-full mt-2 text-xs h-8" onClick={() => toast.success("GST Tax Challan generated!")}>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1 text-amber-600" />
                    Generate Tax Challan
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: AUTOMATED BILLING */}
          {activeTab === "auto_billing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div>
                  <h4 className="font-bold text-sm text-violet-950 dark:text-violet-300 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-violet-500 fill-violet-500" />
                    Automated Recurring Billing Engine
                  </h4>
                  <p className="text-xs text-muted-foreground">Auto-generate invoices for commercial water delivery contracts on schedule</p>
                </div>
                <Button size="sm" onClick={() => toast.success(`Executed auto-billing cycle! Generated ${RECURRING_CONTRACTS.length} invoices.`)} className="bg-violet-600 hover:bg-violet-700 text-white">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Run Auto-Billing Cycle Now
                </Button>
              </div>

              <div className="border border-border/50 rounded-2xl p-5 bg-card space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm">Active Recurring Contracts ({RECURRING_CONTRACTS.length})</h4>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">Auto-Renewing</Badge>
                </div>

                <div className="space-y-3">
                  {RECURRING_CONTRACTS.map((contract) => (
                    <div key={contract.id} className="p-4 rounded-xl border border-border/50 hover:border-border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-accent/10">
                      <div className="space-y-1">
                        <p className="text-sm font-bold">{contract.customerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{contract.product} (x{contract.quantity})</span>
                          <span>·</span>
                          <span className="font-semibold text-foreground">{contract.frequency}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="text-sm font-bold font-mono text-primary">{formatCurrency(contract.amount)}</p>
                          <p className="text-[10px] text-muted-foreground">Next: {contract.nextBillingDate}</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success(`Generated draft invoice for ${contract.customerName}`)}>
                          Bill Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: CA PORTAL */}
          {activeTab === "ca_share" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
              <div className="border border-border/50 rounded-2xl p-4 sm:p-6 bg-card space-y-5 shadow-sm">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Chartered Accountant (CA) Audit Portal</h3>
                    <p className="text-xs text-muted-foreground">Share read-only financial books & export audit bundles directly to your auditor</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">CA Auditor Email</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        value={caEmail}
                        onChange={(e) => setCaEmail(e.target.value)}
                        className="h-9 text-xs"
                      />
                      <Button size="sm" onClick={() => toast.success(`CA Audit Pack sent to ${caEmail}!`)} className="h-9 shrink-0">
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        Send Audit Pack
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-4 rounded-xl bg-accent/30 border border-border/50">
                    <label className="text-xs font-semibold">Secure Read-Only Access Link</label>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <Input
                        readOnly
                        value={`https://aquaflow.erp/ca-portal?token=${caPortalToken}`}
                        className="h-9 text-xs font-mono bg-background"
                      />
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(`https://aquaflow.erp/ca-portal?token=${caPortalToken}`);
                        setIsCopied(true);
                        toast.success("Copied CA link!");
                        setTimeout(() => setIsCopied(false), 2000);
                      }} className="h-9 shrink-0">
                        {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        {isCopied ? "Copied" : "Copy Link"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: TALLY EXPORT */}
          {activeTab === "tally" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div>
                  <h4 className="font-bold text-sm text-orange-950 dark:text-orange-300 flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-orange-500" />
                    Tally Prime / Tally.ERP 9 Direct Sync
                  </h4>
                  <p className="text-xs text-muted-foreground">Export native XML vouchers for 1-click import into Tally ERP</p>
                </div>
                <Button size="sm" onClick={handleExportTallyXML} className="bg-orange-600 hover:bg-orange-700 text-white font-bold shrink-0">
                  <Download className="h-4 w-4 mr-2" />
                  Export AquaFlow_Tally_Prime_Import.xml
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* EDIT ENTRY DIALOG */}
      <Dialog open={Boolean(editItem)} onOpenChange={(val) => !val && setEditItem(null)}>
        <DialogContent className="sm:max-w-md max-w-[92vw] border-border/50">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit {editItem?.type === "asset" ? "Asset" : "Liability"} Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Entry Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount (₹)</Label>
              <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="h-9 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD ENTRY DIALOG */}
      <Dialog open={Boolean(addType)} onOpenChange={(val) => !val && setAddType(null)}>
        <DialogContent className="sm:max-w-md max-w-[92vw] border-border/50">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New {addType === "asset" ? "Asset" : "Liability"} Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Entry Name</Label>
              <Input placeholder="e.g. Office Security Deposit" value={addName} onChange={(e) => setAddName(e.target.value)} className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Category</Label>
              <Select value={addCategory} onValueChange={(val) => val && setAddCategory(val)}>
                <SelectTrigger className="h-9 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Current Asset">Current Asset</SelectItem>
                  <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                  <SelectItem value="Current Liability">Current Liability</SelectItem>
                  <SelectItem value="Long Term Liability">Long Term Liability</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount (₹)</Label>
              <Input type="number" placeholder="50000" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className="h-9 text-xs font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddType(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveAdd}>Add Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
