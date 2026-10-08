"use client";

import { useState } from "react";
import { BookOpen, CalendarCheck, KeyRound, Users } from "lucide-react";
import KpiCard from "./KpiCard";
import AttendanceLogger from "./AttendanceLogger";
import StudentCredentials from "./StudentCredentials";
import Homework from "./Homework";
import { useData } from "@/lib/data-context";
import NoticeBoard from "./NoticeBoard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function TeacherDashboard() {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const { students } = useData();

  // Example data for a specific teacher
  const assignedClasses = ["10A", "11A"];
  const totalStudents = (students || []).filter(s => assignedClasses.includes(`${s.class}${s.section}`)).length;

  return (
    <>
      <div className="overflow-x-auto pb-2 scrollbar-visible mb-6">
        <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Log Attendance"
              icon={<CalendarCheck className="h-6 w-6" />}
              value="Today's Log"
              description="Mark student attendance"
              onClick={() => setIsAttendanceOpen(true)}
              className="bg-card text-card-foreground"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Total Students"
              icon={<Users className="h-6 w-6" />}
              value={totalStudents.toString()}
              description="In your classes"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Manage Homework"
              icon={<BookOpen className="h-6 w-6" />}
              value="Assign & Review"
              description="Click card below"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Generate Credentials"
              icon={<KeyRound className="h-6 w-6" />}
              value="New Student"
              description="Create login for new students"
              onClick={() => setIsCredentialsOpen(true)}
            />
          </div>
        </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto pb-2 scrollbar-visible">
            <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
              <NoticeBoard userRole="Teacher" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="overflow-x-auto pb-2 scrollbar-visible">
            <div className="min-w-[280px] md:min-w-0">
              <Homework isTeacher={true} />
            </div>
          </div>
        </div>
      </div>


      <AttendanceLogger open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen} />
      <StudentCredentials open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen} />
    </>
  );
}
