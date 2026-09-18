# BHG Connected Care Portal — Project Overview

This document provides a comprehensive overview of the **BHG Connected Care Portal**, including its clinical mission, dual-portal architecture, core features, connected state engine, and technical implementation details.

---

## 🏥 Clinical Mission & Domain Context

Behavioral Health Group (BHG) is a leading provider of outpatient addiction medicine, specializing in **Opioid Treatment Programs (OTP)**, **Office-Based Opioid Treatment (OBOT)**, and **Intensive Outpatient Programs (IOP)** utilizing **Medication-Assisted Treatment (MAT)** (e.g., Methadone, Buprenorphine/Suboxone, Naltrexone/Vivitrol).

Unlike generic outpatient clinics, outpatient addiction treatment requires coordinated daily logistics:
- **Strict Dispensing Windows**: Daily clinic dosing hours that patients must adhere to.
- **Take-Home Bottle Steps**: Regulated take-home bottle privileges earned through clinical stability, along with compliance call-back protocols.
- **Destigmatized Toxicology Tracking**: Random urine drug screens (UDS) presented with supportive, non-punitive clinical framing (*"consistent/inconsistent"* rather than *"clean/dirty"*).
- **Between-Session Behavioral Engagement**: Cognitive Behavioral Therapy (CBT) coping exercises and craving tracking between counseling sessions.
- **Multidisciplinary Caseload Management**: Unified coordination across counselors, medical providers, and financial counselors.
- **42 CFR Part 2 Confidentiality**: Strict federal privacy safeguards governing substance use disorder treatment records.

