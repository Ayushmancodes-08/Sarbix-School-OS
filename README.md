# 🎓 Sarbix School Operating System (OS)

> **Next-Generation Unified School OS** engineered for institutional scale, academic velocity, and multi-campus governance. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase Cloud PostgreSQL**.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2017-emerald?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-indigo)](#)

---

## ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Ayushmancodes-08/Sarbix-School-OS.git
cd Sarbix-School-OS/sarbix-os

# 2. Install dependencies
npm install

# 3. Configure environment
# Duplicate .env.example to .env.local and verify Supabase credentials
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit **`http://localhost:3000/login`** in your browser.

---

## 🔑 1-Click Evaluator Presets & Role Matrix

The login screen features an **Evaluator Role Switcher** with 1-click credential autofill. All accounts use the standard password: `Password@123`.

| Role | Demo Email | Password | Primary Mission & Test Area |
| :--- | :--- | :--- | :--- |
| **Principal** | `principal@delhi.sarbix.edu` | `Password@123` | Institutional Command Center, campus health analytics, live Supabase student modifications. |
| **Teacher** | `teacher@delhi.sarbix.edu` | `Password@123` | Class 10A homeroom roll call, rapid batch attendance submission, academic timetable. |
| **Student** | `student@delhi.sarbix.edu` | `Password@123` | Digital Student ID, live synced attendance badge, homework & learning hub. |
| **Parent** | `parent@delhi.sarbix.edu` | `Password@123` | Vikram Patel: instant UPI QR fee pay (₹18,500), download official GST tax receipts. |
| **Accountant** | `accountant@delhi.sarbix.edu` | `Password@123` | Institutional fee ledger, generate tuition invoices synced to Supabase cloud. |
| **Transport** | `transport@delhi.sarbix.edu` | `Password@123` | Fleet GPS telemetry, Bus Route 04 (South Delhi Express) with Aarav's pickup stop. |
| **Super Admin** | `superadmin@sarbix.edu` | `Password@123` | Multi-campus governance, RBAC matrix, and tamper-evident audit logs. |

---

## 🎯 Test Centerpiece: Managing Student Aarav Patel (`std-001`)

To demonstrate cross-role synchronization and live cloud persistence:

1. **Principal Dossier Edit**: Log in as `Principal`, visit `/students/std-001`, click **"Manage Student (Supabase)"**, modify section or fee, and save directly to Supabase cloud.
2. **Teacher Roll Call**: Log in as `Teacher`, visit `/attendance`, mark Aarav Patel (`10A-14`) as **Present**, and click **"Submit Roster & Sync"**.
3. **Student Sync**: Log in as `Student`, visit `/student`, observe the live attendance tracker verifying today's homeroom roll call.
4. **Parent Instant UPI Pay**: Log in as `Parent`, visit `/parent`, click **"Pay Fees via QR"** to test the UPI modal or **"Download Tax Receipt"** to print the official receipt.

---

## ☁️ Supabase Cloud Database

- **Project Ref**: `debhfqjgqmlmujrfyrny`
- **Region**: `ap-southeast-2`
- **Database Engine**: PostgreSQL 17
- **Core Cloud Tables**:
  - `public.students` — Student directory with academic and fee metrics
  - `public.attendance_records` — Daily classroom roll call submissions
  - `public.fee_invoices` — Itemized tuition fee ledger & payment statuses
- **Offline Resilience**: Automatic local fallback ensures zero disruption if campus WiFi flickers.

---

## 🚀 Vercel Deployment Guide

1. Push repository to GitHub.
2. In Vercel, click **Add New Project** and select this repo.
3. **CRITICAL SETTING**: Set **Root Directory** to `sarbix-os`.
4. Add the environment variables from [`VERCEL_ENV.txt`](./VERCEL_ENV.txt):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://debhfqjgqmlmujrfyrny.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYmhmcWpncW1sbXVqcmZ5cm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MzUxODUsImV4cCI6MjA5NzQxMTE4NX0.DPSP69kfKlhvDFc6OErxIKrdjBsSTj93aHN80A14150
   SESSION_SECRET=sarbix-super-secure-jwt-secret-key-production-grade-256bit!
   NEXT_PUBLIC_APP_NAME=Sarbix School OS
   ```
5. Deploy!

---

## 📄 Pitch & Evaluator Documentation

- **Official PDF Pitch & Testing Playbook**: [`SARBIX_PITCH_AND_TESTING_GUIDE.pdf`](./SARBIX_PITCH_AND_TESTING_GUIDE.pdf)
- **Vercel Env File**: [`VERCEL_ENV.txt`](./VERCEL_ENV.txt)

---
© 2026 Sarbix Growth Agency & Co. All rights reserved.
