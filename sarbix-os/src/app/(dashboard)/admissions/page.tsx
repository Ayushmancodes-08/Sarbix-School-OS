"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function AdmissionsPage() {
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "2011-05-10",
    gender: "female",
    bloodGroup: "O+",
    classGrade: "Grade 10",
    section: "A",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    busRouteNumber: "Route 04 (South Delhi Express)",
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successStudent, setSuccessStudent] = React.useState<any | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/students/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(data?.error?.message || "Failed to submit admission form.")
        setIsLoading(false)
        return
      }

      setSuccessStudent(data.data.student)
      setIsLoading(false)
    } catch {
      setErrorMessage("Network error during admission processing.")
      setIsLoading(false)
    }
  }

  const fillQuickPreset = () => {
    setFormData({
      firstName: "Tanvi",
      lastName: "Rao",
      dateOfBirth: "2011-03-24",
      gender: "female",
      bloodGroup: "A+",
      classGrade: "Grade 10",
      section: "B",
      parentName: "Srinivas Rao",
      parentEmail: "srinivas.rao@techcorp.in",
      parentPhone: "+91 98770 12345",
      address: "Villa 14, Palm Meadows, Whitefield",
      emergencyContactName: "Dr. Ananya Rao (Aunt)",
      emergencyContactPhone: "+91 98770 54321",
      busRouteNumber: "Route 04 (South Delhi Express)",
    })
    setErrorMessage(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="h-8 gap-1 text-xs">
            <Link href="/students">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Students</span>
            </Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillQuickPreset}
          className="text-xs border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Auto-fill Sample Applicant
        </Button>
      </div>

      {successStudent ? (
        <Card className="border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            Student Successfully Enrolled!
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Institutional records and admission credentials generated.
          </p>
          <div className="mt-6 mx-auto max-w-sm rounded-lg border bg-background p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student Name:</span>
              <span className="font-semibold">{successStudent.firstName} {successStudent.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admission ID:</span>
              <span className="font-mono font-bold text-indigo-600">{successStudent.admissionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class Placement:</span>
              <span>{successStudent.classGrade} ({successStudent.section})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned Roll No:</span>
              <span className="font-mono">{successStudent.rollNumber}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-3">
            <Button
              size="sm"
              onClick={() => {
                setSuccessStudent(null)
                fillQuickPreset()
              }}
              variant="outline"
              className="text-xs"
            >
              Enroll Another Student
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`/students/${successStudent.id}`)}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Open Student 360 Dossier
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Institutional Admissions Intake</CardTitle>
              <CardDescription className="text-xs">
                Official enrollment registry. All entries create immediate audit-trail entries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorMessage && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                  {errorMessage}
                </div>
              )}

              {/* Section 1: Learner Identity */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  1. Learner Identity
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">First Name *</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      placeholder="e.g. Tanvi"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Last Name *</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      placeholder="e.g. Rao"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Date of Birth *</label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      required
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Blood Group *</label>
                    <Input
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      required
                      placeholder="e.g. O+, B+, AB+"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Placement */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  2. Academic Cohort Placement
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Class / Grade *</label>
                    <Input
                      value={formData.classGrade}
                      onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                      required
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Section *</label>
                    <Input
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      required
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Transit Bus Route</label>
                    <Input
                      value={formData.busRouteNumber}
                      onChange={(e) => setFormData({ ...formData, busRouteNumber: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Guardian & Emergency */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  3. Guardian & Emergency Contacts
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Guardian Name *</label>
                    <Input
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      required
                      placeholder="Parent / Legal Guardian"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Guardian Email *</label>
                    <Input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      required
                      placeholder="guardian@email.com"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Guardian Phone *</label>
                    <Input
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      required
                      placeholder="+91 98000 00000"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Residential Address *</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Full residential address"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Emergency Contact Name *</label>
                    <Input
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      required
                      placeholder="Emergency contact person"
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Emergency Contact Phone *</label>
                    <Input
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      required
                      placeholder="+91 98000 00000"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-6"
                >
                  {isLoading ? "Enrolling Learner..." : "Submit Institutional Admission"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  )
}
