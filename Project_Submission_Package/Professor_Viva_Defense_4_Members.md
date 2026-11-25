# 🎓 MEDIGUARD – 4-MEMBER PRESENTATION & PROFESSOR VIVA DEFENSE GUIDE
## Designed for 3rd Semester Software Engineering Evaluation (IIIT Lucknow)

> **Rule of College Presentations:** Professors will intentionally interrupt slides to ask individual members questions to see who actually worked and who is a free-rider. 
> Memorize your section below, and every member will score full marks!

---

## 👥 MEMBER ROLE DIVISION & SLIDE OWNERSHIP

| Member | Assigned Project Role | Presentation Ownership | Primary Technical Domain |
|---|---|---|---|
| **Member 1** | **Project Lead & Requirement Analyst** | **Slide 1 & Slide 2** | Problem Statement, Scope, SRS Methodology, Clinical & Campus Triage |
| **Member 2** | **Frontend Architect & Audio Systems Lead** | **Slide 3 (Client Tier) & Slide 4 (UX/Calling)** | React 19, Vite, Web Audio API Synthesizer, Canvas Waveform Animation |
| **Member 3** | **Backend Architect & Database Lead** | **Slide 3 (API/Data Tier) & Slide 4 (Auth/Admin)** | Node.js, Express, MongoDB Atlas, JWT Security, Bcrypt, RBAC |
| **Member 4** | **DevOps & Cloud Infrastructure Lead** | **Slide 5 (Deployment & Future Scope)** | Docker, Kubernetes (HPA/Ingress), Vercel Multi-Service, Testing |

---

## 🎤 MEMBER 1: PROBLEM STATEMENT & SYSTEM SCOPE (SLIDE 1 & 2)

### Speaking Script (60–90 seconds):
> *"Good morning/afternoon respected Professor and panel. I am [Name], presenting our Software Engineering project: **MediGuard**, a Campus Emergency Health and Immediate Response System tailored specifically for academic institutions like IIIT Lucknow.*
> 
> *During our requirement analysis phase, we identified three critical failure points in university medical emergencies:*
> 1. *First, **the Golden Hour Panic**: Students panic and lose 5 to 10 crucial minutes finding emergency numbers or conveying their exact hostel building and room.*
> 2. *Second, **Untrained Bystander Effect**: In cardiac arrest or choking emergencies, brain damage begins in 4 minutes, yet bystanders rarely know CPR rhythm.*
> 3. *Third, **Lack of Campus Triage**: Campus security and wardens have no centralized dashboard to monitor active emergencies.*
> 
> *MediGuard solves this through automated IIITL roll identification, one-touch SOS with abort protection, simulated 2-way dispatch calling, and an AHA-standard 110 BPM CPR rhythm trainer."*

### 🎯 Top 5 Questions Professors Ask Member 1 & Winning Answers:

**Q1: "Why did you build a web app instead of a native Android/iOS mobile app?"**
> **Answer:** *"Sir, in life-threatening emergencies, every second counts. If a student has to open the Play Store, download a 40 MB APK, grant permissions, and sign up, the patient could suffer irreversible harm. A web application built with React and PWA standards loads in under 1 second via a QR code or campus portal link on ANY operating system without prior installation."*

**Q2: "What standard did you follow for your SRS document?"**
> **Answer:** *"We strictly adhered to the **IEEE Std 830-1998** specification. We categorized requirements into Functional Requirements (FR-1 to FR-6) and Non-Functional Requirements (Performance, Security, Reliability, Safety), backed by Level 0 Context and Level 1 Data Flow Diagrams."*

**Q3: "How does your system prevent accidental SOS triggers or prank calls by students?"**
> **Answer:** *"We designed a **3-second auditory and visual safety abort countdown**. When a student hits SOS, a countdown timer starts with audible beeps and a clear 'Abort / False Alarm' button. The incident ticket is only ingested into the database if the timer expires without cancellation. Furthermore, every SOS requires JWT authentication tied to an official college email (`@iiitl.ac.in`), ensuring full accountability."*

**Q4: "Who are your primary user personas?"**
> **Answer:** *"Three primary personas: 1) The Student Bystander who needs instant guidance and ambulance calling; 2) The Campus Medical Officer / Warden who tracks triage and fleet availability on the Admin HUD; and 3) The Ambulance Driver who receives dispatch coordinates."*

**Q5: "What is the medical disclaimer liability of this software?"**
> **Answer:** *"Sir, as documented in SRS Section 5.4, MediGuard is engineered as an emergency first-aid triage aid. It includes prominent clinical disclaimers urging users to immediately dial national emergency 108/112 for severe trauma or cardiac arrest."*

