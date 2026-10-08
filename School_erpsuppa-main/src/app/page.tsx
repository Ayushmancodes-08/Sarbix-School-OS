"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/erp/AdminDashboard";
import TeacherDashboard from "@/components/erp/TeacherDashboard";
import StudentDashboard from "@/components/erp/StudentDashboard";
import FinanceDashboard from "@/components/erp/FinanceDashboard";
import Header from "@/components/erp/Header";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role;

  const renderDashboard = () => {
    switch(userRole) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Teacher':
        return <TeacherDashboard />;
      case 'Student':
        return <StudentDashboard />;
      case 'Finance':
        return <FinanceDashboard />;
      default:
        // For simplicity, redirect to login if role is invalid
        router.push('/login');
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
}
