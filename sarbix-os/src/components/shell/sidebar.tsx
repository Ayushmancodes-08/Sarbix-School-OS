"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  BookOpen,
  CreditCard,
  Bus,
  ShieldCheck,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  ChevronRight,
  HeartHandshake,
  Clock,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { JWTSessionPayload } from "@/lib/auth/session"

interface SidebarProps {
  user: JWTSessionPayload
  campusName: string
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  requiredPermission?: string
  roleAllowed?: string[]
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Command Center",
    href: "/overview",
    icon: LayoutDashboard,
    requiredPermission: "overview:view",
  },
  {
    title: "Student 360",
    href: "/students",
    icon: Users,
    requiredPermission: "students:view",
  },
  {
    title: "Admissions Hub",
    href: "/admissions",
    icon: UserPlus,
    requiredPermission: "students:create",
    badge: "Active",
  },
  {
    title: "Attendance & Daily",
    href: "/attendance",
    icon: CalendarCheck,
    requiredPermission: "attendance:view",
  },
  {
    title: "Academics & Schedule",
    href: "/academics",
    icon: BookOpen,
    requiredPermission: "academics:view",
  },
  {
    title: "Finance & Billing",
    href: "/finance",
    icon: CreditCard,
    requiredPermission: "finance:view",
  },
  {
    title: "Transport & Fleet",
    href: "/transport",
    icon: Bus,
    requiredPermission: "transport:view",
  },
  {
    title: "Parent Family Portal",
    href: "/parent",
    icon: HeartHandshake,
    roleAllowed: ["parent", "super_admin", "principal"],
  },
  {
    title: "Student Learning Hub",
    href: "/student",
    icon: GraduationCap,
    roleAllowed: ["student", "super_admin", "principal"],
  },
  {
    title: "Audit & Governance",
    href: "/audit",
    icon: ShieldCheck,
    requiredPermission: "audit:view",
  },
  {
    title: "System Settings",
    href: "/settings",
    icon: Settings,
    requiredPermission: "settings:manage",
  },
]

export function Sidebar({ user, campusName, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = React.useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch {
      setIsSigningOut(false)
    }
  }

  // Define strict, role-isolated navigation menus
  let visibleNav: NavItem[] = []

  if (user.role === "teacher") {
    visibleNav = [
      { title: "My Classroom", href: "/teacher", icon: BookOpen },
      { title: "Daily Attendance", href: "/attendance", icon: CalendarCheck },
      { title: "Teaching Schedule", href: "/academics", icon: Clock },
      { title: "Student Roster", href: "/students", icon: Users },
    ]
  } else if (user.role === "student") {
    visibleNav = [
      { title: "Student Desk", href: "/student", icon: GraduationCap },
      { title: "My Timetable", href: "/academics", icon: BookOpen },
    ]
  } else if (user.role === "parent") {
    visibleNav = [
      { title: "Family Portal", href: "/parent", icon: HeartHandshake },
      { title: "Fee Payments & Invoices", href: "/finance", icon: CreditCard },
      { title: "Bus Route Telemetry", href: "/transport", icon: Bus },
      { title: "Academic Schedule", href: "/academics", icon: BookOpen },
    ]
  } else if (user.role === "accountant") {
    visibleNav = [
      { title: "Bursar & Finance", href: "/finance", icon: CreditCard },
      { title: "Student Registry", href: "/students", icon: Users },
      { title: "Financial Audit Trail", href: "/audit", icon: ShieldCheck },
    ]
  } else if (user.role === "transport_manager") {
    visibleNav = [
      { title: "Fleet & GPS Operations", href: "/transport", icon: Bus },
      { title: "Transit Attendance Manifest", href: "/attendance", icon: CalendarCheck },
    ]
  } else {
    // Principal & Super Admin (Executive Command Center)
    visibleNav = [
      { title: "Command Center", href: "/overview", icon: LayoutDashboard },
      { title: "Student 360", href: "/students", icon: Users },
      { title: "Admissions Hub", href: "/admissions", icon: UserPlus, badge: "Active" },
      { title: "Attendance Console", href: "/attendance", icon: CalendarCheck },
      { title: "Academics & Schedule", href: "/academics", icon: BookOpen },
      { title: "Finance & Billing", href: "/finance", icon: CreditCard },
      { title: "Transport & Fleet", href: "/transport", icon: Bus },
      { title: "Teacher Workspace", href: "/teacher", icon: BookOpen },
      { title: "Family Portal", href: "/parent", icon: HeartHandshake },
      { title: "Student Desk", href: "/student", icon: GraduationCap },
      { title: "Audit & Governance", href: "/audit", icon: ShieldCheck },
      { title: "System Settings", href: "/settings", icon: Settings },
    ]
  }

  let roleHome = "/overview"
  if (user.role === "teacher") roleHome = "/teacher"
  else if (user.role === "student") roleHome = "/student"
  else if (user.role === "parent") roleHome = "/parent"
  else if (user.role === "accountant") roleHome = "/finance"
  else if (user.role === "transport_manager") roleHome = "/transport"

  const roleFormatted = user.role.replace("_", " ").toUpperCase()

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card/95 backdrop-blur-md transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand & Campus Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-4">
          <Link
            href={roleHome}
            onClick={onCloseMobile}
            className="flex items-center space-x-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                  SARBIX OS
                </span>
                <span className="rounded bg-indigo-500/10 px-1 py-0.2 text-[9px] font-mono font-semibold text-indigo-500">
                  PRO
                </span>
              </div>
              <p className="truncate text-[11px] font-medium text-muted-foreground max-w-[130px]">
                {campusName}
              </p>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Institutional Modules
          </div>

          {visibleNav.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                      isActive ? "text-white" : "text-muted-foreground group-hover:text-indigo-500"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-indigo-500/15 text-indigo-500"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* User Account & Sign Out Footer */}
        <div className="border-t border-border/80 p-3 bg-muted/20">
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/60 transition-colors">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                <AvatarFallback className="text-[10px]">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-semibold text-foreground">
                  {user.fullName}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {roleFormatted}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              title="Sign out of Sarbix OS"
              className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
