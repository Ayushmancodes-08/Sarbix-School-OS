import { NextResponse } from "next/server"
import { z } from "zod"
import { db, ROLE_PERMISSIONS } from "@/lib/data/mock-db"
import { verifyPassword } from "@/lib/auth/password"
import { createSessionToken, setSessionCookie } from "@/lib/auth/session"

const loginSchema = z.object({
  email: z.string().email("Please provide a valid institutional email"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input parameters",
            details: result.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const { email, password } = result.data
    const user = db.users.getByEmail(email)

    if (!user) {
      // Return constant time error message to prevent account enumeration
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password credentials.",
          },
        },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_DISABLED",
            message: "This account has been deactivated. Please contact your administrator.",
          },
        },
        { status: 403 }
      )
    }

    const isMatch = await verifyPassword(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password credentials.",
          },
        },
        { status: 401 }
      )
    }

    // Role-resolved server-side permissions
    const userRole = user.role || "super_admin"
    const campusId = user.campusId || "campus-delhi-01"
    const permissions = ROLE_PERMISSIONS[userRole] || []
    const fullName = user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email

    const token = await createSessionToken({
      userId: user.id,
      campusId,
      role: userRole,
      email: user.email,
      fullName,
      permissions,
      avatarUrl: user.avatarUrl,
    })

    await setSessionCookie(token)

    // Log the audit event
    db.audit.log({
      userId: user.id,
      userEmail: user.email,
      userRole,
      campusId,
      action: "LOGIN",
      resource: "auth",
      resourceId: user.id,
      details: { client: "web-app", timestamp: new Date().toISOString() },
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          campusId,
          role: userRole,
          email: user.email,
          fullName,
          avatarUrl: user.avatarUrl,
          permissions,
        },
      },
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred during authentication.",
        },
      },
      { status: 500 }
    )
  }
}
