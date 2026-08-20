"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  QrCode,
  Library,
  Upload,
  Download,
  ScanLine,
  Plus,
  Check,
  Package,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { CameraScanner } from "@/components/shared/camera-scanner";
import { Product } from "@/types";

interface BulkImportModalProps {
  onImportProducts: (newProducts: Partial<Product>[]) => void;
  trigger?: React.ReactNode;
}

const PRESET_LIBRARY_ITEMS = [
  { id: "lib-1", name: "Bisleri 20L Water Jar", brandName: "Bisleri", sku: "BSL-20L", bottleSize: "20 Litre", purchasePrice: 50, sellingPrice: 80, gstRate: 18, hsnCode: "2201", category: "Water Jar" },
  { id: "lib-2", name: "Kinley 1L Water Bottle (Case of 12)", brandName: "Kinley", sku: "KNL-1L-12", bottleSize: "1 Litre x 12", purchasePrice: 140, sellingPrice: 210, gstRate: 18, hsnCode: "2201", category: "Bottled Water" },
  { id: "lib-3", name: "Aquafina 500ml Pack (Case of 24)", brandName: "Aquafina", sku: "AQF-500-24", bottleSize: "500ml x 24", purchasePrice: 180, sellingPrice: 260, gstRate: 18, hsnCode: "2201", category: "Bottled Water" },
  { id: "lib-4", name: "Himalayan Natural Mineral Water 1L", brandName: "Himalayan", sku: "HIM-1L", bottleSize: "1 Litre", purchasePrice: 45, sellingPrice: 70, gstRate: 18, hsnCode: "2201", category: "Premium Water" },
  { id: "lib-5", name: "AquaFlow Club Soda 600ml (Case of 15)", brandName: "AquaFlow", sku: "AF-SODA-600", bottleSize: "600ml x 15", purchasePrice: 160, sellingPrice: 240, gstRate: 18, hsnCode: "2202", category: "Soda" },
  { id: "lib-6", name: "Sparkling Water Lemon 330ml Can", brandName: "AquaFlow", sku: "AF-SPK-330", bottleSize: "330ml", purchasePrice: 35, sellingPrice: 60, gstRate: 18, hsnCode: "2202", category: "Beverage" },
];

