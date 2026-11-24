# 🛡️ MediGuard - Student Campus Emergency & Health Response System

> **Live Production Deployment:** [https://se-ne6t-git-main-ddd-510a.vercel.app/](https://se-ne6t-git-main-ddd-510a.vercel.app/)  
> **Google Slides Presentation:** [MediGuard_Presentation_Google_Slides.pptx](MediGuard_Presentation_Google_Slides.pptx)  
> Designed for **IIIT Lucknow** (`@iiitl.ac.in`) & Campus Student Health Safety.

---

## 🌟 Overview

**MediGuard** is a full-stack MERN emergency healthcare and quick-response platform built to assist students and campus administration during critical medical emergencies. It features automated student ID mapping, interactive CPR metronome protocols, live ambulance dispatch tracking, blood donor registries by group, an emergency medicine reference guide, and a 2-way Web Audio dispatch calling simulator.

---

## 🚀 Key Features

### 1. 🎓 Automated Student Authentication & Google OAuth
- **Domain Auto-Mapping:** Integrates with IIIT Lucknow student emails (`@iiitl.ac.in`).
- **Branch Recognition:**
  - `LCS` &rarr; Computer Science (CS)
  - `LIT` &rarr; Information Technology (IT)
  - `LCI` &rarr; CS & Artificial Intelligence (CSAI)
  - `LCB` &rarr; CS & Business Studies (CSB)
- **Roll Number Support:** Automatic formatting for batches and roll numbers (range 1 to 60, e.g. `lcs2025044@iiitl.ac.in`).
- **Normal Account Support:** Allows login and registration for external/regular Google accounts (`@gmail.com`).
- **JWT 256-Bit Auth:** Signed JSON Web Tokens with auto-injecting Axios request interceptors.

### 2. 📞 Real 2-Way Audio Dispatch Calling System
- **Web Audio API Synthesizer:** Real-time synthesized DTMF telephone dialing tones, ringback audio, and operator connect chimes (zero external audio file dependencies).
- **Dynamic Waveform Visualizer:** Animated canvas frequency bars rendering live audio channels.
- **Operator Simulation:** Live interactive conversation transcript with on-campus dispatchers and quick-response chips.
- **Smartphone Direct Dial:** Direct `tel:108` and `tel:112` triggers for smartphones.

### 3. 🚨 1-Tap SOS Emergency with 3-Second Abort Countdown
- Audible safety countdown allows cancelling accidental taps.
- Instant GPS & campus zone broadcasting (*Boys Hostel 1, Academic Block, Dispensary, etc.*).
- Auto-registers critical incident in the database and alerts the medical warden.

### 4. 🛡️ Admin Incident Command Center (`/admin`)
- **Live Incident Stream:** View real-time incoming emergencies with student name, branch, roll number, and timestamp.
- **Dispatch Actions:** One-click ambulance dispatch, direct audio call, and resolution tracking.
- **Student Roster:** Filter all registered students by branch (`LCS`, `LIT`, `LCI`, `LCB`) and roll range.
- **Fleet Telemetry:** Real-time status and campus arrival ETA of ambulances (`AMB-101`, `AMB-102`, `AMB-108`).

### 5. ❤️ CPR & Emergency First Aid Manual
- **110 BPM Visual & Audio Metronome:** Helps students maintain the critical 100–120 compressions/minute rhythm for adult CPR.
- Protocols for **Choking (Heimlich Maneuver)**, **Burns**, **Seizures**, **Anaphylaxis**, and **Fractures**.

### 6. 🩸 Blood Donor Groups & 💊 Emergency Medicines
- **Blood Groups:** 8-group filter (A+, A-, B+, B-, AB+, AB-, O+, O-) with compatibility matrix.
- **Emergency Medicines:** Symptom search, OTC vs Prescription badges, pediatric/adult dosage tables, and contraindications.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, React Router 7, Axios, Web Audio API, Modern Glassmorphism CSS.
- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, BcryptJS.
- **Containerization & Orchestration:** Docker, Docker Compose, Kubernetes (Deployments, Services, Ingress, HPA).
- **Cloud & Serverless:** Vercel Serverless Functions (`api/index.js`), Vercel Edge Network.

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/kuldeeprohit2006-cmd/mediguard.git
cd mediguard
```

### 2. Backend Setup
```bash
cd server
npm install
# Configure your .env file with MONGO_URI, JWT_SECRET, PORT=5000
npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

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
