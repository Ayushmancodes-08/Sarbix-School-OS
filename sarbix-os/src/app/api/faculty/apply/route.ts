import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/data/mock-db"

const jobApplicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number required"),
  subject: z.string().min(2, "Subject/Department is required"),
  qualification: z.string().min(2, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  coverLetter: z.string().min(15, "Please share a brief introduction"),
})

export async function GET() {
  const applications = db.jobApplications.getAll()
  return NextResponse.json({ success: true, data: applications })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = jobApplicationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid job application form",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, subject, qualification, experience, coverLetter } = parsed.data
    const newApp = db.jobApplications.create({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      subject,
      qualification,
      experience: experience.includes("year") ? experience : `${experience} years`,
      coverLetter,
    })

    db.audit.log({
      userId: "public-job-applicant",
      userEmail: email,
      userRole: "applicant" as any,
      campusId: "campus-delhi-01",
      action: "CREATE",
      resource: "faculty_job_application",
      resourceId: newApp.id,
      details: { name: newApp.name, subject: newApp.subject },
      ipAddress: "127.0.0.1",
    })

    return NextResponse.json({
      success: true,
      message: "Job application submitted successfully",
      applicationId: newApp.id,
      data: newApp,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || "Failed to process application" } },
      { status: 500 }
    )
  }
}

