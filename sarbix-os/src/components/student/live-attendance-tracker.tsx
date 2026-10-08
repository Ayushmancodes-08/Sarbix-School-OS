"use client"

import * as React from "react"
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AttendancePunch {
  day: string
  date: string
  status: "present" | "late" | "absent" | "upcoming"
  time: string
  note?: string
}

interface LiveAttendanceTrackerProps {
  studentName: string
  classGrade: string
  section: string
  attendancePercentage: number
  teacherName: string
  todayStatus: "present" | "late" | "absent" | "excused"
  todayRemarks?: string
}

const WEEKLY_PUNCHES: AttendancePunch[] = [
  { day: "Mon", date: "Oct 05", status: "present", time: "08:24 AM" },
  { day: "Tue", date: "Oct 06", status: "present", time: "08:28 AM" },
  { day: "Wed", date: "Oct 07", status: "present", time: "08:30 AM" },
  { day: "Thu", date: "Oct 08", status: "present", time: "08:32 AM", note: "Homeroom Verified" },
  { day: "Fri", date: "Oct 09", status: "upcoming", time: "Scheduled" },
]

export function LiveAttendanceTracker({
  studentName,
  classGrade,
  section,
  attendancePercentage,
  teacherName,
  todayStatus = "present",
  todayRemarks,
}: LiveAttendanceTrackerProps) {
  return (
    <Card className="border-border/80 shadow-sm overflow-hidden">
      <CardHeader className="p-4 border-b bg-muted/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle className="text-base font-bold font-heading">
                Live Attendance & Homeroom Tracker
              </CardTitle>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                TEACHER SYNCED
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Synchronized with {teacherName} ({classGrade}-{section} Class Teacher)
            </CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground font-mono">
              Term Rate: <strong className="text-foreground">{attendancePercentage}%</strong>
            </span>
            <Badge variant="success" className="text-[10px] uppercase font-mono">
              CBSE Compliant
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Today's Live Punch Status from Teacher */}
        <div
          className={cn(
            "rounded-xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
            todayStatus === "present" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
            todayStatus === "late" && "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
            todayStatus === "absent" && "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400"
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm">
              {todayStatus === "present" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {todayStatus === "late" && <Clock className="h-5 w-5 text-amber-500" />}
              {todayStatus === "absent" && <XCircle className="h-5 w-5 text-rose-500" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-bold text-sm uppercase tracking-wide">
                  Today: {todayStatus}
                </span>
                <span className="text-[11px] font-mono opacity-80">
                  (Period 1 Roll Call)
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                Teacher <strong>{teacherName}</strong> recorded your presence at 08:32 AM. Gate RFID and homeroom register match.
              </p>
              {todayRemarks && (
                <p className="text-[11px] font-medium opacity-90 mt-1">
                  Note: {todayRemarks}
                </p>
              )}
            </div>
          </div>

          <Badge variant="secondary" className="font-mono text-xs w-fit bg-background/80">
            Room 204
          </Badge>
        </div>

        {/* 5-Day Weekly Roll Call Punch Grid */}
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            Weekly Homeroom Punch Grid
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {WEEKLY_PUNCHES.map((punch, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-lg border p-3 text-center transition-all bg-card",
                  punch.status === "present" && "border-emerald-500/20 bg-emerald-500/5",
                  punch.status === "late" && "border-amber-500/20 bg-amber-500/5",
                  punch.status === "upcoming" && "opacity-60 border-dashed"
                )}
              >
                <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                  {punch.day} · {punch.date}
                </span>
                <div className="mt-1 flex items-center justify-center space-x-1">
                  {punch.status === "present" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  )}
                  {punch.status === "late" && (
                    <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                  {punch.status === "upcoming" && (
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  )}
                  <span className={cn(
                    "font-bold text-xs font-mono uppercase",
                    punch.status === "present" && "text-emerald-500",
                    punch.status === "late" && "text-amber-500",
                    punch.status === "upcoming" && "text-muted-foreground"
                  )}>
                    {punch.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground block mt-1">
                  {punch.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Compliance Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t font-mono">
          <span>Official Roster Days: 72/75 Attended</span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Eligible for Term Board Exams</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
