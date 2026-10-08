import * as React from "react"
import {
  Settings,
  Shield,
  Building2,
  Lock,
  Key,
  Database,
  CheckCircle2,
  Cpu,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireAuth } from "@/lib/auth/guard"
import { db, ROLE_PERMISSIONS, CAMPUSES } from "@/lib/data/mock-db"

export default async function SettingsPage() {
  const session = await requireAuth()

  const allRoles = Object.keys(ROLE_PERMISSIONS)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              System Settings & Architecture
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px]">
              GOVERNANCE CONSOLE
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-campus tenancy controls, canonical RBAC security matrix, session cryptographic parameters, and AI Copilot configuration.
          </p>
        </div>
      </div>

      <Tabs defaultValue="campuses" className="space-y-6">
        <div className="overflow-x-auto pb-1 max-w-full">
          <TabsList className="bg-muted/80 p-1 inline-flex w-max sm:w-auto">
            <TabsTrigger value="campuses" className="gap-2 text-xs whitespace-nowrap">
              <Building2 className="h-3.5 w-3.5" />
              <span>Campus Tenancy ({CAMPUSES.length})</span>
            </TabsTrigger>
            <TabsTrigger value="rbac" className="gap-2 text-xs whitespace-nowrap">
              <Shield className="h-3.5 w-3.5" />
              <span>Canonical RBAC Matrix</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 text-xs whitespace-nowrap">
              <Lock className="h-3.5 w-3.5" />
              <span>Security & Cryptography</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2 text-xs whitespace-nowrap">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Copilot Engine</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Campuses Tab */}
        <TabsContent value="campuses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPUSES.map((c) => (
              <Card key={c.id} className="border-border/80 shadow-sm">
                <CardHeader className="p-4 border-b bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold font-heading">
                        {c.name}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono">
                        Code: {c.code} · ID: {c.id}
                      </CardDescription>
                    </div>
                    <Badge variant={c.isActive ? "success" : "secondary"} className="font-mono text-xs">
                      {c.isActive ? "ACTIVE TENANT" : "INACTIVE"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-medium text-foreground text-right max-w-xs">{c.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-mono text-foreground">{c.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin Email:</span>
                    <span className="font-mono text-foreground">{c.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* RBAC Matrix Tab */}
        <TabsContent value="rbac" className="space-y-4">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/10">
              <CardTitle className="text-base font-bold font-heading">
                Role-Based Access Control (RBAC) Permission Registry
              </CardTitle>
              <CardDescription className="text-xs">
                Server-enforced permissions bound to each canonical role. Enforced at both Next.js route handlers and server actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {allRoles.map((roleKey) => {
                  const perms = ROLE_PERMISSIONS[roleKey] || []
                  return (
                    <div key={roleKey} className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-bold text-sm text-foreground uppercase tracking-wide">
                            {roleKey.replace("_", " ")}
                          </span>
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            {perms.length} Permissions
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {perms.map((p) => (
                          <span
                            key={p}
                            className="inline-flex items-center rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Cryptography Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/80 shadow-sm p-5 space-y-3">
              <div className="flex items-center space-x-2.5">
                <Lock className="h-5 w-5 text-indigo-500" />
                <h4 className="font-heading font-bold text-sm text-foreground">
                  Session Token Hardening
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Cryptographically signed using HS-256 via <code>jose</code>. Cookies are issued as <code>HttpOnly</code>, <code>SameSite=Lax</code>, with 7-day TTL.
              </p>
              <div className="rounded-lg bg-muted/40 p-3 font-mono text-xs text-emerald-500 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Zero localStorage Trust — Client cannot spoof roles</span>
              </div>
            </Card>

            <Card className="border-border/80 shadow-sm p-5 space-y-3">
              <div className="flex items-center space-x-2.5">
                <Key className="h-5 w-5 text-indigo-500" />
                <h4 className="font-heading font-bold text-sm text-foreground">
                  Password Encryption Standards
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Bcrypt one-way cryptographic hashing (10 rounds in dev, 12 rounds in production). Plaintext fallbacks strictly prohibited.
              </p>
              <div className="rounded-lg bg-muted/40 p-3 font-mono text-xs text-emerald-500 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>NIST SP 800-63B Compliant</span>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* AI Copilot Tab */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="border-border/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h4 className="font-heading font-bold text-sm text-foreground">
                AI School Copilot Boundary
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Sarbix Copilot operates under strict permission-scoped retrieval. Prompts never execute queries outside the user's active session role and campus boundary.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-lg border p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Data Boundary</span>
                <p className="text-xs font-bold text-foreground mt-1">Tenant & Role Scoped</p>
              </div>
              <div className="rounded-lg border p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Review Queue</span>
                <p className="text-xs font-bold text-foreground mt-1">Human-In-The-Loop</p>
              </div>
              <div className="rounded-lg border p-3">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Audit Logging</span>
                <p className="text-xs font-bold text-foreground mt-1">All AI Traces Stored</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
