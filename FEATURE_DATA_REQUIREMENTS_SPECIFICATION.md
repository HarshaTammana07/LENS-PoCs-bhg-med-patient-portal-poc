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

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.ClientMaster`** | `ID` | `int (4)` | No | Internal Database Primary Key. |
| **`dbo.ClientMaster`** | `FirstName` | `nvarchar (50)` | Yes | Patient First Name. |
| **`dbo.ClientMaster`** | `LastName` | `nvarchar (50)` | Yes | Patient Last Name. |
| **`dbo.ClientMaster`** | `DOB` | `datetime (8)` | Yes | Date of Birth (Formatted as `MMM DD, YYYY`). |
| **`dbo.ClientMaster`** | `Gender` | `nvarchar (1)` | Yes | Gender (`M`, `F`, `O`). |
| **`dbo.ClientMaster`** | `UserClientID` | `varchar (50)` | Yes | Clinic-facing Client ID (e.g., `44029`). |
| **`dbo.ClientMaster`** | `SAMMSid` | `int (4)` | Yes | Enterprise SAMMS Master Patient Identifier. |
| **`dbo.ClientMaster`** | `InitialContactDate` | `datetime (8)` | Yes | Admission / Treatment Start Date. Used to calculate "Days Enrolled". |
| **`dbo.ClientMaster`** | `SSN` | `nvarchar (50)` | Yes | **Security Rule**: Gateway masks to `***-**-` + Right(`SSN`, 4). |
| **`dbo.tblSITES`** | `siteID` | `int (4)` | No | Site ID linking `ClientMaster.RefSource` or clinic site assignment. |
| **`dbo.tblSITES`** | `siteNAME` | `varchar (100)` | Yes | Clinic Center Name (e.g., *Knoxville Comprehensive Treatment Center*). |

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

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblCLINIC`** | `PKEY` | `int (4)` | No | Primary clinic configuration identifier. |
| **`dbo.tblCLINIC`** | `ClinicNAME` | `varchar (100)` | Yes | Official clinic legal name. |
| **`dbo.tblCLINIC`** | `HoursofDosing` | `varchar (500)` | Yes | Raw dosing hours string (e.g., `Mon-Fri: 5:00AM-10:30AM`). |
| **`dbo.tblCLINIC`** | `DoseWarn` | `nvarchar (50)` | Yes | Warning threshold timestamp before cutoff (e.g., `10:00 AM`). |
| **`dbo.tblCLINIC`** | `DoseStop` | `nvarchar (50)` | Yes | Daily hard stop cutoff time (e.g., `10:30 AM`). |
| **`dbo.tblCLINIC`** | `OpenOnSaturday` | `bit (1)` | Yes | Weekend operational flag (`1 = Open`, `0 = Closed`). |
| **`dbo.tblCLINIC`** | `OpenOnSunday` | `bit (1)` | Yes | Sunday operational flag (typical OTPs closed on Sunday for take-homes). |

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

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblCHECKIN`** | `ciID` | `int (4)` | No | Check-in event primary key. |
| **`dbo.tblCHECKIN`** | `ciCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.tblCHECKIN`** | **`ciHOLD`** | `bit (1)` | Yes | **Core Boolean Flag**: `0 = No Holds Active`, `1 = Active Hold`. |
| **`dbo.tblCHECKIN`** | `ciQUEUE` | `varchar (50)` | Yes | Dosing window lobby queue ticket number. |
| **`dbo.tblCHECKIN`** | `MinutesWaited` | `int (4)` | Yes | Minutes waited in lobby queue before dosing. |
| **`dbo.tblCHECKIN`** | `ciSERVEDdtm` | `datetime (8)` | Yes | Timestamp nurse dispensed dose at window. |
| **`dbo.tblHOLD`** | `hdID` | `int (4)` | No | Hold transaction record primary key. |
| **`dbo.tblHOLD`** | `hdCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.tblHOLD`** | `hdType` | `varchar (100)` | Yes | Category: `'Counselor'`, `'Medical'`, `'Administrative'`, `'Fee'`. |
| **`dbo.tblHOLD`** | `hdNote` | `varchar (-1)` | Yes | Detailed clinical explanation displayed to patient/staff. |
| **`dbo.tblHOLD`** | `hdEffectiveDT`| `datetime (8)` | Yes | Timestamp hold was placed. |
| **`dbo.tblHOLD`** | `hdStopDose` | `bit (1)` | No | `1 = Medication hard block`, `0 = Warning only`. |
| **`dbo.tblHOLD`** | `hdRemoveDt` | `datetime (8)` | Yes | When `NULL`, hold is active. When populated, hold is resolved. |
| **`dbo.tblHOLD`** | `hdRemoveUser` | `varchar (50)` | Yes | Staff username who cleared the hold. |

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

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblORDER`** | `OrderNum` | `int (4)` | No | Physician Order ID. |
| **`dbo.tblORDER`** | `cltID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.tblORDER`** | `medType` | `varchar (50)` | Yes | Medication name (`'Methadone'`, `'Buprenorphine/Naloxone'`). |
| **`dbo.tblORDER`** | `Dose` | `smallint (2)` | Yes | Active prescribed daily dose in milligrams (e.g., `85`). |
| **`dbo.tblORDER`** | `EffectiveDate` | `datetime (8)` | Yes | Order start date. |
| **`dbo.tblORDER`** | `ExpirationDate`| `datetime (8)` | Yes | Order expiration date. |
| **`dbo.tblORDER`** | `Active` | `bit (1)` | No | `1 = Currently active order`. |
| **`dbo.tblORDER`** | `Doctor` | `varchar (50)` | Yes | Ordering physician name (e.g., *Dr. Robert Vance, MD*). |
| **`dbo.tblORDER`** | `Sunday2`–`Saturday2`| `bit (1)` | No | Weekly take-home bottle schedule flags (`1 = Take-Home`). |
| **`dbo.tblDOSE`** | `DoseID` | `bigint (8)` | No | Dispense transaction record primary key. |
| **`dbo.tblDOSE`** | `dtMedDate` | `datetime (8)` | Yes | Date dose was scheduled for. |
| **`dbo.tblDOSE`** | `DTgiven` | `datetime (8)` | Yes | Exact timestamp nurse administered dose at window. |
| **`dbo.tblDOSE`** | `Dose` | `int (4)` | Yes | Milligrams dispensed. |
| **`dbo.tblDOSE`** | `bottletype` | `varchar (50)` | Yes | `'Window Dose'`, `'Take-Home'`, `'Sunday Bottle'`. |
| **`dbo.tblDOSE`** | `strUser` | `varchar (50)` | Yes | Dispensing nurse username. |

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

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.Appointments`** | `UniqueId` | `int (4)` | No | Appointment primary key. |
| **`dbo.Appointments`** | `StartDate` | `smalldatetime (4)`| Yes | Session start date and time. |
| **`dbo.Appointments`** | `EndDate` | `smalldatetime (4)`| Yes | Session end date and time. |
| **`dbo.Appointments`** | `Subject` | `nvarchar (-1)` | Yes | Visit title (*"Individual Counseling"*, *"Medical Exam"*). |
| **`dbo.Appointments`** | `Location` | `nvarchar (-1)` | Yes | Location (*"Office 204"* or *"Telehealth / Zoom"*). |
| **`dbo.Appointments`** | `Status` | `int (4)` | Yes | Status ID (`1 = Scheduled`, `2 = Checked In`, `3 = Completed`). |
| **`dbo.Appointments`** | `ResourceId` | `int (4)` | Yes | **Staff ID**: Links to `dbo.tblSCHEDUSER.UsKey` (Counselor). |
| **`dbo.AppointmentAttend`** | `aaaptID` | `int (4)` | Yes | Foreign Key linking to `Appointments.UniqueId`. |
| **`dbo.AppointmentAttend`** | `aacltid` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.AppointmentAttend`** | **`aaDTENROLLED`**| `date (3)` | Yes | **1-Click Check-In Timestamp**: Populated when patient clicks Check-In. |
| **`dbo.AppointmentAttend`** | `aaDTREMOVED` | `date (3)` | Yes | Session checkout / completion timestamp. |
| **`dbo.appointmentexcuse`** | `exAPTID` | `int (4)` | Yes | Foreign Key linking to `Appointments.UniqueId`. |
| **`dbo.appointmentexcuse`** | `exReason` | `varchar (250)` | Yes | Reschedule or missed appointment reason. |
| **`dbo.tblSCHEDUSER`** | `UsKey` | `int (4)` | No | Staff Provider ID matching `Appointments.ResourceId`. |
| **`dbo.tblSCHEDUSER`** | `usrname` | `varchar (50)` | Yes | Counselor login name / display name (*Alicia Monroe*). |

