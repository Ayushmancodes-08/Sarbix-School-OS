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

interface StudentCredentialsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: {
    id: string
    name: string
    rollNumber: string
    classGrade: string
    section: string
  } | null
  onSuccess?: () => void
}

export function StudentCredentialsModal({
  open,
  onOpenChange,
  student,
  onSuccess,
}: StudentCredentialsModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [copied, setCopied] = React.useState<"user" | "pass" | "all" | null>(null)
  const [credentials, setCredentials] = React.useState<{
    username: string
    email: string
    tempPassword: string
    assignedClasses: string
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!open) {
      setCredentials(null)
      setError(null)
      setCopied(null)
    }
  }, [open])

  const handleGenerate = async () => {
    if (!student) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/generate-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "student",
          targetId: student.id,
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

  if (!student) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-md border-border/80">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Student Desk Credentials</DialogTitle>
              <DialogDescription className="text-xs">
                Issue or reset login access for student digital portal.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target Student Identity Pill */}
          <div className="p-3 rounded-xl border border-border/80 bg-muted/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{student.name}</span>
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                {student.classGrade} - {student.section}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">Roll: {student.rollNumber}</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!credentials ? (
            <div className="py-4 text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                As a teacher, you have delegated authority to grant or reset this student&apos;s digital access pass.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium shadow-md gap-2"
              >
                {loading ? (
                  <span>Generating secure pass...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Student Credentials</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Student Portal Username / Email
                </label>
                <div className="flex items-center space-x-2">
                  <Input value={credentials.email} readOnly className="font-mono text-xs bg-muted/60" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-9 px-3 gap-1"
                    onClick={() => handleCopy(credentials.email, "user")}
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
                      `Sarbix Student Portal Credentials:\nStudent: ${student.name}\nLogin: ${credentials.email}\nPassword: ${credentials.tempPassword}\nURL: http://localhost:3000/login`,
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
                      <span>Copy Full Credential Pass for Student</span>
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

