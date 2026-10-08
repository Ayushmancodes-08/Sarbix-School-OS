# SARBIX SCHOOL OPERATING SYSTEM — UNIFIED DESIGN SYSTEM & UI BLUEPRINT

**Design System Name:** Academic Kinetic / Sarbix Sovereign Command  
**Stitch MCP Project:** `projects/3630327295540659344` ("Sarbix School Operating System")  
**Design System Token ID:** `assets/58a433a3f21e4f5fac23c2ccf1dab48c`  
**Archetype:** Premium Institutional SaaS + Modern Productivity Software + Subtle Gen-Z Editorial Character  
**Date:** October 2026  
**Status:** COMPLETED — DESIGN PHASE BASELINE ESTABLISHED  

---

## 1. BRAND & DESIGN LANGUAGE

Sarbix School OS breaks completely away from generic, outdated educational software. It treats school operations with the visual discipline, optical density, and poise of high-end developer and financial command centers.

### Visual Pillars
- **Institutional Dignity:** Deep, authoritative ink surfaces (`#131E3D`, `#0F172A`) that signal security, permanence, and regulatory compliance.
- **Calm Information Architecture:** 70% neutral canvas prevents sensory fatigue during 8-hour administrative workdays.
- **Kinetic Precision:** High-contrast electric violet accent (`#7C3AED`) brings an energetic, contemporary Gen-Z edge without becoming cartoonish or playful.
- **Prohibited Clichés:**
  - ❌ Childish school mascots, backpacks, pencils, or cartoon illustrations.
  - ❌ Generic Bootstrap / Material Design 2012 table clones.
  - ❌ "Wall-of-cards" layouts where 12 equal KPI widgets cause cognitive paralysis.
  - ❌ Neon cyberpunk / terminal glow aesthetic.
  - ❌ Excessive blurred glassmorphism that destroys tabular text contrast.

---

## 2. TYPOGRAPHY SYSTEM

Three distinct typographic roles establish strict vertical hierarchy and tabular scanning speed:

| Role | Font Family | Weights | Tracking / Line Height | Purpose |
|---|---|---|---|---|
| **Editorial & Display** | `Hanken Grotesk` / `Plus Jakarta Sans` | SemiBold (600), Bold (700), ExtraBold (800) | `-0.025em` to `-0.03em`, Line Height 1.15 | Page titles, command center greeting, prominent section anchors |
| **Interface & Narrative** | `Inter` / `Hanken Grotesk` | Regular (400), Medium (500) | `0em`, Line Height 1.45 | Form inputs, dialog body copy, table cell content, descriptions |
| **Technical & Tabular** | `Space Grotesk` / `JetBrains Mono` | Medium (500), Bold (700) | `+0.04em`, `font-variant-numeric: tabular-nums` | Admission numbers, invoice IDs, GPA scores, attendance percentages, time slots |

### Typographic Scale
- `display-hero`: 56px / 64px, 800 weight, `-0.03em`
- `headline-lg`: 36px / 44px, 700 weight, `-0.025em`
- `headline-md`: 24px / 32px, 600 weight, `-0.02em`
- `title-md`: 16px / 24px, 600 weight, `-0.01em`
- `body-lg`: 16px / 26px, 400 weight, `-0.005em`
- `body-md`: 14px / 22px, 400 weight, `0em`
- `body-sm`: 12px / 18px, 400 weight, `0.005em`
- `label-caps`: 11px / 16px, 700 weight, `+0.08em` uppercase tracking
- `metric-display`: 32px / 38px, 700 weight, tabular numerals, `-0.03em`

---

## 3. COLOR TOKENS (70 / 20 / 10 PRINCIPLE)

