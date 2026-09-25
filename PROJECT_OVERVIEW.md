# BHG Patient Portal — Project Overview

This document provides a comprehensive overview of the **BHG Patient Portal** (and companion **Clinician Interface**), including its clinical mission, dual-portal architecture, core features, connected state engine, and technical implementation details.

---

## 🏥 Clinical Mission & Domain Context

Behavioral Health Group (BHG) is a leading provider of outpatient addiction medicine, specializing in **Opioid Treatment Programs (OTP)**, **Office-Based Opioid Treatment (OBOT)**, and **Intensive Outpatient Programs (IOP)** utilizing **Medication-Assisted Treatment (MAT)** (e.g., Methadone, Buprenorphine/Suboxone, Naltrexone/Vivitrol).

Unlike generic outpatient clinics, outpatient addiction treatment requires coordinated daily logistics:
- **Strict Dispensing Windows**: Daily clinic dosing hours that patients must adhere to, supported by real-time countdown clocks.
- **Dosing Hold Transparency**: Eliminating anxiety at the dosing window by proactively verifying hold-free status ("No Holds Active" shield) before arrival.
- **Take-Home Bottle Steps**: Regulated take-home bottle privileges earned through clinical stability, along with compliance call-back protocols and lockbox safety.
- **Destigmatized Toxicology Tracking**: Random urine drug screens (UDS) presented with supportive, non-punitive clinical framing (*"consistent/inconsistent"* rather than *"clean/dirty"*), clearly identifying prescribed medications versus unexpected substances.
- **Between-Session Behavioral Engagement**: Cognitive Behavioral Therapy (CBT) coping exercises and craving tracking between counseling sessions with direct counselor feedback.
- **1-Click Waiting Room Check-In**: Streamlined clinic arrival flow that alerts clinicians immediately in their daily session agenda.
- **Multidisciplinary Caseload Management**: Unified coordination across counselors, medical providers, dispensing nurses, and billing coordinators.
- **42 CFR Part 2 Confidentiality**: Strict federal privacy safeguards governing substance use disorder treatment records.
- **Financial Protection**: Outstanding dues tracking, transaction receipts, active insurance eligibility (EDI 270/271), and sliding-scale financial hardship relief.

The **BHG Patient Portal** addresses these unique requirements through a synchronized **Patient Portal** and **Clinician Portal** platform.

---

## 🏗️ Architecture & Tech Stack

The application is engineered as a modern, responsive Single Page Application (SPA) designed for rapid feedback and high-fidelity demonstration without requiring an active backend database.

