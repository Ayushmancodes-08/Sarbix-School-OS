import * as React from "react"
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  QrCode,
  MapPin,
  Sparkles,
  Award,
  FileCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { requireAuth } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { LiveAttendanceTracker } from "@/components/student/live-attendance-tracker"

export default async function StudentPortalPage() {
  const session = await requireAuth()

  // Find student record or fallback to primary student
  const student = db.students.getById("std-001") || db.students.getAll()[0]
  const timetable = db.timetable.getByClass(student.classGrade || "Grade 10", student.section || "A")
  const homework = db.academics.getHomework(student.classGrade, student.section)

  // Live synced teacher attendance record
  const studentAttendance = db.attendance.getByStudent(student.id)
  const todayRecord = studentAttendance.find((r) => r.date === "2026-10-08") || {
    status: "present" as const,
    remarks: undefined,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Student Learning Hub
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px]">
              STUDENT DESK
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {student.firstName}. Your personalized timetable, homework deliverables, digital ID, and academic standing.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Digital ID Card & Right Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital Student ID Card */}
        <div className="space-y-4">
          <Card className="border-border/80 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl overflow-hidden relative">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="p-5 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded bg-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                    S
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xs tracking-wider uppercase text-white/90">
                      SARBIX ACADEMY
                    </h3>
                    <p className="text-[10px] text-white/60">Delhi Central Campus</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-400/40 bg-emerald-400/20 text-emerald-300 text-[10px] font-mono">
                  ACTIVE
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-heading font-bold text-xl text-white shadow-inner">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white">
                    {student.firstName} {student.lastName}
                  </h4>
                  <p className="font-mono text-xs text-indigo-200">
                    Roll: {student.rollNumber} · {student.classGrade}-{student.section}
                  </p>
                  <p className="text-[11px] text-white/60">
                    ID: {student.admissionNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-3 text-white/80">
                <div>
                  <span className="text-[10px] text-white/50 block font-mono uppercase">Blood Group</span>
                  <span className="font-bold font-mono text-white">{student.bloodGroup || "O+"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block font-mono uppercase">Transit Route</span>
                  <span className="font-bold text-white text-[11px] truncate block">{student.busRouteNumber || "Route 04"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  VALID: 2026-2027 ACADEMIC YEAR
                </div>
                <QrCode className="h-7 w-7 text-white/80" />
              </div>
            </CardContent>
          </Card>

          {/* Academic Vitals */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="p-4 pb-2 border-b">
              <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Term Standing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Cumulative GPA</span>
                <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  {student.academicGpa || 3.92} / 4.0
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Attendance Streak</span>
                <span className="font-mono font-bold text-sm text-emerald-500">
                  {student.attendancePercentage || 96.5}% (Excellent)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Pending Homework</span>
                <span className="font-mono font-bold text-sm text-amber-500">
                  {homework.filter((h) => h.submissionStatus === "PENDING").length} due this week
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Today's Schedule, Live Attendance Tracker & Homework */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Synced Homeroom Attendance Tracker */}
          <LiveAttendanceTracker
            studentName={`${student.firstName} ${student.lastName}`}
            classGrade={student.classGrade || "Grade 10"}
            section={student.section || "A"}
            attendancePercentage={student.attendancePercentage || 94.8}
            teacherName="Mr. Rajesh Verma"
            todayStatus={todayRecord.status as any}
            todayRemarks={todayRecord.remarks}
          />

          {/* Today's Schedule */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold font-heading">
                    Today's Class Schedule
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Classes scheduled for {student.classGrade} (Section {student.section})
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {timetable.length} Periods Scheduled
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="divide-y divide-border">
                {timetable.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        P{slot.periodNumber}
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-foreground">{slot.subjectName}</h5>
                        <div className="flex items-center space-x-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{slot.teacherName}</span>
                          <span>·</span>
                          <span className="font-medium text-indigo-500">{slot.roomNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Homework Deliverables */}
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold font-heading">
                    Homework Deliverables
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pending submissions and teacher graded worksheets
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {homework.length} Assignments
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {homework.map((hw) => (
                  <div
                    key={hw.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border/70 hover:border-border transition-colors gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-foreground">{hw.title}</span>
                        <Badge variant="outline" className="font-mono text-[10px]">{hw.subject}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{hw.description}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Teacher: {hw.teacherName} · Due: <span className="font-mono font-medium text-rose-500">{hw.dueDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <Badge
                        variant={hw.submissionStatus === "SUBMITTED" ? "success" : "warning"}
                        className="text-[10px] font-mono"
                      >
                        {hw.submissionStatus}
                      </Badge>
                      {hw.submissionStatus === "PENDING" && (
                        <Button size="sm" variant="outline" className="h-7 text-[11px]">
                          Submit Work
                        </Button>
                      )}
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