---

## Module 6: Group Therapy Documentation & Attendance

### 6.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor managing group cohorts (e.g., Relapse Prevention, Coping Skills), I need to track session attendance, log group topics, and document individual patient contributions.*
* **Business Rules**:
  1. Group sessions scheduled in `dbo.Appointments` (`IsSchedule = 1`) link to `dbo.GroupNoteSession`.
  2. Individual patient progress comments (`txtIndividualContributions`) must maintain cohort confidentiality under 42 CFR Part 2 (no other group member's name can appear in Jordan's note).

### 6.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.GroupNoteSession`** | `Id` | `int (4)` | No | Group session note primary key. |
| **`dbo.GroupNoteSession`** | `ClientId` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.GroupNoteSession`** | `ServiceDate` | `datetime (8)` | Yes | Date group was conducted. |
| **`dbo.GroupNoteSession`** | `txtTopicDiscussed`| `nvarchar (500)`| Yes | Group topic (e.g., *"Triggers and Urge Surfing"*). |
| **`dbo.GroupNoteSession`** | `txtIndividualContributions`| `nvarchar (-1)` | Yes | Individual patient engagement summary. |
| **`dbo.GroupNoteSession`** | `txtClinicianAssessment` | `nvarchar (-1)` | Yes | Counselor clinical assessment of patient progress. |
| **`dbo.GroupNoteSession`** | `txtPlan` | `nvarchar (-1)` | Yes | Follow-up homework and between-session plan. |
| **`dbo.GroupNoteSession`** | `counselor` | `nvarchar (255)`| Yes | Facilitating counselor name. |

---

## Module 7: Individual 1-on-1 Counseling & DAP Progress Notes

### 7.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I need to complete structured DAP (Data, Assessment, Plan) progress notes after each individual visit to document clinical interventions, CBT homework, and risk assessments.*
* **Business Rules**:
  1. Progress notes must capture whether CBT evidence-based practices were used (`CBT = 1`, `CopingSkills = 1`).
  2. The note must record mental status exam observations (mood, thought process, suicide/violence risk screening).
  3. Electronic signatures (`StaffSignature`) must be time-stamped for CARF and state Medicaid compliance.

### 7.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.DraftDAPNote`** | `Id` | `int (4)` | No | Clinical DAP note primary key. |
| **`dbo.DraftDAPNote`** | `ClientId` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.DraftDAPNote`** | `CBT` | `bit (1)` | Yes | Flag: Cognitive Behavioral Therapy delivered. |
| **`dbo.DraftDAPNote`** | `CopingSkills` | `bit (1)` | Yes | Flag: Coping skills education conducted. |
| **`dbo.DraftDAPNote`** | `RelapsePrevention` | `bit (1)` | Yes | Flag: Relapse prevention plan reviewed. |
| **`dbo.DraftDAPNote`** | `Homework` | `bit (1)` | Yes | **Between-Session Homework Assigned Flag**. |
| **`dbo.DraftDAPNote`** | `DataContentTxt` | `nvarchar (-1)`| Yes | **D - Data**: Patient subjective report and objective observations. |
| **`dbo.DraftDAPNote`** | `AssessmentInterventionsTxt`| `nvarchar (-1)` | Yes | **A - Assessment**: Clinical analysis of progress and response. |
| **`dbo.DraftDAPNote`** | `PlanningFollowUpHomework` | `bit (1)` | Yes | **P - Plan**: Assigned between-session exercises. |
| **`dbo.DraftDAPNote`** | `StaffSignature` | `nvarchar (-1)`| Yes | Counselor cryptographic digital signature. |
| **`dbo.DraftDAPNote`** | `StaffSignatureDate` | `datetime (8)` | Yes | Timestamp note was signed. |
| **`dbo.ProgressNote`** | `Id` | `int (4)` | No | Finalized progress note identifier. |
| **`dbo.ProgressNote`** | `Sessionstarttime` | `nvarchar (50)`| Yes | Session start time (e.g., `14:00`). |
| **`dbo.ProgressNote`** | `Sessionendtime` | `nvarchar (50)`| Yes | Session end time (e.g., `14:50`). |
| **`dbo.ProgressNote`** | `TeleSession` | `bit (1)` | Yes | `1 = Virtual Zoom Session`, `0 = In-Clinic`. |
| **`dbo.ProgressNote`** | `LastUDS` | `nvarchar (50)`| Yes | Most recent UDS collection date referenced in note. |
| **`dbo.ProgressNote`** | `UDSresults` | `nvarchar (50)`| Yes | Summary of recent toxicology results discussed. |

---

## Module 8: Take-Home Bottles & Diversion Control

### 8.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient progressing in recovery, I want to see my approved take-home bottle tier (e.g., Step 3: 3 take-home bottles), my bottle serial numbers, and sign my required diversion agreements.*
* **Business Rules**:
  1. Federal SAMHSA rules (42 CFR Part 8) restrict take-home bottles based on continuous treatment tenure and clean toxicology.
  2. Every take-home bottle must display an active DEA Lot Number and NDC identifier.
  3. The patient must have an active electronic signature on file acknowledging safe lockbox storage (`TakeHomeAgreementandDiversionControl`).

### 8.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblBottle`** | `BottleID` | `int (4)` | No | Unique bottle serial barcode number. |
| **`dbo.tblBottle`** | `BottleType` | `varchar (50)` | Yes | Classification (`'Step 3 Take-Home'`, `'Weekend'`). |
| **`dbo.tblBottle`** | `LotNumber` | `varchar (50)` | Yes | DEA batch lot identifier printed on label. |
| **`dbo.tblBottle`** | `InitialAmount` | `int (4)` | Yes | Prescribed dose volume per bottle (mg). |
| **`dbo.tblBottle`** | `dtReceived` | `datetime (8)` | Yes | Dispense timestamp when handed to patient. |
| **`dbo.tblBottle`** | `dtClosed` | `datetime (8)` | Yes | Returned/inspected date during bottle recall checks. |
| **`dbo.TakeHomeAgreementandDiversionControl`** | `PatientSignature` | `nvarchar (-1)` | Yes | Patient digital signature acknowledging diversion laws. |
| **`dbo.TakeHomeAgreementandDiversionControl`** | `PatientCurrentPhone` | `nvarchar (15)` | Yes | Emergency contact phone for random bottle recalls. |
| **`dbo.TakeHomeRiskAssessment`** | `TotalScore` | `nvarchar (20)` | Yes | Clinical risk score determining take-home tier. |
| **`dbo.TakeHomeRiskAssessment`** | `SafeguardingMedication` | `int (4)` | Yes | Lockbox safety verification rating. |
| **`dbo.DiversionControlNotificationofChange`**| `PatientSignatureDate` | `datetime (8)` | Yes | Acknowledgment date of diversion protocol changes. |

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

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblUAResult`** | `uarID` | `int (4)` | No | Screen encounter primary key. |
| **`dbo.tblUAResult`** | `uarCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.tblUAResult`** | `uarDT` | `datetime (8)` | Yes | Specimen collection date. |
| **`dbo.tblUAResult`** | `uarToxResult` | `varchar (50)` | Yes | Overall panel outcome. |
| **`dbo.tblUAResult`** | `LabName` | `varchar (50)` | Yes | Reference lab (*Cordant*, *Quest*, *Labcorp*). |
| **`dbo.tblUAResult`** | `SpecimenType` | `varchar (20)` | Yes | Specimen type (*'Urine'*, *'Oral Fluid'*). |
| **`dbo.tblUAResultDetail`** | `uardID` | `int (4)` | No | Substance line-item primary key. |
| **`dbo.tblUAResultDetail`** | `uardRECiD` | `int (4)` | Yes | Foreign Key linking to `tblUAResult.uarID`. |
| **`dbo.tblUAResultDetail`** | **`uaDetail`** | `varchar (50)` | Yes | Substance name (*Methadone*, *Opiates*, *Fentanyl*, *Benzos*). |
| **`dbo.tblUAResultDetail`** | **`uardRESULT`** | `varchar (50)` | Yes | Result (*'Negative'*, *'Positive'*). |
| **`dbo.tblUAResultDetail`** | **`uardRX`** | `bit (1)` | Yes | **Prescription Flag**: `1 = Prescribed Consistent (Green)`. |
| **`dbo.tblUAResultDetail`** | `uardCutOff` | `decimal (9)` | Yes | Detection cutoff threshold in ng/mL. |
| **`dbo.tblUAResultDetail`** | `uardConfResult` | `varchar (50)` | Yes | Certified GC/MS confirmatory value. |
| **`dbo.tblUASched`** | `uasDATE` | `datetime (8)` | Yes | Scheduled future random screen date. |
| **`dbo.HL7Lab Information`** | `LabAccountNumber` | `nvarchar (20)`| Yes | Clinic lab account number. |

---

## Module 10: Recovery Progress, ASAM Dimensions & Clinical Assessments

### 10.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I want to see my recovery phase progression (Induction $\to$ Stabilization $\to$ Maintenance), milestones achieved, and clinical strengths so that I stay motivated in treatment.*
* **Business Rules**:
  1. The progress ring reflects the current phase in `dbo.tblTreatmentLevel`.
  2. Standardized Brief Addiction Monitor (BAM) scores evaluate Coping & Protective factors (e.g., meeting attendance, positive social support).
  3. The master treatment plan evaluates all 6 ASAM dimensions.

### 10.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblTreatmentLevel`** | `TreatmentLevel`| `varchar (50)` | Yes | Treatment Phase: `'Induction'`, `'Stabilization'`, `'Maintenance'`, `'Step 3'`. |
| **`dbo.tblTreatmentLevel`** | `RecordOn` | `datetime (8)` | Yes | Phase approval / advancement date. |
| **`dbo.BAMForm`** | `BAMDate` | `datetime (8)` | Yes | Assessment administration date. |
| **`dbo.BAMForm`** | `SubscaleScoreTxt1` | `nvarchar (20)`| Yes | Substance Use Severity subscore. |
| **`dbo.BAMForm`** | `SubscaleScoreTxt2` | `nvarchar (20)`| Yes | Risk Factor index score. |
| **`dbo.BAMForm`** | `SubscaleScoreTxt3` | `nvarchar (20)`| Yes | **Protective / Coping Factor Score** (Powers Recovery Strength). |
| **`dbo.BAMScore`** | `Score` | `varchar (10)` | Yes | Consolidated BAM composite score. |
| **`dbo.SF_Cows`** | `Score` | `int (4)` | Yes | Total COWS score (`0-4 Mild`, `5-12 Moderate`, `>13 Severe`). |
| **`dbo.InitialTreatmentPlan`** | `DDLASAM1`–`6` | `int (4)` | Yes | Severity rating across ASAM Dimensions 1 through 6. |

