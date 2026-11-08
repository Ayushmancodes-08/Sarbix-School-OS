# 🧠 Sarbix School OS — Project Memory & Architecture Guide

> **System Overview**: Sarbix School Operating System (OS) is a next-generation unified multi-campus school management ERP built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons, and Supabase Cloud PostgreSQL (with robust mock DB fallback).

---

## 🏛️ Project Structure & Architecture

```
Sarbix-School-OS/
├── package.json                   # Root orchestrator script (concurrent start)
├── README.md                      # Primary pitch, overview & quick start guide
├── MEMORY.md                      # Canonical architecture, setup, credentials & operational guide
├── DESIGN_SYSTEM.md               # Premium UI design tokens, typography & component aesthetics
├── IMPLEMENTATION_STATUS.md       # Feature matrix & compliance ledger
├── LOGIN_CREDENTIALS.md           # Full role login credentials & evaluator testing guide
├── SARBIX_PITCH_AND_TESTING_GUIDE.pdf # Stakeholder pitch deck & product evaluation document
├── SARBIX_ROLE_LOGIN_DIRECTORY.pdf   # Printable role credentials reference guide
├── generate_pitch_pdf.py          # Generator script for stakeholder pitch PDF
├── generate_login_credentials_pdf.py # Generator script for credential directory PDF
├── SARBIX_REQUIREMENTS/           # Original business requirements and RFP specifications
├── sarbix-os/                     # Core Next.js 15 Application
│   ├── .env.example               # Environment variables template
│   ├── .env.local                 # Supabase configuration credentials
│   ├── package.json               # Next.js app dependencies & scripts
│   ├── next.config.ts             # Next.js build and routing configuration
│   ├── tailwind.config.ts         # Design tokens, custom animations & color schemes
│   ├── tsconfig.json              # TypeScript compilation setup
│   └── src/
│       ├── app/
│       │   ├── (auth)/login/      # Evaluator role-switcher & login screen
│       │   ├── (dashboard)/       # Role-aware dashboard shell and sub-pages
│       │   │   ├── overview/      # Principal / Institutional Command Center
│       │   │   ├── teacher/       # Teacher portal (roll call, gradebook, timetable)
│       │   │   ├── student/       # Student portal (attendance, homework, digital ID)
│       │   │   ├── parent/        # Parent portal (UPI fee payment, report cards)
│       │   │   ├── students/      # Full directory + individual student profile ([id])
│       │   │   ├── attendance/    # Batch roll call & real-time sync
│       │   │   ├── finance/       # Accounts ledger, invoice creation & receipt generator
│       │   │   ├── academics/     # Syllabus, timetable & grading management
│       │   │   ├── admissions/    # Pipeline tracker & applicant admission forms
│       │   │   ├── transport/     # Fleet GPS telemetry & live bus route tracker
│       │   │   ├── audit/         # Tamper-evident institutional audit logs
│       │   │   └── settings/      # Campus profile & system preferences
│       │   └── api/               # Backend REST APIs (Auth, Attendance, Finance, Students)
│       ├── components/
│       │   ├── ai/                # Sarbix Copilot AI assistant drawer
│       │   ├── finance/           # Dynamic UPI QR modal, invoice creator, tax receipts
│       │   ├── shell/             # App shell, command palette (Ctrl+K), sidebar & bottom nav
│       │   ├── student/           # Live attendance tracker & student card components
│       │   ├── students/          # Student management & admission modals
│       │   └── ui/                # Reusable Radix UI / Tailwind primitives
│       ├── lib/
│       │   ├── auth/              # Role guards, session cookies & JWT helpers
│       │   ├── data/mock-db.ts    # Seeded institutional state & in-memory fallbacks
│       │   └── supabase.ts        # Supabase client & sync routines
│       └── types/                 # Complete TypeScript schema definitions
```

---

## 🔑 Demo Evaluator Accounts & Role Directory

All demo accounts use the standard password: **`Password@123`**

| Role | Email | Password | Primary Mission & Features |
| :--- | :--- | :--- | :--- |
| **Principal** | `principal@delhi.sarbix.edu` | `Password@123` | Institutional Command Center, KPI overview, live student management |
| **Teacher** | `teacher@delhi.sarbix.edu` | `Password@123` | Homeroom roll call, rapid batch attendance submission, timetable |
| **Student** | `student@delhi.sarbix.edu` | `Password@123` | Digital Student ID, live synced attendance badge, homework hub |
| **Parent** | `parent@delhi.sarbix.edu` | `Password@123` | Instant UPI QR fee payment (₹18,500), GST tax receipt download |
| **Accountant** | `accountant@delhi.sarbix.edu` | `Password@123` | Institutional fee ledger, generate tuition invoices synced to cloud |
| **Transport** | `transport@delhi.sarbix.edu` | `Password@123` | Fleet telemetry, Bus Route 04 South Delhi Express with Aarav's pickup |
| **Super Admin** | `superadmin@sarbix.edu` | `Password@123` | Multi-campus governance, RBAC matrix, and tamper-evident audit logs |

---

## ⚡ Quick Start & Run Commands

From the root repository (`Sarbix-School-OS/`):
```bash
# 1. Install dependencies
npm install

# 2. Run development server (boots fullstack app on port 3000)
npm run dev

# 3. Production build verification
npm run build

# 4. Production server start
npm start
```

---

## 🛡️ Database & Dual Persistence Model

1. **Supabase Cloud PostgreSQL**: Production-grade cloud database connected through `@supabase/supabase-js`. Tables include students, attendance, fee_invoices, audit_logs, and users.
2. **Graceful Offline Fallback**: If Supabase cloud connection is unavailable or unconfigured, the system automatically falls back to `mock-db.ts` to ensure 100% testability, demo reliability, and zero runtime crashes.

---

## 🎨 UI/UX Standards

- Built with modern glassmorphism, dark/light theme awareness, and responsive mobile-first views.
- **Global Command Bar**: Press `Ctrl + K` or `Cmd + K` anywhere to navigate or trigger instant actions.
- **Sarbix Copilot**: Built-in institutional AI sidecar assistant for querying student status, fee defaults, and bus telemetry.
