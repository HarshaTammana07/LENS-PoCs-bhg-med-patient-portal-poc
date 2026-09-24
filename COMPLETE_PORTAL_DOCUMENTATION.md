# BHG Patient Portal — Complete System & Architectural Documentation

Welcome to the comprehensive, end-to-end documentation for the **Behavioral Health Group (BHG) Patient Portal** (and its companion Clinician Interface). This document provides an exhaustive breakdown of every single screen, user flow, clinical rationale ("why this exists"), and the bi-directional state synchronization connecting the **Patient Portal** and the **Clinician Portal**.

---

## Table of Contents
1. [Executive Summary & Clinical Mission](#1-executive-summary--clinical-mission)
2. [Dual-Portal Architecture & Bi-Directional State Engine](#2-dual-portal-architecture--bi-directional-state-engine)
3. [Authentication, Login & Account Recovery](#3-authentication-login--account-recovery)
4. [Patient Portal — Detailed Screen-by-Screen Walkthrough](#4-patient-portal--detailed-screen-by-screen-walkthrough)
   - 4.1 [Dashboard (Home)](#41-dashboard-home)
   - 4.2 [Recovery Progress & Milestones](#42-recovery-progress--milestones)
   - 4.3 [My Treatment & CBT Coping Practice](#43-my-treatment--cbt-coping-practice)
   - 4.4 [Medication Schedule & Take-Home Protocol](#44-medication-schedule--take-home-protocol)
   - 4.5 [Visits & Clinical Appointments](#45-visits--clinical-appointments)
   - 4.6 [Lab & Toxicology (UDS)](#46-lab--toxicology-uds)
   - 4.7 [My Records & Clinical History](#47-my-records--clinical-history)
   - 4.8 [Treatment Center & Directions](#48-treatment-center--directions)
   - 4.9 [Secure Messaging & Voice Notes](#49-secure-messaging--voice-notes)
   - 4.10 [Forms, Consents & Documents (42 CFR Part 2)](#410-forms-consents--documents-42-cfr-part-2)
   - 4.11 [Coverage, Payments & Financial Assistance](#411-coverage-payments--financial-assistance)
   - 4.12 [Profile, Privacy & Notification Preferences](#412-profile-privacy--notification-preferences)
   - 4.13 [Global Features (Notification Bell, AI Chatbot, Crisis Drawer)](#413-global-features)
5. [Clinician Portal — Detailed Screen-by-Screen Walkthrough](#5-clinician-portal--detailed-screen-by-screen-walkthrough)
   - 5.1 [Clinician Dashboard](#51-clinician-dashboard)
   - 5.2 [Sessions & Appointments Agenda](#52-sessions--appointments-agenda)
   - 5.3 [My Caseload](#53-my-caseload)
   - 5.4 [Patient Profile & Charting](#54-patient-profile--charting)
   - 5.5 [Secure Messages & Request Triage Queue](#55-secure-messages--request-triage-queue)
   - 5.6 [Group Sessions Management](#56-group-sessions-management)
   - 5.7 [CBT Tool Library & Active Assignment](#57-cbt-tool-library--active-assignment)
   - 5.8 [Care Coordination & Referrals](#58-care-coordination--referrals)
   - 5.9 [Medication Visit Status & Dispensing Queue](#59-medication-visit-status--dispensing-queue)
   - 5.10 [UDS & Lab Tracking](#510-uds--lab-tracking)
   - 5.11 [Clinical Documentation (Session Notes)](#511-clinical-documentation-session-notes)
6. [The "To-and-Fro" Connection Engine (Patient ↔ Clinician Matrix)](#6-the-to-and-fro-connection-engine-patient--clinician-matrix)
7. [Regulatory Compliance & Clinical Buzzwords (42 CFR Part 2, SAMHSA, ASAM)](#7-regulatory-compliance--clinical-buzzwords)

---

## 1. Executive Summary & Clinical Mission

### The Challenge in Outpatient Addiction Medicine
Standard healthcare electronic health records (EHRs) and patient portals are built for episodic primary care (e.g., annual physicals or flu visits). They fail dramatically in **Opioid Treatment Programs (OTP)** and **Office-Based Opioid Treatment (OBOT)** environments, where patients face strict operational rules:
1. **Daily Dispensing Windows**: Patients must dose during narrow morning hours. Arriving 5 minutes late means missing medication.
2. **Dispensing Holds**: Missing consecutive doses, needing medical reviews, or unpaid co-pays can trigger clinic holds, creating extreme anxiety.
3. **Regulated Take-Home Steps**: Take-home privileges are heavily regulated by federal SAMHSA and state laws based on time-in-treatment, negative UDS, and counseling compliance.
4. **Mandatory Counseling & Group Therapy**: Attendance is legally required to maintain medication privileges.
5. **Strict Federal Privacy (42 CFR Part 2)**: Substance use disorder records carry criminal penalties for unauthorized disclosure, requiring stricter protections than HIPAA.

### The Connected Solution
The **BHG Patient Portal** bridges this divide by providing:
- Supportive, destigmatized transparency for patients.
- Operational command, triage, and compliance tracking for clinicians.
- A **real-time bi-directional connection** between the patient and their care team.

---

## 2. Dual-Portal Architecture & Bi-Directional State Engine

The platform operates as a unified single-page React 18 application powered by Vite 5 and React Router DOM v6.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             React 18 Architecture                           │
│                (Vite 5 Tooling + React Router DOM v6 Client Routing)        │
├──────────────────────────────────────┬──────────────────────────────────────┤
│          Patient Portal              │           Clinician Portal           │
│   (Empathetic, Clear, Mobile-First)   │    (Command Center, Triage, Chart)   │
├──────────────────────────────────────┴──────────────────────────────────────┤
│                             Central AppContext                              │
│       - Role Authentication & Switching (Patient vs Clinician)              │
│       - Event Dispatcher & Toast Notification Pipeline                      │
│       - Bi-Directional Reactive Sync Engine (localStorage v5)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                          Domain & Seed Architecture                         │
│       - bhgPatientData.js (Clinical Seed Models & Dynamic Date Engine)       │
│       - bhgDemoState.js (Persistent Reactive State & Thread Stores)         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dynamic Date Architecture
All medication calendars, check-in alerts, counseling visits, and notification timestamps calculate **dynamically relative to the current day** (`new Date()`). When the portal is demonstrated today, tomorrow, or next year, it always displays the current week's timeline without stale hardcoded dates.

---

## 3. Authentication, Login & Account Recovery

### Screen Overview
The entry point (`/login`) introduces the portal with BHG branding, secure login credentials, and one-click demo persona chips.

```
┌─────────────────────────────────────────────────────────────┐
│                    BHG Behavioral Health Group              │
│                           Patient Portal                    │
│                                                             │
│  [ Email Address ]                                          │
│  [ Password ]                                 [ Show/Hide ] │
│                                                             │
│  [ Forgot Password? ]                                       │
│                                                             │
│  [ 🔑 Sign In Button ]                                      │
│                                                             │
│  ── Demo Persona Shortcuts ───────────────────────────────  │
│  [ 👤 Patient: Jordan Williams ]   [ 🩺 Clinician: Morgan ] │
└─────────────────────────────────────────────────────────────┘
```

### Key Elements & Clinical Rationale:
1. **Demo Persona Chips**:
   - *What it is*: One-click buttons that auto-fill credentials for `patient@demo.com` or `admin@demo.com`.
   - *Why we kept this*: Allows instant demonstration during presentations without typing passwords.
2. **Forgot Password Workflow**:
   - *What it is*: Opens a password recovery dialog with clear instructions.
   - *Why we kept this*: Outpatient SUD patients frequently experience phone or email turnover. Providing an in-portal recovery channel with clinic helpline routing prevents patients from being locked out of urgent visit information.
3. **Role-Based Routing**:
   - Patients authenticate and land at `/dashboard`.
   - Clinicians authenticate and land at `/admin-dashboard`.
   - Session states persist securely in `localStorage` under `bhg-portal-session-v4`.

---

## 4. Patient Portal — Detailed Screen-by-Screen Walkthrough

---

### 4.1 Dashboard (Home)
- **Route**: `/dashboard`
- **Clinical Role**: Morning briefing for the patient.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Monday, September 21                                  [ Need help today? ]│
│ Good morning, Jordan                                  [ Message care team]│
├───────────────────────────────────────────────────────────────────────────┤
│ 📍 BHG Knoxville Bernard   [ Open Today ]   Window: 5:30 AM – 11:30 AM    │
├───────────────────────────────────────────────────────────────────────────┤
│ 💊 TODAY'S MEDICATION VISIT                                               │
│    Arrive before 11:30 AM                              [ View Schedule → ]│
│    ✓ No holds active  •  Clinic: Mon, Sat  •  Take-home: Tue, Wed         │
├───────────────────────────────────┬───────────────────────────────────────┤
│ 📅 Next Counseling Visit [Check In]│ 🧪 Lab & UDS: Ready to review        │
│    SEP 21 • 10:30 AM • In person  │    Routine screen • Private review    │
├───────────────────────────────────┴───────────────────────────────────────┤
│ ⏳ LATEST REQUEST: Reschedule Individual Counseling                       │
│    Status: Sent to your care team (Pending clinic review)                 │
├───────────────────────────────────────────────────────────────────────────┤
│ 🏆 184 Days in Recovery (Stabilization Achieved • 2 Weekly Take-Homes)    │
│    [ MON: In-Person ] [ TUE: Take-Home ] [ WED: Take-Home ] [ SAT: Clinic]│
└───────────────────────────────────────────────────────────────────────────┘
```

#### What We Kept & Why:
* **"No Holds Active" Indicator**:
  * *Why*: In OTP clinics, a "hold" stops dispensing until the patient sees a doctor, counselor, or billing. Patients experience intense anxiety wondering if they will get dosed. Seeing "No Holds Active" confirms they are cleared before leaving home.
* **Medication Window Countdown**:
  * *Why*: Dosing windows are legally strict (e.g., 5:30–11:30 AM). Highlighting the arrival deadline prevents missed doses.
* **Counseling Self Check-In**:
  * *Why*: Patients can click **Check In** directly on the dashboard. A confirmation modal verifies arrival, notifies the front desk, and fires a confirmation toast. In production, this unlocks 60 minutes prior to session time.
* **Latest Request Strip**:
  * *Why*: Eliminates the "black hole" anxiety of submitting requests. Shows real-time progress (Submitted → Under Review → Approved).
* **Center Status Banner**:
  * *Why*: Displays live open hours, directions via Google Maps, phone number, and weather delay alerts.

---

### 4.2 Recovery Progress & Milestones
- **Route**: `/progress`
- **Clinical Role**: Motivation, milestone celebration, and take-home privilege transparency.

#### What We Kept & Why:
* **The 4 Phases of OTP Recovery**:
  1. *Induction (Days 1–14)*: Medical stabilization and dose titration.
  2. *Stabilization (Months 1–6)*: Routine adherence, 2 weekly take-homes (Jordan is at Day 184).
  3. *Maintenance (Months 6+)*: Long-term recovery, up to 6 or 13 take-home bottles.
  4. *Medically Supervised Withdrawal / Discharge*: Voluntary tapering or completion.
  * *Why*: Demystifies the treatment trajectory and shows the patient exactly where they stand.
* **Take-Home Bottle Eligibility Meter**:
  * *Why*: Take-homes are the primary behavioral incentive in OTP care. Clear progress bars motivate patients to maintain negative screens and session attendance.
* **Milestone Badges (30, 60, 90, 180 Days)**:
  * *Why*: Celebrating small wins reinforces self-efficacy and drastically reduces dropout rates.

---

### 4.3 My Treatment & CBT Coping Practice
- **Route**: `/treatment`
- **Clinical Role**: Between-session clinical homework and therapy skill practice.

#### What We Kept & Why:
* **Interactive CBT Thought Records**:
  * *What it is*: 3-column exercises identifying Triggers, Automatic Thoughts, Cognitive Distortions, and Rational Responses.
  * *Why*: Relapse prevention requires cognitive reframing outside the therapy hour.
* **Urge Surfing & Craving Waves (Marlatt Protocol)**:
  * *What it is*: Guided mindfulness technique teaching patients that cravings peak within 10–15 minutes and naturally subside like ocean waves.
  * *Why*: Provides immediate, evidence-based coping tools during acute craving episodes.
* **Counselor Feedback Block**:
  * *What it is*: Displays written counselor feedback (e.g., *"Great job recognizing catastrophizing traps, Jordan!"*).
  * *Why*: Validates patient effort and keeps the patient accountable.

---

### 4.4 Medication Schedule & Take-Home Protocol
- **Route**: `/medication`
- **Clinical Role**: Compliance tracking and safety education.

#### What We Kept & Why:
* **Weekly Dosing Routine**:
  * *Clinic Observed Days*: Monday & Saturday.
  * *Approved Take-Home Days*: Tuesday & Wednesday.
  * *Why*: Clear scheduling avoids confusion over when to take medication at home vs. reporting to the clinic.
* **Lockbox Storage Rules**:
  * *Why*: Federal law mandates take-home methadone be stored in a locked container to prevent accidental child ingestion and diversion.
* **Bottle Return & Call-Back Notice**:
  * *Why*: Patients must return empty bottles with matching serial numbers. Failure to do so can revoke take-home privileges.

---

### 4.5 Visits & Clinical Appointments
- **Route**: `/appointments`
- **Clinical Role**: Scheduling transparency and telehealth access.

#### What We Kept & Why:
* **1-Click Telehealth / Zoom Launch**:
  * *Why*: Patients in recovery often experience transit barriers. Virtual visits feature a prominent **Join Video** button that launches sessions without digging through email.
* **Interactive Appointment Reschedule Proposals**:
  * *Why*: When a counselor offers a new time, an interactive card lets the patient click **Accept** or **Request Another Time**, eliminating telephone tag.
* **Shared Session Summaries**:
  * *Why*: Patients can review agreed-upon action plans from past visits without exposing raw clinical SOAP/DAP chart notes.

---

### 4.6 Lab & Toxicology (UDS)
- **Route**: `/labs`
- **Clinical Role**: De-stigmatized lab progress tracking.

#### What We Kept & Why:
* **Supportive Language ("Ready to Review")**:
  * *Why*: Showing raw metabolite numbers or blunt "Positive/Negative" labels causes panic. The portal displays step progress (*Collected → Processing → Ready for Review*) and notes: *"Your counselor will review this privately with you at your next session."*
* **Presumptive Screen vs. Confirmatory GC/MS**:
  * *Why*: Explains that clinic point-of-care rapid cups can produce false positives that require confirmation by certified toxicological gas chromatography/mass spectrometry (GC/MS).
* **42 CFR Part 2 Privacy Protection Notice**:
  * *Why*: Guarantees to the patient that drug screen records are never shared with employers, courts, or law enforcement without explicit consent.

---

### 4.7 My Records & Clinical History
- **Route**: `/records`
- **Clinical Role**: Patient empowerment and secure record transparency.

#### What We Kept & Why:
* **Official Treatment Summary**:
  * *Why*: Patients often need proof of treatment for court compliance, probation, employers, or medical physicians.
* **Official Records Request Workflow**:
  * *Why*: Allows patients to request formal medical records releases with documented recipient verification.

---

### 4.8 Treatment Center & Directions
- **Route**: `/center`
- **Clinical Role**: Clinic logistics, emergencies, and mobility support.

#### What We Kept & Why:
* **Permanent Center Transfer Request**:
  * *Why*: When a patient moves across town or to another state, they can request a seamless transfer between BHG facilities without interrupting daily dosing.
* **Guest Dosing Request (Travel / Temporary)**:
  * *Why*: If traveling for family or work, the patient requests temporary dosing at a partner clinic, and medical orders are transmitted ahead of time.
* **Live Weather Delay & Emergency Broadcasts**:
  * *Why*: Severe weather notifications (e.g., flash flooding delays opening to 6:30 AM) appear immediately on the clinic schedule strip.

---

### 4.9 Secure Messaging & Voice Notes
- **Route**: `/messages`
- **Clinical Role**: Direct, accessible care communication.

#### What We Kept & Why:
* **Encrypted Bi-Directional Messaging**:
  * *Why*: Direct access to primary counselor Alicia Monroe without waiting on hold on the general clinic phone line.
* **Native Voice Messaging Console**:
  * *What it is*: A full audio voice recorder featuring live recording timer, pulsating recording dot, animated audio waveform, cancel/send actions, and automated AI transcription.
  * *Why*: **Crucial accessibility feature.** Many patients in recovery struggle with hand tremors, dyslexia, walking to work, or low literacy. Voice notes allow them to speak freely, while clinicians can read the AI transcript or listen to the audio directly.

---

### 4.10 Forms, Consents & Documents (42 CFR Part 2)
- **Route**: `/documents`
- **Clinical Role**: Legal compliance and patient rights.

#### What We Kept & Why:
* **Digital 42 CFR Part 2 Disclosures**:
  * *Why*: Outlines federal regulations protecting SUD treatment records from unauthorized subpoena or redisclosure.
* **Annual Treatment Agreement E-Signing**:
  * *Why*: Allows annual re-consents to be acknowledged digitally with timestamped audit logs.

---

### 4.11 Coverage, Payments & Financial Assistance
- **Route**: `/payments`
- **Clinical Role**: Financial transparency and avoiding administrative holds.

#### What We Kept & Why:
* **Insurance Card Photo Upload (Front & Back)**:
  * *Why*: Lapsed Medicaid/TennCare authorizations cause immediate dosing holds. Patients can snap and upload card photos to ensure billing continuity.
* **Direct Self-Service Dues Payment**:
  * *Why*: Patients can pay their outstanding daily medication co-pays or counseling balances online with credit/debit/HSA cards, bypassing front-desk payment lines.
* **Financial Hardship Assistance Requests**:
  * *Why*: Patients experiencing job loss or financial crisis can submit hardship requests directly through the portal for sliding-fee evaluations.

---

### 4.12 Profile, Privacy & Notification Preferences
- **Route**: `/profile`
- **Clinical Role**: Identity management and communication safety.

#### What We Kept & Why:
* **Emergency Contact Management**:
  * *Why*: Critical for safety planning and crisis outreach.
* **Notification Preferences (SMS, Email, Push)**:
  * *Why*: Patients can choose discreet reminders to protect their recovery privacy from family members or roommates sharing devices.

---

### 4.13 Global Features

#### Notification Bell with Scrollable Popover:
- *What it is*: Top header icon showing unread count badges. Clicking opens a compact popover grouping appointment reminders, UDS review notices, and care team messages.
- *Why*: Keeps important action items accessible from any page in the portal.

#### 24/7 AI BHG Support Assistant (Chatbot Widget):
- *What it is*: Interactive chat bubble in the bottom right corner.
- *Why*: Provides instant 24/7 answers to common clinic questions (dispensing hours, lockbox rules, holiday schedules, missed-dose policies) without waiting on hold.

#### "Need Help Today?" / Crisis Triage Drawer:
- *What it is*: Prominent button in the top header opening immediate access to:
  - **988 Suicide & Crisis Lifeline** (Call or Text 24/7).
  - **SAMHSA National Helpline** (`1-800-662-4357`).
  - Clinic local crisis line and direct clinic dispatch.
- *Why*: Patient safety is always paramount in addiction treatment. Immediate crisis help must be 1 click away from every screen.

---

## 5. Clinician Portal — Detailed Screen-by-Screen Walkthrough

---

### 5.1 Clinician Dashboard
- **Route**: `/admin-dashboard`
- **Clinical Role**: Counselor morning command center.

#### What We Kept & Why:
* **Multi-Treatment Center Switcher**:
  * *Options*: *Knoxville Bernard*, *Knoxville Citico*, *Jackson TN*, or *All Centers*.
  * *Why*: Clinical directors and floating counselors oversee patients across multiple regional BHG clinics.
* **Caseload KPI Summary**:
  * *Metrics*: Active patients, today's scheduled visits, unreviewed CBT homework, and pending patient triage requests.
* **Incoming Patient Request Triage Queue**:
  * *Why*: Displays requests submitted from the patient portal (e.g., reschedule requests, medication questions, transit needs) for rapid staff resolution.
* **One-Click Demo Reset**:
  * *Why*: Allows presenters to reset mock data back to its default clean baseline at any time.

---

### 5.2 Sessions & Appointments Agenda
- **Route**: `/admin-counseling`
- **Clinical Role**: Daily schedule and outcome logging.

#### What We Kept & Why:
* **Filterable Agenda**:
  * Filter by date range, provider, or visit status (*Confirmed, Pending, Checked In*).
* **Previous Session Summary Popovers**:
  * *Why*: Clinicians can view notes from the patient's last visit before entering the room.
* **Record Visit Outcome Workflow**:
  * *Why*: Clinicians mark sessions as *Completed* or *Did Not Attend*. Marking a no-show automatically triggers missed-visit outreach to the patient.

---

### 5.3 My Caseload
- **Route**: `/admin-patients`
- **Clinical Role**: Longitudinal patient tracking.

#### What We Kept & Why:
* **Phase & Retention Tracking**:
  * Shows patient treatment phase (*Induction, Stabilization, Maintenance*), days enrolled, and take-home bottle tiers.
* **Alert Badges**:
  * Flags patients due for treatment plan reviews, missing UDS screens, or overdue paperwork.

---

### 5.4 Patient Profile & Charting
- **Route**: `/admin-patients/:id`
- **Clinical Role**: In-depth clinical drill-down.

#### What We Kept & Why:
* **CBT Practice Review & Counselor Feedback**:
  * Clinicians read thought records and urge-surfing logs submitted by the patient and write personalized feedback that immediately displays in the patient's portal.
* **Toxicology History**:
  * Full logs of random presumptive and confirmatory lab screens.

---

### 5.5 Secure Messages & Request Triage Queue
- **Route**: `/admin-messages`
- **Clinical Role**: Patient outreach and request management.

#### What We Kept & Why:
* **Unified Patient Messaging**:
  * Clinicians can reply via text or record return voice messages.
* **Voice Note Audio Player with Waveform**:
  * Plays patient audio recordings and displays AI transcriptions for quick reading.

---

### 5.6 Group Sessions Management
- **Route**: `/admin-group-sessions`
- **Clinical Role**: Group therapy cohort documentation.

#### What We Kept & Why:
* **Roster Attendance Logging**:
  * Mark cohort members as *Present, Absent, or Excused*.
* **Batch Clinical Notes**:
  * Generates individualized progress notes for all attendees while preserving group confidentiality.

---

### 5.7 CBT Tool Library & Active Assignment
- **Route**: `/admin-cbt-library`
- **Clinical Role**: Evidence-based exercise provisioning.

#### What We Kept & Why:
* **Direct Caseload Assignment**:
  * Clinicians select an exercise (e.g., *Marlatt Craving Wave*, *Decatastrophizing*, *Social Trigger Mapping*) and assign it to Jordan Williams. It instantly populates in Jordan's portal.

---

### 5.8 Care Coordination & Referrals
- **Route**: `/admin-care-coordination`
- **Clinical Role**: Whole-person community care.

#### What We Kept & Why:
* **Outside Medical & Social Referrals**:
  * Tracks referrals to primary care, housing assistance, hepatitis C treatment, and legal aid.

---

### 5.9 Medication Visit Status & Dispensing Queue
- **Route**: `/admin-check-ins`
- **Clinical Role**: Dosing window monitoring.

#### What We Kept & Why:
* **Dispensing Window Queue**:
  * Real-time monitoring of patients checked in at the dosing window.
* **Clinical Review Holds**:
  * Clinicians can place or release clinical flags before the nurse administers medication.

---

### 5.10 UDS & Lab Tracking
- **Route**: `/admin-labs`
- **Clinical Role**: Toxicology compliance and safety monitoring.

#### What We Kept & Why:
* **Point-of-Care Rapid Screens vs. Lab Confirmatory GC/MS**:
  * Logs presumptive panel results alongside certified laboratory confirmations.

---

### 5.11 Clinical Documentation (Session Notes)
- **Route**: `/admin-session-note`
- **Clinical Role**: Structured clinical charting.

#### What We Kept & Why:
* **DAP / SOAP Clinical Note Templates**:
  * Standardized Data, Assessment, and Plan documentation aligned with ASAM and CARF accreditation standards.

---

## 6. The "To-and-Fro" Connection Engine (Patient ↔ Clinician Matrix)

The core innovation of the **BHG Patient Portal** is its real-time bi-directional data flow with the clinician:

| # | Patient Action in Patient Portal | Immediate Clinician Reflection in Clinician Portal |
|---|---|---|
| **1** | Patient sends a text or **Voice Note** to Alicia Monroe. | Message arrives in Clinician Inbox (`CM-502`) with audio player & AI transcription. |
| **2** | Patient submits an **Appointment Reschedule Request**. | Request appears in Clinician **Triage Queue** on the Clinician Dashboard. |
| **3** | Patient completes an **Urge Surfing / CBT Thought Record**. | Submission populates in Patient Chart under **CBT Practice Review**. |
| **4** | Patient clicks **Check In** for counseling visit. | Appointment status changes to **Checked In** on the Clinician Daily Agenda. |
| **5** | Patient uploads new **Insurance Card Photos**. | Billing notification appears in clinic administrative work items. |
| **6** | Patient submits a **Guest Dosing / Relocation Transfer**. | Transfer packet request routes to clinic director for medical sign-off. |

| # | Clinician Action in Clinician Portal | Immediate Patient Reflection in Patient Portal |
|---|---|---|
| **1** | Clinician replies to message or records return voice note. | Message & audio bubble appear in Patient Inbox (`MSG-301`). |
| **2** | Clinician assigns an exercise from **CBT Tool Library**. | Exercise appears in Patient Portal under **Between-Session Practice**. |
| **3** | Clinician writes **Feedback** on completed CBT homework. | Highlighted feedback banner displays directly beneath patient exercise. |
| **4** | Clinician proposes a **Rescheduled Session Time**. | Interactive proposal card appears in Visits page with **Accept** / **Decline**. |
| **5** | Clinician records **Session Outcome** (*Completed*). | Patient receives milestone credit and updated visit notes summary. |
| **6** | Clinician clears a **Clinical Review Hold**. | Patient banner updates to **"No holds active — Arrive before 11:30 AM"**. |

---

## 7. Regulatory Compliance & Clinical Buzzwords

Use these exact terms during presentations to demonstrate deep industry expertise:

* **42 CFR Part 2**: Federal confidentiality regulation governing substance use disorder treatment records. Stricter than standard HIPAA; prohibits unauthorized disclosure to employers or courts without explicit, written patient consent.
* **SAMHSA OTP Regulations (42 CFR Part 8)**: Federal guidelines regulating Opioid Treatment Programs, setting strict rules on daily observed dosing and take-home bottle step-up schedules.
* **ASAM Criteria (American Society of Addiction Medicine)**: The national medical standard used to determine placement, treatment intensity, and level of care (e.g., Level 1 Outpatient, Level 2 IOP).
* **MAT / MMT (Medication-Assisted Treatment / Methadone Maintenance Treatment)**: Evidence-based clinical standard combining FDA-approved medications with behavioral counseling.
* **Destigmatized Patient Language**: Using supportive medical terms (e.g., *"presumptive screening"*, *"ready for review"*, *"unexpected result"*) rather than punitive terms (*"dirty test"*, *"failed drug screen"*).
* **Lockbox & Diversion Control**: Federal requirement that patients store take-home bottles in locked containers to prevent diversion or accidental pediatric poisoning.
* **GC/MS (Gas Chromatography / Mass Spectrometry)**: Certified toxicological laboratory method used to confirm initial rapid point-of-care urine drug screens.

---

## 8. Live Production Data Ingestion & Systems of Record

For a full, deep-dive architectural blueprint on how this application connects to live clinical data in production, refer to [DATA_INTEGRATION_AND_PRODUCTION_ARCHITECTURE.md](file:///c:/Users/tsaty/Downloads/LENS-PoCs-bhg-med-patient-portal-poc/LENS-PoCs-bhg-med-patient-portal-poc/DATA_INTEGRATION_AND_PRODUCTION_ARCHITECTURE.md).

### 8.1 Primary Systems of Record
* **SAMMS EHR (Substance Abuse Management System)**: The core system of record for dispensing hours, hold statuses (`tbl_CHECKIN.ciHOLD`), counselor appointments, prescription dosages, and take-home phase/step progression.
* **Toxicology Lab LIS (Quest / Cordant / Labcorp)**: Ingests presumptive and confirmatory GC/MS urine drug screen (UDS) results via standard HL7 v2 (ORU_R01) or FHIR feeds.
* **Payer Clearinghouse & Merchant Gateway (InstaMed / Stripe Healthcare)**: Powers real-time eligibility (EDI 270/271) and in-portal dues/copay payments.
* **Portal Application Database (PostgreSQL / Cosmos DB)**: Stores interactive CBT thought records, urge-surfing exercises, and patient-counselor direct messages without cluttering the primary EHR.

### 8.2 Security & 42 CFR Part 2
All data moving between the client portal and enterprise systems passes through the **BHG Safe API Gateway**, which enforces **42 CFR Part 2** consent rules, redacts sensitive identifying tokens, and encrypts all communications in transit (TLS 1.3) and at rest (AES-256).