```css
/* 70% NEUTRAL CANVAS & BASE SURFACES */
--canvas-base: #FAF8FF;            /* Cool calibrated off-white preventing screen glare */
--surface-card: #FFFFFF;           /* Crisp, pure white card and modal surface */
--surface-table-header: #F2F3FF;   /* High-readability table header and track background */
--surface-subtle: #EAEDFF;         /* Inactive filter wells and secondary segmented controls */

/* 20% STRUCTURAL INK & CHROME */
--structural-ink: #0F172A;         /* Primary high-contrast text and authoritative headings */
--structural-sidebar: #131E3D;     /* Deep navy command rail and persistent shell chrome */
--structural-border: #E2E7FF;      /* Hairline 1px structural container boundary */
--structural-border-subtle: #C6C6CF; /* Secondary divider */
--text-secondary: #45464E;         /* Metadata labels, column headers, helper text */

/* 10% EXPRESSIVE ACCENT & INTERACTIVE AFFORDANCES */
--accent-electric: #7C3AED;        /* Electric violet for primary actions, active pills, AI Copilot */
--accent-glow: rgba(124, 58, 237, 0.25); /* Focus aura ring */
--accent-electric-bg: #EADDFF;     /* Violet tinted badge and active state fill */
--accent-cyan: #06B6D4;            /* Secondary telemetry indicator (fleet / GPS) */

/* SEMANTIC STATUS SPECTRUM (Color + Icon + Label) */
--status-success: #059669;         /* Present attendance, paid invoice, approved admission */
--status-success-bg: #ECFDF5;
--status-warning: #D97706;         /* Partial payment, due invoice, counselor review required */
--status-warning-bg: #FFFBEB;
--status-danger: #DC2626;          /* Absent, overdue fee defaulter, emergency security alert */
--status-danger-bg: #FEF2F2;
```

---

## 4. SPACING & GRID SYSTEM

- **Base Rhythm:** 4px absolute modular base scale (`space-xs: 4px`, `space-sm: 8px`, `space-md: 16px`, `space-lg: 24px`, `space-xl: 40px`).
- **Container Maximum Bounds:** Pinned to `1600px` with `24px` outer canvas gutters.
- **Asymmetric Desktop Grid:** 16-column base or `4:12` / `5:11` asymmetric layout:
  - Fixed 260px Left Telemetry Rail.
  - Fluid Primary Operational Workspace (65% width).
  - Contextual Inspector / AI Drawer (35% width, or 440px slide-out).

---

## 5. BORDER & RADIUS SYSTEM

- **Geometric Discipline:** Strict, non-swollen radii that sustain institutional precision:
  - Micro-tags, status flags, and data checkboxes: `0.125rem` (2px) to `0.25rem` (4px).
  - Form fields, buttons, and row controls: `0.25rem` (4px) to `0.375rem` (6px).
  - Structural cards, analytical panels, and data tables: `0.5rem` (8px).
  - Floating dialogs and command overlays: `0.75rem` (12px).
  - Circular elements (User avatars, live pulse dots): `9999px` (`rounded-full`).

---

## 6. ELEVATION & DEPTH

Depth is achieved through calibrated hairline borders and ambient low-opacity shadows:
- **Level 0 (Canvas Base):** Flat `#FAF8FF`.
- **Level 1 (Card & Panel Surface):** `#FFFFFF` surface enclosed by `1px solid rgba(15, 23, 42, 0.08)` with shadow `0px 2px 8px -2px rgba(19, 30, 61, 0.04)`.
- **Level 2 (Hover & Selected State):** Border shifts to `rgba(124, 58, 237, 0.35)` with shadow `0px 12px 24px -6px rgba(19, 30, 61, 0.08)`.
- **Level 3 (Command Palette & AI Drawer):** Floating `#FFFFFF` surface with `0px 24px 48px -12px rgba(19, 30, 61, 0.18)` and active violet rim `0 0 0 1px rgba(139, 92, 246, 0.20)`.

---

## 7. ICONOGRAPHY

- **Icon Set:** Lucide React with standard stroke width `1.75px`.
- **Sizes:** Micro icons in badges: 14px; Row actions: 16px; Navigation rail: 20px; Hero stats: 24px.
- **Rules:** Icons always accompany text labels for critical actions; never rely on standalone unexplained iconography.

---

## 8. MOTION & INTERACTION PRINCIPLES

- **Duration:** 150ms – 220ms.
- **Easing Curve:** Cubic-bezier `(0.16, 1, 0.3, 1)`.
- **Micro-Transitions:**
  - Button hover: Crisp background color shift + subtle 12px luminous shadow bloom.
  - Table row hover: Immediate `rgba(124, 58, 237, 0.02)` background tint.
  - Drawer transition: Spring-like horizontal slide from right edge.
  - Zero idle looping animations or floating elements.

---

