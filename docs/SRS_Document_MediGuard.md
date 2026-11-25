# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## For MediGuard – Campus Emergency Health & Medical Response System
**Document Version:** 1.0.0  
**Project Group:** Software Engineering Project Group  
**Target Institution:** Indian Institute of Information Technology, Lucknow (IIITL)  
**Standard Compliance:** IEEE Std 830-1998  
**Date:** November 2026  

---

## 1. INTRODUCTION

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete description of the external behavior and architectural constraints of **MediGuard**, a specialized Full-Stack MERN (MongoDB, Express.js, React 19, Node.js) web application engineered for university campuses. This document is intended for project evaluators, software engineering faculty, system architects, and developers.

### 1.2 Document Conventions
- **MUST / SHALL:** Mandatory requirements critical for system operation and patient safety.
- **SHOULD:** Highly recommended functional enhancements.
- **MAY:** Optional future roadmap capabilities.
- **Priority Ratings:** Critical (P1), High (P2), Medium (P3).

### 1.3 Intended Audience
- **Course Evaluators & Academic Faculty:** To verify requirements traceability, architectural soundness, and software engineering methodology.
- **Developers & Quality Assurance:** To guide implementation, automated integration testing, and bug verification.
- **End Users (Students, Wardens, Medical Staff):** To understand system functional scope and emergency operation protocols.

### 1.4 Project Scope
MediGuard bridges the critical gap between the occurrence of a medical emergency on a college campus and the arrival of professional paramedics. 
Core functionalities include:
1. Automated domain-restricted authentication supporting IIIT Lucknow student identity parsing (`lcs`, `lit`, `lci`, `lcb` + Batch 2025 + Roll 1–60).
2. One-touch SOS dispatch with audible 3-second safety abort protection and campus zone geolocation.
3. Interactive 2-way Web Audio API emergency dispatch calling simulation with live canvas frequency visualization.
4. Central Admin Command Center (`/admin`) for incident triage, ambulance dispatch, and fleet status tracking.
5. Interactive CPR audio-visual metronome (110 BPM) and comprehensive first-aid and emergency medicine databases.

### 1.5 References
- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.
- RFC 7519: JSON Web Token (JWT) Architecture and Security Standards.
- American Heart Association (AHA) 2020 Guidelines for Cardiopulmonary Resuscitation (CPR).
- W3C Web Audio API Specification (W3C Recommendation 2021).

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective
MediGuard operates as a cloud-native, distributed web solution. It interfaces with:
- **Client Tier:** React 19 Progressive Web Client executing on student smartphones and desktop browsers.
- **Application Tier:** Node.js/Express.js RESTful API, containerized via Docker and orchestrated via Kubernetes.
- **Live Serverless Deployment:** Deployed on Vercel at `https://se-ne6t-git-main-ddd-510a.vercel.app/` with continuous integration from GitHub `kuldeeprohit2006-cmd/se`.
- **Persistence Tier:** MongoDB Atlas cloud cluster storing user records, RBAC roles, and emergency incidents.

### 2.2 Product Functions
- **PF-1 (Identity Management):** Parses IIITL roll numbers and branches from student emails, verifies passwords via salted bcrypt, and issues JWT tokens.
- **PF-2 (Emergency Alert Dispatch):** Generates time-stamped incident tickets with campus zone, urgency level, and coordinates.
- **PF-3 (Telecommunication & Dispatch Simulation):** Synthesizes browser-native DTMF tones and establishes live 2-way dispatch sessions.
- **PF-4 (Admin Telemetry):** Surfaces active incidents, student rosters, and ambulance availability in a tactical HUD.
- **PF-5 (Life Support Guidance):** Delivers auditory CPR compression pacing and searchable OTC medicine contraindications.

### 2.3 User Classes and Characteristics
1. **Student User:**
   - *Technical Expertise:* General web user.
   - *Use Case:* Emergency SOS alert, calling campus medical room, CPR rhythm guidance, viewing donor contacts.
2. **Campus Administrator / Medical Warden (`admin`):**
   - *Technical Expertise:* Operational staff.
   - *Use Case:* Incident monitoring, dispatching ambulances, updating resolution status, querying student records.
3. **Guest / Normal User:**
   - *Technical Expertise:* General.
   - *Use Case:* Public emergency contact reference and general first aid manual.

