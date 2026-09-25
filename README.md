# BHG Patient Portal

An interactive, browser-persistent proof of concept for Behavioral Health Group’s outpatient addiction-treatment domain. It includes the core **Patient Portal** experience and a companion **Clinician Interface**.

---

## 📚 Master Documentation Index

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| 💼 **[BHG_DR_AZURE_SQL_INTEGRATION_PROPOSAL.md](BHG_DR_AZURE_SQL_INTEGRATION_PROPOSAL.md)** | **Executive Solution Proposal & Pitch**: Complete client pitch and technical architecture leveraging the `bhg_dr` Azure SQL replica as the operational data tier. | **Clients, Executives, CTOs & DBAs** |
| ⚡ **[MICROSOFT_FABRIC_MIGRATION_AND_INTEGRATION_PLAN.md](MICROSOFT_FABRIC_MIGRATION_AND_INTEGRATION_PLAN.md)** | **Microsoft Fabric (F128) Evolution Strategy**: Next-generation integration architecture connecting the portal to OneLake Delta tables & SQL endpoints as `bhg_dr` offloads to Fabric. | **CIOs, CTOs, Fabric Leads & Data Architects** |
| 🔄 **[FABRIC_REAL_TIME_EVENTSTREAM_ARCHITECTURE.md](FABRIC_REAL_TIME_EVENTSTREAM_ARCHITECTURE.md)** | **Fabric Eventstream & Two-Speed Architecture**: Technical solution for 120+ clinic database scale, combining nightly batch loops with real-time CDC streaming for holds & check-ins. | **CTOs, Data Engineers & DBAs** |
| 📑 **[FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md](FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md)** | **Feature-to-Database Requirements Specification**: Complete user stories, business rules, acceptance criteria, and exact SAMMS production tables/columns (1,333 columns across 39 tables). | **BAs, Product Managers & Engineers** |
| 📋 **[REQUIREMENTS.md](REQUIREMENTS.md)** | **Product & Technical Requirements Specification**: Comprehensive system goals, RBAC definitions, module scope, and security standards. | **All Stakeholders** |
| 🏗️ **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** | **Clinical Mission & Platform Overview**: Outpatient addiction medicine context (OTP/OBOT/MAT), connected dual-portal architecture, and key workflows. | **Executive, Clinical & Technical Leads** |
| 📖 **[COMPLETE_PORTAL_DOCUMENTATION.md](COMPLETE_PORTAL_DOCUMENTATION.md)** | **Comprehensive Screen-by-Screen Guide**: Exhaustive module walkthrough detailing clinical rationale, screen states, and bi-directional reactive sync. | **Designers, Testers & Clinical Teams** |
| 🗄️ **[DATABASE_TABLE_MAPPING_GUIDE.md](DATABASE_TABLE_MAPPING_GUIDE.md)** | **Database Table Mapping Guide**: Column-by-column database mapping to SAMMS / `BHG_DR` tables. | **Database Administrators & Backend Devs** |
| 🔌 **[DATA_INTEGRATION_AND_PRODUCTION_ARCHITECTURE.md](DATA_INTEGRATION_AND_PRODUCTION_ARCHITECTURE.md)** | **Production Integration Architecture**: Safe API Gateway design, 42 CFR Part 2 redaction engine, and HL7/FHIR clearinghouse interfaces. | **Cloud Architects & DevOps** |
| 📑 **[Documents/RequiredTables.md](Documents/RequiredTables.md)** | **Production Schema Export**: Verified 39 production SAMMS tables with 1,333 columns, data types, and nullability. | **Data Engineers & DBAs** |
| 📖 **[APPLICATION_GUIDE.md](APPLICATION_GUIDE.md)** | **Application Architecture Guide**: Frontend component structure, routes, and UI design system. | **Frontend Engineers** |

---

## 👤 Patient Experience Features

