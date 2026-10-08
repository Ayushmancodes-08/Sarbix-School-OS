"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { CommandBar } from "./command-bar"
import { CommandPalette } from "./command-palette"
import { CopilotDrawer } from "@/components/ai/copilot-drawer"
import { MobileBottomNav } from "./mobile-bottom-nav"
import type { JWTSessionPayload } from "@/lib/auth/session"
import type { Campus } from "@/types"

interface DashboardShellProps {
  user: JWTSessionPayload
  campuses: Campus[]
  children: React.ReactNode
}

export function DashboardShell({ user, campuses, children }: DashboardShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false)
  const [copilotOpen, setCopilotOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const currentCampus = campuses.find((c) => c.id === user.campusId) || campuses[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Persistent Desktop & Slideout Mobile Sidebar */}
      <Sidebar
        user={user}
        campusName={currentCampus?.name ?? "Main Campus"}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen pb-16 lg:pb-0 transition-all duration-300">
        <CommandBar
          campuses={campuses}
          currentCampusId={user.campusId}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenCopilot={() => setCopilotOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Phone & Tablet) */}
      <MobileBottomNav
        userRole={user.role}
        onOpenMenu={() => setMobileMenuOpen(true)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onOpenCopilot={() => setCopilotOpen(true)}
      />

      {/* Global Interactive Modals */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      <CopilotDrawer
        open={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </div>
  )
}
