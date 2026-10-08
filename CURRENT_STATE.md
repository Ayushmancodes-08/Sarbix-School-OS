# SARBIX SCHOOL OPERATING SYSTEM — CURRENT STATE ARCHITECTURAL RECONNAISSANCE & AUDIT

**Author:** Lead Product Architect, UX Strategist, Senior Full-Stack Engineer, Database Architect & Security Engineer  
**Date:** October 2026  
**Status:** COMPLETED — RECONNAISSANCE ONLY (NO CODE MODIFIED)  
**Documents Analyzed:**
- `School_erpsuppa-main` (Repository 1)
- `Campusconnect-2-main` (Repository 2)
- `SARBIX_REQUIREMENTS/proposal_text.txt` & `Sarbix_School_Operating_System_Proposal.docx` (Business/Product Source of Truth)
- `Agent Files/00_README.md` through `18_ONE_SHOT_ANTIGRAVITY_PROMPT.md` (Architectural & Engineering Specification Pack)

---

## A. REPOSITORY ARCHITECTURE

| Architectural Dimension | Repository A: `School_erpsuppa-main` | Repository B: `Campusconnect-2-main` |
|---|---|---|
| **Framework & Version** | Next.js 14.2.5 (App Router) | Next.js 15.3.8 (App Router) with Turbopack |
| **Runtime & React** | Node.js, React 18.3.1 | Node.js, React 18.3.1 |
| **Language & Strictness** | TypeScript 5.9.3, `ignoreBuildErrors: true` in `next.config.js` | TypeScript 5.x, `ignoreBuildErrors: true` in `next.config.ts` |
| **Linter Configuration** | `eslint: { ignoreDuringBuilds: true }` | `eslint: { ignoreDuringBuilds: true }`, ESLint 9 + `eslint-config-next` 16 |
| **Active Primary Database** | **MongoDB / Mongoose 9.5.0** (`@/lib/mongodb.ts`, `@/models/*`) | **MongoDB Driver 7.2.0** (`@/lib/mongodb.ts`, `@/lib/db/server/*`) |
| **Secondary / Legacy DB** | **Supabase / PostgreSQL Client 2.81.1** + 10 root `.sql` setup scripts | **Supabase Client 2.84.0** (Explicitly decommissioned in `src/lib/supabase.ts`) |
| **Authentication System** | NextAuth v4.24.14 (`/api/auth/[...nextauth]`) + CredentialsProvider | Custom JWT Cookie (`jsonwebtoken 9.0.3` + `bcryptjs 3.0.3` via `/api/auth/login`) |
| **Client State / Cache** | Monolithic `DataProvider` (`/api/data`) via React Context + Custom DOM event `db-updated` | React hooks + `localStorage` (`userRole`, `isLoggedIn`, `studentApplications`, `activityLog`, `grades`, `fees`) |
| **UI Component Primitives** | Radix UI primitives, Lucide React 0.475.0, Tailwind CSS 3.4.1 | Radix UI primitives, Lucide React 0.475.0, Tailwind CSS 3.4.1 |
| **Tables & Data Grids** | Native HTML tables styled with Tailwind | TanStack React Table v8.19.3 (`@tanstack/react-table`) |
| **Data Visualization** | Recharts 2.15.1 | Recharts 2.15.1 |
| **Form Handling** | React Hook Form 7.54.2 + Zod 3.24.2 + `@hookform/resolvers` | React Hook Form 7.54.2 + Zod 3.24.2 + `@hookform/resolvers` |
| **Theme / Design System** | Light theme only (Warm off-white, Indigo/Blue, Space Grotesk / PT Sans) | `next-themes` 0.3.0 (Light/Dark mode, Indigo primary, Amber accent, PT Sans) |
| **Root Shell & Layout** | Minimal single-page dashboard switch in `app/page.tsx` with header | Collapsible sidebar rail, sticky header, multi-route hierarchy (`/dashboard/*`) |

---

## B. EXISTING FEATURE INVENTORY & PROPOSAL GAP MATRIX

