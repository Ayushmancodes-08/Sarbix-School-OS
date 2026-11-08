"use client"

import * as React from "react"
import {
  KeyRound,
  Copy,
  CheckCircle2,
  BookOpen,
  UserCheck,
  ShieldAlert,
  Sparkles,
  GraduationCap,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TeacherCredentialsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: {
    id: string
    name: string
    email: string
    assignedClasses?: string
  } | null
  onSuccess?: () => void
}

export function TeacherCredentialsModal({
  open,
  onOpenChange,
  teacher,
  onSuccess,
}: TeacherCredentialsModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [assigningClass, setAssigningClass] = React.useState(false)
  const [selectedGrade, setSelectedGrade] = React.useState("Grade 10")
  const [selectedSection, setSelectedSection] = React.useState("A")
  const [selectedSubject, setSelectedSubject] = React.useState("Advanced Mathematics")
  const [copied, setCopied] = React.useState<"user" | "pass" | "all" | null>(null)
  const [credentials, setCredentials] = React.useState<{
    username: string
    email: string
    tempPassword: string
    assignedClasses: string
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [assignmentNotice, setAssignmentNotice] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) {
      setCredentials(null)
      setError(null)
      setCopied(null)
      setAssignmentNotice(null)
    }
  }, [open])

  const handleAssignClass = async () => {
    if (!teacher) return
    setAssigningClass(true)
    setError(null)

    try {
      const res = await fetch("/api/faculty/assign-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: teacher.id,
          classGrade: selectedGrade,
          section: selectedSection,
          subject: selectedSubject,
          isHomeroom: true,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to assign class")
      }

      setAssignmentNotice(`Successfully allocated ${selectedSubject} (${selectedGrade}-${selectedSection}) to ${teacher.name}`)
    } catch (err: any) {
      setError(err.message || "Failed to allocate class")
    } finally {
      setAssigningClass(false)
    }
  }

  const handleGenerate = async () => {
    if (!teacher) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/generate-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "teacher",
          targetId: teacher.id,
          assignedClasses: `${selectedGrade}-${selectedSection} (${selectedSubject})`,
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to generate credentials")
      }

      setCredentials(json.credentials)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, type: "user" | "pass" | "all") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2500)
  }

  if (!teacher) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card/95 backdrop-blur-md border-border/80">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Faculty Assignment & Access Pass</DialogTitle>
              <DialogDescription className="text-xs">
                Principal & Management Console: Allocate classes and issue faculty login credentials.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target Teacher Identity Pill */}
          <div className="p-3 rounded-xl border border-border/80 bg-muted/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{teacher.name}</span>
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                Active Faculty
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">{teacher.email}</p>
          </div>

          {/* Class & Subject Assignment Box */}
          <div className="rounded-xl border border-border/80 p-3 space-y-3 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                Assign Class & Subject Roster
              </span>
              <Badge variant="secondary" className="text-[10px]">
                Management Right
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full text-xs rounded-md border border-input bg-background p-1.5 focus:ring-1 focus:ring-primary"
                >
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full text-xs rounded-md border border-input bg-background p-1.5 focus:ring-1 focus:ring-primary"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs rounded-md border border-input bg-background p-1.5 focus:ring-1 focus:ring-primary"
                >
                  <option value="Advanced Mathematics">Mathematics</option>
                  <option value="Physics & Mechanics">Physics</option>
                  <option value="Computer Science & AI">Computer Science</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English Literature">English</option>
                </select>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleAssignClass}
              disabled={assigningClass}
              className="w-full h-8 text-xs gap-1.5"
            >
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              <span>{assigningClass ? "Allocating..." : "Confirm Class Allocation"}</span>
            </Button>

            {assignmentNotice && (
              <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {assignmentNotice}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!credentials ? (
            <div className="py-2 text-center space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium shadow-md gap-2"
              >
                {loading ? (
                  <span>Generating faculty pass...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate & Issue Teacher Credentials</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Faculty Portal Username
                </label>
                <div className="flex items-center space-x-2">
                  <Input value={credentials.username} readOnly className="font-mono text-xs bg-muted/60" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-9 px-3 gap-1"
                    onClick={() => handleCopy(credentials.username, "user")}
                  >
                    {copied === "user" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Temporary Passcode
                </label>
                <div className="flex items-center space-x-2">
                  <Input value={credentials.tempPassword} readOnly className="font-mono text-xs bg-muted/60 font-bold text-indigo-500" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-9 px-3 gap-1"
                    onClick={() => handleCopy(credentials.tempPassword, "pass")}
                  >
                    {copied === "pass" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full gap-2 text-xs"
                  onClick={() =>
                    handleCopy(
                      `Sarbix Faculty Portal Credentials:\nTeacher: ${teacher.name}\nUsername: ${credentials.username}\nEmail: ${credentials.email}\nPassword: ${credentials.tempPassword}\nURL: http://localhost:3000/login`,
                      "all"
                    )
                  }
                >
                  {copied === "all" ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Copied Full Pass to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Full Credential Pass for Faculty</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

