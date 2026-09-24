# BHG Patient Portal & Clinician Interface — Requirements Specification

## 1. 📌 Overview & Product Identity

### Product Name
**BHG Patient Portal** (with companion **Clinician Interface**)

### Clinical Domain & Purpose
Behavioral Health Group (BHG) operates specialized outpatient addiction medicine centers providing **Opioid Treatment Programs (OTP)**, **Office-Based Opioid Treatment (OBOT)**, and **Intensive Outpatient Programs (IOP)** utilizing **Medication-Assisted Treatment (MAT)** (Methadone, Buprenorphine/Suboxone, Naltrexone/Vivitrol).

The BHG Patient Portal is engineered to eliminate dosing anxiety, foster between-session therapy engagement, ensure federal regulatory compliance (**42 CFR Part 2**, **SAMHSA OTP 8-Point Criteria**, **CARF**, **ASAM**), and provide seamless clinical operations across counselors, dispensing nurses, and medical providers.

---

## 2. 🎯 Core System Objectives & Success Criteria

### Primary Objectives
1. **Reduce Dosing Anxiety & Increase Retention**: Real-time dosing window hours, countdown timers, and proactive "No Holds Active" shield.
2. **Supportive Toxicology Transparency**: Destigmatized urine drug screen (UDS) results that clearly differentiate between expected prescribed medications and unexpected illicit substances.
3. **Between-Session Behavioral Health**: Interactive Cognitive Behavioral Therapy (CBT) exercises (urge-surfing, trigger logs) with direct clinician feedback loops.
4. **Streamlined Clinic Flow**: 1-Click mobile waiting room arrival check-in and real-time dispensing window queue management.
5. **Regulatory & Financial Protection**: 42 CFR Part 2 digital consents, TCPA SMS opt-ins, FIFO copay balance tracking, and sliding-scale financial hardship relief.
6. **Enterprise SAMMS Alignment**: Grounded in the production SAMMS EHR schema (`BHG_DR`, 39 tables, 1,333 columns).

### Success Criteria
* **Dual Persona Isolation & RBAC**: Patients access only their own medical record and assigned care team; clinicians access assigned caseloads and clinic locations.
* **Bi-Directional State Synchronization**: Changes initiated in either interface (check-ins, appointment changes, CBT homework, messages, hold clearances) sync reactively across both personas.
* **Production Data Architecture Readiness**: Clear separation between the client browser, a patient-safe API gateway, and the SAMMS system of record.

---

## 3. 👥 User Roles & Permissions (RBAC)

### 👤 1. Patient (`patient`)
* **Identity & Demographics**: View Master Patient Index (`SAMMSid`, `UserClientID`), home center, and assigned primary care team.
* **Medication & Dispensing**: View daily dosing hours, dispensing countdown, "No Holds Active" shield, active dose/formulation, 7-day schedule, and take-home bottle tiers.
* **Appointments & Check-In**: View upcoming counseling/medical sessions, join Zoom telehealth, submit reschedule requests, and use **1-Click Waiting Room Check-In** upon arrival.
* **Between-Session Practice**: Complete interactive CBT exercises and view highlighted counselor clinical feedback.
* **Lab Results (UDS)**: Inspect destigmatized toxicology reports with clear prescribed medication badges and confirmatory GC/MS levels.
* **Recovery Milestones**: Track treatment phase advancement (Induction $\to$ Stabilization $\to$ Maintenance), BAM coping scores, and COWS stability.
* **Billing & Financial Hardship**: View current dues balance (`FIFObalance`), transaction receipts, active insurance coverage, and submit in-app sliding-scale financial hardship applications.
* **Consents & 42 CFR Part 2**: Digitally sign Releases of Information (ROI) and manage TCPA SMS appointment reminder opt-ins.
* **24/7 Support**: Access the AI-powered BHG Support Assistant chatbot and the "Need Help Today?" crisis triage panel (988 hotline).

### 🩺 2. Clinician / Counselor (`admin` / `counselor`)
* **Caseload Management**: Monitor assigned patient roster, enrollment tenure, phase progression, and overdue treatment plan flags.
* **Daily Sessions Agenda**: Manage daily appointment calendar, monitor real-time waiting room arrivals (**"Checked In"** indicator), and record visit outcomes (Completed, Rescheduled, No-Show).
* **Clinical Chart Review**: Deep-dive into patient history, longitudinal UDS history, and CBT homework submissions.
* **Between-Session CBT Feedback**: Review submitted exercises, flag completion, and write personalized clinical feedback displayed to the patient.
* **Dispensing Queue & Hold Oversight**: Monitor dosing window lobby queues, track patient wait times, and place or release clinical holds (`tblHOLD`).
* **Clinical Documentation**: Draft and electronically sign structured DAP (Data, Assessment, Plan) and SOAP clinical session progress notes (`dbo.ProgressNote`).
* **Population Lab Surveillance**: Monitor caseload-wide UDS results for unexpected substances requiring immediate clinical follow-up.
* **Secure Messaging Triage**: Reply to patient inquiries categorized by care team role (Counselor, Medical, Financial).

---

