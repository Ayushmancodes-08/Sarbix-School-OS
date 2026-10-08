"use client"

import * as React from "react"
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  PlusCircle,
  Printer,
  QrCode,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { InvoiceReceiptModal, type InvoiceDocData } from "@/components/finance/invoice-receipt-modal"
import { QRPaymentModal } from "@/components/finance/qr-payment-modal"
import { CreateInvoiceModal } from "@/components/finance/create-invoice-modal"
import { formatCurrency, cn } from "@/lib/utils"

interface InvoiceItem {
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
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "inv-2026-101",
    invoiceNumber: "INV-2026-00891",
    studentId: "std-001",
    studentName: "Aarav Patel",
    classGrade: "Grade 10-A",
    feeHead: "Term II Tuition & STEM Lab",
    amount: 35000,
    paidAmount: 16500,
    balanceAmount: 18500,
    dueDate: "2026-10-25",
    status: "partial",
  },
  {
    id: "inv-2026-102",
    invoiceNumber: "INV-2026-00892",
    studentId: "std-002",
    studentName: "Ananya Iyer",
    classGrade: "Grade 10-A",
    feeHead: "Annual Composite Fee",
    amount: 38000,
    paidAmount: 38000,
    balanceAmount: 0,
    dueDate: "2026-09-30",
    status: "paid",
    paidAt: "2026-09-28",
  },
  {
    id: "inv-2026-103",
    invoiceNumber: "INV-2026-00893",
    studentId: "std-003",
    studentName: "Kabir Mehta",
    classGrade: "Grade 10-A",
    feeHead: "Transport & Tuition Fee",
    amount: 42000,
    paidAmount: 10000,
    balanceAmount: 32000,
    dueDate: "2026-10-15",
    status: "partial",
  },
  {
    id: "inv-2026-104",
    invoiceNumber: "INV-2026-00894",
    studentId: "std-004",
    studentName: "Zoya Khan",
    classGrade: "Grade 10-B",
    feeHead: "Term II Comprehensive Fee",
    amount: 35000,
    paidAmount: 35000,
    balanceAmount: 0,
    dueDate: "2026-10-12",
    status: "paid",
    paidAt: "2026-10-01",
  },
  {
    id: "inv-2026-105",
    invoiceNumber: "INV-2026-00895",
    studentId: "std-005",
    studentName: "Rohan Deshmukh",
    classGrade: "Grade 9-A",
    feeHead: "Term II Tuition Fee",
    amount: 32000,
    paidAmount: 20000,
    balanceAmount: 12000,
    dueDate: "2026-10-20",
    status: "partial",
  },
]

const STUDENT_OPTIONS = [
  { id: "std-001", name: "Aarav Patel", classGrade: "Grade 10-A", rollNumber: "10A-14" },
  { id: "std-002", name: "Ananya Iyer", classGrade: "Grade 10-A", rollNumber: "10A-15" },
  { id: "std-003", name: "Kabir Mehta", classGrade: "Grade 10-A", rollNumber: "10A-16" },
  { id: "std-004", name: "Zoya Khan", classGrade: "Grade 10-B", rollNumber: "10B-08" },
  { id: "std-005", name: "Rohan Deshmukh", classGrade: "Grade 9-A", rollNumber: "9A-02" },
  { id: "std-006", name: "Diya Kapoor", classGrade: "Grade 11-Sci", rollNumber: "11Sci-05" },
]

