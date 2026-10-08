"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Lock,
  Mail,
  Shield,
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  User,
  HeartHandshake,
  CreditCard,
  Bus,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const DEMO_PRESETS = [
  { role: "Principal", icon: GraduationCap, email: "principal@delhi.sarbix.edu", pass: "Password@123", desc: "Executive Command Center · Full Visibility" },
  { role: "Teacher", icon: BookOpen, email: "teacher@delhi.sarbix.edu", pass: "Password@123", desc: "Rapid Attendance & Academic Schedule" },
  { role: "Student", icon: User, email: "student@delhi.sarbix.edu", pass: "Password@123", desc: "Learning Hub, Digital ID & Attendance" },
  { role: "Parent", icon: HeartHandshake, email: "parent@delhi.sarbix.edu", pass: "Password@123", desc: "Multi-Child Portal & Instant Fee Pay" },
  { role: "Accountant", icon: CreditCard, email: "accountant@delhi.sarbix.edu", pass: "Password@123", desc: "Fee Invoicing, Receipts & Ledger" },
  { role: "Transport", icon: Bus, email: "transport@delhi.sarbix.edu", pass: "Password@123", desc: "Fleet Telemetry & Route Waypoints" },
  { role: "Super Admin", icon: ShieldCheck, email: "superadmin@sarbix.edu", pass: "Password@123", desc: "Multi-Campus Governance & RBAC Matrix" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("principal@delhi.sarbix.edu")
  const [password, setPassword] = React.useState("Password@123")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(data?.error?.message || "Invalid authentication credentials.")
        setIsLoading(false)
        return
      }

      // Route based on role
      const userRole = data.data.user.role
      if (userRole === "parent") {
        router.push("/parent")
      } else if (userRole === "student") {
        router.push("/student")
      } else if (userRole === "teacher") {
        router.push("/attendance")
      } else if (userRole === "accountant") {
        router.push("/finance")
      } else if (userRole === "transport_manager") {
        router.push("/transport")
      } else {
        router.push("/overview")
      }
    } catch {
      setErrorMessage("Network error during login. Please try again.")
      setIsLoading(false)
    }
  }

  const fillPreset = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setErrorMessage(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column: Institutional Brand & Kinetic Identity */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex border-r border-slate-800">
        {/* Ambient Gradient glow */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-600/15 blur-3xl" />

        {/* Top: Logo & System Badge */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/25">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading text-xl font-bold tracking-tight">SARBIX</span>
              <Badge variant="outline" className="border-indigo-400/40 text-[10px] text-indigo-300 font-mono uppercase tracking-wider">
                OS v2.4
              </Badge>
            </div>
            <p className="text-xs text-slate-400">Institutional School Operating System</p>
          </div>
        </div>

        {/* Center: Mission Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Unified Multi-Campus Governance</span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            One single brain for your entire school network.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Unifying student 360, zero-touch attendance, automated fee reconciliation, and AI-assisted academic workflows into an enterprise-grade institution operating system.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-bold font-mono text-white">99.98%</div>
              <div className="text-xs text-slate-400">High-Availability Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-indigo-400">100%</div>
              <div className="text-xs text-slate-400">Role-Isolated RBAC</div>
            </div>
          </div>
        </div>

        {/* Bottom: Institutional Trust Indicators */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Zero-Trust Enterprise Security</span>
          </div>
          <span>ISO 27001 & FERPA Compliant</span>
        </div>
      </div>

      {/* Right Column: Hardened Authentication Card */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Header */}
          <div className="mb-8 lg:hidden flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold">SARBIX SCHOOL OS</span>
              <p className="text-xs text-muted-foreground">Sign in to your institutional workspace</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Sign in to workspace
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your institutional credentials. Your access level is verified cryptographically by the server.
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="mt-6 rounded-xl border border-border/70 bg-gradient-to-b from-muted/50 to-muted/20 dark:from-muted/20 dark:to-muted/5 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Evaluator Role Switcher
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">1-Click Fast Auth</span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {DEMO_PRESETS.map((p) => {
                const isActive = email === p.email
                const Icon = p.icon
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => fillPreset(p.email, p.pass)}
                    className={cn(
                      "group inline-flex items-center space-x-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150",
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 ring-2 ring-indigo-500/30 font-semibold scale-[1.02]"
                        : "bg-background/90 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 hover:border-border"
                    )}
                    title={`${p.role}: ${p.desc}`}
                  >
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-white" : "text-indigo-500 group-hover:text-foreground")} />
                    <span>{p.role}</span>
                  </button>
                )
              })}
            </div>

            {/* Active Preset Feedback Ribbon */}
            {(() => {
              const active = DEMO_PRESETS.find((p) => p.email === email)
              if (!active) return null
              return (
                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-indigo-500/10 dark:bg-indigo-500/15 px-3 py-1.5 text-xs border border-indigo-500/20 transition-all">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-indigo-900 dark:text-indigo-200 truncate font-medium text-[11px]">
                      {active.desc}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 tracking-wider shrink-0 ml-2 bg-indigo-500/15 px-1.5 py-0.5 rounded">
                    {active.role}
                  </span>
                </div>
              )
            })()}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {errorMessage && (
              <div className="flex items-start space-x-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <div className="shrink-0 font-bold">Error:</div>
                <div>{errorMessage}</div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.sarbix.edu"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Security Password
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Default: <code className="font-mono text-primary font-semibold">Password@123</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 h-10 font-medium"
            >
              {isLoading ? (
                <span>Authenticating Identity...</span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Sign In to School OS</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Security footnote */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Protected by HttpOnly JWT Session & RBAC Enforcement</span>
          </div>
        </div>
      </div>
    </div>
  )
}