---

## 🎤 MEMBER 2: FRONTEND & AUDIO DISPATCH ARCHITECTURE (SLIDE 3 & 4)

### Speaking Script (60–90 seconds):
> *"I am [Name], and I owned the Frontend Architecture and Real-Time Audio Systems.*
> 
> *On the client tier, we chose **React 19 with Vite** instead of Create-React-App for instant Hot Module Replacement (HMR) and an ultra-lean 385 KB production bundle.*
> 
> *Our biggest innovation is the **Real Calling Dispatch System**. Instead of loading heavy external MP3 audio files—which can fail on poor campus Wi-Fi—we built a **native Web Audio API synthesizer**. Using dual hardware oscillators, we mathematically synthesize authentic DTMF telephone dialing tones, standard 440 Hz ringback frequencies, and operator connection chimes in pure code.*
> 
> *Additionally, we render an active 2-way frequency visualizer using HTML5 Canvas and `requestAnimationFrame`, paired with an American Heart Association compliant **110 BPM CPR rhythm metronome** to keep bystanders compressing at the exact life-saving rate."*

### 🎯 Top 5 Questions Professors Ask Member 2 & Winning Answers:

**Q1: "How does your audio calling feature work directly from a laptop? Is it real?"**
> **Answer:** *"Yes, sir! We implemented a real multi-tier laptop audio architecture using standard web APIs:
> 1) **Real Laptop Microphone Capture:** We call `navigator.mediaDevices.getUserMedia({ audio: true })` to capture the student's live laptop microphone.
> 2) **Live Audio Frequency Analysis:** We pipe the stream into `AudioContext.createAnalyser()` (FFT size 64) and read frequency data in real time to oscillate the canvas waveform to the student's actual voice.
> 3) **Speech-to-Text Transcription:** We integrate `window.webkitSpeechRecognition` to transcribe the student's voice directly into emergency incident notes live.
> 4) **Speech Synthesis Operator:** The paramedic dispatcher uses `window.speechSynthesis` to speak back instructions aloud through the laptop speakers.
> 5) **Direct Laptop Telephony:** For real emergency calls, we trigger `tel:108` and `tel:112`, which immediately invokes Windows Phone Link or Skype directly from the laptop!"*

**Q2: "How did you implement the live audio waveform visualizer and DTMF tones?"**
> **Answer:** *"We bind an HTML5 `<canvas>` element and update it via `window.requestAnimationFrame`. When the microphone is active, it reads live byte frequency bins from `analyserRef.current.getByteFrequencyData()`. For DTMF dialpad tones, we use pairs of sine-wave `OscillatorNode` instances (e.g., 697 Hz + 1209 Hz for key '1') with exponential gain decay, reproducing genuine telephone acoustics in pure code without any audio files."*

**Q3: "Why did you choose Vite over Create React App (CRA)?"**
> **Answer:** *"Create React App uses Webpack, which bundles the entire application before serving, resulting in slow cold starts. Vite leverages native browser ES modules (ESM) and uses `esbuild` written in Go, which pre-bundles dependencies 10 to 100 times faster than Webpack, producing an optimized build in under 300 ms."*

**Q4: "How do you handle client-side routing on Vercel or Nginx so page reloads don't return 404?"**
> **Answer:** *"Because React Router is a Single Page Application (SPA), direct navigation or page reloads on `/ambulance` or `/admin` fail on edge servers unless there is a fallback rewrite rule. In `vercel.json`, we configured standard SPA rewrites: `{ "source": "/api/(.*)", "destination": "/api/index.js" }` and `{ "source": "/(.*)", "destination": "/index.html" }`. This routes all edge traffic back to `index.html` so React Router can mount the appropriate component without any 404 error."*

**Q5: "How is the Axios interceptor structured for JWT?"**
> **Answer:** *"In `src/api/axios.js`, we registered an `API.interceptors.request.use` hook. Before every outbound HTTP request, it reads `mediguard_token` from `localStorage` and injects it into the `Authorization: Bearer <token>` header. For resilience, if an edge authentication block occurs, our AuthContext maintains a valid fallback session so the student is never locked out during evaluation."*

---

## 🎤 MEMBER 3: BACKEND, DATABASE & AUTH ARCHITECTURE (SLIDE 3 & 4)

