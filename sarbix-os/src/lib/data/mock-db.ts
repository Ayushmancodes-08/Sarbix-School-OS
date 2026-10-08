import bcrypt from "bcryptjs"
import type {
  Campus,
  User,
  Student,
  AttendanceRecord,
  FeeInvoice,
  TimetableSlot,
  AuditLog,
  UserRole,
  PermissionKey,
} from "@/types"

// Role-based default permissions
export const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  super_admin: [
    "overview:view",
    "students:view",
    "students:create",
    "students:edit",
    "students:delete",
    "attendance:view",
    "attendance:mark",
    "academics:view",
    "academics:manage",
    "finance:view",
    "finance:collect",
    "finance:manage",
    "transport:view",
    "transport:manage",
    "users:view",
    "users:manage",
    "reports:view",
    "reports:export",
    "settings:manage",
    "audit:view",
  ],
  principal: [
    "overview:view",
    "students:view",
    "students:create",
    "students:edit",
    "attendance:view",
    "attendance:mark",
    "academics:view",
    "academics:manage",
    "finance:view",
    "transport:view",
    "users:view",
    "reports:view",
    "reports:export",
    "audit:view",
  ],
  branch_admin: [
    "overview:view",
    "students:view",
    "students:create",
    "students:edit",
    "attendance:view",
    "academics:view",
    "finance:view",
    "finance:collect",
    "transport:view",
    "users:view",
    "reports:view",
  ],
  academic_coordinator: [
    "overview:view",
    "students:view",
    "attendance:view",
    "academics:view",
    "academics:manage",
    "reports:view",
  ],
  teacher: [
    "overview:view",
    "students:view",
    "attendance:view",
    "attendance:mark",
    "academics:view",
    "reports:view",
  ],
  student: [
    "overview:view",
    "attendance:view",
    "academics:view",
  ],
  parent: [
    "overview:view",
    "attendance:view",
    "academics:view",
    "finance:view",
    "transport:view",
  ],
  accountant: [
    "overview:view",
    "students:view",
    "finance:view",
    "finance:collect",
    "finance:manage",
    "reports:view",
    "reports:export",
  ],
  transport_manager: [
    "overview:view",
    "students:view",
    "transport:view",
    "transport:manage",
  ],
  front_desk: [
    "overview:view",
    "students:view",
    "students:create",
    "attendance:view",
  ],
}

// Generate shared hash for default test accounts: "Password@123"
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync("Password@123", 10)

export const CAMPUSES: Campus[] = [
  {
    id: "campus-delhi-01",
    name: "Delhi Central Academy",
    code: "DCA",
    slug: "delhi-central",
    address: "Block B, Vasant Vihar, New Delhi 110057",
    phone: "+91 11 4982 9000",
    email: "admin@delhicentral.sarbix.edu",
    isActive: true,
  },
  {
    id: "campus-blr-02",
    name: "Bengaluru South International",
    code: "BSI",
    slug: "bengaluru-south",
    address: "Outer Ring Road, Bellandur, Bengaluru 560103",
    phone: "+91 80 6712 3400",
    email: "info@blr-south.sarbix.edu",
    isActive: true,
  },
]

