"use client"

import * as React from "react"
import Link from "next/link"
import {
  BookOpen,
  CalendarCheck,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  FileText,
  GraduationCap,
  Bell,
  ChevronRight,
  TrendingUp,
  KeyRound,
  Calendar,
  Compass,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StudentCredentialsModal } from "@/components/students/student-credentials-modal"

interface StudentRow {
  id: string
  name: string
  rollNumber: string
  classGrade: string
  section: string
  attendancePercentage?: number
}

interface TeacherDashboardClientProps {
  teacherName: string
  students: StudentRow[]
}

export function TeacherDashboardClient({
  teacherName,
  students,
}: TeacherDashboardClientProps) {
  const [selectedStudentForCreds, setSelectedStudentForCreds] = React.useState<StudentRow | null>(null)
  const [credsModalOpen, setCredsModalOpen] = React.useState(false)

  const handleOpenCredentials = (student: StudentRow) => {
    setSelectedStudentForCreds(student)
    setCredsModalOpen(true)
  }

  const todayClasses = [
    { period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics (Algebra)", class: "Grade 10-A", room: "Room 204", status: "completed" },
    { period: "Period 2", time: "09:20 - 10:05 AM", subject: "Geometry & Trigonometry", class: "Grade 9-B", room: "Room 108", status: "completed" },
    { period: "Period 3", time: "10:30 - 11:15 AM", subject: "Advanced Problem Solving", class: "Grade 10-A", room: "Room 204", status: "now" },
    { period: "Period 4", time: "11:30 - 12:15 PM", subject: "Applied Calculus", class: "Grade 11-A", room: "Room 302", status: "scheduled" },
  ]

  const pendingGrading = [
    { title: "Quadratic Equations Problem Set #4", class: "Grade 10-A", count: 28, submitted: "Yesterday" },
    { title: "Mid-Term Practice Paper Revision", class: "Grade 9-B", count: 14, submitted: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* EduNova Inspired Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 p-6 text-white shadow-md">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-4 ring-indigo-500/30">
              <AvatarFallback className="bg-indigo-600 text-white font-bold text-xl">
                RV
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Good morning, {teacherName}! 👋
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                  ACTIVE HOMEROOM ADVISOR
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Department of Mathematics • Advisee Class: <strong>Grade 10-A (32 students)</strong>
              </p>
              <div className="mt-2 flex items-center space-x-3 text-xs text-indigo-200">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  Upcoming: 10:30 AM (Grade 10-A Algebra)
                </span>
                <span>•</span>
                <span>Room 204</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs gap-1.5 shadow-sm shadow-emerald-600/30">
              <Link href="/attendance">
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>Mark 10-A Attendance</span>
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="border-slate-700 bg-slate-800/60 text-white hover:bg-slate-800 text-xs gap-1.5">
              <Link href="/academics">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                <span>Teaching Schedule</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* EduNova Micro-KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-indigo-500/40 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Today&apos;s Sessions
              </span>
              <BookOpen className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-foreground">4 Lectures</div>
            <p className="mt-1 text-[11px] text-muted-foreground">2 Finished • 2 Remaining</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Class 10-A Roll
              </span>
              <CalendarCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">94.8%</div>
            <p className="mt-1 text-[11px] text-muted-foreground">30 / 32 Marked Present</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-amber-500/40 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Papers to Grade
              </span>
              <FileText className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">42 Papers</div>
            <p className="mt-1 text-[11px] text-muted-foreground">Quadratic equations set</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur-xs shadow-xs hover:border-indigo-500/40 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                CBSE Curriculum
              </span>
              <TrendingUp className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">78% Done</div>
            <p className="mt-1 text-[11px] text-muted-foreground">Term 2 target on track</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: 2 Columns Left + Right Calendar/Notices Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Teaching Schedule */}
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Today&apos;s Lecture Timetable</CardTitle>
                <CardDescription className="text-xs">
                  Your daily periods, room allocations, and completion status
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                CBSE Academic Track
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayClasses.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      item.status === "now"
                        ? "border-indigo-500 bg-indigo-500/5 shadow-xs"
                        : "border-border/60 bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          item.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : item.status === "now"
                            ? "bg-indigo-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-foreground">{item.subject}</span>
                          <Badge variant="secondary" className="text-[10px] font-medium">
                            {item.class}
                          </Badge>
                          {item.status === "now" && (
                            <Badge className="bg-indigo-600 text-white text-[10px] animate-pulse">
                              NOW
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.time} • {item.room}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {item.status === "completed" ? (
                        <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Done
                        </span>
                      ) : (
                        <Button size="sm" variant={item.status === "now" ? "default" : "outline"} asChild className="h-8 text-xs">
                          <Link href="/attendance">
                            {item.status === "now" ? "Take Roll Call" : "View"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Homework Reviews */}
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Submissions Awaiting Grading</CardTitle>
                <CardDescription className="text-xs">
                  Review student answers, assign marks, and publish feedback
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingGrading.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/20">
                    <div>
                      <span className="font-semibold text-xs text-foreground">{item.title}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {item.class} • Received {item.submitted}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {item.count} papers
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-indigo-600 dark:text-indigo-400">
                        Review →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Homeroom Class 10-A Roster with Student Credential Generation */}
        <div className="space-y-6">
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Advisee Roster (10-A)</CardTitle>
                <CardDescription className="text-xs">
                  Delegated control: generate student login pass
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-xs text-indigo-600 dark:text-indigo-400">
                <Link href="/students">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/70 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-indigo-600/10 text-indigo-600 text-xs font-bold">
                          {student.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate">
                          {student.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          Roll #{student.rollNumber} • {student.attendancePercentage ?? 95}% att.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCredentials(student)}
                        className="h-7 px-2 text-[11px] gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                        title="Generate student login pass"
                      >
                        <KeyRound className="h-3 w-3" />
                        <span>Pass</span>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-[11px]">
                        <Link href={`/students/${student.id}`}>
                          Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Notices & Reminders */}
          <Card className="border-border/80 bg-muted/20">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-indigo-500" />
                <CardTitle className="text-sm font-semibold">Faculty Circulars</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="rounded-lg bg-card p-3 border border-border/80">
                <span className="font-semibold text-foreground">Term 2 Question Papers</span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  Submit mathematics draft question papers to the Academic Coordinator by next Tuesday.
                </p>
              </div>
              <div className="rounded-lg bg-card p-3 border border-border/80">
                <span className="font-semibold text-foreground">Annual STEM Exhibition</span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  Grade 10-A project abstracts approved. Lab 2 reserved for rehearsals this Friday.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Credentials Modal */}
      <StudentCredentialsModal
        open={credsModalOpen}
        onOpenChange={setCredsModalOpen}
        student={selectedStudentForCreds}
      />
    </div>
  )
}

