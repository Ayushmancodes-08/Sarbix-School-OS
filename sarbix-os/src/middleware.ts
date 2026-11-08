import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = process.env.SESSION_SECRET || "sarbix-super-secure-jwt-secret-key-production-grade-256bit!"
const encodedKey = new TextEncoder().encode(SECRET_KEY)

interface SessionPayload {
  userId: string
  role: string
  campusId: string
  permissions: string[]
}

const ROLE_HOMES: Record<string, string> = {
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
  accountant: "/finance",
  transport_manager: "/transport",
  principal: "/overview",
  super_admin: "/overview",
  branch_admin: "/overview",
}

// Role restriction rules for routes
const ROLE_RESTRICTIONS: Record<string, string[]> = {
  "/audit": ["super_admin", "principal"],
  "/settings": ["super_admin", "principal"],
  "/admissions": ["super_admin", "principal", "branch_admin"],
  "/transport": ["super_admin", "principal", "transport_manager", "parent"],
  "/teacher": ["super_admin", "principal", "teacher"],
  "/student": ["super_admin", "principal", "student"],
  "/parent": ["super_admin", "principal", "parent"],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow static files, api routes, and public apply routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname.startsWith("/apply") ||
    pathname === "/login"
  ) {
    return NextResponse.next()
  }

  const token = req.cookies.get("sarbix_session")?.value

  // If not logged in and accessing protected dashboard routes, redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const { payload } = await jwtVerify(token, encodedKey)
    const session = payload as unknown as SessionPayload
    const userRole = session.role

    // Redirect root / to role home
    if (pathname === "/") {
      const targetHome = ROLE_HOMES[userRole] || "/overview"
      return NextResponse.redirect(new URL(targetHome, req.url))
    }

    // Role-specific redirect from generic /overview to dedicated role workplace
    if (pathname === "/overview") {
      if (userRole === "teacher") {
        return NextResponse.redirect(new URL("/teacher", req.url))
      } else if (userRole === "student") {
        return NextResponse.redirect(new URL("/student", req.url))
      } else if (userRole === "parent") {
        return NextResponse.redirect(new URL("/parent", req.url))
      } else if (userRole === "accountant") {
        return NextResponse.redirect(new URL("/finance", req.url))
      } else if (userRole === "transport_manager") {
        return NextResponse.redirect(new URL("/transport", req.url))
      }
    }

    // Strict URL check for gated routes (exact segment match to prevent /student matching /students)
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_RESTRICTIONS)) {
      if (pathname === routePrefix || pathname.startsWith(`${routePrefix}/`)) {
        if (!allowedRoles.includes(userRole)) {
          const fallback = ROLE_HOMES[userRole] || "/overview"
          return NextResponse.redirect(new URL(fallback, req.url))
        }
      }
    }

    return NextResponse.next()
  } catch {
    // If token is invalid or corrupted, clear and redirect to login
    const response = NextResponse.redirect(new URL("/login", req.url))
    response.cookies.delete("sarbix_session")
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

