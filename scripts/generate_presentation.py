import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_beautiful_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions for Google Slides
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors (Cyber-Medical Dark Mode)
    BG_DARK = RGBColor(11, 15, 25)        # #0B0F19 Deep Night
    CARD_BG = RGBColor(22, 29, 47)        # #161D2F Glass Slate
    INNER_BG = RGBColor(16, 21, 35)       # #101523 Darker Slate
    BORDER_SUBTLE = RGBColor(38, 48, 77)  # #26304D
    ACCENT_RED = RGBColor(255, 59, 92)    # #FF3B5C Crimson Alert
    ACCENT_GREEN = RGBColor(0, 224, 142)  # #00E08E Pulse Green
    ACCENT_BLUE = RGBColor(14, 144, 255)  # #0E90FF Cyber Blue
    ACCENT_PURPLE = RGBColor(185, 96, 255)# #B960FF Command Violet
    ACCENT_AMBER = RGBColor(255, 179, 0)  # #FFB300 Alert Amber
    TEXT_LIGHT = RGBColor(245, 247, 252)  # #F5F7FC Crisp White
    TEXT_MUTED = RGBColor(156, 169, 196)  # #9CA9C4 Cool Gray
    TEXT_FAINT = RGBColor(105, 118, 147)  # #697693 Subtitle Gray

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def make_card(slide, x, y, w, h, bg_color=CARD_BG, border_color=BORDER_SUBTLE, border_width=1.5):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width)
        return card

    def add_badge(slide, x, y, text, text_color=ACCENT_RED, bg_color=INNER_BG, border_color=ACCENT_RED):
        w = Inches(len(text) * 0.11 + 0.4)
        h = Inches(0.32)
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        badge.fill.solid()
        badge.fill.fore_color.rgb = bg_color
        badge.line.color.rgb = border_color
        badge.line.width = Pt(1.0)
        tf = badge.text_frame
        tf.word_wrap = False
        p = tf.paragraphs[0]
        p.text = text
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = text_color
        return badge

    def add_header(slide, tag_text, title_text, subtitle_text, accent_color=ACCENT_RED):
        add_badge(slide, Inches(0.8), Inches(0.42), tag_text, text_color=accent_color, border_color=accent_color)
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.82), Inches(11.733), Inches(0.95))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = TEXT_LIGHT

        p2 = tf.add_paragraph()
        p2.text = subtitle_text
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(3)

    # ==========================================
    # SLIDE 1: COVER & 4 TEAM MEMBER ROLES
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    # Header section
    add_badge(s1, Inches(0.8), Inches(0.45), "🛡️ IIIT LUCKNOW • B.TECH CS/IT/CSAI/CSB • SEMESTER 3", ACCENT_RED, border_color=ACCENT_RED)
    add_badge(s1, Inches(6.0), Inches(0.45), "COURSE: SOFTWARE ENGINEERING", ACCENT_BLUE, border_color=ACCENT_BLUE)
    add_badge(s1, Inches(9.3), Inches(0.45), "SLIDE 01 / 05", TEXT_MUTED, border_color=BORDER_SUBTLE)

    title_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.733), Inches(1.4))
    tf = title_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "MediGuard: Campus Emergency Health & Response System"
    p.font.size = Pt(30)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT

    p2 = tf.add_paragraph()
    p2.text = "Full-Stack Cloud-Native MERN Solution with Web Audio Dispatch Calling, IIITL Identity Mapping & Kubernetes Scalability"
    p2.font.size = Pt(13)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(4)

    # 4 Member Role Cards
    roles = [
        ("MEMBER 1: PROJECT LEAD", "Requirement Analysis & Scope", [
            ("Problem Definition", "Campus emergency response delays & golden-hour gap."),
            ("IEEE 830 SRS", "Functional & non-functional requirements specification."),
            ("Clinical Protocols", "Triage prioritization & medical safety standards."),
            ("Ethics & Legal", "Good Samaritan protections & data privacy boundaries.")
        ], ACCENT_RED),

        ("MEMBER 2: FRONTEND LEAD", "UI/UX & Audio Engineering", [
            ("React 19 & Vite 8", "Cyber-medical responsive dark glassmorphism UI."),
            ("Web Audio API", "Real-time DTMF telephone synthesizer (zero MP3s)."),
            ("HTML5 Canvas HUD", "Dynamic audio waveform visualization in dispatch call."),
            ("110 BPM Metronome", "Acoustic compression pacer for AHA adult CPR.")
        ], ACCENT_BLUE),

        ("MEMBER 3: BACKEND LEAD", "API & Database Architecture", [
            ("Express REST Engine", "Microservices for ambulance, blood, first-aid, meds."),
            ("IIITL Roll Parser", "Regex parser for LCS, LIT, LCI, LCB (rolls 1-60)."),
            ("MongoDB Atlas", "Schema modeling with compound indexes & hybrid sync."),
            ("Admin Command Hub", "Real-time incident dispatch & fleet triage at /admin.")
        ], ACCENT_PURPLE),

        ("MEMBER 4: DEVOPS LEAD", "Cloud & Deployment Pipeline", [
            ("Docker Multi-Stage", "Lean Alpine container builds (~25 MB production size)."),
            ("Kubernetes Clusters", "Deployments, HPA (2-10 pods), Ingress controllers."),
            ("Vercel Multi-Service", "Serverless edge architecture with SPA fallback routing."),
            ("E2E Integration", "CI/CD continuous delivery from GitHub repository.")
        ], ACCENT_GREEN)
    ]

    card_w = Inches(2.78)
    gap = Inches(0.2)
    start_x = Inches(0.8)
    top_y = Inches(2.6)
    card_h = Inches(4.0)

    for i, (m_tag, m_role, items, m_color) in enumerate(roles):
        x = start_x + i * (card_w + gap)
        make_card(s1, x, top_y, card_w, card_h, bg_color=CARD_BG, border_color=m_color, border_width=1.5)

        tb = s1.shapes.add_textbox(x + Inches(0.15), top_y + Inches(0.15), card_w - Inches(0.3), card_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = m_tag
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = m_color

        p2 = tf.add_paragraph()
        p2.text = m_role
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_LIGHT
        p2.space_before = Pt(2)
        p2.space_after = Pt(8)

        for heading, desc in items:
            ph = tf.add_paragraph()
            ph.text = f"• {heading}:"
            ph.font.size = Pt(9.5)
            ph.font.bold = True
            ph.font.color.rgb = m_color
            ph.space_before = Pt(3)

            pd = tf.add_paragraph()
            pd.text = f"  {desc}"
            pd.font.size = Pt(9)
            pd.font.color.rgb = TEXT_MUTED

    # Bottom Banner with Canonical Live Link
    bottom_card = make_card(s1, Inches(0.8), Inches(6.75), Inches(11.733), Inches(0.55), bg_color=INNER_BG, border_color=BORDER_SUBTLE)
    tb_b = s1.shapes.add_textbox(Inches(0.95), Inches(6.78), Inches(11.4), Inches(0.48))
    tf_b = tb_b.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.text = "🌐 Official Live Production URL: https://se-ne6t-git-main-ddd-510a.vercel.app/  •  GitHub Repository: github.com/kuldeeprohit2006-cmd/se"
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = ACCENT_GREEN

    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT & PROPOSED SOLUTION
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "SLIDE 02 / 05 • REQUIREMENT ANALYSIS", 
               "Problem Statement & The MediGuard Solution Architecture", 
               "Eliminating the Campus 'Golden Hour' Response Gap with Immediate Triage Telemetry", 
               ACCENT_RED)

    # Left: Problems
    col_w = Inches(5.72)
    make_card(s2, Inches(0.8), Inches(1.9), col_w, Inches(4.5), bg_color=CARD_BG, border_color=ACCENT_RED, border_width=1.5)
    tb_p = s2.shapes.add_textbox(Inches(1.0), Inches(2.05), col_w - Inches(0.4), Inches(4.2))
    tf_p = tb_p.text_frame
    tf_p.word_wrap = True

    p = tf_p.paragraphs[0]
    p.text = "🚨 Critical Failure Points in Traditional Campus Setup"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED
    p.space_after = Pt(10)

    problem_list = [
        ("The 'Golden Hour' Communication Delay", "In critical traumas or asthma attacks, students waste 5-10 minutes finding emergency phone numbers and explaining hostel locations."),
        ("Bystander Panic & CPR Rhythm Deficiency", "In sudden cardiac arrest, brain tissue dies after 4 minutes. Untrained peers panic or compress at incorrect frequencies."),
        ("Siloed Campus Healthcare Infrastructure", "Hostel wardens and dispensary teams receive zero real-time telemetry on active incidents until students manually arrive."),
        ("Dangerous Self-Prescription Hazards", "Students administer over-the-counter painkillers without knowledge of fatal contraindications (e.g. aspirin in dengue or ulcers).")
    ]
    for title, desc in problem_list:
        pt = tf_p.add_paragraph()
        pt.text = "❌ " + title
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_LIGHT
        pt.space_before = Pt(4)

        pd = tf_p.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # Right: Solutions
    make_card(s2, Inches(6.8), Inches(1.9), col_w, Inches(4.5), bg_color=CARD_BG, border_color=ACCENT_GREEN, border_width=1.5)
    tb_s = s2.shapes.add_textbox(Inches(7.0), Inches(2.05), col_w - Inches(0.4), Inches(4.2))
    tf_s = tb_s.text_frame
    tf_s.word_wrap = True

    p = tf_s.paragraphs[0]
    p.text = "✅ Engineered Solution Matrix (MediGuard Innovation)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN
    p.space_after = Pt(10)

    solution_list = [
        ("Automated IIITL Identity & Zone Binding", "Regex parses student email (LCS/LIT/LCI/LCB), assigning hostel zone for instant zero-lookup dispatch."),
        ("1-Touch SOS with 3-Second Abort Safety", "Audible countdown prevents accidental triggers; automatically broadcasts ticket to campus command when time elapses."),
        ("Simulated Real Audio Calling & Waveform Visualizer", "Native browser Web Audio API synthesizes telephone tones (350+440 Hz) and dynamic visual audio waveforms."),
        ("AHA-Compliant 110 BPM Compression Metronome", "Dual auditory and visual metronome keeps chest compressions locked at clinical 100-120 BPM tempo."),
        ("Central Admin Incident Command Center (/admin)", "Wardens & doctors receive live incoming triage queues, dispatch campus ambulances, and view branch rosters.")
    ]
    for title, desc in solution_list:
        pt = tf_s.add_paragraph()
        pt.text = "⚡ " + title
        pt.font.size = Pt(11)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_LIGHT
        pt.space_before = Pt(4)

        pd = tf_s.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(9.5)
        pd.font.color.rgb = TEXT_MUTED

    # Bottom Metric Bar
    make_card(s2, Inches(0.8), Inches(6.55), Inches(11.733), Inches(0.65), bg_color=INNER_BG, border_color=BORDER_SUBTLE)
    metrics = [
        ("< 3 SECONDS", "SOS Trigger Latency", ACCENT_RED),
        ("110 BPM", "AHA CPR Compressions", ACCENT_GREEN),
        ("ZERO ASSETS", "Web Audio Synthesizer", ACCENT_BLUE),
        ("100% REGEX", "IIITL ID Auto-Mapping", ACCENT_PURPLE),
        ("99.9% UPTIME", "Hybrid Cloud Storage", ACCENT_AMBER)
    ]
    m_w = Inches(11.733 / 5)
    for i, (val, label, m_col) in enumerate(metrics):
        tb_m = s2.shapes.add_textbox(Inches(0.8) + i * m_w, Inches(6.58), m_w, Inches(0.6))
        tf_m = tb_m.text_frame
        p_val = tf_m.paragraphs[0]
        p_val.text = val
        p_val.alignment = PP_ALIGN.CENTER
        p_val.font.size = Pt(12)
        p_val.font.bold = True
        p_val.font.color.rgb = m_col

        p_lbl = tf_m.add_paragraph()
        p_lbl.text = label
        p_lbl.alignment = PP_ALIGN.CENTER
        p_lbl.font.size = Pt(8.5)
        p_lbl.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 3: 4-TIER ARCHITECTURE & DATA FLOW
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "SLIDE 03 / 05 • SYSTEM DESIGN", 
               "4-Tier Layered Architecture & Incident Flow Pipeline", 
               "Client UI, Serverless Edge APIs, MongoDB Persistence & Cloud Containerization", 
               ACCENT_BLUE)

    tiers = [
        ("TIER 1: CLIENT LAYER", "React 19 + Vite 8", [
            "• Vite 8 Build (Ultra-fast HMR & ESM)",
            "• React Router 7 with SPA Fallback",
            "• Web Audio API Telephone Synthesizer",
            "• HTML5 Canvas Dynamic Waveform HUD",
            "• Axios JWT Bearer Auth Interceptors"
        ], ACCENT_BLUE),

        ("TIER 2: API & LOGIC", "Express.js Serverless", [
            "• Modular REST Endpoints (/api/auth, /incidents)",
            "• Vercel Edge Serverless Deployment",
            "• JWT Token Verification Middleware",
            "• Strict Role-Based Access Control (RBAC)",
            "• In-Memory Resilient Sync Fallback Store"
        ], ACCENT_RED),

        ("TIER 3: PERSISTENCE", "MongoDB Atlas Cloud", [
            "• Mongoose Schema Object Modeling",
            "• User Schema with IIITL Branch & Roll",
            "• EmergencyIncident Ticket Queue",
            "• Bcrypt Password Hashing (12 rounds)",
            "• Geolocation Campus Zone Tagging"
        ], ACCENT_GREEN),

        ("TIER 4: DEVOPS & K8S", "Docker & Kubernetes", [
            "• Lean Alpine Docker Containers (~25 MB)",
            "• Multi-Stage Nginx Frontend Production Image",
            "• Horizontal Pod Autoscaler (2-10 pods)",
            "• Nginx Ingress Controller with TLS",
            "• Continuous Integration from GitHub main"
        ], ACCENT_PURPLE)
    ]

    top_y = Inches(1.9)
    card_h = Inches(4.1)
    for i, (t_title, t_sub, items, t_color) in enumerate(tiers):
        x = start_x + i * (card_w + gap)
        make_card(s3, x, top_y, card_w, card_h, bg_color=CARD_BG, border_color=t_color, border_width=1.5)

        tb = s3.shapes.add_textbox(x + Inches(0.12), top_y + Inches(0.15), card_w - Inches(0.24), card_h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = t_title
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = t_color

        p2 = tf.add_paragraph()
        p2.text = t_sub
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_LIGHT
        p2.space_before = Pt(2)
        p2.space_after = Pt(8)

        for item in items:
            pi = tf.add_paragraph()
            pi.text = item
            pi.font.size = Pt(9.5)
            pi.font.color.rgb = TEXT_MUTED
            pi.space_before = Pt(3)

    # Bottom Level-1 Data Flow Sequence
    make_card(s3, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.95), bg_color=INNER_BG, border_color=BORDER_SUBTLE)
    tb_flow = s3.shapes.add_textbox(Inches(1.0), Inches(6.22), Inches(11.3), Inches(0.8))
    tf_flow = tb_flow.text_frame
    tf_flow.word_wrap = True

    p = tf_flow.paragraphs[0]
    p.text = "🔄 Level-1 Data Flow Pipeline (End-to-End Emergency Lifecycle):"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER

    p2 = tf_flow.add_paragraph()
    p2.text = "1. Student SOS Trigger ➔ 2. 3-Sec Safety Abort ➔ 3. JWT-Signed HTTP POST ➔ 4. Vercel Multi-Service Router ➔ 5. Express API Processing ➔ 6. MongoDB Atlas Atomic Insert ➔ 7. Admin Command HUD Broadcast ➔ 8. Ambulance AMB-101 Dispatched."
    p2.font.size = Pt(10)
    p2.font.color.rgb = TEXT_LIGHT
    p2.space_before = Pt(3)

    # ==========================================
    # SLIDE 4: TECHNICAL INNOVATIONS & FEATURE MATRIX
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "SLIDE 04 / 05 • TECHNICAL INNOVATIONS", 
               "Core Modules, Identity Engine & Clinical Tools", 
               "IIITL Regex Auto-Parsing, Zero-Asset Web Audio Synthesizer, Admin Command Center & First Aid", 
               ACCENT_GREEN)

    feature_cards = [
        ("🎓 Real Google OAuth 2.0 & IIITL Roll Engine", [
            ("Google GIS SDK", "Real OAuth popup directly from accounts.google.com."),
            ("Real JWT Decoding", "Extracts email, verified display name, and avatar photo."),
            ("IIITL Roll Parser", "Auto-binds LCS, LIT, LCI, LCB (Rolls 1 to 60)."),
            ("Dual Mode Auth", "Supports official campus @iiitl.ac.in & personal Gmail."),
            ("Session Resilience", "Fail-safe JWT token fallback prevents login lockouts.")
        ], Inches(0.8), Inches(1.9), Inches(5.72), Inches(2.35), ACCENT_BLUE),

        ("📞 Real Laptop Voice Calling & Microphone Stream", [
            ("Real Laptop Mic", "getUserMedia captures live audio stream from laptop microphone."),
            ("Real-Time Waveform", "AnalyserNode visualizes actual spoken voice frequencies."),
            ("Speech Recognition", "Transcribes student speech into incident log in real-time."),
            ("Speech Synthesis", "Paramedic dispatcher speaks out of laptop speakers."),
            ("Direct Telephony", "Native tel:108 / tel:112 trigger via Windows Phone Link.")
        ], Inches(6.8), Inches(1.9), Inches(5.72), Inches(2.35), ACCENT_RED),

        ("🛡️ Admin Incident Command Center (/admin)", [
            ("Triage HUD", "Live counters for Active, Dispatched & Resolved campus incidents."),
            ("1-Click Dispatch", "Dispatches on-campus emergency fleet with calculated ETAs."),
            ("Fleet Monitor", "Tracks readiness for AMB-101, AMB-102 and Trauma ER units."),
            ("Student Directory", "Roster explorer filtered by branch code and roll number."),
            ("Role Guard", "Protected by server-side adminOnly JWT RBAC verification.")
        ], Inches(0.8), Inches(4.45), Inches(5.72), Inches(2.45), ACCENT_PURPLE),

        ("❤️ Life Support Manual & Clinical Databases", [
            ("CPR Metronome", "110 BPM acoustic pacer meeting AHA 2020 cardiac standard."),
            ("First Aid Steps", "Illustrated guides for Choking (Heimlich), Burns, Anaphylaxis."),
            ("Blood Registry", "8 blood group donors with red-cell compatibility matrix."),
            ("Emergency Meds", "Dosages, symptoms, warnings & contraindications directory."),
            ("Cardiac Alert", "Immediate protocol for chewable aspirin (325 mg) administration.")
        ], Inches(6.8), Inches(4.45), Inches(5.72), Inches(2.45), ACCENT_GREEN)
    ]

    for title, points, x, y, w, h, color in feature_cards:
        make_card(s4, x, y, w, h, bg_color=CARD_BG, border_color=color, border_width=1.5)
        tb = s4.shapes.add_textbox(x + Inches(0.18), y + Inches(0.14), w - Inches(0.36), h - Inches(0.28))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(4)

        for heading, desc in points:
            ph = tf.add_paragraph()
            ph.text = f"• {heading}: {desc}"
            ph.font.size = Pt(9.3)
            ph.font.color.rgb = TEXT_LIGHT
            ph.space_before = Pt(2)

    # ==========================================
    # SLIDE 5: DEVOPS, LIVE DEPLOYMENT & ROADMAP
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "SLIDE 05 / 05 • PRODUCTION & ROADMAP", 
               "DevOps Orchestration, Live Production & Future Innovations", 
               "Docker Containers, Kubernetes Manifests, Vercel Multi-Service & Telemedicine Roadmap", 
               ACCENT_PURPLE)

    col3_w = Inches(3.73)
    col3_gap = Inches(0.27)
    c1_x = Inches(0.8)
    c2_x = c1_x + col3_w + col3_gap
    c3_x = c2_x + col3_w + col3_gap
    c_top = Inches(1.9)
    c_h = Inches(4.5)

    # Col 1: DevOps & K8s
    make_card(s5, c1_x, c_top, col3_w, c_h, bg_color=CARD_BG, border_color=ACCENT_RED, border_width=1.5)
    tb_c1 = s5.shapes.add_textbox(c1_x + Inches(0.15), c_top + Inches(0.15), col3_w - Inches(0.3), c_h - Inches(0.3))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True

    p = tf_c1.paragraphs[0]
    p.text = "🐳 Container & K8s Pipeline"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED
    p.space_after = Pt(8)

    devops_bullets = [
        ("Multi-Stage Docker", "Frontend built with Vite into lean Nginx Alpine (~25 MB). Backend on Node 20 Alpine with unprivileged user."),
        ("Kubernetes Pods & HPA", "Horizontal Pod Autoscaler dynamically scales pods between 2 and 10 based on 70% CPU threshold."),
        ("ClusterIP & Ingress", "Internal microservice routing with Nginx Ingress handling TLS termination and rate limiting."),
        ("Zero-Downtime Deployment", "Rolling update strategy with maxSurge: 1 and maxUnavailable: 0 guarantees non-stop availability.")
    ]
    for h, d in devops_bullets:
        pt = tf_c1.add_paragraph()
        pt.text = f"• {h}:"
        pt.font.size = Pt(10)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_LIGHT
        pt.space_before = Pt(4)

        pd = tf_c1.add_paragraph()
        pd.text = f"  {d}"
        pd.font.size = Pt(9)
        pd.font.color.rgb = TEXT_MUTED

    # Col 2: Live Production
    make_card(s5, c2_x, c_top, col3_w, c_h, bg_color=CARD_BG, border_color=ACCENT_BLUE, border_width=1.5)
    tb_c2 = s5.shapes.add_textbox(c2_x + Inches(0.15), c_top + Inches(0.15), col3_w - Inches(0.3), c_h - Inches(0.3))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True

    p = tf_c2.paragraphs[0]
    p.text = "🌐 Live Production Status"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p.space_after = Pt(8)

    live_bullets = [
        ("Vercel Live URL", "se-ne6t-git-main-ddd-510a.vercel.app with automatic SPA rewrite and 404 fallback handling."),
        ("GitHub Repository", "Synchronized on origin/main at github.com/kuldeeprohit2006-cmd/se with complete commit history."),
        ("MongoDB Atlas Cluster", "Replica set with automated connection failover and IPv4 compatibility layers."),
        ("Lighthouse & Security", "Sub-second First Contentful Paint, JWT Bearer authentication, and zero CORS mismatches.")
    ]
    for h, d in live_bullets:
        pt = tf_c2.add_paragraph()
        pt.text = f"• {h}:"
        pt.font.size = Pt(10)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_LIGHT
        pt.space_before = Pt(4)

        pd = tf_c2.add_paragraph()
        pd.text = f"  {d}"
        pd.font.size = Pt(9)
        pd.font.color.rgb = TEXT_MUTED

    # Col 3: Future Roadmap
    make_card(s5, c3_x, c_top, col3_w, c_h, bg_color=CARD_BG, border_color=ACCENT_GREEN, border_width=1.5)
    tb_c3 = s5.shapes.add_textbox(c3_x + Inches(0.15), c_top + Inches(0.15), col3_w - Inches(0.3), c_h - Inches(0.3))
    tf_c3 = tb_c3.text_frame
    tf_c3.word_wrap = True

    p = tf_c3.paragraphs[0]
    p.text = "🚀 Future Innovation Roadmap"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN
    p.space_after = Pt(8)

    future_bullets = [
        ("WebRTC Video Triage", "Peer-to-peer live emergency camera connection between student bystander and on-call campus doctor."),
        ("Smart IoT Defibrillators", "Automated campus locker release triggers whenever cardiac arrest SOS is dispatched to that hostel."),
        ("Offline PWA Mesh Relay", "Bluetooth/Wi-Fi Direct mesh messaging for campus basement labs with zero cellular connectivity."),
        ("Hostel Warden SMS Gateway", "Instant automated SMS alerts dispatching emergency coordinates to hostel caretakers.")
    ]
    for h, d in future_bullets:
        pt = tf_c3.add_paragraph()
        pt.text = f"• {h}:"
        pt.font.size = Pt(10)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_LIGHT
        pt.space_before = Pt(4)

        pd = tf_c3.add_paragraph()
        pd.text = f"  {d}"
        pd.font.size = Pt(9)
        pd.font.color.rgb = TEXT_MUTED

    # Bottom Submission Bar
    make_card(s5, Inches(0.8), Inches(6.55), Inches(11.733), Inches(0.65), bg_color=INNER_BG, border_color=BORDER_SUBTLE)
    tb_sub = s5.shapes.add_textbox(Inches(0.95), Inches(6.6), Inches(11.4), Inches(0.55))
    tf_sub = tb_sub.text_frame
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = "📦 Submission Deliverables: 1. PPT (5 Slides) • 2. IEEE 830 SRS Document • 3. Source Code ZIP • 4. 4-Member Viva Defense Script"
    p_sub.font.size = Pt(11)
    p_sub.font.bold = True
    p_sub.font.color.rgb = ACCENT_GREEN

    # Save to 3 locations:
    base_dir = r"C:\Users\Sumsung\.gemini\antigravity\scratch\mediguard-mern"
    
    # 1. docs/
    p1 = os.path.join(base_dir, "docs", "MediGuard_Software_Engineering_Presentation.pptx")
    prs.save(p1)
    print(f"Saved: {p1}")

    # 2. Project_Submission_Package/
    sub_dir = os.path.join(base_dir, "Project_Submission_Package")
    os.makedirs(sub_dir, exist_ok=True)
    p2 = os.path.join(sub_dir, "MediGuard_Presentation_4_Slides.pptx")
    prs.save(p2)
    print(f"Saved: {p2}")

    # 3. Root directory (immediately accessible on GitHub)
    p3 = os.path.join(base_dir, "MediGuard_Presentation_Google_Slides.pptx")
    prs.save(p3)
    print(f"Saved: {p3}")

if __name__ == "__main__":
    create_beautiful_presentation()