---

## Module 11: Billing, Dues & Real-Time Insurance Coverage

### 11.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I want to view my current dues balance ($35.00), click "Pay Dues" with a card/HSA, view payment receipts, and see my active insurance card so that financial issues never cause a dosing hold.*
* **Business Rules**:
  1. Current outstanding balance is calculated using `FIFObalance` from `dbo.tblBill`.
  2. Electronic insurance eligibility (EDI 270/271) displays the active payer (*TennCare / BlueCare Tennessee*) and verification date.
  3. If a patient cannot pay, they can submit an in-app sliding-scale application via `dbo.FinancialHardshipApplication`.

### 11.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblBill`** | `billID` | `int (4)` | No | Bill transaction primary key. |
| **`dbo.tblBill`** | `billCLTID` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.tblBill`** | `billDate` | `datetime (8)` | Yes | Transaction date. |
| **`dbo.tblBill`** | **`billBILL`** | `money (8)` | Yes | Charge amount (e.g., `$15.00` daily copay). |
| **`dbo.tblBill`** | **`billPAY`** | `money (8)` | Yes | Payment received. |
| **`dbo.tblBill`** | `billPAYTYPE` | `varchar (50)` | Yes | Method (`'Credit Card'`, `'HSA'`, `'Cash'`, `'Medicaid'`). |
| **`dbo.tblBill`** | `billReceiptNum` | `int (4)` | Yes | Transaction receipt number. |
| **`dbo.tblBill`** | **`FIFObalance`** | `money (8)` | Yes | **Current Outstanding Dues Balance**. |
| **`dbo.tbl3pElig`** | `ePAYER` | `varchar (100)` | Yes | Primary Insurance Payer name (*TennCare*). |
| **`dbo.tbl3pElig`** | `eSTATUS` | `varchar (200)` | Yes | Eligibility Status (`'Active'`, `'Inactive'`). |
| **`dbo.tbl3pElig`** | `pyeligcheck` | `date (3)` | Yes | Last electronic verification date (EDI 271). |
| **`dbo.FinancialHardshipApplication`**| `txtAnnualHouseholdIncome` | `nvarchar (50)`| Yes | Self-reported income for sliding-fee scale. |
| **`dbo.FinancialHardshipApplication`**| `StatusofApplication`| `nvarchar (-1)` | Yes | Status (`'Approved'`, `'Under Review'`). |
| **`dbo.FinancialHardshipApplication`**| `PayClassApproved` | `nvarchar (-1)` | Yes | Discounted fee category approved by billing team. |

---

## Module 12: Digital Consents, 42 CFR Part 2 Releases & Notifications

### 12.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a patient, I must digitally sign my 42 CFR Part 2 Releases of Information (ROI), review treatment agreements, and opt in to SMS appointment reminders.*
* **Business Rules**:
  1. Under **42 CFR Part 2**, substance use disorder treatment data cannot be disclosed without an unexpired, signed consent form.
  2. TCPA regulations require explicit opt-in (`Iagreetoreceivecalls = 1`) before automated SMS appointment reminders are sent.
  3. In-app mobile banners (`scx.ScxMobileBanner`) and bell alerts (`scx.Notification`) inform patients of schedule changes and clinic notices.

### 12.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.ConsentToDisclosureofPatientInfo`**| `DateOfEnrollment`| `datetime (8)` | Yes | Date ROI was initiated. |
| **`dbo.ConsentToDisclosureofPatientInfo`**| `PatientSignature` | `nvarchar (-1)` | Yes | Cryptographic or drawn patient digital signature. |
| **`dbo.ConsentToDisclosureofPatientInfo`**| `PatientSignatureDate`| `datetime (8)` | Yes | Timestamp of patient signature. |
| **`dbo.ConsentToDisclosureofPatientInfo`**| `WitnessSignature` | `nvarchar (-1)` | Yes | Clinical staff counter-signature. |
| **`dbo.SMSConsent`** | `Iagreetoreceivecalls` | `bit (1)` | Yes | **TCPA SMS Consent Flag**: `1 = Opted In`. |
| **`dbo.SMSConsent`** | `ClientSignatureDate` | `datetime (8)` | Yes | SMS consent signature timestamp. |
| **`scx.ScxMobileBanner`** | `DeviceType` | `nvarchar (512)`| Yes | Target platform (`'iOS'`, `'Android'`, `'Web'`). |
| **`scx.ScxMobileBanner`** | `Path` | `nvarchar (1024)`| Yes | Banner graphic or navigation deep-link. |
| **`scx.Notification`** | `Body` | `nvarchar (-1)` | No | In-app notification text content. |
| **`scx.Notification`** | `NotificationType` | `nvarchar (-1)` | No | Category (`'Appointment'`, `'LabResult'`, `'DosingNotice'`). |
| **`scx.Notification`** | `SendOn` | `datetime (8)` | No | Scheduled notification dispatch timestamp. |
| **`dbo.ClientCommunicationLog`** | `cltPhone` | `nvarchar (-1)` | Yes | Verified patient phone for 8x8 SMS routing. |
| **`dbo.ClientCommunicationLog`** | `cltemail` | `nvarchar (-1)` | Yes | Patient email for appointment confirmations. |

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

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.UserLogins`** | `UserName` | `nvarchar (50)` | No | Clinician login username / email. |
| **`dbo.UserLogins`** | `Password` | `nvarchar (50)` | Yes | Hashed credentials (or Azure Active Directory SSO hash). |
| **`dbo.UserLogins`** | `UserType` | `nvarchar (50)` | Yes | Staff role (`'Counselor'`, `'MedicalDirector'`, `'Nurse'`, `'Admin'`). |
| **`dbo.UserLogins`** | `Active` | `bit (1)` | No | Employment status flag (`1 = Active`, `0 = Inactive`). |
| **`dbo.tblSCHEDUSER`** | `UsKey` | `int (4)` | No | Primary Key matching `Appointments.ResourceId`. |
| **`dbo.tblSCHEDUSER`** | `usrname` | `varchar (50)` | Yes | Clinician display name and schedule calendar owner (*Alicia Monroe*). |

---

## Module 14: Clinician Dashboard, Caseload Metrics & Urgent Alerts

### 14.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I need an operational dashboard showing my daily caseload metrics (total assigned, active in treatment, at-risk flags, holds placed), my immediate session agenda, and urgent clinical alerts.*
* **Business Rules**:
  1. **Caseload KPIs**: Calculated dynamically from `ClientMaster` and `tblTreatmentLevel`.
  2. **Today's Agenda**: Displays appointments scheduled for the current date where `Appointments.ResourceId = tblSCHEDUSER.UsKey`.
  3. **Urgent Alerts**: Flags patients with unreviewed positive UDS screens, overdue treatment plan reviews, or active dispensing holds.

### 14.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.Appointments`** | `StartDate` | `smalldatetime (4)`| Yes | Session start timestamp. Filtered for current day. |
| **`dbo.Appointments`** | `Status` | `int (4)` | Yes | Status ID (`1 = Scheduled`, `2 = Checked In`, `3 = Completed`). |
| **`dbo.Appointments`** | `ResourceId` | `int (4)` | Yes | Matches logged-in counselor `tblSCHEDUSER.UsKey`. |
| **`dbo.tblHOLD`** | `hdCLTID` | `int (4)` | Yes | Patient ID with active hold. |
| **`dbo.tblHOLD`** | `hdType` | `varchar (100)` | Yes | Hold category (*Counselor Hold*, *Medical Hold*). |
| **`dbo.tblHOLD`** | `hdEffectiveDT`| `datetime (8)` | Yes | Date hold was placed. |
| **`dbo.tblHOLD`** | `hdRemoveDt` | `datetime (8)` | Yes | When `NULL`, hold is actively displayed in the alerts list. |

