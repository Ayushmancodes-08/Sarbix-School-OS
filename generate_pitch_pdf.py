import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "SARBIX SCHOOL OS — Institutional Pitch & Testing Playbook")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)
            
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "CONFIDENTIAL — Prepared for School Leadership & Institutional Evaluators")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        
        self.restoreState()

def build_pitch_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#1E1B4B")     # Deep Indigo
    c_accent = colors.HexColor("#4F46E5")      # Vibrant Indigo
    c_secondary = colors.HexColor("#0284C7")   # Sky Blue
    c_success = colors.HexColor("#059669")     # Emerald
    c_dark = colors.HexColor("#0F172A")        # Slate 900
    c_body = colors.HexColor("#334155")        # Slate 700
    c_light = colors.HexColor("#F8FAFC")       # Slate 50
    c_border = colors.HexColor("#E2E8F0")      # Slate 200

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_primary,
        spaceAfter=6,
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_accent,
        spaceAfter=15,
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_accent,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_body,
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_body,
        leftIndent=12,
        spaceAfter=3,
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#1E3A8A"),
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=c_body,
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=c_dark,
    )

    story = []

    # ==================== COVER / HEADER ====================
    story.append(Paragraph("SARBIX SCHOOL OPERATING SYSTEM", title_style))
    story.append(Paragraph("Institutional Demonstration Playbook & Evaluator Pitch Guide", subtitle_style))
    
    # Executive Metadata Card
    meta_data = [
        [
            Paragraph("<b>Client / Institutional Target:</b> Leading K-12 Schools & Academies", table_cell_style),
            Paragraph("<b>Target Audience:</b> Principals, Trustees & Academic Directors", table_cell_style),
        ],
        [
            Paragraph("<b>Version:</b> 1.0 Production Prototype (Next.js 15 + Supabase Cloud)", table_cell_style),
            Paragraph("<b>Live Demo URL:</b> http://localhost:3000/login", table_cell_style),
        ],
        [
            Paragraph("<b>Test Student Dossier:</b> Aarav Patel (Grade 10-A, ADM-2026-0891)", table_cell_style),
            Paragraph("<b>Cloud Database:</b> Supabase PostgreSQL (ap-southeast-2)", table_cell_style),
        ],
    ]
    t_meta = Table(meta_data, colWidths=[250, 254])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    # ==================== SECTION 1: VALUE PROPOSITION ====================
    story.append(Paragraph("1. Executive Value Proposition — Why Sarbix OS?", h1_style))
    story.append(Paragraph(
        "Traditional school software is fragmented across isolated vendors: one vendor for admissions, another for student attendance, an external portal for fees, and third-party tracking for transport. <b>Sarbix School OS solves this by unifying all 7 institutional stakeholders into a single, high-velocity, real-time operating system.</b>",
        body_style
    ))

    # 4 Pillars Callout Grid
    pillars_data = [
        [
            Paragraph("<b>Unified Single Source of Truth</b><br/>Every student, teacher, fee payment, and bus route is instantly synced in real-time across all roles.", table_cell_style),
            Paragraph("<b>Rapid Morning Attendance</b><br/>Teachers complete daily roll calls in under 30 seconds; parents and students receive instant live verification.", table_cell_style),
        ],
        [
            Paragraph("<b>Frictionless Fee Collections</b><br/>Parents pay fees in 10 seconds via auto-generated UPI QR codes; accountants issue GST tax invoices instantly.", table_cell_style),
            Paragraph("<b>Enterprise Audit & Compliance</b><br/>Complete cryptographic audit logging of every record modification for CBSE, ICSE, and state accreditation.", table_cell_style),
        ],
    ]
    t_pillars = Table(pillars_data, colWidths=[250, 254])
    t_pillars.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C7D2FE")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E0E7FF")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_pillars)
    story.append(Spacer(1, 12))

    # ==================== SECTION 2: ROLES & CREDENTIALS MATRIX ====================
    story.append(Paragraph("2. Evaluator Role Matrix & 1-Click Fast Auth", h1_style))
    story.append(Paragraph(
        "On the login page (<b>http://localhost:3000/login</b>), evaluators can use the <b>Evaluator Role Switcher</b> to autofill credentials with one click. All demo accounts use the standard password: <b>Password@123</b>.",
        body_style
    ))

    roles_table_data = [
        [
            Paragraph("Role", table_header_style),
            Paragraph("Evaluator Email", table_header_style),
            Paragraph("Password", table_header_style),
            Paragraph("Key Responsibilities & Scope", table_header_style),
        ],
        [
            Paragraph("<b>Principal</b>", table_cell_bold),
            Paragraph("principal@delhi.sarbix.edu", table_cell_style),
            Paragraph("Password@123", table_cell_style),
            Paragraph("Executive Command Center, holistic campus analytics, student dossiers, live Supabase editing.", table_cell_style),
        ],
        [
            Paragraph("<b>Teacher</b>", table_cell_bold),
            Paragraph("teacher@delhi.sarbix.edu", table_cell_style),
            Paragraph("Password@123", table_cell_style),
            Paragraph("Class 10A homeroom roster, rapid batch attendance submission, academic timetable.", table_cell_style),
        ],
        [
            Paragraph("<b>Student</b>", table_cell_bold),
            Paragraph("student@delhi.sarbix.edu", table_cell_style),
            Paragraph("Password@123", table_cell_style),
            Paragraph("Digital Student ID, synced live attendance tracker, class schedule, homework portal.", table_cell_style),
        ],
        [
            Paragraph("<b>Parent</b>", table_cell_bold),
            Paragraph("parent@delhi.sarbix.edu", table_cell_style),
            Paragraph("Password@123", table_cell_style),
            Paragraph("Aarav's parent (Vikram Patel): instant UPI QR fee pay, official PDF tax receipts, bus route.", table_cell_style),
        ],
        [
            Paragraph("<b>Accountant</b>", table_cell_bold),
            Paragraph("accountant@delhi.sarbix.edu", table_cell_style),
            Paragraph("Password@123", table_cell_style),
            Paragraph("Institutional fee ledger, create student invoices, reconcile bank collections, print receipts.", table_cell_style),
        ],
        [
            Paragraph("<b>Transport</b>", table_cell_bold),
            Paragraph("transport@delhi.sarbix.edu", table_cell_style),
            Paragraph("Password@123", table_cell_style),
            Paragraph("Fleet telemetry, route waypoints, driver manifests for Route 04 (South Delhi Express).", table_cell_style),
        ],
        [
            Paragraph("<b>Super Admin</b>", table_cell_bold),
            Paragraph("superadmin@sarbix.edu", table_cell_style),
            Paragraph("Password@123", table_cell_style),
            Paragraph("Multi-campus governance, role permission matrix, cryptographic compliance audit logs.", table_cell_style),
        ],
    ]
    t_roles = Table(roles_table_data, colWidths=[70, 150, 74, 210])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_roles)
    story.append(Spacer(1, 14))

    # ==================== PAGE BREAK FOR DETAILED WALKTHROUGH ====================
    story.append(PageBreak())

    # ==================== SECTION 3: CENTERPIECE DEMONSTRATION WALKTHROUGH ====================
    story.append(Paragraph("3. Pitch Walkthrough: End-to-End Management of Student Aarav Patel", h1_style))
    story.append(Paragraph(
        "To give school leadership an unforgettable demonstration, run this cohesive story centered around a real enrolled student: <b>Aarav Patel (ID: std-001, Class: Grade 10-A, Admission: ADM-2026-0891)</b>.",
        body_style
    ))

    # Step 1: Principal
    story.append(Paragraph("Step 1: Principal Command Center & Supabase Cloud Management", h2_style))
    story.append(Paragraph("<b>Log in as:</b> principal@delhi.sarbix.edu | <b>Destination:</b> /students/std-001", bullet_style))
    story.append(Paragraph("• <b>Inspect Dossier:</b> View Aarav's complete academic profile, attendance standing (94.8%), blood group (O+), and assigned bus route (Route 04).", bullet_style))
    story.append(Paragraph("• <b>Live Supabase Edit:</b> Click the purple <b>'Manage Student (Supabase)'</b> button. Notice the live indicator showing connection to Supabase PostgreSQL (Project: debhfqjgqmlmujrfyrny).", bullet_style))
    story.append(Paragraph("• <b>Modify Record:</b> Update his fee balance, emergency contact, or section, then click <b>'Save to Supabase'</b>. The update synchronizes to the cloud database with live confirmation.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 2: Teacher
    story.append(Paragraph("Step 2: Morning Roll Call & Rapid Attendance Sync", h2_style))
    story.append(Paragraph("<b>Log in as:</b> teacher@delhi.sarbix.edu | <b>Destination:</b> /attendance", bullet_style))
    story.append(Paragraph("• <b>Open Homeroom:</b> Select Class Grade 10, Section A. Aarav Patel appears at Roll #10A-14.", bullet_style))
    story.append(Paragraph("• <b>Mark Attendance:</b> Toggle Aarav to 'Present' (or 'Late') with one click.", bullet_style))
    story.append(Paragraph("• <b>Submit Roster:</b> Click <b>'Submit Roster & Sync'</b>. Attendance records are instantly persisted to the cloud, updating campus welfare statistics.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 3: Student
    story.append(Paragraph("Step 3: Student Learning Hub & Digital ID", h2_style))
    story.append(Paragraph("<b>Log in as:</b> student@delhi.sarbix.edu | <b>Destination:</b> /student", bullet_style))
    story.append(Paragraph("• <b>Digital ID Badge:</b> Aarav views his photo, QR-coded admission ID, and active status.", bullet_style))
    story.append(Paragraph("• <b>Live Attendance Tracker:</b> Observe the real-time attendance indicator showing that his homeroom teacher verified him this morning.", bullet_style))
    story.append(Paragraph("• <b>Academic Timetable:</b> Check his personalized daily class schedule, upcoming tests, and assignments.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 4: Parent
    story.append(Paragraph("Step 4: Parent Portal, UPI QR Fee Payment & Tax Receipts", h2_style))
    story.append(Paragraph("<b>Log in as:</b> parent@delhi.sarbix.edu | <b>Destination:</b> /parent", bullet_style))
    story.append(Paragraph("• <b>Aarav's Welfare Overview:</b> Vikram Patel (father) monitors Aarav's attendance and academic progress.", bullet_style))
    story.append(Paragraph("• <b>Instant Dynamic UPI QR:</b> Click <b>'Pay Fees via QR'</b> on the ₹18,500 pending invoice. An instant UPI QR code modal opens with pre-populated VPA and invoice number.", bullet_style))
    story.append(Paragraph("• <b>Official PDF Receipt:</b> Click <b>'Download Tax Receipt'</b> to view, inspect, and print a fully formatted institutional fee receipt with GST breakdown.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 5: Accountant
    story.append(Paragraph("Step 5: Institutional Finance Ledger & Invoice Issuance", h2_style))
    story.append(Paragraph("<b>Log in as:</b> accountant@delhi.sarbix.edu | <b>Destination:</b> /finance", bullet_style))
    story.append(Paragraph("• <b>Fee Ledger:</b> View total collections, pending balances, and search Aarav Patel's ledger.", bullet_style))
    story.append(Paragraph("• <b>Generate New Invoice:</b> Click <b>'Create New Invoice'</b>, select Aarav Patel, enter fee head and amount, and submit. The invoice is written directly to Supabase and instantly visible to his parents.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 6: Transport
    story.append(Paragraph("Step 6: Fleet GPS Telemetry & Student Bus Manifest", h2_style))
    story.append(Paragraph("<b>Log in as:</b> transport@delhi.sarbix.edu | <b>Destination:</b> /transport", bullet_style))
    story.append(Paragraph("• <b>Active Fleet Status:</b> Monitor 8 active school buses across New Delhi routes.", bullet_style))
    story.append(Paragraph("• <b>Aarav's Commute:</b> Inspect <b>Route 04 (South Delhi Express)</b>. Verify driver contact, GPS coordinates, and student boarding roster.", bullet_style))
    story.append(Spacer(1, 6))

    # Step 7: Super Admin
    story.append(Paragraph("Step 7: Multi-Campus Governance & Cryptographic Audit Trail", h2_style))
    story.append(Paragraph("<b>Log in as:</b> superadmin@sarbix.edu | <b>Destination:</b> /settings", bullet_style))
    story.append(Paragraph("• <b>RBAC Matrix:</b> Inspect granular permissions across Delhi Central, South, and Rohini campuses.", bullet_style))
    story.append(Paragraph("• <b>Audit Trail:</b> Verify the audit logs recording every action performed during the demo (student edits, fee generation, attendance updates) with timestamps and actor IDs.", bullet_style))
    story.append(Spacer(1, 14))

    # ==================== PAGE BREAK FOR TECH & FAQ ====================
    story.append(PageBreak())

    # ==================== SECTION 4: CLOUD DATABASE (SUPABASE) ARCHITECTURE ====================
    story.append(Paragraph("4. Enterprise Database & Cloud Infrastructure (Supabase)", h1_style))
    story.append(Paragraph(
        "Sarbix School OS is built on an enterprise hybrid architecture that combines a high-speed local institutional cache with a live <b>Supabase Cloud PostgreSQL</b> database.",
        body_style
    ))

    db_info_data = [
        [Paragraph("Component", table_header_style), Paragraph("Specification & Live Status", table_header_style)],
        [Paragraph("<b>Supabase Project Ref</b>", table_cell_bold), Paragraph("debhfqjgqmlmujrfyrny (ap-southeast-2)", table_cell_style)],
        [Paragraph("<b>Database Engine</b>", table_cell_bold), Paragraph("PostgreSQL 17.6 Enterprise Managed Instance", table_cell_style)],
        [Paragraph("<b>API Layer</b>", table_cell_bold), Paragraph("REST API v1 + Row Level Security (RLS) + JWT Auth", table_cell_style)],
        [Paragraph("<b>Core Cloud Tables</b>", table_cell_bold), Paragraph("students, attendance_records, fee_invoices", table_cell_style)],
        [Paragraph("<b>Offline Resilience</b>", table_cell_bold), Paragraph("Automatic local fallback ensures zero disruption if school internet flickers", table_cell_style)],
        [Paragraph("<b>Live Verification</b>", table_cell_bold), Paragraph("Verified live: student read/write, fee invoice creation, and attendance sync", table_cell_style)],
    ]
    t_db = Table(db_info_data, colWidths=[150, 354])
    t_db.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_db)
    story.append(Spacer(1, 14))

    # ==================== SECTION 5: SCHOOL PITCH FAQ & OBJECTION HANDLING ====================
    story.append(Paragraph("5. School Pitch Talking Points & Objection Handling", h1_style))
    
    faq_data = [
        ("Q: Will teachers find it difficult to adopt?", 
         "A: No. The interface is optimized for rapid mobile touch. Morning roll call requires only toggling present/absent and hitting submit, taking less than 30 seconds per classroom."),
        ("Q: Can parents pay school fees easily without downloading complicated apps?", 
         "A: Yes. Parents can open the portal on any smartphone, view their itemized invoice, and click 'Pay Fees via QR' to scan with Google Pay, PhonePe, or Paytm instantly."),
        ("Q: What happens if school WiFi goes down during morning roll call?", 
         "A: Sarbix OS features an offline-first resilient architecture. Attendance is queued locally and syncs back to Supabase cloud automatically as soon as connection is restored."),
        ("Q: Can we customize permissions for our vice-principals and department heads?", 
         "A: Yes. The system has a granular Role-Based Access Control (RBAC) matrix that allows institutional admins to configure custom view/edit rights per campus or department."),
        ("Q: How does this help with school accreditation (CBSE / ICSE / IB / Cambridge)?", 
         "A: All attendance rosters, grade sheets, student disciplinary notes, and fee transactions are timestamped with cryptographic audit trails ready for one-click compliance export.")
    ]

    for q, a in faq_data:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 10))

    # ==================== SUMMARY CALLOUT BOX ====================
    summary_box_data = [[
        Paragraph(
            "<b>Institutional Evaluator Next Steps:</b><br/>"
            "1. Launch <code>http://localhost:3000/login</code><br/>"
            "2. Click through the 7 roles using the 1-Click Evaluator Presets.<br/>"
            "3. Walk through student <b>Aarav Patel (std-001)</b> from Principal edit &rarr; Teacher attendance &rarr; Parent QR payment.<br/>"
            "4. For institutional deployment inquiries, contact <b>Sarbix Growth Agency</b>.",
            callout_style
        )
    ]]
    t_summary = Table(summary_box_data, colWidths=[504])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#3B82F6")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_summary)

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {output_path}")

if __name__ == "__main__":
    output_pdf = os.path.join(r"d:\Apps\Sarbix-School-OS", "SARBIX_PITCH_AND_TESTING_GUIDE.pdf")
    build_pitch_pdf(output_pdf)
