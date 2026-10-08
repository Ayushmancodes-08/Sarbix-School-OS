import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/data/mock-db"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({
      success: true,
      data: {
        authenticated: false,
        user: null,
      },
    })
  }

  const campus = db.campuses.getById(session.campusId)

  return NextResponse.json({
    success: true,
    data: {
      authenticated: true,
      user: {
        id: session.userId,
        campusId: session.campusId,
        campusName: campus?.name ?? "Main Campus",
        campusCode: campus?.code ?? "DCA",
        role: session.role,
        email: session.email,
        fullName: session.fullName,
        avatarUrl: session.avatarUrl,
        permissions: session.permissions,
      },
    },
  })
}
