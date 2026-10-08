"use client";

import { BookOpen, CalendarDays, CheckCircle, Percent } from "lucide-react";
import KpiCard from "./KpiCard";
import AttendanceView from "./AttendanceView";
import Homework from "./Homework";
import { useData } from "@/lib/data-context";
import FeePayment from "./FeePayment";
import NoticeBoard from "./NoticeBoard";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function StudentDashboard() {
  const { students, studentAttendance, fees, hostelFees } = useData();
  const studentId = sessionStorage.getItem("studentId");
  
  if (!students || !studentAttendance || !fees || !hostelFees) {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-80" />
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
             <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="h-96" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-96" />
                </div>
            </div>
        </div>
    );
  }

  const loggedInStudent = students.find(s => s.id === studentId); 

  if (!loggedInStudent) {
    return <p>Student not found. Please log in again.</p>;
  }

  const attendanceData = studentAttendance.find(sa => sa.studentId === loggedInStudent.id);
  const totalPresent = attendanceData?.records.filter(r => r.status === 'Present').length || 0;
  const totalAbsent = attendanceData?.records.filter(r => r.status === 'Absent').length || 0;
  const totalWorkingDays = totalPresent + totalAbsent;
  const attendancePercentage = totalWorkingDays > 0 ? (totalPresent / totalWorkingDays) * 100 : 100;

  const tuitionFee = fees.find(fee => fee.studentId === loggedInStudent.id);
  const hostelFee = hostelFees.find(fee => fee.studentId === loggedInStudent.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-headline">Welcome, {loggedInStudent.name}!</h2>
        <p className="text-muted-foreground">Here's your dashboard for today.</p>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-visible">
        <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Attendance"
              icon={<Percent className="h-6 w-6" />}
              value={`${attendancePercentage.toFixed(1)}%`}
              description="Your overall attendance"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Days Present"
              icon={<CheckCircle className="h-6 w-6" />}
              value={totalPresent.toString()}
              description="Total classes attended"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Days Absent"
              icon={<CalendarDays className="h-6 w-6" />}
              value={totalAbsent.toString()}
              description="Total classes missed"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Homework"
              icon={<BookOpen className="h-6 w-6" />}
              value="Check list"
              description="View pending assignments"
            />
          </div>
        </div>
      </div>

       <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto pb-2 scrollbar-visible">
            <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
              <NoticeBoard userRole="Student" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="overflow-x-auto pb-2 scrollbar-visible">
            <div className="min-w-[280px] md:min-w-0">
              <AttendanceView studentId={loggedInStudent.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {tuitionFee && (
          <div className="overflow-x-auto pb-2 scrollbar-visible">
            <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
              <FeePayment fee={tuitionFee} feeType="tuition" title="Tuition Fee Status" />
            </div>
          </div>
        )}
        {hostelFee && (
          <div className="overflow-x-auto pb-2 scrollbar-visible">
            <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
              <FeePayment fee={hostelFee} feeType="hostel" title="Hostel Fee Status" />
            </div>
          </div>
        )}
        <div className="overflow-x-auto pb-2 scrollbar-visible">
          <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
            <Homework studentClass={loggedInStudent.class} studentSection={loggedInStudent.section} />
          </div>
        </div>
      </div>
    </div>
  );
}
