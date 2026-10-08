import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://debhfqjgqmlmujrfyrny.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYmhmcWpncW1sbXVqcmZ5cm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MzUxODUsImV4cCI6MjA5NzQxMTE4NX0.DPSP69kfKlhvDFc6OErxIKrdjBsSTj93aHN80A14150"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SupabaseStudent {
  id: string
  first_name: string
  last_name: string
  admission_number: string
  roll_number?: string
  class_grade?: string
  section?: string
  parent_name?: string
  parent_email?: string
  parent_phone?: string
  attendance_percentage?: number
  pending_fee_amount?: number
  academic_gpa?: number
  status?: string
  created_at?: string
}

export interface SupabaseAttendanceRecord {
  id: string
  student_id: string
  campus_id?: string
  class_grade: string
  section: string
  date: string
  status: string
  remarks?: string
  marked_by?: string
}

export interface SupabaseFeeInvoice {
  id: string
  invoice_number: string
  student_id: string
  campus_id?: string
  student_name: string
  class_grade: string
  fee_head: string
  amount: number
  due_date: string
  status: string
  payment_method?: string
  paid_at?: string
}

/**
 * Fetch a student by id or admission number from Supabase
 */
export async function getSupabaseStudent(studentId: string = "std-001") {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single()

    if (error) {
      console.warn("Supabase fetch warning, using local state:", error.message)
      return null
    }
    return data as SupabaseStudent
  } catch (err) {
    console.error("Supabase client connection error:", err)
    return null
  }
}

/**
 * Update student profile/record in Supabase
 */
export async function updateSupabaseStudent(studentId: string, updates: Partial<SupabaseStudent>) {
  try {
    const { data, error } = await supabase
      .from("students")
      .update(updates)
      .eq("id", studentId)
      .select()
      .single()

    if (error) {
      console.warn("Supabase update error:", error.message)
      return null
    }
    return data as SupabaseStudent
  } catch (err) {
    console.error("Supabase client update error:", err)
    return null
  }
}

/**
 * Batch record attendance in Supabase
 */
export async function recordSupabaseAttendance(records: SupabaseAttendanceRecord[]) {
  try {
    const { data, error } = await supabase
      .from("attendance_records")
      .upsert(records)
      .select()

    if (error) {
      console.warn("Supabase attendance insert error:", error.message)
      return null
    }
    return data
  } catch (err) {
    console.error("Supabase attendance recording exception:", err)
    return null
  }
}

/**
 * Create a new fee invoice in Supabase
 */
export async function createSupabaseInvoice(invoice: SupabaseFeeInvoice) {
  try {
    const { data, error } = await supabase
      .from("fee_invoices")
      .insert(invoice)
      .select()
      .single()

    if (error) {
      console.warn("Supabase invoice insert error:", error.message)
      return null
    }
    return data
  } catch (err) {
    console.error("Supabase invoice insert exception:", err)
    return null
  }
}

/**
 * Mark a fee invoice as paid in Supabase
 */
export async function markSupabaseInvoicePaid(invoiceId: string, paymentMethod: string = "UPI_QR") {
  try {
    const { data, error } = await supabase
      .from("fee_invoices")
      .update({
        status: "paid",
        payment_method: paymentMethod,
        paid_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .select()
      .single()

    if (error) {
      console.warn("Supabase mark paid error:", error.message)
      return null
    }
    return data
  } catch (err) {
    console.error("Supabase mark paid exception:", err)
    return null
  }
}
