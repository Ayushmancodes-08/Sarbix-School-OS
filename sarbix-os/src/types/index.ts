/**
 * SARBIX SCHOOL OPERATING SYSTEM — CANONICAL DOMAIN TYPES
 * Source of Truth: 05_CANONICAL_DATABASE_SCHEMA.md & TARGET_STATE.md
 */

// ============================================================================
// 1. TENANCY & CAMPUS SCOPING
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  type: 'SCHOOL' | 'COLLEGE' | 'NETWORK';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Campus {
  id: string;
  organizationId?: string;
  name: string;
  code: string;
  address: string;
  timezone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

// ============================================================================
// 2. IDENTITY, ROLES & PERMISSIONS
// ============================================================================

export type CanonicalRole =
  | 'PRINCIPAL'
  | 'ADMIN_OFFICE'
  | 'ACCOUNTS'
  | 'TEACHER'
  | 'PARENT'
  | 'STUDENT'
  | 'TRANSPORT'
  | 'IT_ADMIN'
  | 'HOSTEL_WARDEN'
  | 'super_admin'
  | 'principal'
  | 'branch_admin'
  | 'academic_coordinator'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'transport_manager'
  | 'front_desk';

export type UserRole = CanonicalRole;
export type PermissionKey = string;
export type FeeInvoice = Invoice;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  avatarUrl?: string;
  role: UserRole;
  campusId: string;
  permissions: PermissionKey[];
  isActive?: boolean;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'INVITED' | 'active' | 'suspended';
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  campusId?: string;
  role?: CanonicalRole;
  isActive?: boolean;
}

export interface Role {
  id: string;
  key: CanonicalRole;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  key: string;
  module: string;
  description: string;
}

export interface UserRoleAssignment {
  userId: string;
  roleKey: CanonicalRole;
  campusId: string;
  roleName: string;
}

export interface AuthenticatedSession {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    isActive: boolean;
  };
  roles: CanonicalRole[];
  activeRole: CanonicalRole;
  campusId: string;
  campusName: string;
  permissions: string[];
}

// ============================================================================
// 3. ACADEMIC STRUCTURE
// ============================================================================

export interface AcademicYear {
  id: string;
  campusId: string;
  name: string;
  startsOn: string;
  endsOn: string;
  status: 'ACTIVE' | 'UPCOMING' | 'ARCHIVED';
}

export interface Term {
  id: string;
  academicYearId: string;
  name: string;
  startsOn: string;
  endsOn: string;
}

export interface Grade {
  id: string;
  campusId: string;
  name: string;
  sequence: number;
}

export interface Section {
  id: string;
  gradeId: string;
  name: string;
  capacity: number;
}

export interface Subject {
  id: string;
  campusId: string;
  code: string;
  name: string;
  type: 'CORE' | 'ELECTIVE' | 'LAB';
}

export interface Room {
  id: string;
  campusId: string;
  code: string;
  name: string;
  type: 'CLASSROOM' | 'LAB' | 'HALL' | 'FACULTY_ROOM';
  capacity: number;
}

export interface ClassSubject {
  id: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  roomId?: string;
  academicYearId: string;
  sectionName?: string;
  subjectName?: string;
  teacherName?: string;
}

export interface TimetableSlot {
  id: string;
  classSubjectId?: string;
  weekday?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  periodNumber?: number;
  startsAt?: string; // HH:mm
  endsAt?: string;   // HH:mm
  roomId?: string;
  roomNumber?: string;
  startTime?: string;
  endTime?: string;
  subjectCode?: string;
  subjectName?: string;
  teacherName?: string;
  sectionName?: string;
  dayOfWeek?: string;
  classGrade?: string;
  section?: string;
}

// ============================================================================
// 4. STUDENT & GUARDIAN DOMAIN
// ============================================================================

