import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { formatCurrency } from "@/lib/utils"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarCheck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Heart,
  Bus,
  Award,
  Clock,
  ShieldAlert,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ManageStudentModal } from "@/components/students/manage-student-modal"

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await requirePermission("students:view")
  const { id } = await params

  const student = db.students.getById(id)
  if (!student) {
    notFound()
  }

  const invoices = db.fees.getAll(session.campusId).filter((f) => f.studentId === student.id)
  const timetable = db.timetable.getByClass(student.classGrade || "", student.section || "")

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-xs">
          <Link href="/students">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Students</span>
          </Link>
        </Button>
      </div>

      {/* Hero Dossier Header */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-indigo-500/10">
              <AvatarFallback className="text-2xl font-bold bg-indigo-600 text-white">
                {student.firstName[0]}
                {student.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {student.firstName} {student.lastName}
                </h1>
                <Badge variant="success" className="text-xs uppercase">
                  {student.status}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{student.classGrade} ({student.section})</span> • Roll #{student.rollNumber} • Admission ID: <span className="font-mono">{student.admissionNumber}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  Blood: {student.bloodGroup}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Bus className="h-3.5 w-3.5 text-amber-500" />
                  {student.busRouteNumber || "Self Commute"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ManageStudentModal student={student} />
            <Button variant="outline" size="sm" className="text-xs" asChild>
              <Link href="/attendance">Attendance Roster</Link>
            </Button>
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/finance">Fee Statement</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Performance Indicators */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Attendance Standing
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{student.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">94 of 98 sessions attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Academic GPA
            </CardTitle>
            <Award className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{student.academicGpa} / 4.0</div>
            <p className="text-xs text-emerald-600 mt-1">Top 5% in Class Cohort</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Fee Ledger Balance
            </CardTitle>
            <CreditCard className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${student.pendingFeeAmount ? 'text-destructive' : 'text-emerald-600'}`}>
              {student.pendingFeeAmount ? formatCurrency(student.pendingFeeAmount) : "₹0 (Clear)"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Term II Invoice</p>
          </CardContent>
        </Card>
      </div>

      {/* Deep-Dive Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto pb-1 max-w-full">
          <TabsList className="bg-muted/80 p-1 inline-flex w-max sm:w-auto">
            <TabsTrigger value="overview" className="text-xs whitespace-nowrap">Family & Transit</TabsTrigger>
            <TabsTrigger value="academics" className="text-xs whitespace-nowrap">Timetable & Schedule</TabsTrigger>
            <TabsTrigger value="finance" className="text-xs whitespace-nowrap">Billing History</TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Family & Transit */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Primary Guardian Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Parent / Guardian:</span>
                  <p className="font-semibold text-foreground text-sm">{student.parentName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.parentEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.parentPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{student.address}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Emergency Contacts & Medical</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Designated Emergency Handler:</span>
                  <p className="font-semibold text-foreground text-sm">{student.emergencyContactName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-rose-500" />
                  <span className="font-mono font-medium">{student.emergencyContactPhone}</span>
                </div>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-amber-700 dark:text-amber-400">
                  <span className="font-semibold">Medical Note:</span> No known allergies on record. Fully vaccinated for institutional cohort requirements.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Academics */}
        <TabsContent value="academics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Active Weekly Schedule ({student.classGrade})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timetable.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-xs text-foreground">{slot.subjectName}</span>
                      <p className="text-[11px] text-muted-foreground">
                        {slot.teacherName} • {slot.roomNumber}
                      </p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {slot.startTime} - {slot.endTime}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Finance */}
        <TabsContent value="finance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Institutional Billing Statements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs">{inv.invoiceNumber}</span>
                        <Badge
                          variant={inv.status.toLowerCase() === "paid" ? "success" : "warning"}
                          className="text-[10px] uppercase font-mono"
                        >
                          {inv.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{inv.feeHead || "Tuition Fee"}</p>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <div className="text-xs font-mono font-bold text-foreground">
                          {formatCurrency(inv.amount ?? inv.totalAmount ?? 0)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Balance: {formatCurrency(inv.balanceAmount)}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild className="h-7 text-[11px]">
                        <Link href="/finance">Collect →</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
