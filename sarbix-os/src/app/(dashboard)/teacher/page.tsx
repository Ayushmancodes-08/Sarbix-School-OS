import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { TeacherDashboardClient } from "./teacher-dashboard-client"

export default async function TeacherDashboardPage() {
  const session = await requirePermission("attendance:mark")

  const students = db.students
    .getAll(session.campusId)
    .filter((s) => s.classGrade === "Grade 10" && s.section === "A")
    .map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      rollNumber: s.rollNumber || "10A-01",
      classGrade: s.classGrade || "Grade 10",
      section: s.section || "A",
      attendancePercentage: s.attendancePercentage,
    }))

  const teacherUser = db.users.getById(session.userId)
  const teacherName = teacherUser ? `${teacherUser.firstName} ${teacherUser.lastName}` : "Rajesh Verma"

  return (
    <TeacherDashboardClient
      teacherName={teacherName}
      students={students}
    />
  )
}