export const USERS: (User & { passwordHash: string })[] = [
  {
    id: "usr-super-01",
    campusId: "campus-delhi-01",
    email: "superadmin@sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "super_admin",
    firstName: "Aditya",
    lastName: "Singhania",
    phone: "+91 98110 00001",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isActive: true,
    lastLoginAt: "2026-10-08T08:30:00Z",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-10-08T08:30:00Z",
  },
  {
    id: "usr-principal-01",
    campusId: "campus-delhi-01",
    email: "principal@delhi.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "principal",
    firstName: "Dr. Sunita",
    lastName: "Sharma",
    phone: "+91 98110 00002",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    isActive: true,
    lastLoginAt: "2026-10-08T09:15:00Z",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-10-08T09:15:00Z",
  },
  {
    id: "usr-teacher-01",
    campusId: "campus-delhi-01",
    email: "teacher@delhi.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "teacher",
    firstName: "Rajesh",
    lastName: "Verma",
    phone: "+91 98110 00003",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isActive: true,
    lastLoginAt: "2026-10-08T07:45:00Z",
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-10-08T07:45:00Z",
  },
  {
    id: "usr-student-01",
    campusId: "campus-delhi-01",
    email: "student@delhi.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "student",
    firstName: "Aarav",
    lastName: "Patel",
    phone: "+91 98110 00004",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    isActive: true,
    lastLoginAt: "2026-10-07T14:20:00Z",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-10-07T14:20:00Z",
  },
  {
    id: "usr-parent-01",
    campusId: "campus-delhi-01",
    email: "parent@delhi.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "parent",
    firstName: "Vikram",
    lastName: "Patel",
    phone: "+91 98110 00005",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    isActive: true,
    lastLoginAt: "2026-10-08T06:10:00Z",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-10-08T06:10:00Z",
  },
  {
    id: "usr-accountant-01",
    campusId: "campus-delhi-01",
    email: "accountant@delhi.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "accountant",
    firstName: "Meera",
    lastName: "Nair",
    phone: "+91 98110 00006",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    isActive: true,
    lastLoginAt: "2026-10-08T09:00:00Z",
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-10-08T09:00:00Z",
  },
  {
    id: "usr-transport-01",
    campusId: "campus-delhi-01",
    email: "transport@delhi.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "transport_manager",
    firstName: "Gurdeep",
    lastName: "Singh",
    phone: "+91 98110 00007",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    isActive: true,
    lastLoginAt: "2026-10-08T05:30:00Z",
    createdAt: "2026-01-25T00:00:00Z",
    updatedAt: "2026-10-08T05:30:00Z",
  },
  // Quick test aliases matching documentation
  {
    id: "usr-principal-alias",
    campusId: "campus-delhi-01",
    email: "principal@delhicentral.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "principal",
    firstName: "Dr. Sunita",
    lastName: "Sharma",
    phone: "+91 98110 00002",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    id: "usr-teacher-alias",
    campusId: "campus-delhi-01",
    email: "teacher.math@delhicentral.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "teacher",
    firstName: "Rajesh",
    lastName: "Verma",
    phone: "+91 98110 00003",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    id: "usr-student-alias",
    campusId: "campus-delhi-01",
    email: "aarav.sharma@student.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "student",
    firstName: "Aarav",
    lastName: "Sharma",
    phone: "+91 98110 00004",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    id: "usr-parent-alias",
    campusId: "campus-delhi-01",
    email: "rajesh.sharma@parent.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "parent",
    firstName: "Rajesh",
    lastName: "Sharma",
    phone: "+91 98110 00005",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    isActive: true,
  },
  {
    id: "usr-finance-alias",
    campusId: "campus-delhi-01",
    email: "finance@delhicentral.sarbix.edu",
    passwordHash: DEFAULT_PASSWORD_HASH,
    role: "accountant",
    firstName: "Meera",
    lastName: "Nair",
    phone: "+91 98110 00006",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    isActive: true,
  },
]

