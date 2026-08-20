"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Settings,
  Building2,
  Receipt,
  Bell,
  Save,
  Check,
  Palette,
  Eye,
  Sparkles,
  Printer,
  Search,
  LayoutGrid,
  QrCode,
  Plus,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCompanies, mockInvoices } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

// INVOICE TEMPLATE STRUCTURAL STYLES
interface InvoiceStyleTemplate {
  id: string;
  name: string;
  description: string;
  layoutType: "banner" | "classic_frame" | "sidebar_strip" | "thermal_slip" | "split_cards" | "centered_minimal" | "dark_luxury" | "tech_qr";
  previewMock: string;
  isCustom?: boolean;
}

const INITIAL_TEMPLATE_STYLES: InvoiceStyleTemplate[] = [
  {
    id: "style_banner",
    name: "Style 1: Modern Banner Header",
    description: "Full-width colored gradient header with 2-column info cards and rounded line items table",
    layoutType: "banner",
    previewMock: "Header Banner · Modern Grid · Clean Rows",
  },
  {
    id: "style_classic_frame",
    name: "Style 2: Official Double Border Frame",
    description: "Traditional government style tax invoice with double page frame, HSN breakdown & official seal",
    layoutType: "classic_frame",
    previewMock: "Double Border · Formal Box Grid · Official Seal",
  },
  {
    id: "style_sidebar_strip",
    name: "Style 3: Left Accent Strip",
    description: "Vertical color bar running along the left margin with elegant left-aligned typography",
    layoutType: "sidebar_strip",
    previewMock: "Left Color Bar · Clean Margin · Minimal Lines",
  },
  {
    id: "style_thermal_slip",
    name: "Style 4: Compact POS Thermal Receipt (80mm)",
    description: "Narrow receipt format with dashed line dividers, monospace font, and scannable barcode at bottom",
    layoutType: "thermal_slip",
    previewMock: "80mm POS Slip · Monospace · Dashed Lines",
  },
  {
    id: "style_split_cards",
    name: "Style 5: Split Card Containers",
    description: "Modern UI layout featuring rounded card blocks for Billed By, Billed To, and Summary Totals",
    layoutType: "split_cards",
    previewMock: "Card Blocks · Pill Badges · Boxed Totals",
  },
  {
    id: "style_centered_minimal",
    name: "Style 6: Centered Minimalist",
    description: "Centered logo and header text with delicate divider lines and soft minimalist table styling",
    layoutType: "centered_minimal",
    previewMock: "Centered Logo · Delicate Lines · Minimal Theme",
  },
  {
    id: "style_dark_luxury",
    name: "Style 7: Luxury Dark Slate & Gold",
    description: "Dark slate invoice background with gold borders and high-contrast gold text badges",
    layoutType: "dark_luxury",
    previewMock: "Dark Slate · Gold Borders · High Contrast",
  },
  {
    id: "style_tech_qr",
    name: "Style 8: High-Tech QR & Barcode Header",
    description: "Top header prominent payment QR Code box, barcode strip, and tech metadata badges",
    layoutType: "tech_qr",
    previewMock: "Prominent QR Header · Barcode Strip · Tech Tags",
  },
];

// PRE-CONFIGURED COLOR PALETTES FOR COLOR SEARCH & CHOOSER
interface ColorPalette {
  name: string;
  hex: string;
  bgGradient: string;
  category: "blue" | "teal" | "green" | "purple" | "red" | "orange" | "gold" | "dark";
}

const COLOR_PALETTES: ColorPalette[] = [
  { name: "Royal Blue", hex: "#2563eb", bgGradient: "from-blue-600 to-indigo-600", category: "blue" },
  { name: "Cyan Teal", hex: "#0891b2", bgGradient: "from-cyan-600 to-teal-600", category: "teal" },
  { name: "Emerald Water", hex: "#059669", bgGradient: "from-emerald-600 to-teal-700", category: "green" },
  { name: "Forest Green", hex: "#15803d", bgGradient: "from-green-700 to-emerald-800", category: "green" },
  { name: "Deep Purple", hex: "#7c3aed", bgGradient: "from-violet-600 to-purple-700", category: "purple" },
  { name: "Fuchsia Magenta", hex: "#c026d3", bgGradient: "from-fuchsia-600 to-pink-600", category: "purple" },
  { name: "Crimson Red", hex: "#dc2626", bgGradient: "from-red-600 to-rose-700", category: "red" },
  { name: "Sunset Orange", hex: "#ea580c", bgGradient: "from-orange-600 to-amber-600", category: "orange" },
  { name: "Amber Gold", hex: "#d97706", bgGradient: "from-amber-500 to-yellow-600", category: "gold" },
  { name: "Midnight Slate", hex: "#0f172a", bgGradient: "from-slate-900 to-slate-800", category: "dark" },
  { name: "Charcoal Gray", hex: "#334155", bgGradient: "from-slate-700 to-slate-900", category: "dark" },
];

