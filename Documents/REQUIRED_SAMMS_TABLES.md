# Required SAMMS Tables for BHG Patient & Clinician Portals

> **Document Purpose**: This document provides the curated priority list of the **32 essential SAMMS tables** required to power both the **BHG Patient Portal** and the **Clinician Portal**. It includes a copy-pasteable plain list of table names ready for SQL queries or extraction scripts.

---

## 1. Quick Copy-Paste: Plain List of Tables

Use these quick formats to query or extract column definitions from your database:

### Format A: Plain List (One per line)
```text
dbo.tblCHECKIN
dbo.tblHOLD
dbo.tblDOSE
dbo.tblLiquidLog
dbo.tblDoctorsOrder
dbo.tblORDER
dbo.tblCLINIC
dbo.Appointments
dbo.AppointmentAttend
dbo.appointmentexcuse
dbo.GroupNoteSession
dbo.tblBottle
dbo.TakeHomeAgreementandDiversionControl
dbo.TakeHomeRiskAssessment
dbo.DiversionControlNotificationofChange
dbo.tblUAResult
dbo.tblUAResultDetail
dbo.tblUASched
dbo.HL7Lab Information
dbo.tblTreatmentLevel
dbo.BAMScore
dbo.BAMForm
dbo.SF_Cows
dbo.InitialTreatmentPlan
dbo.ClientMaster
dbo.PatientDemo
dbo.tblUser
dbo.tblUserCredentials
dbo.tblSITES
dbo.tblBill
dbo.tbl3pBill
dbo.tbl3pElig
dbo.FinancialHardshipApplication
dbo.ConsentToDisclosureofPatientInfo
dbo.tblCONSENTS
scx.ScxMobileBanner
dbo.SMSConsent
```

---

### Format B: SQL `IN` Clause
```sql
TABLE_NAME IN (
  'tblCHECKIN',
  'tblHOLD',
  'tblDOSE',
  'tblLiquidLog',
  'tblDoctorsOrder',
  'tblORDER',
  'tblCLINIC',
  'Appointments',
  'AppointmentAttend',
  'appointmentexcuse',
  'GroupNoteSession',
  'tblBottle',
  'TakeHomeAgreementandDiversionControl',
  'TakeHomeRiskAssessment',
  'DiversionControlNotificationofChange',
  'tblUAResult',
  'tblUAResultDetail',
  'tblUASched',
  'HL7Lab Information',
  'tblTreatmentLevel',
  'BAMScore',
  'BAMForm',
  'SF_Cows',
  'InitialTreatmentPlan',
  'ClientMaster',
  'PatientDemo',
  'tblUser',
  'tblUserCredentials',
  'tblSITES',
  'tblBill',
  'tbl3pBill',
  'tbl3pElig',
  'FinancialHardshipApplication',
  'ConsentToDisclosureofPatientInfo',
  'tblCONSENTS',
  'ScxMobileBanner',
  'SMSConsent'
)
```

---

### Format C: Comma-Separated List
```text
dbo.tblCHECKIN, dbo.tblHOLD, dbo.tblDOSE, dbo.tblLiquidLog, dbo.tblDoctorsOrder, dbo.tblORDER, dbo.tblCLINIC, dbo.Appointments, dbo.AppointmentAttend, dbo.appointmentexcuse, dbo.GroupNoteSession, dbo.tblBottle, dbo.TakeHomeAgreementandDiversionControl, dbo.TakeHomeRiskAssessment, dbo.DiversionControlNotificationofChange, dbo.tblUAResult, dbo.tblUAResultDetail, dbo.tblUASched, dbo.HL7Lab Information, dbo.tblTreatmentLevel, dbo.BAMScore, dbo.BAMForm, dbo.SF_Cows, dbo.InitialTreatmentPlan, dbo.ClientMaster, dbo.PatientDemo, dbo.tblUser, dbo.tblUserCredentials, dbo.tblSITES, dbo.tblBill, dbo.tbl3pBill, dbo.tbl3pElig, dbo.FinancialHardshipApplication, dbo.ConsentToDisclosureofPatientInfo, dbo.tblCONSENTS, scx.ScxMobileBanner, dbo.SMSConsent
```

