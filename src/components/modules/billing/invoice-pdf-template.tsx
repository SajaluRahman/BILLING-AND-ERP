"use client";

import React from "react";
import { Invoice, Company } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockCompanies } from "@/lib/mock-data";

interface InvoiceTemplateProps {
  invoice: Invoice;
  company?: Company;
  format?: "a4" | "thermal";
}

export const InvoicePDFTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice, company = mockCompanies[0], format = "a4" }, ref) => {
    if (format === "thermal") {
      return (
        <div
          ref={ref}
          className="w-[80mm] p-4 bg-white text-black font-mono text-xs shadow-lg mx-auto border border-gray-200"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          <div className="text-center border-b border-black pb-2 mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider">{company.name}</h2>
            <p className="text-[10px]">{company.address.line1}, {company.address.city}</p>
            <p className="text-[10px]">Ph: {company.phone}</p>
            <p className="text-[10px]">GSTIN: {company.gst}</p>
          </div>

          <div className="text-center my-2 font-bold text-xs uppercase border-b border-black pb-1">
            TAX INVOICE
          </div>

          <div className="text-[10px] space-y-0.5 border-b border-black pb-2 mb-2">
            <div className="flex justify-between"><span>Inv No:</span><span className="font-bold">{invoice.invoiceNumber}</span></div>
            <div className="flex justify-between"><span>Date:</span><span>{formatDate(invoice.createdAt)}</span></div>
            <div className="flex justify-between"><span>Customer:</span><span className="font-bold">{invoice.customerName}</span></div>
            {invoice.customerGST && <div className="flex justify-between"><span>GSTIN:</span><span>{invoice.customerGST}</span></div>}
          </div>

          {/* Items Table */}
          <table className="w-full text-[10px] mb-2 border-b border-black pb-2">
            <thead>
              <tr className="border-b border-dashed border-black text-left">
                <th className="py-1">Item</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Rate</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-1 max-w-[30mm] truncate">{item.productName}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{item.unitPrice}</td>
                  <td className="text-right font-bold">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="text-[10px] space-y-1 border-b border-black pb-2 mb-2">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{invoice.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>CGST:</span><span>₹{invoice.cgst.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>SGST:</span><span>₹{invoice.sgst.toFixed(2)}</span></div>
            {invoice.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount:</span><span>-₹{invoice.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-xs font-bold pt-1 border-t border-black"><span>GRAND TOTAL:</span><span>₹{invoice.total.toFixed(2)}</span></div>
            <div className="flex justify-between text-[10px]"><span>Paid Amount:</span><span>₹{invoice.amountPaid.toFixed(2)}</span></div>
            <div className="flex justify-between text-[10px] font-bold"><span>Balance Due:</span><span>₹{invoice.amountDue.toFixed(2)}</span></div>
          </div>

          <div className="text-center text-[9px] mt-4 space-y-1">
            <p className="font-semibold">Thank you for your business!</p>
            <p className="text-[8px] text-gray-500">AquaFlow ERP Powered</p>
          </div>
        </div>
      );
    }

    // Standard A4 GST Invoice Template
    return (
      <div
        ref={ref}
        className="w-[210mm] max-w-full min-h-[297mm] p-6 sm:p-10 bg-white text-gray-900 shadow-2xl mx-auto text-xs font-sans border border-gray-200"
        style={{ color: "#1a1a1a", backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-blue-600">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                AQ
              </div>
              <h1 className="text-xl font-bold text-blue-950 uppercase tracking-tight">{company.name}</h1>
            </div>
            <p className="text-gray-600">{company.address.line1}, {company.address.city}, {company.address.state} - {company.address.pincode}</p>
            <p className="text-gray-600">Phone: {company.phone} | Email: {company.email}</p>
            <p className="text-gray-800 font-semibold mt-1">GSTIN: <span className="font-mono text-blue-900">{company.gst}</span> | PAN: {company.pan}</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-blue-50 text-blue-900 font-extrabold text-sm px-4 py-1.5 rounded-md border border-blue-200 uppercase tracking-wider mb-2">
              TAX INVOICE
            </div>
            <p className="text-sm font-bold text-gray-900">Invoice #: <span className="font-mono text-blue-600">{invoice.invoiceNumber}</span></p>
            <p className="text-gray-600">Date: {formatDate(invoice.createdAt)}</p>
            <p className="text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Billed To / Shipped To */}
        <div className="grid grid-cols-2 gap-8 my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Billed To</h3>
            <p className="text-sm font-bold text-gray-900">{invoice.customerName}</p>
            {invoice.customerGST && <p className="font-semibold text-blue-900">GSTIN: {invoice.customerGST}</p>}
            <p className="text-gray-600">Business Customer</p>
          </div>
          <div className="text-right">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Payment Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              invoice.status === 'partial' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {invoice.status}
            </span>
            {invoice.paymentMethod && <p className="text-gray-600 mt-1 capitalize">Method: {invoice.paymentMethod.replace('_', ' ')}</p>}
          </div>
        </div>

        {/* Product Items Table */}
        <table className="w-full mb-6 text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-900 text-white text-[11px] uppercase tracking-wider">
              <th className="p-2.5 border border-blue-900 w-12 text-center">#</th>
              <th className="p-2.5 border border-blue-900">Product / Description</th>
              <th className="p-2.5 border border-blue-900 text-center w-20">HSN</th>
              <th className="p-2.5 border border-blue-900 text-right w-16">Qty</th>
              <th className="p-2.5 border border-blue-900 text-right w-24">Rate (₹)</th>
              <th className="p-2.5 border border-blue-900 text-right w-20">GST %</th>
              <th className="p-2.5 border border-blue-900 text-right w-24">Tax (₹)</th>
              <th className="p-2.5 border border-blue-900 text-right w-28">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-2.5 border border-gray-200 text-center font-medium text-gray-500">{idx + 1}</td>
                <td className="p-2.5 border border-gray-200 font-semibold text-gray-900">{item.productName}</td>
                <td className="p-2.5 border border-gray-200 text-center font-mono text-gray-600">{item.hsnCode}</td>
                <td className="p-2.5 border border-gray-200 text-right font-bold text-gray-900">{item.quantity}</td>
                <td className="p-2.5 border border-gray-200 text-right font-mono">{item.unitPrice.toFixed(2)}</td>
                <td className="p-2.5 border border-gray-200 text-right text-gray-600">{item.taxRate}%</td>
                <td className="p-2.5 border border-gray-200 text-right font-mono">{(item.cgst + item.sgst).toFixed(2)}</td>
                <td className="p-2.5 border border-gray-200 text-right font-bold font-mono text-gray-900">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculations Section */}
        <div className="grid grid-cols-2 gap-6 my-6">
          {/* Bank & Payment Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-950">Bank Account Details</h4>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-700">
              <span className="text-gray-500">Bank Name:</span><span className="font-semibold">{company.bankDetails.bankName}</span>
              <span className="text-gray-500">Account No:</span><span className="font-mono font-semibold">{company.bankDetails.accountNumber}</span>
              <span className="text-gray-500">IFSC Code:</span><span className="font-mono font-semibold">{company.bankDetails.ifscCode}</span>
              <span className="text-gray-500">Branch:</span><span>{company.bankDetails.branchName}</span>
            </div>
            {invoice.notes && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Notes:</span>
                <p className="text-[11px] italic text-gray-700">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1.5 text-right font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600 font-sans">Subtotal:</span>
              <span className="font-semibold">₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600 font-sans">CGST:</span>
              <span>₹{invoice.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600 font-sans">SGST:</span>
              <span>₹{invoice.sgst.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700">
                <span className="font-sans">Discount:</span>
                <span>-₹{invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm font-bold text-blue-950 border-y-2 border-blue-900 bg-blue-50/50 px-2 my-2">
              <span className="font-sans">GRAND TOTAL:</span>
              <span>₹{invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600 font-sans">Amount Paid:</span>
              <span className="text-emerald-700 font-semibold">₹{invoice.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm font-bold text-rose-700">
              <span className="font-sans">Balance Due:</span>
              <span>₹{invoice.amountDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer & Authorization */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-end">
          <div className="text-[10px] text-gray-500 space-y-1">
            <p className="font-bold text-gray-700">Terms & Conditions:</p>
            <p>1. Goods once sold will not be taken back or exchanged.</p>
            <p>2. Interest @ 18% p.a. will be charged if payment is delayed beyond due date.</p>
            <p>3. Subject to local jurisdiction.</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-32 border-b border-gray-400 mb-1 mx-auto"></div>
            <p className="font-bold text-xs text-gray-900">For {company.name}</p>
            <p className="text-[10px] text-gray-500">Authorized Signatory</p>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePDFTemplate.displayName = "InvoicePDFTemplate";
