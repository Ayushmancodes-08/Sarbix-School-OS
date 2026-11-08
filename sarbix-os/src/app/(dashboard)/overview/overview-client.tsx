"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  CalendarCheck,
  CreditCard,
  Bus,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  PlusCircle,
  Clock,
  Briefcase,
  KeyRound,
  CheckCircle2,
  XCircle,
  ChevronRight,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { TeacherCredentialsModal } from "@/components/faculty/teacher-credentials-modal"

interface OverviewClientProps {
  session: {
    email: string
    role: string
    campusId: string
  }
  kpis: {
    totalStudents: number
    avgAttendance: number
    totalCollected: number
    totalPending: number
    fleetActive: number
  }
  facultyList: {
    id: string
    name: string
    email: string
    role: string
  }[]
  jobApplications: {
    id: string
    name: string
    email: string
    phone: string
    subject: string
    qualification: string
    experience: string
    coverLetter: string
    status: "PENDING" | "HIRED" | "REJECTED"
    appliedAt: string
  }[]
  invoices: {
    id: string
    studentName: string
    classGrade: string
    feeHead: string
    balanceAmount: number
    dueDate: string
  }[]
  auditLogs: {
    id: string
    action: string
    resource: string
    userEmail: string
    createdAt?: string
    timestamp?: string
    details: any
  }[]
}

export function OverviewClient({
  session,
  kpis,
  facultyList,
  jobApplications: initialJobApps,
  invoices,
  auditLogs,
}: OverviewClientProps) {
  const [selectedTeacher, setSelectedTeacher] = React.useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [credsModalOpen, setCredsModalOpen] = React.useState(false)
  const [jobApps, setJobApps] = React.useState(initialJobApps)

  const handleOpenCredentials = (teacher: { id: string; name: string; email: string }) => {
    setSelectedTeacher(teacher)
    setCredsModalOpen(true)
  }

  const handleHireApplicant = (app: typeof jobApps[0]) => {
    // Open credential modal with candidate info pre-filled
    setSelectedTeacher({
      id: app.id,
      name: app.name,
      email: app.email,
    })
    setJobApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: "HIRED" } : a))
    )
    setCredsModalOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Page Title & Operational Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Institutional Command Center
            </h1>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] sm:text-xs shrink-0">
              EXECUTIVE COCKPIT
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Delhi Central Campus • Cross-department operations, admissions, and faculty management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" asChild className="text-xs h-8 gap-1.5 border-border">
            <Link href="/apply/admission" target="_blank">
              <PlusCircle className="h-3.5 w-3.5 text-indigo-500" />
              <span>Public Admission Link</span>
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild className="text-xs h-8 gap-1.5 border-border">
            <Link href="/apply/job" target="_blank">
              <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
              <span>Faculty Career Portal</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Emedley-Inspired Institutional KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-indigo-500/30 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                Active Enrolled
              </span>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
                {kpis.totalStudents.toLocaleString()}
              </div>
              <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +4.2%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">100% capacity in Grade 10-A</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-emerald-500/30 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                Campus Attendance
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CalendarCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                {kpis.avgAttendance}%
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">Today</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Synced from teacher roll calls</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-indigo-500/30 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                Fee Realization
              </span>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
                {formatCurrency(kpis.totalCollected)}
              </div>
              <span className="text-[11px] font-medium text-emerald-500">82.4%</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{formatCurrency(kpis.totalPending)} pending</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-amber-500/30 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                Transport Telemetry
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Bus className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground">
                {kpis.fleetActive} / 4 Fleet
              </div>
              <span className="text-[11px] font-medium text-emerald-500">All On Route</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Zero delay warnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: 2 Columns Left + Right Activity Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Faculty Management & Credential Issuance Table */}
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Faculty Directory & Class Allocation</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Assign classroom sections and generate educator access passes
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {facultyList.length} Active Faculty
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {facultyList.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/70 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {teacher.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs text-foreground truncate">{teacher.name}</span>
                          <Badge variant="secondary" className="text-[10px]">
                            {teacher.role}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{teacher.email}</p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenCredentials(teacher)}
                      className="h-8 text-xs gap-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Assign Class & Issue Pass</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prospective Faculty Candidates & Hiring Queue */}
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <span>Educator Job Applications (CampusConnect Pipeline)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Public applications submitted via /apply/job
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                {jobApps.filter((a) => a.status === "PENDING").length} Pending Review
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-foreground">{app.name}</span>
                          <Badge
                            className={`text-[10px] ${
                              app.status === "HIRED"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                            }`}
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-indigo-500 font-medium">{app.subject} • {app.experience}</p>
                      </div>

                      {app.status === "PENDING" && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleHireApplicant(app)}
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Hire & Provision</span>
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground bg-card p-2 rounded-lg border border-border/60">
                      <strong>Qualification:</strong> {app.qualification}
                      <p className="mt-1 italic line-clamp-2">&quot;{app.coverLetter}&quot;</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Live Append-Only Audit Trail */}
        <div className="space-y-6">
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Live Audit Trail</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time security & administrative ledger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="relative pl-5 border-l-2 border-indigo-500/40 pb-3 last:pb-0">
                    <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-indigo-500 uppercase">
                          {log.action} : {log.resource}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(log.createdAt || log.timestamp || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-foreground font-medium truncate">
                        {log.userEmail}
                      </p>
                      <p className="text-[11px] text-muted-foreground break-all line-clamp-2">
                        {JSON.stringify(log.details).replace(/[{}"]/g, "")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Invoices Overview */}
          <Card className="border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-500" />
                <span>High-Balance Fee Invoices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/20">
                    <div>
                      <span className="font-semibold text-xs text-foreground">{inv.studentName}</span>
                      <p className="text-[10px] text-muted-foreground">{inv.classGrade} • {inv.feeHead}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-destructive">
                        {formatCurrency(inv.balanceAmount)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Due: {inv.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Teacher Credentials Modal */}
      <TeacherCredentialsModal
        open={credsModalOpen}
        onOpenChange={setCredsModalOpen}
        teacher={selectedTeacher}
      />
    </div>
  )
}