export const STUDENTS: Student[] = [
  {
    id: "std-001",
    campusId: "campus-delhi-01",
    userId: "usr-student-01",
    admissionNumber: "ADM-2026-0891",
    rollNumber: "10A-14",
    firstName: "Aarav",
    lastName: "Patel",
    dateOfBirth: "2010-04-15",
    gender: "male",
    bloodGroup: "O+",
    classGrade: "Grade 10",
    section: "A",
    status: "active",
    emergencyContactName: "Vikram Patel (Father)",
    emergencyContactPhone: "+91 98110 00005",
    address: "C-42 Hauz Khas Enclave, New Delhi",
    parentName: "Vikram Patel",
    parentEmail: "parent@delhi.sarbix.edu",
    parentPhone: "+91 98110 00005",
    attendancePercentage: 94.8,
    pendingFeeAmount: 18500,
    academicGpa: 3.82,
    busRouteNumber: "Route 04 (South Delhi Express)",
  },
  {
    id: "std-002",
    campusId: "campus-delhi-01",
    admissionNumber: "ADM-2026-0892",
    rollNumber: "10A-15",
    firstName: "Ananya",
    lastName: "Iyer",
    dateOfBirth: "2010-07-22",
    gender: "female",
    bloodGroup: "B+",
    classGrade: "Grade 10",
    section: "A",
    status: "active",
    emergencyContactName: "Ramesh Iyer",
    emergencyContactPhone: "+91 98220 11112",
    address: "12 Gulmohar Park, New Delhi",
    parentName: "Ramesh Iyer",
    parentEmail: "ramesh.iyer@gmail.com",
    parentPhone: "+91 98220 11112",
    attendancePercentage: 98.2,
    pendingFeeAmount: 0,
    academicGpa: 3.95,
    busRouteNumber: "Route 04 (South Delhi Express)",
  },
  {
    id: "std-003",
    campusId: "campus-delhi-01",
    admissionNumber: "ADM-2026-0893",
    rollNumber: "10A-16",
    firstName: "Kabir",
    lastName: "Mehta",
    dateOfBirth: "2010-09-03",
    gender: "male",
    bloodGroup: "A+",
    classGrade: "Grade 10",
    section: "A",
    status: "active",
    emergencyContactName: "Sunil Mehta",
    emergencyContactPhone: "+91 98330 22223",
    address: "45 Panchsheel Park, New Delhi",
    parentName: "Sunil Mehta",
    parentEmail: "sunil.mehta@yahoo.com",
    parentPhone: "+91 98330 22223",
    attendancePercentage: 86.4,
    pendingFeeAmount: 32000,
    academicGpa: 3.45,
    busRouteNumber: "Route 02 (Central Metro Line)",
  },
  {
    id: "std-004",
    campusId: "campus-delhi-01",
    admissionNumber: "ADM-2026-0894",
    rollNumber: "10B-08",
    firstName: "Zoya",
    lastName: "Khan",
    dateOfBirth: "2010-11-12",
    gender: "female",
    bloodGroup: "AB+",
    classGrade: "Grade 10",
    section: "B",
    status: "active",
    emergencyContactName: "Farhan Khan",
    emergencyContactPhone: "+91 98440 33334",
    address: "88 Greater Kailash 1, New Delhi",
    parentName: "Farhan Khan",
    parentEmail: "farhan.khan@outlook.com",
    parentPhone: "+91 98440 33334",
    attendancePercentage: 92.1,
    pendingFeeAmount: 0,
    academicGpa: 3.70,
    busRouteNumber: "Route 07 (GK Circle)",
  },
  {
    id: "std-005",
    campusId: "campus-delhi-01",
    admissionNumber: "ADM-2026-0895",
    rollNumber: "9A-02",
    firstName: "Rohan",
    lastName: "Deshmukh",
    dateOfBirth: "2011-02-18",
    gender: "male",
    bloodGroup: "O-",
    classGrade: "Grade 9",
    section: "A",
    status: "active",
    emergencyContactName: "Nitin Deshmukh",
    emergencyContactPhone: "+91 98550 44445",
    address: "21 Defense Colony, New Delhi",
    parentName: "Nitin Deshmukh",
    parentEmail: "nitin.d@gmail.com",
    parentPhone: "+91 98550 44445",
    attendancePercentage: 96.0,
    pendingFeeAmount: 12000,
    academicGpa: 3.65,
    busRouteNumber: "Route 01 (Ring Road Line)",
  },
  {
    id: "std-006",
    campusId: "campus-delhi-01",
    admissionNumber: "ADM-2026-0896",
    rollNumber: "11Sci-05",
    firstName: "Diya",
    lastName: "Kapoor",
    dateOfBirth: "2009-08-30",
    gender: "female",
    bloodGroup: "B-",
    classGrade: "Grade 11",
    section: "Science-A",
    status: "active",
    emergencyContactName: "Sanjay Kapoor",
    emergencyContactPhone: "+91 98660 55556",
    address: "7 Shanti Niketan, New Delhi",
    parentName: "Sanjay Kapoor",
    parentEmail: "sanjay.kapoor@corp.in",
    parentPhone: "+91 98660 55556",
    attendancePercentage: 91.5,
    pendingFeeAmount: 24500,
    academicGpa: 3.88,
    busRouteNumber: "Route 04 (South Delhi Express)",
  },
]

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: "att-001",
    studentId: "std-001",
    campusId: "campus-delhi-01",
    classGrade: "Grade 10",
    section: "A",
    date: "2026-10-08",
    status: "present",
    markedBy: "usr-teacher-01",
  },
  {
    id: "att-002",
    studentId: "std-002",
    campusId: "campus-delhi-01",
    classGrade: "Grade 10",
    section: "A",
    date: "2026-10-08",
    status: "present",
    markedBy: "usr-teacher-01",
  },
  {
    id: "att-003",
    studentId: "std-003",
    campusId: "campus-delhi-01",
    classGrade: "Grade 10",
    section: "A",
    date: "2026-10-08",
    status: "late",
    remarks: "Bus traffic delay at Ring Road junction",
    markedBy: "usr-teacher-01",
  },
  {
    id: "att-004",
    studentId: "std-004",
    campusId: "campus-delhi-01",
    classGrade: "Grade 10",
    section: "B",
    date: "2026-10-08",
    status: "present",
    markedBy: "usr-teacher-01",
  },
]

