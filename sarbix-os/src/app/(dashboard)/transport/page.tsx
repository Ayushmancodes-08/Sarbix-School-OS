import * as React from "react"
import {
  Bus,
  MapPin,
  Phone,
  UserCheck,
  ShieldCheck,
  Clock,
  Gauge,
  Navigation,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"

export default async function TransportPage() {
  const session = await requirePermission("transport:view")

  const vehicles = db.transport.getVehicles(session.campusId)
  const routes = db.transport.getRoutes(session.campusId)

  const totalCapacity = vehicles.reduce((acc, v) => acc + v.capacity, 0)
  const totalAssigned = vehicles.reduce((acc, v) => acc + v.assignedCount, 0)
  const utilization = totalCapacity > 0 ? ((totalAssigned / totalCapacity) * 100).toFixed(1) : "0"
  const activeVehicles = vehicles.filter((v) => v.status === "ACTIVE").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Transport & Fleet Operations
            </h1>
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-[10px]">
              GPS TELEMETRY
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time fleet tracking, student boarding rosters, driver allocations, and route waypoint management.
          </p>
        </div>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Active Vehicles
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-emerald-500">
              {activeVehicles} <span className="text-sm font-sans text-muted-foreground">/ {vehicles.length}</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">1 van scheduled in depot</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Total Student Riders
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-foreground">
              {totalAssigned}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Allocated across {routes.length} routes</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Fleet Capacity Utilization
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-indigo-500">
              {utilization}%
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">{totalCapacity} total seat capacity</div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              On-Time Transit Rate
            </span>
            <div className="mt-1 text-2xl font-bold font-mono tracking-tight text-emerald-500">
              98.4%
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Average arrival 07:51 AM</div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Vehicles Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((veh) => (
          <Card key={veh.id} className="border-border/80 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-foreground">
                  {veh.vehicleNumber}
                </span>
                <Badge
                  variant={veh.status === "ACTIVE" ? "success" : "warning"}
                  className="text-[10px] font-mono"
                >
                  {veh.status}
                </Badge>
              </div>
              <CardDescription className="font-mono text-[11px] text-muted-foreground">
                Reg: {veh.registrationNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Driver:</span>
                  <span className="font-medium text-foreground">{veh.driverName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contact:</span>
                  <span className="font-mono text-foreground">{veh.driverPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Capacity:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {veh.assignedCount} / {veh.capacity} seats
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5 text-xs border border-border/60">
                <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <Navigation className="h-3 w-3" />
                  <span>{veh.currentLocation}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Speed: {veh.speedKmH} km/h</span>
                  <span>Ping: {veh.lastTelemetryPing}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Route Manifests */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Assigned Transport Routes & Stops
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {routes.map((rt) => (
            <Card key={rt.id} className="border-border/80 shadow-sm">
              <CardHeader className="p-4 border-b bg-muted/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold font-heading">
                      {rt.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {rt.vehicleNumber} · Driver: {rt.driverName} ({rt.driverPhone})
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {rt.stops.length} Stops
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-4">
                  {rt.stops.map((st, sIdx) => (
                    <div key={sIdx} className="relative">
                      <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-background" />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-foreground">{st.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            Scheduled: {st.time}
                          </p>
                        </div>
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {st.studentsCount} students
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