export interface Student {
  id: string;
  campusId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  status: 'ENROLLED' | 'WITHDRAWN' | 'GRADUATED' | 'SUSPENDED' | 'active' | 'inactive';
  admissionDate?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  // UI & denormalized projection convenience fields
  rollNumber?: string;
  classGrade?: string;
  section?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  attendancePercentage?: number;
  pendingFeeAmount?: number;
  academicGpa?: number;
  busRouteNumber?: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  academicYearId: string;
  gradeId: string;
  sectionId: string;
  rollNumber: string;
  status: 'ACTIVE' | 'PROMOTED' | 'REPEATING' | 'TRANSFERRED';
  gradeName?: string;
  sectionName?: string;
}

export interface Guardian {
  id: string;
  userId?: string;
  name: string;
  relationship: 'FATHER' | 'MOTHER' | 'LEGAL_GUARDIAN' | 'OTHER';
  phone: string;
  email: string;
  address?: string;
  occupation?: string;
}

export interface StudentGuardian {
  studentId: string;
  guardianId: string;
  isPrimary: boolean;
  pickupAuthorized: boolean;
  guardian?: Guardian;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  documentType: 'BIRTH_CERTIFICATE' | 'TRANSFER_CERTIFICATE' | 'MEDICAL_RECORD' | 'ID_PROOF';
  fileName: string;
  storageKey: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
}

export interface StudentEvent {
  id: string;
  studentId: string;
  eventType: 'ACHIEVEMENT' | 'INTERVENTION' | 'PTM_NOTE' | 'DISCIPLINARY' | 'MEDICAL';
  title: string;
  description: string;
  occurredAt: string;
  createdBy: string;
}

// ============================================================================
// 5. ADMISSIONS PIPELINE
// ============================================================================

export interface AdmissionCycle {
  id: string;
  campusId: string;
  name: string;
  academicYearId: string;
  opensOn: string;
  closesOn: string;
  targetGradeId: string;
  capacity: number;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING';
}

export interface AdmissionApplication {
  id: string;
  admissionCycleId: string;
  applicantFirstName: string;
  applicantLastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  applyingForGrade: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address?: string;
  previousSchool?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSESSMENT_SCHEDULED' | 'WAITLISTED' | 'OFFERED' | 'ENROLLED' | 'REJECTED';
  submittedAt: string;
  assessmentScore?: number;
  notes?: string;
}

// ============================================================================
// 6. ATTENDANCE DOMAIN
// ============================================================================

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'HOLIDAY' | 'present' | 'absent' | 'late' | 'excused' | 'holiday';

export interface AttendanceSession {
  id: string;
  classSubjectId?: string;
  date: string; // YYYY-MM-DD
  sessionType: 'DAILY' | 'PERIOD';
  periodNumber?: number;
  recordedBy: string;
  status: 'CONSOLIDATED' | 'DRAFT';
  createdAt: string;
  campusId?: string;
  classGrade?: string;
  section?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId?: string;
  studentId: string;
  status: AttendanceStatus;
  markedAt?: string;
  markedBy: string;
  source?: 'MANUAL' | 'RFID' | 'BIOMETRIC';
  correctionReason?: string;
  remarks?: string;
  studentName?: string;
  rollNumber?: string;
  campusId?: string;
  date?: string;
  classGrade?: string;
  section?: string;
}

// ============================================================================
// 7. ACADEMICS, ASSIGNMENTS & EXAMS
// ============================================================================

export interface Assignment {
  id: string;
  classSubjectId: string;
  title: string;
  description: string;
  dueAt: string;
  maxScore: number;
  createdBy: string;
  createdAt: string;
  subjectName?: string;
  sectionName?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  storageKey?: string;
  score?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'LATE' | 'PENDING';
}

export interface Exam {
  id: string;
  academicYearId: string;
  name: string;
  type: 'MID_TERM' | 'FINAL' | 'UNIT_TEST';
  startsOn: string;
  endsOn: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'PUBLISHED';
}

export interface ExamSubject {
  id: string;
  examId: string;
  subjectId: string;
  date: string;
  maxMarks: number;
  passMarks: number;
  subjectName?: string;
}