| Domain / Feature | School ERP (`School_erpsuppa-main`) | CampusConnect (`Campusconnect-2-main`) | Sarbix Target OS Requirement | Status Classification |
|---|---|---|---|---|
| **Authentication & Sign-in** | NextAuth credentials with role select; plaintext fallback | Custom JWT in cookie with role select; hardcoded admin/finance | Unified login without prior role selection; server-resolved roles; optional MFA | **PARTIALLY IMPLEMENTED (UNSAFE)** |
| **Session & Role Resolution** | Session in NextAuth JWT; stored in `sessionStorage` | Session in cookie + client `localStorage` flags | Server-only HTTP-only secure cookie; zero auth trust in client storage | **PARTIALLY IMPLEMENTED (FLAWED)** |
| **Multi-Campus / Multi-Tenancy** | Single school hardcoded | Single campus hardcoded | Campus/Org-scoped hierarchy (`organizations`, `campuses`) | **PROPOSED ONLY (ABSENT)** |
| **Student 360 Profile** | Basic fields (name, class, roll, avatar) | Detailed fields (name, email, phone, gender, dob, program, emergency) | Unified student identity + multiple academic enrollments + timeline + documents | **PARTIALLY IMPLEMENTED** |
| **Guardians & Family Links** | Absent as discrete entity | Basic string contact on student record | Dedicated `guardians` & `student_guardians` tables with verified pickup rights | **PROPOSED ONLY (ABSENT)** |
| **Admissions & Applications** | Public form -> `/api/supabase-mock` -> Mongo collection | Public form -> saved to browser `localStorage`! | Full admission pipeline: enquiry -> evaluation -> assessment -> conversion | **PARTIALLY IMPLEMENTED (BROKEN)** |
| **Staff & HR Management** | Minimal Teacher model (name, subject) | Staff CRUD API + UI (department, status, contact) | Staff profile, documents, workloads, leaves, designations, certifications | **PARTIALLY IMPLEMENTED** |
| **Academics & Timetable** | Class/Section strings; homework entity | "Course" entity (time, class, room) | Normalized grades, sections, subjects, class-subject assignments, timetable slots | **PARTIALLY IMPLEMENTED (DE-NORMALIZED)** |
| **Attendance Tracking** | Student-centric array of `{ date, status }` in Mongo | Course-centric object in client memory | Normalized `attendance_sessions` + individual `attendance_records` + reasons | **PARTIALLY IMPLEMENTED (SPLIT)** |
| **Homework & Assignments** | Implemented (`Homework.ts`, UI) | Absent | Assignment submissions, attachments, teacher grading, parent visibility | **PARTIALLY IMPLEMENTED** |
| **Exams, Marks & Report Cards** | Absent | Simulated in client `localStorage` (`studentGradesData`) | Standardized exams, exam subjects, marks entry, report card publishing | **PARTIALLY IMPLEMENTED (MOCK/LOCAL)** |
| **Fee Structures & Invoicing** | Flat `Fee` & `HostelFee` models (`Paid`, `Due`, `Overdue`) | Mock `finance.ts` with mock transactions and `localStorage` | Normalized `fee_structures` -> `invoices` -> `invoice_items` -> `payments` | **PARTIALLY IMPLEMENTED (PRIMITIVE)** |
| **Online Payment Flow** | Dummy payment form with card fields | Mock student payment screen | Integrated gateway adapters, webhooks, receipts, reconciliation | **PROPOSED / UI ONLY** |
| **Hostel & Rooms** | Full hostel, rooms, allocation UI & Mongo model | Room/Hostel CRUD APIs + occupancy calculation | Retained as operational facility module linked to canonical student ID | **IMPLEMENTED (DUPLICATE)** |
| **Holidays Calendar** | Absent | Implemented via Mongo collection & UI | Integrated into academic calendar / terms | **IMPLEMENTED (CAMPUSCONNECT)** |
| **Careers / Job Applications** | Implemented public form & admin review | Implemented teacher application form | Retained as public workflow converting to Staff profile on hiring | **IMPLEMENTED (DUPLICATE)** |
| **Notices & Communication** | Implemented (`Notice.ts`, `NoticeBoard.tsx`) | Absent | Announcements with audience filtering, acknowledgements, push/SMS | **PARTIALLY IMPLEMENTED** |
| **Parent Portal** | Absent | Absent | Dedicated parent workspace: attendance, fees, child switcher, PTM, notices | **PROPOSED ONLY (ABSENT)** |
| **Student Portal** | Basic dashboard showing fee and homework | Dedicated student dashboard with timetable and fee | Modern student workspace: schedule, assignments, results, ID card | **PARTIALLY IMPLEMENTED** |
| **Transport & GPS Fleet** | Absent | Absent | Routes, stops, vehicles, drivers, student allocations, trip tracking | **PROPOSED ONLY (ABSENT)** |
| **Library & Inventory** | Absent | Absent | Catalog, loans, assets, maintenance tickets, reorder tracking | **PROPOSED ONLY (ABSENT)** |
| **Safety & Visitors** | Absent | Absent | Gate entry/exit, pickup authorization, incident reporting | **PROPOSED ONLY (ABSENT)** |
| **AI School Copilot** | Absent | Absent | Natural-language query interface with role-restricted data scope | **PROPOSED ONLY (ABSENT)** |
| **AI Academic Assistant** | Absent | Absent | Lesson plan drafts, quiz generation, revision summaries with teacher review | **PROPOSED ONLY (ABSENT)** |
| **Audit Logging** | Absent | Client `localStorage.setItem('activityLog', ...)` | Append-only database table (`audit_logs`) tracking all critical mutations | **PROPOSED ONLY (FLAWED)** |