---

## 2. Detailed Table Breakdown & Key Fields Needed

---

### 2.1 Medication Dispensing, Dosing & Holds
*Powers the patient dashboard green shield ("No holds active"), daily dispensing windows, and the clinician `/admin-check-ins` medication window status.*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 1 | **`dbo.tblCHECKIN`** | Dashboard hold banner & clinic arrival queue | `CiHold` (Hold status flag), `CiCltid` (Client ID), `CiDate`, `CiTime`, `CiQueue`, `MinutesWaited`, `CiServeddtm` |
| 2 | **`dbo.tblHOLD`** | Hold resolution & clinical warning alerts | Hold reason, hold category (Medical / Counselor / Fee), date placed, active flag, releasing staff ID |
| 3 | **`dbo.tblDOSE`** | Prescribed dose (e.g. 85mg) & dispensing history | Client ID, dose amount (mg), medication type (Methadone / Suboxone), dispense timestamp, bottle flag |
| 4 | **`dbo.tblLiquidLog`** | Nurse liquid dispensing reconciliation | Stock bottle ID, administered volume, nurse ID, date/time |
| 5 | **`dbo.tblDoctorsOrder`** *(or `dbo.tblORDER`)* | Physician active prescription orders | Active dose order, titration changes, prescriber NPI/signature, effective start/end dates |
| 6 | **`dbo.tblCLINIC`** | Operating hours & dosing window rules | Dosing start/stop cutoff times (`DoseStop`), Saturday hours, holiday hours, site code |

---

### 2.2 Appointments, Scheduling & 1-Click Check-In
*Powers the Next Counseling Visit card, the patient `/visits` page, and the Clinician Daily Agenda (`/admin-sessions`).*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 7 | **`dbo.Appointments`** | 1-on-1 counseling, medical reviews & group schedule | Appointment ID, Client ID, Counselor/Staff ID, Start/End date-time, appointment type, status (`Scheduled`, `Checked In`, `Completed`, `Rescheduled`), location (Office / Zoom) |
| 8 | **`dbo.AppointmentAttend`** | Patient 1-click check-in & virtual waiting room | Appointment ID, Client ID, check-in timestamp (`aaDTENROLLED`), attended flag, no-show flag |
| 9 | **`dbo.appointmentexcuse`** | Missed visit reasons & follow-up triage | Appointment ID, excuse reason, counselor approval |
| 10 | **`dbo.GroupNoteSession`** | Group therapy cohort sessions (`/admin-group-sessions`) | Group session title, date, counselor ID, topic, roster attendance link |

---

### 2.3 Take-Home Bottles & Diversion Control
*Powers the Take-Home Step schedule (Step 1 to Step 6), bottle count verification, and random call-backs.*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 11 | **`dbo.tblBottle`** | Take-home bottle serials & counts | Bottle ID, DEA lot number, bottle type (weekend / multi-day), date issued, return/inspection status |
| 12 | **`dbo.TakeHomeAgreementandDiversionControl`** | Patient take-home legal agreement | Agreement date, patient digital signature, lockbox agreement verification |
| 13 | **`dbo.TakeHomeRiskAssessment`** | Phase step advancement justification | Stability score, continuous clean UDS count, approved step tier |
| 14 | **`dbo.DiversionControlNotificationofChange`** | Bottle recall & random inspection alerts | Notification date, call-back deadline, patient compliance status |

---

### 2.4 Urine Drug Screen (UDS) & Toxicology Tracking
*Powers the patient `/labs` screen (destigmatized results) and the clinician `/admin-labs` monitoring dashboard.*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 15 | **`dbo.tblUAResult`** | Specimen collection encounter log | Screen ID, Client ID, collection/drop date (`UarDropDt`), result release date (`UarResultDt`), collector notes |
| 16 | **`dbo.tblUAResultDetail`** | Specific substance panel test results | Substance name (Methadone, Buprenorphine, Opiates, Fentanyl, Oxycodone, Cocaine, Benzodiazepines, THC), result (pos/neg), prescribed medication flag (`UardRx`) |
| 17 | **`dbo.tblUASched`** | Scheduled and random drug screen dates | Client ID, scheduled date, test type, completed flag |
| 18 | **`dbo.HL7Lab Information`** | Reference laboratory GC/MS confirmations | Lab order ID, external laboratory (Cordant, Quest, Labcorp), confirmatory values |

