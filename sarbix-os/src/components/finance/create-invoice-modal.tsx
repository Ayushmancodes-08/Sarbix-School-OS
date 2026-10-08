"use client"

import * as React from "react"
import { PlusCircle, CheckCircle2, AlertCircle, X, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"

interface CreateInvoiceModalProps {
  students: { id: string; name: string; classGrade: string; rollNumber: string }[]
  onInvoiceCreated: (invoice: any) => void
  onClose: () => void
}

export function CreateInvoiceModal({
  students,
  onInvoiceCreated,
  onClose,
}: CreateInvoiceModalProps) {
  const [studentId, setStudentId] = React.useState(students[0]?.id || "")
  const [feeHead, setFeeHead] = React.useState("Term 2 Tuition & STEM Lab")
  const [amount, setAmount] = React.useState<number>(35000)
  const [dueDate, setDueDate] = React.useState("2026-11-15")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/finance/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          feeHead,
          amount: Number(amount),
          dueDate,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMsg(data?.error?.message || "Failed to create invoice.")
        setIsSubmitting(false)
        return
      }

      onInvoiceCreated(data.data)
      onClose()
    } catch {
      setErrorMsg("Network error creating invoice.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between border-b bg-muted/40 px-5 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">
                Generate Institutional Fee Invoice
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Add invoice billable to student fee ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Select Student *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classGrade} · Roll: {s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Fee Head Component *
            </label>
            <select
              value={feeHead}
              onChange={(e) => setFeeHead(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Term 2 Tuition & STEM Lab">Term 2 Tuition & STEM Lab</option>
              <option value="Annual Composite Comprehensive Fee">Annual Composite Comprehensive Fee</option>
              <option value="Transport Route Bus Pass">Transport Route Bus Pass</option>
              <option value="Board Examination & Evaluation Fee">Board Examination & Evaluation Fee</option>
              <option value="Sports & Extracurricular Academy">Sports & Extracurricular Academy</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Invoiced Amount (INR) *
              </label>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="h-9 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Due Date *
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 font-semibold px-4"
            >
              {isSubmitting ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