---

## C. EXISTING DATABASE ARCHITECTURE & SCHISMS

Both repositories suffer from a severe architectural schizophrenia: they were conceived or documented as Supabase/PostgreSQL applications, but in production/development both mutated into unnormalized MongoDB datastores.

### 1. The School ERP Database Schism
- **The Abandoned Supabase Facade:** Contains 10 raw SQL files in repository root (`COMPLETE-DATABASE-SETUP.sql`, `ADD-FOREIGN-KEYS.sql`, `SETUP-STORAGE.sql`, etc.). These scripts define 13 tables with wide-open RLS policies (`FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)`).
- **The Active Mongoose Runtime:** `@/lib/mongodb.ts` connects via Mongoose 9.5.0 to a MongoDB database.
- **The Fake Query Interceptor (`@/supabase/client-provider.tsx`):**
  Instead of refactoring the frontend Supabase client calls (`supabase.from('students').select('*')`), a mock client was written that packages queries into JSON and `POST`s them to `/api/supabase-mock`.
- **The Mongo Reflection Engine (`/api/supabase-mock/route.ts`):**
  This route accepts raw table names, translates snake_case fields to camelCase, and directly executes arbitrary queries (`find`, `create`, `findOneAndUpdate`, `deleteMany`) against Mongoose models.
- **De-normalization Issues:**
  - `Fee` records store duplicate `studentName` and `class` strings.
  - `StudentAttendance` embeds an unindexed JSON array of daily records inside each student document, making school-wide attendance aggregations and period-level queries excruciatingly slow and un-indexable.

### 2. The CampusConnect Database Schism
- **The Decommissioned Supabase File:** `src/lib/supabase.ts` explicitly contains:
  ```typescript
  // Decommissioned in favor of MongoDB Atlas
  export const supabase = null;
  ```
- **The Active Raw Mongo Driver:** `src/lib/mongodb.ts` uses the native `mongodb` package to connect to `campusconnect`.
- **Service Layer Inconsistencies:**
  - `src/lib/db/server/students.ts`, `staff.ts`, `courses.ts`, `rooms.ts`, `hostels.ts` execute direct MongoDB collection calls.
  - `src/lib/db/students.ts`, `staff.ts`, `courses.ts` execute browser-side `fetch('/api/students')`.
- **The LocalStorage Escape Hatches:**
  - Admissions: Submissions in `admissions-form.tsx` write directly to `localStorage.setItem('studentApplications', ...)`!
  - Grades: `grades.ts` states `// The app will use localStorage.` and relies on browser state.
  - Fees: `finance.ts` falls back to `defaultStudentFees` and client `localStorage`.
  - Activity Log: `ApplicationsDashboard` writes audit records to `localStorage.getItem('activityLog')`.

---

## D. EXISTING API ARCHITECTURE

### 1. CampusConnect API Routes
Located in `Campusconnect-2-main/src/app/api/`:
- `POST /api/auth/login` — Authenticates user, signs JWT cookie, seeds DB on every request.
- `GET /api/auth/me` — Decodes session cookie without signature verification error handling.
- `POST /api/auth/logout` — Clears session cookie.
- `GET | POST /api/students` — Completely open CRUD.
- `GET | PUT | DELETE /api/students/[id]` — Completely open CRUD.
- `GET | POST /api/staff` & `[id]` — Completely open CRUD.
- `GET | POST /api/courses` & `[id]` — Completely open CRUD.
- `GET | POST /api/holidays` & `[id]` — Completely open CRUD.
- `GET | POST /api/hostels` & `[id]` — Completely open CRUD.
- `GET | POST /api/rooms` & `[id]` — Completely open CRUD.

