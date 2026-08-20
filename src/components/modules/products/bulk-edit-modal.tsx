"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Edit3, Check, Percent, Tag, DollarSign, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BulkEditModalProps {
  selectedCount: number;
  onBulkUpdate: (updates: {
    gstRate?: number;
    hsnCode?: string;
    sellingPriceMarkupPct?: number;
    purchaseCostMarkupPct?: number;
    minimumStock?: number;
  }) => void;
  onClearSelection: () => void;
}

export function BulkEditModal({ selectedCount, onBulkUpdate, onClearSelection }: BulkEditModalProps) {
  const [open, setOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<"gst" | "price" | "hsn">("gst");

  // Form states
  const [gstRate, setGstRate] = useState("18");
  const [hsnCode, setHsnCode] = useState("2201");
  const [priceMarkup, setPriceMarkup] = useState("0");
  const [minStock, setMinStock] = useState("50");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fieldToEdit === "gst") {
      onBulkUpdate({ gstRate: parseFloat(gstRate) });
      toast.success(`Updated GST Tax Rate to ${gstRate}% for ${selectedCount} products!`);
    } else if (fieldToEdit === "hsn") {
      onBulkUpdate({ hsnCode });
      toast.success(`Updated HSN Code to ${hsnCode} for ${selectedCount} products!`);
    } else if (fieldToEdit === "price") {
      onBulkUpdate({ sellingPriceMarkupPct: parseFloat(priceMarkup) });
      toast.success(`Applied ${priceMarkup}% price adjustment for ${selectedCount} products!`);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary" size="sm" className="h-8 shadow-xs">
          <Edit3 className="h-3.5 w-3.5 mr-1.5" />
          Bulk Edit ({selectedCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-w-[95vw] border-border/50">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-primary" />
            Bulk Edit {selectedCount} Selected Products
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Apply batch updates to tax rates, pricing, HSN codes, or stock parameters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Field to Update</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={fieldToEdit === "gst" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setFieldToEdit("gst")}
              >
                <Percent className="h-3.5 w-3.5 mr-1" />
                GST Rate
              </Button>
              <Button
                type="button"
                variant={fieldToEdit === "price" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setFieldToEdit("price")}
              >
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Price Adjust
              </Button>
              <Button
                type="button"
                variant={fieldToEdit === "hsn" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setFieldToEdit("hsn")}
              >
                <Tag className="h-3.5 w-3.5 mr-1" />
                HSN Code
              </Button>
            </div>
          </div>

          {/* Conditional Field Settings */}
          {fieldToEdit === "gst" && (
            <div className="space-y-1.5 p-3 rounded-lg bg-accent/30 border border-border/50">
              <Label className="text-xs font-semibold">New GST Tax Rate (%)</Label>
              <Select value={gstRate} onValueChange={(val) => val && setGstRate(val)}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18% (Standard Beverage & Bottled Water)</SelectItem>
                  <SelectItem value="12">12% (Fruit Juices & Nectars)</SelectItem>
                  <SelectItem value="5">5% (Essential Commodities)</SelectItem>
                  <SelectItem value="0">0% (Tax Exempt)</SelectItem>
                  <SelectItem value="28">28% (Aerated Drinks)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {fieldToEdit === "price" && (
            <div className="space-y-1.5 p-3 rounded-lg bg-accent/30 border border-border/50">
              <Label className="text-xs font-semibold">Price Adjustment (% Markup or Discount)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="e.g. +10 or -5"
                  value={priceMarkup}
                  onChange={(e) => setPriceMarkup(e.target.value)}
                  className="h-9 text-xs"
                />
                <span className="text-xs font-medium">%</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Example: Typing "+10" increases selling price of all {selectedCount} selected items by 10%.
              </p>
            </div>
          )}

          {fieldToEdit === "hsn" && (
            <div className="space-y-1.5 p-3 rounded-lg bg-accent/30 border border-border/50">
              <Label className="text-xs font-semibold">New HSN Code</Label>
              <Input
                placeholder="e.g. 2201"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="h-9 text-xs font-mono"
              />
              <p className="text-[10px] text-muted-foreground">2201 for Mineral Water / 2202 for Flavored Beverages.</p>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-border/50">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Apply to {selectedCount} Items
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