### **Core Technology Stack**
*   **Frontend Framework**: [React 18](https://reactjs.org/) (Functional components, hooks, custom context).
*   **Build Tooling**: [Vite 5](https://vitejs.dev/) (Fast ESM development server, rollup production bundles).
*   **Routing**: [React Router DOM v6](https://reactrouter.com/) (Declarative client-side routing).
*   **Styling**: Modern CSS design system (`index.css`, `bhgPortal.css`, `theme.css`) with curated design tokens, glassmorphism, responsive grid layouts, and custom status badges.
*   **Icons**: [Lucide React](https://lucide.dev/) (Clean, accessible healthcare iconography).
*   **State Management**: **React Context API** (`AppContext.jsx`) integrated with a persistent browser storage engine (`bhgDemoState.js`).

### **Connected Dual-Portal Architecture**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Client Browser Layer (SPA)                        │
├────────────────────────────────────┬────────────────────────────────────┤
│         Patient Experience         │        Clinician Experience        │
│  - Dosing Windows & Countdown      │  - Caseload Roster & Phase Tracks  │
│  - "No Holds Active" Shield        │  - Sessions Agenda & 1-Click Queue │
│  - Active Dose & Bottle Schedule   │  - Dispensing Window Queue & Holds │
│  - 1-Click Waiting Room Check-In   │  - Population UDS & Lab Tracking   │
│  - Destigmatized Lab/UDS Results   │  - CBT Homework Review & Feedback  │
│  - Between-Session CBT Practice    │  - DAP / SOAP Clinical Charting    │
│  - BAM & Recovery Milestones       │  - Group Sessions & Notes          │
│  - Billing, Dues & Hardship Form   │  - Patient Request Triage Queue    │
│  - 42 CFR Part 2 & SMS Consents    │  - Multi-Center Filter (3 Centers) │
│  - 24/7 AI Support Assistant       │  - Care Coordination Tracking      │
├────────────────────────────────────┴────────────────────────────────────┤
│                           Central AppContext                            │
│              - Session & Role Routing (Patient vs Clinician)            │
│              - Bi-directional State Sync (localStorage v5)              │
├─────────────────────────────────────────────────────────────────────────┤
│                           Data & Domain Layer                           │
│              - bhgPatientData.js (Rich Clinical Seed Data)              │
│              - bhgDemoState.js (Persistent Reactive State Engine)       │
└─────────────────────────────────────────────────────────────────────────┘
```

1.  **Provider Layer (`AppProvider`)**: Wraps the application to manage session authentication, active treatment center filtering, notifications, toasts, and bi-directional reactive workflows.
2.  **Routing Layer (`AppRoutes`)**: Renders patient pages or clinician pages based on the authenticated persona (`userRole === 'admin'` vs `'patient'`).
3.  **Connected Persistence Layer (`bhgDemoState.js`)**: All patient requests, appointment check-ins, visit outcomes, CBT assignments, counselor feedback, hold clearances, and messages persist in `localStorage` under `bhg-connected-demo-state-v5`. Changes made in one portal reflect immediately in the other.

---

## ✨ Key Features & Modules

### **1. Patient Portal Modules**
*   **Dashboard (`/dashboard`)**: Daily medication window countdown, "No Holds Active" shield, treatment stage badge, required actions, and activity timeline.
*   **My Treatment (`/treatment`)**: Active prescription details (e.g., *Methadone 85 mg Oral Liquid*), care team contacts, recovery milestones, and **Between-Session CBT Practice & Coping Exercises** with counselor review feedback callouts.
*   **Medication Schedule (`/medication`)**: 7-day dispensing schedule, take-home tier progression rules, compliance call-back guidance, and guided missed-dose reporting.
*   **Visits & Appointments (`/appointments`)**: Upcoming clinical sessions, secure Zoom telehealth links, **1-Click Waiting Room Check-In**, appointment rescheduling requests, and interactive offer acceptance banners.
*   **Lab & Toxicology (`/labs`)**: Destigmatized urine drug screen history, clear separation of prescribed medications (green badge) versus unexpected substances (amber badge), and certified GC/MS confirmatory values.
*   **Recovery Progress (`/records`)**: Brief Addiction Monitor (BAM) coping scores, Clinical Opiate Withdrawal Scale (COWS), safety plans, intake summaries, and clinical history.
*   **Billing & Financial Hardship (`/payments`)**: Current dues balance (`FIFObalance`), transaction receipts, active payer coverage (TennCare), and sliding-scale financial hardship assistance request form.
*   **Forms & Documents (`/documents`)**: 42 CFR Part 2 privacy consents, TCPA SMS appointment reminder opt-in, take-home agreements, and digital signing.
*   **Treatment Center (`/center`)**: Operating hours, medication window cutoffs, crisis contacts (988), and direct Google Maps navigation.
*   **Secure Messaging (`/messages`)**: Threaded messaging with primary counselor, medical provider, and financial counselor.
*   **Embedded Support Tools**:
    *   **BHG Support Assistant (`ChatbotWidget`)**: 24/7 conversational guide for portal navigation, clinic policies, and crisis escalation.
    *   **Need Help Today? (`SymptomTriagePanel`)**: Supportive crisis triage routing for cravings, withdrawal, or distress.

### **2. Clinician Portal Modules**
*   **Clinician Dashboard (`/admin-dashboard`)**: Multi-center selector (Knoxville Bernard, Knoxville Citico, Jackson TN, All Centers), key caseload metrics, daily appointment schedule, and patient request triage queue.
*   **Sessions Agenda (`/admin-appointments`)**: Daily clinical appointment agenda with status filters (Confirmed, Pending, Checked In), date range picker, pagination, real-time arrival indicator (**"Checked In"**), and visit outcome logging.
*   **My Caseload (`/admin-patients`)**: Comprehensive patient roster filterable by center, phase, and payer, with tenure tracking (days enrolled) and direct drill-down into individual patient profiles.
*   **Patient Profile Chart (`/admin-patient-profile`)**: Deep-dive clinical chart with Overview, CBT Practice (with counselor review badge & feedback block), Treatment Plan, Safety Plan, Dose History, and UDS History.
*   **CBT Homework Review & Feedback**: Interface for counselors to review patient-submitted CBT logs, mark completion, and provide written feedback displayed to the patient.
*   **Medication Visit Status & Queue (`/admin-check-ins`)**: Real-time dispensing window queue, lobby wait times, and clinical review hold management (place/release holds).
*   **UDS & Labs (`/admin-labs`)**: Caseload-wide toxicology tracking, unreviewed positive alerts, presumptive results, and lab confirmations.
*   **Clinical Progress Notes (`/admin-session-note`)**: Standardized DAP (Data, Assessment, Plan) and SOAP clinical session charting with modality toggles (In-Person vs Telehealth) and cryptographic digital signatures.
*   **Group Sessions (`/admin-group-sessions`)**: Scheduled, Completed, and Not Held group sessions, group notes modal, and per-patient attendance roster & individual progress notes.
*   **CBT Tool Library (`/admin-cbt-library`)**: Evidence-based therapeutic tools (Cognitive Restructuring, Craving Waves, Decatastrophizing, Behavioral Activation) with direct interactive modal to assign exercises to specific patients.
*   **Care Coordination (`/admin-care-coordination`)**: External PCP/psychiatric referrals, medical releases, and community support tracking.
*   **Secure Messages (`/admin-messages`)**: Clinician inquiry triage with threaded replies synced back to patient inboxes.

---

## 🔄 Cross-Portal Bi-Directional Workflows

The application models real-world clinic workflows across personas:
1.  **1-Click Waiting Room Arrival**: Patient clicks "Check In" on mobile upon arriving at the clinic &rarr; Clinician Sessions Agenda instantly shows green "Checked In" status badge & arrival timestamp.
2.  **CBT Practice & Review**: Clinician assigns CBT exercise from library &rarr; Appears in patient's Between-Session Practice &rarr; Patient completes exercise &rarr; Clinician reviews and adds feedback &rarr; Feedback callout appears on patient's treatment page.
3.  **Appointment Rescheduling**: Patient submits a rescheduling request &rarr; Clinician sees work item in Triage Queue &rarr; Clinician offers a new date/time &rarr; Patient accepts or requests another slot.
4.  **Dosing Hold Management**: Clinician or system places a hold (`tblHOLD`) &rarr; Patient is alerted to visit their counselor &rarr; Counselor conducts session and clears hold &rarr; Patient shield updates to "No Holds Active" and dispensing nurse is cleared to dose.
5.  **Secure Messaging**: Messages sent by the patient trigger unread counters in the Clinician Portal. Clinician responses surface immediately in the patient's thread.
6.  **Visit Outcomes & Missed Doses**: Clinician records visit outcomes (e.g., patient did not attend) &rarr; Automated missed-visit outreach is queued &rarr; Patient is notified of next steps.

---

## 📂 Project Structure & Documentation Hub

```text
├── BHG_DR_AZURE_SQL_INTEGRATION_PROPOSAL.md   # Executive solution proposal & client pitch for bhg_dr
├── MICROSOFT_FABRIC_MIGRATION_AND_INTEGRATION_PLAN.md # Strategic plan for Microsoft Fabric (F128) OneLake evolution
├── FABRIC_REAL_TIME_EVENTSTREAM_ARCHITECTURE.md # Two-speed Fabric architecture (Cold Batch + Hot Eventstream)
├── COMPLETE_PORTAL_DOCUMENTATION.md           # Master screen-by-screen guide & clinical rationale
├── FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md # BA requirements & SAMMS technical data dictionary
├── REQUIREMENTS.md                            # Comprehensive product & technical requirements specification
├── PROJECT_OVERVIEW.md                        # Clinical mission, architecture & platform overview
├── DATABASE_TABLE_MAPPING_GUIDE.md            # Column-by-column mapping to SAMMS production tables
├── DATA_INTEGRATION_AND_PRODUCTION_ARCHITECTURE.md # Production API gateway & EHR integration architecture
├── APPLICATION_GUIDE.md                       # Architecture & UI component guide
├── README.md                                  # Quick start, credentials & repo guide
├── Documents/
│   ├── RequiredTables.md                      # Extracted production schema (39 tables, 1,333 columns)
│   └── SAAMS-Tables.md                        # Complete catalog of all 1,906 SAMMS tables
└── packages/
    ├── frontEnd/
    │   ├── src/
    │   │   ├── components/                    # Reusable UI (Sidebar, Topbar, Chatbot, Modals)
    │   │   ├── context/                       # AppContext (Auth, routing, connected state sync)
    │   │   ├── data/                          # bhgPatientData.js (seed) & bhgDemoState.js (reactive)
    │   │   ├── pages/                         # BhgPatientPages.jsx, BhgAdminPages.jsx, Login.jsx
    │   │   ├── App.jsx                        # Application root & route configuration
    │   │   ├── bhgPortal.css                  # Design system styles & tokens
    │   │   └── index.css                      # Baseline utilities & modal animations
    │   ├── package.json
    │   └── vite.config.js
    └── backend/                               # Express API package for future backend expansion
```

---

## 🔐 Security, Privacy & Compliance (Design Intent)

*   **42 CFR Part 2 Compliance**: The portal is designed to respect federal confidentiality standards for substance use disorder records. Disclosures to external providers require explicit, unexpired digital patient consent (`dbo.ConsentToDisclosureofPatientInfo`).
*   **Role-Based Access Control**: Strict segregation between patient and clinician roles. Administrative actions (prescriber reviews, dispensing holds, visit documentation) are protected.
*   **Safe API Gateway Direction**: Production deployment will route frontend requests through a patient-safe API gateway that sanitizes internal SAMMS database keys, ensuring raw database schemas are never exposed to the client browser.
*   **Destigmatizing Terminology**: All patient-facing language adheres to modern, empathetic medical terminology to foster trust, dignity, and recovery retention.
*   **TCPA SMS Compliance**: Mandatory digital opt-in before sending automated text appointment notifications.

---

*For detailed technical specifications, page routes, and module descriptions, refer to [COMPLETE_PORTAL_DOCUMENTATION.md](COMPLETE_PORTAL_DOCUMENTATION.md) and [FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md](FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md).*