export interface ExamResult {
  id: string;
  examSubjectId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
  remarks?: string;
  enteredBy: string;
  updatedAt: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  termId: string;
  generatedAt: string;
  publishedAt?: string;
  overallGpa: number;
  overallGrade: string;
  attendancePercentage: number;
  status: 'DRAFT' | 'PUBLISHED';
}

// ============================================================================
// 8. FINANCE & FEE ENGINE
// ============================================================================

export type InvoiceStatus = 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE' | 'CANCELLED' | 'paid' | 'partial' | 'due' | 'overdue' | 'cancelled';

export interface FeeStructure {
  id: string;
  campusId: string;
  academicYearId: string;
  gradeId?: string;
  name: string;
  description?: string;
  components: FeeComponent[];
}

export interface FeeComponent {
  id: string;
  feeStructureId: string;
  name: string;
  amount: number;
  frequency: 'ONE_TIME' | 'ANNUAL' | 'TERM' | 'MONTHLY';
}

export interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  issueDate?: string;
  dueDate: string;
  totalAmount?: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  items?: InvoiceItem[];
  studentName?: string;
  gradeName?: string;
  // Compatibility & UI fields
  campusId?: string;
  classGrade?: string;
  feeHead?: string;
  amount?: number;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  feeComponentId?: string;
  description: string;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  receiptNumber: string;
  amount: number;
  method: 'UPI' | 'NET_BANKING' | 'CARD' | 'CASH' | 'CHEQUE';
  referenceNumber?: string;
  status: 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paidAt: string;
  recordedBy: string;
}

// ============================================================================
// 9. STAFF & HR
// ============================================================================

export interface Staff {
  id: string;
  userId?: string;
  campusId: string;
  employeeNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  joinedOn: string;
  avatarUrl?: string;
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  startsOn: string;
  endsOn: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
}

// ============================================================================
// 10. TRANSPORT & FLEET
// ============================================================================

export interface Vehicle {
  id: string;
  campusId: string;
  registrationNumber: string;
  vehicleNumber: string; // e.g. Bus #04
  capacity: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface Driver {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: 'ACTIVE' | 'ON_LEAVE';
}

export interface Route {
  id: string;
  campusId: string;
  name: string; // e.g. Route #12 (North Sector)
  vehicleId?: string;
  driverId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  stops: RouteStop[];
}

export interface RouteStop {
  id: string;
  routeId: string;
  name: string;
  sequence: number;
  scheduledPickupTime: string;
  scheduledDropTime: string;
  latitude?: number;
  longitude?: number;
}

export interface StudentTransportAssignment {
  id: string;
  studentId: string;
  routeId: string;
  stopId: string;
  startsOn: string;
  endsOn?: string;
}

// ============================================================================
// 11. OPERATIONS: HOSTELS, ROOMS & FACILITIES
// ============================================================================

export interface Hostel {
  id: string;
  campusId: string;
  name: string;
  type: 'BOYS' | 'GIRLS' | 'CO_ED';
  capacity: number;
  totalRooms: number;
}

export interface HostelRoom {
  id: string;
  hostelId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupantIds: string[]; // Student IDs
}

// ============================================================================
// 12. NOTICES & COMMUNICATION
// ============================================================================

export interface Announcement {
  id: string;
  campusId: string;
  title: string;
  content: string;
  authorName: string;
  audience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS' | 'STAFF';
  priority: 'ROUTINE' | 'IMPORTANT' | 'URGENT';
  publishedAt: string;
  expiresAt?: string;
}

// ============================================================================
// 13. AUDIT LOGGING & AI TRACE
// ============================================================================

export interface AuditLog {
  id: string;
  campusId?: string;
  actorUserId?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  actorName?: string;
  actorRole?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  ipAddress?: string;
  timestamp?: string;
  createdAt?: string;
}

export interface AIQueryLog {
  id: string;
  userId: string;
  userRole: CanonicalRole;
  prompt: string;
  resolvedScope: string;
  responseSummary: string;
  requiresReview: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  timestamp: string;
}
