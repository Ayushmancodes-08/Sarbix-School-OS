"use client"

import * as React from "react"
import { Printer, Download, CheckCircle2, ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QRCodeSvg } from "./qr-code"
import { formatCurrency } from "@/lib/utils"

export interface InvoiceDocData {
  id: string
  invoiceNumber: string
  studentId: string
  studentName?: string
  classGrade?: string
  feeHead?: string
  amount?: number
  totalAmount?: number
  paidAmount: number
  balanceAmount: number
  dueDate: string
  status: string
  paidAt?: string
  parentName?: string
  admissionNumber?: string
}

interface InvoiceReceiptModalProps {
  invoice: InvoiceDocData | null
  onClose: () => void
}

export function InvoiceReceiptModal({ invoice, onClose }: InvoiceReceiptModalProps) {
  if (!invoice) return null

  const handlePrint = () => {
    window.print()
  }

  const isPaid = invoice.status.toLowerCase() === "paid"
  const qrVerificationValue = `https://sarbix.edu/verify/invoice/${invoice.invoiceNumber}?amt=${invoice.amount || invoice.totalAmount}&status=${invoice.status}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden my-auto">
        {/* Modal Toolbar (hidden during print) */}
        <div className="flex items-center justify-between border-b bg-muted/40 px-6 py-3 print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-foreground">
              Official Institutional Document
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 bg-background text-foreground space-y-6 print:p-0">
          {/* Institution Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                  SARBIX ACADEMY
                </span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-indigo-500">
                  CBSE DCA-2026
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Delhi Central Campus · Block B, Vasant Vihar, New Delhi 110057
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                GSTIN / Tax ID: 07AAAAA0000A1Z5 · Tel: +91 11 4982 9000
              </p>
            </div>

            <div className="text-left sm:text-right">
              <Badge
                variant={isPaid ? "success" : "warning"}
                className="text-xs font-mono uppercase font-bold tracking-wider px-3 py-1"
              >
                {isPaid ? "OFFICIAL RECEIPT · PAID" : "INVOICE STATEMENT"}
              </Badge>
              <p className="font-mono text-xs font-bold text-foreground mt-2">
                {invoice.invoiceNumber}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground">
                Date: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Student & Guardian Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-muted/20 p-4 border text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Billed To Student
              </span>
              <p className="font-semibold text-sm text-foreground mt-0.5">
                {invoice.studentName}
              </p>
              <p className="text-muted-foreground mt-0.5">
                Class & Section: <strong className="text-foreground">{invoice.classGrade}</strong>
              </p>
              <p className="font-mono text-muted-foreground mt-0.5">
                Student ID: {invoice.studentId}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Payment Terms & Due Date
              </span>
              <p className="font-semibold text-foreground mt-0.5">
                Institutional Academic Dues
              </p>
              <p className="text-muted-foreground mt-0.5">
                Due Date: <strong className="font-mono text-rose-500">{invoice.dueDate}</strong>
              </p>
              <p className="text-muted-foreground mt-0.5">
                Status: <strong className="uppercase font-mono">{invoice.status}</strong>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 font-mono uppercase text-[10px] text-muted-foreground border-b">
                <tr>
                  <th className="p-3 pl-4">Description / Fee Head</th>
                  <th className="p-3 text-right">Academic Term</th>
                  <th className="p-3 pr-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 pl-4">
                    <p className="font-semibold text-foreground">{invoice.feeHead}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Tuition, STEM curriculum, laboratory access, and digital portal
                    </p>
                  </td>
                  <td className="p-3 text-right font-mono text-muted-foreground">Term 2026-27</td>
                  <td className="p-3 pr-4 text-right font-mono font-bold text-foreground">
                    {formatCurrency(invoice.amount ?? invoice.totalAmount ?? 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-2">
            {/* Dynamic Security QR Code */}
            <div className="flex items-center space-x-3.5 bg-muted/20 p-3 rounded-lg border">
              <QRCodeSvg value={qrVerificationValue} size={84} />
              <div className="text-left">
                <span className="text-[10px] font-mono font-bold uppercase text-foreground block">
                  Cryptographic Verification
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[160px]">
                  Scan to verify institutional ledger hash & authenticity.
                </p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Total Amount Invoiced:</span>
                <span className="font-mono font-semibold text-foreground">
                  {formatCurrency(invoice.amount ?? invoice.totalAmount ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Amount Paid / Settled:</span>
                <span className="font-mono font-bold">
                  {formatCurrency(invoice.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2 text-foreground">
                <span>Balance Remaining:</span>
                <span className="font-mono text-rose-500">
                  {formatCurrency(invoice.balanceAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note & Signature */}
          <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-muted-foreground gap-3">
            <p>This is a computer-generated institutional receipt valid without physical signature.</p>
            <p className="font-mono font-semibold text-foreground">Accounts Comptroller · Sarbix DCA</p>
          </div>
        </div>
      </div>
    </div>
  )
}