The **BHG Connected Care Portal** addresses these unique requirements through a synchronized **Patient Portal** and **Clinician Portal** platform.

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
┌─────────────────────────────────────────────────────────────┐
│                 Client Browser Layer (SPA)                  │
├──────────────────────────────┬──────────────────────────────┤
│      Patient Experience      │     Clinician Experience     │
│  - Dosing Windows & Bottles  │  - Caseload & Agenda Views   │
│  - Visits & Zoom Links       │  - Group Sessions & Notes    │
│  - CBT Practice & Feedback   │  - CBT Tool Library Assign   │
│  - Destigmatized Lab/UDS     │  - Medication Window Queue   │
│  - 24/7 AI Support Assistant │  - Triage Work Items Queue   │
├──────────────────────────────┴──────────────────────────────┤
│                     Central AppContext                      │
│        - Session & Role Routing (Patient vs Admin)          │
│        - Bi-directional State Sync (localStorage v5)        │
├─────────────────────────────────────────────────────────────┤
│                     Data & Domain Layer                     │
│        - bhgPatientData.js (Rich Clinical Seed Data)        │
│        - bhgDemoState.js (Persistent Reactive State)        │
└─────────────────────────────────────────────────────────────┘
```

1.  **Provider Layer (`AppProvider`)**: Wraps the application to manage session authentication, active treatment center filtering, notifications, toasts, and bi-directional reactive workflows.
2.  **Routing Layer (`AppRoutes`)**: Renders patient pages or clinician pages based on the authenticated persona (`userRole === 'admin'` vs `'patient'`).
3.  **Connected Persistence Layer (`bhgDemoState.js`)**: All patient requests, appointment offers, visit outcomes, CBT assignments, and messages persist in `localStorage` under `bhg-connected-demo-state-v5`. Changes made in one portal reflect immediately in the other.

---

## ✨ Key Features & Modules

### **1. Patient Portal Modules**
*   **Dashboard (`/dashboard`)**: Daily medication window countdown, treatment stage badge, required actions, and activity timeline.
*   **My Treatment (`/treatment`)**: Active prescription details, care team contacts, recovery milestones, and **Between-Session CBT Practice & Coping Exercises** with counselor review feedback callouts.
*   **Medication Schedule (`/medication`)**: 7-day dispensing schedule, take-home tier progression rules, compliance call-back guidance, and guided missed-dose reporting.
*   **Visits & Appointments (`/appointments`)**: Upcoming clinical sessions, secure Zoom telehealth links, appointment rescheduling requests, and interactive offer acceptance banners.
*   **Lab & Toxicology (`/labs`)**: Destigmatized urine drug screen history, presumptive vs. confirmatory test explanations, and collection guidelines.
*   **My Records (`/records`)**: Brief Addiction Monitor (BAM) scores, safety plans, intake summaries, and clinical history.
*   **Treatment Center (`/center`)**: Hours, medication window cutoffs, crisis contacts (988), and direct Google Maps navigation.
*   **Secure Messaging (`/messages`)**: Threaded messaging with primary counselor, medical provider, and financial counselor.
*   **Forms & Documents (`/documents`)**: 42 CFR Part 2 privacy consents, take-home agreements, and digital signing.
*   **Coverage & Billing (`/payments`)**: Medicaid/commercial coverage, statements, and financial assistance request workflow.
*   **Embedded Support Tools**:
    *   **BHG Support Assistant (`ChatbotWidget`)**: 24/7 conversational guide for portal navigation and crisis escalation.
    *   **Need Help Today? (`SymptomTriagePanel`)**: Supportive crisis triage routing for cravings, withdrawal, or distress.

### **2. Clinician Portal Modules**
*   **Clinician Dashboard (`/admin-dashboard`)**: Multi-center selector (Knoxville Bernard, Knoxville Citico, Jackson TN, All Centers), key metrics, daily appointment schedule, and patient request triage queue.
*   **Sessions Agenda (`/admin-appointments`)**: Daily clinical appointment agenda with status filters (Confirmed, Pending, Checked In), date range picker, pagination, previous appointment summaries, and visit outcome logging.
*   **My Caseload (`/admin-patients`)**: Comprehensive patient roster filterable by center, phase, and payer, with direct drill-down into individual patient profiles.
*   **Patient Profile Chart (`/admin-patient-profile`)**: Deep-dive clinical chart with Overview, CBT Practice (with counselor review badge & feedback block), Treatment Plan, Safety Plan, Dose History, and UDS History.
*   **Group Sessions (`/admin-group-sessions`)**: Scheduled, Completed, and Not Held group sessions, group notes modal, and per-patient attendance roster & individual progress notes.
*   **CBT Tool Library (`/admin-cbt-library`)**: Evidence-based therapeutic tools (Cognitive Restructuring, Craving Waves, Decatastrophizing, Behavioral Activation) with direct interactive modal to assign exercises to specific patients.
*   **Care Coordination (`/admin-care-coordination`)**: External PCP/psychiatric referrals, medical releases, and community support tracking.
*   **Medication Visit Status (`/admin-check-ins`)**: Real-time dispensing window queue, nurse check-ins, and clinical review holds.
*   **UDS & Labs (`/admin-labs`)**: Caseload-wide toxicology tracking, presumptive results, and lab confirmations.
*   **Secure Messages (`/admin-messages`)**: Clinician inquiry triage with threaded replies synced back to patient inboxes.

---

## 🔄 Cross-Portal Bi-Directional Workflows

The application models real-world clinic workflows across personas:
1.  **Secure Messaging**: Messages sent by the patient trigger unread counters in the Clinician Portal. Clinician responses surface immediately in the patient's thread.
2.  **Appointment Rescheduling**: Patient submits a rescheduling request &rarr; Clinician sees work item &rarr; Clinician offers a new date/time &rarr; Patient accepts or requests another slot.
3.  **CBT Practice & Review**: Clinician assigns CBT exercise from library &rarr; Appears in patient's Between-Session Practice &rarr; Patient completes exercise &rarr; Clinician reviews and adds feedback &rarr; Feedback callout appears on patient's treatment page.
4.  **Visit Outcomes & Missed Doses**: Clinician records visit outcomes (e.g., patient did not attend) &rarr; Automated missed-visit outreach is queued &rarr; Patient is notified of next steps.

---

## 📂 Project Structure

```text
├── APPLICATION_GUIDE.md     # In-depth architectural & module guide
├── PROJECT_OVERVIEW.md      # Platform overview & clinical mission
├── README.md                # Quick start, demo credentials & stack
├── docs/
│   └── PATIENT_PORTAL_DEMO_SCRIPT.md # Demonstration walk-through script
└── packages/
    ├── frontEnd/
    │   ├── src/
    │   │   ├── components/  # Reusable UI (Sidebar, Topbar, Chatbot, Modals)
    │   │   ├── context/     # AppContext (Auth, routing, connected state sync)
    │   │   ├── data/        # bhgPatientData.js (seed) & bhgDemoState.js (reactive)
    │   │   ├── pages/       # BhgPatientPages.jsx, BhgAdminPages.jsx, Login.jsx
    │   │   ├── App.jsx      # Application root & route configuration
    │   │   ├── bhgPortal.css# Design system styles & tokens
    │   │   └── index.css    # Baseline utilities & modal animations
    │   ├── package.json
    │   └── vite.config.js
    └── backend/             # Express API package for future backend expansion
```

---

## 🔐 Security, Privacy & Compliance (Design Intent)

*   **42 CFR Part 2 Compliance**: The portal is designed to respect federal confidentiality standards for substance use disorder records. Disclosures to external providers require explicit, granular patient consent.
*   **Role-Based Access Control**: Strict segregation between patient and clinician roles. Administrative actions (prescriber reviews, dispensing holds, visit documentation) are protected.
*   **Safe API Gateway Direction**: Production deployment will route frontend requests through a patient-safe API gateway that sanitizes internal SAMMS database keys, ensuring raw database schemas are never exposed to the client browser.
*   **Destigmatizing Terminology**: All patient-facing language adheres to modern, empathetic medical terminology to foster trust, dignity, and recovery retention.

---

*For detailed technical specifications, page routes, and module descriptions, refer to [APPLICATION_GUIDE.md](APPLICATION_GUIDE.md).*