---

### 2.5 Treatment Phases, Recovery Milestones & Assessments
*Powers the Recovery Progress ring, milestone timeline, and between-session practice.*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 19 | **`dbo.tblTreatmentLevel`** | Active treatment phase & ASAM level | Client ID, treatment level (`Induction`, `Stabilization`, `Maintenance`, Step 1–6), approval date |
| 20 | **`dbo.BAMScore`** *(or `dbo.BAMForm`)* | Brief Addiction Monitor recovery scores | Use score, risk factor score, protective/coping factor score, assessment date |
| 21 | **`dbo.SF_Cows`** | Clinical Opiate Withdrawal Scale (COWS) | Assessment date, total score, withdrawal severity |
| 22 | **`dbo.InitialTreatmentPlan`** *(or `dbo.TreatmentPlanSNAP`)* | Recovery goals & problem list | Goal descriptions, target completion dates, counselor ID |

---

### 2.6 Patient & Clinician Identity & Caseload Assignment
*Powers user login, the profile header, assigned care team cards, and clinician caseload rosters (`/admin-patients`).*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 23 | **`dbo.ClientMaster`** *(or `dbo.PatientDemo`)* | Patient master record & demographics | Client ID, First Name, Last Name, DOB, Phone, Email, Home Clinic SiteCode, Assigned Counselor ID |
| 24 | **`dbo.tblUser`** | Clinician & staff profile | User ID, Name, Role (Counselor / Doctor / Nurse), Active status |
| 25 | **`dbo.tblUserCredentials`** | Counselor professional credentials | User ID, professional credentials (e.g. *CADC-II, LCSW, MD*) |
| 26 | **`dbo.tblSITES`** *(or `dbo.BHGTreatmentCenters`)* | Clinic treatment centers list | Site code, Site name, Street Address, Phone, Emergency crisis phone |

---

### 2.7 Billing, Dues & Insurance Coverage
*Powers outstanding copays, the "Pay Dues" modal, and insurance card verification.*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 27 | **`dbo.tblBill`** *(or `dbo.tbl3pBill`)* | Patient ledger & charges | Bill ID, Client ID, Charge amount, Paid amount, Balance, Date |
| 28 | **`dbo.tbl3pElig`** | Real-time insurance eligibility (EDI 270) | Client ID, Payer Name (TennCare, BlueCare, etc.), Coverage status, Verified date |
| 29 | **`dbo.FinancialHardshipApplication`** | Sliding-fee scale & relief requests | Client ID, application date, income verified, status |

---

### 2.8 Consents, SMS & Mobile Banners (42 CFR Part 2 & Communication)
*Powers digital ROI forms, 8x8 SMS appointment reminders, and in-app banners.*

| # | Table Name | Screen / Workflow Powered | Key Columns Needed |
|---|---|---|---|
| 30 | **`dbo.ConsentToDisclosureofPatientInfo`** *(or `dbo.tblCONSENTS`)* | 42 CFR Part 2 Release of Information | Consent title, Patient signature, Staff signature, Expiration date, Revocation flag |
| 31 | **`scx.ScxMobileBanner`** | In-app mobile alerts & announcements | Banner title, message body, target site/patient, active date range |
| 32 | **`dbo.SMSConsent`** *(or `dbo.SMSTextConsentForm`)* | Patient SMS opt-in for appointment reminders | Client ID, mobile phone, SMS opt-in status, date |

---

## 3. How to Share Columns

When you are ready, you can paste the column information for these tables in any format:
- A SQL query result from `INFORMATION_SCHEMA.COLUMNS`
- A JSON or CSV export
- Plain text column lists

Once received, we will directly map each column to the application state models.
