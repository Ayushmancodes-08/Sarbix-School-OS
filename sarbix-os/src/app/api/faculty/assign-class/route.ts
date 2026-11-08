import { NextResponse } from "next/server"
import { z } from "zod"
import { requireRole } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

const assignSchema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  classGrade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  subject: z.string().min(1, "Subject is required"),
  isHomeroom: z.boolean().default(false),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")

    if (teacherId) {
      const assignments = db.teacherAssignments.getByTeacherId(teacherId)
      return NextResponse.json({ success: true, data: assignments })
    }

    const assignments = db.teacherAssignments.getAll()
    return NextResponse.json({ success: true, data: assignments })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to fetch assignments" } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(["principal", "super_admin", "branch_admin"])
    const body = await request.json()
    const parsed = assignSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid class allocation payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const { teacherId, classGrade, section, subject, isHomeroom } = parsed.data
    const teacherUser = db.users.getById(teacherId)
    const teacherName = teacherUser ? `${teacherUser.firstName} ${teacherUser.lastName}` : "Faculty Member"
    const teacherEmail = teacherUser?.email || "faculty@sarbix.edu"

    const newAssignment = db.teacherAssignments.assign({
      id: `ta-${Date.now()}`,
      teacherId,
      teacherName,
      teacherEmail,
      classGrade,
      section,
      subject,
      isHomeroom,
    })

    db.audit.log({
      userId: session.userId,
      userEmail: session.email,
      userRole: session.role,
      campusId: session.campusId,
      action: "CREATE",
      resource: "teacher_class_assignment",
      resourceId: newAssignment.id,
      details: { teacherName, classGrade, section, subject, isHomeroom },
      ipAddress: "127.0.0.1",
    })

    return NextResponse.json({
      success: true,
      message: `Assigned ${subject} (${classGrade}-${section}) to ${teacherName}`,
      data: newAssignment,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Unauthorized allocation" } },
      { status: error.status || 401 }
    )
  }
}