**Defects:**
- No standard API response envelope (some return arrays, some `{ error: string }`, some raw objects).
- Zero server-side session or permission checks.
- Zero Zod schema parsing on incoming request payloads.

### 2. School ERP API Routes
Located in `School_erpsuppa-main/src/app/api/`:
- `GET /api/data` — Single monolithic endpoint that queries 13 Mongoose collections simultaneously and dumps everything (including users and password hashes) into one giant JSON payload.
- `POST /api/supabase-mock` — Universal backdoor that accepts `{ table, operation, data, filters, isSingle }` and performs unconstrained MongoDB database mutations.
- `GET | POST /api/auth/[...nextauth]` — NextAuth route handler.

---

## E. AUTHENTICATION ARCHITECTURE

### School ERP NextAuth Flow
1. User navigates to `/login`.
2. Form mandates choosing a **Role** from a dropdown (`Admin`, `Teacher`, `Student`, `Finance`) along with User ID and Password.
3. NextAuth `CredentialsProvider.authorize()` searches MongoDB for `{ userId, role }`.
4. Password verification performs bcrypt compare. If that fails, it falls back to:
   ```typescript
   if (credentials.password === user.password) { return user; }
   ```
   **Vulnerability:** Accepts raw plaintext passwords.
5. On success, writes user info to NextAuth JWT.
6. The client component manually sets `sessionStorage.setItem("authenticated", "true")` and `sessionStorage.setItem("userRole", data.role)`.

### CampusConnect JWT Flow
1. User navigates to `/login`.
2. Form mandates selecting a **Role** (`admin`, `teacher`, `student`, `finance`, `hostel`) along with email and password.
3. `/api/auth/login` checks hardcoded fallback array:
   ```typescript
   const hardcodedUsers = [
     { email: 'admin@campus.edu', password: 'password', role: 'admin', name: 'Admin User' },
     { email: 'finance@campus.edu', password: 'password', role: 'finance', name: 'Carol White' },
   ];
   ```
4. If not hardcoded, queries MongoDB `users` collection.
5. Signs JWT using fallback secret if `process.env.JWT_SECRET` is unset:
   `'campusconnect-erp-jwt-secret-key-replace-me-in-production'`.
6. Sets HTTP-only cookie `campusconnect_session` (7 days duration).
7. Client component writes `localStorage.setItem("userRole", selectedRole)` and `localStorage.setItem("isLoggedIn", "true")`.

---

## F. AUTHORIZATION ARCHITECTURE & VULNERABILITIES

### 1. Inexistent Server-Side Authorization
In CampusConnect, not a single route in `/api/students`, `/api/staff`, `/api/courses`, `/api/rooms`, or `/api/hostels` inspects the cookie or validates user permissions. Any actor can send a `DELETE /api/students/1` or `POST /api/staff` and alter institutional records.

### 2. Client-Side Authorization Illusion
CampusConnect's `route-protection.ts` and `sidebar-nav.tsx` only hide navigation items and rely on `useCurrentUser()` reading `localStorage.getItem("userRole")`. A student can change `userRole` to `"admin"` in the browser DevTools console and access admin UI pages.

### 3. Middleware Flaw
CampusConnect `middleware.ts` only executes:
```typescript
const token = request.cookies.get('campusconnect_session')?.value;
if (request.nextUrl.pathname.startsWith('/dashboard')) {
  if (!token) return NextResponse.redirect(loginUrl);
}
```
It does not verify token cryptographically, does not check expiration, and does not verify user active status. Furthermore, it completely ignores `/api/*`.

### 4. Backdoor Mutation Proxy
School ERP `/api/supabase-mock` allows any user (or non-authenticated visitor) to execute `deleteMany` or `update` on the `users`, `fees`, or `students` tables.

### 5. Permissive Supabase RLS
If deployed against Supabase, all policies in both repos are:
`CREATE POLICY "Allow public access" ON users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`
This renders Row Level Security completely ineffective.