---

## Module 15: Sessions Agenda, 1-Click Arrival Indicators & Outcome Recording

### 15.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I want a daily session agenda where I can see which patients have checked in to my waiting room, join Zoom telehealth sessions, and record visit outcomes (Completed, No-Show, Rescheduled).*
* **Business Rules**:
  1. When a patient clicks "Check In" on their mobile app, the status pill on the clinician agenda instantly updates from `Scheduled` (gray) to **`Checked In` (green)** using `AppointmentAttend.aaDTENROLLED`.
  2. If a patient completes the session, the counselor marks it **`Completed`**, prompting the clinical progress note.
  3. If a patient fails to arrive, the counselor marks **`No Show`**, recording the excuse/outreach into `dbo.appointmentexcuse`.

### 15.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.Appointments`** | `UniqueId` | `int (4)` | No | Appointment identifier. |
| **`dbo.Appointments`** | `StartDate` | `smalldatetime (4)`| Yes | Appointment start time. |
| **`dbo.Appointments`** | `Subject` | `nvarchar (-1)` | Yes | Session title (*"Individual Counseling"*, *"Annual Medical"*). |
| **`dbo.Appointments`** | `Location` | `nvarchar (-1)` | Yes | Location (*"Office 204"* or *"Telehealth / Zoom"*). |
| **`dbo.AppointmentAttend`** | **`aaDTENROLLED`**| `date (3)` | Yes | **Patient Arrival Timestamp**: Displays green *"Checked In"* badge. |
| **`dbo.AppointmentAttend`** | `aaDTREMOVED` | `date (3)` | Yes | Checkout / visit completion timestamp. |
| **`dbo.appointmentexcuse`** | `exReason` | `varchar (250)` | Yes | Recorded reason for missed visit or reschedule. |
| **`dbo.appointmentexcuse`** | `exCharge` | `money (8)` | Yes | Missed visit fee (or waiver). |

