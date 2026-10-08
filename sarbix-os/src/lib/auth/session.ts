import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { SessionUser, UserRole, PermissionKey } from "@/types"

export const SESSION_COOKIE_NAME = "sarbix_session"
const SECRET_KEY = process.env.SESSION_SECRET || "sarbix-super-secure-jwt-secret-key-production-grade-256bit!"
const encodedKey = new TextEncoder().encode(SECRET_KEY)

export interface JWTSessionPayload {
  userId: string
  campusId: string
  role: UserRole
  email: string
  fullName: string
  permissions: PermissionKey[]
  avatarUrl?: string
}

export async function createSessionToken(payload: JWTSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function verifySessionToken(token: string): Promise<JWTSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload as unknown as JWTSessionPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
