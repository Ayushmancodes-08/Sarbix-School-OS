"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import Header from "@/components/erp/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileImageUpload from "@/components/erp/ProfileImageUpload";

export default function SettingsPage() {
  const router = useRouter();
  const { students, teachers } = useData();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");

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

  useEffect(() => {
    if (student) {
      setAvatarUrl(student.avatar);
    } else if (teacher && teacher.avatar) {
      setAvatarUrl(teacher.avatar);
    }
  }, [student, teacher]);

  const handleAvatarUpload = (newUrl: string) => {
    setAvatarUrl(newUrl);
  };

  const renderSettingsContent = () => {
    if (isLoading) {
      return <Skeleton className="h-96 w-full" />;
    }

    if (userRole === 'Student' && student) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile Settings</CardTitle>
            <CardDescription>Manage your profile picture and preferences</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ProfileImageUpload
              studentId={student.id}
              currentAvatar={avatarUrl || student.avatar}
              onUploadSuccess={handleAvatarUpload}
              userType="student"
            />
          </CardContent>
        </Card>
      );
    }

    if (userRole === 'Teacher' && teacher) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile Settings</CardTitle>
            <CardDescription>Manage your profile picture and preferences</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ProfileImageUpload
              studentId={teacher.id}
              currentAvatar={avatarUrl || teacher.avatar || "https://picsum.photos/seed/teacher/200/200"}
              onUploadSuccess={handleAvatarUpload}
              userType="teacher"
            />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Settings</CardTitle>
          <CardDescription>Settings for this role are not available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No settings available for your role.</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          {renderSettingsContent()}
        </div>
      </main>
    </div>
  );
}
