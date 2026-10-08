import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { formatCurrency } from "@/lib/utils"
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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OverviewPage() {
  // Enforce server-side authorization
  const session = await requirePermission("overview:view")

  const students = db.students.getAll(session.campusId)
  const invoices = db.fees.getAll(session.campusId)
  const auditLogs = db.audit.getAll(session.campusId)

  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0)
  const totalPending = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0)
  const avgAttendance = 94.6

  return (
    <div className="space-y-8">
      {/* Page Title & Operational Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Institutional Command Center
            </h1>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              LIVE TELEMETRY
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-branch operational intelligence, financial realization, and daily academic status.
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" asChild>
            <Link href="/admissions">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New Admission</span>
            </Link>
          </Button>
          <Button size="sm" className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/attendance">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Daily Attendance</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Learners
            </CardTitle>
            <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight">{students.length * 208}</div>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+4.2% from last term</span>
            </div>
          </CardContent>
        </Card>

        {/* Overall Attendance */}
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Today's Attendance
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight">{avgAttendance}%</div>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-muted-foreground">
              <span>982 Present • 41 Late • 18 Absent</span>
            </div>
          </CardContent>
        </Card>

        {/* Fee Collection */}
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Collected Dues (Term II)
            </CardTitle>
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight">
              {formatCurrency(totalCollected * 15)}
            </div>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-muted-foreground">
              <span>Outstanding: {formatCurrency(totalPending * 15)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Transport Fleet Status */}
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Transit & Fleet
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <Bus className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tracking-tight">18 / 18</div>
            <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>All GPS beacons active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout: Operational Highlights & Live Telemetry Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: High Priority Action Board & Fee Reconciliation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Invoices requiring attention */}
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Priority Collection Queue</CardTitle>
                <CardDescription className="text-xs">
                  Invoices nearing or exceeding payment milestones
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-indigo-600 dark:text-indigo-400" asChild>
                <Link href="/finance">View All Invoices →</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.filter(i => i.balanceAmount > 0).map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-lg border border-border/80 p-3.5 hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-foreground">{inv.studentName}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {inv.classGrade}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{inv.feeHead}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-destructive">
                        {formatCurrency(inv.balanceAmount)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Due: {new Date(inv.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Institutional Integrity Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Zero-Trust Session Status</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                RBAC session validated for <span className="font-medium text-foreground">{session.email}</span> with role <code className="font-mono text-indigo-500">{session.role}</code>. All server data calls are strictly tenant-isolated.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-foreground">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>Biometric / RFID Terminal Sync</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Terminal Gate A & Gate B synchronized at 08:00 AM. 1,023 entry events processed with zero packet drops.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Live Audit & Institutional Activity Feed */}
        <div className="space-y-6">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Live Audit Trail</CardTitle>
              <CardDescription className="text-xs">
                Real-time security and administrative mutations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="relative pl-6 border-l-2 border-border/80 pb-2 last:pb-0">
                    <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-indigo-500 uppercase">
                          {log.action} : {log.resource}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(log.createdAt || log.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-foreground font-medium">
                        {log.userEmail}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {JSON.stringify(log.details).replace(/[{}"]/g, "")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
