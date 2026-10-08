import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Redirect based on verified role
  if (session.role === "parent") {
    redirect("/parent")
  } else if (session.role === "student") {
    redirect("/student")
  } else if (session.role === "teacher") {
    redirect("/teacher")
  } else if (session.role === "accountant") {
    redirect("/finance")
  } else if (session.role === "transport_manager") {
    redirect("/transport")
  } else {
    redirect("/overview")
  }
}