### 2.4 Operating Environment
- **Client Platforms:** Modern browsers supporting ES6+ and Web Audio API (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+).
- **Server Environment:** Node.js v20.x LTS / Alpine Linux container.
- **Cloud Infrastructure:** Kubernetes v1.28+ cluster or Vercel Edge Runtime.
- **Database:** MongoDB 7.0+ Replica Set.

### 2.5 Design and Implementation Constraints
- **Zero Audio Asset Latency:** Audio synthesis must occur on-the-fly via the Web Audio API without fetching external `.mp3` files to ensure instant execution during emergencies.
- **Network Resilience:** The backend must implement a hybrid memory-cache fallback layer so authentication and SOS tickets continue operating during transient cloud database latency.
- **Stateless Authentication:** Server state must remain stateless using signed JWTs to enable Horizontal Pod Autoscaling (HPA) without sticky sessions.

---

## 3. SYSTEM ARCHITECTURE & DATA FLOW

### 3.1 Architectural Style
MediGuard follows a **3-Tier Layered Client-Server Architecture** augmented with **Microservices / Serverless Edge Routing**:

```
[ Student / Admin Browser (React 19) ]
                │
         HTTPS / JSON (REST + JWT)
                │
                ▼
   [ Vercel Multi-Service Edge Router / K8s Ingress ]
        │                                  │
  /api/* (Rewrite)                 Static Assets (/*)
        │                                  │
        ▼                                  ▼
[ Express.js REST API ]           [ Client SPA (Vite / Nginx) ]
        │
   Mongoose ORM
        │
        ▼
[ MongoDB Atlas Cluster (Users, Incidents, Telemetry) ]
```

### 3.2 Data Flow Diagrams (DFD)

#### Level 0 DFD (Context Diagram)
- **Entities:** Student, Admin Officer, Campus Ambulance Unit.
- **Processes:** `(0.0) MediGuard Campus Emergency System`.
- **Flows:**
  - Student &rarr; [Credentials / Google Profile] &rarr; (0.0)
  - Student &rarr; [SOS Trigger + Campus Zone] &rarr; (0.0)
  - (0.0) &rarr; [Incident Notification + Student Location] &rarr; Admin Officer / Ambulance
  - Admin &rarr; [Dispatch Status Update / Resolution] &rarr; (0.0)
  - (0.0) &rarr; [Live Emergency Operator Audio Stream] &rarr; Student

#### Level 1 DFD (Detailed Process Decomposition)
- **Process 1.0 (Authentication & Identity Validation):** Validates email against IIITL format regex `^([a-z]{3})(\d{4})(\d{3})@iiitl\.ac\.in$`. Verifies hash and issues JWT.
- **Process 2.0 (Incident Ticket Ingestion):** Accepts SOS payloads, assigns priority (`CRITICAL`), attaches campus zone, and stores in `EmergencyIncident` collection.
- **Process 3.0 (Dispatch Communication Engine):** Generates call session IDs, updates incident with audio call logs, and delivers synthesized dispatch prompts.
- **Process 4.0 (Admin Command & Telemetry Aggregation):** Computes active incidents, aggregates student counts across `LCS`, `LIT`, `LCI`, `LCB`, and streams fleet availability.

---

## 4. FUNCTIONAL REQUIREMENTS

### FR-1: Domain-Restricted & Role-Based Authentication with Official Google OAuth 2.0 (GIS)
- **Description:** System shall support automated authentication for IIIT Lucknow students, campus staff, and system administrators using both traditional salted credentials and official Google Identity Services (GIS).
- **Inputs:** Student Email, Password, or Google Identity Services credential token / OAuth2 access token.
- **Processing:**
  - **Google Identity Services (GIS):** Loads `https://accounts.google.com/gsi/client` SDK, initializes `google.accounts.id.initialize` and renders official Google button (`google.accounts.id.renderButton`).
  - Decodes Google signed JWT payload extracting `email`, `name`, `picture`, and Google `sub` identifier. Supports Google OAuth 2.0 UserInfo API (`https://www.googleapis.com/oauth2/v3/userinfo`).
  - If email matches `^([a-z]{3})2025(\d{3})@iiitl\.ac\.in`, system extracts department prefix (`lcs` = CS, `lit` = IT, `lci` = CSAI, `lcb` = CSB), batch `2025`, and roll number `1–60`.
  - If email matches `admin@iiitl.ac.in`, system assigns `role: 'admin'`.
  - Passwords hashed using bcrypt with salt rounds = 12 via Mongoose pre-save hooks.
