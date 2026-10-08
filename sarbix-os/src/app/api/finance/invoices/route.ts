import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { createSupabaseInvoice } from "@/lib/supabase"
import type { FeeInvoice } from "@/types"

const createInvoiceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  feeHead: z.string().min(2, "Fee head is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
})

export async function GET() {
  try {
    const session = await requireAuth()
    const invoices = db.fees.getAll(session.campusId)
    return NextResponse.json({ success: true, data: invoices })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Unauthorized" } },
      { status: error.status || 401 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const parsed = createInvoiceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid invoice payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const { studentId, feeHead, amount, dueDate } = parsed.data
    const student = db.students.getById(studentId)

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Student record not found" },
        },
        { status: 404 }
      )
    }

    const invoiceNumber = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`
    const newInvoice: FeeInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      studentId: student.id,
      campusId: session.campusId,
      studentName: `${student.firstName} ${student.lastName}`,
      classGrade: `${student.classGrade}-${student.section}`,
      feeHead,
      amount,
      totalAmount: amount,
      paidAmount: 0,
      balanceAmount: amount,
      dueDate,
      status: "due",
      createdAt: new Date().toISOString(),
    }

    db.fees.createInvoice(newInvoice)

    // Sync to Supabase in parallel
    await createSupabaseInvoice({
      id: newInvoice.id,
      invoice_number: newInvoice.invoiceNumber,
      student_id: newInvoice.studentId,
      campus_id: newInvoice.campusId,
      student_name: newInvoice.studentName || `${student.firstName} ${student.lastName}`,
      class_grade: newInvoice.classGrade || `${student.classGrade}-${student.section}`,
      fee_head: newInvoice.feeHead || feeHead,
      amount: Number(newInvoice.amount || amount),
      due_date: newInvoice.dueDate || dueDate,
      status: "unpaid",
    }).catch((err) => console.warn("Supabase invoice sync notice:", err))

    // Audit log
    db.audit.log({
      userId: session.userId,
      userEmail: session.email,
      userRole: session.role,
      campusId: session.campusId,
      action: "CREATE",
      resource: "finance_invoice",
      resourceId: newInvoice.id,
      details: {
        invoiceNumber,
        studentName: newInvoice.studentName,
        feeHead,
        amount,
        dueDate,
      },
    })

    return NextResponse.json({
      success: true,
      data: newInvoice,
    })
  } catch (error: any) {
    console.error("Create Invoice API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Failed to generate invoice." },
      },
      { status: 500 }
    )
  }
}
