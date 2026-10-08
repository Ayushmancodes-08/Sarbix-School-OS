"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  CheckCircle2,
  RefreshCw,
  Edit3,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

interface ManageStudentModalProps {
  student: {
    id: string
    firstName: string
    lastName: string
    admissionNumber: string
    classGrade?: string
    section?: string
    parentPhone?: string
    status: string
    pendingFeeAmount?: number
  }
}

export function ManageStudentModal({ student }: ManageStudentModalProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Form state
  const [classGrade, setClassGrade] = React.useState(student.classGrade || "Grade 10")
  const [section, setSection] = React.useState(student.section || "A")
  const [parentPhone, setParentPhone] = React.useState(student.parentPhone || "")
  const [status, setStatus] = React.useState(student.status)
  const [pendingFeeAmount, setPendingFeeAmount] = React.useState(
    student.pendingFeeAmount !== undefined ? String(student.pendingFeeAmount) : "0"
  )
  const [supabaseSyncStatus, setSupabaseSyncStatus] = React.useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    setSupabaseSyncStatus(null)

    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classGrade,
          section,
          parentPhone,
          status,
          pendingFeeAmount: Number(pendingFeeAmount),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to update student")
      }

      setSuccess(true)
      setSupabaseSyncStatus(
        data.supabaseSynced
          ? "Synced directly to Supabase cloud database!"
          : "Saved to institutional registry cache."
      )

      // Auto close after 1.5s
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        window.location.reload()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
          <Edit3 className="h-3.5 w-3.5" />
          <span>Manage Student (Supabase)</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <DialogTitle className="font-heading text-lg">
              Manage Student Dossier
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Edit records for <strong className="text-foreground">{student.firstName} {student.lastName}</strong> ({student.admissionNumber}). Synchronized with Supabase DB.
          </DialogDescription>
        </DialogHeader>

        {/* Supabase Connection Banner */}
        <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-[11px]">Supabase DB Connected</div>
              <div className="text-[10px] text-muted-foreground font-mono">
                Project: debhfqjgqmlmujrfyrny (PostgreSQL 17)
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] bg-background/80 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            Live
          </Badge>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-lg bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{supabaseSyncStatus}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="grade" className="text-xs font-medium text-foreground">Class / Grade</label>
              <Input
                id="grade"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                placeholder="e.g. Grade 10"
                className="h-8 text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="section" className="text-xs font-medium text-foreground">Section</label>
              <Input
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. A"
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="status" className="text-xs font-medium text-foreground">Enrollment Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="active">Active (Enrolled)</option>
              <option value="on_leave">On Approved Leave</option>
              <option value="suspended">Suspended</option>
              <option value="alumni">Graduated / Alumni</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-medium text-foreground">Parent / Emergency Contact Phone</label>
            <Input
              id="phone"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="+91 98110 00005"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="fee" className="text-xs font-medium text-foreground">Pending Fee Balance (₹)</label>
            <Input
              id="fee"
              type="number"
              value={pendingFeeAmount}
              onChange={(e) => setPendingFeeAmount(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Syncing to Supabase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Save to Supabase</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
