import { NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/auth/session"

export async function POST() {
  await clearSessionCookie()
  return NextResponse.json({
    success: true,
    data: { message: "Successfully signed out." },
  })
}
