"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  ChevronRight,
  KeyRound,
  Download,
  AlertCircle,
  FileCheck2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PresetRole {
  role: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  email: string
  pass: string
  badgeText: string
  desc: string
  landing: string
  category: "Leadership" | "Academic" | "Students & Family" | "Operations"
}

const DEMO_PRESETS: PresetRole[] = [
  {
    role: "Principal",
    label: "Principal / Director",
    icon: GraduationCap,
    email: "principal@delhi.sarbix.edu",
    pass: "Password@123",
    badgeText: "Command Center",
    desc: "Whole-campus oversight, institutional KPIs, class allocations & staff hiring",
    landing: "/overview",
    category: "Leadership",
  },
  {
    role: "Teacher",
    label: "Homeroom Teacher",
    icon: BookOpen,
    email: "teacher@delhi.sarbix.edu",
    pass: "Password@123",
    badgeText: "Classroom Hub",
    desc: "Class 10-A roll call, lecture timetable, homework publishing & student desk passes",
    landing: "/teacher",
    category: "Academic",
  },
  {
    role: "Student",
    label: "Enrolled Student",
    icon: User,
    email: "student@delhi.sarbix.edu",
    pass: "Password@123",
    badgeText: "Student Desk",
    desc: "Digital Student ID, synced roll-call verification, timetable & homework hub",
    landing: "/student",
    category: "Students & Family",
  },
  {
    role: "Parent",
    label: "Parent / Guardian",
    icon: HeartHandshake,
    email: "parent@delhi.sarbix.edu",
    pass: "Password@123",
    badgeText: "Family Portal",
    desc: "Live attendance badge, instant UPI QR fee checkout (₹18,500) & bus tracker",
    landing: "/parent",
    category: "Students & Family",
  },
  {
    role: "Accountant",
    label: "Accountant / Bursar",
    icon: CreditCard,
    email: "accountant@delhi.sarbix.edu",
    pass: "Password@123",
    badgeText: "Bursar Ledger",
    desc: "Tuition billing, student accounts ledger, invoice generation & GST receipts",
    landing: "/finance",
    category: "Operations",
  },
  {
    role: "Transport",
    label: "Transport Manager",
    icon: Bus,
    email: "transport@delhi.sarbix.edu",
    pass: "Password@123",
    badgeText: "GPS Telemetry",
    desc: "Fleet GPS tracker, Route 04 South Delhi Express roster & driver logs",
    landing: "/transport",
    category: "Operations",
  },
  {
    role: "Super Admin",
    label: "Super Administrator",
    icon: ShieldCheck,
    email: "superadmin@sarbix.edu",
    pass: "Password@123",
    badgeText: "IT Governance",
    desc: "Multi-campus governance, RBAC matrix, and tamper-evident audit logs",
    landing: "/overview",
    category: "Leadership",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("principal@delhi.sarbix.edu")
  const [password, setPassword] = React.useState("Password@123")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")

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

      const userRole = data.data.user.role
      if (userRole === "parent") {
        router.push("/parent")
      } else if (userRole === "student") {
        router.push("/student")
      } else if (userRole === "teacher") {
        router.push("/teacher")
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

  const activePreset = DEMO_PRESETS.find((p) => p.email === email) || DEMO_PRESETS[0]
  const ActiveIcon = activePreset.icon

  const categories = ["All", "Leadership", "Academic", "Students & Family", "Operations"]
  const filteredPresets = selectedCategory === "All"
    ? DEMO_PRESETS
    : DEMO_PRESETS.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-300 flex flex-col lg:flex-row">
      {/* Left Column: Institutional Brand & Kinetic Identity (Desktop) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 p-12 text-white lg:flex border-r border-slate-800/80 min-h-screen">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-600/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/25">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading text-xl font-bold tracking-tight text-white">SARBIX</span>
              <Badge variant="outline" className="border-indigo-400/40 text-[10px] text-indigo-300 font-mono uppercase tracking-wider">
                OS v2.4 · PWA READY
              </Badge>
            </div>
            <p className="text-xs text-slate-400">Institutional School Operating System</p>
          </div>
        </div>

        {/* Center: Mission Statement & Key Features */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Zero-Overlap Strict Role-Based Architecture</span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight text-white">
            One single brain for your entire school network.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Unifying student 360, zero-touch attendance, automated fee reconciliation, public applicant pipelines, and AI-assisted academic workflows into an enterprise-grade school operating system.
          </p>

          {/* Quick Evaluator Features */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-indigo-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Hierarchical Delegation</span>
              </div>
              <p className="text-[11px] text-slate-400">Principal assigns faculty; teachers issue student passes.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-indigo-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Single-Student Ripple</span>
              </div>
              <p className="text-[11px] text-slate-400">Actions on Aarav Patel cascade in real time to all portals.</p>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>HttpOnly JWT Session & Edge Route Gating</span>
          </div>
          <span>ISO 27001 & FERPA Compliant</span>
        </div>
      </div>

      {/* Right Column: High-Velocity Authentication Cockpit */}
      <div className="flex flex-1 flex-col justify-start lg:justify-center px-4 py-8 sm:px-10 lg:px-14 xl:px-20 max-w-2xl mx-auto w-full min-h-screen overflow-y-auto">
        <div className="w-full space-y-6 my-auto">
          {/* Mobile Header Branding */}
          <div className="lg:hidden flex items-center space-x-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading text-lg font-bold text-white">SARBIX SCHOOL OS</span>
                <Badge variant="outline" className="border-indigo-400/40 text-[9px] text-indigo-300 font-mono">
                  PWA
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Sign in to your institutional workspace</p>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Sign in to Workspace
            </h2>
            <p className="text-xs text-slate-400">
              Select any role preset below for 1-click credential autofill, or enter your institutional account credentials.
            </p>
          </div>

          {/* Evaluator Persona Switcher Box */}
          <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300">
                  1-Click Role Switcher Presets
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
                7 Personas
              </Badge>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0",
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Preset Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredPresets.map((preset) => {
                const Icon = preset.icon
                const isSelected = email === preset.email
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => fillPreset(preset.email, preset.pass)}
                    className={cn(
                      "flex items-center space-x-2.5 p-2 rounded-xl text-left border transition-all cursor-pointer",
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500/50 shadow-xs"
                        : "border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300"
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs",
                        isSelected
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-800 text-slate-400"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate leading-tight">{preset.role}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{preset.badgeText}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Active Selected Role Card Banner */}
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-slate-950 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ActiveIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white truncate">{activePreset.label}</span>
                    <Badge className="bg-indigo-600/30 text-indigo-300 border-indigo-500/40 text-[9px] font-mono">
                      {activePreset.landing}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate mt-0.5">{activePreset.desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Input Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Institutional Email Address / User ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="identity@sarbix.edu"
                  className="pl-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Security Passcode
                </label>
                <span className="text-[11px] text-slate-400">
                  Default Demo Password: <code className="font-mono text-indigo-400 font-semibold">Password@123</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-9 pr-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 text-xs h-10 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 gap-2"
            >
              {isLoading ? (
                <span>Validating Session & Scopes...</span>
              ) : (
                <>
                  <span>Sign In as {activePreset.role}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Prospective Applicants & Careers Section */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span className="text-[11px]">Prospective Applicant?</span>
            <div className="flex items-center space-x-3">
              <Link href="/apply/admission" className="text-indigo-400 hover:underline font-medium flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Student Admission →</span>
              </Link>
              <span className="text-slate-700">|</span>
              <Link href="/apply/job" className="text-indigo-400 hover:underline font-medium flex items-center gap-1">
                <span>Faculty Careers →</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 pt-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Installable as Native PWA on iOS & Android</span>
          </div>
        </div>
      </div>
    </div>
  )
}