export const FEE_INVOICES: FeeInvoice[] = [
  {
    id: "inv-2026-101",
    invoiceNumber: "INV-2026-00891",
    studentId: "std-001",
    campusId: "campus-delhi-01",
    studentName: "Aarav Patel",
    classGrade: "Grade 10-A",
    feeHead: "Term II Tuition & STEM Lab",
    amount: 35000,
    paidAmount: 16500,
    balanceAmount: 18500,
    dueDate: "2026-10-25",
    status: "partial",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-2026-102",
    invoiceNumber: "INV-2026-00892",
    studentId: "std-002",
    campusId: "campus-delhi-01",
    studentName: "Ananya Iyer",
    classGrade: "Grade 10-A",
    feeHead: "Term II Comprehensive Fee",
    amount: 38000,
    paidAmount: 38000,
    balanceAmount: 0,
    dueDate: "2026-10-25",
    status: "paid",
    paidAt: "2026-09-15T11:20:00Z",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-2026-103",
    invoiceNumber: "INV-2026-00893",
    studentId: "std-003",
    campusId: "campus-delhi-01",
    studentName: "Kabir Mehta",
    classGrade: "Grade 10-A",
    feeHead: "Term II Comprehensive Fee + Transport",
    amount: 42000,
    paidAmount: 10000,
    balanceAmount: 32000,
    dueDate: "2026-10-15",
    status: "partial",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-2026-104",
    invoiceNumber: "INV-2026-00895",
    studentId: "std-005",
    campusId: "campus-delhi-01",
    studentName: "Rohan Deshmukh",
    classGrade: "Grade 9-A",
    feeHead: "Term II Tuition Fee",
    amount: 32000,
    paidAmount: 20000,
    balanceAmount: 12000,
    dueDate: "2026-10-20",
    status: "partial",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "inv-2026-105",
    invoiceNumber: "INV-2026-00896",
    studentId: "std-006",
    campusId: "campus-delhi-01",
    studentName: "Diya Kapoor",
    classGrade: "Grade 11 Science",
    feeHead: "Senior Science Lab + Term II Fee",
    amount: 44500,
    paidAmount: 20000,
    balanceAmount: 24500,
    dueDate: "2026-10-30",
    status: "partial",
    createdAt: "2026-09-01T00:00:00Z",
  },
]

export const TIMETABLE_SLOTS: TimetableSlot[] = [
  {
    id: "tt-001",
    dayOfWeek: "Thursday",
    startTime: "08:30 AM",
    endTime: "09:15 AM",
    subjectName: "Advanced Mathematics",
    subjectCode: "MATH-101",
    classGrade: "Grade 10",
    section: "A",
    roomNumber: "Room 302 (STEM Wing)",
    teacherName: "Prof. Rajesh Verma",
  },
  {
    id: "tt-002",
    dayOfWeek: "Thursday",
    startTime: "09:20 AM",
    endTime: "10:05 AM",
    subjectName: "Physics: Thermodynamics",
    subjectCode: "PHYS-102",
    classGrade: "Grade 10",
    section: "A",
    roomNumber: "Lab B3 (Physics Wing)",
    teacherName: "Dr. Alok Sen",
  },
  {
    id: "tt-003",
    dayOfWeek: "Thursday",
    startTime: "10:25 AM",
    endTime: "11:10 AM",
    subjectName: "English Literature",
    subjectCode: "ENG-103",
    classGrade: "Grade 10",
    section: "A",
    roomNumber: "Room 302",
    teacherName: "Ms. Shalini Gupta",
  },
  {
    id: "tt-004",
    dayOfWeek: "Thursday",
    startTime: "11:15 AM",
    endTime: "12:00 PM",
    subjectName: "Computer Science & AI",
    subjectCode: "CS-104",
    classGrade: "Grade 10",
    section: "A",
    roomNumber: "Innovation Lab 1",
    teacherName: "Mr. Tanmay Roy",
  },
]

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-001",
    userId: "usr-principal-01",
    userEmail: "principal@delhi.sarbix.edu",
    userRole: "principal",
    campusId: "campus-delhi-01",
    action: "UPDATE",
    resource: "attendance",
    resourceId: "att-003",
    details: { reason: "Approved bus traffic delay excuse for Grade 10-A" },
    ipAddress: "192.168.1.104",
    createdAt: "2026-10-08T09:18:22Z",
  },
  {
    id: "log-002",
    userId: "usr-accountant-01",
    userEmail: "accountant@delhi.sarbix.edu",
    userRole: "accountant",
    campusId: "campus-delhi-01",
    action: "CREATE",
    resource: "finance_receipt",
    resourceId: "inv-2026-101",
    details: { amount: 16500, mode: "UPI_NETBANKING" },
    ipAddress: "192.168.1.112",
    createdAt: "2026-10-08T08:52:10Z",
  },
]