---

## Module 16: My Caseload Roster & Longitudinal Phase Tracking

### 16.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor, I need a centralized caseload roster to monitor each patient's tenure (days enrolled), treatment phase (Induction $\to$ Stabilization $\to$ Maintenance), take-home bottle tier, and compliance flags.*
* **Business Rules**:
  1. The roster lists all active patients where `ClientMaster.RefSource` or counselor assignment matches the user.
  2. Phase progression is pulled from `tblTreatmentLevel`.
  3. Patients overdue for mandatory 90-day treatment plan reviews (`InitialTreatmentPlan`) or missing monthly UDS screens are flagged with red alert badges.

### 16.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.ClientMaster`** | `ID` | `int (4)` | No | Patient Client ID. |
| **`dbo.ClientMaster`** | `FirstName` | `nvarchar (50)` | Yes | Patient First Name. |
| **`dbo.ClientMaster`** | `LastName` | `nvarchar (50)` | Yes | Patient Last Name. |
| **`dbo.ClientMaster`** | `DOB` | `datetime (8)` | Yes | Date of Birth. |
| **`dbo.ClientMaster`** | `InitialContactDate` | `datetime (8)` | Yes | Calculates "Days Enrolled" in treatment. |
| **`dbo.tblTreatmentLevel`** | `TreatmentLevel`| `varchar (50)` | Yes | Active treatment phase (*Induction*, *Stabilization*, *Maintenance*, *Step 1–6*). |
| **`dbo.tblDOSE`** | `bottletype` | `varchar (50)` | Yes | Dispensing classification (*Window Dose*, *Take-Home*). |
| **`dbo.tblUASched`** | `uasDATE` | `datetime (8)` | Yes | Verifies whether monthly toxicology screen has been collected. |