* **Master Patient Demographics**: Header with legal name, enterprise identifier (`BHG-44029`), home clinic, and masked SSN (`***-**-6789`).
* **Dosing Windows & Real-Time Countdown**: Live clinic dispensing hours with active countdown timer (*"Closes in 2 hrs 14 mins"*).
* **"No Holds Active" Shield**: Proactive reassurance badge confirming no medical, counseling, or financial holds are blocking the dosing window.
* **Active Dosing Protocol & Schedule**: Full transparency on active medication (*Methadone 85 mg Oral Liquid*), 7-day schedule, and take-home bottle tier rules.
* **Counseling Visits & 1-Click Waiting Room Check-In**: View upcoming appointments, join secure Zoom telehealth sessions, submit rescheduling requests, and check in upon arrival.
* **Take-Home Bottle Schedule & Safety**: Earned bottle count (Step 3 / 2 take-homes), bottle lot IDs, lockbox safety reminders, and compliance call-back instructions.
* **Destigmatized Lab & Toxicology (UDS) Results**: Supportive lab reports clearly separating prescribed medications (green badge) from unexpected substances (amber badge), with GC/MS confirmatory values.
* **Recovery Milestones & Clinical Scores**: Longitudinal tracking of treatment phases (Induction $\to$ Stabilization $\to$ Maintenance), Brief Addiction Monitor (BAM) coping scores, and COWS scores.
* **Between-Session CBT Practice**: Interactive self-guided tools (Urge-Surfing, Decatastrophizing, Craving Waves) with visible counselor feedback callouts.
* **Billing, Copays & Financial Hardship**: Current dues balance (`FIFObalance`), transaction receipts, active payer coverage (TennCare), and in-app sliding-scale financial hardship application form.
* **Digital Consents & 42 CFR Part 2 Releases**: Cryptographic digital signing for Releases of Information (ROI), annual treatment agreements, and TCPA SMS appointment reminder opt-in.
* **Treatment Center & Emergency Care**: Clinic operating hours, medication window cutoffs, crisis contacts (988), and direct Google Maps navigation.
* **Embedded Support Tools**:
  * **24/7 BHG Support Assistant (`ChatbotWidget`)**: Conversational AI guide for portal navigation, clinic policies, and crisis escalation.
  * **"Need Help Today?" (`SymptomTriagePanel`)**: Supportive crisis triage routing for cravings, withdrawal, or distress.

---

## 🩺 Clinician Experience Features

* **Multi-Treatment Center Selector**: Seamless switching between assigned clinics (Knoxville Bernard, Knoxville Citico, Jackson TN, All Centers).
* **Clinician Dashboard & Operational KPIs**: Caseload counts, today's appointment load, unreviewed positive UDS alerts, and patient request triage queue.
* **Daily Sessions Agenda & Real-Time Waiting Room**: Daily calendar with real-time arrival indicator (**"Checked In"** in green), past session notes, and visit outcome logging (Completed, Rescheduled, No-Show).
* **My Caseload Roster & Phase Tracking**: Comprehensive patient roster filterable by center, phase, and payer, with tenure tracking (days enrolled) and direct patient chart drill-downs.
* **Comprehensive Patient Profile Chart**: Deep-dive clinical chart covering clinical overview, longitudinal UDS history, treatment plans, and dose history.
* **CBT Homework Review & Feedback**: Interface for counselors to review patient-submitted CBT logs, mark completion, and provide written feedback displayed to the patient.
* **Dispensing Window Queue Monitor**: Real-time lobby monitor showing queue ticket numbers, wait times, and dispensing status (`tblCHECKIN`).
* **Clinical Hold Management**: Modal to inspect active holds, add new holds (Medical, Counselor, Billing), and release holds with timestamped signatures (`tblHOLD`).
* **Structured Clinical Charting (DAP / SOAP Notes)**: Standardized clinical progress note documentation (`dbo.ProgressNote`) with Data, Assessment, and Plan fields, modality toggles (In-Person vs Telehealth), and digital signatures.
* **Population Lab & Toxicology Surveillance**: Caseload-wide view of all recent urine screens, highlighting unreviewed positive results for immediate clinical review.
* **Group Sessions Management**: Scheduled, Completed, and Not Held group sessions, group notes modal, and per-patient attendance roster & individual progress notes.
* **CBT Tool Library**: Evidence-based therapeutic tools with direct interactive modal to assign exercises to specific patients.
* **Care Coordination Tracking**: External PCP/psychiatric referrals, medical releases, and community support tracking.
* **Secure Messaging Triage**: Centralized clinician inbox to triage, draft, and send responses directly to patient message threads.
* **One-Click Demo Data Reset**: Restore baseline demonstration scenarios instantly from the Clinician Dashboard.