## 4. ⚙️ Implemented Functional Features & Modules

### 4.1 Patient Portal Feature Modules
1. **Header & Master Patient Index (MPI)**: Legal name display, `BHG-44029` identifier, home center, and masked SSN (`***-**-6789`).
2. **Dosing Hours & Real-Time Countdown**: Live status (*"Open — Closes at 11:30 AM"*), exact countdown timer, and weekend holiday hours.
3. **"No Holds Active" Shield**: Proactive reassurance badge confirming no medical, counseling, or financial holds are blocking the dosing window.
4. **Active Dosing Protocol & Bottle Schedule**: Exact medication name, dose strength (e.g., *Methadone 85 mg Oral Liquid*), 7-day schedule, and take-home bottle tier rules.
5. **Counseling Visits & 1-Click Check-In**: Appointment cards with location/Zoom links, reschedule workflow, and 1-click arrival button that marks the patient as checked in.
6. **Take-Home Bottle Schedule & Safety**: Earned bottle count (e.g., Step 3 / 2 take-home bottles), bottle lot IDs, lockbox safety reminders, and compliance call-back instructions.
7. **Lab & Destigmatized UDS Results**: Supportive toxicology cards clearly distinguishing prescribed medications (green badge) from unexpected substances (amber badge), with GC/MS confirmatory values.
8. **Recovery Progress & BAM Milestones**: Treatment phase advancement bar, Brief Addiction Monitor (BAM) coping scores, and Clinical Opiate Withdrawal Scale (COWS) tracking.
9. **Between-Session CBT Practice**: Interactive self-guided tools (Urge-Surfing, Decatastrophizing, Craving Waves) with visible counselor feedback callouts.
10. **Billing, Dues & Financial Hardship**: Current outstanding balance, payment receipts, active payer verification (TennCare), and sliding-scale fee relief application form.
11. **Forms, Digital Consents & 42 CFR Part 2**: Digital signature capture for Releases of Information, annual treatment agreements, and TCPA SMS consent.
12. **Treatment Center & Emergency Care**: Clinic street address, Google Maps directions, phone contacts, after-hours crisis line, and 988 Suicide & Crisis Lifeline routing.
13. **BHG Support Assistant & Crisis Triage**: 24/7 conversational AI assistant for portal navigation, clinic policies, and immediate crisis escalation.

### 4.2 Clinician Portal Feature Modules
1. **Clinician Authentication & Multi-Center Filter**: Secure login with role enforcement and dynamic clinic center switching (Knoxville Bernard, Knoxville Citico, Jackson TN, All Centers).
2. **Clinician Dashboard & Operational KPIs**: Caseload counts, today's appointment load, unreviewed positive UDS alerts, and pending patient requests.
3. **Sessions Agenda & 1-Click Waiting Room**: Full daily calendar with real-time arrival pills (**"Checked In"** in green), past session notes, and visit outcome modal.
4. **Caseload Roster & Phase Progression**: Comprehensive table of assigned patients with tenure (days enrolled), treatment phase, take-home tier, and alert flags.
5. **Patient Profile & Chart Review**: Tabbed chart view covering clinical overview, longitudinal UDS history, treatment plans, and dose history.
6. **CBT Homework Review & Feedback**: Interface for counselors to review patient-submitted CBT logs and submit written feedback that reflects back on the patient's portal.
7. **Dispensing Window Queue Monitor**: Real-time lobby monitor showing queue ticket numbers, wait times, and dispensing status.
8. **Clinical Hold Management**: Modal to inspect active holds, add new holds (Medical, Counselor, Billing), and release holds with timestamped signatures.
9. **Population Lab & Toxicology Surveillance**: Caseload-wide view of all recent urine screens, highlighting unreviewed positive results for immediate clinical review.
10. **Structured Clinical Charting (DAP / SOAP Notes)**: Standardized clinical progress note documentation with Data, Assessment, and Plan fields, modality toggles (In-Person vs Telehealth), and cryptographic digital signatures.
11. **Secure Messaging Triage**: Centralized clinician inbox to triage, draft, and send responses directly to patient message threads.

---

## 5. 🗄️ Database Schema & System of Record Alignment

The application requirements are mapped directly to **39 production SAMMS tables** (comprising 1,333 validated columns) in the `BHG_DR` schema:

