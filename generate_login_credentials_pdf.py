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
            self.drawString(54, 755, "SARBIX SCHOOL OS — Institutional Role & Login Directory")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 747, 558, 747)
            
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "STRICTLY CONFIDENTIAL — Testing Credentials & Role Permissions Directory")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        
        self.restoreState()

def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4,
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#4F46E5'),
        spaceAfter=14,
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=6,
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6,
    )

    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0F172A'),
    )

    cell_normal = ParagraphStyle(
        'CellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#334155'),
    )

    cell_mono = ParagraphStyle(
        'CellMono',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1E293B'),
    )

    badge_pill = ParagraphStyle(
        'BadgePill',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor('#4338CA'),
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("SARBIX School OS — Role & Login Directory", title_style))
    story.append(Paragraph("Enterprise Multi-Campus Institutional System · User Access & Testing Manual", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4F46E5"), spaceAfter=12))

    # Notice banner
    notice_data = [
        [
            Paragraph("<b>DEFAULT GLOBAL PASSWORD:</b> <font color='#4F46E5'><b>Password@123</b></font>", cell_bold),
            Paragraph("<b>LOCAL LOGIN URL:</b> <font color='#0284C7'>http://localhost:3000/login</font>", cell_bold),
            Paragraph("<b>SECURITY:</b> Scoped Role Isolation Active", cell_bold)
        ]
    ]
    t_notice = Table(notice_data, colWidths=[170, 180, 154])
    t_notice.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C7D2FE")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_notice)
    story.append(Spacer(1, 14))

    # Section 1: Main Table
    story.append(Paragraph("1. Primary Credentials & Dedicated Workspaces", h2_style))
    story.append(Paragraph("Each persona is provisioned with a specialized dashboard, tailored navigation links, and server-side route protection. Logging in as one role does NOT give access to other role dashboards.", body_style))
    story.append(Spacer(1, 4))

    table_headers = [
        Paragraph("<b>Role & Persona</b>", cell_bold),
        Paragraph("<b>User Name</b>", cell_bold),
        Paragraph("<b>Institutional Email</b>", cell_bold),
        Paragraph("<b>Password</b>", cell_bold),
        Paragraph("<b>Dedicated URL</b>", cell_bold),
        Paragraph("<b>Primary Scope</b>", cell_bold)
    ]

    rows = [
        [
            Paragraph("<b>Principal</b>", badge_pill),
            Paragraph("Dr. Sunita Sharma", cell_normal),
            Paragraph("principal@delhi.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("<b>/overview</b>", cell_bold),
            Paragraph("Executive KPIs, Fees, Fleet, Approvals", cell_normal),
        ],
        [
            Paragraph("<b>Teacher</b>", badge_pill),
            Paragraph("Rajesh Verma", cell_normal),
            Paragraph("teacher@delhi.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("<b>/teacher</b>", cell_bold),
            Paragraph("Classroom, Roll Call, Grading Queue", cell_normal),
        ],
        [
            Paragraph("<b>Student</b>", badge_pill),
            Paragraph("Aarav Patel", cell_normal),
            Paragraph("student@delhi.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("<b>/student</b>", cell_bold),
            Paragraph("Personal Desk, Digital RFID ID, Timetable", cell_normal),
        ],
        [
            Paragraph("<b>Parent</b>", badge_pill),
            Paragraph("Vikram Patel", cell_normal),
            Paragraph("parent@delhi.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("<b>/parent</b>", cell_bold),
            Paragraph("Child Tracking, UPI QR Pay, Teacher Chat", cell_normal),
        ],
        [
            Paragraph("<b>Accountant</b>", badge_pill),
            Paragraph("Meera Nair", cell_normal),
            Paragraph("accountant@delhi.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("<b>/finance</b>", cell_bold),
            Paragraph("Fee Cashier, Student Ledger, GST Receipt", cell_normal),
        ],
        [
            Paragraph("<b>Transport Mgr</b>", badge_pill),
            Paragraph("Gurdeep Singh", cell_normal),
            Paragraph("transport@delhi.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("<b>/transport</b>", cell_bold),
            Paragraph("Live Bus GPS, Speed SOS, Route 04 List", cell_normal),
        ],
        [
            Paragraph("<b>Super Admin</b>", badge_pill),
            Paragraph("Aditya Singhania", cell_normal),
            Paragraph("superadmin@sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("<b>/overview</b>", cell_bold),
            Paragraph("Multi-Campus Admin, Staffing, Audit Trail", cell_normal),
        ],
    ]

    all_table_data = [table_headers] + rows
    t_roles = Table(all_table_data, colWidths=[70, 85, 140, 70, 55, 84])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_roles)
    story.append(Spacer(1, 14))

    # Section 2: Alternate Aliases
    story.append(Paragraph("2. Active Institutional Aliases", h2_style))
    story.append(Paragraph("The system also recognizes domain-specific email addresses:", body_style))
    story.append(Spacer(1, 4))

    alias_headers = [
        Paragraph("<b>Persona Designation</b>", cell_bold),
        Paragraph("<b>Alias Email ID</b>", cell_bold),
        Paragraph("<b>Password</b>", cell_bold),
        Paragraph("<b>Mapped Role</b>", cell_bold),
        Paragraph("<b>Target Landing</b>", cell_bold)
    ]
    alias_rows = [
        [
            Paragraph("Principal's Office", cell_normal),
            Paragraph("principal@delhicentral.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("Principal", cell_normal),
            Paragraph("/overview", cell_bold),
        ],
        [
            Paragraph("Senior Math Faculty", cell_normal),
            Paragraph("teacher.math@delhicentral.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("Teacher", cell_normal),
            Paragraph("/teacher", cell_bold),
        ],
        [
            Paragraph("Student Portal", cell_normal),
            Paragraph("aarav.sharma@student.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("Student", cell_normal),
            Paragraph("/student", cell_bold),
        ],
        [
            Paragraph("Guardian Portal", cell_normal),
            Paragraph("rajesh.sharma@parent.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("Parent", cell_normal),
            Paragraph("/parent", cell_bold),
        ],
        [
            Paragraph("Finance & Bursar Desk", cell_normal),
            Paragraph("finance@delhicentral.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("Accountant", cell_normal),
            Paragraph("/finance", cell_bold),
        ],
        [
            Paragraph("Fleet Operations Desk", cell_normal),
            Paragraph("transport@delhicentral.sarbix.edu", cell_mono),
            Paragraph("Password@123", cell_mono),
            Paragraph("Transport Mgr", cell_normal),
            Paragraph("/transport", cell_bold),
        ],
    ]
    t_alias = Table([alias_headers] + alias_rows, colWidths=[110, 165, 75, 80, 74])
    t_alias.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_alias)
    story.append(Spacer(1, 14))

    # Section 3: How to test
    story.append(Paragraph("3. Step-by-Step Login & Testing Instructions", h2_style))
    steps_data = [
        [
            Paragraph("<b>Step 1</b>", cell_bold),
            Paragraph("Open <b>http://localhost:3000/login</b> in any modern desktop or mobile browser.", cell_normal)
        ],
        [
            Paragraph("<b>Step 2</b>", cell_bold),
            Paragraph("Click the <b>'Select Demo Role & Persona'</b> dropdown menu located above the form.", cell_normal)
        ],
        [
            Paragraph("<b>Step 3</b>", cell_bold),
            Paragraph("Select any role (e.g. <b>Teacher</b> or <b>Parent</b>). The system will immediately populate the corresponding email and password, and update the Role Dossier card.", cell_normal)
        ],
        [
            Paragraph("<b>Step 4</b>", cell_bold),
            Paragraph("Click <b>'Sign In to SARBIX OS'</b>. You will be authenticated via JWT session cookie and automatically redirected to your role's dedicated workspace.", cell_normal)
        ],
        [
            Paragraph("<b>Step 5</b>", cell_bold),
            Paragraph("Notice the sidebar and mobile bottom navigation only show features relevant to that role. Attempting to navigate to other role routes will redirect safely.", cell_normal)
        ]
    ]
    t_steps = Table(steps_data, colWidths=[60, 444])
    t_steps.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_steps)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated PDF: {output_path}")

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), "SARBIX_ROLE_LOGIN_DIRECTORY.pdf")
    build_pdf(out)
