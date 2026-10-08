
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import Header from "@/components/erp/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const router = useRouter();
  const { students, teachers, admissionApplications, jobApplications } = useData();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    const sId = sessionStorage.getItem("studentId");
    const tId = sessionStorage.getItem("teacherId");
    
    if (!role) {
      router.push("/login");
    } else {
      setUserRole(role);
      setStudentId(sId);
      setTeacherId(tId);
      setIsLoading(false);
    }
  }, [router]);

  const student = students?.find(s => s.id === studentId);
  const teacher = teachers?.find(t => t.id === teacherId);
  
  // Find admission application for student
  const admissionApp = admissionApplications?.find(app => 
    app.studentName === student?.name && app.status === 'Approved'
  );
  
  // Find job application for teacher
  const jobApp = jobApplications?.find(app => 
    app.fullName === teacher?.name && app.status === 'Accepted'
  );
  
  const renderProfileContent = () => {
    if (isLoading) {
      return <Skeleton className="h-96 w-full" />;
    }
    
    if (userRole === 'Student' && student) {
      return (
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback className="text-4xl">{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline mt-4">{student.name}</CardTitle>
            <CardDescription>Class {student.class}{student.section} | Roll No: {student.rollNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            <div>
              <h3 className="text-lg font-semibold font-headline mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Admission Details
              </h3>
              {admissionApp ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Student Name</p>
                      <p className="text-muted-foreground">{admissionApp.studentName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Grade Applied For</p>
                      <p className="text-muted-foreground">Grade {admissionApp.applyingForGrade}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Parent/Guardian</p>
                      <p className="text-muted-foreground">{admissionApp.parentName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Parent Email</p>
                      <p className="text-muted-foreground">{admissionApp.parentEmail}</p>
                    </div>
                  </div>
                  {admissionApp.parentPhone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Parent Phone</p>
                        <p className="text-muted-foreground">{admissionApp.parentPhone}</p>
                      </div>
                    </div>
                  )}
                  {admissionApp.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">{admissionApp.address}</p>
                      </div>
                    </div>
                  )}
                  {admissionApp.dateOfBirth && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Date of Birth</p>
                        <p className="text-muted-foreground">{admissionApp.dateOfBirth}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Gender</p>
                      <p className="text-muted-foreground capitalize">{admissionApp.gender}</p>
                    </div>
                  </div>
                  {admissionApp.previousSchool && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Previous School</p>
                        <p className="text-muted-foreground">{admissionApp.previousSchool}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Application Date</p>
                      <p className="text-muted-foreground">{admissionApp.date}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No admission details found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (userRole === 'Teacher' && teacher) {
      return (
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage src={teacher.avatar || "https://picsum.photos/seed/teacher/200/200"} alt={teacher.name} />
              <AvatarFallback className="text-4xl">{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline mt-4">{teacher.name}</CardTitle>
            <CardDescription>{teacher.subject} Teacher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            <div>
              <h3 className="text-lg font-semibold font-headline mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Application Details
              </h3>
              {jobApp ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-muted-foreground">{jobApp.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{jobApp.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">{jobApp.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Subject</p>
                      <p className="text-muted-foreground capitalize">{jobApp.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-muted-foreground">{jobApp.experience} years</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Application Date</p>
                      <p className="text-muted-foreground">{jobApp.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Resume/CV</p>
                      <p className="text-muted-foreground whitespace-pre-wrap">{jobApp.resume}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No job application details found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    if (userRole === 'Admin' || userRole === 'Finance') {
      return (
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src="https://picsum.photos/seed/110/200/200" alt="User Avatar" />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline mt-4">{userRole} Profile</CardTitle>
            <CardDescription>User ID: {sessionStorage.getItem('userRole')?.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">Profile details for this role are not available.</p>
          </CardContent>
        </Card>
      );
    }

    return <p>Invalid user role.</p>;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          {renderProfileContent()}
        </div>
      </main>
    </div>
  );
}
