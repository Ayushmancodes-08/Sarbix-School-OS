import { NextResponse } from "next/server"
import { z } from "zod"
import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { recordSupabaseAttendance } from "@/lib/supabase"

const attendanceBatchSchema = z.object({
  date: z.string(),
  classGrade: z.string(),
  section: z.string(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["present", "absent", "late", "excused"]),
      remarks: z.string().optional(),
    })
  ),
})

export async function POST(request: Request) {
  try {
    const session = await requirePermission("attendance:mark")
    const body = await request.json()
    const parsed = attendanceBatchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid attendance batch payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const { date, classGrade, section, records } = parsed.data

    const formattedRecords = records.map((r, i) => ({
      id: `att-${Date.now()}-${i}`,
      studentId: r.studentId,
      campusId: session.campusId,
      classGrade,
      section,
      date,
      status: r.status,
      remarks: r.remarks,
      markedBy: session.userId,
    }))

    db.attendance.upsert(formattedRecords)

    // Sync to Supabase in parallel
    await recordSupabaseAttendance(
      formattedRecords.map((r) => ({
        id: r.id,
        student_id: r.studentId,
        campus_id: r.campusId,
        class_grade: r.classGrade,
        section: r.section,
        date: r.date,
        status: r.status,
        remarks: r.remarks,
        marked_by: r.markedBy,
      }))
    ).catch((err) => console.warn("Supabase attendance sync background notice:", err))

    // Audit log
    db.audit.log({
      userId: session.userId,
      userEmail: session.email,
      userRole: session.role,
      campusId: session.campusId,
      action: "UPDATE",
      resource: "attendance",
      resourceId: `${classGrade}-${section}-${date}`,
      details: {
        recordCount: records.length,
        present: records.filter((r) => r.status === "present").length,
        absent: records.filter((r) => r.status === "absent").length,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: `Attendance for ${classGrade}-${section} recorded successfully.`,
        count: formattedRecords.length,
      },
    })
  } catch (error: any) {
    if (error?.status === 403 || error?.status === 401) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: error.message } },
        { status: error.status }
      )
    }

    console.error("Attendance API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Failed to record attendance." },
      },
      { status: 500 }
    )
  }
}