export default function SettingsPage() {
  const company = mockCompanies[0];
  const sampleInvoice = mockInvoices[0];
  const [isSaved, setIsSaved] = useState(false);

  // Template Styles State (Supports user-created templates!)
  const [templateStyles, setTemplateStyles] = useState<InvoiceStyleTemplate[]>(INITIAL_TEMPLATE_STYLES);
  const [selectedStyleId, setSelectedStyleId] = useState("style_banner");
  const [selectedColor, setSelectedColor] = useState<ColorPalette>(COLOR_PALETTES[0]);
  const [customHex, setCustomHex] = useState("#2563eb");
  const [colorSearchQuery, setColorSearchQuery] = useState("");

  // Create Template Dialog State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [newTemplateLayout, setNewTemplateLayout] = useState<InvoiceStyleTemplate["layoutType"]>("banner");
  const [newTemplateColorHex, setNewTemplateColorHex] = useState("#0891b2");

  // Template Field Customization Toggles
  const [showLogo, setShowLogo] = useState(true);
  const [showGSTIN, setShowGSTIN] = useState(true);
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [showQRCode, setShowQRCode] = useState(true);
  const [showTerms, setShowTerms] = useState(true);
  const [showSignatory, setShowSignatory] = useState(true);
  const [showHSNTable, setShowHSNTable] = useState(true);

  // Custom Field Text Values
  const [invoiceTitle, setInvoiceTitle] = useState("TAX INVOICE");
  const [subTitleNote, setSubTitleNote] = useState("Water & Beverage Distribution Invoice");
  const [companyName, setCompanyName] = useState(company.name);
  const [companyGST, setCompanyGST] = useState(company.gst);
  const [companyPhone, setCompanyPhone] = useState(company.phone);
  const [companyEmail, setCompanyEmail] = useState(company.email);
  const [companyAddress, setCompanyAddress] = useState(`${company.address.line1}, ${company.address.city}, ${company.address.state} - ${company.address.pincode}`);
  const [bankName, setBankName] = useState("HDFC Bank Ltd (Commercial)");
  const [accountNo, setAccountNo] = useState("50200088991122");
  const [ifscCode, setIfscCode] = useState("HDFC0001234");
  const [upiId, setUpiId] = useState("aquaflow@hdfcbank");
  const [footerNote, setFooterNote] = useState("Thank you for your business! Water quality certified under FSSAI & BIS standards.");
  const [termsText, setTermsText] = useState("1. Goods once delivered cannot be returned after 7 days.\n2. Payment is due within 15 days of invoice date.\n3. All disputes subject to local jurisdiction.");

  const currentStyle = templateStyles.find((s) => s.id === selectedStyleId) || templateStyles[0];

  // Filter color palettes based on search query
  const filteredColors = COLOR_PALETTES.filter((c) =>
    c.name.toLowerCase().includes(colorSearchQuery.toLowerCase()) ||
    c.hex.toLowerCase().includes(colorSearchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(colorSearchQuery.toLowerCase())
  );

  // Create New Custom Template Handler
  const handleCreateCustomTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    const customId = `custom_${Date.now()}`;
    const newStyle: InvoiceStyleTemplate = {
      id: customId,
      name: newTemplateName,
      description: newTemplateDesc || "Custom user-designed invoice template",
      layoutType: newTemplateLayout,
      previewMock: "Custom Created · User Configured · Live",
      isCustom: true,
    };

    setTemplateStyles((prev) => [newStyle, ...prev]);
    setSelectedStyleId(customId);
    setSelectedColor({
      name: `${newTemplateName} Color`,
      hex: newTemplateColorHex,
      bgGradient: "from-slate-900 to-slate-800",
      category: "blue",
    });
    setCustomHex(newTemplateColorHex);

    setIsCreateModalOpen(false);
    setNewTemplateName("");
    setNewTemplateDesc("");
    toast.success(`Custom Template "${newTemplateName}" Created & Applied!`);
  };

  const handleSave = () => {
    setIsSaved(true);
    toast.success("Invoice Template Style & Customizations Saved!");
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-36 md:pb-12">
      <PageHeader
        title="Settings & Invoice Template Customizer"
        description="Choose distinct invoice layout styles, create custom templates, search & select colors, and customize all bill fields live"
        icon={Settings}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-9 text-xs border-primary/30 text-primary hover:bg-primary/10 font-bold"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create Custom Template
            </Button>
            <Button onClick={handleSave} size="sm" className="h-9 text-xs bg-primary hover:bg-primary/90 font-bold">
              {isSaved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Template
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="template" className="w-full">
        {/* Navigation Tabs */}
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl bg-muted/40 p-1 rounded-xl h-auto">
          <TabsTrigger value="template" className="text-xs py-2 flex items-center justify-center gap-1.5 font-bold">
            <LayoutGrid className="h-3.5 w-3.5" />
            Bill Style Templates
          </TabsTrigger>
          <TabsTrigger value="company" className="text-xs py-2 flex items-center justify-center gap-1.5 font-bold">
            <Building2 className="h-3.5 w-3.5" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-xs py-2 flex items-center justify-center gap-1.5 font-bold">
            <Receipt className="h-3.5 w-3.5" />
            GST & Billing
          </TabsTrigger>
          <TabsTrigger value="notif" className="text-xs py-2 flex items-center justify-center gap-1.5 font-bold">
            <Bell className="h-3.5 w-3.5" />
            Alerts & System
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INVOICE LAYOUT STYLES & COLOR CHOOSER & LIVE CUSTOMIZER */}
        <TabsContent value="template" className="mt-6 space-y-6">
          {/* SECTION 1: INVOICE LAYOUT STYLES (WITH CREATE CUSTOM TEMPLATE BUTTON) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-accent/15 p-4 rounded-2xl border border-border/50">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                  1. Choose or Create Bill Layout Style ({templateStyles.length} Available)
                </h3>
                <p className="text-xs text-muted-foreground">Select a structural layout or click "Create Custom Template" to build your own from scratch</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0"
                >
                  <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                  Create Custom Template
                </Button>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs font-bold shrink-0">
                  Active: {currentStyle.name}
                </Badge>
              </div>
            </div>

            {/* Layout Styles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {templateStyles.map((style) => {
                const isSelected = style.id === selectedStyleId;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setSelectedStyleId(style.id);
                      toast.info(`Switched to ${style.name}`);
                    }}
                    className={cn(
                      "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between space-y-3 bg-card hover:border-primary/50 cursor-pointer shadow-xs",
                      isSelected
                        ? "border-2 border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "border-border/60"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <Badge variant={style.isCustom ? "default" : "secondary"} className={cn("text-[10px] font-mono uppercase tracking-wider", style.isCustom && "bg-emerald-600 text-white")}>
                          {style.isCustom ? "Custom Created" : style.layoutType.replace(/_/g, " ")}
                        </Badge>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{style.name}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{style.description}</p>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-accent/30 border border-border/40 text-[10px] font-mono text-muted-foreground">
                      {style.previewMock}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: INTERACTIVE COLOR CHOOSER WITH SEARCH FILTER */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Palette className="h-4 w-4 text-violet-500" />
                  2. Choose & Search Invoice Theme Color
                </h3>
                <p className="text-xs text-muted-foreground">Search color names (e.g. "blue", "gold", "green") or enter a custom hex code</p>
              </div>

              {/* Color Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search colors (blue, gold...)"
                  value={colorSearchQuery}
                  onChange={(e) => setColorSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>
            </div>

            {/* Color Swatches Grid + Custom Color Picker */}
            <div className="flex flex-wrap items-center gap-2.5 bg-accent/20 p-3.5 rounded-2xl border border-border/50">
              {filteredColors.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setCustomHex(color.hex);
                      toast.success(`Theme color set to ${color.name}`);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer",
                      isSelected
                        ? "bg-background text-foreground border-primary ring-2 ring-primary/20 shadow-xs"
                        : "bg-card text-muted-foreground hover:text-foreground border-border/60"
                    )}
                  >
                    <span className="h-4 w-4 rounded-full border shadow-xs" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                  </button>
                );
              })}

              {/* Custom Hex Color Picker Input */}
              <div className="flex items-center gap-2 pl-2 border-l border-border/60 ml-auto">
                <span className="text-xs font-semibold text-muted-foreground">Custom Color:</span>
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    setSelectedColor({
                      name: "Custom Hex",
                      hex: e.target.value,
                      bgGradient: "from-slate-900 to-slate-800",
                      category: "blue",
                    });
                  }}
                  className="h-7 w-7 rounded-lg border cursor-pointer bg-transparent"
                />
                <Input
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    setSelectedColor({
                      name: "Custom Hex",
                      hex: e.target.value,
                      bgGradient: "from-slate-900 to-slate-800",
                      category: "blue",
                    });
                  }}
                  className="h-7 w-24 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: LIVE FIELD CUSTOMIZER & REAL-TIME PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-border/50">
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="border-border/50 shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    3. Customize Field Display & Text
                  </CardTitle>
                  <CardDescription className="text-xs">Toggle optional sections and edit field labels live</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  {/* Field Toggles */}
                  <div className="space-y-2 border-b border-border/40 pb-3">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Field Display Toggles</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/20 border border-border/40">
                        <span>Company Logo</span>
                        <Switch checked={showLogo} onCheckedChange={setShowLogo} />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/20 border border-border/40">
                        <span>GSTIN & Tax No</span>
                        <Switch checked={showGSTIN} onCheckedChange={setShowGSTIN} />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/20 border border-border/40">
                        <span>Bank Details</span>
                        <Switch checked={showBankDetails} onCheckedChange={setShowBankDetails} />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/20 border border-border/40">
                        <span>UPI Payment QR</span>
                        <Switch checked={showQRCode} onCheckedChange={setShowQRCode} />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/20 border border-border/40">
                        <span>HSN Code Table</span>
                        <Switch checked={showHSNTable} onCheckedChange={setShowHSNTable} />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-accent/20 border border-border/40">
                        <span>Authorized Stamp</span>
                        <Switch checked={showSignatory} onCheckedChange={setShowSignatory} />
                      </div>
                    </div>
                  </div>

                  {/* Titles & Notes */}
                  <div className="space-y-3 border-b border-border/40 pb-3">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Titles & Headers</p>
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Bill Header Title</Label>
                      <Input value={invoiceTitle} onChange={(e) => setInvoiceTitle(e.target.value)} className="h-8 text-xs font-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px]">Header Subtitle Note</Label>
                      <Input value={subTitleNote} onChange={(e) => setSubTitleNote(e.target.value)} className="h-8 text-xs" />
                    </div>
                  </div>

                  {/* Bank & Payment Info */}
                  <div className="space-y-3 border-b border-border/40 pb-3">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Bank & Payment Setup</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px]">Bank Name</Label>
                        <Input value={bankName} onChange={(e) => setBankName(e.target.value)} className="h-8 text-[11px]" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">Account No</Label>
                        <Input value={accountNo} onChange={(e) => setAccountNo(e.target.value)} className="h-8 text-[11px] font-mono" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">IFSC Code</Label>
                        <Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className="h-8 text-[11px] font-mono" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px]">UPI VPA Address</Label>
                        <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} className="h-8 text-[11px] font-mono" />
                      </div>
                    </div>
                  </div>

                  {/* Terms & Footer Note */}
                  <div className="space-y-3">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Footer Notes & Terms</p>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Footer Certification Note</Label>
                      <Textarea value={footerNote} onChange={(e) => setFooterNote(e.target.value)} className="text-[11px] min-h-[45px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px]">Terms & Conditions</Label>
                      <Textarea value={termsText} onChange={(e) => setTermsText(e.target.value)} className="text-[11px] min-h-[55px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Live Preview Sheet (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <span className="font-bold text-sm">Live Real-Time Bill Preview</span>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5 mr-1" />
                  Print Test Preview
                </Button>
              </div>

              {/* RENDER DISTINCT INVOICE LAYOUT STRUCTURAL STYLES */}

              {/* LAYOUT 1: MODERN BANNER HEADER */}
              {currentStyle.layoutType === "banner" && (
                <div className="border border-border/80 rounded-2xl bg-white text-slate-900 p-6 sm:p-8 space-y-6 shadow-md min-h-[650px] font-sans text-xs">
                  <div
                    className="rounded-xl p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs"
                    style={{ backgroundColor: selectedColor.hex }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {showLogo && <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white">💧</div>}
                        <h2 className="text-base font-extrabold tracking-wide uppercase">{companyName}</h2>
                      </div>
                      <p className="text-[11px] text-white/80">{subTitleNote}</p>
                      {showGSTIN && <p className="text-[10px] font-mono text-white/90">GSTIN: {companyGST}</p>}
                    </div>
                    <div className="text-left sm:text-right space-y-0.5">
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs font-bold uppercase">{invoiceTitle}</Badge>
                      <p className="text-[11px] font-mono font-bold mt-1 text-white">#{sampleInvoice.invoiceNumber}</p>
                      <p className="text-[10px] text-white/80">Date: {sampleInvoice.createdAt}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b pb-4 text-[11px]">
                    <div>
                      <p className="font-bold text-slate-400 uppercase text-[9px]">Billed By (Supplier)</p>
                      <p className="font-bold text-slate-900">{companyName}</p>
                      <p className="text-slate-600">{companyAddress}</p>
                      <p className="text-slate-600">Ph: {companyPhone} | {companyEmail}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 uppercase text-[9px]">Billed To (Customer)</p>
                      <p className="font-bold text-slate-900">{sampleInvoice.customerName}</p>
                      <p className="text-slate-600">Apex Commercial Tower, Sector 4</p>
                      {showGSTIN && <p className="text-slate-600 font-mono">GSTIN: {sampleInvoice.customerGST}</p>}
                    </div>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-[9px]">
                        <th className="py-2">Item Description</th>
                        {showHSNTable && <th className="py-2 text-center">HSN</th>}
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Rate</th>
                        <th className="py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {sampleInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-semibold text-slate-800">{item.productName}</td>
                          {showHSNTable && <td className="py-2.5 text-center font-mono text-slate-500">2201</td>}
                          <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                          <td className="py-2.5 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-slate-900">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-end border-t pt-4">
                    <div className="space-y-2 max-w-[55%]">
                      {showBankDetails && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                          <p className="font-bold text-slate-700 uppercase">Bank Payment Info</p>
                          <p>Bank: <span className="font-semibold">{bankName}</span> | A/c: <span className="font-mono font-bold">{accountNo}</span></p>
                          <p>IFSC: <span className="font-mono font-bold">{ifscCode}</span> | UPI: <span className="font-mono">{upiId}</span></p>
                        </div>
                      )}
                    </div>
                    <div className="w-44 space-y-1 text-right text-[11px]">
                      <div className="flex justify-between text-slate-600"><span>Subtotal:</span><span className="font-mono">{formatCurrency(sampleInvoice.subtotal)}</span></div>
                      <div className="flex justify-between text-slate-600"><span>GST Tax (18%):</span><span className="font-mono">{formatCurrency(sampleInvoice.cgst + sampleInvoice.sgst)}</span></div>
                      <div className="flex justify-between font-extrabold text-sm border-t-2 border-slate-800 pt-1 text-slate-900" style={{ color: selectedColor.hex }}>
                        <span>Total:</span><span>{formatCurrency(sampleInvoice.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 2: CLASSIC DOUBLE BORDER FRAME (OFFICIAL GOVT TAX INVOICE) */}
              {currentStyle.layoutType === "classic_frame" && (
                <div className="border-4 border-double border-slate-800 rounded-none bg-white text-slate-900 p-6 space-y-5 min-h-[650px] font-serif text-xs">
                  <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                    <h2 className="text-lg font-bold uppercase tracking-wider" style={{ color: selectedColor.hex }}>{invoiceTitle}</h2>
                    <p className="text-sm font-bold text-slate-800">{companyName}</p>
                    <p className="text-[10px] text-slate-600">{companyAddress}</p>
                    {showGSTIN && <p className="text-[10px] font-mono font-bold">GSTIN: {companyGST} | PAN: AABCU9603R</p>}
                  </div>

                  <div className="grid grid-cols-2 border border-slate-800 text-[11px]">
                    <div className="p-3 border-r border-slate-800 space-y-1">
                      <p className="font-bold text-[9px] uppercase border-b pb-0.5">Details of Receiver / Billed To:</p>
                      <p className="font-bold">{sampleInvoice.customerName}</p>
                      <p className="text-slate-600">Apex Commercial Park, Kochi</p>
                      {showGSTIN && <p className="font-mono text-[10px]">GSTIN: {sampleInvoice.customerGST}</p>}
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="font-bold text-[9px] uppercase border-b pb-0.5">Invoice Particulars:</p>
                      <p>Invoice No: <span className="font-mono font-bold">#{sampleInvoice.invoiceNumber}</span></p>
                      <p>Date: <span className="font-mono">{sampleInvoice.createdAt}</span></p>
                      <p>Place of Supply: <span className="font-bold">Kerala (32)</span></p>
                    </div>
                  </div>

                  <table className="w-full border border-slate-800 text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-100 font-bold uppercase text-[9px]">
                        <th className="p-2 border-r border-slate-800">S.No</th>
                        <th className="p-2 border-r border-slate-800">Description of Goods</th>
                        {showHSNTable && <th className="p-2 border-r border-slate-800 text-center">HSN</th>}
                        <th className="p-2 border-r border-slate-800 text-center">Qty</th>
                        <th className="p-2 border-r border-slate-800 text-right">Rate (₹)</th>
                        <th className="p-2 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-sans">
                      {sampleInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border-r border-slate-800 text-center">{idx + 1}</td>
                          <td className="p-2 border-r border-slate-800 font-semibold">{item.productName}</td>
                          {showHSNTable && <td className="p-2 border-r border-slate-800 text-center font-mono">2201</td>}
                          <td className="p-2 border-r border-slate-800 text-center font-bold">{item.quantity}</td>
                          <td className="p-2 border-r border-slate-800 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-2 text-right font-mono font-bold">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-end pt-2 text-[11px]">
                    <div className="border border-slate-800 p-2.5 max-w-[50%] space-y-1 font-sans text-[10px]">
                      <p className="font-bold uppercase">Bank Account Details</p>
                      <p>Bank: {bankName} | A/c: {accountNo}</p>
                      <p>IFSC: {ifscCode}</p>
                    </div>
                    <div className="w-48 border border-slate-800 p-2.5 font-mono text-right text-[11px] space-y-1">
                      <div className="flex justify-between"><span>Sub Total:</span><span>{formatCurrency(sampleInvoice.subtotal)}</span></div>
                      <div className="flex justify-between"><span>CGST 9%:</span><span>{formatCurrency(sampleInvoice.cgst)}</span></div>
                      <div className="flex justify-between"><span>SGST 9%:</span><span>{formatCurrency(sampleInvoice.sgst)}</span></div>
                      <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-sm"><span>Grand Total:</span><span>{formatCurrency(sampleInvoice.total)}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 3: LEFT ACCENT STRIP LAYOUT */}
              {currentStyle.layoutType === "sidebar_strip" && (
                <div className="border border-border/80 rounded-2xl bg-white text-slate-900 p-0 overflow-hidden min-h-[650px] font-sans text-xs flex">
                  <div className="w-4 shrink-0" style={{ backgroundColor: selectedColor.hex }} />
                  <div className="p-6 sm:p-8 flex-1 space-y-6">
                    <div className="flex justify-between items-start border-b pb-4">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tight" style={{ color: selectedColor.hex }}>{companyName}</h2>
                        <p className="text-[11px] text-slate-500">{subTitleNote}</p>
                        {showGSTIN && <p className="text-[10px] font-mono text-slate-500">GSTIN: {companyGST}</p>}
                      </div>
                      <div className="text-right space-y-1">
                        <span className="font-mono text-lg font-bold text-slate-900">#{sampleInvoice.invoiceNumber}</span>
                        <p className="text-[10px] text-slate-400">Date: {sampleInvoice.createdAt}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                      <div>
                        <p className="font-bold text-slate-400 text-[9px] uppercase">Supplier Details</p>
                        <p className="font-bold">{companyName}</p>
                        <p className="text-slate-600">{companyAddress}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-400 text-[9px] uppercase">Customer Details</p>
                        <p className="font-bold">{sampleInvoice.customerName}</p>
                        <p className="text-slate-600">Apex Commercial Tower, Sector 4</p>
                      </div>
                    </div>

                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b-2 border-slate-200 text-slate-400 uppercase text-[9px]">
                          <th className="py-2">Item Description</th>
                          <th className="py-2 text-center">Qty</th>
                          <th className="py-2 text-right">Price</th>
                          <th className="py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleInvoice.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 font-bold text-slate-800">{item.productName}</td>
                            <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                            <td className="py-2.5 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-2.5 text-right font-mono font-bold">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-between items-end border-t pt-4">
                      <p className="text-[10px] text-slate-400 max-w-[50%]">{footerNote}</p>
                      <div className="w-44 text-right space-y-1">
                        <p className="text-[10px] text-slate-500">Total Due</p>
                        <p className="text-lg font-black font-mono" style={{ color: selectedColor.hex }}>{formatCurrency(sampleInvoice.total)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 4: COMPACT THERMAL POS RECEIPT (80MM) */}
              {currentStyle.layoutType === "thermal_slip" && (
                <div className="max-w-[340px] mx-auto border-2 border-dashed border-slate-400 bg-amber-50/30 text-slate-900 p-4 space-y-3 font-mono text-[11px] shadow-sm">
                  <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
                    <p className="font-black text-sm uppercase">{companyName}</p>
                    <p className="text-[10px]">{companyAddress}</p>
                    <p className="text-[10px]">Ph: {companyPhone}</p>
                    {showGSTIN && <p className="text-[10px]">GST: {companyGST}</p>}
                    <p className="font-bold text-xs uppercase pt-1">*** {invoiceTitle} ***</p>
                  </div>

                  <div className="space-y-0.5 text-[10px] border-b border-dashed border-slate-400 pb-2">
                    <p>INV #: {sampleInvoice.invoiceNumber}</p>
                    <p>DATE: {sampleInvoice.createdAt}</p>
                    <p>CUST: {sampleInvoice.customerName}</p>
                  </div>

                  <div className="space-y-2 border-b border-dashed border-slate-400 pb-2">
                    {sampleInvoice.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <div>
                          <p className="font-bold">{item.productName}</p>
                          <p className="text-[9px] text-slate-600">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <p className="font-bold">{formatCurrency(item.total)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-right border-b border-dashed border-slate-400 pb-2 text-[10px]">
                    <div className="flex justify-between"><span>SUBTOTAL:</span><span>{formatCurrency(sampleInvoice.subtotal)}</span></div>
                    <div className="flex justify-between"><span>TAX GST:</span><span>{formatCurrency(sampleInvoice.cgst + sampleInvoice.sgst)}</span></div>
                    <div className="flex justify-between font-black text-xs pt-1"><span>TOTAL PAID:</span><span>{formatCurrency(sampleInvoice.total)}</span></div>
                  </div>

                  <div className="text-center space-y-2 pt-1 text-[9px]">
                    <p>{footerNote}</p>
                    <div className="h-8 bg-slate-800 w-3/4 mx-auto flex items-center justify-center text-white text-[8px] tracking-widest font-mono">
                      ||| |||| || ||||| ||| |||
                    </div>
                    <p>AquaFlow POS Billing System</p>
                  </div>
                </div>
              )}

              {/* LAYOUT 5: SPLIT CARD CONTAINERS */}
              {currentStyle.layoutType === "split_cards" && (
                <div className="border border-border/80 rounded-2xl bg-slate-50/50 text-slate-900 p-6 space-y-5 min-h-[650px] font-sans text-xs">
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <h2 className="font-extrabold text-base">{companyName}</h2>
                      <p className="text-[11px] text-slate-500">{subTitleNote}</p>
                    </div>
                    <Badge className="text-white text-xs font-bold" style={{ backgroundColor: selectedColor.hex }}>
                      #{sampleInvoice.invoiceNumber}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <p className="font-bold text-[9px] uppercase text-slate-400">Supplier Card</p>
                      <p className="font-bold">{companyName}</p>
                      <p className="text-slate-600 text-[10px]">{companyAddress}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <p className="font-bold text-[9px] uppercase text-slate-400">Customer Card</p>
                      <p className="font-bold">{sampleInvoice.customerName}</p>
                      <p className="text-slate-600 text-[10px]">Apex Commercial Tower</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b text-slate-400 text-[9px] uppercase">
                          <th className="py-1.5">Product</th>
                          <th className="py-1.5 text-center">Qty</th>
                          <th className="py-1.5 text-right">Price</th>
                          <th className="py-1.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleInvoice.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2 font-semibold">{item.productName}</td>
                            <td className="py-2 text-center font-bold">{item.quantity}</td>
                            <td className="py-2 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                            <td className="py-2 text-right font-mono font-bold">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Grand Total Amount Due</span>
                    <span className="text-xl font-extrabold font-mono" style={{ color: selectedColor.hex }}>{formatCurrency(sampleInvoice.total)}</span>
                  </div>
                </div>
              )}

              {/* LAYOUT 6: CENTERED MINIMALIST */}
              {currentStyle.layoutType === "centered_minimal" && (
                <div className="border border-border/80 rounded-2xl bg-white text-slate-900 p-8 space-y-6 min-h-[650px] font-sans text-xs">
                  <div className="text-center space-y-1 border-b pb-4">
                    <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto text-lg font-bold">💧</div>
                    <h2 className="text-lg font-bold uppercase tracking-widest pt-1">{companyName}</h2>
                    <p className="text-[11px] text-slate-500">{subTitleNote}</p>
                    <p className="text-[10px] text-slate-400">Invoice #{sampleInvoice.invoiceNumber} · Date: {sampleInvoice.createdAt}</p>
                  </div>

                  <div className="flex justify-between text-[11px] border-b pb-4">
                    <div><p className="font-bold">Billed To:</p><p>{sampleInvoice.customerName}</p></div>
                    <div className="text-right"><p className="font-bold">Billed By:</p><p>{companyName}</p></div>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b text-slate-400 text-[9px] uppercase"><th className="py-2">Item</th><th className="py-2 text-center">Qty</th><th className="py-2 text-right">Amount</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sampleInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-medium">{item.productName}</td>
                          <td className="py-2 text-center">{item.quantity}</td>
                          <td className="py-2 text-right font-mono font-bold">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-center border-t pt-4 space-y-1">
                    <p className="text-xs text-slate-400 uppercase">Total Amount</p>
                    <p className="text-2xl font-black font-mono" style={{ color: selectedColor.hex }}>{formatCurrency(sampleInvoice.total)}</p>
                    <p className="text-[10px] text-slate-400 pt-2">{footerNote}</p>
                  </div>
                </div>
              )}

              {/* LAYOUT 7: LUXURY DARK SLATE & GOLD */}
              {currentStyle.layoutType === "dark_luxury" && (
                <div className="border-2 border-amber-500/50 rounded-2xl bg-slate-950 text-slate-100 p-6 sm:p-8 space-y-6 min-h-[650px] font-sans text-xs shadow-2xl">
                  <div className="flex justify-between items-start border-b border-amber-500/30 pb-4">
                    <div>
                      <h2 className="text-lg font-black uppercase text-amber-400 tracking-wider">{companyName}</h2>
                      <p className="text-[11px] text-slate-400">{subTitleNote}</p>
                      {showGSTIN && <p className="text-[10px] font-mono text-amber-400/80">GSTIN: {companyGST}</p>}
                    </div>
                    <Badge variant="outline" className="border-amber-400 text-amber-400 bg-amber-400/10 text-xs font-mono font-bold">
                      #{sampleInvoice.invoiceNumber}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px] border-b border-amber-500/20 pb-4">
                    <div>
                      <p className="font-bold text-amber-400/70 text-[9px] uppercase">Client</p>
                      <p className="font-bold text-white">{sampleInvoice.customerName}</p>
                      <p className="text-slate-400">Apex Commercial Tower</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-400/70 text-[9px] uppercase">Date & Status</p>
                      <p className="font-mono">{sampleInvoice.createdAt}</p>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] mt-1">PAID</Badge>
                    </div>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-amber-500/30 text-amber-400/70 uppercase text-[9px]">
                        <th className="py-2">Description</th><th className="py-2 text-center">Qty</th><th className="py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {sampleInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-bold text-slate-200">{item.productName}</td>
                          <td className="py-2.5 text-center font-bold text-amber-400">{item.quantity}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-white">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-end border-t border-amber-500/30 pt-4">
                    <p className="text-[10px] text-slate-400 max-w-[50%]">{footerNote}</p>
                    <div className="text-right">
                      <p className="text-[10px] text-amber-400/80">TOTAL AMOUNT</p>
                      <p className="text-2xl font-black font-mono text-amber-400">{formatCurrency(sampleInvoice.total)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 8: HIGH-TECH QR HEADER */}
              {currentStyle.layoutType === "tech_qr" && (
                <div className="border border-border/80 rounded-2xl bg-white text-slate-900 p-6 space-y-5 min-h-[650px] font-sans text-xs">
                  <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl">
                    <div className="space-y-1">
                      <Badge className="bg-cyan-500 text-slate-950 font-extrabold text-[10px] uppercase">Tech Scannable Bill</Badge>
                      <h2 className="font-extrabold text-base">{companyName}</h2>
                      <p className="text-[10px] text-slate-400">Invoice #{sampleInvoice.invoiceNumber}</p>
                    </div>
                    {showQRCode && (
                      <div className="bg-white p-2 rounded-lg text-slate-900 flex items-center gap-2">
                        <QrCode className="h-10 w-10 text-slate-900" />
                        <div className="text-[9px] font-mono"><p className="font-bold">Scan to Pay</p><p>{upiId}</p></div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px] border-b pb-3">
                    <div><p className="font-bold text-slate-400 text-[9px] uppercase">Billed To</p><p className="font-bold">{sampleInvoice.customerName}</p></div>
                    <div className="text-right"><p className="font-bold text-slate-400 text-[9px] uppercase">Issue Date</p><p className="font-mono">{sampleInvoice.createdAt}</p></div>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b text-slate-400 text-[9px] uppercase"><th className="py-2">Item</th><th className="py-2 text-center">Qty</th><th className="py-2 text-right">Total</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sampleInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 font-bold">{item.productName}</td>
                          <td className="py-2 text-center font-bold">{item.quantity}</td>
                          <td className="py-2 text-right font-mono font-bold">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center border-t pt-3">
                    <p className="text-[10px] text-slate-400">{footerNote}</p>
                    <p className="text-xl font-black font-mono text-cyan-600">{formatCurrency(sampleInvoice.total)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: COMPANY PROFILE */}
        <TabsContent value="company" className="mt-6 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Company Profile & Legal Details</CardTitle>
              <CardDescription>Official business profile details rendered on invoices and reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN Registration Number</Label>
                  <Input value={companyGST} onChange={(e) => setCompanyGST(e.target.value)} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registered Office Address</Label>
                <Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: GST & TAX SETUP */}
        <TabsContent value="tax" className="mt-6 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">GST & Tax Defaults</CardTitle>
              <CardDescription>Default tax rates and HSN codes for bottled water & beverages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default GST Rate (%)</Label>
                  <Input defaultValue="18" />
                </div>
                <div className="space-y-2">
                  <Label>Default Water HSN Code</Label>
                  <Input defaultValue="2201" />
                </div>
                <div className="space-y-2">
                  <Label>Default Soda/Beverage HSN Code</Label>
                  <Input defaultValue="2202" />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Number Prefix</Label>
                  <Input defaultValue="INV-2026-" className="font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: SYSTEM NOTIFICATIONS */}
        <TabsContent value="notif" className="mt-6 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Notification & System Alerts</CardTitle>
              <CardDescription>Configure browser, WhatsApp, and email alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3.5 border rounded-xl bg-accent/10">
                <div>
                  <p className="font-bold text-sm">Low Stock Inventory Alerts</p>
                  <p className="text-xs text-muted-foreground">Notify when bottled water stock drops below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3.5 border rounded-xl bg-accent/10">
                <div>
                  <p className="font-bold text-sm">WhatsApp Payment Reminders</p>
                  <p className="text-xs text-muted-foreground">Send auto WhatsApp link for overdue payment collections</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CREATE CUSTOM TEMPLATE DIALOG MODAL */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg max-w-[92vw] border-border/50">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-emerald-600" />
              Create Custom Invoice Template
            </DialogTitle>
            <DialogDescription className="text-xs">
              Design a custom invoice template from scratch with your preferred layout structure & brand colors
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs">Template Name</Label>
              <Input
                placeholder="e.g. Kerala Water Express Bill 2026"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description (Optional)</Label>
              <Input
                placeholder="e.g. Custom corporate bill for hotel & B2B clients"
                value={newTemplateDesc}
                onChange={(e) => setNewTemplateDesc(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Base Layout Architecture</Label>
              <Select
                value={newTemplateLayout}
                onValueChange={(val) => val && setNewTemplateLayout(val as InvoiceStyleTemplate["layoutType"])}
              >
                <SelectTrigger className="h-9 w-full text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Modern Banner Header</SelectItem>
                  <SelectItem value="classic_frame">Official Double Border Frame</SelectItem>
                  <SelectItem value="sidebar_strip">Left Vertical Accent Strip</SelectItem>
                  <SelectItem value="split_cards">Split Card Containers</SelectItem>
                  <SelectItem value="thermal_slip">Compact POS Thermal Slip (80mm)</SelectItem>
                  <SelectItem value="centered_minimal">Centered Minimalist</SelectItem>
                  <SelectItem value="dark_luxury">Luxury Dark Slate & Gold</SelectItem>
                  <SelectItem value="tech_qr">High-Tech QR Code Header</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Brand Primary Accent Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newTemplateColorHex}
                  onChange={(e) => setNewTemplateColorHex(e.target.value)}
                  className="h-9 w-12 rounded-lg border cursor-pointer bg-transparent"
                />
                <Input
                  value={newTemplateColorHex}
                  onChange={(e) => setNewTemplateColorHex(e.target.value)}
                  className="h-9 text-xs font-mono w-32"
                />
                <div
                  className="h-9 flex-1 rounded-lg border shadow-xs flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: newTemplateColorHex }}
                >
                  Color Preview
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateCustomTemplate} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Create & Apply Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