---

## G. UI ARCHITECTURE & DESIGN EVALUATION

### 1. School ERP UI
- **Aesthetic:** Minimalist, warm off-white (`hsl(220, 13%, 96%)`), plain blue accent, standard Radix dialogs.
- **Layout:** Monolithic view in `src/app/page.tsx` rendering `<Header />` and switching between 4 dashboard components based on `userRole`.
- **Navigation:** Top navigation bar only. No sidebar rail.
- **Weaknesses:** Lacks layout hierarchy, feels flat, no dark mode, inconsistent card sizing, high cognitive clutter in finance forms.

### 2. CampusConnect UI
- **Aesthetic:** Modern SaaS style, deep indigo primary (`hsl(231 48% 48%)`), amber accent (`hsl(45 100% 51%)`), dark navy sidebar (`hsl(231 48% 28%)`).
- **Layout:** Well-structured dashboard layout (`main-layout.tsx`) with collapsible sidebar rail (`sidebar-nav.tsx`), command header, breadcrumbs, user dropdown (`user-nav.tsx`).
- **Themes:** Fully configured `next-themes` (light and dark mode).
- **Weaknesses:** Generic "wall-of-cards" layout on role dashboards; role-first login page; form inputs lack responsive sheet fallbacks on mobile; inconsistent table empty states.

---

## H. AI FUNCTIONALITY RECONNAISSANCE

- **School ERP:** 0 lines of AI implementation found. No dependencies (`openai`, `@google/genai`, `ai` SDK), no routes, no models.
- **CampusConnect:** 0 lines of AI implementation found.
- **Sarbix Proposal & Agent Pack Scope:**
  - Management AI Copilot ("Ask School OS Anything")
  - Teacher AI Academic Assistant (lesson planning, quiz creation, worksheet generator)
  - Student Learning Explainer
  - Operations anomaly detection
- **Finding:** AI functionality exists **ONLY** in the product proposal and agent specifications. It is a greenfield capability that must be built cleanly on top of a secured data access boundary.

---

## I. INTEGRATIONS AUDIT

| Integration Channel | Status in Code | Notes & Remediation |
|---|---|---|
| **Database** | Fragmented MongoDB + Broken Supabase | Must be unified into PostgreSQL (Supabase) |
| **Object Storage** | Local base64 / Supabase storage setup scripts | Must use unified S3/Supabase Storage for documents, avatars, resumes |
| **Payments Gateway** | Mock card input forms only | Must integrate standard payment provider webhook/order architecture |
| **SMS / WhatsApp** | None | Notification abstraction layer needed |
| **GPS / Transport Hardware** | None | Vehicle telemetry API adapter needed |
| **Biometric / RFID Attendance** | None | Hardware-agnostic session check-in ingestion endpoint needed |

---

## J. CONSOLIDATED SECURITY FINDINGS (VULNERABILITY LOG)

1. **CRITICAL - Hardcoded Administrative Credentials:**
   CampusConnect `/api/auth/login/route.ts` contains hardcoded credentials for `admin@campus.edu` and `finance@campus.edu` with password `'password'`.
2. **CRITICAL - Static JWT Secret Fallback:**
   CampusConnect uses `'campusconnect-erp-jwt-secret-key-replace-me-in-production'` when environment variable is missing.
3. **CRITICAL - Unprotected Database Proxy Route:**
   School ERP `/api/supabase-mock/route.ts` allows arbitrary MongoDB mutations without authentication.
4. **CRITICAL - Plaintext Password Fallback:**
   School ERP NextAuth route checks plaintext equality if bcrypt comparison fails.
5. **CRITICAL - Completely Unprotected CRUD APIs:**
   CampusConnect `/api/students/*`, `/api/staff/*`, `/api/courses/*`, `/api/rooms/*`, `/api/hostels/*` have no authentication or authorization checks.
6. **HIGH - Full Database Dump Endpoint with Credential Leaks:**
   School ERP `/api/data/route.ts` returns the entire `users` collection including passwords.
7. **HIGH - Public Supabase RLS Policies:**
   SQL setup scripts grant full read/write access to `anon` role (`USING (true)`).
8. **HIGH - Client-Side Authorization Bypass:**
   User roles stored in `localStorage` can be spoofed by any browser user.
