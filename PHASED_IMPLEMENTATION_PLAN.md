# SARBIX SCHOOL OPERATING SYSTEM — PHASED IMPLEMENTATION PLAN

**Author:** Lead Product Architect & Senior Full-Stack Implementation Agent  
**Date:** October 2026  
**Status:** PROPOSED & GATED — AWAITING USER APPROVAL  

---

## IMPLEMENTATION PHASES OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 0: RECONNAISSANCE & ARCHITECTURAL AUDIT (COMPLETED)   │
│ - Comprehensive audit of both repositories                  │
│ - Security vulnerability logging (CVEs & backdoors found)   │
│ - Delivery of CURRENT_STATE.md and TARGET_STATE.md          │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 1: CORE FOUNDATION, IDENTITY & UNIFIED SHELL          │
│ - Setup canonical Next.js App Router workspace & TypeScript │
│ - Tokenized design system & responsive application shell    │
│ - Hardened authentication (no role-first login) & RBAC guard│
│ - Canonical PostgreSQL schema migration & seed pipeline     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 2: CORE ACADEMICS & STUDENT 360 WORKSPACE             │
│ - Normalized Student identity & multi-term enrollments      │
│ - Guardian relationship management & pickup authorization   │
│ - Comprehensive Student 360 profile view                    │
│ - Admissions pipeline (enquiry -> review -> conversion)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 3: CLASSROOM OPERATIONS, TIMETABLE & ATTENDANCE       │
│ - Academic years, terms, grades, sections, subjects         │
│ - Timetable slots & teacher allocation                      │
│ - Rapid 10-second attendance marking & audit corrections   │
│ - Homework assignments & submission tracking                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 4: FINANCE & FEE MANAGEMENT ENGINE                    │
│ - Multi-component fee structures & student fee assignments  │
│ - Invoicing engine (auto-calculated line items & due dates) │
│ - Payment processing, receipts & collection reconciliation  │
│ - Parent online fee payment workspace                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 5: PARENT, STUDENT & STAFF SPECIALIZED EXPERIENCES    │
│ - Parent portal with multi-child switcher & PTM scheduler   │
│ - Student learning hub, digital ID card & report cards      │
│ - Staff HR records, qualifications, workload & leaves       │
│ - Centralized notices & multi-channel announcements         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 6: OPERATIONS, TRANSPORT & FACILITY MANAGEMENT        │
│ - Fleet management: routes, stops, vehicles & drivers       │
│ - Student transport allocation & boarding check-in flow     │
│ - Hostels, rooms & bed occupancy allocation engine          │
│ - Library catalog, inventory assets & maintenance tickets   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 7: AI COPILOT & AUTOMATION LAYER                      │
│ - Role-scoped "Ask School OS" Copilot engine                │
│ - Teacher AI Academic Assistant (lesson & quiz generators)   │
│ - Human-in-the-loop review queue for notices and alerts     │
│ - Early-warning attendance & academic intelligence          │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ PHASE 8: PRODUCTION HARDENING, VERIFICATION & CUTOVER       │
│ - Comprehensive typecheck, lint, and production build gates │
│ - Automated end-to-end acceptance tests                     │
│ - Data migration script execution & verification            │
│ - Deployment documentation & production readiness sign-off  │
└─────────────────────────────────────────────────────────────┘
```

---

## DETAILED BREAKDOWN OF PHASE 1 (NEXT IMMEDIATE PHASE)

**Goal:** Establish the uncompromised architectural core—design tokens, unbreachable authentication, role-based application shell, and canonical PostgreSQL database schema.

### Task 1.1: Unified Application Environment & Quality Gates
- Initialize the target application root with strict TypeScript 5.x.
- Enforce clean production configuration: disable `ignoreBuildErrors` and `ignoreDuringBuilds`.
- Configure environment schema with Zod validating all required secrets at boot.

### Task 1.2: Design Token System & Stitch UI Exploration
- Implement the "School OS Command Center" design tokens in `globals.css` and `tailwind.config.ts`.
- Set up tokens for neutral canvas, deep navy ink, electric violet accent, and status indicators.
- Use Stitch UI MCP to generate and preview key screen aesthetics.

### Task 1.3: Hardened Authentication & Identity Pipeline
- Eliminate role dropdown on the login screen.
- Implement server-side identity validation with bcrypt password hashing.
- Issue cryptographically signed HTTP-only session cookies.
- Server-side role resolution and workspace selector for multi-role users.
- Eliminate all `localStorage`-dependent auth flags.

### Task 1.4: Canonical Database Layer & Migration Baseline
- Deploy canonical PostgreSQL schema (Campuses, Users, Roles, Permissions, Students, Guardians, Enrollments, Fee Structures, Invoices, Attendance).
- Configure Row Level Security (RLS) policies scoped strictly to authenticated users and assigned campuses.
- Create automated seeding script for testing all 8 roles without hardcoded default credentials in production code.

### Task 1.5: Unified Application Shell
- Build responsive layout with 260px collapsible navigation rail and sticky command header.
- Implement global search command palette (`Ctrl+K`), notification bell, campus switcher, and profile menu.
- Configure role-aware navigation menus according to the canonical role matrix.

### Quality Verification Checklist for Phase 1
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes with zero warnings.
- [ ] `npm run build` succeeds in production mode.
- [ ] User can log in without selecting a role.
- [ ] Manipulating browser `localStorage` has zero effect on permissions.
- [ ] No hardcoded passwords or fallback JWT keys remain in code.
