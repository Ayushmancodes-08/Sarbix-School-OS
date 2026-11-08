import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { redirect } from "next/navigation"
import { OverviewClient } from "./overview-client"

export default async function OverviewPage() {
  const session = await requirePermission("overview:view")

  // Strict Role Redirection: Non-executive roles land on their dedicated tailored workspace
  if (session.role === "teacher") {
    redirect("/teacher")
  } else if (session.role === "student") {
    redirect("/student")
  } else if (session.role === "parent") {
    redirect("/parent")
  } else if (session.role === "accountant") {
    redirect("/finance")
  } else if (session.role === "transport_manager") {
    redirect("/transport")
  }

  const students = db.students.getAll(session.campusId)
  const invoices = db.fees.getAll(session.campusId)
  const auditLogs = db.audit.getAll(session.campusId)
  const vehicles = db.transport.getVehicles(session.campusId)
  const users = db.users.getAll()
  const jobApplications = db.jobApplications.getAll()

  const facultyList = users
    .filter((u) => u.role === "teacher")
    .map((u) => ({
      id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || "Faculty Member",
      email: u.email,
      role: "Faculty Member",
    }))

  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0)
  const totalPending = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0)
  const fleetActive = vehicles.filter((v) => v.status === "ACTIVE").length

  const formattedInvoices = invoices.map((inv) => ({
    id: inv.id,
    studentName: inv.studentName || "Student",
    classGrade: inv.classGrade || "Grade 10",
    feeHead: inv.feeHead || "Tuition",
    balanceAmount: inv.balanceAmount,
    dueDate: new Date(inv.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
  }))

  const formattedAuditLogs = auditLogs.map((log) => ({
    id: log.id,
    action: log.action,
    resource: log.resource || "system",
    userEmail: log.userEmail || "system@sarbix.edu",
    createdAt: log.createdAt,
    timestamp: log.timestamp,
    details: log.details || {},
  }))

  return (
    <OverviewClient
      session={{
        email: session.email,
        role: session.role,
        campusId: session.campusId,
      }}
      kpis={{
        totalStudents: students.length,
        avgAttendance: 94.8,
        totalCollected,
        totalPending,
        fleetActive,
      }}
      facultyList={facultyList}
      jobApplications={jobApplications}
      invoices={formattedInvoices}
      auditLogs={formattedAuditLogs}
    />
  )
}
