"use client"

import * as React from "react"
import {
  HeartHandshake,
  User,
  CalendarCheck,
  CreditCard,
  BookOpen,
  Bus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  QrCode,
  Printer,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceReceiptModal, type InvoiceDocData } from "@/components/finance/invoice-receipt-modal"
import { QRPaymentModal } from "@/components/finance/qr-payment-modal"
import { formatCurrency, cn } from "@/lib/utils"

interface ChildData {
  id: string
  name: string
  admissionNumber: string
  grade: string
  section: string
  rollNumber: string
  todayAttendance: "PRESENT" | "ABSENT" | "LATE"
  attendancePercentage: number
  gpa: number
  pendingFee: number
  busRoute: string
  classTeacher: string
  invoices: {
    id: string
    title: string
    amount: number
    dueDate: string
    status: string
  }[]
  homework: {
    id: string
    subject: string
    title: string
    dueDate: string
    status: string
  }[]
}

const MOCK_CHILDREN: ChildData[] = [
  {
    id: "std-001",
    name: "Aarav Patel",
    admissionNumber: "ADM-2026-0891",
    grade: "Grade 10",
    section: "A",
    rollNumber: "10A-14",
    todayAttendance: "PRESENT",
    attendancePercentage: 96.5,
    gpa: 3.92,
    pendingFee: 15000,
    busRoute: "Route 04 (South Delhi Express)",
    classTeacher: "Mr. Rajesh Verma",
    invoices: [
      {
        id: "inv-2026-101",
        title: "Term 1 Tuition & Lab Fee",
        amount: 15000,
        dueDate: "2026-10-15",
        status: "partial",
      },
    ],
    homework: [
      {
        id: "hw-01",
        subject: "Mathematics",
        title: "Quadratic Equations Problem Set 4",
        dueDate: "2026-10-10",
        status: "PENDING",
      },
      {
        id: "hw-02",
        subject: "Physics",
        title: "Ray Optics Ray Diagrams Lab Report",
        dueDate: "2026-10-09",
        status: "SUBMITTED",
      },
    ],
  },
  {
    id: "std-002",
    name: "Diya Sharma",
    admissionNumber: "ADM-2026-0944",
    grade: "Grade 8",
    section: "B",
    rollNumber: "8B-21",
    todayAttendance: "PRESENT",
    attendancePercentage: 98.0,
    gpa: 4.0,
    pendingFee: 0,
    busRoute: "Route 09 (Central Corridor)",
    classTeacher: "Ms. Shalini Saxena",
    invoices: [
      {
        id: "inv-2026-102",
        title: "Annual Composite Fee",
        amount: 0,
        dueDate: "2026-09-30",
        status: "paid",
      },
    ],
    homework: [
      {
        id: "hw-08",
        subject: "General Science",
        title: "Cell Structure & Organelles Worksheet",
        dueDate: "2026-10-11",
        status: "PENDING",
      },
    ],
  },
]

