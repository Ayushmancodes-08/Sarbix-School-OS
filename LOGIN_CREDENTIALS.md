# SARBIX School OS — Official Login Credentials Directory

> **System Version:** SARBIX OS v2.4 (Enterprise Multi-Campus)  
> **Global Default Password:** `Password@123`  
> **Production / Local Login URL:** `http://localhost:3000/login` (or deployed domain `/login`)  
> **Role Isolation Guarantee:** Each persona has a strictly scoped dashboard, role-specific navigation, and server-side route guards.

---

## 1. Quick Credentials Reference Table

| # | Role | Display Name | Institutional Email | Password | Landing Page | Scoped Access Scope |
|---|------|--------------|---------------------|----------|--------------|---------------------|
| 1 | **Principal** | Dr. Sunita Sharma | `principal@delhi.sarbix.edu` | `Password@123` | `/overview` | Executive metrics, campus attendance, fee realization, live fleet, admissions queue |
| 2 | **Teacher** | Rajesh Verma | `teacher@delhi.sarbix.edu` | `Password@123` | `/teacher` | My Classroom, Period 3 countdown, 1-Click Roll Call, Class 10-A grading queue & roster |
| 3 | **Student** | Aarav Patel | `student@delhi.sarbix.edu` | `Password@123` | `/student` | Student Desk, Digital RFID ID card, class schedule, attendance streak (94.2%), homework |
| 4 | **Parent** | Vikram Patel | `parent@delhi.sarbix.edu` | `Password@123` | `/parent` | Family Portal, child tracking, Instant UPI QR fee checkout, transport telemetry |
| 5 | **Accountant** | Meera Nair | `accountant@delhi.sarbix.edu` | `Password@123` | `/finance` | Fee collection counter, cash/cheque/UPI reconciliation, student ledger, GST tax receipts |
| 6 | **Transport Manager** | Gurdeep Singh | `transport@delhi.sarbix.edu` | `Password@123` | `/transport` | Bus Fleet Telemetry, Route 04 GPS live route, driver SOS logs, boarding manifest |
| 7 | **Super Admin** | Aditya Singhania | `superadmin@sarbix.edu` | `Password@123` | `/overview` | Multi-Campus master governance, staff provisioning, tamper-proof SHA-256 audit ledger |

---

## 2. Alternate Institutional Email Aliases (Also Active)

These institutional domain aliases are also configured and fully functional in the system:

| Persona | Alias Email | Password | Role | Landing Page |
|---------|-------------|----------|------|--------------|
| **Principal** | `principal@delhicentral.sarbix.edu` | `Password@123` | Principal | `/overview` |
| **Faculty / Math** | `teacher.math@delhicentral.sarbix.edu` | `Password@123` | Teacher | `/teacher` |
| **Student** | `aarav.sharma@student.sarbix.edu` | `Password@123` | Student | `/student` |
| **Parent** | `rajesh.sharma@parent.sarbix.edu` | `Password@123` | Parent | `/parent` |
| **Finance Office** | `finance@delhicentral.sarbix.edu` | `Password@123` | Accountant | `/finance` |
| **Fleet Operations** | `transport@delhicentral.sarbix.edu` | `Password@123` | Transport Manager | `/transport` |

---

## 3. Detailed Role Personas & Test Scenarios

### 🏫 1. Principal (Executive Command Center)
- **Email:** `principal@delhi.sarbix.edu`
- **Password:** `Password@123`
- **Designated URL:** `/overview`
- **What this user sees:**
  - Macro campus-wide metrics: 1,420 Active Students, 94.2% Today's Attendance, ₹1.42 Cr Fee Realization.
  - Multi-campus switcher (Delhi Central Academy vs Bengaluru South International).
  - Quick action to review and approve fresh student admission applications.
  - Live transport bus fleet telemetry snapshot.
- **Strict Boundary:** Does not see raw grading submissions or personal student desks; focused strictly on strategic governance.

---

