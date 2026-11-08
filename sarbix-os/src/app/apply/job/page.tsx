"use client"

import * as React from "react"
import Link from "next/link"
import {
  Briefcase,
  User,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function FacultyJobApplicationPage() {
  const [submitting, setSubmitting] = React.useState(false)
  const [submittedApp, setSubmittedApp] = React.useState<{
    id: string
    name: string
    subject: string
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "Computer Science & AI",
    qualification: "",
    experience: "3",
    coverLetter: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/faculty/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to submit career application")
      }

      setSubmittedApp({
        id: json.applicationId || "JOB-2026-SUBMITTED",
        name: `${formData.firstName} ${formData.lastName}`,
        subject: formData.subject,
      })
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Briefcase className="h-4 w-4" />
            <span>Sarbix Faculty Careers · Talent Acquisition 2026</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Faculty & Educator Career Portal
          </h1>
          <p className="text-sm text-slate-400">
            Join the academic faculty at Sarbix Institutions. Applications are reviewed directly by the Principal Directorate.
          </p>
        </div>

        {submittedApp ? (
          <Card className="border-indigo-500/30 bg-slate-900/90 shadow-2xl p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Application Received!</h2>
              <p className="text-sm text-slate-400">
                Thank you for applying, <strong className="text-indigo-400">{submittedApp.name}</strong>. Your profile has been lodged in our faculty candidate queue.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-border inline-block text-left font-mono text-xs space-y-1">
                <div><span className="text-slate-500">Candidate Ref ID:</span> <span className="text-emerald-400 font-bold">{submittedApp.id}</span></div>
                <div><span className="text-slate-500">Department:</span> <span>{submittedApp.subject}</span></div>
                <div><span className="text-slate-500">Status:</span> <span className="text-yellow-400">Under Directorate Screening</span></div>
              </div>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500">
                <Link href="/login">Return to Portal Login</Link>
              </Button>
              <Button variant="outline" onClick={() => setSubmittedApp(null)}>
                Apply for Another Subject
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="border-border/80 bg-slate-900/80 backdrop-blur-md shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-400" />
                <span>Candidate Academic Profile & Experience</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Please provide your highest academic degrees, pedagogical experience, and teaching focus.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">First Name *</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Raghav"
                      required
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Last Name *</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Menon"
                      required
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Email Address *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="raghav.menon@domain.edu"
                      required
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Phone Number *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98110 00000"
                      required
                      className="bg-slate-950 border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Subject / Department *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200"
                    >
                      <option value="Advanced Mathematics">Advanced Mathematics</option>
                      <option value="Physics & Mechanics">Physics & Mechanics</option>
                      <option value="Chemistry Fundamentals">Chemistry Fundamentals</option>
                      <option value="Computer Science & AI">Computer Science & AI</option>
                      <option value="English Literature & Rhetoric">English Literature & Rhetoric</option>
                      <option value="Social Sciences & History">Social Sciences & History</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Teaching Experience (Years) *</label>
                    <Input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      max="35"
                      required
                      className="bg-slate-950 border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Highest Academic Qualification *</label>
                  <Input
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. M.Sc. Applied Physics (DU), B.Ed, NET Qualified"
                    required
                    className="bg-slate-950 border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Teaching Statement & Cover Letter *</label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your classroom management style, student mentorship approach, and pedagogical methodology..."
                    required
                    className="w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 flex items-start space-x-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    Shortlisted candidates are contacted directly by the Principal Directorate for demonstration lecture rounds and credential generation.
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white gap-2 text-xs"
                  >
                    {submitting ? "Submitting Career Profile..." : "Submit Faculty Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-xs text-slate-500">
          Looking for student admission enrollment instead?{" "}
          <Link href="/apply/admission" className="text-indigo-400 hover:underline font-medium">
            Open Student Admission Portal →
          </Link>
        </div>
      </div>
    </div>
  )
}

