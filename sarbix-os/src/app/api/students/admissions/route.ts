import { NextResponse } from "next/server"
import { z } from "zod"
import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

const admissionSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(4, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.string().min(1, "Blood group is required"),
  classGrade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  parentName: z.string().min(2, "Guardian name is required"),
  parentEmail: z.string().email("Valid guardian email required"),
  parentPhone: z.string().min(8, "Valid phone number required"),
  address: z.string().min(5, "Residential address required"),
  emergencyContactName: z.string().min(2, "Emergency contact name required"),
  emergencyContactPhone: z.string().min(8, "Emergency contact phone required"),
  busRouteNumber: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await requirePermission("students:create")
    const body = await request.json()
    const parsed = admissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid student admission input",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const data = parsed.data
    const newId = `std-${Date.now()}`
    const admissionNumber = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const rollNumber = `${data.classGrade.replace("Grade ", "")}${data.section}-${Math.floor(10 + Math.random() * 89)}`

    const newStudent = db.students.create({
      id: newId,
      campusId: session.campusId,
      admissionNumber,
      rollNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      classGrade: data.classGrade,
      section: data.section,
      status: "active",
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      address: data.address,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      attendancePercentage: 100.0,
      pendingFeeAmount: 35000,
      academicGpa: 4.0,
      busRouteNumber: data.busRouteNumber || "Self Commute",
    })

    // Log the audit event
    db.audit.log({
      userId: session.userId,
      userEmail: session.email,
      userRole: session.role,
      campusId: session.campusId,
      action: "CREATE",
      resource: "students",
      resourceId: newId,
      details: { admissionNumber, studentName: `${data.firstName} ${data.lastName}` },
    })

    return NextResponse.json({
      success: true,
      data: {
        student: newStudent,
      },
    })
  } catch (error: any) {
    if (error?.status === 403 || error?.status === 401) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: error.message } },
        { status: error.status }
      )
    }

    console.error("Admissions API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Failed to process student admission." },
      },
      { status: 500 }
    )
  }
}
