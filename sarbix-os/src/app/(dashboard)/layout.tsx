import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/data/mock-db"
import { DashboardShell } from "@/components/shell/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const campuses = db.campuses.getAll()

  return (
    <DashboardShell user={session} campuses={campuses}>
      {children}
    </DashboardShell>
  )
}