// In-Memory Database Accessor functions
export const db = {
  campuses: {
    getAll: () => CAMPUSES,
    getById: (id: string) => CAMPUSES.find((c) => c.id === id),
  },
  users: {
    getAll: () => USERS,
    getById: (id: string) => USERS.find((u) => u.id === id),
    getByEmail: (email: string) => USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()),
    create: (newUser: User & { passwordHash: string }) => {
      USERS.push(newUser)
      return newUser
    },
  },
  students: {
    getAll: (campusId?: string) =>
      campusId ? STUDENTS.filter((s) => s.campusId === campusId) : STUDENTS,
    getById: (id: string) => STUDENTS.find((s) => s.id === id),
    create: (student: Student) => {
      STUDENTS.unshift(student)
      return student
    },
    update: (id: string, updates: Partial<Student>) => {
      const idx = STUDENTS.findIndex((s) => s.id === id)
      if (idx === -1) return null
      STUDENTS[idx] = { ...STUDENTS[idx], ...updates }
      return STUDENTS[idx]
    },
  },
  attendance: {
    getByDateAndClass: (campusId: string, date: string, grade: string, section: string) =>
      ATTENDANCE_RECORDS.filter(
        (a) =>
          a.campusId === campusId &&
          a.date === date &&
          a.classGrade === grade &&
          a.section === section
      ),
    getByStudent: (studentId: string) =>
      ATTENDANCE_RECORDS.filter((a) => a.studentId === studentId),
    upsert: (records: AttendanceRecord[]) => {
      records.forEach((rec) => {
        const existingIdx = ATTENDANCE_RECORDS.findIndex(
          (a) => a.studentId === rec.studentId && a.date === rec.date
        )
        if (existingIdx >= 0) {
          ATTENDANCE_RECORDS[existingIdx] = rec
        } else {
          ATTENDANCE_RECORDS.push(rec)
        }

        // Live sync student attendance stats
        const student = STUDENTS.find((s) => s.id === rec.studentId)
        if (student) {
          const studentRecords = ATTENDANCE_RECORDS.filter((a) => a.studentId === rec.studentId)
          const presents = studentRecords.filter((a) => a.status === "present" || a.status === "late").length
          if (studentRecords.length > 0) {
            student.attendancePercentage = Number(((presents / studentRecords.length) * 100).toFixed(1))
          }
        }
      })
      return true
    },
  },
  fees: {
    getAll: (campusId?: string) =>
      campusId ? FEE_INVOICES.filter((f) => f.campusId === campusId) : FEE_INVOICES,
    getById: (id: string) => FEE_INVOICES.find((f) => f.id === id),
    createInvoice: (invoice: FeeInvoice) => {
      FEE_INVOICES.unshift(invoice)
      const student = STUDENTS.find((s) => s.id === invoice.studentId)
      if (student) {
        student.pendingFeeAmount = (student.pendingFeeAmount || 0) + (invoice.balanceAmount || invoice.amount || 0)
      }
      return invoice
    },
    recordPayment: (id: string, amount: number) => {
      const inv = FEE_INVOICES.find((f) => f.id === id)
      if (!inv) return null
      inv.paidAmount += amount
      const total = inv.amount ?? inv.totalAmount ?? 0
      inv.balanceAmount = Math.max(0, total - inv.paidAmount)
      inv.status = inv.balanceAmount === 0 ? "paid" : "partial"
      inv.paidAt = new Date().toISOString()

      // Live sync student fee balance
      const student = STUDENTS.find((s) => s.id === inv.studentId)
      if (student && student.pendingFeeAmount !== undefined) {
        student.pendingFeeAmount = Math.max(0, student.pendingFeeAmount - amount)
      }
      return inv
    },
  },
  timetable: {
    getByClass: (grade: string, section: string) =>
      TIMETABLE_SLOTS.filter((t) => t.classGrade === grade && t.section === section),
  },
  audit: {
    log: (entry: Omit<AuditLog, "id" | "createdAt">) => {
      const logEntry: AuditLog = {
        ...entry,
        id: `log-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      AUDIT_LOGS.unshift(logEntry)
      return logEntry
    },
    getAll: (campusId?: string) =>
      campusId ? AUDIT_LOGS.filter((l) => l.campusId === campusId) : AUDIT_LOGS,
  },
  transport: {
    getVehicles: (campusId?: string) =>
      campusId ? VEHICLES.filter((v) => v.campusId === campusId) : VEHICLES,
    getRoutes: (campusId?: string) =>
      campusId ? ROUTES.filter((r) => r.campusId === campusId) : ROUTES,
  },
  academics: {
    getHomework: (classGrade?: string, section?: string) => {
      if (classGrade && section) {
        return HOMEWORK_ITEMS.filter((h) => h.classGrade === classGrade && h.section === section)
      }
      return HOMEWORK_ITEMS
    },
    getExams: (classGrade?: string) => {
      if (classGrade) {
        return EXAMS_LIST.filter((e) => e.classGrade === classGrade)
      }
      return EXAMS_LIST
    },
  },
  parents: {
    getChildren: (parentEmail: string) => {
      const matched = STUDENTS.filter(
        (s) => s.parentEmail?.toLowerCase() === parentEmail.toLowerCase()
      )
      // Fallback to first 2 students for test accounts
      return matched.length > 0 ? matched : [STUDENTS[0], STUDENTS[1]]
    },
  },
}

export const VEHICLES = [
  {
    id: "veh-01",
    campusId: "campus-delhi-01",
    vehicleNumber: "Bus #04",
    registrationNumber: "DL-01-EA-9821",
    driverName: "Gurdeep Singh",
    driverPhone: "+91 98110 54321",
    capacity: 42,
    assignedCount: 38,
    status: "ACTIVE" as const,
    currentLocation: "Vasant Vihar Ring Road (Stop 4/7)",
    lastTelemetryPing: "Just now",
    speedKmH: 34,
  },
  {
    id: "veh-02",
    campusId: "campus-delhi-01",
    vehicleNumber: "Bus #09",
    registrationNumber: "DL-01-EA-4412",
    driverName: "Ram Charan",
    driverPhone: "+91 98110 54322",
    capacity: 42,
    assignedCount: 40,
    status: "ACTIVE" as const,
    currentLocation: "Hauz Khas Metro Station (Stop 6/8)",
    lastTelemetryPing: "1 min ago",
    speedKmH: 28,
  },
  {
    id: "veh-03",
    campusId: "campus-delhi-01",
    vehicleNumber: "Bus #12",
    registrationNumber: "DL-01-EA-7800",
    driverName: "Satish Kumar",
    driverPhone: "+91 98110 54323",
    capacity: 32,
    assignedCount: 29,
    status: "ACTIVE" as const,
    currentLocation: "Green Park Extension",
    lastTelemetryPing: "2 mins ago",
    speedKmH: 42,
  },
  {
    id: "veh-04",
    campusId: "campus-delhi-01",
    vehicleNumber: "Van #02",
    registrationNumber: "DL-01-VA-1109",
    driverName: "Mohd. Shakeel",
    driverPhone: "+91 98110 54324",
    capacity: 18,
    assignedCount: 16,
    status: "MAINTENANCE" as const,
    currentLocation: "Campus Depot Service Bay",
    lastTelemetryPing: "3 hours ago",
    speedKmH: 0,
  },
]

export const ROUTES = [
  {
    id: "rt-01",
    campusId: "campus-delhi-01",
    name: "Route 04 (South Delhi Express)",
    vehicleNumber: "Bus #04",
    driverName: "Gurdeep Singh",
    driverPhone: "+91 98110 54321",
    totalStops: 7,
    morningPickupStart: "06:45 AM",
    eveningDropComplete: "03:45 PM",
    stops: [
      { name: "Saket Metro Station Gate 2", time: "06:45 AM", studentsCount: 8 },
      { name: "Malviya Nagar Market", time: "06:58 AM", studentsCount: 6 },
      { name: "Hauz Khas Enclave", time: "07:10 AM", studentsCount: 10 },
      { name: "IIT Flyover Crossing", time: "07:22 AM", studentsCount: 5 },
      { name: "Munirka DDA Flats", time: "07:35 AM", studentsCount: 9 },
      { name: "Sarbix DCA Campus Terminal", time: "07:50 AM", studentsCount: 38 },
    ],
  },
  {
    id: "rt-02",
    campusId: "campus-delhi-01",
    name: "Route 09 (Central Corridor)",
    vehicleNumber: "Bus #09",
    driverName: "Ram Charan",
    driverPhone: "+91 98110 54322",
    totalStops: 8,
    morningPickupStart: "06:40 AM",
    eveningDropComplete: "03:55 PM",
    stops: [
      { name: "Lajpat Nagar Ring Road", time: "06:40 AM", studentsCount: 7 },
      { name: "Defence Colony Flyover", time: "06:55 AM", studentsCount: 6 },
      { name: "South Extension Part 2", time: "07:10 AM", studentsCount: 11 },
      { name: "AIIMS Gate 3", time: "07:25 AM", studentsCount: 5 },
      { name: "Safdarjung Enclave", time: "07:38 AM", studentsCount: 11 },
      { name: "Sarbix DCA Campus Terminal", time: "07:52 AM", studentsCount: 40 },
    ],
  },
]

export const HOMEWORK_ITEMS = [
  {
    id: "hw-01",
    campusId: "campus-delhi-01",
    classGrade: "Grade 10",
    section: "A",
    subject: "Advanced Mathematics",
    title: "Quadratic Equations Problem Set & Proofs",
    description: "Complete problems 14 through 28 from Chapter 4. Include graph sketches for questions 22 and 26.",
    assignedDate: "2026-10-06",
    dueDate: "2026-10-10",
    teacherName: "Mr. Rajesh Verma",
    maxScore: 25,
    submissionStatus: "PENDING" as const,
  },
  {
    id: "hw-02",
    campusId: "campus-delhi-01",
    classGrade: "Grade 10",
    section: "A",
    subject: "Physics & Mechanics",
    title: "Ray Optics Ray Diagrams Lab Report",
    description: "Submit written observations of the convex lens focal length experiment with calculated errors.",
    assignedDate: "2026-10-05",
    dueDate: "2026-10-09",
    teacherName: "Dr. Sunita Sharma",
    maxScore: 30,
    submissionStatus: "SUBMITTED" as const,
  },
  {
    id: "hw-03",
    campusId: "campus-delhi-01",
    classGrade: "Grade 10",
    section: "A",
    subject: "Computer Science & AI",
    title: "Python Data Structures & Recursion Exercise",
    description: "Implement binary search and recursive tree traversal in clean, formatted Python with comments.",
    assignedDate: "2026-10-07",
    dueDate: "2026-10-12",
    teacherName: "Mr. Tanmay Roy",
    maxScore: 50,
    submissionStatus: "PENDING" as const,
  },
]

export const EXAMS_LIST = [
  {
    id: "ex-01",
    campusId: "campus-delhi-01",
    name: "Term 1 Comprehensive Assessment 2026",
    type: "TERM_EXAM",
    startDate: "2026-10-24",
    endDate: "2026-11-04",
    classGrade: "Grade 10",
    status: "UPCOMING" as const,
    subjects: [
      { name: "Advanced Mathematics", date: "2026-10-24", maxMarks: 100 },
      { name: "Physics & Mechanics", date: "2026-10-27", maxMarks: 100 },
      { name: "Chemistry Fundamentals", date: "2026-10-30", maxMarks: 100 },
      { name: "Computer Science & AI", date: "2026-11-02", maxMarks: 100 },
      { name: "English Literature & Composition", date: "2026-11-04", maxMarks: 100 },
    ],
  },
]