## 9. NAVIGATION MODEL

A unified shell that stays structurally consistent across all 8 personas:

```
┌─────────────────────────────────────────────────────────────┐
│ STICKY COMMAND BAR (64px)                                   │
│ [Breadcrumbs]  [Ctrl+K Global Search / Ask School OS]  [Bell]│
├───────────────┬─────────────────────────────────────────────┤
│ PINNED RAIL   │ PRIMARY WORKSPACE CANVAS                    │
│ (260px)       │                                             │
│ • Campus      │ 1. Contextual Greeting                      │
│ • Overview    │ 2. Exactly 4 High-Signal KPIs               │
│ • Students    │ 3. Priority Action Queue (Needs Attention)   │
│ • Academics   │ 4. Trendline Velocity Chart                 │
│ • Attendance  │ 5. Dense Data Table Workspace               │
│ • Finance     │                                             │
│ • Transport   │                                             │
│ • AI Copilot  │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

---

## 10. HIGH-DENSITY TABLE SYSTEM

- **Sticky Header:** `#F8F9FC` background with `11px` bold uppercase `label-caps` in `#64748B`.
- **Row Architecture:** 44px uniform row height with `1px solid rgba(15, 23, 42, 0.05)` dividers.
- **Column Alignment:**
  - Names, classes, and descriptions: Left-aligned.
  - Status badges, dates, and action controls: Centered.
  - Monospaced numbers, currency totals, percentages, and attendance counts: Right-aligned (`tabular-nums`).

---

## 11. FORM SYSTEM

- **Inputs:** 38px height with `#FFFFFF` background and crisp `1px solid rgba(15, 23, 42, 0.16)` border.
- **Focus State:** Hairline border turns to `#7C3AED` backed by an immediate glow ring: `box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.20)`.
- **Inline Validation:** Instant Zod-driven field validation with clean microcopy helpers in `#DC2626` (errors) or `#059669` (valid).

---

## 12. MODAL & DRAWER SYSTEM

- **Centered Confirmation Modals:** 480px width, reserved strictly for irreversible or destructive actions (e.g. expulsion, refund authorization, grade publishing).
- **Contextual Right Drawers:** 440px – 520px width for Student 360 inspector, attendance reason logging, and AI Copilot dialogue.

---

## 13. EMPTY STATES

Every empty state follows a 3-part blueprint:
1. Architectural linear wireframe glyph (stroke 1.5px in slate-400).
2. Plain, non-patronizing explanation (e.g. *"No outstanding invoices for Class 10-A"*).
3. Single direct next action button (e.g. *"+ Generate New Invoice"*).

---

## 14. LOADING STATES

- Skeleton shimmer blocks matching exact typography and table dimensions using linear gradient sweeps from `#F1F4F9` to `#E2E7FF` back to `#F1F4F9`.
- **Zero spinning loading wheels** in tabular data workspaces.

---

## 15. ERROR STATES

- Actionable notification banners in `#FEF2F2` with `1px solid #FCA5A5`.
- Contains clear cause explanation, copyable support trace code (`Trace ID: ERR_ATT_9041` in `JetBrains Mono`), and a primary "Retry Request" button. Existing records are explicitly confirmed safe.

---

## 16. NOTIFICATION SYSTEM

- Toast stack positioned at bottom-right with semantic icon, title, description, and optional undo button.
- Notification Center in command bar categorizes alerts into: *System Governance*, *Student Safety*, *Academic Deadlines*, and *Finance Reconciliation*.

---

## 17. COMMAND PALETTE (`Ctrl + K` / `Cmd + K`)

- Centered modal dialog with immediate fuzzy search across 4 operational indices:
  1. **People:** Students, teachers, guardians (`Aarav Patel`, `Dr. Raman`).
  2. **Workspaces & Modules:** Navigation destinations (`Attendance Console`, `Fee Ledger`).
  3. **Direct Actions:** `+ Take Attendance for 9-B`, `Issue Gate Pass`, `Export P&L Report`.
  4. **Ask School OS:** Natural language query routing directly to AI Copilot.

---

## 18. AI INTERACTION PATTERNS & SAFEGUARDS

