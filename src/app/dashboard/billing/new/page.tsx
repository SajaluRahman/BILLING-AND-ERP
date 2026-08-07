"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Receipt, Search, Plus, Trash2, Printer, Download, Mail,
  MessageSquare, CreditCard, Banknote, QrCode, Building2,
  Check, X, Minus,
} from "lucide-react";
import { mockProducts, mockCustomers } from "@/lib/mock-data";
import { formatCurrency, calculateGST, roundOff } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { InvoicePreviewModal } from "@/components/modules/billing/invoice-preview-modal";
import { toast } from "sonner";

interface LineItem {
  id: string;
  productId: string;
  productName: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  total: number;
}

export default function NewInvoicePage() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [productSearch, setProductSearch] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.barcode.includes(productSearch)
  );

  const addProduct = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return;

    const existing = lineItems.find((item) => item.productId === productId);
    if (existing) {
      setLineItems(
        lineItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
                ...recalcItem(item.quantity + 1, item.unitPrice, item.discount, item.taxRate),
              }
            : item
        )
      );
    } else {
      const gst = calculateGST(product.sellingPrice, product.gstRate);
      setLineItems([
        ...lineItems,
        {
          id: `item-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          hsnCode: product.hsnCode,
          quantity: 1,
          unitPrice: product.sellingPrice,
          discount: 0,
          taxRate: product.gstRate,
          cgst: gst.cgst,
          sgst: gst.sgst,
          total: gst.total,
        },
      ]);
    }
    setProductSearch("");
  };

  const recalcItem = (qty: number, price: number, disc: number, taxRate: number) => {
    const subtotal = qty * price - disc;
    const gst = calculateGST(subtotal, taxRate);
    return { cgst: gst.cgst, sgst: gst.sgst, total: gst.total };
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setLineItems(
      lineItems.map((item) =>
        item.id === id
          ? { ...item, quantity: qty, ...recalcItem(qty, item.unitPrice, item.discount, item.taxRate) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalTax = lineItems.reduce((sum, item) => sum + item.cgst + item.sgst, 0);
  const totalDiscount = lineItems.reduce((sum, item) => sum + item.discount, 0) + discount;
  const grandTotal = roundOff(subtotal + totalTax - totalDiscount);
  const roundOffAmount = grandTotal - (subtotal + totalTax - totalDiscount);

  const customer = mockCustomers.find((c) => c.id === selectedCustomer);

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Invoice"
        description="Create a new billing invoice"
        icon={Receipt}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Draft invoice saved to billing ledger!")}>
              Save Draft
            </Button>
            <InvoicePreviewModal
              invoice={{
                id: `inv-${Date.now()}`,
                invoiceNumber: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
                type: "gst",
                customerId: customer?.id || "cust-1",
                customerName: customer?.businessName || "Walk-in Customer",
                customerGST: customer?.gst,
                items: lineItems.length > 0 ? lineItems : [
                  { id: "demo-1", productId: "p1", productName: "Bisleri 20L Jar", hsnCode: "2201", quantity: 5, unitPrice: 80, discount: 0, taxRate: 18, cgst: 36, sgst: 36, total: 472 }
                ],
                subtotal: lineItems.length > 0 ? subtotal : 400,
                cgst: lineItems.length > 0 ? totalTax / 2 : 36,
                sgst: lineItems.length > 0 ? totalTax / 2 : 36,
                igst: 0,
                discount: totalDiscount,
                roundOff: roundOffAmount,
                total: lineItems.length > 0 ? grandTotal : 472,
                amountPaid: lineItems.length > 0 ? grandTotal : 472,
                amountDue: 0,
                status: "paid",
                paymentMethod: paymentMethod as any,
                payments: [],
                dueDate: new Date().toISOString(),
                notes,
                createdBy: "user-1",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }}
              trigger={
                <Button size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              }
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-8 space-y-6">
          {/* Customer Selection */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer</Label>
                    <Select value={selectedCustomer} onValueChange={(val) => val && setSelectedCustomer(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCustomers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.businessName} ({c.ownerName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {customer && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Outstanding</Label>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {formatCurrency(customer.outstandingBalance)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Search & Add */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Add Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, SKU, or barcode..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {productSearch && (
                  <div className="mt-2 border rounded-lg max-h-48 overflow-auto">
                    {filteredProducts.slice(0, 8).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProduct(product.id)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent text-left transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.brandName} · {product.sku} · Stock: {product.currentStock}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatCurrency(product.sellingPrice)}</p>
                          <p className="text-xs text-muted-foreground">GST {product.gstRate}%</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Line Items */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Invoice Items ({lineItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {lineItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No items added yet</p>
                    <p className="text-xs">Search and add products above</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <div className="col-span-4">Product</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-2 text-right">Price</div>
                      <div className="col-span-1 text-right">Tax</div>
                      <div className="col-span-2 text-right">Total</div>
                      <div className="col-span-1"></div>
                    </div>
                    {lineItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center px-3 py-2 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                        <div className="col-span-4">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">HSN: {item.hsnCode}</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-center gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="h-7 w-14 text-center text-sm"
                          />
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="col-span-2 text-right text-sm">{formatCurrency(item.unitPrice)}</div>
                        <div className="col-span-1 text-right text-xs text-muted-foreground">{item.taxRate}%</div>
                        <div className="col-span-2 text-right text-sm font-semibold">{formatCurrency(item.total)}</div>
                        <div className="col-span-1 text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar - Totals & Payment */}
        <div className="xl:col-span-4 space-y-6">
          {/* Invoice Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/50 sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CGST</span>
                    <span>{formatCurrency(totalTax / 2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SGST</span>
                    <span>{formatCurrency(totalTax / 2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(totalDiscount)}</span>
                    </div>
                  )}
                  {roundOffAmount !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Round Off</span>
                      <span>{roundOffAmount > 0 ? "+" : ""}{roundOffAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span className="text-primary">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <Separator />

                {/* Extra Discount */}
                <div className="space-y-2">
                  <Label className="text-xs">Additional Discount</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="h-9"
                    placeholder="0"
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label className="text-xs">Payment Method</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "cash", label: "Cash", icon: Banknote },
                      { value: "upi", label: "UPI", icon: QrCode },
                      { value: "bank_transfer", label: "Bank", icon: Building2 },
                      { value: "card", label: "Card", icon: CreditCard },
                      { value: "cheque", label: "Cheque", icon: Receipt },
                      { value: "credit", label: "Credit", icon: Receipt },
                    ].map((method) => (
                      <Button
                        key={method.value}
                        variant={paymentMethod === method.value ? "default" : "outline"}
                        size="sm"
                        className={cn("h-auto py-2 flex-col gap-1", paymentMethod === method.value && "shadow-md")}
                        onClick={() => setPaymentMethod(method.value)}
                      >
                        <method.icon className="h-4 w-4" />
                        <span className="text-[10px]">{method.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-xs">Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add invoice notes..."
                    className="h-20 resize-none"
                  />
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <InvoicePreviewModal
                    invoice={{
                      id: `inv-${Date.now()}`,
                      invoiceNumber: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
                      type: "gst",
                      customerId: customer?.id || "cust-1",
                      customerName: customer?.businessName || "Walk-in Customer",
                      customerGST: customer?.gst,
                      items: lineItems,
                      subtotal,
                      cgst: totalTax / 2,
                      sgst: totalTax / 2,
                      igst: 0,
                      discount: totalDiscount,
                      roundOff: roundOffAmount,
                      total: grandTotal,
                      amountPaid: paymentMethod === "credit" ? 0 : grandTotal,
                      amountDue: paymentMethod === "credit" ? grandTotal : 0,
                      status: paymentMethod === "credit" ? "sent" : "paid",
                      paymentMethod: paymentMethod as any,
                      payments: [],
                      dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
                      notes,
                      createdBy: "user-1",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }}
                    trigger={
                      <Button className="w-full" size="lg" disabled={lineItems.length === 0}>
                        <Check className="h-4 w-4 mr-2" />
                        Create Invoice — {formatCurrency(grandTotal)}
                      </Button>
                    }
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <InvoicePreviewModal
                      invoice={{
                        id: `inv-${Date.now()}`,
                        invoiceNumber: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
                        type: "gst",
                        customerId: customer?.id || "cust-1",
                        customerName: customer?.businessName || "Walk-in Customer",
                        customerGST: customer?.gst,
                        items: lineItems.length > 0 ? lineItems : [
                          { id: "demo-1", productId: "p1", productName: "Bisleri 20L Jar", hsnCode: "2201", quantity: 5, unitPrice: 80, discount: 0, taxRate: 18, cgst: 36, sgst: 36, total: 472 }
                        ],
                        subtotal: lineItems.length > 0 ? subtotal : 400,
                        cgst: lineItems.length > 0 ? totalTax / 2 : 36,
                        sgst: lineItems.length > 0 ? totalTax / 2 : 36,
                        igst: 0,
                        discount: totalDiscount,
                        roundOff: roundOffAmount,
                        total: lineItems.length > 0 ? grandTotal : 472,
                        amountPaid: lineItems.length > 0 ? grandTotal : 472,
                        amountDue: 0,
                        status: "paid",
                        paymentMethod: paymentMethod as any,
                        payments: [],
                        dueDate: new Date().toISOString(),
                        notes,
                        createdBy: "user-1",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }}
                      trigger={
                        <Button variant="outline" size="sm" className="w-full">
                          <Printer className="h-3.5 w-3.5 mr-1" />
                          Print
                        </Button>
                      }
                    />
                    <InvoicePreviewModal
                      invoice={{
                        id: `inv-${Date.now()}`,
                        invoiceNumber: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
                        type: "gst",
                        customerId: customer?.id || "cust-1",
                        customerName: customer?.businessName || "Walk-in Customer",
                        customerGST: customer?.gst,
                        items: lineItems.length > 0 ? lineItems : [
                          { id: "demo-1", productId: "p1", productName: "Bisleri 20L Jar", hsnCode: "2201", quantity: 5, unitPrice: 80, discount: 0, taxRate: 18, cgst: 36, sgst: 36, total: 472 }
                        ],
                        subtotal: lineItems.length > 0 ? subtotal : 400,
                        cgst: lineItems.length > 0 ? totalTax / 2 : 36,
                        sgst: lineItems.length > 0 ? totalTax / 2 : 36,
                        igst: 0,
                        discount: totalDiscount,
                        roundOff: roundOffAmount,
                        total: lineItems.length > 0 ? grandTotal : 472,
                        amountPaid: lineItems.length > 0 ? grandTotal : 472,
                        amountDue: 0,
                        status: "paid",
                        paymentMethod: paymentMethod as any,
                        payments: [],
                        dueDate: new Date().toISOString(),
                        notes,
                        createdBy: "user-1",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }}
                      trigger={
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download PDF
                        </Button>
                      }
                    />
                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(`https://wa.me/?text=Invoice%20${encodeURIComponent('INV-2024-001')}`, '_blank')}>
                      <MessageSquare className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
