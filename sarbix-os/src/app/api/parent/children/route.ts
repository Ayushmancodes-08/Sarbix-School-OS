import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

export async function GET() {
  try {
    const session = await requireAuth()
    const rawChildren = db.parents.getChildren(session.email)

    const children = rawChildren.map((s) => {
      const studentAttendance = db.attendance.getByStudent(s.id)
      const todayRecord = studentAttendance.find((r) => r.date === "2026-10-08")
      const rawInvoices = db.fees.getByStudent(s.id)
      const invoices = rawInvoices.map((inv) => ({
        id: inv.id,
        title: inv.feeHead || "Term Tuition & Composite Fee",
        amount: inv.balanceAmount ?? (inv.amount || 0),
        dueDate: inv.dueDate,
        status: inv.status,
      }))

      const homework = db.academics.getHomework(s.classGrade, s.section).map((hw) => ({
        id: hw.id,
        subject: hw.subject,
        title: hw.title,
        dueDate: hw.dueDate,
        status: hw.submissionStatus,
      }))

      return {
        id: s.id,
        name: `${s.firstName} ${s.lastName}`,
        admissionNumber: s.admissionNumber,
        grade: s.classGrade || "Grade 10",
        section: s.section || "A",
        rollNumber: s.rollNumber || "10A-14",
        todayAttendance: (todayRecord?.status?.toUpperCase() || "PRESENT") as "PRESENT" | "ABSENT" | "LATE",
        attendancePercentage: s.attendancePercentage || 95.0,
        gpa: s.academicGpa || 3.9,
        pendingFee: s.pendingFeeAmount !== undefined ? s.pendingFeeAmount : 18500,
        busRoute: s.busRouteNumber || "Route 04 (South Delhi Express)",
        classTeacher: s.classGrade === "Grade 10" ? "Mr. Rajesh Verma" : "Ms. Shalini Saxena",
        invoices:
          invoices.length > 0
            ? invoices
            : [
                {
                  id: `inv-${s.id}-term1`,
                  title: "Term II Tuition & STEM Lab",
                  amount: s.pendingFeeAmount !== undefined ? s.pendingFeeAmount : 18500,
                  dueDate: "2026-10-31",
                  status: (s.pendingFeeAmount ?? 18500) > 0 ? "partial" : "paid",
                },
              ],
        homework,
      }
    })

    return NextResponse.json({
      success: true,
      data: { children },
    })
  } catch (error) {
    console.error("Parent children API error:", error)
    return NextResponse.json(
      { success: false, error: { message: "Failed to retrieve parent children telemetry" } },
      { status: 401 }
    )
  }
}

