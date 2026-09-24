# AarogyaBharat (MedVoyage India) 🇮🇳

> **Premier India-Focused Medical Tourism & Value Travel Platform**  
> Connecting international & domestic patients with JCI & NABH accredited hospitals and world-renowned doctors across India, combining clinical discovery with complete travel assistance (Medical Visa, Airport Transfers, Accommodations, and Multilingual Interpreters).

> [!NOTE]
> **Prototype Demonstration Notice**: All institutions, credentials, procedures, prices, and statistics within this project are realistic demo representations curated for prototype evaluation. Demo estimates are for planning purposes and do not constitute guaranteed medical quotes.

---

## 🌟 Key Features

1. **Healthcare & Procedure Discovery**:
   - 11 comprehensive treatments across Cardiology, Orthopedics, Oncology, Organ Transplants, IVF, Spine, Dental, and Ophthalmology.
   - Realistic cost range estimates with international comparisons (USA, UK, India) showing 80% to 94% patient savings.
2. **Accredited Hospital Network**:
   - 9 premier medical centers across **Delhi NCR, Chennai, Mumbai, Bengaluru, Hyderabad, and Kochi**.
   - Filter by city, specialty, and accreditation (JCI, NABH, NABL, CAP).
   - In-depth hospital profiles with inpatient capacity, international lounges, and faculty doctors.
3. **Doctor Directory**:
   - 13 experienced department heads and surgeons with qualifications, experience, languages, and teleconsult fees.
4. **Destination Discovery API (`/api/cities`)**:
   - Summaries of top medical cities in India with dynamic hospital counts and top specialties.
5. **Interactive Medical Travel Cost Estimator**:
   - Dynamic calculator estimating procedure costs, round-trip flights, and 10–14 days lodging for patient and companions with clear disclaimer.
6. **Consultation & Inquiry Management**:
   - Direct online consultation requests with hospital desks and doctors.
7. **Patient Journey Dashboard**:
   - 5-step live medical journey progress tracker (Case Evaluation ➔ Video Consult ➔ Medical Visa ➔ Arrival & Admission ➔ Surgery & Recovery).
   - Upcoming teleconsultations with direct "Join Doctor Video Call" integration.
   - Secure medical documents and official MEA visa invitation letters.
8. **Authentication & Role-Based Access**:
   - JWT authentication with bcrypt password hashing.
   - Roles: `patient`, `provider`, `admin`.
   - **One-click instant demo login buttons** for smooth presentations.

---

## 🏗️ Architecture

```
React UI (TypeScript + Vite + Tailwind CSS)
   │
   ▼
Axios API Client (with JWT Interceptor & Proxy)
   │
   ▼
REST API (Express + TypeScript)
   │
   ▼
Controllers Layer (Thin Request Handlers)
   │
   ▼
Services Layer (Pure Business Logic)
   │
   ▼
Mongoose Models (Relational-style ObjectId references)
   │
   ▼
MongoDB (Port 27017)
```

The database models are designed in a relational-style pattern with clean `ObjectId` references to enable future migrations to PostgreSQL & Prisma without redesigning the application.

---

## 🗄️ Relational-Style Data Models

