"use client"

import * as React from "react"
import Link from "next/link"
import {
  GraduationCap,
  User,
  Heart,
  Bus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function StudentAdmissionApplicationPage() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = React.useState(false)
  const [submittedApp, setSubmittedApp] = React.useState<{
    admissionNumber: string
    name: string
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/students/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to submit admission application")
      }

      setSubmittedApp({
        admissionNumber: json.data?.admissionNumber || "ADM-2026-PENDING",
        name: `${formData.firstName} ${formData.lastName}`,
      })
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.")
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
            <GraduationCap className="h-4 w-4" />
            <span>Sarbix Institutional Admissions · Academic Session 2026-27</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Online Student Admission Portal
          </h1>
          <p className="text-sm text-slate-400">
            Submit prospective enrollment for nursery through Grade 12. Instant review by Campus Admissions Office.
          </p>
        </div>

        {submittedApp ? (
          <Card className="border-indigo-500/30 bg-slate-900/90 shadow-2xl p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Admission Application Lodged!</h2>
              <p className="text-sm text-slate-400">
                Thank you for applying. A profile has been staged for <strong className="text-indigo-400">{submittedApp.name}</strong>.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-border inline-block text-left font-mono text-xs space-y-1">
                <div><span className="text-slate-500">Application Number:</span> <span className="text-emerald-400 font-bold">{submittedApp.admissionNumber}</span></div>
                <div><span className="text-slate-500">Status:</span> <span className="text-yellow-400">Awaiting Principal Review</span></div>
                <div><span className="text-slate-500">Assigned Campus:</span> <span>Delhi Central Campus</span></div>
              </div>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-indigo-600 hover:bg-indigo-500">
                <Link href="/login">Return to Login</Link>
              </Button>
              <Button variant="outline" onClick={() => { setSubmittedApp(null); setStep(1); }}>
                Submit Another Application
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="border-border/80 bg-slate-900/80 backdrop-blur-md shadow-2xl">
            {/* Step Indicators */}
            <div className="grid grid-cols-3 border-b border-border text-center text-xs font-medium">
              <div className={`py-3.5 border-b-2 transition-colors ${step === 1 ? "border-indigo-500 text-indigo-400 font-semibold" : "border-transparent text-slate-500"}`}>
                1. Student Info
              </div>
              <div className={`py-3.5 border-b-2 transition-colors ${step === 2 ? "border-indigo-500 text-indigo-400 font-semibold" : "border-transparent text-slate-500"}`}>
                2. Guardian Particulars
              </div>
              <div className={`py-3.5 border-b-2 transition-colors ${step === 3 ? "border-indigo-500 text-indigo-400 font-semibold" : "border-transparent text-slate-500"}`}>
                3. Transport & Emergency
              </div>
            </div>

            <CardContent className="pt-6">
              {error && (
                <div className="mb-6 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">First Name *</label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="e.g. Riya"
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
                          placeholder="e.g. Sen"
                          required
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Date of Birth *</label>
                        <Input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          className="bg-slate-950 border-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200"
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Blood Group</label>
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          className="w-full h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200"
                        >
                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="O+">O+</option>
                          <option value="AB+">AB+</option>
                          <option value="O-">O-</option>
                          <option value="B-">B-</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Applying Grade *</label>
                        <select
                          name="classGrade"
                          value={formData.classGrade}
                          onChange={handleChange}
                          className="w-full h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200"
                        >
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Preferred Section</label>
                        <select
                          name="section"
                          value={formData.section}
                          onChange={handleChange}
                          className="w-full h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200"
                        >
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => {
                          if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
                            setError("Please fill all required student personal fields.")
                            return
                          }
                          setError(null)
                          setStep(2)
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 gap-2 text-xs"
                      >
                        <span>Continue to Guardian Info</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Parent / Legal Guardian Name *</label>
                      <Input
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        placeholder="e.g. Alok Sen"
                        required
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Guardian Email Address *</label>
                        <Input
                          type="email"
                          name="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleChange}
                          placeholder="guardian@example.com"
                          required
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Mobile / WhatsApp Number *</label>
                        <Input
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleChange}
                          placeholder="+91 98100 00000"
                          required
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Residential Street Address *</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. 42 Panchsheel Park, New Delhi"
                        required
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2 text-xs">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          if (!formData.parentName || !formData.parentEmail || !formData.parentPhone || !formData.address) {
                            setError("Please fill all required guardian fields.")
                            return
                          }
                          setError(null)
                          setStep(3)
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 gap-2 text-xs"
                      >
                        <span>Continue to Transport</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Emergency Contact Person *</label>
                        <Input
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleChange}
                          placeholder="e.g. Sunita Sen (Aunt)"
                          required
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">Emergency Phone *</label>
                        <Input
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                          placeholder="+91 98200 11111"
                          required
                          className="bg-slate-950 border-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Institutional Bus Route</label>
                      <select
                        name="busRouteNumber"
                        value={formData.busRouteNumber}
                        onChange={handleChange}
                        className="w-full h-9 rounded-md border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200"
                      >
                        <option value="Route 04 (South Delhi Express)">Route 04 (South Delhi Express - Saket / Hauz Khas)</option>
                        <option value="Route 09 (Central Corridor)">Route 09 (Central Corridor - Lajpat / AIIMS)</option>
                        <option value="Self / Private Drop">Private Transit (Self-arranged pickup & drop)</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 flex items-start space-x-2">
                      <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>
                        By submitting, you certify that all information provided is accurate and consent to document verification by the Sarbix Admissions Directorate.
                      </span>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-2 text-xs">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white gap-2 text-xs"
                      >
                        {submitting ? "Submitting Application..." : "Submit Admission Application"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-xs text-slate-500">
          Already registered or faculty staff?{" "}
          <Link href="/login" className="text-indigo-400 hover:underline font-medium">
            Access Staff & Student Sign In →
          </Link>
        </div>
      </div>
    </div>
  )
}