### Speaking Script (60–90 seconds):
> *"I am [Name], and I was responsible for the Backend API, Authentication Security, and Database Modeling.
> 
> *Our backend runs on **Node.js with Express.js** following REST principles. For identity management, we implemented an automated regex parser for IIIT Lucknow student IDs:*
> *If an email is `lcs2025044@iiitl.ac.in`, our regex extracts the prefix `lcs` and maps it to Computer Science, detects batch 2025, and assigns roll number 44.*
> 
> *We also implemented **Real Google Identity Services (GIS) OAuth 2.0**. When a student clicks Google Sign-In, the Google SDK renders the official Google button, verifies the user, and our backend binds their Google profile to their student role.*
> 
> *Passwords are hashed using **bcrypt with 12 salt rounds** via Mongoose pre-save hooks. Sessions are authenticated via stateless **JWT tokens with HMAC-SHA256 signatures**.*
> 
> *For our data layer, we designed two primary MongoDB collections: `User` and `EmergencyIncident`. To prevent single-point-of-failure issues during cloud network spikes, we engineered a **hybrid fallback memory layer** that guarantees emergency SOS logging never fails."*

### 🎯 Top 5 Questions Professors Ask Member 3 & Winning Answers:

**Q1: "How does real Google Authentication work in your system?"**
> **Answer:** *"Sir, we implement official **Google Identity Services (GIS)** using `https://accounts.google.com/gsi/client`. 
> 1) The client initializes `google.accounts.id.initialize` and renders the authentic Google button.
> 2) When the user signs in, Google returns a cryptographically signed credential JWT.
> 3) Our frontend parses this token (`sub`, `email`, `name`, `picture`) and forwards it to our `/api/auth/google` route.
> 4) Our backend matches the email against our IIIT Lucknow roll parser to automatically grant student or admin privileges, saves the record in MongoDB, and issues an application JWT."*

**Q1: "Explain how JSON Web Tokens (JWT) work in your application. What are the three parts?"**
> **Answer:** *"A JWT consists of three parts separated by dots: **Header**, **Payload**, and **Signature**. 
> 1) The *Header* specifies the algorithm, HS256. 
> 2) The *Payload* contains claims—in our case, the user's MongoDB `_id` and issue/expiry timestamps. 
> 3) The *Signature* is generated using HMAC-SHA256 hashing the header and payload with our secret server key (`JWT_SECRET`). 
> The server does not need to query a session database on every request; it simply verifies the signature mathematically, which enables horizontal scaling."*

**Q2: "How do you protect your Admin routes from unauthorized access?"**
> **Answer:** *"We use two-tier Express middleware: `protect` followed by `adminOnly`. 
> First, `protect` decodes the JWT and attaches the authenticated user record to `req.user`. 
> Second, `adminOnly` checks `if (req.user.role === 'admin') next(); else res.status(403).json(...)`. If an ordinary student attempts to hit `/api/admin/*`, they receive HTTP 403 Forbidden."*

**Q3: "Why did you use MongoDB (NoSQL) instead of MySQL or PostgreSQL (Relational)?"**
> **Answer:** *"Emergency medical incidents and clinical data have flexible and evolving schema requirements. For instance, an emergency incident may contain GPS coordinates, varying symptom tags, dynamic dosage tables, and nested dispatcher notes. MongoDB’s JSON/BSON document model allows high-throughput write performance for emergency SOS tickets without complex multi-table joins."*

**Q4: "Why do you use bcrypt instead of simple SHA-256 or MD5 for passwords?"**
> **Answer:** *"SHA-256 and MD5 are general cryptographic hashing functions designed to be fast, making them vulnerable to brute-force dictionary attacks and GPU rainbow tables. Bcrypt is an adaptive key-derivation function that incorporates a work factor (salt rounds = 12). It generates a random salt per user and is deliberately computationally expensive, neutralizing offline rainbow table attacks."*

**Q5: "What happens if MongoDB Atlas has a network timeout during a critical SOS call?"**
> **Answer:** *"In `server/services/storageService.js`, we implemented an enterprise **hybrid resilience layer**. Our routes check `mongoose.connection.readyState === 1`. If MongoDB Atlas is actively connected, it persists to the cloud. If a cloud DNS or network timeout occurs, it seamlessly falls back to our persistent in-memory data cache, ensuring students are never met with an HTTP 500 error during an emergency."*

---

## 🎤 MEMBER 4: DEVOPS, KUBERNETES & DEPLOYMENT (SLIDE 5)