- **Outputs:** HTTP 200 with signed JWT token (7-day validity) and sanitized User Profile object.

### FR-2: One-Touch SOS Alerting with Safety Abort Window
- **Description:** System shall provide immediate emergency ticket generation with protection against false alarms.
- **Inputs:** Click on SOS button, Campus Zone selection, Emergency Type.
- **Processing:**
  - Initiate a 3-second visual and auditory countdown timer.
  - If "Abort" is clicked before $t = 0$, terminate process without issuing alert.
  - At $t = 0$, dispatch HTTP POST `/api/incidents` with GPS coordinates $(26.8016^\circ\text{ N}, 81.0242^\circ\text{ E})$ and user profile.
- **Outputs:** Incident record persisted with status `TRIGGERED`; real-time broadcast notification displayed.

### FR-3: Real Laptop Calling API & 2-Way Audio Dispatch System
- **Description:** System shall establish a real interactive voice calling channel directly from the user's laptop using modern web communication APIs and Windows telephony bridges.
- **Inputs:** User clicks "Dispatch Call" or "Start 2-Way Audio Call", or dials via keypad.
- **Processing:**
  - **Real Laptop Microphone Capture:** Requests live microphone audio via `navigator.mediaDevices.getUserMedia({ audio: true })`.
  - **Real-Time Frequency Analysis:** Connects microphone stream to `AudioContext` and `AnalyserNode` (FFT size 64) to compute byte frequency data and drive live canvas waveform oscillation in real time.
  - **Real-Time Speech-to-Text Transcription:** Hooks `window.webkitSpeechRecognition || window.SpeechRecognition` to transcribe spoken emergency statements into incident notes in real time.
  - **Paramedic Speech Synthesis:** Uses `window.speechSynthesis` (`SpeechSynthesisUtterance`) to voice paramedic operator responses aloud through laptop speakers.
  - **DTMF Audio Keypad:** Generates real dual-tone multifrequency telephone tones (e.g., 697/1209 Hz for digit '1') using Web Audio `OscillatorNode` pairs.
  - **Direct Laptop Telephony Bridge:** Triggers `tel:108` (Ambulance) and `tel:112` (National Emergency) via URI scheme, launching Windows Phone Link, Skype, or default VoIP softphone directly from the laptop.
- **Outputs:** Active call timer, live waveform, speech transcript log, and persisted call incident telemetry.

### FR-4: Admin Incident Command Center
- **Description:** Dedicated privileged console for campus emergency wardens.
- **Access Control:** Restricted via `adminOnly` middleware checking `req.user.role === 'admin'`.
- **Functions:**
  - View real-time active incident queue.
  - Action button: "Dispatch Ambulance" &rarr; updates status to `DISPATCHED` and logs timestamp.
  - Action button: "Mark Resolved" &rarr; updates status to `RESOLVED`.
  - Filter student roster by branch code (`lcs`, `lit`, `lci`, `lcb`) and roll numbers (1 to 60).
  - Monitor campus fleet readiness (`AMB-101`, `AMB-102`, `AMB-108`).

### FR-5: CPR Audio Pacing & Metronome Trainer
- **Description:** Life-support aid to guide compression rate during sudden cardiac arrest.
- **Inputs:** User clicks "Start CPR Beat".
- **Processing:**
  - Drive rhythmic audio-visual pulse at exactly 110 BPM (interval = 545.45 ms).
  - Render pulsating heart animation and cycle counter (1 to 30 compressions).
- **Outputs:** Precise acoustic and visual rhythm matching AHA 2020 CPR standards (100–120 BPM).

### FR-6: Blood Donor & Emergency Medicine Search
- **Description:** Fast querying of blood banks and OTC medicine contraindications.
- **Processing:**
  - Blood: Filter by 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-) with compatibility matrix.
  - Medicines: Search by symptom string, display dosage by age, highlight critical contraindications and heart attack chewable aspirin protocols.

---

## 5. NON-FUNCTIONAL REQUIREMENTS (NFR)

### 5.1 Performance Requirements
- **Response Time:** API endpoints (e.g. `/api/ambulance`, `/api/firstaid`) shall respond within $\le 200\text{ ms}$ under normal campus load.
- **SOS Ingestion Latency:** Emergency SOS incident creation must complete within $\le 500\text{ ms}$.
- **Client Bundle Size:** Optimized Vite production bundle shall be under $500\text{ KB}$ gzipped.