### 👩‍🏫 2. Teacher (Classroom & Faculty Workspace)
- **Email:** `teacher@delhi.sarbix.edu`
- **Password:** `Password@123`
- **Designated URL:** `/teacher`
- **What this user sees:**
  - Personalized human greeting: *"Welcome back, Rajesh Verma 👋"*.
  - Next Lecture Countdown banner: *"Period 3 · Grade 10-A (Mathematics) — Starts in 22 mins"*.
  - 1-Click Roll Call trigger linking directly to `/attendance`.
  - Today's Teaching Schedule (Grade 10-A, Grade 9-B, Grade 11-A Calculus, Grade 10-C).
  - Pending Grading Queue (Unit Test 2, Quadratic Equations, Triangle Theorems).
  - Homeroom Student Directory for Class 10-A with attendance rates and roll numbers.
- **Strict Boundary:** Cannot view financial cashbooks, school-wide tax reports, or administrative settings.

---

### 🎒 3. Student (Personal Desk & Digital Campus Card)
- **Email:** `student@delhi.sarbix.edu`
- **Password:** `Password@123`
- **Designated URL:** `/student`
- **What this user sees:**
  - Digital Identity Badge with photo, Roll No (`DCA-2026-0842`), Grade 10-A, and secure QR code.
  - Attendance Health Meter: 94.2% presence rate (162 of 172 days attended).
  - Daily Period Schedule with classroom numbers and teacher names.
  - Upcoming Exams & Assignments with submission deadlines.
- **Strict Boundary:** Strictly read-only access for personal academic data; zero access to other students' private records or school management tools.

---

### 👨‍👩‍👧 4. Parent (Family Portal & Instant Fee Settlement)
- **Email:** `parent@delhi.sarbix.edu`
- **Password:** `Password@123`
- **Designated URL:** `/parent`
- **What this user sees:**
  - Child profile overview for *Aarav Patel (Grade 10-A)*.
  - Real-time morning RFID bus boarding timestamp and safe arrival status.
  - Term 2 Outstanding Fee balance with **Dynamic UPI QR Code Generator** (supports Google Pay, PhonePe, Paytm).
  - Direct WhatsApp link to Class Teacher.
- **Strict Boundary:** Cannot access faculty tools, gradebook modifiers, or fleet administrative dispatch.

---

### 💳 5. Accountant (Institutional Fee & Cashier Terminal)
- **Email:** `accountant@delhi.sarbix.edu`
- **Password:** `Password@123`
- **Designated URL:** `/finance`
- **What this user sees:**
  - Real-time Fee Collection Counter: Today's collections, monthly totals, outstanding dues.
  - Student fee ledger search by Roll Number or Admission ID.
  - Instant receipt generation with automated GST invoice numbering.
  - Payment mode reconciliation breakdown (UPI, Net Banking, Cheque, Cash).
- **Strict Boundary:** Cannot alter student grades, academic curriculum, or bus route allocations.

---

### 🚌 6. Transport Manager (Fleet Telemetry & Logistics)
- **Email:** `transport@delhi.sarbix.edu`
- **Password:** `Password@123`
- **Designated URL:** `/transport`
- **What this user sees:**
  - Live GPS tracking for all 14 active school buses.
  - Speed alerts, geofence breaches, and driver SOS telemetry.
  - Route 04 morning & afternoon student manifests.
  - Vehicle fitness, PUC renewal, and insurance expiration trackers.
- **Strict Boundary:** No access to student exam marks or school financial balance sheets.

---

### 🛡️ 7. Super Admin (Multi-Campus Master Authority)
- **Email:** `superadmin@sarbix.edu`
- **Password:** `Password@123`
- **Designated URL:** `/overview`
- **What this user sees:**
  - Full multi-tenant governance across all institutional branches.
  - Staff onboarding, role assignment, and security privilege configuration.
  - Immutable SHA-256 system audit trail (`/audit`) tracking every user login, grade modification, and fee collection.
- **Strict Boundary:** Complete administrative oversight with cryptographic audit logging.

---

## 4. How to Switch Roles on the Login Screen

1. Open `http://localhost:3000/login`.
2. Locate the **"Select Demo Role & Persona"** dropdown menu at the top of the login card.
3. Choose any role (e.g. *Teacher*, *Student*, *Parent*, *Accountant*, *Transport Manager*, or *Principal*).
4. Notice that:
   - The email field instantly pre-fills with the corresponding credentials.
   - The password field auto-populates with `Password@123`.
   - The interactive **Role Dossier Card** updates with avatar, name, and landing route badge.
5. Click **"Sign In to SARBIX OS"**.
6. The system automatically signs you in via session cookie and routes you directly to that persona's dedicated workspace!