---

## Module 17: Patient Chart Review, CBT Homework & Counselor Feedback

### 17.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor reviewing a patient's chart (`/admin-patients/:id`), I need to inspect submitted CBT exercises (urge-surfing logs, trigger maps), write personalized clinical feedback, and review past toxicology history.*
* **Business Rules**:
  1. When a patient submits a between-session CBT exercise in the Patient Portal, it populates in the patient's chart under **CBT Practice Review**.
  2. The counselor writes clinical feedback (`GaveFeedback = 1`, `DataContentTxt`), which instantly reflects on the patient's portal with a highlighted clinician feedback banner.

### 17.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.DraftDAPNote`** | **`CBT`** | `bit (1)` | Yes | Flag: Cognitive Behavioral Therapy module review. |
| **`dbo.DraftDAPNote`** | **`Homework`** | `bit (1)` | Yes | Flag: Between-session practice submission. |
| **`dbo.DraftDAPNote`** | **`GaveFeedback`** | `bit (1)` | Yes | Flag: Counselor written feedback provided. |
| **`dbo.DraftDAPNote`** | **`DataContentTxt`**| `nvarchar (-1)`| Yes | **Counselor Clinical Feedback Text** displayed to patient. |
| **`dbo.DraftDAPNote`** | `StaffSignName` | `nvarchar (-1)` | Yes | Name of reviewing counselor (*Alicia Monroe, CADC-II*). |
| **`dbo.tblUAResult`** | `uarToxResult` | `varchar (50)` | Yes | Longitudinal toxicology summary history. |

---

## Module 18: Medication Dispensing Window Queue & Hold Management

### 18.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a clinic nurse or counselor monitoring the medication window (`/admin-check-ins`), I need to see patients waiting in the lobby, track wait times, and place or clear clinical holds before medication is dispensed.*
* **Business Rules**:
  1. The dispensing queue displays patients currently checked in at the dosing window ticket kiosk (`ciQUEUE`).
  2. `MinutesWaited` tracks operational lobby flow.
  3. Clinicians can place an immediate clinical hold or clear an existing hold by populating `hdRemoveDt = GETDATE()`, enabling the nurse to dose the patient.

