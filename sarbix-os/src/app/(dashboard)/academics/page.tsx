import * as React from "react"
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  FileText,
  CheckCircle,
  AlertCircle,
  MapPin,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

export default async function AcademicsPage() {
  const session = await requirePermission("academics:view")

  const timetableSlots = db.timetable.getByClass("Grade 10", "A")
  const homeworkItems = db.academics.getHomework("Grade 10", "A")
  const exams = db.academics.getExams("Grade 10")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Academics & Master Schedule
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px]">
              TERM 1 · 2026-27
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Syllabus orchestration, weekly timetable matrix, homework deliverables, and examination schedules.
          </p>
        </div>
      </div>

      <Tabs defaultValue="timetable" className="space-y-6">
        <div className="overflow-x-auto pb-1 max-w-full">
          <TabsList className="bg-muted/80 p-1 inline-flex w-max sm:w-auto">
            <TabsTrigger value="timetable" className="gap-2 text-xs whitespace-nowrap">
              <Calendar className="h-3.5 w-3.5" />
              <span>Class Timetable Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="homework" className="gap-2 text-xs whitespace-nowrap">
              <FileText className="h-3.5 w-3.5" />
              <span>Homework & Assignments ({homeworkItems.length})</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="gap-2 text-xs whitespace-nowrap">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Examination Calendar</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Timetable Tab */}
        <TabsContent value="timetable" className="space-y-4">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold font-heading">
                    Grade 10-A Timetable Matrix
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Room 204 (Academic Wing West) · Class Teacher: Mr. Rajesh Verma
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  Monday to Friday
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {timetableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col justify-between rounded-lg border border-border/80 bg-card p-4 hover:border-indigo-500/50 hover:shadow-sm transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          Period {slot.periodNumber}
                        </span>
                        <div className="flex items-center space-x-1 text-[11px] font-mono text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                      </div>
                      <h4 className="mt-2 font-heading text-sm font-semibold text-foreground">
                        {slot.subjectName}
                      </h4>
                      <div className="mt-1 flex items-center space-x-1.5 text-xs text-muted-foreground">
                        <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{slot.teacherName}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-[11px] text-muted-foreground font-medium">
                        <MapPin className="h-3 w-3 text-indigo-500" />
                        <span>{slot.roomNumber}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {slot.subjectCode}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Homework Tab */}
        <TabsContent value="homework" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeworkItems.map((hw) => (
              <Card key={hw.id} className="border-border/80 shadow-sm flex flex-col justify-between">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {hw.subject}
                    </Badge>
                    <Badge
                      variant={hw.submissionStatus === "SUBMITTED" ? "success" : "warning"}
                      className="text-[10px] uppercase font-mono"
                    >
                      {hw.submissionStatus}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold font-heading mt-2">
                    {hw.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {hw.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="mt-2 space-y-1.5 text-xs text-muted-foreground border-t pt-2">
                    <div className="flex justify-between">
                      <span>Assigned by:</span>
                      <span className="font-medium text-foreground">{hw.teacherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span className="font-mono font-medium text-rose-500">{hw.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Marks:</span>
                      <span className="font-mono font-bold text-foreground">{hw.maxScore} pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          {exams.map((ex) => (
            <Card key={ex.id} className="border-border/80 shadow-sm">
              <CardHeader className="p-4 border-b bg-muted/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold font-heading">
                      {ex.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Window: {ex.startDate} to {ex.endDate} · Target Grade: {ex.classGrade}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 font-mono text-xs">
                    {ex.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="divide-y divide-border">
                  {ex.subjects.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">Date: {sub.date}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-foreground">{sub.maxMarks}</span>
                        <span className="text-xs text-muted-foreground"> Max Marks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
