import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

const demandSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const parsed = demandSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid fee collection demand payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const { invoiceId, amount, dueDate, notes } = parsed.data
    const updatedInvoice = db.fees.updateDemandNotice(invoiceId, amount, dueDate)

    if (!updatedInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Invoice not found.",
          },
        },
        { status: 404 }
      )
    }

    // Log the audit event
    db.audit.log({
      userId: session.userId,
      userEmail: session.email,
      userRole: session.role,
      campusId: session.campusId,
      action: "DEMAND_NOTICE",
      resource: "finance_invoice",
      resourceId: invoiceId,
      details: {
        invoiceNumber: updatedInvoice.invoiceNumber,
        demandedAmount: amount,
        dueDate,
        studentName: updatedInvoice.studentName,
        notes,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Due reminder of ₹${amount.toLocaleString()} dispatched to ${updatedInvoice.studentName} and parent with due date ${dueDate}`,
      data: updatedInvoice,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Failed to issue demand" } },
      { status: 500 }
    )
  }
}