### 18.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblCHECKIN`** | `ciID` | `int (4)` | No | Queue event ID. |
| **`dbo.tblCHECKIN`** | `ciCLTNAME` | `varchar (100)` | Yes | Patient name in queue. |
| **`dbo.tblCHECKIN`** | **`ciQUEUE`** | `varchar (50)` | Yes | Lobby queue ticket number (e.g., `A-104`). |
| **`dbo.tblCHECKIN`** | **`MinutesWaited`**| `int (4)` | Yes | Minutes elapsed since arrival check-in. |
| **`dbo.tblCHECKIN`** | **`ciHOLD`** | `bit (1)` | Yes | Hold status flag displayed to dispensing nurse. |
| **`dbo.tblHOLD`** | `hdType` | `varchar (100)` | Yes | Category: *Counselor Hold*, *Medical Hold*, *Billing Hold*. |
| **`dbo.tblHOLD`** | `hdNote` | `varchar (-1)` | Yes | Reason for hold displayed in queue modal. |
| **`dbo.tblHOLD`** | `hdRemoveDt` | `datetime (8)` | Yes | Hold clearance timestamp written when clinician releases hold. |
| **`dbo.tblHOLD`** | `hdRemoveUser` | `varchar (50)` | Yes | Staff username who released the hold. |

---

## Module 19: Population Lab & Toxicology Monitoring

### 19.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a clinical director or counselor (`/admin-labs`), I need a bird's-eye view of all patient toxicology screens across my caseload, identifying presumptive point-of-care results versus certified GC/MS lab confirmations.*
* **Business Rules**:
  1. Identifies patients requiring clinical review for unexpected substances (`uardRX = 0` and `uardRESULT = 'Positive'`).
  2. Tracks collection adherence against monthly randomized mandates in `dbo.tblUASched`.

### 19.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.tblUAResult`** | `uarDT` | `datetime (8)` | Yes | Collection date. |
| **`dbo.tblUAResult`** | `uarToxResult` | `varchar (50)` | Yes | Overall presumptive panel outcome. |
| **`dbo.tblUAResult`** | `LabName` | `varchar (50)` | Yes | Reference lab (*Cordant*, *Quest*, *Labcorp*). |
| **`dbo.tblUAResultDetail`** | `uaDetail` | `varchar (50)` | Yes | Tested substance name. |
| **`dbo.tblUAResultDetail`** | `uardRESULT` | `varchar (50)` | Yes | Presumptive result (*Positive* / *Negative*). |
| **`dbo.tblUAResultDetail`** | `uardRX` | `bit (1)` | Yes | Prescribed medication flag. |
| **`dbo.tblUAResultDetail`** | `uardConfResult` | `varchar (50)` | Yes | Certified GC/MS confirmatory value. |
| **`dbo.tblUASched`** | `uasCollectedDate` | `datetime (8)` | Yes | Verified collection timestamp. |

---

## Module 20: Clinical Documentation (1-on-1 DAP / SOAP Session Notes)

### 20.1 Business & Clinical Requirements (BA Perspective)
* **User Story**: *As a counselor completing an individual session (`/admin-session-note`), I must document the clinical encounter using standardized DAP (Data, Assessment, Plan) or SOAP templates compliant with ASAM, CARF, and state Medicaid standards.*
* **Business Rules**:
  1. The note captures session duration, visit modality (`TeleSession = 1` for Zoom vs. in-person), evidence-based practice topics addressed (`CBT = 1`), and clinical assessments.
  2. Electronic signatures (`StaffSignature`, `StaffSignatureDate`) lock the note against unauthorized retrospective modification.

### 20.2 Database Source Tables & Column Mapping (Tech Perspective)

| Source Table | Column Name | Data Type | Nullable | Field Role & Transformation Logic |
| :--- | :--- | :--- | :---: | :--- |
| **`dbo.ProgressNote`** | `Id` | `int (4)` | No | Clinical progress note primary key. |
| **`dbo.ProgressNote`** | `ClientId` | `int (4)` | Yes | Foreign Key linking to `ClientMaster.ID`. |
| **`dbo.ProgressNote`** | `ServiceDate` | `datetime (8)` | Yes | Date of clinical service. |
| **`dbo.ProgressNote`** | `Sessionstarttime` | `nvarchar (50)`| Yes | Session start time. |
| **`dbo.ProgressNote`** | `Sessionendtime` | `nvarchar (50)`| Yes | Session end time. |
| **`dbo.ProgressNote`** | `TeleSession` | `bit (1)` | Yes | Modality flag (`1 = Zoom Telehealth`, `0 = In-Clinic`). |
| **`dbo.ProgressNote`** | `CBT` | `bit (1)` | Yes | Evidence-based practice: Cognitive Behavioral Therapy. |
| **`dbo.ProgressNote`** | **`txtData`** | `nvarchar (-1)`| Yes | **D - Data**: Subjective report and counselor observations. |
| **`dbo.ProgressNote`** | **`txtAssessment`** | `nvarchar (-1)`| Yes | **A - Assessment**: Clinical progress and mental status. |
| **`dbo.ProgressNote`** | **`txtPlan`** | `nvarchar (-1)`| Yes | **P - Plan**: Next session goals, homework, and referrals. |
| **`dbo.ProgressNote`** | `StaffSignature` | `nvarchar (-1)`| Yes | Counselor digital cryptographic signature. |
| **`dbo.ProgressNote`** | `StaffSignatureDate` | `datetime (8)` | Yes | Timestamp signature was applied. |
| **`dbo.ProgressNote`** | `StaffSignatureBy` | `nvarchar (50)`| Yes | Counselor credentials and license number. |

