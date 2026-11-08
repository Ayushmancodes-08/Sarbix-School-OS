"use client"

import * as React from "react"
import {
  Megaphone,
  Bell,
  Calendar,
  AlertTriangle,
  Info,
  Award,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  Pin,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Announcement } from "@/types"

interface StudentNoticeBoardProps {
  announcements: Announcement[]
}

export function StudentNoticeBoard({ announcements }: StudentNoticeBoardProps) {
  const [selectedFilter, setSelectedFilter] = React.useState<"ALL" | "URGENT" | "IMPORTANT" | "ROUTINE">("ALL")
  const [selectedNotice, setSelectedNotice] = React.useState<Announcement | null>(null)

  const filteredNotices = React.useMemo(() => {
    if (selectedFilter === "ALL") return announcements
    return announcements.filter((a) => a.priority === selectedFilter)
  }, [announcements, selectedFilter])

  const latestUrgent = announcements.find((a) => a.priority === "URGENT") || announcements[0]

  return (
    <div className="space-y-4">
      {/* Top Prominent Notice Band / Ticker */}
      {latestUrgent && (
        <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 p-3.5 sm:p-4 text-xs shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-indigo-500/50 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-mono font-bold uppercase">
                    CAMPUS NOTICE BAND
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {new Date(latestUrgent.publishedAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-foreground mt-0.5 line-clamp-1">
                  {latestUrgent.title}
                </h4>
                <p className="text-muted-foreground text-[11px] line-clamp-1 mt-0.5">
                  {latestUrgent.content}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedNotice(latestUrgent)}
              className="text-xs h-8 border-indigo-500/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/10 shrink-0 self-start sm:self-auto"
            >
              <span>View Circular</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Campus Notice Board Card */}
      <Card className="border-border/80 shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/15 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold font-heading flex items-center space-x-2">
                  <span>Official Campus Circulars & Notice Board</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Institutional circulars from Principal Office, Examination Board & Department Heads
                </CardDescription>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1.5 self-start sm:self-auto overflow-x-auto max-w-full pb-1 sm:pb-0">
              {(["ALL", "URGENT", "IMPORTANT", "ROUTINE"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors ${
                    selectedFilter === filter
                      ? "bg-indigo-600 text-white font-semibold"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/60 max-h-[380px] overflow-y-auto">
            {filteredNotices.map((notice) => {
              const isUrgent = notice.priority === "URGENT"
              const isImportant = notice.priority === "IMPORTANT"

              return (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="p-4 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={isUrgent ? "destructive" : isImportant ? "warning" : "secondary"}
                        className="text-[10px] font-mono"
                      >
                        {notice.priority}
                      </Badge>
                      <span className="text-[11px] font-medium text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground/70" />
                        {new Date(notice.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-[11px] text-muted-foreground/70 hidden sm:inline">·</span>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {notice.authorName}
                      </span>
                    </div>

                    <h5 className="font-heading font-semibold text-xs sm:text-sm text-foreground group-hover:text-indigo-600 transition-colors">
                      {notice.title}
                    </h5>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>

                  <div className="flex items-center text-xs text-indigo-500 font-medium shrink-0 group-hover:translate-x-1 transition-transform sm:self-center">
                    <span>Read Details</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog for Full Circular Text */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    selectedNotice.priority === "URGENT"
                      ? "destructive"
                      : selectedNotice.priority === "IMPORTANT"
                      ? "warning"
                      : "secondary"
                  }
                  className="text-xs font-mono"
                >
                  {selectedNotice.priority}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  Ref: {selectedNotice.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-foreground leading-snug">
                {selectedNotice.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1.5 font-mono">
                <span>Issued by: {selectedNotice.authorName}</span>
                <span>·</span>
                <span>
                  {new Date(selectedNotice.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-4 border border-border/60 text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {selectedNotice.content}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-muted-foreground font-mono">
                Sarbix Central Academic Dispatches
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={() => setSelectedNotice(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Acknowledge Notice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