export default function ParentPortalPage() {
  const [children, setChildren] = React.useState<ChildData[]>(MOCK_CHILDREN)
  const [selectedChildIndex, setSelectedChildIndex] = React.useState(0)
  const child = children[selectedChildIndex]
  const [paidSuccess, setPaidSuccess] = React.useState(false)
  const [receiptNumber, setReceiptNumber] = React.useState<string | null>(null)

  // Modals state
  const [qrPayOpen, setQrPayOpen] = React.useState(false)
  const [viewReceiptModal, setViewReceiptModal] = React.useState<InvoiceDocData | null>(null)

  const handleQRSuccess = (rcpt: string) => {
    setChildren((prev) =>
      prev.map((c, idx) =>
        idx === selectedChildIndex
          ? {
              ...c,
              pendingFee: 0,
              invoices: c.invoices.map((inv) => ({ ...inv, status: "paid" })),
            }
          : c
      )
    )
    setReceiptNumber(rcpt)
    setPaidSuccess(true)
    setQrPayOpen(false)
    setTimeout(() => setPaidSuccess(false), 8000)
  }

  const handlePay = () => {
    setQrPayOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header & Child Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Parent Family Portal
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px]">
              VERIFIED GUARDIAN
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-child unified dashboard for attendance telemetry, homework tracking, fee settlements, and teacher communication.
          </p>
        </div>

        {/* Multi-child switcher tabs */}
        <div className="flex items-center space-x-2 bg-muted/60 p-1 rounded-lg border border-border overflow-x-auto max-w-full">
          {MOCK_CHILDREN.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setSelectedChildIndex(idx)}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all",
                selectedChildIndex === idx
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="h-3.5 w-3.5" />
              <span>{c.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">({c.grade})</span>
            </button>
          ))}
        </div>
      </div>

      {paidSuccess && (
        <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-500 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Payment of {formatCurrency(child.pendingFee)} processed successfully! Digital receipt emailed to guardian.</span>
        </div>
      )}

      {/* Child Hero Banner */}
      <Card className="border-border/80 bg-gradient-to-r from-card via-card to-indigo-500/5 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-heading font-bold text-xl shadow-md shadow-indigo-600/20">
                {child.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    {child.name}
                  </h2>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {child.rollNumber}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {child.grade} · Section {child.section} · Admission: {child.admissionNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Class Mentor: <span className="font-medium text-foreground">{child.classTeacher}</span>
                </p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border bg-background/80 p-3 text-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Today</span>
                <div className="flex items-center justify-center space-x-1 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-bold text-xs text-emerald-500 font-mono">PRESENT</span>
                </div>
              </div>

              <div className="rounded-lg border bg-background/80 p-3 text-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Term Attendance</span>
                <div className="font-bold text-xs text-foreground font-mono mt-0.5">
                  {child.attendancePercentage}%
                </div>
              </div>

              <div className="rounded-lg border bg-background/80 p-3 text-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Term GPA</span>
                <div className="font-bold text-xs text-indigo-500 font-mono mt-0.5">
                  {child.gpa} / 4.0
                </div>
              </div>

              <div className="rounded-lg border bg-background/80 p-3 text-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Fee Due</span>
                <div className={cn("font-bold text-xs font-mono mt-0.5", child.pendingFee > 0 ? "text-rose-500" : "text-emerald-500")}>
                  {child.pendingFee > 0 ? formatCurrency(child.pendingFee) : "Clear"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto pb-1 max-w-full">
          <TabsList className="bg-muted/80 p-1 inline-flex w-max sm:w-auto">
            <TabsTrigger value="overview" className="gap-2 text-xs whitespace-nowrap">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Today & Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="homework" className="gap-2 text-xs whitespace-nowrap">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Homework ({child.homework.length})</span>
            </TabsTrigger>
            <TabsTrigger value="finance" className="gap-2 text-xs whitespace-nowrap">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Fee Ledger</span>
            </TabsTrigger>
            <TabsTrigger value="transport" className="gap-2 text-xs whitespace-nowrap">
              <Bus className="h-3.5 w-3.5" />
              <span>Bus Transit</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="p-4 border-b bg-muted/10">
                <CardTitle className="text-sm font-bold font-heading">
                  Today's Attendance Status
                </CardTitle>
                <CardDescription className="text-xs">
                  Morning homeroom verification timestamp
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-semibold text-xs">Marked Present at 08:32 AM</span>
                  </div>
                  <span className="font-mono text-xs">Room 204</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your child has completed 72 out of 75 instructional days this academic term with zero unexcused absences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-sm">
              <CardHeader className="p-4 border-b bg-muted/10">
                <CardTitle className="text-sm font-bold font-heading">
                  Parent-Teacher Communication (PTM)
                </CardTitle>
                <CardDescription className="text-xs">
                  Next conference scheduled with {child.classTeacher}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold text-xs">Saturday, Oct 24 · 10:30 AM</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">Slot Confirmed</Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full text-xs h-8">
                  Reschedule Conference Slot
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="homework" className="space-y-4">
          <div className="space-y-3">
            {child.homework.map((hw) => (
              <Card key={hw.id} className="border-border/80 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-foreground">{hw.title}</span>
                    <Badge variant="secondary" className="font-mono text-[10px]">{hw.subject}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Due Date: <span className="font-mono font-medium text-rose-500">{hw.dueDate}</span></p>
                </div>
                <Badge
                  variant={hw.status === "SUBMITTED" ? "success" : "warning"}
                  className="font-mono text-xs"
                >
                  {hw.status}
                </Badge>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold font-heading">
                    Fee Invoices for {child.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Institutional ledger and digital receipt records
                  </CardDescription>
                </div>
                {child.pendingFee > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={handlePay}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-semibold gap-1.5 shadow-sm"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span>Pay via Instant UPI QR ({formatCurrency(child.pendingFee)})</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="divide-y divide-border">
                {child.invoices.map((inv) => (
                  <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 first:pt-0 last:pb-0 gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{inv.title}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">Due: {inv.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-xs text-foreground">{formatCurrency(inv.amount)}</span>
                      <Badge
                        variant={inv.status === "paid" ? "success" : "warning"}
                        className="font-mono text-[10px] uppercase"
                      >
                        {inv.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setViewReceiptModal({
                            id: inv.id,
                            invoiceNumber: `INV-2026-${inv.id}`,
                            studentId: child.id,
                            studentName: child.name,
                            classGrade: `${child.grade}-${child.section}`,
                            feeHead: inv.title,
                            amount: inv.amount,
                            totalAmount: inv.amount,
                            paidAmount: inv.status === "paid" ? inv.amount : 0,
                            balanceAmount: inv.status === "paid" ? 0 : inv.amount,
                            dueDate: inv.dueDate,
                            status: inv.status,
                          })
                        }
                        className="h-7 text-[11px] gap-1"
                      >
                        <Printer className="h-3 w-3" />
                        <span>Receipt</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transport" className="space-y-4">
          <Card className="border-border/80 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-heading font-semibold text-sm text-foreground">
                  Assigned Route: {child.busRoute}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Morning Pickup: 07:10 AM at Hauz Khas Enclave · Evening Drop: 03:25 PM
                </p>
                <div className="mt-3 flex items-center space-x-2 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Driver Contact: Gurdeep Singh (+91 98110 54321)</span>
                </div>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-mono text-xs w-fit">
                In Transit · On Schedule
              </Badge>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dynamic Instant UPI QR Pay Modal */}
      {qrPayOpen && (
        <QRPaymentModal
          invoiceId={child.invoices[0]?.id || "inv-fee-01"}
          invoiceNumber={`INV-2026-FEE-${child.rollNumber}`}
          studentName={child.name}
          amount={child.pendingFee}
          onSuccess={handleQRSuccess}
          onClose={() => setQrPayOpen(false)}
        />
      )}

      {/* Printable Official Receipt & Tax Invoice Modal */}
      {viewReceiptModal && (
        <InvoiceReceiptModal
          invoice={viewReceiptModal}
          onClose={() => setViewReceiptModal(null)}
        />
      )}
    </div>
  )
}
