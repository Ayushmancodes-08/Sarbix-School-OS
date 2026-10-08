import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

const paymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  paymentMethod: z.enum(["UPI", "NET_BANKING", "CARD", "CASH", "CHEQUE"]).default("UPI"),
})

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const parsed = paymentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid payment payload",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const { invoiceId, amount, paymentMethod } = parsed.data
    const updatedInvoice = db.fees.recordPayment(invoiceId, amount)

    if (!updatedInvoice) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Invoice not found or already settled.",
          },
        },
        { status: 404 }
      )
    }

    const receiptNumber = `RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`

    // Log the immutable audit event
    db.audit.log({
      userId: session.userId,
      userEmail: session.email,
      userRole: session.role,
      campusId: session.campusId,
      action: "FEE_PAYMENT",
      resource: "finance_receipt",
      resourceId: invoiceId,
      details: {
        receiptNumber,
        amount,
        paymentMethod,
        remainingBalance: updatedInvoice.balanceAmount,
        invoiceNumber: updatedInvoice.invoiceNumber,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        invoice: updatedInvoice,
        receiptNumber,
      },
    })
  } catch (error: any) {
    console.error("Payment API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Failed to process fee transaction." },
      },
      { status: 500 }
    )
  }
}
