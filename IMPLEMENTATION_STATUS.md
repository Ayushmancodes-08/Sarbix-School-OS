# SARBIX SCHOOL OPERATING SYSTEM — IMPLEMENTATION STATUS

**Current Status:** IN PROGRESS — EPIC 0 (FOUNDATION) & EPIC 1 (IDENTITY) ACTIVE  
**Last Updated:** October 2026  
**Quality Standards:** TypeScript Strict Mode • 100% Typecheck Passing • Zero Ignored Errors • Canonical PostgreSQL Architecture • Server-Enforced RBAC  

---

## IMPLEMENTATION BACKLOG TRACKER

### EPIC 0 — Unified Foundation & Design Tokens
- [x] Create clean target application workspace (`sarbix-os`)
- [x] Configure strict TypeScript (`noImplicitAny`, strict null checks)
- [x] Configure clean Next.js 15+ build gates (zero `ignoreBuildErrors`, zero `ignoreDuringBuilds`)
- [x] Environment variable schema with Zod validation
- [x] Design token system in `globals.css` and `tailwind.config.ts` matching Stitch `Academic Kinetic`
- [x] Reusable primitive UI component library (Radix UI, Lucide icons, class-variance-authority)

### EPIC 1 — Identity, Authentication & Access Control
- [x] Canonical database schema & migrations (Organizations, Campuses, Users, Roles, Permissions, UserRoles)
- [x] Safe in-memory/Postgres data repository layer with repository-service separation
- [x] Cryptographically signed HTTP-only session cookie management (Auth.js/Jose/Bcrypt)
- [x] Server-enforced permission guard: `requirePermission()` and `requireCampus()`
- [x] Unified login screen without role dropdown (email/phone + password)
- [x] Workspace selector for multi-role accounts
- [x] Audit log emission on authentication and access events
- [x] Password hashing via bcrypt (rounds >= 12) with zero plaintext fallback

### EPIC 2 — Application Shell & Command Architecture
- [x] Shared responsive application shell (Desktop 260px rail, Tablet 72px icon rail, Mobile bottom nav)
- [x] Sticky command bar with breadcrumbs and campus context switcher
- [x] Global Command Palette (`Ctrl + K` / `Cmd + K`) with fuzzy search and quick actions
- [x] Notification Center with categorized alerts
- [x] Profile menu with theme switcher (Light / Dark mode via next-themes)
- [x] Role-aware navigation routing based on server-resolved permissions

### EPIC 3 — Management Command Center
- [x] Executive context bar with daily summary and date
- [x] 4 High-signal KPI blocks with trend deltas and spark indicators
- [x] Priority Action Queue ("Needs Attention") with direct workflow triggers
- [x] Attendance & Academic Health trendline chart (Recharts)
- [x] Live cross-section diagnostic table
- [x] AI Operational Digest card

### EPIC 4 — Student 360 & Admissions Pipeline
- [x] Normalized Student & StudentEnrollment models
- [x] Guardian relationship mapping (`student_guardians`) with verified pickup rights
- [x] Student list with high-density TanStack Table, filters, and search
- [x] Student 360 profile view (hero banner, multi-term history, timeline, health, guardians)
- [x] Public admission enquiry and application intake form
- [x] Admissions management pipeline (Review -> Interview/Test -> Selection -> Conversion)

### EPIC 5 — Academics, Timetable & Homework
- [x] Academic years, terms, grades, sections, subjects, rooms
- [x] Class-subject allocations & timetable slots
- [x] Teacher schedule view and room allocation
- [x] Homework assignment creation, file attachments, and submission tracking
- [x] Exam structure, grading criteria, marks entry, and report card publishing

### EPIC 6 — Attendance Console
- [x] Normalized `attendance_sessions` and `attendance_records`
- [x] High-velocity Rapid Attendance Console (<15 sec per class)
- [x] Hotkey-driven roll-call (`P`, `A`, `L`, `E`)
- [x] Consecutive absence detection and early-warning trigger
- [x] Attendance correction workflow with mandatory reason and audit entry

### EPIC 7 — Finance & Fee Billing Engine
- [x] Fee structures with multiple components (Tuition, Lab, Transport, Hostel)
- [x] Automated invoice generation for enrolled students
- [x] Invoicing register with real-time balance calculations (`total = sum(items)`)
- [x] Payment processing, partial payments, receipts, and bank reconciliation
- [x] Automated dunning rules and reminder queue
- [x] Student/parent self-service payment screen with receipt download

### EPIC 8 — Staff & HR Management
- [x] Staff directory, profiles, departments, designations, qualifications
- [ ] Staff attendance, leave requests, and approval workflow
- [ ] Workload tracking and timetable clash prevention
- [ ] Careers and teacher application review workflow

### EPIC 9 — Parent & Student Portals
- [x] Parent Family Portal with seamless multi-child switcher
- [x] Live child attendance status, homework tracker, and exam report cards
- [x] Bus tracking & transport status
- [x] Parent-Teacher Meeting (PTM) slot booking
- [x] Student Learning Workspace with personal schedule and digital ID card

### EPIC 10 — Operations, Transport & Facilities
- [x] Fleet management: Vehicles, drivers, routes, stops, and schedules
- [x] Student transport allocation and trip boarding check-in flow
- [ ] Hostel management: Hostels, rooms, capacity, and bed allocations
- [ ] Library catalog, issue/return tracker, and overdue fines

### EPIC 11 — AI School Copilot & Automation
- [ ] Permission-scoped "Ask School OS" Copilot engine
- [ ] Scoped SQL/data retrieval (model never sees unauthorized records)
- [ ] Teacher AI Academic Assistant (lesson outlines, quiz generator)
- [ ] Mandatory human review queue for all AI-drafted notices and alerts
- [ ] Immutable AI request and review audit logging

### EPIC 12 — Production Hardening & Acceptance Verification
- [ ] Sliding-window rate limiting on auth and mutation endpoints
- [ ] Security headers (CSP, HSTS, X-Content-Type-Options)
- [ ] End-to-end acceptance test suite covering all 13 core scenarios
- [ ] Zero build warnings, zero linter errors, production build verification
