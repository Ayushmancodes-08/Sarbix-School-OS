
"use client";

import Link from "next/link";
import { BedDouble, DollarSign, KeyRound, UserPlus, Users } from "lucide-react";
import KpiCard from "./KpiCard";
import FeeStatusChart from "./FeeStatusChart";
import HostelOccupancy from "./HostelOccupancy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useData } from "@/lib/data-context";
import AdmissionChart from "./AdmissionChart";
import HostelChart from "./HostelChart";
import { useState } from "react";
import TeacherCredentials from "./TeacherCredentials";
import AdmissionRequests from "./AdmissionRequests";
import JobApplications from "./JobApplications";
import NoticeBoard from "./NoticeBoard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


export default function AdminDashboard() {
    const { students, fees, hostelRooms } = useData();
    const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);

    // Wait for data to load before calculating stats
    if (!students || !fees || !hostelRooms) {
        return <div>Loading dashboard...</div>;
    }

    const totalStudents = students.length;
    const feesDue = fees.filter(f => f.status === 'Due' || f.status === 'Overdue').length;
    const totalCapacity = hostelRooms.reduce((acc, room) => acc + room.capacity, 0);
    const totalOccupants = hostelRooms.reduce((acc, room) => acc + room.occupants.length, 0);
    const occupancyRate = totalCapacity > 0 ? ((totalOccupants / totalCapacity) * 100).toFixed(0) : 0;

  return (
    <>
    <div className="space-y-6">
      <ScrollArea className="w-full">
        <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-4 pb-2">
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Total Students"
              icon={<Users className="h-6 w-6" />}
              value={totalStudents.toString()}
              description="Across all classes"
              onClick={() => alert('Displaying all students...')}
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Fees Due"
              icon={<DollarSign className="h-6 w-6" />}
              value={feesDue.toString()}
              description="Students with pending payments"
              onClick={() => alert('Displaying students with due fees...')}
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Hostel Occupancy"
              icon={<BedDouble className="h-6 w-6" />}
              value={`${occupancyRate}%`}
              description="Current hostel occupancy rate"
              onClick={() => alert('Opening hostel details...')}
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Generate Credentials"
              icon={<KeyRound className="h-6 w-6" />}
              value="New Teacher"
              description="Create login for new staff"
              onClick={() => setIsCredentialsOpen(true)}
            />
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="h-3" />
      </ScrollArea>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScrollArea className="w-full">
            <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
              <NoticeBoard userRole="Admin" />
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-6">
          <ScrollArea className="w-full">
            <div className="min-w-[280px] md:min-w-0">
              <AdmissionRequests />
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
          </ScrollArea>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScrollArea className="w-full">
            <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
              <JobApplications />
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
          </ScrollArea>
        </div>
        <div className="lg:col-span-1">
          <ScrollArea className="w-full">
            <div className="min-w-[280px] md:min-w-0">
              <Card className="flex flex-col items-center justify-center p-6 bg-accent text-accent-foreground h-full">
                <UserPlus className="h-8 w-8 mb-2" />
                <h3 className="text-lg font-bold font-headline text-center mb-2">New Admissions</h3>
                <p className="text-sm text-center mb-4">Generate and manage new student admission forms.</p>
                <Link href="/admissions">
                    <Button>Go to Admissions</Button>
                </Link>
              </Card>
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
          </ScrollArea>
        </div>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 pb-2">
          <div className="min-w-[280px] flex-shrink-0 md:min-w-0">
            <FeeStatusChart />
          </div>
          <div className="min-w-[280px] flex-shrink-0 md:min-w-0">
            <AdmissionChart />
          </div>
          <div className="min-w-[280px] flex-shrink-0 md:min-w-0">
            <HostelChart />
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="h-3" />
      </ScrollArea>

      <ScrollArea className="w-full">
        <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
          <HostelOccupancy />
        </div>
        <ScrollBar orientation="horizontal" className="h-3" />
      </ScrollArea>
    </div>
    <TeacherCredentials open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen} />
    </>
  );
}