---

## 🔄 Connected Bi-Directional Workflows

The application models real-world clinic workflows across personas:
1. **Waiting Room Arrival**: Patient clicks **"Check In"** on mobile upon arriving at the clinic &rarr; Clinician Sessions Agenda instantly shows green **"Checked In"** status badge & arrival timestamp (`AppointmentAttend.aaDTENROLLED`).
2. **CBT Practice & Review**: Clinician assigns CBT exercise from library &rarr; Appears in patient's Between-Session Practice &rarr; Patient completes exercise &rarr; Clinician reviews and adds feedback &rarr; Feedback callout appears on patient's treatment page (`DraftDAPNote`).
3. **Appointment Rescheduling**: Patient submits a rescheduling request &rarr; Clinician sees work item in Triage Queue &rarr; Clinician offers a new date/time &rarr; Patient accepts or requests another slot.
4. **Dosing Hold Management**: Clinician places an administrative hold &rarr; Patient is alerted to visit their counselor &rarr; Counselor conducts session and clears hold (`hdRemoveDt = GETDATE()`) &rarr; Patient shield updates to "No Holds Active" and dispensing nurse is cleared to dose.
5. **Secure Messaging**: Messages sent by the patient trigger unread counters in the Clinician Portal. Clinician responses surface immediately in the patient's thread.
6. **Visit Outcomes & Missed Doses**: Clinician records visit outcomes (e.g., patient did not attend) &rarr; Automated missed-visit outreach is queued &rarr; Patient is notified of next steps.

---

## 💻 Tech Stack

- **Framework**: React 18 (Functional components, hooks, custom context)
- **Tooling**: Vite 5 (Fast ESM development server, rollup production bundles)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Design System**: Vanilla CSS tokens (`bhgPortal.css`, `index.css`, `theme.css`)
- **Data Layer**:
  - Rich Seed Data: `packages/frontEnd/src/data/bhgPatientData.js`
  - Persistent Reactive State: `packages/frontEnd/src/data/bhgDemoState.js` (localStorage v5)

---

## 🚀 Running Locally

```bash
cd packages/frontEnd
npm install
npm run dev
```

Open:
`http://localhost:5174/bhg-patientportal/`

### Demo Credentials
- **Patient**: `patient@demo.com`
- **Clinician**: `admin@demo.com`
- **Password**: `Password123`

---

## 🔐 Production Integration & Architecture

Production deployment routes frontend requests through a patient-safe API gateway. Raw SAMMS tables are never exposed directly to the browser.

```text
┌────────────────────────────────────────────────────────┐
│                   BHG Patient Portal                   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / JWT
                            ▼
┌────────────────────────────────────────────────────────┐
│          Patient-Safe API & Authorization Layer        │
│    • 42 CFR Part 2 Consent Engine   • HL7/FHIR Engine  │
└───────────────────────────┬────────────────────────────┘
                            │ Read Replicas / Safe Views
                            ▼
┌────────────────────────────────────────────────────────┐
│             SAMMS Production Database (BHG_DR)         │
└────────────────────────────────────────────────────────┘
```

Before production go-live, stakeholders validate medication visibility, take-home language, destigmatized UDS presentation, hold communication, 42 CFR Part 2 consent forms, and SAMMS field mappings as detailed in [FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md](FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md).