---

# Consolidated Traceability Matrices

### Matrix A: BHG Patient Portal Screens $\leftrightarrow$ Database Mapping

| Patient Portal Screen / Feature | Business Purpose (BA) | Primary SAMMS Table | Key Database Columns |
| :--- | :--- | :--- | :--- |
| **Dashboard Header** | Identity verification | `dbo.ClientMaster` | `ID`, `FirstName`, `LastName`, `DOB`, `UserClientID` |
| **Dosing Hours & Countdown** | Prevent missed doses | `dbo.tblCLINIC` | `HoursofDosing`, `DoseWarn`, `DoseStop`, `OpenOnSaturday` |
| **"No Holds Active" Shield** | Eliminate dosing anxiety | `dbo.tblCHECKIN`, `tblHOLD` | `ciHOLD`, `ciQUEUE`, `hdType`, `hdNote`, `hdStopDose` |
| **Active Dosing Protocol** | Medication transparency | `dbo.tblORDER`, `tblDOSE` | `Dose`, `medType`, `Sunday2-Saturday2`, `bottletype` |
| **Next Counseling Visit & Check-In** | Schedule & 1-click arrival | `dbo.Appointments`, `AppointmentAttend` | `StartDate`, `Subject`, `Status`, `aaDTENROLLED` |
| **Take-Home Bottle Schedule** | Federal step compliance | `dbo.tblBottle`, `TakeHomeAgreement...`| `BottleID`, `LotNumber`, `InitialAmount`, `PatientSignature` |
| **Lab Results (UDS)** | Destigmatized toxicology | `dbo.tblUAResult`, `tblUAResultDetail` | `uarDT`, `uaDetail`, `uardRESULT`, `uardRX` |
| **Recovery Progress & BAM** | Milestones & coping scores | `dbo.tblTreatmentLevel`, `BAMForm` | `TreatmentLevel`, `SubscaleScoreTxt3`, `SF_Cows.Score` |
| **Between-Session CBT Practice**| Homework & counselor feedback | `dbo.DraftDAPNote` | `CBT`, `Homework`, `DataContentTxt`, `StaffSignName` |
| **Billing & Payments** | Copay balance & payment receipts | `dbo.tblBill`, `tbl3pElig` | `FIFObalance`, `billBILL`, `billPAY`, `ePAYER`, `eSTATUS` |
| **Financial Hardship Application**| Sliding-scale relief application | `dbo.FinancialHardshipApplication` | `txtAnnualHouseholdIncome`, `StatusofApplication` |
| **Consents & 42 CFR Part 2** | Federal legal compliance & SMS | `dbo.ConsentToDisclosure...`, `SMSConsent`| `PatientSignature`, `WitnessSignature`, `Iagreetoreceivecalls` |
| **Treatment Center & Hours** | Operating hours & emergency line | `dbo.tblSITES`, `dbo.tblCLINIC` | `siteNAME`, `siteAddress`, `siteCity`, `HoursofDosing` |

---

### Matrix B: BHG Clinician Portal Screens $\leftrightarrow$ Database Mapping

| Clinician Portal Screen / Feature | Business Purpose (BA) | Primary SAMMS Table | Key Database Columns |
| :--- | :--- | :--- | :--- |
| **Clinician Authentication** | Secure staff access & SSO | `dbo.UserLogins` | `UserName`, `Password`, `UserType`, `Active` |
| **Clinician Dashboard** | Daily operational command & KPIs | `dbo.tblSCHEDUSER`, `Appointments` | `UsKey`, `usrname`, `StartDate = TODAY`, `Status` |
| **Daily Sessions Agenda** | Schedule & waiting room monitor | `Appointments`, `AppointmentAttend` | `aaDTENROLLED` (arrival pill), `Subject`, `Location` |
| **Session Outcome Recording** | Completed / No-Show logging | `Appointments`, `appointmentexcuse`| `Status = Completed`, `exReason`, `exCharge` |
| **My Caseload Roster** | Longitudinal tracking & retention| `ClientMaster`, `tblTreatmentLevel`| `InitialContactDate` (days enrolled), `TreatmentLevel` |
| **Patient Profile & Charting** | Detailed clinical chart review | `ClientMaster`, `tblUAResult` | Full demographic chart, longitudinal UDS history |
| **CBT Homework Feedback** | Reviewing & answering patient CBT| `DraftDAPNote` | `CBT`, `Homework`, `GaveFeedback`, `DataContentTxt` |
| **Dispensing Queue Monitor** | Dosing window lobby flow | `dbo.tblCHECKIN` | `ciQUEUE`, `MinutesWaited`, `ciSERVEDdtm` |
| **Clinical Hold Placement/Release**| Place or clear review flags | `dbo.tblCHECKIN`, `dbo.tblHOLD` | `ciHOLD`, `hdType`, `hdNote`, `hdRemoveDt = NOW()` |
| **Group Sessions Management** | Cohort attendance & notes | `dbo.GroupNoteSession` | `txtTopicDiscussed`, `txtIndividualContributions`, `txtPlan` |
| **Population Lab Monitoring** | Monitor caseload toxicology | `tblUAResult`, `tblUAResultDetail` | `uarToxResult`, `uardRX`, `uardConfResult` |
| **Clinical Documentation (DAP Note)**| Structured session progress notes | `dbo.ProgressNote`, `DraftDAPNote` | `txtData`, `txtAssessment`, `txtPlan`, `StaffSignature` |