export function BulkImportModal({ onImportProducts, trigger }: BulkImportModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("excel");

  // Excel / CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scanner state
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scannedItems, setScannedItems] = useState<any[]>([]);

  // Library state
  const [selectedLibIds, setSelectedLibIds] = useState<string[]>(["lib-1", "lib-2"]);

  // Download Sample CSV
  const handleDownloadSampleCSV = () => {
    const csvContent =
      "Product Name,SKU,Brand,Bottle Size,Purchase Price,Selling Price,GST Rate,HSN Code,Initial Stock\n" +
      "Bisleri 2L Pack,BSL-2L,Bisleri,2 Litre,60,90,18,2201,200\n" +
      "Kinley 500ml Pack,KNL-500,Kinley,500ml,100,150,18,2201,150\n" +
      "Sprite 750ml Bottle,SPR-750,Coca-Cola,750ml,30,45,28,2202,100";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "aquaflow_product_import_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample CSV template downloaded!");
  };

  // Handle CSV file upload & parse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
      if (lines.length <= 1) {
        toast.error("CSV file is empty or missing data rows.");
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const rows = lines.slice(1).map((line, idx) => {
        const values = line.split(",").map((v) => v.trim());
        return {
          id: `csv-${idx}-${Date.now()}`,
          name: values[0] || `Imported Item ${idx + 1}`,
          sku: values[1] || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          brandName: values[2] || "Generic",
          bottleSize: values[3] || "1 Litre",
          purchasePrice: parseFloat(values[4]) || 50,
          sellingPrice: parseFloat(values[5]) || 80,
          gstRate: parseFloat(values[6]) || 18,
          hsnCode: values[7] || "2201",
          currentStock: parseInt(values[8]) || 100,
        };
      });

      setParsedRows(rows);
      toast.success(`Successfully parsed ${rows.length} products from CSV!`);
    };
    reader.readAsText(file);
  };

  // Submit CSV products
  const handleImportCSV = () => {
    if (parsedRows.length === 0) {
      toast.error("No products parsed from CSV.");
      return;
    }
    onImportProducts(parsedRows);
    toast.success(`Imported ${parsedRows.length} products to inventory!`);
    setOpen(false);
    setParsedRows([]);
    setCsvFile(null);
  };

  // Scan & add barcode simulation
  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const barcode = barcodeInput.trim();
    const newItem = {
      id: `scan-${Date.now()}`,
      name: `Scanned Item (${barcode.slice(-4)})`,
      sku: `BAR-${barcode}`,
      brandName: "Scanned Brand",
      bottleSize: "1 Litre",
      purchasePrice: 45,
      sellingPrice: 75,
      gstRate: 18,
      hsnCode: "2201",
      currentStock: 100,
    };

    setScannedItems((prev) => [newItem, ...prev]);
    setBarcodeInput("");
    toast.success(`Scanned & added barcode: ${barcode}`);
  };

  const handleImportScanned = () => {
    if (scannedItems.length === 0) {
      toast.error("No scanned items to import.");
      return;
    }
    onImportProducts(scannedItems);
    toast.success(`Added ${scannedItems.length} scanned items to catalog!`);
    setOpen(false);
    setScannedItems([]);
  };

  // Library Import
  const toggleLibrarySelection = (id: string) => {
    setSelectedLibIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleImportLibrary = () => {
    const itemsToImport = PRESET_LIBRARY_ITEMS.filter((item) =>
      selectedLibIds.includes(item.id)
    ).map((item) => ({
      name: item.name,
      sku: item.sku,
      brandName: item.brandName,
      bottleSize: item.bottleSize,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      gstRate: item.gstRate,
      hsnCode: item.hsnCode,
      currentStock: 200,
      minimumStock: 30,
    }));

    if (itemsToImport.length === 0) {
      toast.error("Please select at least one item from library.");
      return;
    }

    onImportProducts(itemsToImport);
    toast.success(`Imported ${itemsToImport.length} library products into inventory!`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Add & Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto border-border/50 p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Bulk Add & Import Products</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Import SKUs from Excel/CSV, scan barcode tags, or select from pre-built item library
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-3 bg-muted/20 border-b border-border/50">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="excel" className="text-xs flex items-center gap-1.5">
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                Excel / CSV
              </TabsTrigger>
              <TabsTrigger value="scan" className="text-xs flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-blue-500" />
                Scan & Add
              </TabsTrigger>
              <TabsTrigger value="library" className="text-xs flex items-center gap-1.5">
                <Library className="h-3.5 w-3.5 text-violet-500" />
                Item Library
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Excel / CSV */}
          <TabsContent value="excel" className="p-6 space-y-4 m-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div>
                <h4 className="text-sm font-semibold text-emerald-950 dark:text-emerald-300">Download Excel / CSV Template</h4>
                <p className="text-xs text-muted-foreground">Pre-formatted template with headers: Product Name, SKU, Brand, Price, GST %</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadSampleCSV} className="shrink-0 h-8 border-emerald-500/30 text-emerald-600">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download CSV Template
              </Button>
            </div>

            {/* Drop / Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center cursor-pointer bg-accent/10 hover:bg-accent/20 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="h-10 w-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" />
              <p className="text-sm font-bold text-foreground">
                {csvFile ? csvFile.name : "Click or drag & drop CSV/Excel file here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Supports .CSV, .XLSX files up to 5MB</p>
            </div>

            {/* Parsed Rows Preview */}
            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Parsed Preview ({parsedRows.length} Products Found)</span>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10">Ready to import</Badge>
                </div>
                <div className="max-h-48 overflow-y-auto border border-border/50 rounded-lg text-xs divide-y divide-border/40">
                  {parsedRows.slice(0, 5).map((row) => (
                    <div key={row.id} className="p-2.5 flex justify-between items-center bg-card">
                      <div>
                        <p className="font-semibold">{row.name}</p>
                        <p className="text-[10px] text-muted-foreground">SKU: {row.sku} · GST: {row.gstRate}%</p>
                      </div>
                      <span className="font-mono font-bold">₹{row.sellingPrice}</span>
                    </div>
                  ))}
                  {parsedRows.length > 5 && (
                    <div className="p-2 text-center text-[11px] text-muted-foreground bg-muted/20">
                      + {parsedRows.length - 5} more products ready...
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="pt-2 border-t border-border/50">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" disabled={parsedRows.length === 0} onClick={handleImportCSV}>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Import {parsedRows.length} Products
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* TAB 2: Scan & Add */}
          <TabsContent value="scan" className="p-6 space-y-4 m-0">
            {/* Live Camera Scanner View */}
            <CameraScanner
              onScan={(scannedBarcode) => {
                const newItem = {
                  id: `scan-${Date.now()}`,
                  name: `Scanned Product (${scannedBarcode.slice(-4)})`,
                  sku: `BAR-${scannedBarcode}`,
                  barcode: scannedBarcode,
                  brandName: "Scanned Brand",
                  bottleSize: "1 Litre",
                  purchasePrice: 45,
                  sellingPrice: 75,
                  gstRate: 18,
                  hsnCode: "2201",
                  currentStock: 100,
                };
                setScannedItems((prev) => [newItem, ...prev]);
              }}
            />

            <form onSubmit={handleScanBarcode} className="space-y-3 pt-2 border-t border-border/40">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Manual Barcode / USB Scanner Entry</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <Input
                      placeholder="Scan or type barcode string (e.g. 8901234567890)..."
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      className="pl-9 h-10 text-xs font-mono"
                    />
                  </div>
                  <Button type="submit" className="h-10">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Code
                  </Button>
                </div>
              </div>
            </form>

            {/* List of scanned items */}
            {scannedItems.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Scanned Items ({scannedItems.length})</span>
                </div>
                <div className="max-h-40 overflow-y-auto border border-border/50 rounded-lg text-xs divide-y divide-border/40">
                  {scannedItems.map((item) => (
                    <div key={item.id} className="p-2.5 flex justify-between items-center bg-card">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{item.sku}</p>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">₹{item.sellingPrice}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <DialogFooter className="pt-2 border-t border-border/50">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" disabled={scannedItems.length === 0} onClick={handleImportScanned}>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Save {scannedItems.length} Scanned SKUs
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* TAB 3: Items Library */}
          <TabsContent value="library" className="p-6 space-y-4 m-0">
            <div className="flex justify-between items-center text-xs">
              <p className="text-muted-foreground">Select pre-configured water & beverage SKUs to auto-load</p>
              <Badge variant="outline">{selectedLibIds.length} Selected</Badge>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {PRESET_LIBRARY_ITEMS.map((item) => {
                const isSelected = selectedLibIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleLibrarySelection(item.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected ? "bg-primary/5 border-primary shadow-xs" : "border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleLibrarySelection(item.id)} />
                      <div>
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.brandName} · {item.bottleSize} · HSN: {item.hsnCode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold">₹{item.sellingPrice}</p>
                      <p className="text-[10px] text-muted-foreground">GST {item.gstRate}%</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <DialogFooter className="pt-2 border-t border-border/50">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" disabled={selectedLibIds.length === 0} onClick={handleImportLibrary}>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Import Selected ({selectedLibIds.length})
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
