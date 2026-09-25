# BHG Patient Portal & Clinician Portal: Feature-to-Database Requirements Specification

> **Document Type**: Dual-Audience Specification (Business Analyst Functional Requirements & Technical Data Architecture Contract)  
> **Systems of Record**: SAMMS EHR (`BHG_DR` Production Schema), Reference Toxicology LIS, Payer Clearinghouse  
> **Target Applications**: BHG Patient Portal (Web/Mobile) & BHG Clinician Portal (Counselor / Medical / Administration)  
> **Source Schema Reference**: [Documents/RequiredTables.md](file:///c:/Users/tsaty/Downloads/LENS-PoCs-bhg-med-patient-portal-poc/LENS-PoCs-bhg-med-patient-portal-poc/Documents/RequiredTables.md) (1,333 columns across 39 core tables)

---

## Executive Summary & Document Purpose

This document bridges the gap between **Business Analysis (BA)** and **Software / Data Engineering (Tech)**:
* **For Business Analysts (BAs) & Product Managers**: It defines the user stories, clinical rationale, business acceptance criteria, and operational rules governing every portal screen.
* **For Software Engineers & Database Architects**: It specifies the exact source tables, column names, SQL data types, join relationships, transformation logic, and JSON payload structures required to build the production API integration layer.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION FRONTEND                                    │
│       BHG Patient Portal (Mobile/Web)     │      BHG Clinician Portal (Web)            │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ HTTPS (JSON over REST / WebSockets)
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   BHG SAFE INTEGRATION GATEWAY (Node.js / Azure APIM)                  │
│       • 42 CFR Part 2 Consent Redaction Engine      • OAuth2 / JWT Auth                │
│       • Business Logic & Calculation Pipelines      • FHIR / HL7 Interface Engine      │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ SQL Queries / Read-Replica Pool
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SAMMS PRODUCTION DATABASE TABLES                                │
│   ClientMaster • tblCHECKIN • tblHOLD • tblDOSE • Appointments • tblUAResult • tblBill  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Module 1: Patient Header, Demographics & Master Patient Index (MPI)

### 1.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient (e.g., Jordan Williams), I need to see my official medical record ID, home treatment center, and assigned primary counselor immediately upon login so that I am confident I am in my personal medical chart.*
* **Business Rules**:
  1. The patient's display name must use legal names if present, falling back to first/last name.
  2. Patient identifier must be formatted as `BHG-[SAMMSid]` or `BHG-[UserClientID]`.
  3. The home clinic center and counselor name must be dynamically populated from the active enrollment record.
  4. Under **42 CFR Part 2**, the Social Security Number (`SSN`) must **never** be transmitted to the browser; only masked last 4 digits (`***-**-6789`) are permitted.

### 1.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `ID` | `int (4)` | No | Internal Database Primary Key. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `FirstName` | `nvarchar (50)` | Yes | Patient First Name. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `LastName` | `nvarchar (50)` | Yes | Patient Last Name. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `DOB` | `datetime (8)` | Yes | Date of Birth (Formatted as `MMM DD, YYYY`). |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `Gender` | `nvarchar (1)` | Yes | Gender (`M`, `F`, `O`). |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `UserClientID` | `varchar (50)` | Yes | Clinic-facing Client ID (e.g., `44029`). |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `SAMMSid` | `int (4)` | Yes | Enterprise SAMMS Master Patient Identifier. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `InitialContactDate` | `datetime (8)` | Yes | Admission / Treatment Start Date. Used to calculate "Days Enrolled". |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `SSN` | `nvarchar (50)` | Yes | **Security Rule**: Gateway masks to `***-**-` + Right(`SSN`, 4). |
| SAMMS EHR (Clinic Directory) | **`dbo.tblSITES`** | `siteID` | `int (4)` | No | Site ID linking `ClientMaster.RefSource` or clinic site assignment. |
| SAMMS EHR (Clinic Directory) | **`dbo.tblSITES`** | `siteNAME` | `varchar (100)` | Yes | Clinic Center Name (e.g., *Knoxville Comprehensive Treatment Center*). |

### 1.3 Target API JSON Payload
```json
{
  "patientId": "BHG-44029",
  "sammsId": 104821,
  "fullName": "Jordan Williams",
  "dob": "1988-06-14",
  "gender": "Male",
  "daysEnrolled": 412,
  "admissionDate": "2025-08-07",
  "homeClinic": {
    "siteId": 12,
    "siteName": "Knoxville Comprehensive Treatment Center",
    "siteCode": "BHG-KNX-01"
  }
}
```

---

## Module 2: Dispensing Windows, Operating Hours & Cutoffs

### 2.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient receiving daily Medication-Assisted Treatment (Methadone/Buprenorphine), I must see today’s exact dispensing window hours and cutoff countdown so that I never arrive after dosing doors close.*
* **Business Rules**:
  1. Dosing hours differ by day of the week (e.g., Weekdays 5:00 AM – 10:30 AM vs. Saturday 6:00 AM – 9:30 AM).
  2. If the current time is within 30 minutes of `DoseStop`, a yellow warning badge must appear.
  3. If the current time is past `DoseStop`, the status must display *"Dosing Window Closed"*.

### 2.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Clinic Administration) | **`dbo.tblCLINIC`** | `PKEY` | `int (4)` | No | Primary clinic configuration identifier. |
| SAMMS EHR (Clinic Administration) | **`dbo.tblCLINIC`** | `ClinicNAME` | `varchar (100)` | Yes | Official clinic legal name. |
| SAMMS EHR (Clinic Administration) | **`dbo.tblCLINIC`** | `HoursofDosing` | `varchar (500)` | Yes | Raw dosing hours string (e.g., `Mon-Fri: 5:00AM-10:30AM`). |
| SAMMS EHR (Clinic Administration) | **`dbo.tblCLINIC`** | `DoseWarn` | `nvarchar (50)` | Yes | Warning threshold timestamp before cutoff (e.g., `10:00 AM`). |
| SAMMS EHR (Clinic Administration) | **`dbo.tblCLINIC`** | `DoseStop` | `nvarchar (50)` | Yes | Daily hard stop cutoff time (e.g., `10:30 AM`). |
| SAMMS EHR (Clinic Administration) | **`dbo.tblCLINIC`** | `OpenOnSaturday` | `bit (1)` | Yes | Weekend operational flag (`1 = Open`, `0 = Closed`). |
| SAMMS EHR (Clinic Administration) | **`dbo.tblCLINIC`** | `OpenOnSunday` | `bit (1)` | Yes | Sunday operational flag (typical OTPs closed on Sunday for take-homes). |

### 2.3 Target API JSON Payload
```json
{
  "dosingSchedule": {
    "todayDate": "2026-09-23",
    "windowOpen": "05:00:00",
    "windowClose": "10:30:00",
    "warningThreshold": "10:00:00",
    "isOpenNow": true,
    "saturdayHours": "06:00 AM - 09:30 AM",
    "sundayHours": "Closed (Take-Home Dosing Only)"
  }
}
```

---

## Module 3: Dispensing Holds & Safety Alerts ("No Holds Active")

### 3.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I need immediate confirmation that my chart has "No holds active" before driving to the clinic, or clear instructions if a hold has been placed so I know which staff member to see.*
* **Business Rules**:
  1. If `ciHOLD = 0` (or `false`), display the **Green Shield**: *"No holds active — You are clear to dose today"*.
  2. If `ciHOLD = 1` (or `true`), query `dbo.tblHOLD` where `hdRemoveDt IS NULL` to retrieve the active hold reason.
  3. Distinguish hold severity:
     * **Counselor Hold (`hdType = 'Counselor'`)**: Display *"Please meet with Alicia Monroe before dosing"*.
     * **Medical Hold (`hdType = 'Medical'`)**: Display *"Annual physical review overdue — See clinic nurse"*.
     * **Fee / Billing Hold (`hdType = 'Fee'`)**: Display *"Please see cashier window for copay balance"*.
  4. In the Clinician Portal (`/admin-check-ins`), clinicians can clear holds by setting `hdRemoveDt = GETDATE()` and `ciHOLD = 0`.

### 3.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | `ciID` | `int (4)` | No | Check-in event primary key. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | `ciCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | **`ciHOLD`** | `bit (1)` | Yes | **Core Boolean Flag**: `0 = No Holds Active`, `1 = Active Hold`. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | `ciQUEUE` | `varchar (50)` | Yes | Dosing window lobby queue ticket number. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | `MinutesWaited` | `int (4)` | Yes | Minutes waited in lobby queue before dosing. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | `ciSERVEDdtm` | `datetime (8)` | Yes | Timestamp nurse dispensed dose at window. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdID` | `int (4)` | No | Hold transaction record primary key. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdType` | `varchar (100)` | Yes | Category: `'Counselor'`, `'Medical'`, `'Administrative'`, `'Fee'`. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdNote` | `varchar (-1)` | Yes | Detailed clinical explanation displayed to patient/staff. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdEffectiveDT` | `datetime (8)` | Yes | Timestamp hold was placed. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdStopDose` | `bit (1)` | No | `1 = Medication hard block`, `0 = Warning only`. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdRemoveDt` | `datetime (8)` | Yes | When `NULL`, hold is active. When populated, hold is resolved. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdRemoveUser` | `varchar (50)` | Yes | Staff username who cleared the hold. |

### 3.3 Target API JSON Payload
```json
{
  "holdStatus": {
    "isHoldActive": false,
    "badgeColor": "green",
    "statusTitle": "No Holds Active",
    "statusMessage": "You are clear to dose today. Arrive before 10:30 AM.",
    "activeHolds": []
  }
}
```

---

## Module 4: Active Medication Dosing & Doctor Orders

### 4.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I want to verify my current prescribed dosage (e.g., Methadone 85 mg daily) and confirm that my medication administration was recorded accurately by the dispensing nurse.*
* **Business Rules**:
  1. The portal displays the current verified daily dose from the active physician order.
  2. Past dosing events must display the medication name, dose in mg, whether it was administered at the clinic window or dispensed as a take-home bottle (`bottletype`), and the administration timestamp.
  3. Under federal OTP rules, dosage changes cannot be requested directly by patients without clinician assessment.

### 4.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `OrderNum` | `int (4)` | No | Physician Order ID. |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `cltID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `medType` | `varchar (50)` | Yes | Medication name (`'Methadone'`, `'Buprenorphine/Naloxone'`). |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `Dose` | `smallint (2)` | Yes | Active prescribed daily dose in milligrams (e.g., `85`). |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `EffectiveDate` | `datetime (8)` | Yes | Order start date. |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `ExpirationDate` | `datetime (8)` | Yes | Order expiration date. |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `Active` | `bit (1)` | No | `1 = Currently active order`. |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `Doctor` | `varchar (50)` | Yes | Ordering physician name (e.g., *Dr. Robert Vance, MD*). |
| SAMMS EHR (Physician Orders & eRx) | **`dbo.tblORDER`** | `Sunday2`–`Saturday2` | `bit (1)` | No | Weekly take-home bottle schedule flags (`1 = Take-Home`). |
| SAMMS EHR (Medication Dispense Log) | **`dbo.tblDOSE`** | `DoseID` | `bigint (8)` | No | Dispense transaction record primary key. |
| SAMMS EHR (Medication Dispense Log) | **`dbo.tblDOSE`** | `dtMedDate` | `datetime (8)` | Yes | Date dose was scheduled for. |
| SAMMS EHR (Medication Dispense Log) | **`dbo.tblDOSE`** | `DTgiven` | `datetime (8)` | Yes | Exact timestamp nurse administered dose at window. |
| SAMMS EHR (Medication Dispense Log) | **`dbo.tblDOSE`** | `Dose` | `int (4)` | Yes | Milligrams dispensed. |
| SAMMS EHR (Medication Dispense Log) | **`dbo.tblDOSE`** | `bottletype` | `varchar (50)` | Yes | `'Window Dose'`, `'Take-Home'`, `'Sunday Bottle'`. |
| SAMMS EHR (Medication Dispense Log) | **`dbo.tblDOSE`** | `strUser` | `varchar (50)` | Yes | Dispensing nurse username. |

---

## Module 5: Appointments, Counseling Visits & 1-Click Check-In

### 5.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I want to see my next counseling appointment, join my Zoom video session if virtual, and click "Check In" within 1 hour of the visit so my counselor knows I have arrived in the waiting room.*
* **Business Rules**:
  1. The **"Check In"** button is disabled until **60 minutes prior** to `StartDate`.
  2. When clicked, the system writes an arrival event into `dbo.AppointmentAttend` setting `aaDTENROLLED = GETDATE()`.
  3. The Clinician Portal agenda immediately updates the appointment pill from `Scheduled` (gray) to `Checked In` (green).
  4. If the patient misses the session, the clinician can log an excuse reason into `dbo.appointmentexcuse`.

### 5.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `UniqueId` | `int (4)` | No | Appointment primary key. |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `StartDate` | `smalldatetime (4)` | Yes | Session start date and time. |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `EndDate` | `smalldatetime (4)` | Yes | Session end date and time. |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `Subject` | `nvarchar (-1)` | Yes | Visit title (*"Individual Counseling"*, *"Medical Exam"*). |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `Location` | `nvarchar (-1)` | Yes | Location (*"Office 204"* or *"Telehealth / Zoom"*). |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `Status` | `int (4)` | Yes | Status ID (`1 = Scheduled`, `2 = Checked In`, `3 = Completed`). |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `ResourceId` | `int (4)` | Yes | **Staff ID**: Links to `dbo.tblSCHEDUSER.UsKey` (Counselor). |
| SAMMS EHR (Waiting Room Attendance) | **`dbo.AppointmentAttend`** | `aaaptID` | `int (4)` | Yes | Foreign Key linking to `Appointments.UniqueId`. |
| SAMMS EHR (Waiting Room Attendance) | **`dbo.AppointmentAttend`** | `aacltid` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (Waiting Room Attendance) | **`dbo.AppointmentAttend`** | **`aaDTENROLLED`** | `date (3)` | Yes | **1-Click Check-In Timestamp**: Populated when patient clicks Check-In. |
| SAMMS EHR (Waiting Room Attendance) | **`dbo.AppointmentAttend`** | `aaDTREMOVED` | `date (3)` | Yes | Session checkout / completion timestamp. |
| SAMMS EHR (Appointment Exceptions) | **`dbo.appointmentexcuse`** | `exAPTID` | `int (4)` | Yes | Foreign Key linking to `Appointments.UniqueId`. |
| SAMMS EHR (Appointment Exceptions) | **`dbo.appointmentexcuse`** | `exReason` | `varchar (250)` | Yes | Reschedule or missed appointment reason. |
| SAMMS EHR (Staff Scheduling Directory) | **`dbo.tblSCHEDUSER`** | `UsKey` | `int (4)` | No | Staff Provider ID matching `Appointments.ResourceId`. |
| SAMMS EHR (Staff Scheduling Directory) | **`dbo.tblSCHEDUSER`** | `usrname` | `varchar (50)` | Yes | Counselor login name / display name (*Alicia Monroe*). |

---

## Module 6: Group Therapy Documentation & Attendance

### 6.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor managing group cohorts (e.g., Relapse Prevention, Coping Skills), I need to track session attendance, log group topics, and document individual patient contributions.*
* **Business Rules**:
  1. Group sessions scheduled in `dbo.Appointments` (`IsSchedule = 1`) link to `dbo.GroupNoteSession`.
  2. Individual patient progress comments (`txtIndividualContributions`) must maintain cohort confidentiality under 42 CFR Part 2 (no other group member's name can appear in Jordan's note).

### 6.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `Id` | `int (4)` | No | Group session note primary key. |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `ClientId` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `ServiceDate` | `datetime (8)` | Yes | Date group was conducted. |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `txtTopicDiscussed` | `nvarchar (500)` | Yes | Group topic (e.g., *"Triggers and Urge Surfing"*). |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `txtIndividualContributions` | `nvarchar (-1)` | Yes | Individual patient engagement summary. |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `txtClinicianAssessment` | `nvarchar (-1)` | Yes | Counselor clinical assessment of patient progress. |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `txtPlan` | `nvarchar (-1)` | Yes | Follow-up homework and between-session plan. |
| SAMMS EHR (Clinical Group Therapy) | **`dbo.GroupNoteSession`** | `counselor` | `nvarchar (255)` | Yes | Facilitating counselor name. |

---

## Module 7: Individual 1-on-1 Counseling & DAP Progress Notes

### 7.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I need to complete structured DAP (Data, Assessment, Plan) progress notes after each individual visit to document clinical interventions, CBT homework, and risk assessments.*
* **Business Rules**:
  1. Progress notes must capture whether CBT evidence-based practices were used (`CBT = 1`, `CopingSkills = 1`).
  2. The note must record mental status exam observations (mood, thought process, suicide/violence risk screening).
  3. Electronic signatures (`StaffSignature`) must be time-stamped for CARF and state Medicaid compliance.

### 7.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `Id` | `int (4)` | No | Clinical DAP note primary key. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `ClientId` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `CBT` | `bit (1)` | Yes | Flag: Cognitive Behavioral Therapy delivered. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `CopingSkills` | `bit (1)` | Yes | Flag: Coping skills education conducted. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `RelapsePrevention` | `bit (1)` | Yes | Flag: Relapse prevention plan reviewed. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `Homework` | `bit (1)` | Yes | **Between-Session Homework Assigned Flag**. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `DataContentTxt` | `nvarchar (-1)` | Yes | **D - Data**: Patient subjective report and objective observations. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `AssessmentInterventionsTxt` | `nvarchar (-1)` | Yes | **A - Assessment**: Clinical analysis of progress and response. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `PlanningFollowUpHomework` | `bit (1)` | Yes | **P - Plan**: Assigned between-session exercises. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `StaffSignature` | `nvarchar (-1)` | Yes | Counselor cryptographic digital signature. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `StaffSignatureDate` | `datetime (8)` | Yes | Timestamp note was signed. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `Id` | `int (4)` | No | Finalized progress note identifier. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `Sessionstarttime` | `nvarchar (50)` | Yes | Session start time (e.g., `14:00`). |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `Sessionendtime` | `nvarchar (50)` | Yes | Session end time (e.g., `14:50`). |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `TeleSession` | `bit (1)` | Yes | `1 = Virtual Zoom Session`, `0 = In-Clinic`. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `LastUDS` | `nvarchar (50)` | Yes | Most recent UDS collection date referenced in note. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `UDSresults` | `nvarchar (50)` | Yes | Summary of recent toxicology results discussed. |

---

## Module 8: Take-Home Bottles & Diversion Control

### 8.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient progressing in recovery, I want to see my approved take-home bottle tier (e.g., Step 3: 3 take-home bottles), my bottle serial numbers, and sign my required diversion agreements.*
* **Business Rules**:
  1. Federal SAMHSA rules (42 CFR Part 8) restrict take-home bottles based on continuous treatment tenure and clean toxicology.
  2. Every take-home bottle must display an active DEA Lot Number and NDC identifier.
  3. The patient must have an active electronic signature on file acknowledging safe lockbox storage (`TakeHomeAgreementandDiversionControl`).

### 8.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Take-Home Inventory) | **`dbo.tblBottle`** | `BottleID` | `int (4)` | No | Unique bottle serial barcode number. |
| SAMMS EHR (Take-Home Inventory) | **`dbo.tblBottle`** | `BottleType` | `varchar (50)` | Yes | Classification (`'Step 3 Take-Home'`, `'Weekend'`). |
| SAMMS EHR (Take-Home Inventory) | **`dbo.tblBottle`** | `LotNumber` | `varchar (50)` | Yes | DEA batch lot identifier printed on label. |
| SAMMS EHR (Take-Home Inventory) | **`dbo.tblBottle`** | `InitialAmount` | `int (4)` | Yes | Prescribed dose volume per bottle (mg). |
| SAMMS EHR (Take-Home Inventory) | **`dbo.tblBottle`** | `dtReceived` | `datetime (8)` | Yes | Dispense timestamp when handed to patient. |
| SAMMS EHR (Take-Home Inventory) | **`dbo.tblBottle`** | `dtClosed` | `datetime (8)` | Yes | Returned/inspected date during bottle recall checks. |
| SAMMS EHR (Diversion Control Forms) | **`dbo.TakeHomeAgreementandDiversionControl`** | `PatientSignature` | `nvarchar (-1)` | Yes | Patient digital signature acknowledging diversion laws. |
| SAMMS EHR (Diversion Control Forms) | **`dbo.TakeHomeAgreementandDiversionControl`** | `PatientCurrentPhone` | `nvarchar (15)` | Yes | Emergency contact phone for random bottle recalls. |
| SAMMS EHR (Clinical Risk Assessment) | **`dbo.TakeHomeRiskAssessment`** | `TotalScore` | `nvarchar (20)` | Yes | Clinical risk score determining take-home tier. |
| SAMMS EHR (Clinical Risk Assessment) | **`dbo.TakeHomeRiskAssessment`** | `SafeguardingMedication` | `int (4)` | Yes | Lockbox safety verification rating. |
| SAMMS EHR (Regulatory Agreements) | **`dbo.DiversionControlNotificationofChange`** | `PatientSignatureDate` | `datetime (8)` | Yes | Acknowledgment date of diversion protocol changes. |

---

## Module 9: Urine Drug Screens (UDS) & Toxicology Tracking

### 9.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I want to see my lab results in clear, destigmatized language so that I feel encouraged rather than judged, and understand which medications are expected versus unexpected.*
* **Business Rules**:
  1. **Destigmatized Patient Terminology**:
     * Prescribed methadone/buprenorphine detected $\to$ **Green Pill: "Prescribed Consistent"** (`uardRX = 1`).
     * Negative for illicit substances $\to$ **Green Pill: "Negative"** (`uardRESULT = 'Negative'`).
     * Unexpected positive $\to$ **Amber Pill: "Review with Counselor"** (`uardRESULT = 'Positive'` and `uardRX = 0`).
  2. Presumptive rapid point-of-care cup results must be distinguished from certified GC/MS reference lab confirmations.

### 9.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `uarID` | `int (4)` | No | Screen encounter primary key. |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `uarCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `uarDT` | `datetime (8)` | Yes | Specimen collection date. |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `uarToxResult` | `varchar (50)` | Yes | Overall panel outcome. |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `LabName` | `varchar (50)` | Yes | Reference lab (*Cordant*, *Quest*, *Labcorp*). |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `SpecimenType` | `varchar (20)` | Yes | Specimen type (*'Urine'*, *'Oral Fluid'*). |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uardID` | `int (4)` | No | Substance line-item primary key. |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uardRECiD` | `int (4)` | Yes | Foreign Key linking to `tblUAResult.uarID`. |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | **`uaDetail`** | `varchar (50)` | Yes | Substance name (*Methadone*, *Opiates*, *Fentanyl*, *Benzos*). |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | **`uardRESULT`** | `varchar (50)` | Yes | Result (*'Negative'*, *'Positive'*). |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | **`uardRX`** | `bit (1)` | Yes | **Prescription Flag**: `1 = Prescribed Consistent (Green)`. |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uardCutOff` | `decimal (9)` | Yes | Detection cutoff threshold in ng/mL. |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uardConfResult` | `varchar (50)` | Yes | Certified GC/MS confirmatory value. |
| SAMMS EHR (Randomized UDS Scheduler) | **`dbo.tblUASched`** | `uasDATE` | `datetime (8)` | Yes | Scheduled future random screen date. |
| Reference Lab LIS (HL7 Interface Engine) | **`dbo.HL7Lab Information`** | `LabAccountNumber` | `nvarchar (20)` | Yes | Clinic lab account number. |

---

## Module 10: Recovery Progress, ASAM Dimensions & Clinical Assessments

### 10.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I want to see my recovery phase progression (Induction $\to$ Stabilization $\to$ Maintenance), milestones achieved, and clinical strengths so that I stay motivated in treatment.*
* **Business Rules**:
  1. The progress ring reflects the current phase in `dbo.tblTreatmentLevel`.
  2. Standardized Brief Addiction Monitor (BAM) scores evaluate Coping & Protective factors (e.g., meeting attendance, positive social support).
  3. The master treatment plan evaluates all 6 ASAM dimensions.

### 10.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Treatment Phase Engine) | **`dbo.tblTreatmentLevel`** | `TreatmentLevel` | `varchar (50)` | Yes | Treatment Phase: `'Induction'`, `'Stabilization'`, `'Maintenance'`, `'Step 3'`. |
| SAMMS EHR (Treatment Phase Engine) | **`dbo.tblTreatmentLevel`** | `RecordOn` | `datetime (8)` | Yes | Phase approval / advancement date. |
| SAMMS EHR (Clinical Assessments / BAM) | **`dbo.BAMForm`** | `BAMDate` | `datetime (8)` | Yes | Assessment administration date. |
| SAMMS EHR (Clinical Assessments / BAM) | **`dbo.BAMForm`** | `SubscaleScoreTxt1` | `nvarchar (20)` | Yes | Substance Use Severity subscore. |
| SAMMS EHR (Clinical Assessments / BAM) | **`dbo.BAMForm`** | `SubscaleScoreTxt2` | `nvarchar (20)` | Yes | Risk Factor index score. |
| SAMMS EHR (Clinical Assessments / BAM) | **`dbo.BAMForm`** | `SubscaleScoreTxt3` | `nvarchar (20)` | Yes | **Protective / Coping Factor Score** (Powers Recovery Strength). |
| SAMMS EHR (Clinical Scoring Engine) | **`dbo.BAMScore`** | `Score` | `varchar (10)` | Yes | Consolidated BAM composite score. |
| SAMMS EHR (Withdrawal Scale / COWS) | **`dbo.SF_Cows`** | `Score` | `int (4)` | Yes | Total COWS score (`0-4 Mild`, `5-12 Moderate`, `>13 Severe`). |
| SAMMS EHR (ASAM Master Treatment Plans) | **`dbo.InitialTreatmentPlan`** | `DDLASAM1`–`6` | `int (4)` | Yes | Severity rating across ASAM Dimensions 1 through 6. |

---

## Module 11: Billing, Dues & Real-Time Insurance Coverage

### 11.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I want to view my current dues balance ($35.00), click "Pay Dues" with a card/HSA, view payment receipts, and see my active insurance card so that financial issues never cause a dosing hold.*
* **Business Rules**:
  1. Current outstanding balance is calculated using `FIFObalance` from `dbo.tblBill`.
  2. Electronic insurance eligibility (EDI 270/271) displays the active payer (*TennCare / BlueCare Tennessee*) and verification date.
  3. If a patient cannot pay, they can submit an in-app sliding-scale application via `dbo.FinancialHardshipApplication`.

### 11.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | `billID` | `int (4)` | No | Bill transaction primary key. |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | `billCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | `billDate` | `datetime (8)` | Yes | Transaction date. |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | **`billBILL`** | `money (8)` | Yes | Charge amount (e.g., `$15.00` daily copay). |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | **`billPAY`** | `money (8)` | Yes | Payment received. |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | `billPAYTYPE` | `varchar (50)` | Yes | Method (`'Credit Card'`, `'HSA'`, `'Cash'`, `'Medicaid'`). |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | `billReceiptNum` | `int (4)` | Yes | Transaction receipt number. |
| SAMMS EHR (Patient AR / FIFO Subledger) | **`dbo.tblBill`** | **`FIFObalance`** | `money (8)` | Yes | **Current Outstanding Dues Balance**. |
| Payer Clearinghouse (EDI 270/271) | **`dbo.tbl3pElig`** | `ePAYER` | `varchar (100)` | Yes | Primary Insurance Payer name (*TennCare*). |
| Payer Clearinghouse (EDI 270/271) | **`dbo.tbl3pElig`** | `eSTATUS` | `varchar (200)` | Yes | Eligibility Status (`'Active'`, `'Inactive'`). |
| Payer Clearinghouse (EDI 270/271) | **`dbo.tbl3pElig`** | `pyeligcheck` | `date (3)` | Yes | Last electronic verification date (EDI 271). |
| BHG Patient Portal (Financial Engine) | **`dbo.FinancialHardshipApplication`** | `txtAnnualHouseholdIncome` | `nvarchar (50)` | Yes | Self-reported income for sliding-fee scale. |
| BHG Patient Portal (Financial Engine) | **`dbo.FinancialHardshipApplication`** | `StatusofApplication` | `nvarchar (-1)` | Yes | Status (`'Approved'`, `'Under Review'`). |
| BHG Patient Portal (Financial Engine) | **`dbo.FinancialHardshipApplication`** | `PayClassApproved` | `nvarchar (-1)` | Yes | Discounted fee category approved by billing team. |

---

## Module 12: Digital Consents, 42 CFR Part 2 Releases & Notifications

### 12.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I must digitally sign my 42 CFR Part 2 Releases of Information (ROI), review treatment agreements, and opt in to SMS appointment reminders.*
* **Business Rules**:
  1. Under **42 CFR Part 2**, substance use disorder treatment data cannot be disclosed without an unexpired, signed consent form.
  2. TCPA regulations require explicit opt-in (`Iagreetoreceivecalls = 1`) before automated SMS appointment reminders are sent.
  3. In-app mobile banners (`scx.ScxMobileBanner`) and bell alerts (`scx.Notification`) inform patients of schedule changes and clinic notices.

### 12.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (42 CFR Part 2 Engine) | **`dbo.ConsentToDisclosureofPatientInfo`** | `DateOfEnrollment` | `datetime (8)` | Yes | Date ROI was initiated. |
| SAMMS EHR (42 CFR Part 2 Engine) | **`dbo.ConsentToDisclosureofPatientInfo`** | `PatientSignature` | `nvarchar (-1)` | Yes | Cryptographic or drawn patient digital signature. |
| SAMMS EHR (42 CFR Part 2 Engine) | **`dbo.ConsentToDisclosureofPatientInfo`** | `PatientSignatureDate` | `datetime (8)` | Yes | Timestamp of patient signature. |
| SAMMS EHR (42 CFR Part 2 Engine) | **`dbo.ConsentToDisclosureofPatientInfo`** | `WitnessSignature` | `nvarchar (-1)` | Yes | Clinical staff counter-signature. |
| BHG Patient Portal (TCPA Consent Engine) | **`dbo.SMSConsent`** | `Iagreetoreceivecalls` | `bit (1)` | Yes | **TCPA SMS Consent Flag**: `1 = Opted In`. |
| BHG Patient Portal (TCPA Consent Engine) | **`dbo.SMSConsent`** | `ClientSignatureDate` | `datetime (8)` | Yes | SMS consent signature timestamp. |
| BHG Mobile Gateway (In-App CMS) | **`scx.ScxMobileBanner`** | `DeviceType` | `nvarchar (512)` | Yes | Target platform (`'iOS'`, `'Android'`, `'Web'`). |
| BHG Mobile Gateway (In-App CMS) | **`scx.ScxMobileBanner`** | `Path` | `nvarchar (1024)` | Yes | Banner graphic or navigation deep-link. |
| BHG Notification Gateway (Push Queue) | **`scx.Notification`** | `Body` | `nvarchar (-1)` | No | In-app notification text content. |
| BHG Notification Gateway (Push Queue) | **`scx.Notification`** | `NotificationType` | `nvarchar (-1)` | No | Category (`'Appointment'`, `'LabResult'`, `'DosingNotice'`). |
| BHG Notification Gateway (Push Queue) | **`scx.Notification`** | `SendOn` | `datetime (8)` | No | Scheduled notification dispatch timestamp. |
| 8x8 Telecom Gateway (SMS/Voice Log) | **`dbo.ClientCommunicationLog`** | `cltPhone` | `nvarchar (-1)` | Yes | Verified patient phone for 8x8 SMS routing. |
| 8x8 Telecom Gateway (SMS/Voice Log) | **`dbo.ClientCommunicationLog`** | `cltemail` | `nvarchar (-1)` | Yes | Patient email for appointment confirmations. |

---

# PART II: BHG CLINICIAN PORTAL SPECIFICATION

The Clinician Portal provides counselors, clinical supervisors, nurses, and medical directors with clinical command, patient caseload management, session charting, and real-time dispensing window oversight.

---

## Module 13: Clinician Authentication, Roles & Security Access

### 13.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a licensed counselor or clinic staff member, I need to log into the clinician portal using my verified credentials and role so that I only access patients assigned to my clinic location in compliance with HIPAA and 42 CFR Part 2.*
* **Business Rules**:
  1. Clinician credentials and active employment status must be verified via `dbo.UserLogins`.
  2. Roles determine permissions (`Counselor`, `MedicalDirector`, `Nurse`, `ClinicalSupervisor`, `Executive`).
  3. Clinicians can toggle between assigned treatment centers (`Knoxville Bernard`, `Knoxville Citico`, `Jackson TN`).

### 13.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Staff Security & Auth) | **`dbo.UserLogins`** | `UserName` | `nvarchar (50)` | No | Clinician login username / email. |
| SAMMS EHR (Staff Security & Auth) | **`dbo.UserLogins`** | `Password` | `nvarchar (50)` | Yes | Hashed credentials (or Azure Active Directory SSO hash). |
| SAMMS EHR (Staff Security & Auth) | **`dbo.UserLogins`** | `UserType` | `nvarchar (50)` | Yes | Staff role (`'Counselor'`, `'MedicalDirector'`, `'Nurse'`, `'Admin'`). |
| SAMMS EHR (Staff Security & Auth) | **`dbo.UserLogins`** | `Active` | `bit (1)` | No | Employment status flag (`1 = Active`, `0 = Inactive`). |
| SAMMS EHR (Staff Scheduling Directory) | **`dbo.tblSCHEDUSER`** | `UsKey` | `int (4)` | No | Primary Key matching `Appointments.ResourceId`. |
| SAMMS EHR (Staff Scheduling Directory) | **`dbo.tblSCHEDUSER`** | `usrname` | `varchar (50)` | Yes | Clinician display name and schedule calendar owner (*Alicia Monroe*). |

---

## Module 14: Clinician Dashboard, Caseload Metrics & Urgent Alerts

### 14.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I need an operational dashboard showing my daily caseload metrics (total assigned, active in treatment, at-risk flags, holds placed), my immediate session agenda, and urgent clinical alerts.*
* **Business Rules**:
  1. **Caseload KPIs**: Calculated dynamically from `ClientMaster` and `tblTreatmentLevel`.
  2. **Today's Agenda**: Displays appointments scheduled for the current date where `Appointments.ResourceId = tblSCHEDUSER.UsKey`.
  3. **Urgent Alerts**: Flags patients with unreviewed positive UDS screens, overdue treatment plan reviews, or active dispensing holds.

### 14.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `StartDate` | `smalldatetime (4)` | Yes | Session start timestamp. Filtered for current day. |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `Status` | `int (4)` | Yes | Status ID (`1 = Scheduled`, `2 = Checked In`, `3 = Completed`). |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `ResourceId` | `int (4)` | Yes | Matches logged-in counselor `tblSCHEDUSER.UsKey`. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdCLTID` | `int (4)` | Yes | Patient ID with active hold. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdType` | `varchar (100)` | Yes | Hold category (*Counselor Hold*, *Medical Hold*). |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdEffectiveDT` | `datetime (8)` | Yes | Date hold was placed. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdRemoveDt` | `datetime (8)` | Yes | When `NULL`, hold is actively displayed in the alerts list. |

---

## Module 15: Sessions Agenda, 1-Click Arrival Indicators & Outcome Recording

### 15.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I want a daily session agenda where I can see which patients have checked in to my waiting room, join Zoom telehealth sessions, and record visit outcomes (Completed, No-Show, Rescheduled).*
* **Business Rules**:
  1. When a patient clicks "Check In" on their mobile app, the status pill on the clinician agenda instantly updates from `Scheduled` (gray) to **`Checked In` (green)** using `AppointmentAttend.aaDTENROLLED`.
  2. If a patient completes the session, the counselor marks it **`Completed`**, prompting the clinical progress note.
  3. If a patient fails to arrive, the counselor marks **`No Show`**, recording the excuse/outreach into `dbo.appointmentexcuse`.

### 15.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `UniqueId` | `int (4)` | No | Appointment identifier. |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `StartDate` | `smalldatetime (4)` | Yes | Appointment start time. |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `Subject` | `nvarchar (-1)` | Yes | Session title (*"Individual Counseling"*, *"Annual Medical"*). |
| SAMMS EHR (Scheduling Engine) | **`dbo.Appointments`** | `Location` | `nvarchar (-1)` | Yes | Location (*"Office 204"* or *"Telehealth / Zoom"*). |
| SAMMS EHR (Waiting Room Attendance) | **`dbo.AppointmentAttend`** | **`aaDTENROLLED`** | `date (3)` | Yes | **Patient Arrival Timestamp**: Displays green *"Checked In"* badge. |
| SAMMS EHR (Waiting Room Attendance) | **`dbo.AppointmentAttend`** | `aaDTREMOVED` | `date (3)` | Yes | Checkout / visit completion timestamp. |
| SAMMS EHR (Appointment Exceptions) | **`dbo.appointmentexcuse`** | `exReason` | `varchar (250)` | Yes | Recorded reason for missed visit or reschedule. |
| SAMMS EHR (Appointment Exceptions) | **`dbo.appointmentexcuse`** | `exCharge` | `money (8)` | Yes | Missed visit fee (or waiver). |

---

## Module 16: My Caseload Roster & Longitudinal Phase Tracking

### 16.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I need a centralized caseload roster to monitor each patient's tenure (days enrolled), treatment phase (Induction $\to$ Stabilization $\to$ Maintenance), take-home bottle tier, and compliance flags.*
* **Business Rules**:
  1. The roster lists all active patients where `ClientMaster.RefSource` or counselor assignment matches the user.
  2. Phase progression is pulled from `tblTreatmentLevel`.
  3. Patients overdue for mandatory 90-day treatment plan reviews (`InitialTreatmentPlan`) or missing monthly UDS screens are flagged with red alert badges.

### 16.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `ID` | `int (4)` | No | Patient Client ID. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `FirstName` | `nvarchar (50)` | Yes | Patient First Name. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `LastName` | `nvarchar (50)` | Yes | Patient Last Name. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `DOB` | `datetime (8)` | Yes | Date of Birth. |
| SAMMS EHR (`BHG_DR` MPI) | **`dbo.ClientMaster`** | `InitialContactDate` | `datetime (8)` | Yes | Calculates "Days Enrolled" in treatment. |
| SAMMS EHR (Treatment Phase Engine) | **`dbo.tblTreatmentLevel`** | `TreatmentLevel` | `varchar (50)` | Yes | Active treatment phase (*Induction*, *Stabilization*, *Maintenance*, *Step 1–6*). |
| SAMMS EHR (Medication Dispense Log) | **`dbo.tblDOSE`** | `bottletype` | `varchar (50)` | Yes | Dispensing classification (*Window Dose*, *Take-Home*). |
| SAMMS EHR (Randomized UDS Scheduler) | **`dbo.tblUASched`** | `uasDATE` | `datetime (8)` | Yes | Verifies whether monthly toxicology screen has been collected. |

---

## Module 17: Patient Chart Review, CBT Homework & Counselor Feedback

### 17.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor reviewing a patient's chart (`/admin-patients/:id`), I need to inspect submitted CBT exercises (urge-surfing logs, trigger maps), write personalized clinical feedback, and review past toxicology history.*
* **Business Rules**:
  1. When a patient submits a between-session CBT exercise in the Patient Portal, it populates in the patient's chart under **CBT Practice Review**.
  2. The counselor writes clinical feedback (`GaveFeedback = 1`, `DataContentTxt`), which instantly reflects on the patient's portal with a highlighted clinician feedback banner.

### 17.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | **`CBT`** | `bit (1)` | Yes | Flag: Cognitive Behavioral Therapy module review. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | **`Homework`** | `bit (1)` | Yes | Flag: Between-session practice submission. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | **`GaveFeedback`** | `bit (1)` | Yes | Flag: Counselor written feedback provided. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | **`DataContentTxt`** | `nvarchar (-1)` | Yes | **Counselor Clinical Feedback Text** displayed to patient. |
| SAMMS EHR (DAP Notes & CBT Homework) | **`dbo.DraftDAPNote`** | `StaffSignName` | `nvarchar (-1)` | Yes | Name of reviewing counselor (*Alicia Monroe, CADC-II*). |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `uarToxResult` | `varchar (50)` | Yes | Longitudinal toxicology summary history. |

---

## Module 18: Medication Dispensing Window Queue & Hold Management

### 18.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a clinic nurse or counselor monitoring the medication window (`/admin-check-ins`), I need to see patients waiting in the lobby, track wait times, and place or clear clinical holds before medication is dispensed.*
* **Business Rules**:
  1. The dispensing queue displays patients currently checked in at the dosing window ticket kiosk (`ciQUEUE`).
  2. `MinutesWaited` tracks operational lobby flow.
  3. Clinicians can place an immediate clinical hold or clear an existing hold by populating `hdRemoveDt = GETDATE()`, enabling the nurse to dose the patient.

### 18.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | `ciID` | `int (4)` | No | Queue event ID. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | `ciCLTNAME` | `varchar (100)` | Yes | Patient name in queue. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | **`ciQUEUE`** | `varchar (50)` | Yes | Lobby queue ticket number (e.g., `A-104`). |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | **`MinutesWaited`** | `int (4)` | Yes | Minutes elapsed since arrival check-in. |
| SAMMS EHR (Dosing Queue & Lobby) | **`dbo.tblCHECKIN`** | **`ciHOLD`** | `bit (1)` | Yes | Hold status flag displayed to dispensing nurse. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdType` | `varchar (100)` | Yes | Category: *Counselor Hold*, *Medical Hold*, *Billing Hold*. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdNote` | `varchar (-1)` | Yes | Reason for hold displayed in queue modal. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdRemoveDt` | `datetime (8)` | Yes | Hold clearance timestamp written when clinician releases hold. |
| SAMMS EHR (Dosing Hold Engine) | **`dbo.tblHOLD`** | `hdRemoveUser` | `varchar (50)` | Yes | Staff username who released the hold. |

---

## Module 19: Population Lab & Toxicology Monitoring

### 19.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a clinical director or counselor (`/admin-labs`), I need a bird's-eye view of all patient toxicology screens across my caseload, identifying presumptive point-of-care results versus certified GC/MS lab confirmations.*
* **Business Rules**:
  1. Identifies patients requiring clinical review for unexpected substances (`uardRX = 0` and `uardRESULT = 'Positive'`).
  2. Tracks collection adherence against monthly randomized mandates in `dbo.tblUASched`.

### 19.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `uarDT` | `datetime (8)` | Yes | Collection date. |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `uarToxResult` | `varchar (50)` | Yes | Overall presumptive panel outcome. |
| Reference Lab LIS (HL7 Interface) | **`dbo.tblUAResult`** | `LabName` | `varchar (50)` | Yes | Reference lab (*Cordant*, *Quest*, *Labcorp*). |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uaDetail` | `varchar (50)` | Yes | Tested substance name. |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uardRESULT` | `varchar (50)` | Yes | Presumptive result (*Positive* / *Negative*). |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uardRX` | `bit (1)` | Yes | Prescribed medication flag. |
| Reference Lab LIS (GC/MS Confirmation) | **`dbo.tblUAResultDetail`** | `uardConfResult` | `varchar (50)` | Yes | Certified GC/MS confirmatory value. |
| SAMMS EHR (Randomized UDS Scheduler) | **`dbo.tblUASched`** | `uasCollectedDate` | `datetime (8)` | Yes | Verified collection timestamp. |

---

## Module 20: Clinical Documentation (1-on-1 DAP / SOAP Session Notes)

### 20.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor completing an individual session (`/admin-session-note`), I must document the clinical encounter using standardized DAP (Data, Assessment, Plan) or SOAP templates compliant with ASAM, CARF, and state Medicaid standards.*
* **Business Rules**:
  1. The note captures session duration, visit modality (`TeleSession = 1` for Zoom vs. in-person), evidence-based practice topics addressed (`CBT = 1`), and clinical assessments.
  2. Electronic signatures (`StaffSignature`, `StaffSignatureDate`) lock the note against unauthorized retrospective modification.

### 20.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source (System of Record) | Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :--- | :---: | :--- |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `Id` | `int (4)` | No | Clinical progress note primary key. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `ClientId` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `ServiceDate` | `datetime (8)` | Yes | Date of clinical service. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `Sessionstarttime` | `nvarchar (50)` | Yes | Session start time. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `Sessionendtime` | `nvarchar (50)` | Yes | Session end time. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `TeleSession` | `bit (1)` | Yes | Modality flag (`1 = Zoom Telehealth`, `0 = In-Clinic`). |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `CBT` | `bit (1)` | Yes | Evidence-based practice: Cognitive Behavioral Therapy. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | **`txtData`** | `nvarchar (-1)` | Yes | **D - Data**: Subjective report and counselor observations. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | **`txtAssessment`** | `nvarchar (-1)` | Yes | **A - Assessment**: Clinical progress and mental status. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | **`txtPlan`** | `nvarchar (-1)` | Yes | **P - Plan**: Next session goals, homework, and referrals. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `StaffSignature` | `nvarchar (-1)` | Yes | Counselor digital cryptographic signature. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `StaffSignatureDate` | `datetime (8)` | Yes | Timestamp signature was applied. |
| SAMMS EHR (Clinical Progress Notes) | **`dbo.ProgressNote`** | `StaffSignatureBy` | `nvarchar (50)` | Yes | Counselor credentials and license number. |

---

# Consolidated Traceability Matrices

### Matrix A: BHG Patient Portal Screens $\leftrightarrow$ Database Mapping

| Patient Portal Screen / Feature | Business Purpose (BA) | Source (System of Record) | Primary SAMMS Table | Key Database Columns |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard Header** | Identity verification | SAMMS EHR (`BHG_DR` MPI) | `dbo.ClientMaster` | `ID`, `FirstName`, `LastName`, `DOB`, `UserClientID` |
| **Dosing Hours & Countdown** | Prevent missed doses | SAMMS EHR (Clinic Administration) | `dbo.tblCLINIC` | `HoursofDosing`, `DoseWarn`, `DoseStop`, `OpenOnSaturday` |
| **"No Holds Active" Shield** | Eliminate dosing anxiety | SAMMS EHR (Dosing Queue & Lobby) | `dbo.tblCHECKIN`, `tblHOLD` | `ciHOLD`, `ciQUEUE`, `hdType`, `hdNote`, `hdStopDose` |
| **Active Dosing Protocol** | Medication transparency | SAMMS EHR (Physician Orders & eRx) | `dbo.tblORDER`, `tblDOSE` | `Dose`, `medType`, `Sunday2-Saturday2`, `bottletype` |
| **Next Counseling Visit & Check-In** | Schedule & 1-click arrival | SAMMS EHR (Scheduling Engine) | `dbo.Appointments`, `AppointmentAttend` | `StartDate`, `Subject`, `Status`, `aaDTENROLLED` |
| **Take-Home Bottle Schedule** | Federal step compliance | SAMMS EHR (Take-Home Inventory) | `dbo.tblBottle`, `TakeHomeAgreement...` | `BottleID`, `LotNumber`, `InitialAmount`, `PatientSignature` |
| **Lab Results (UDS)** | Destigmatized toxicology | Reference Lab LIS (HL7 Interface) | `dbo.tblUAResult`, `tblUAResultDetail` | `uarDT`, `uaDetail`, `uardRESULT`, `uardRX` |
| **Recovery Progress & BAM** | Milestones & coping scores | SAMMS EHR (Treatment Phase Engine) | `dbo.tblTreatmentLevel`, `BAMForm` | `TreatmentLevel`, `SubscaleScoreTxt3`, `SF_Cows.Score` |
| **Between-Session CBT Practice** | Homework & counselor feedback | SAMMS EHR (DAP Notes & CBT Homework) | `dbo.DraftDAPNote` | `CBT`, `Homework`, `DataContentTxt`, `StaffSignName` |
| **Billing & Payments** | Copay balance & payment receipts | SAMMS EHR (Patient AR / FIFO Subledger) | `dbo.tblBill`, `tbl3pElig` | `FIFObalance`, `billBILL`, `billPAY`, `ePAYER`, `eSTATUS` |
| **Financial Hardship Application** | Sliding-scale relief application | BHG Patient Portal (Financial Engine) | `dbo.FinancialHardshipApplication` | `txtAnnualHouseholdIncome`, `StatusofApplication` |
| **Consents & 42 CFR Part 2** | Federal legal compliance & SMS | SAMMS EHR (42 CFR Part 2 Engine) | `dbo.ConsentToDisclosure...`, `SMSConsent` | `PatientSignature`, `WitnessSignature`, `Iagreetoreceivecalls` |
| **Treatment Center & Hours** | Operating hours & emergency line | SAMMS EHR (Clinic Directory) | `dbo.tblSITES`, `dbo.tblCLINIC` | `siteNAME`, `siteAddress`, `siteCity`, `HoursofDosing` |

---

### Matrix B: BHG Clinician Portal Screens $\leftrightarrow$ Database Mapping

| Clinician Portal Screen / Feature | Business Purpose (BA) | Source (System of Record) | Primary SAMMS Table | Key Database Columns |
| :--- | :--- | :--- | :--- | :--- |
| **Clinician Authentication** | Secure staff access & SSO | SAMMS EHR (Staff Security & Auth) | `dbo.UserLogins` | `UserName`, `Password`, `UserType`, `Active` |
| **Clinician Dashboard** | Daily operational command & KPIs | SAMMS EHR (Staff Scheduling Directory) | `dbo.tblSCHEDUSER`, `Appointments` | `UsKey`, `usrname`, `StartDate = TODAY`, `Status` |
| **Daily Sessions Agenda** | Schedule & waiting room monitor | SAMMS EHR (Scheduling & Attendance) | `Appointments`, `AppointmentAttend` | `aaDTENROLLED` (arrival pill), `Subject`, `Location` |
| **Session Outcome Recording** | Completed / No-Show logging | SAMMS EHR (Appointment Exceptions) | `Appointments`, `appointmentexcuse` | `Status = Completed`, `exReason`, `exCharge` |
| **My Caseload Roster** | Longitudinal tracking & retention | SAMMS EHR (Master Patient Index & Phasing) | `ClientMaster`, `tblTreatmentLevel` | `InitialContactDate` (days enrolled), `TreatmentLevel` |
| **Patient Profile & Charting** | Detailed clinical chart review | SAMMS EHR (Master Patient Index) | `ClientMaster`, `tblUAResult` | Full demographic chart, longitudinal UDS history |
| **CBT Homework Feedback** | Reviewing & answering patient CBT | SAMMS EHR (DAP Notes & CBT Homework) | `DraftDAPNote` | `CBT`, `Homework`, `GaveFeedback`, `DataContentTxt` |
| **Dispensing Queue Monitor** | Dosing window lobby flow | SAMMS EHR (Dosing Queue & Lobby) | `dbo.tblCHECKIN` | `ciQUEUE`, `MinutesWaited`, `ciSERVEDdtm` |
| **Clinical Hold Placement/Release** | Place or clear review flags | SAMMS EHR (Dosing Queue & Lobby) | `dbo.tblCHECKIN`, `dbo.tblHOLD` | `ciHOLD`, `hdType`, `hdNote`, `hdRemoveDt = NOW()` |
| **Group Sessions Management** | Cohort attendance & notes | SAMMS EHR (Clinical Group Therapy) | `dbo.GroupNoteSession` | `txtTopicDiscussed`, `txtIndividualContributions`, `txtPlan` |
| **Population Lab Monitoring** | Monitor caseload toxicology | Reference Lab LIS (HL7 Interface) | `tblUAResult`, `tblUAResultDetail` | `uarToxResult`, `uardRX`, `uardConfResult` |
| **Clinical Documentation (DAP Note)** | Structured session progress notes | SAMMS EHR (Clinical Progress Notes) | `dbo.ProgressNote`, `DraftDAPNote` | `txtData`, `txtAssessment`, `txtPlan`, `StaffSignature` |

