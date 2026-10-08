import { getSession, type JWTSessionPayload } from "./session"
import type { PermissionKey, UserRole } from "@/types"
import { NextResponse } from "next/server"

export class AuthError extends Error {
  status: number
  constructor(message: string, status = 401) {
    super(message)
    this.name = "AuthError"
    this.status = status
  }
}

export async function requireAuth(): Promise<JWTSessionPayload> {
  const session = await getSession()
  if (!session) {
    throw new AuthError("Authentication required. Please sign in.", 401)
  }
  return session
}

export async function requirePermission(permission: PermissionKey): Promise<JWTSessionPayload> {
  const session = await requireAuth()

  // Super admin always has access
  if (session.role === "super_admin") {
    return session
  }

  if (!session.permissions || !session.permissions.includes(permission)) {
    throw new AuthError(
      `Forbidden: You lack the required permission: '${permission}'`,
      403
    )
  }

  return session
}

export async function requireRole(allowedRoles: UserRole[]): Promise<JWTSessionPayload> {
  const session = await requireAuth()

  if (session.role === "super_admin") {
    return session
  }

  if (!allowedRoles.includes(session.role)) {
    throw new AuthError(
      `Forbidden: Your role '${session.role}' is not authorized to access this resource.`,
      403
    )
  }

  return session
}

export async function requireCampus(campusId: string): Promise<JWTSessionPayload> {
  const session = await requireAuth()

  if (session.role === "super_admin") {
    return session
  }

  if (session.campusId !== campusId) {
    throw new AuthError(
      "Forbidden: Access denied to tenant/campus cross-boundary data.",
      403
    )
  }

  return session
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.status === 401 ? "UNAUTHORIZED" : "FORBIDDEN",
          message: error.message,
        },
      },
      { status: error.status }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected authorization error occurred.",
      },
    },
    { status: 500 }
  )
}