| Model | Key Fields & Relationships |
|---|---|
| **User** | `name`, `email`, `passwordHash`, `role` (`patient` \| `provider` \| `admin`), `phone`, `country`, `profile` (`avatarUrl`, `bio`, `preferredLanguage`), `timestamps` |
| **Hospital** | `name`, `slug`, `description`, `city`, `state`, `address`, `specialties`, `treatments` (`[ObjectId ref Treatment]`), `facilities`, `accreditation`, `internationalPatientServices`, `languagesSupported`, `contact` (`email`, `phone`, `website`), `verificationStatus`, `rating`, `reviewCount`, `bedCount`, `image`, `gallery`, `timestamps` |
| **Doctor** | `name`, `slug`, `hospital` (`ObjectId ref Hospital`), `specialization`, `qualification`, `experience`, `languages`, `bio`, `consultationFee` (`minUSD`, `maxUSD`, `minINR`, `maxINR`), `profileImage`, `verificationStatus`, `isAvailableForTeleconsult`, `timestamps` |
| **Treatment** | `name`, `slug`, `category`, `description`, `overview`, `procedureInformation`, `estimatedDuration`, `estimatedCostRange` (`minUSD`, `maxUSD`, `minINR`, `maxINR`, `usaComparisonUSD`, `ukComparisonUSD`, `disclaimer`), `recoveryInformation`, `savingsPercentage`, `successRate`, `popularCities`, `relatedHospitals` (`[ObjectId ref Hospital]`), `relatedDoctors` (`[ObjectId ref Doctor]`), `image`, `timestamps` |
| **Appointment** | `patient` (`ObjectId ref User`), `doctor` (`ObjectId ref Doctor`), `hospital` (`ObjectId ref Hospital`), `treatment` (`ObjectId ref Treatment`), `appointmentDate`, `appointmentType` (`teleconsult` \| `in_person`), `status`, `notes`, `meetingLink`, `timestamps` |
| **Consultation** | `patient` (`ObjectId ref User`), `hospital` (`ObjectId ref Hospital`), `doctor` (`ObjectId ref Doctor`), `treatment` (`ObjectId ref Treatment`), `message`, `preferredDate`, `status` (`pending` \| `reviewed` \| `responded` \| `closed`), `response`, `timestamps` |
| **MedicalDocument** | `patient` (`ObjectId ref User`), `documentType`, `fileName`, `fileUrl` (secure reference), `fileSize`, `uploadDate`, `visibility` (`patient_and_doctor` \| `private` \| `hospital_only`), `timestamps` |
| **Review** | `patient` (`ObjectId ref User`), `hospital` (`ObjectId ref Hospital`), `doctor` (`ObjectId ref Doctor`), `rating`, `comment`, `moderationStatus` (`published` \| `pending` \| `flagged`), `patientName`, `patientCountry`, `timestamps` |
| **TravelPlan** | `patient` (`ObjectId ref User`), `destinationCity`, `arrivalDate`, `departureDate`, `accommodation` (`type`, `details`), `transport` (`airportPickup`, `details`), `hospital` (`ObjectId ref Hospital`), `notes`, `status`, `timestamps` |

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017`

### 2. Install Dependencies
```bash
# In project root:
npm run install:all
```

### 3. Seed Realistic Indian Healthcare Data
Populates 9 hospitals, 13 doctors, 11 treatments, reviews, appointments, and consultations:
```bash
npm run seed
```

### 4. Run Development Servers
```bash
# Runs both backend API (5000) and frontend (5173) together:
npm run dev
```

Or individually:
```bash
npm run dev:server  # Backend on http://localhost:5000
npm run dev:client  # Frontend on http://localhost:5173
```

---

## 🔑 Demo Presentation Credentials

Intended solely as local prototype credentials for evaluation:

| Role | Email | Password | Pre-configured Context |
|------|-------|----------|------------------------|
| **Patient** | `patient@example.com` | `Password123!` | Sarah Jenkins — Active Knee Arthroplasty journey, Medanta teleconsult, flight AI 102, visa approved |
| **Provider** | `provider@apollo.com` | `Password123!` | Apollo Hospitals International Desk Coordinator |
| **Admin** | `admin@medvoyage.in` | `Password123!` | Platform Administrator |

---

## 🩺 REST API Endpoints

### Discovery & General
- `GET  /api/health` - Health check
- `GET  /api/cities` - Medical destinations with hospital counts and specialties
- `GET  /api/hospitals` - List hospitals (`?city=Delhi&specialty=cardiology&search=...`)
- `GET  /api/hospitals/:id` - Hospital details (by ID or slug) with faculty doctors
- `GET  /api/doctors` - Directory of doctors (`?hospital=<id>&specialty=cardiology`)
- `GET  /api/doctors/:id` - Doctor profile with hospital details
- `GET  /api/treatments` - Procedures with cost ranges (`?category=cardiology&search=...`)
- `GET  /api/treatments/:id` - Treatment details with related hospitals and doctors

### Patient & Authenticated Flows (JWT Bearer)
- `POST /api/auth/register` - Patient or provider signup
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET  /api/auth/me` - Current authenticated user
- `GET  /api/appointments/my` - Patient appointment & teleconsult records
- `POST /api/appointments` - Book appointment or video consult
- `GET  /api/consultations/my` - Patient consultation inquiries
- `POST /api/consultations` - Submit consultation inquiry
- `GET  /api/travel-plans/my` - Patient travel itinerary and visa status
- `POST /api/travel-plans/my` - Create or update medical travel plan