export default function FinancePage() {
  const [invoices, setInvoices] = React.useState<InvoiceItem[]>(INITIAL_INVOICES)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceItem | null>(null)
  const [payAmount, setPayAmount] = React.useState<number>(0)
  const [paymentMethod, setPaymentMethod] = React.useState<"UPI" | "NET_BANKING" | "CARD" | "CASH">("UPI")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [receiptNotice, setReceiptNotice] = React.useState<{ number: string; amount: number } | null>(null)

  // Extra modals
  const [viewInvoiceModal, setViewInvoiceModal] = React.useState<InvoiceDocData | null>(null)
  const [qrPayInvoice, setQrPayInvoice] = React.useState<InvoiceItem | null>(null)
  const [createInvoiceOpen, setCreateInvoiceOpen] = React.useState(false)

  // Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.amount ?? inv.totalAmount ?? 0), 0)
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0)
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0)
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : "0"

  const openPaymentModal = (inv: InvoiceItem) => {
    setSelectedInvoice(inv)
    setPayAmount(inv.balanceAmount)
  }

  const handleCollectPayment = async () => {
    if (!selectedInvoice) return
    setIsProcessing(true)

    try {
      const res = await fetch("/api/finance/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          amount: Number(payAmount),
          paymentMethod,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === selectedInvoice.id
              ? {
                  ...inv,
                  paidAmount: inv.paidAmount + Number(payAmount),
                  balanceAmount: Math.max(0, inv.balanceAmount - Number(payAmount)),
                  status: inv.balanceAmount - Number(payAmount) <= 0 ? "paid" : "partial",
                }
              : inv
          )
        )
        setReceiptNotice({
          number: data.data.receiptNumber,
          amount: Number(payAmount),
        })
        setSelectedInvoice(null)
      }
    } catch {
      // fallback
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQRSuccess = (receiptNumber: string, paidAmt: number) => {
    if (!qrPayInvoice) return
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === qrPayInvoice.id
          ? {
              ...inv,
              paidAmount: inv.paidAmount + paidAmt,
              balanceAmount: Math.max(0, inv.balanceAmount - paidAmt),
              status: inv.balanceAmount - paidAmt <= 0 ? "paid" : "partial",
            }
          : inv
      )
    )
    setReceiptNotice({
      number: receiptNumber,
      amount: paidAmt,
    })
    setQrPayInvoice(null)
  }

  const handleInvoiceCreated = (newInv: InvoiceItem) => {
    setInvoices((prev) => [newInv, ...prev])
    setReceiptNotice({
      number: `NEW-${newInv.invoiceNumber}`,
      amount: newInv.amount || newInv.totalAmount || 0,
    })
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.studentName || "").toLowerCase().includes(searchQuery.toLowerCase())
    if (statusFilter === "ALL") return matchesSearch
    return matchesSearch && inv.status.toLowerCase() === statusFilter.toLowerCase()
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Finance & Billing Console
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px]">
              LEDGER ACCOUNTS
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Institutional fee registry, live collection reconciliation, automated receipting, and outstanding balances.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCreateInvoiceOpen(true)}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 font-semibold gap-1.5 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Generate Fee Invoice</span>
          </Button>
        </div>
      </div>

      {receiptNotice && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-500 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              Action for <strong>{formatCurrency(receiptNotice.amount)}</strong> confirmed! Transaction logged with identifier <strong>#{receiptNotice.number}</strong>.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[11px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400 gap-1"
            onClick={() => setReceiptNotice(null)}
          >
            <Receipt className="h-3 w-3" />
            Dismiss
          </Button>
        </div>
      )}

      {/* KPI Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Total Invoiced
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-foreground">
              {formatCurrency(totalBilled)}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">{invoices.length} active fee records</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Realized Collections
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-emerald-500">
              {formatCurrency(totalCollected)}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Settled across Bank & UPI</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Pending Overdue
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-rose-500">
              {formatCurrency(totalOutstanding)}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Dunning notice queue active</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Collection Velocity
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-indigo-500">
              {collectionRate}%
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Target: 85% by mid-term</div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table Card */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="p-4 border-b bg-muted/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold font-heading">
                Invoices & Collection Register
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time invoice ledger with printable receipts, UPI QR gateway, and instant webhook verification.
              </CardDescription>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search invoice or student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs w-full sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs shadow-sm focus:outline-none shrink-0"
              >
                <option value="ALL">All Status</option>
                <option value="DUE">Due</option>
                <option value="PARTIAL">Partial</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b font-mono uppercase text-[10px] text-muted-foreground">
                <tr>
                  <th className="p-3 pl-4">Invoice #</th>
                  <th className="p-3">Student & Grade</th>
                  <th className="p-3">Fee Component</th>
                  <th className="p-3 text-right">Total Billed</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Balance</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-foreground">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{inv.studentName}</div>
                      <div className="text-[11px] text-muted-foreground">{inv.classGrade}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{inv.feeHead}</td>
                    <td className="p-3 text-right font-mono font-semibold text-foreground">
                      {formatCurrency(inv.amount ?? inv.totalAmount ?? 0)}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {formatCurrency(inv.paidAmount)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-500">
                      {formatCurrency(inv.balanceAmount)}
                    </td>
                    <td className="p-3 font-mono text-muted-foreground">{inv.dueDate}</td>
                    <td className="p-3">
                      <Badge
                        variant={inv.status.toLowerCase() === "paid" ? "success" : "warning"}
                        className="text-[10px] uppercase font-mono"
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Printable/Downloadable Invoice */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewInvoiceModal(inv as any)}
                          className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                          title="Download & Print Tax Invoice"
                        >
                          <Printer className="h-3 w-3" />
                          <span className="hidden sm:inline">Receipt</span>
                        </Button>

                        {inv.balanceAmount > 0 ? (
                          <>
                            {/* Instant UPI QR Pay */}
                            <Button
                              size="sm"
                              onClick={() => setQrPayInvoice(inv)}
                              className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                              title="Generate Instant UPI QR Code"
                            >
                              <QrCode className="h-3 w-3" />
                              <span className="hidden sm:inline">UPI QR</span>
                            </Button>

                            {/* Manual Collection Modal */}
                            <Button
                              size="sm"
                              onClick={() => openPaymentModal(inv)}
                              className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            >
                              Collect
                            </Button>
                          </>
                        ) : (
                          <Badge variant="outline" className="font-mono text-[10px] text-emerald-600 border-emerald-500/30">
                            Settled
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manual Settlement Dialog */}
      {selectedInvoice && (
        <Dialog open={Boolean(selectedInvoice)} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">Collect Fee Payment</DialogTitle>
              <DialogDescription className="text-xs">
                Record collection for {selectedInvoice.studentName} ({selectedInvoice.invoiceNumber})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee Head:</span>
                  <span className="font-semibold text-foreground">{selectedInvoice.feeHead}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining Balance:</span>
                  <span className="font-mono font-bold text-rose-500">
                    {formatCurrency(selectedInvoice.balanceAmount)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Collection Amount (INR)
                </label>
                <Input
                  type="number"
                  value={payAmount}
                  max={selectedInvoice.balanceAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="NET_BANKING">Net Banking (NEFT/RTGS/IMPS)</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="CASH">Cash at Front Desk</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedInvoice(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCollectPayment}
                disabled={isProcessing || payAmount <= 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                {isProcessing ? "Processing..." : `Confirm Payment of ${formatCurrency(payAmount)}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Official Tax Invoice & Receipt Printable Modal */}
      {viewInvoiceModal && (
        <InvoiceReceiptModal
          invoice={viewInvoiceModal}
          onClose={() => setViewInvoiceModal(null)}
        />
      )}

      {/* Dynamic Instant UPI QR Pay Modal */}
      {qrPayInvoice && (
        <QRPaymentModal
          invoiceId={qrPayInvoice.id}
          invoiceNumber={qrPayInvoice.invoiceNumber}
          studentName={qrPayInvoice.studentName || "Student"}
          amount={qrPayInvoice.balanceAmount}
          onSuccess={handleQRSuccess}
          onClose={() => setQrPayInvoice(null)}
        />
      )}

      {/* Create New Invoice Modal */}
      {createInvoiceOpen && (
        <CreateInvoiceModal
          students={STUDENT_OPTIONS}
          onInvoiceCreated={handleInvoiceCreated}
          onClose={() => setCreateInvoiceOpen(false)}
        />
      )}
    </div>
  )
}