### 5.2 Reliability & Availability
- **System Availability:** Designed for $99.9\%$ uptime during academic semesters.
- **Hybrid Storage Resilience:** In the event of transient cloud database network timeouts, the system falls back to a high-speed memory cache, ensuring zero downtime for emergency calls.

### 5.3 Security & Privacy Requirements
- **Password Storage:** Plain-text passwords shall never be persisted; bcrypt with $\ge 10$ salt rounds mandatory.
- **Session Security:** Signed HMAC-SHA256 JWT tokens verified on all protected routes.
- **Input Sanitization:** Regex validation on emails, strings trimmed, and XSS sanitization enforced.
- **Role Isolation:** Ordinary student accounts cannot access `/api/admin/*` routes (HTTP 403 Forbidden).

### 5.4 Safety Requirements
- Prominent disclaimers stating MediGuard is an emergency first-aid triage aid; severe life-threatening emergencies must immediately dial national services (108 / 112).

---

## 6. DATABASE SCHEMA SPECIFICATION

### 6.1 Users Collection (`User`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Primary Key |
| `name` | String | Full student/admin name |
| `email` | String (Unique) | e.g. `lcs2025044@iiitl.ac.in` |
| `password` | String (Select: false)| Salted bcrypt hash |
| `role` | String (Enum) | `'student'` \| `'admin'` |
| `college` | String | Default: `'IIIT Lucknow'` |
| `branch` | String (Enum) | `'CS'` \| `'IT'` \| `'CSAI'` \| `'CSB'` \| `'General'` |
| `branchCode` | String (Enum) | `'lcs'` \| `'lit'` \| `'lci'` \| `'lcb'` \| `'general'` |
| `rollNo` | String | Roll number (e.g. `'044'`) |
| `batch` | String | Default: `'2025'` |
| `campusLocation`| String | Assigned hostel / block |
| `authProvider` | String (Enum) | `'local'` \| `'google'` |

### 6.2 EmergencyIncidents Collection (`EmergencyIncident`)
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId / String | Primary Key |
| `student` | ObjectId (Ref: User)| Student foreign key |
| `studentName` | String | Denormalized for zero-join retrieval |
| `studentEmail` | String | Student email address |
| `studentBranch`| String | Branch identification |
| `studentRollNo`| String | e.g. `'044'` |
| `campusZone` | String (Enum) | e.g. `'Boys Hostel 1'`, `'Academic Block'` |
| `emergencyType`| String (Enum) | e.g. `'Cardiac Arrest / CPR Needed'` |
| `priority` | String (Enum) | `'CRITICAL'` \| `'HIGH'` \| `'MEDIUM'` |
| `status` | String (Enum) | `'TRIGGERED'` \| `'DISPATCHED'` \| `'RESOLVED'` |
| `gpsCoordinates`| Object `{lat, lng}`| Campus latitude and longitude |
| `callSessionId`| String | Unique audio dispatch session reference |
| `dispatcherNotes`| String | Running warden/paramedic remarks |
| `createdAt` | Date | Timestamp of incident alert |

---

## 7. VERIFICATION MATRIX & ACCEPTANCE CRITERIA

| Requirement ID | Test Method | Acceptance Criteria |
|---|---|---|
| **FR-1** | Unit & Integration Test | Login with `lcs2025044@iiitl.ac.in` extracts CS branch and roll `044`; returns valid JWT. |
| **FR-2** | Automated Flow Test | Tapping SOS displays 3s countdown; abort cancels ticket; completion stores incident in DB. |
| **FR-3** | Browser Audio Test | AudioContext generates tones without throwing CORS/asset errors; canvas renders waveform. |
| **FR-4** | RBAC Security Test | Non-admin user accessing `/admin` receives HTTP 403 Forbidden. Admin receives KPI telemetry. |
| **FR-5** | Rhythm Timing Test | Metronome interval measures $545.45\text{ ms} \pm 5\text{ ms}$ (110 BPM standard). |
| **NFR-1** | Lighthouse Audit | Performance score $\ge 90$, First Contentful Paint $\le 1.2\text{s}$. |

---
**Approved by:** Software Engineering Academic Committee  
**Course Code:** Software Engineering (CS/IT 3rd Semester)  
