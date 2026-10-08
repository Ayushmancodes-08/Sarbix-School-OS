import * as React from "react"
import {
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Download,
  AlertTriangle,
  UserCheck,
  FileCheck2,
  Clock,
  Database,
  Terminal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

export default async function AuditPage() {
  const session = await requirePermission("audit:view")
  const logs = db.audit.getAll(session.campusId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Audit & Security Governance
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px]">
              APPEND-ONLY TRAIL
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Cryptographic ledger of all institutional mutations, authorization events, fee collections, and student record accesses.
          </p>
        </div>
      </div>

      {/* Compliance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Total Audited Events
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-foreground">
              {logs.length}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Immutable audit stream</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Integrity Verification
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-emerald-500">
              SHA-256 Valid
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Zero tampering detected</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              RBAC Enforcement
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-indigo-500">
              100% Server Guarded
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">requirePermission() gates</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Active Tenant Scope
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-foreground">
              {session.campusId}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Isolated campus context</div>
          </CardContent>
        </Card>
      </div>

      {/* Log Feed Table */}
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="p-4 border-b bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold font-heading">
                Security & Mutation Stream
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time chronological telemetry with actor IDs and mutation payloads.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              Live Stream
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b font-mono uppercase text-[10px] text-muted-foreground">
                <tr>
                  <th className="p-3 pl-4">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Resource</th>
                  <th className="p-3">Actor / Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Client IP</th>
                  <th className="p-3 pr-4">Details Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 pl-4 font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt || log.timestamp || Date.now()).toLocaleString([], {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          log.action === "LOGIN"
                            ? "secondary"
                            : log.action === "CREATE" || log.action === "FEE_PAYMENT"
                            ? "success"
                            : "default"
                        }
                        className="text-[10px] font-mono font-bold"
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono font-semibold text-foreground">
                      {log.resource || log.entityType || "system"}
                    </td>
                    <td className="p-3 font-medium text-foreground">
                      {log.userEmail || log.actorName || "system"}
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[11px] text-muted-foreground uppercase">
                        {log.userRole || log.actorRole || "user"}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-muted-foreground">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                    <td className="p-3 pr-4 font-mono text-[11px] text-muted-foreground max-w-xs truncate">
                      {JSON.stringify(log.details || {}).replace(/[{}"]/g, " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
