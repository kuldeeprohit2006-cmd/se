# 🛡️ MediGuard - Student Campus Emergency & Health Response System

[![Live Website](https://img.shields.io/badge/Live%20Website-Open%20MediGuard-00E08E?style=for-the-badge&logo=vercel)](https://se-ne6t-git-main-ddd-510a.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-kuldeeprohit2006--cmd%2Fse-0E90FF?style=for-the-badge&logo=github)](https://github.com/kuldeeprohit2006-cmd/se)

> **🌐 Live Website Link:** **[https://se-ne6t-git-main-ddd-510a.vercel.app/](https://se-ne6t-git-main-ddd-510a.vercel.app/)**  
> **📊 Google Slides Presentation:** [MediGuard_Presentation_Google_Slides.pptx](MediGuard_Presentation_Google_Slides.pptx) | [PDF Version](Project_Submission_Package/MediGuard_Presentation_5_Slides.pdf)  
> **📘 IEEE 830 SRS Document:** [SRS_Document_MediGuard.md](docs/SRS_Document_MediGuard.md)  
> **📦 Submission Package (ZIP + Docs):** [Project_Submission_Package/](Project_Submission_Package/)  
> Designed for **IIIT Lucknow** (`@iiitl.ac.in`) & Campus Student Health Safety.

---

## 🌟 Overview

**MediGuard** is a full-stack MERN emergency healthcare and quick-response platform built to assist students and campus administration during critical medical emergencies. It features real Google OAuth 2.0 / Firebase authentication, automated IIITL roll/branch ID mapping, interactive 110 BPM CPR audio-visual metronome protocols, live ambulance dispatch & trauma contacts, blood donor registries by group, an emergency medicine reference guide, and real multi-channel calling APIs (`Twilio`, `Jitsi WebRTC`, `Google Meet`, `WhatsApp`, and `tel:`).

---

## 🚀 Key Features

### 1. 🎓 Real Google OAuth 2.0 / Firebase Authentication & IIITL Identity Mapping
- **Real Google Account Chooser:** Supports Direct Google OAuth 2.0 (`accounts.google.com/o/oauth2/v2/auth`) and Firebase Auth (`signInWithPopup`) fetching verified profiles from Google's UserInfo API.
- **Branch Recognition (`@iiitl.ac.in`):**
  - `LCS` &rarr; Computer Science (CS)
  - `LIT` &rarr; Information Technology (IT)
  - `LCI` &rarr; CS & Artificial Intelligence (CSAI)
  - `LCB` &rarr; CS & Business Studies (CSB)
- **Roll Number Support:** Automatic formatting for batches and roll numbers (range 1 to 60, e.g. `lcs2025044@iiitl.ac.in`).
- **Normal Account Support:** Allows login and registration for personal Gmail/external accounts (`@gmail.com`).
- **Stateless JWT Auth:** Signed JSON Web Tokens with full claim hydration for serverless reliability.

### 2. 📞 Real Laptop Calling API & External Calling Redirects
- **Backend Calling Bridge (`POST /api/incidents/call-bridge`):** Integrates **Twilio Programmable Voice REST API** (`api.twilio.com`) when Twilio credentials are configured, and provisions unique **Jitsi WebRTC** call rooms.
- **1-Click Live Web Calling:** Redirects directly to **Jitsi Meet WebRTC**, **Google Meet**, and **WhatsApp Call (`wa.me`)**.
- **Laptop Direct Dial (`tel:`):** Places `tel:108`, `tel:112`, or custom number calls via Windows Phone Link / system phone dialer.
- **Live Mic & Speech Pipeline:** Captures microphone input (`navigator.mediaDevices.getUserMedia`), renders live FFT frequency waveforms (`AnalyserNode`), transcribes speech (`SpeechRecognition`), speaks operator replies (`SpeechSynthesis`), and plays DTMF keypad tones.

### 3. 🚨 1-Tap SOS Emergency with 3-Second Abort Countdown
- Audible safety countdown prevents accidental triggers.
- Instant GPS & campus zone broadcasting (*Boys Hostel 1, Academic Block, Dispensary, etc.*).
- Auto-registers critical incident in MongoDB / hybrid storage and alerts the medical warden.

### 4. 🛡️ Admin Incident Command Center (`/admin`)
- **Live Incident Stream:** View real-time incoming emergencies with student name, branch, roll number, and timestamp.
- **Dispatch Actions:** One-click ambulance dispatch, resolution tracking, and direct call connection.
- **Student Roster:** Filter all registered students by branch (`LCS`, `LIT`, `LCI`, `LCB`) and search by name/roll.
- **Fleet Telemetry:** Real-time readiness and ETA of campus ambulance units (`AMB-101`, `AMB-102`, `AMB-108`).

### 5. ❤️ CPR & Emergency First Aid Manual
- **110 BPM Audio-Visual Metronome:** Generates audible beats and pulsating heart counts (1–30) matching AHA CPR compressions/min rhythm.
- Protocols for **Choking (Heimlich Maneuver)**, **Burns**, **Seizures**, **Anaphylaxis**, **Heatstroke**, **Poisoning**, and **Fractures**.

### 6. 🩸 Blood Donor Groups & 💊 Emergency Medicines
- **Blood Groups:** 8-group filter (A+, A-, B+, B-, AB+, AB-, O+, O-) with compatibility matrix.
- **Emergency Medicines:** Symptom search, OTC vs Prescription tags, dosage tables, and contraindications.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite 8, React Router 7, Axios, Firebase Auth SDK, Web Audio / Web Speech APIs.
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose ODM), JWT, BcryptJS, Twilio Voice REST API.
- **Containerization & Orchestration:** Docker, Docker Compose, Kubernetes (Deployments, Services, Ingress, HPA).
- **Cloud & Serverless:** Vercel Serverless Functions (`api/index.js`), Vercel SPA Edge Rewrites (`vercel.json`).

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/kuldeeprohit2006-cmd/se.git
cd se
```

### 2. Backend Setup (Port 5000)
```bash
cd server
npm install
# Configure server/.env with MONGO_URI, JWT_SECRET, PORT=5000 (optional: TWILIO_*)
npm start
```

### 3. Frontend Setup (Port 3000)
```bash
cd ../client
npm install
# Optional: copy .env.example to .env and set VITE_GOOGLE_CLIENT_ID or VITE_FIREBASE_*
npm run dev -- --port 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🐳 Docker Setup
Run the entire stack with a single command:
```bash
docker-compose up --build
```

---

## ☸️ Kubernetes Deployment
Deploy to a production Kubernetes cluster:
```bash
kubectl apply -f k8s/01-namespace.yaml
kubectl apply -f k8s/02-configmap-secret.yaml
kubectl apply -f k8s/03-backend.yaml
kubectl apply -f k8s/04-frontend.yaml
kubectl apply -f k8s/05-ingress.yaml
kubectl apply -f k8s/06-hpa.yaml
```

---

## 🔑 Demo Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **CS Student** | `lcs2025044@iiitl.ac.in` | `Student@123` | CS Branch, Roll 044 |
| **IT Student** | `lit2025012@iiitl.ac.in` | `Student@123` | IT Branch, Roll 012 |
| **CSAI Student** | `lci2025033@iiitl.ac.in` | `Student@123` | CSAI Branch, Roll 033 |
| **CSB Student** | `lcb2025007@iiitl.ac.in` | `Student@123` | CSB Branch, Roll 007 |
| **Admin Director** | `admin@iiitl.ac.in` | `Admin@123` | Command Center Access |

---

## 📄 License
MIT License. Built for Student Campus Safety & Emergency Health Response.
