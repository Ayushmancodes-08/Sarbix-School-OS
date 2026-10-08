"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Search,
  Sparkles,
  Sun,
  Moon,
  Building2,
  Bell,
  Command,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Campus } from "@/types"

interface CommandBarProps {
  campuses: Campus[]
  currentCampusId: string
  onOpenCommandPalette: () => void
  onOpenCopilot: () => void
  onOpenMobileMenu?: () => void
}

export function CommandBar({
  campuses,
  currentCampusId,
  onOpenCommandPalette,
  onOpenCopilot,
  onOpenMobileMenu,
}: CommandBarProps) {
  const { theme, setTheme } = useTheme()
  const [selectedCampus, setSelectedCampus] = React.useState(
    campuses.find((c) => c.id === currentCampusId) || campuses[0]
  )

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-3 sm:px-6 backdrop-blur-md">
      {/* Left: Hamburger menu (mobile) + Campus Switcher & Breadcrumb Context */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {onOpenMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileMenu}
            className="h-9 w-9 lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Open navigation sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 sm:gap-2 border-border/80 bg-background font-medium text-xs hover:bg-muted px-2.5 sm:px-3"
            >
              <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="max-w-[110px] sm:max-w-[160px] truncate">{selectedCampus?.name ?? "Campus"}</span>
              <span className="hidden sm:inline-block rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                {selectedCampus?.code}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Institutional Campuses</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {campuses.map((campus) => (
              <DropdownMenuItem
                key={campus.id}
                onClick={() => setSelectedCampus(campus)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-medium text-xs">{campus.name}</p>
                  <p className="text-[10px] text-muted-foreground">{campus.code}</p>
                </div>
                {campus.id === selectedCampus?.id && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden items-center space-x-2 text-xs text-muted-foreground md:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Academic Term 2026-27 Active</span>
        </div>
      </div>

      {/* Center: Global OmniSearch Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-muted/40 px-3 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search students, roll numbers, invoices, or actions...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, AI Copilot, Theme Toggle, Notifications */}
      <div className="flex items-center space-x-2.5">
        {/* OmniSearch mobile button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenCommandPalette}
          className="h-9 w-9 lg:hidden"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* AI Copilot Drawer trigger */}
        <Button
          onClick={onOpenCopilot}
          size="sm"
          className="h-9 gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-sm shadow-indigo-500/20 text-xs font-medium"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
          <span className="hidden sm:inline">Sarbix Copilot</span>
        </Button>

        {/* Theme switcher */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600" />
        </div>
      </div>
    </header>
  )
}
