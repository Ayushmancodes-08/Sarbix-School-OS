import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/data/mock-db"
import { supabase, getSupabaseStudent, updateSupabaseStudent } from "@/lib/supabase"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  
  // Try to fetch from Supabase
  const supabaseStudent = await getSupabaseStudent(id)
  
  // Fallback / merge with local db
  const localStudent = db.students.getById(id)

  if (!supabaseStudent && !localStudent) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    source: supabaseStudent ? "supabase_live" : "local_cache",
    student: supabaseStudent || localStudent,
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  // 1. Update in Supabase
  const supabaseUpdated = await updateSupabaseStudent(id, {
    class_grade: body.classGrade,
    section: body.section,
    parent_phone: body.parentPhone,
    status: body.status,
    attendance_percentage: body.attendancePercentage ? Number(body.attendancePercentage) : undefined,
    pending_fee_amount: body.pendingFeeAmount ? Number(body.pendingFeeAmount) : undefined,
  })

  // 2. Also update local DB
  const localStudent = db.students.getById(id)
  if (localStudent) {
    if (body.classGrade !== undefined) localStudent.classGrade = body.classGrade
    if (body.section !== undefined) localStudent.section = body.section
    if (body.parentPhone !== undefined) localStudent.parentPhone = body.parentPhone
    if (body.status !== undefined) localStudent.status = body.status
    if (body.attendancePercentage !== undefined) localStudent.attendancePercentage = Number(body.attendancePercentage)
    if (body.pendingFeeAmount !== undefined) localStudent.pendingFeeAmount = Number(body.pendingFeeAmount)
    db.students.update(id, localStudent)
  }

  // Record audit log
  db.audit.log({
    campusId: session.campusId,
    userId: session.userId,
    userRole: session.role,
    action: "UPDATE_STUDENT_DOSSIER",
    resource: `student:${id}`,
    details: {
      updatedFields: Object.keys(body),
      supabaseSynced: !!supabaseUpdated,
    },
    ipAddress: "127.0.0.1",
  })

  return NextResponse.json({
    success: true,
    supabaseSynced: !!supabaseUpdated,
    data: supabaseUpdated || localStudent,
    message: "Student dossier updated successfully across Supabase & Institutional Store",
  })
}