- **Trigger:** Persistent `Ask School OS` button with violet indicator in the top command bar (`Ctrl + Space`).
- **Data Scope Transparency:** Every response displays an explicit badge:  
  `Security Scope: Teacher (Class 10-A, 9-B Read Only) • Zero-Trust Boundary Enforced`.
- **Structured Outputs:** Results rendered as sortable tables, bulleted diagnostic briefs, and drafted notifications.
- **Mandatory Human Review:** High-impact outputs (parent announcements, disciplinary flags, fee demand letters) feature an unmistakable banner:  
  `AI Draft — Review & Authorize before dispatch. High-impact operational actions require human administrator signature.`

---

## 19. RESPONSIVE BEHAVIOR MATRIX

- **Desktop (≥ 1280px):** Full asymmetric command center layout; persistent 260px navigation rail; simultaneous data and inspector pane visibility.
- **Tablet (768px – 1279px):** Navigation rail collapses to 72px icon rail; right inspector becomes an off-canvas drawer; tables preserve horizontal touch scrolling with sticky identity columns.
- **Mobile (< 768px):** Task-first flow with bottom quick-navigation bar (Home, Attendance, Notices, Profile); wide tables convert to high-density stacked cards.

---

## 20. ACCESSIBILITY STANDARDS (WCAG 2.1 AA)

- **Contrast Ratios:** Text on canvas exceeds 7:1; buttons and badges exceed 4.5:1.
- **Keyboard Traversal:** 100% of interactive elements reachable via `Tab`; logical focus rings (`2px offset solid #7C3AED`).
- **Color Independence:** Status is never conveyed by color alone; every badge pairs a color with a descriptive text label and an icon.
- **Screen Reader Landmarks:** Proper `<main>`, `<nav>`, `<header>`, and `aria-live` regions for live attendance consolidation and telemetry feeds.

---

## 21. STITCH MCP GENERATED SCREENS INVENTORY

The following core screens have been generated directly into the Stitch MCP project (`projects/3630327295540659344`):

1. **Institutional Login Screen:**  
   Asymmetric editorial split screen; institutional trust narrative with live constellation graphic and metrics ticker on left; hyper-focused login form without role dropdowns on right.  
   *Screen Resource:* `projects/3630327295540659344/screens/8c9507d6a49e434fb34d851b740cdc8e`  
   *Screenshot Artifact:* [View Generated Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1WKi8R3PXuCLySq1IVmPMNY2RQsDKPXFF2Z_qXqMdLoahJ7IB5aUVPoCAOLaHSiVruGswCTtN9tpSFuZkZ1nQNJ3dyxGPShvDLUaZLbdU1QvXvLwZ2wg8q0FBhm3ur1Yw1JR4tuZfuEMDUBQYuYH2MwBV5xeILCEqyn5922zcl9rNZOAU3URlOPFr9oo0cImSVMSGzs8qKav2v53sn5uvzDFrjgQFO2dGDqrKCf2hnZN0HzRAVouKojejc)
2. **Management Command Center:**  
   Executive health overview; 4 high-signal KPI blocks; dual-axis attendance & GPA velocity chart; live cross-section diagnostic table; priority action queue; AI operational digest.
3. **Student 360 Profile:**  
   Hero identity banner; multi-term enrollment tracking; chronological achievement & intervention timeline; subject mastery matrix; guardian contact cards; live transport status.
4. **Teacher Today Classroom Workspace:**  
   Chronological daily period ribbon with real-time period indicator; active assignment submission queue; classroom attention flags; AI Teaching Copilot widget with instant quiz drafting.
5. **Parent Family Portal:**  
   Segmented multi-child switcher; reassuring student check-in status banner; homework and exam progress; live bus route ETA; fee receipt history; PTM slot scheduler.
6. **Rapid Attendance Console:**  
   Speed-optimized roll-call console; default Present status; one-key hotkey navigation (`P`, `A`, `L`); consecutive absence alerts; automatic parent notice dispatch queue.
7. **Finance & Fee Billing Center:**  
   Executive revenue and collection velocity KPIs; multi-component invoice ledger; automated dunning reminder pipeline; payment channel breakdown; real-time receipt stream.
8. **AI School Copilot Console ("Ask School OS"):**  
   Permission-scoped decision intelligence drawer; natural language multi-turn queries; tabular query execution outputs; actionable draft generators with mandatory human authorization safeguards.
