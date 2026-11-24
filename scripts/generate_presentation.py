import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Color Palette
    BG_DARK = RGBColor(12, 14, 23)      # #0C0E17 Deep Navy
    CARD_BG = RGBColor(23, 27, 43)      # #171B2B Glass Navy
    BORDER_COLOR = RGBColor(38, 45, 68) # #262D44
    ACCENT_RED = RGBColor(255, 45, 85)  # #FF2D55 Crimson Red
    ACCENT_GREEN = RGBColor(0, 208, 133)# #00D085 Pulse Green
    ACCENT_BLUE = RGBColor(10, 132, 255)# #0A84FF Digital Blue
    ACCENT_PURPLE = RGBColor(191, 90, 242) # #BF5AF2 Admin Purple
    TEXT_LIGHT = RGBColor(240, 242, 248)# #F0F2F8 Pure Text
    TEXT_MUTED = RGBColor(154, 165, 190)# #9AA5BE Secondary Text

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=BORDER_COLOR):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        return card

    # ==========================================
    # SLIDE 1: TITLE & TEAM ROLES (MEMBER 1)
    # ==========================================
    s1 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s1)

    # Top Tag
    tag_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(0.4))
    tf = tag_box.text_frame
    p = tf.paragraphs[0]
    p.text = "🛡️ SOFTWARE ENGINEERING PROJECT PRESENTATION • IIIT LUCKNOW"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED

    # Title & Subtitle
    title_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.7), Inches(1.4))
    tf = title_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "MediGuard: Campus Emergency Health & Response System"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT

    p2 = tf.add_paragraph()
    p2.text = "Full-Stack MERN Platform with Real Audio Dispatch Calling, IIITL Identity Mapping & Kubernetes Architecture"
    p2.font.size = Pt(14)
    p2.font.color.rgb = TEXT_MUTED

    # 4 Team Member Roles Cards
    roles = [
        ("MEMBER 1: PROJECT LEAD", "Requirement Analysis & Scope", "• Problem Statement & Gaps\n• IEEE 830 SRS Formulation\n• Campus Medical Triage\n• Ethics & Safety Disclaimers", ACCENT_RED),
        ("MEMBER 2: FRONTEND LEAD", "UI/UX & Audio Engineering", "• React 19 & Vite Architecture\n• Web Audio API Synthesizer\n• Live Canvas Waveform HUD\n• 110 BPM CPR Metronome", ACCENT_BLUE),
        ("MEMBER 3: BACKEND LEAD", "API & Database Systems", "• Node.js & Express REST API\n• MongoDB Atlas Cloud Modeling\n• IIITL Roll Parsing & JWT\n• Admin Command Center (/admin)", ACCENT_PURPLE),
        ("MEMBER 4: DEVOPS LEAD", "Cloud & Deployment", "• Multi-Stage Docker Build\n• Kubernetes (Deploy, HPA, Ingress)\n• Vercel Multi-Service Monorepo\n• E2E Integration Testing", ACCENT_GREEN)
    ]

    card_w = Inches(2.75)
    gap = Inches(0.2)
    start_x = Inches(0.8)
    top_y = Inches(2.7)

    for i, (m_title, m_sub, m_desc, m_color) in enumerate(roles):
        x = start_x + i * (card_w + gap)
        add_card(s1, x, top_y, card_w, Inches(3.9), bg_color=CARD_BG, border_color=m_color)

        tb = s1.shapes.add_textbox(x + Inches(0.15), top_y + Inches(0.15), card_w - Inches(0.3), Inches(3.6))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = m_title
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = m_color

        p2 = tf.add_paragraph()
        p2.text = m_sub
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_LIGHT
        p2.space_after = Pt(8)

        for line in m_desc.split("\n"):
            p_line = tf.add_paragraph()
            p_line.text = line
            p_line.font.size = Pt(10)
            p_line.font.color.rgb = TEXT_MUTED

    # Bottom Meta
    bottom_box = s1.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4))
    tf = bottom_box.text_frame
    p = tf.paragraphs[0]
    p.text = "Target Batch: B.Tech (CS / IT / CSAI / CSB) • Semester 3 • Live Link: https://spry-sitar-dlf6xq7.tmp.now"
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT & PROPOSED SOLUTION (MEMBER 1)
    # ==========================================
    s2 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s2)

    # Header
    tb = s2.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.8))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "01 | PROBLEM STATEMENT & PROPOSED SOLUTION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED

    p2 = tf.add_paragraph()
    p2.text = "Eliminating the 'Golden Hour' Delay in Campus Emergencies"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_LIGHT

    # Left Column: Critical Campus Problems
    add_card(s2, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.3), border_color=ACCENT_RED)
    tb_prob = s2.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(4.9))
    tf = tb_prob.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🚨 Critical Campus Failure Points"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED
    p.space_after = Pt(10)

    problems = [
        ("The 'Golden Hour' Panic", "Students waste 5–10 crucial minutes finding emergency numbers or conveying exact campus hostel/room locations."),
        ("Bystander CPR Deficiency", "In sudden cardiac arrest, brain damage begins in 4 minutes. Untrained bystanders panic or apply compressions at incorrect tempos."),
        ("No Campus Coordination", "Wardens and dispensaries receive zero telemetry on active medical situations until minutes or hours later."),
        ("Medicine Contraindication Risks", "Students taking self-prescribed remedies without knowing fatal interactions (e.g., aspirin for kids or NSAIDs with ulcers).")
    ]

    for title, desc in problems:
        pt = tf.add_paragraph()
        pt.text = "❌ " + title
        pt.font.size = Pt(12)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_LIGHT

        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(10.5)
        pd.font.color.rgb = TEXT_MUTED
        pd.space_after = Pt(6)

    # Right Column: The MediGuard Solution
    add_card(s2, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.3), border_color=ACCENT_GREEN)
    tb_sol = s2.shapes.add_textbox(Inches(7.0), Inches(1.7), Inches(5.3), Inches(4.9))
    tf = tb_sol.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "✅ The MediGuard Solution Architecture"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN
    p.space_after = Pt(10)

    solutions = [
        ("Automated IIITL Identity & Geolocation", "Instant regex parsing of student emails (LCS/LIT/LCI/LCB) with hostel zone tagging for zero-lookup dispatch."),
        ("1-Touch SOS with 3s Abort Safety", "Audible countdown prevents prank alerts; automatically broadcasts ticket to central command when timer expires."),
        ("Simulated Real Audio Operator Calling", "Native Web Audio API telephone dispatch with dual-tone multi-frequency and live dynamic waveform visualization."),
        ("AHA-Compliant 110 BPM Metronome", "Auditory and optical compression guide maintaining optimal 100–120 compressions/min for adult cardiac arrest."),
        ("Central Admin Command Center (/admin)", "Real-time triage dashboard for ambulance fleet readiness, incident resolution, and branch roster auditing.")
    ]

    for title, desc in solutions:
        pt = tf.add_paragraph()
        pt.text = "⚡ " + title
        pt.font.size = Pt(12)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_LIGHT

        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(10.5)
        pd.font.color.rgb = TEXT_MUTED
        pd.space_after = Pt(6)

    # ==========================================
    # SLIDE 3: SYSTEM ARCHITECTURE & 3-TIER FLOW (MEMBER 2 & 3)
    # ==========================================
    s3 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s3)

    tb = s3.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.8))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "02 | SYSTEM ARCHITECTURE & DATA FLOW"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE

    p2 = tf.add_paragraph()
    p2.text = "Cloud-Native 3-Tier Layered Architecture & Microservices"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_LIGHT

    # 4 Architecture Columns (Client Tier, API Tier, Database Tier, DevOps Tier)
    tiers = [
        ("TIER 1: CLIENT LAYER", "React 19 + Vite SPA", [
            "• Vite 8 Build Tool (Ultra-fast HMR)",
            "• React Router 7 Client Navigation",
            "• Web Audio API Synthesizer",
            "• HTML5 Canvas Waveform Rendering",
            "• Axios JWT Request Interceptors"
        ], ACCENT_BLUE),
        ("TIER 2: API & SERVERLESS", "Express.js Edge Runtime", [
            "• REST API Routing & Controllers",
            "• Vercel Multi-Service Edge Router",
            "• JWT Token Verification Middleware",
            "• Role-Based Access Control (RBAC)",
            "• In-Memory Hybrid Resiliency Store"
        ], ACCENT_RED),
        ("TIER 3: PERSISTENCE", "MongoDB Atlas Cloud", [
            "• Mongoose Object Data Modeling",
            "• User Schema (IIITL Roll & Branch)",
            "• EmergencyIncident Ticket Queue",
            "• Bcrypt Password Salting (12 rounds)",
            "• Geospatial & Zone Tagging"
        ], ACCENT_GREEN),
        ("TIER 4: INFRASTRUCTURE", "Docker & Kubernetes", [
            "• Node.js 20 Lean Alpine Container",
            "• Multi-Stage Nginx Frontend Image",
            "• Horizontal Pod Autoscaler (2-10 pods)",
            "• Ingress Controller with Rate Limits",
            "• Production Vercel CI/CD Auto-Deploy"
        ], ACCENT_PURPLE)
    ]

    for i, (t_title, t_sub, t_items, t_color) in enumerate(tiers):
        x = start_x + i * (card_w + gap)
        add_card(s3, x, Inches(1.5), card_w, Inches(4.3), border_color=t_color)

        tb = s3.shapes.add_textbox(x + Inches(0.12), Inches(1.65), card_w - Inches(0.24), Inches(4.0))
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
        p2.space_after = Pt(8)

        for item in t_items:
            pi = tf.add_paragraph()
            pi.text = item
            pi.font.size = Pt(9.5)
            pi.font.color.rgb = TEXT_MUTED

    # Bottom Architecture Summary Box
    add_card(s3, Inches(0.8), Inches(6.0), Inches(11.7), Inches(0.9), bg_color=CARD_BG, border_color=BORDER_COLOR)
    tb_flow = s3.shapes.add_textbox(Inches(1.0), Inches(6.05), Inches(11.3), Inches(0.8))
    tf = tb_flow.text_frame
    p = tf.paragraphs[0]
    p.text = "🔄 Level 1 Data Flow: Student SOS ➔ 3s Safety Filter ➔ JWT Injected Axios ➔ Vercel Multi-Service ➔ Express Routing ➔ MongoDB Write & Memory Sync ➔ Admin WebSocket/Polling HUD ➔ Ambulance Dispatched"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = TEXT_LIGHT

    # ==========================================
    # SLIDE 4: KEY FEATURES & TECHNICAL INNOVATIONS (MEMBER 2 & 3)
    # ==========================================
    s4 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s4)

    tb = s4.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.8))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "03 | KEY MODULES & TECHNICAL INNOVATIONS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    p2 = tf.add_paragraph()
    p2.text = "Feature Matrix: Campus Customization & Clinical Safety"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_LIGHT

    feature_cards = [
        ("🎓 Automated IIITL Roll & Branch Parser", [
            "• Regex Engine: ^([a-z]{3})2025(\\d{3})@iiitl\\.ac\\.in$",
            "• Automatic Branch Mapping: LCS (CS), LIT (IT), LCI (CSAI), LCB (CSB).",
            "• Dynamic Roll Support: Pre-configures roll range 1 to 60.",
            "• Google OAuth Integration: Instant 1-click Google sign-in modal.",
            "• Dual Mode: Accommodates both campus and normal Google accounts."
        ], Inches(0.8), Inches(1.5), Inches(5.6), Inches(2.6), ACCENT_BLUE),

        ("📞 Zero-Asset Web Audio Calling System", [
            "• Native AudioContext: Generates dialing, ringback & chimes.",
            "• Zero Asset Dependencies: Works with zero MP3 downloads.",
            "• Live Canvas Visualizer: Renders dynamic oscillating frequency waves.",
            "• Conversational Operator Simulation: Interactive dispatcher prompts.",
            "• Smartphone Bridge: Instant tel:108 / tel:112 direct trigger."
        ], Inches(6.8), Inches(1.5), Inches(5.7), Inches(2.6), ACCENT_RED),

        ("🛡️ Admin Incident Command Center (/admin)", [
            "• Real-Time Triage HUD: Active, Dispatched & Resolved incident telemetry.",
            "• One-Click Action Dispatch: Dispatches campus ambulance units.",
            "• Fleet Management: Monitors AMB-101, AMB-102, AMB-108 ETAs.",
            "• Student Roster Browser: Filters directory by branch & roll number.",
            "• Role Security: Protected via adminOnly server middleware."
        ], Inches(0.8), Inches(4.3), Inches(5.6), Inches(2.6), ACCENT_PURPLE),

        ("❤️ Life Support Manual & Clinical Databases", [
            "• CPR Metronome: 110 BPM acoustic pacer (AHA 2020 standard).",
            "• First Aid Interactive Manual: Heimlich, burns, seizures, anaphylaxis.",
            "• Blood Donor Registry: 8-group filter with compatibility matrix.",
            "• Emergency Medicines: Symptom search, contraindications & dosages.",
            "• Heart Attack Protocol: Emergency chewable aspirin guidelines."
        ], Inches(6.8), Inches(4.3), Inches(5.7), Inches(2.6), ACCENT_GREEN)
    ]

    for title, points, x, y, w, h, color in feature_cards:
        add_card(s4, x, y, w, h, border_color=color)
        tb = s4.shapes.add_textbox(x + Inches(0.15), y + Inches(0.15), w - Inches(0.3), h - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(6)

        for pt_str in points:
            p_bullet = tf.add_paragraph()
            p_bullet.text = pt_str
            p_bullet.font.size = Pt(9.5)
            p_bullet.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 5: DEVOPS, DEPLOYMENT & ROADMAP (MEMBER 4)
    # ==========================================
    s5 = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(s5)

    tb = s5.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.8))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = "04 | DEVOPS, DEPLOYMENT & FUTURE ROADMAP"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_PURPLE

    p2 = tf.add_paragraph()
    p2.text = "Enterprise Scalability, Live Hosting & Innovation Roadmap"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_LIGHT

    # 3 Bottom Columns
    add_card(s5, Inches(0.8), Inches(1.5), Inches(3.7), Inches(5.3), border_color=ACCENT_RED)
    tb_dep = s5.shapes.add_textbox(Inches(0.95), Inches(1.7), Inches(3.4), Inches(4.9))
    tf = tb_dep.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🐳 Container & K8s Pipeline"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_RED
    p.space_after = Pt(8)

    devops_items = [
        "• Multi-Stage Docker Build:\n  Vite build ➔ Lean Nginx 1.25 Alpine (~25 MB production image).",
        "• Backend Security:\n  Node 20 Alpine with dumb-init & non-root user execution.",
        "• Kubernetes Cluster:\n  Deployments, ClusterIP Services & Nginx Ingress Controller.",
        "• Horizontal Pod Autoscaler (HPA):\n  Dynamic auto-scaling between 2 and 10 pods at 70% CPU threshold.",
        "• Zero-Downtime Rolling Updates:\n  maxSurge: 1, maxUnavailable: 0."
    ]
    for item in devops_items:
        p_item = tf.add_paragraph()
        p_item.text = item
        p_item.font.size = Pt(9.5)
        p_item.font.color.rgb = TEXT_MUTED
        p_item.space_after = Pt(6)

    # Middle: Live Deployment Status
    add_card(s5, Inches(4.8), Inches(1.5), Inches(3.7), Inches(5.3), border_color=ACCENT_BLUE)
    tb_live = s5.shapes.add_textbox(Inches(4.95), Inches(1.7), Inches(3.4), Inches(4.9))
    tf = tb_live.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🌐 Live Production Status"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_BLUE
    p.space_after = Pt(8)

    live_items = [
        "• Vercel Multi-Service Hosting:\n  Live at: https://spry-sitar-dlf6xq7.tmp.now",
        "• GitHub Source Code:\n  Repository: kuldeeprohit2006-cmd/se",
        "• Database Cluster:\n  MongoDB Atlas Replica Set with automated connection retry & IPv4 fallback.",
        "• Zero CORS Architecture:\n  Frontend & Serverless Edge APIs co-located on identical host origin.",
        "• Performance Benchmark:\n  Google Lighthouse Score > 90, sub-second First Contentful Paint."
    ]
    for item in live_items:
        p_item = tf.add_paragraph()
        p_item.text = item
        p_item.font.size = Pt(9.5)
        p_item.font.color.rgb = TEXT_MUTED
        p_item.space_after = Pt(6)

    # Right: Future Scope
    add_card(s5, Inches(8.8), Inches(1.5), Inches(3.7), Inches(5.3), border_color=ACCENT_GREEN)
    tb_fut = s5.shapes.add_textbox(Inches(8.95), Inches(1.7), Inches(3.4), Inches(4.9))
    tf = tb_fut.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "🚀 Future Roadmap"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN
    p.space_after = Pt(8)

    future_items = [
        "• WebRTC Real Video Triage:\n  P2P video streaming with on-duty campus medical staff.",
        "• Campus IoT Defibrillators:\n  Smart AED lockers that auto-unlock when cardiac arrest is reported in zone.",
        "• Offline PWA Bluetooth Mesh:\n  Peer-to-peer relay for campus basement zones with zero cellular signal.",
        "• Automated SMS/WhatsApp Gateways:\n  Instant automated SMS dispatch to hostel wardens & family contacts.",
        "• Wearable Integration:\n  Heart rate anomaly detection via smartwatch telemetry."
    ]
    for item in future_items:
        p_item = tf.add_paragraph()
        p_item.text = item
        p_item.font.size = Pt(9.5)
        p_item.font.color.rgb = TEXT_MUTED
        p_item.space_after = Pt(6)

    # Save presentation
    output_dir = r"C:\Users\Sumsung\.gemini\antigravity\scratch\mediguard-mern\docs"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "MediGuard_Software_Engineering_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
