"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Menu,
  CalendarCheck,
  HeartHandshake,
  GraduationCap,
  CreditCard,
  Bus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileBottomNavProps {
  userRole: string
  onOpenMenu: () => void
  onOpenSearch: () => void
  onOpenCopilot: () => void
}

export function MobileBottomNav({
  userRole,
  onOpenMenu,
  onOpenSearch,
  onOpenCopilot,
}: MobileBottomNavProps) {
  const pathname = usePathname()

  // Select primary dashboard link based on role
  let homeHref = "/overview"
  let homeLabel = "Home"

  if (userRole === "parent") {
    homeHref = "/parent"
    homeLabel = "Family"
  } else if (userRole === "student") {
    homeHref = "/student"
    homeLabel = "Desk"
  } else if (userRole === "accountant") {
    homeHref = "/finance"
    homeLabel = "Finance"
  } else if (userRole === "transport_manager") {
    homeHref = "/transport"
    homeLabel = "Fleet"
  }

  // Select primary quick action module
  let actionHref = "/attendance"
  let actionLabel = "Daily"
  let ActionIcon = CalendarCheck

  if (userRole === "parent") {
    actionHref = "/academics"
    actionLabel = "Schedule"
    ActionIcon = GraduationCap
  } else if (userRole === "student") {
    actionHref = "/academics"
    actionLabel = "Schedule"
    ActionIcon = GraduationCap
  } else if (userRole === "accountant") {
    actionHref = "/audit"
    actionLabel = "Audit"
    ActionIcon = CreditCard
  } else if (userRole === "transport_manager") {
    actionHref = "/attendance"
    actionLabel = "Roster"
    ActionIcon = Bus
  }

  const isHomeActive = pathname === homeHref
  const isActionActive = pathname === actionHref

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur-md px-2 lg:hidden">
      {/* 1. Home Dashboard */}
      <Link
        href={homeHref}
        className={cn(
          "flex flex-col items-center justify-center space-y-1 py-1 px-3 text-[10px] font-medium transition-colors",
          isHomeActive
            ? "text-indigo-600 dark:text-indigo-400 font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span>{homeLabel}</span>
      </Link>

      {/* 2. Primary Role Action */}
      <Link
        href={actionHref}
        className={cn(
          "flex flex-col items-center justify-center space-y-1 py-1 px-3 text-[10px] font-medium transition-colors",
          isActionActive
            ? "text-indigo-600 dark:text-indigo-400 font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <ActionIcon className="h-5 w-5" />
        <span>{actionLabel}</span>
      </Link>

      {/* 3. Search Trigger (Central Floating Pill) */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center space-y-1 py-1 px-3 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open global search"
      >
        <Search className="h-5 w-5" />
        <span>Search</span>
      </button>

      {/* 4. AI Copilot Drawer Trigger */}
      <button
        type="button"
        onClick={onOpenCopilot}
        className="flex flex-col items-center justify-center space-y-1 py-1 px-3 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 transition-colors"
        aria-label="Open Sarbix Copilot"
      >
        <div className="relative">
          <Sparkles className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
        </div>
        <span className="font-semibold">AI Desk</span>
      </button>

      {/* 5. Mobile Navigation Sidebar Trigger */}
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center space-y-1 py-1 px-3 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open all modules menu"
      >
        <Menu className="h-5 w-5" />
        <span>Menu</span>
      </button>
    </nav>
  )
}
