"use client"

import * as React from "react"
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Save,
  RotateCcw,
  Sparkles,
  Users,
  Search,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface StudentRow {
  id: string
  rollNumber: string
  name: string
  gender: string
  avatarUrl?: string
  status: "present" | "absent" | "late" | "excused"
  remarks?: string
}

const DEFAULT_ROSTER: StudentRow[] = [
  {
    id: "std-001",
    rollNumber: "10A-14",
    name: "Aarav Patel",
    gender: "male",
    status: "present",
  },
  {
    id: "std-002",
    rollNumber: "10A-21",
    name: "Diya Sharma",
    gender: "female",
    status: "present",
  },
  {
    id: "std-003",
    rollNumber: "10A-07",
    name: "Kabir Mehta",
    gender: "male",
    status: "late",
    remarks: "School bus traffic delay on Route 04",
  },
  {
    id: "std-004",
    rollNumber: "10A-33",
    name: "Ananya Iyer",
    gender: "female",
    status: "present",
  },
  {
    id: "std-005",
    rollNumber: "10A-19",
    name: "Rohan Gupta",
    gender: "male",
    status: "present",
  },
  {
    id: "std-006",
    rollNumber: "10A-42",
    name: "Zoya Siddiqui",
    gender: "female",
    status: "absent",
    remarks: "Parent medical leave notice received",
  },
]

export default function AttendanceConsolePage() {
  const [selectedGrade, setSelectedGrade] = React.useState("Grade 10")
  const [selectedSection, setSelectedSection] = React.useState("A")
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = React.useState<StudentRow[]>(DEFAULT_ROSTER)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [saveSuccess, setSaveSuccess] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Compute live statistics
  const totalStudents = students.length
  const presentCount = students.filter((s) => s.status === "present").length
  const absentCount = students.filter((s) => s.status === "absent").length
  const lateCount = students.filter((s) => s.status === "late").length
  const excusedCount = students.filter((s) => s.status === "excused").length
  const presentRate = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : "0"

  const setStudentStatus = (id: string, status: "present" | "absent" | "late" | "excused") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    )
    setSaveSuccess(false)
  }

  const markAll = (status: "present" | "absent") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })))
    setSaveSuccess(false)
  }

  const handleSaveAttendance = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    setSaveSuccess(false)

    try {
      const payload = {
        classGrade: selectedGrade,
        section: selectedSection,
        date,
        records: students.map((s) => ({
          studentId: s.id,
          status: s.status,
          remarks: s.remarks,
        })),
      }

      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(data?.error?.message || "Failed to save attendance records.")
        setIsSubmitting(false)
        return
      }

      setSaveSuccess(true)
      setIsSubmitting(false)
    } catch {
      setErrorMessage("Network error while committing attendance session.")
      setIsSubmitting(false)
    }
  }

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Rapid Attendance Console
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px] shrink-0">
              DAILY ROSTER
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Fast keyboard-friendly roll call session. Record period or homeroom attendance in &lt;15 seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll("present")}
            className="text-xs h-8 sm:h-9"
          >
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            Mark All Present
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAttendance}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 sm:h-9 px-3 sm:px-4 font-semibold"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isSubmitting ? "Saving..." : "Commit Attendance"}
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-500 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Attendance session for {selectedGrade}-{selectedSection} on {date} successfully recorded and committed to institutional audit logs.</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center space-x-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Control Strip & Filters */}
      <Card className="border border-border/80 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Class Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Attendance Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Search Roster
              </label>
              <div className="relative mt-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/80">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Total Enrolled
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-foreground">
              {totalStudents}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Active Roster Size</div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Present Today
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-emerald-500">
              {presentCount} <span className="text-sm text-muted-foreground font-sans">({presentRate}%)</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Threshold: Above 90% target</div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Absences Logged
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-rose-500">
              {absentCount}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Trigger parent SMS alert</div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Late Arrivals
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-amber-500">
              {lateCount}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Transit or gate delayed</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Roster Table */}
      <Card className="border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/10 border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold font-heading">
                Roll Call Grid — {selectedGrade} (Section {selectedSection})
              </CardTitle>
              <CardDescription className="text-xs">
                Select status tag or use keyboard roll-call shortcut pins.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {filteredStudents.length} Students Listed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredStudents.map((student, idx) => (
              <div
                key={student.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between p-3.5 transition-colors hover:bg-muted/40 gap-3",
                  student.status === "absent" && "bg-rose-500/5",
                  student.status === "late" && "bg-amber-500/5"
                )}
              >
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted font-mono text-xs font-bold text-muted-foreground">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-foreground">
                        {student.name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        ({student.rollNumber})
                      </span>
                    </div>
                    {student.remarks && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                        Note: {student.remarks}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStudentStatus(student.id, "present")}
                    className={cn(
                      "flex items-center space-x-1 rounded px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all",
                      student.status === "present"
                        ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                        : "bg-muted/70 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600"
                    )}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Present (P)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentStatus(student.id, "absent")}
                    className={cn(
                      "flex items-center space-x-1 rounded px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all",
                      student.status === "absent"
                        ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30"
                        : "bg-muted/70 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600"
                    )}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Absent (A)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentStatus(student.id, "late")}
                    className={cn(
                      "flex items-center space-x-1 rounded px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all",
                      student.status === "late"
                        ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30"
                        : "bg-muted/70 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600"
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Late (L)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentStatus(student.id, "excused")}
                    className={cn(
                      "flex items-center space-x-1 rounded px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all",
                      student.status === "excused"
                        ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30"
                        : "bg-muted/70 text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-600"
                    )}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Excused (E)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
