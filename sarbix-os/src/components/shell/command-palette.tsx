"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  User,
  CalendarCheck,
  CreditCard,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { STUDENTS } from "@/lib/data/mock-db"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const filteredStudents = query.trim()
    ? STUDENTS.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
          s.admissionNumber.toLowerCase().includes(query.toLowerCase()) ||
          Boolean(s.rollNumber?.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  const handleNavigate = (path: string) => {
    onOpenChange(false)
    router.push(path)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-xl">
        <DialogTitle className="sr-only">Quick Command Palette</DialogTitle>
        <div className="flex items-center border-b px-3.5">
          <Search className="mr-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, invoices, or quick jump commands..."
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {/* Matching Students */}
          {filteredStudents.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Students
              </p>
              <div className="space-y-1">
                {filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleNavigate(`/students/${s.id}`)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs hover:bg-muted text-left transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 font-semibold">
                        {s.firstName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {s.classGrade} ({s.section}) • Roll: {s.rollNumber} • {s.admissionNumber}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigations */}
          <div>
            <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Navigation
            </p>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate("/overview")}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs hover:bg-muted text-left transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Institutional Command Center</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">/overview</span>
              </button>
              <button
                onClick={() => handleNavigate("/students")}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs hover:bg-muted text-left transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Student 360 Registry</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">/students</span>
              </button>
              <button
                onClick={() => handleNavigate("/attendance")}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs hover:bg-muted text-left transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  <span>Daily Attendance Grid</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">/attendance</span>
              </button>
              <button
                onClick={() => handleNavigate("/finance")}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs hover:bg-muted text-left transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Finance & Fee Billing</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">/finance</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
          <span>Navigation: <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd></span>
          <span>Select: <kbd className="font-mono">Enter</kbd></span>
          <span>Close: <kbd className="font-mono">Esc</kbd></span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
