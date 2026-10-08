import { requirePermission } from "@/lib/auth/guard"
import { db } from "@/lib/data/mock-db"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import {
  Users,
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  ChevronRight,
  UserCheck,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; grade?: string }>
}) {
  const session = await requirePermission("students:view")
  const params = await searchParams
  const query = params.q?.toLowerCase() || ""
  const selectedGrade = params.grade || ""

  let students = db.students.getAll(session.campusId)

  if (query) {
    students = students.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
        s.admissionNumber.toLowerCase().includes(query) ||
        (s.rollNumber ? s.rollNumber.toLowerCase().includes(query) : false)
    )
  }

  if (selectedGrade) {
    students = students.filter((s) => s.classGrade === selectedGrade)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Student 360 Registry
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete institutional student directory, academic standing, and welfare metrics.
          </p>
        </div>

        {session.permissions.includes("students:create") && (
          <Button asChild size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/admissions">
              <Plus className="h-4 w-4" />
              <span>Enroll New Student</span>
            </Link>
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/80 bg-card p-4">
        <form className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search by name, roll, admission ID..."
            className="pl-9 h-9 text-xs"
          />
        </form>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {students.length} Learners Enrolled
          </Badge>
        </div>
      </div>

      {/* High Information Density Table */}
      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Admission No</TableHead>
              <TableHead>Class & Section</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Pending Fees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No students found matching current filters.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-indigo-500/10 text-indigo-600 font-semibold">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-xs text-foreground">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Roll: {student.rollNumber}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {student.admissionNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs">
                      {student.classGrade} - {student.section}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold">
                        {student.attendancePercentage}%
                      </span>
                      {student.attendancePercentage && student.attendancePercentage < 90 ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title="Attendance Alert" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.pendingFeeAmount && student.pendingFeeAmount > 0 ? (
                      <span className="font-mono text-xs font-semibold text-destructive">
                        {formatCurrency(student.pendingFeeAmount)}
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-semibold text-emerald-600">
                        Paid in Full
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px] capitalize">
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-indigo-600 hover:text-indigo-700">
                      <Link href={`/students/${student.id}`}>
                        <span>View 360</span>
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