9. **MEDIUM - Internal Error Message Leakage:**
   API error handlers return `error.message` directly in HTTP 500 JSON payloads.
10. **MEDIUM - Seed Execution on Every Request:**
    CampusConnect executes `seedDatabase()` on every login POST, creating race conditions and write amplification.

---

## K. TECHNICAL DEBT

1. **Suppressed Build Quality Gates:**
   Both repositories use `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`.
2. **Fragmented Data Naming:**
   Snake_case in Supabase files (`student_name`, `roll_number`), camelCase in Mongoose models (`studentName`, `rollNumber`), kebab-case in API routes.
3. **Ghost Subscriptions:**
   Room service implements `subscribe()` methods that perform a one-time promise fetch and return a no-op cleanup function `() => {}`.
4. **Browser LocalStorage as Persistence Layer:**
   Applications, grades, and fee payments stored in client browser storage instead of server database.

---

## L. REUSABLE ASSETS & CODE SALVAGE

Despite architectural issues, several high-value UI components, domain workflows, and formulas can be salvaged:
1. **CampusConnect Application Shell (`main-layout.tsx`, `sidebar-nav.tsx`, `user-nav.tsx`):**
   Clean collapsible sidebar, breadcrumbs, theme switcher, and command header foundation.
2. **TanStack React Table Implementation (`student-table.tsx`, `staff-table.tsx`):**
   Column sorting, filtering, pagination, and row selection logic.
3. **School ERP Domain Components:**
   - `HostelManagement.tsx` & `HostelAllocationDialog.tsx` (Complete room assignment logic).
   - `AttendanceLogger.tsx` & `AttendanceView.tsx` (Speed-oriented attendance UI).
   - `Homework.tsx` (Assignment creation and due-date cards).
   - `NoticeBoard.tsx` (Clean notice feed).
   - `FeePayment.tsx` & `FinanceDashboard.tsx` (Fee calculation breakdowns and KPI cards).
4. **Zod Validation Schemas:**
   Form schemas for admissions, staff, hostel rooms, homework, and fees in both codebases.

---

## M. CODE TO BE DISCARDED (EXPLICIT ELIMINATION LIST)

1. `School_erpsuppa-main/src/app/api/supabase-mock/route.ts` & `src/supabase/client-provider.tsx` (Mock DB backdoor).
2. `School_erpsuppa-main/src/app/api/data/route.ts` (Monolithic data dump).
3. `Campusconnect-2-main/src/app/api/auth/login/route.ts` hardcoded credentials & fallback secrets.
4. `Campusconnect-2-main/src/lib/supabase.ts` (Decommissioned stub).
5. All `localStorage`-based business storage routines (`localStorage.setItem('studentApplications')`, `localStorage.setItem('activityLog')`).
6. `COMPLETE-DATABASE-SETUP.sql` permissive public RLS scripts.
7. Next.js config suppression flags (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`).

---

## N. MIGRATION RISKS

1. **Data Loss During Unification:**
   Student records in School ERP lack email/phone; student records in CampusConnect lack roll number/section. Migration schema must support nullable fields during merge.
2. **Attendance Model Divergence:**
   School ERP uses embedded arrays per student; CampusConnect uses course-keyed daily maps. Both must be transformed into normalized `attendance_sessions` and `attendance_records`.
3. **Session Invalidation:**
   Migrating from NextAuth credentials / raw JWT cookie to a hardened Auth.js / Supabase Auth session will log out all current test users.

---

## O. RECOMMENDED CONSOLIDATION STRATEGY

1. **Single Repository Foundation:**
   Build the target system inside the unified project workspace using Next.js 15+ App Router, React 19/18, TypeScript strict mode, and Tailwind CSS.
2. **Canonical Database Model:**
   Adopt the 15-domain PostgreSQL relational schema specified in `05_CANONICAL_DATABASE_SCHEMA.md`.
3. **Server-Enforced RBAC & Security:**
   Implement server-side session authentication with `requirePermission()` guards on every API route and server action.
4. **Unified Visual Language:**
   Create the "School OS Command Center" design system: deep indigo anchor, warm neutral canvas, restrained electric violet accent, editorial typography, accessible Radix primitives.
5. **Phase-Gated Migration:**
   Implement core identity and shell first, then port domain services sequentially with data adapters, automated acceptance tests, and zero build suppression flags.