| Functional Feature Area | Primary SAMMS Tables | Key Database Fields |
| :--- | :--- | :--- |
| **Patient Demographics & MPI** | `dbo.ClientMaster` | `ID`, `FirstName`, `LastName`, `DOB`, `UserClientID`, `SAMMSid` |
| **Dosing Windows & Hours** | `dbo.tblCLINIC`, `dbo.tblSITES` | `HoursofDosing`, `DoseWarn`, `DoseStop`, `siteAddress` |
| **Dosing Holds & Queue** | `dbo.tblCHECKIN`, `dbo.tblHOLD` | `ciHOLD`, `ciQUEUE`, `MinutesWaited`, `hdType`, `hdNote`, `hdRemoveDt` |
| **Medication Protocol & History** | `dbo.tblORDER`, `dbo.tblDOSE` | `Dose`, `medType`, `Sunday2`–`Saturday2`, `bottletype` |
| **Appointments & 1-Click Arrival**| `dbo.Appointments`, `AppointmentAttend`| `StartDate`, `Subject`, `Status`, `aaDTENROLLED` (arrival timestamp) |
| **Take-Home Bottles & Agreements**| `dbo.tblBottle`, `TakeHomeAgreement...`| `BottleID`, `LotNumber`, `InitialAmount`, `PatientSignature` |
| **UDS Toxicology & Labs** | `dbo.tblUAResult`, `tblUAResultDetail` | `uarDT`, `uaDetail`, `uardRESULT`, `uardRX` (prescribed flag), `uardConfResult` |
| **Treatment Levels & Clinical Scores**| `dbo.tblTreatmentLevel`, `BAMForm`, `SF_Cows`| `TreatmentLevel`, `SubscaleScoreTxt3`, `Score` |
| **CBT Homework & Feedback** | `dbo.DraftDAPNote` | `CBT`, `Homework`, `GaveFeedback`, `DataContentTxt`, `StaffSignName` |
| **Billing, Dues & Hardship** | `dbo.tblBill`, `tbl3pElig`, `FinancialHardship...`| `FIFObalance`, `billPAY`, `ePAYER`, `txtAnnualHouseholdIncome`, `StatusofApplication` |
| **Consents & 42 CFR Part 2** | `ConsentToDisclosure...`, `SMSConsent`| `PatientSignatureDate`, `WitnessSignature`, `Iagreetoreceivecalls` |
| **Clinical Progress Notes** | `dbo.ProgressNote`, `dbo.GroupNoteSession` | `txtData`, `txtAssessment`, `txtPlan`, `TeleSession`, `StaffSignature` |

---

## 6. 🔄 Connected Bi-Directional Workflows

1. **Waiting Room Arrival**: Patient clicks **"Check In"** on mobile &rarr; `AppointmentAttend.aaDTENROLLED` is populated &rarr; Clinician Sessions Agenda instantly displays green **"Checked In"** badge.
2. **CBT Practice & Review**: Clinician assigns exercise from CBT Library &rarr; Patient completes exercise in Between-Session Practice &rarr; Clinician reviews submission and types clinical feedback &rarr; Patient sees highlighted counselor feedback card.
3. **Appointment Rescheduling**: Patient submits reschedule request &rarr; Clinician reviews in Triage Queue &rarr; Clinician proposes alternate date/time &rarr; Patient accepts or declines offer.
4. **Dosing Hold Resolution**: Counselor places administrative hold &rarr; Patient sees hold alert directing them to see counselor &rarr; Counselor conducts session and clears hold (`hdRemoveDt = GETDATE()`) &rarr; Patient shield updates to "No Holds Active" and dispensing nurse is cleared to dose.
5. **Financial Hardship Relief**: Patient submits in-app income details &rarr; Billing team approves reduced sliding-scale pay class &rarr; Patient copay balance automatically updates.

---

## 7. 🔒 Security, Privacy & Compliance Specifications

1. **42 CFR Part 2 Compliance**:
   * Substance use disorder treatment records are strictly quarantined.
   * Disclosures to external medical providers require signed, unexpired digital releases (`dbo.ConsentToDisclosureofPatientInfo`).
   * No raw patient SSNs are transmitted to browser frontends; only masked last 4 digits are permitted.
2. **Role-Based Access Control (RBAC)**:
   * Patient accounts are strictly partitioned by `ClientMaster.ID`.
   * Clinician accounts require verified credentials (`dbo.UserLogins`) and are scoped to assigned centers (`tblSCHEDUSER`).
3. **Safe API Gateway Architecture**:
   * Production frontend requests route through a patient-safe translation layer (Azure APIM / Node.js).
   * Internal SAMMS primary keys and raw table names are sanitized and abstracted into REST/JSON endpoints.
4. **TCPA Compliance**:
   * Automated SMS appointment reminders are only dispatched after explicit opt-in confirmation (`SMSConsent.Iagreetoreceivecalls = 1`).
5. **Supportive Medical Terminology**:
   * All patient-facing language uses clinically supportive terms (*"Consistent with prescription"*, *"Positive for unexpected substance"* rather than stigmatizing terms like *"Dirty"* or *"Failed"*).

---

## 8. 📚 Associated Documentation

* 📑 [FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md](FEATURE_DATA_REQUIREMENTS_SPECIFICATION.md): Complete field-by-field BA requirements and technical data dictionary.
* 📖 [COMPLETE_PORTAL_DOCUMENTATION.md](COMPLETE_PORTAL_DOCUMENTATION.md): Exhaustive screen-by-screen guide, clinical workflows, and user personas.
* 🗄️ [DATABASE_TABLE_MAPPING_GUIDE.md](DATABASE_TABLE_MAPPING_GUIDE.md): Column-by-column mapping to SAMMS production database tables.
* 📑 [Documents/RequiredTables.md](Documents/RequiredTables.md): Verified production schema export (39 tables, 1,333 columns).
* 🏗️ [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md): Clinical mission, architecture, and technology overview.
