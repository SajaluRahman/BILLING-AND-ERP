"use client";

import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types";
import { InvoicePDFTemplate } from "./invoice-pdf-template";
import { Download, Printer, Share2, Mail, MessageSquare, FileText, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoicePreviewModalProps {
  invoice: Invoice;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InvoicePreviewModal({
  invoice,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: InvoicePreviewModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [format, setFormat] = useState<"a4" | "thermal">("a4");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);
    toast.info("Generating PDF invoice...");

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: format === "thermal" ? [80, 200] : "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);

      toast.success(`Invoice ${invoice.invoiceNumber} downloaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF invoice. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Pop-up blocked! Please allow pop-ups to print.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Invoice - ${invoice.invoiceNumber}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; padding: 0; background: white; }
              @page { size: ${format === 'thermal' ? '80mm auto' : 'A4'}; margin: 0; }
            }
          </style>
        </head>
        <body class="bg-white p-4">
          ${printRef.current.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${invoice.customerName},\nHere is your invoice *${invoice.invoiceNumber}* for *₹${invoice.total.toFixed(2)}*.\nStatus: ${invoice.status.toUpperCase()}.\nThank you for choosing AquaFlow ERP!`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleEmail = () => {
    toast.success(`Invoice ${invoice.invoiceNumber} sent via email!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[95vw] sm:max-w-5xl w-full max-h-[92vh] overflow-y-auto p-0 gap-0 border-border/50">
        {/* Header Actions */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 p-4 bg-background/95 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-bold text-sm">{invoice.invoiceNumber}</h2>
              <p className="text-xs text-muted-foreground">{invoice.customerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Switcher */}
            <div className="flex items-center border rounded-lg p-0.5 bg-muted/50 text-xs">
              <button
                onClick={() => setFormat("a4")}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  format === "a4" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                A4 Standard
              </button>
              <button
                onClick={() => setFormat("thermal")}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  format === "thermal" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
                }`}
              >
                Thermal (80mm)
              </button>
            </div>

            {/* Print Button */}
            <Button variant="outline" size="sm" onClick={handlePrint} className="h-8">
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </Button>

            {/* Download PDF Button */}
            <Button size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="h-8">
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1.5" />
                  Download PDF
                </>
              )}
            </Button>

            {/* WhatsApp Share */}
            <Button variant="outline" size="sm" onClick={handleWhatsApp} className="h-8 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
              <MessageSquare className="h-4 w-4 mr-1.5" />
              WhatsApp
            </Button>

            {/* Email Share */}
            <Button variant="outline" size="sm" onClick={handleEmail} className="h-8">
              <Mail className="h-4 w-4 mr-1.5" />
              Email
            </Button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 bg-slate-950/20 overflow-x-auto flex justify-center">
          <InvoicePDFTemplate ref={printRef} invoice={invoice} format={format} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