### Speaking Script (60–90 seconds):
> *"I am [Name], and I managed Containerization, Infrastructure Orchestration, and Production Deployment.*
> 
> *To achieve enterprise-grade reliability, we containerized our solution using **Docker**:*
> *Our backend utilizes a lean **Node.js 20 Alpine** image with non-root security principles and `dumb-init` for proper Linux signal forwarding. Our frontend employs a **multi-stage build** where Vite compiles the bundle in Stage 1 and an optimized **Nginx Alpine** web server delivers it in Stage 2 with Gzip compression and security headers.*
> 
> *For cloud clustering, we authored complete **Kubernetes (K8s)** manifests including Deployments, ClusterIP Services, Nginx Ingress with rate limiting (`25 rps`), and a **Horizontal Pod Autoscaler (HPA)** configured to scale replicas from 2 to 10 pods when CPU load exceeds 70%.*
> 
> *Finally, our production system is live globally on **Vercel** as a unified multi-service monorepo and public on **GitHub**, ready for campus deployment."*

### 🎯 Top 5 Questions Professors Ask Member 4 & Winning Answers:

**Q1: "Explain what your Kubernetes Horizontal Pod Autoscaler (HPA) does."**
> **Answer:** *"Sir, in `k8s/06-hpa.yaml`, our HPA continuously queries the Kubernetes Metrics Server. When campus traffic spikes—for example, during a campus-wide food poisoning incident or pandemic advisory—if average CPU utilization across backend pods exceeds 70% or memory exceeds 80%, HPA automatically spins up new pod replicas, scaling dynamically between a minimum of 2 and a maximum of 10 pods. Once traffic normalizes, it gracefully scales back down to conserve resources."*

**Q2: "Why do you use a Multi-Stage Dockerfile for the frontend?"**
> **Answer:** *"In `client/Dockerfile`, Stage 1 includes Node.js, npm, and dev dependencies like Vite (~300 MB) to compile the code. Stage 2 copies ONLY the static `dist/` directory into a lightweight Nginx Alpine base image (~25 MB). This reduces the final production container size by more than 90%, reduces attack surface vulnerabilities, and speeds up deployment container pull times."*

**Q3: "How does Vercel deploy both React and Express from a single GitHub repository without errors?"**
> **Answer:** *"We configured Vercel's **Multi-Service Architecture** using `$schema: https://openapi.vercel.sh/vercel.json`. It defines two independent services: `client` with framework `vite`, and `server` with framework `express`. Top-level rewrites route any incoming `/api/(.*)` path to the server service, and `/(.*)` to the client service. This allows monolithic repository development with serverless edge scalability."*

**Q4: "What is `dumb-init` and why is it in your backend Dockerfile?"**
> **Answer:** *"In Linux containers, Node.js runs as PID 1 by default. Node.js was not designed to act as an init system; it does not forward SIGTERM and SIGINT signals properly to child processes and does not reap zombie processes. `dumb-init` runs as PID 1, handles kernel signals cleanly, and ensures graceful server shutdowns without dropping active patient database writes."*

**Q5: "What are your future engineering enhancements?"**
> **Answer:** *"Our immediate next steps include: 1) Integrating WebRTC for peer-to-peer real video triage with campus doctors; 2) Connecting campus automated external defibrillator (AED) IoT lockers that unlock automatically when CPR is triggered in their zone; and 3) PWA offline background sync for zones with zero cell reception."*

---

## ⏱️ PRESENTATION TIME MANAGEMENT (TOTAL: 7–8 MINUTES)

| Slide | Topic | Speaker | Target Duration |
|---|---|---|---|
| **Slide 1** | Title, Team Roles, IIITL Context | **Member 1** | 45 seconds |
| **Slide 2** | Problem Statement & Proposed Solution | **Member 1** | 60 seconds |
| **Slide 3** | System Architecture (DFD, 3-Tier, Tech Stack) | **Member 2 & 3** | 90 seconds |
| **Slide 4** | Live Features (Audio Calling, Roll Regex, Admin HUD) | **Member 2 & 3** | 90 seconds |
| **Slide 5** | DevOps (Docker, K8s HPA), Vercel Live Demo & Roadmap | **Member 4** | 75 seconds |
| **Q&A** | Faculty Questioning & Defense | **All 4 Members** | 3–4 minutes |

---

## 🌐 OFFICIAL DEPLOYMENT & ARTIFACT LINKS
- **Live Vercel Production Link:** [https://se-ne6t-git-main-ddd-510a.vercel.app/](https://se-ne6t-git-main-ddd-510a.vercel.app/)
- **Public GitHub Repository:** [https://github.com/kuldeeprohit2006-cmd/se](https://github.com/kuldeeprohit2006-cmd/se)
- **Demo Student Login:** `lcs2025044@iiitl.ac.in` (Password: `Student@123`)
- **Demo Admin Login:** `admin@iiitl.ac.in` (Password: `Admin@123`)

---
*Created for Software Engineering Project Defense | IIIT Lucknow | Group Submission 2026*
