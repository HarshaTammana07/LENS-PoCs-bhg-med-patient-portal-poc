# BHG Patient Portal: Database Table Mapping Guide

> **Document Purpose**: This guide provides the complete, field-by-field database mapping between the **BHG Patient Portal** (and its companion Clinician Portal) and the destination enterprise database tables defined in [Documents/Tables_With_Columns.md](file:///c:/Users/tsaty/Downloads/LENS-PoCs-bhg-med-patient-portal-poc/LENS-PoCs-bhg-med-patient-portal-poc/Documents/Tables_With_Columns.md) (sourced from `BHG_DR` EF Core models).

---

## 1. Architectural Overview & Data Flow

When moving the portal to live production, data is queried from and synced to the **`BHG_DR` / SAMMS database**. The system uses two main database schemas:
1. **`pats` (Patient Clinical Data)**: Manages check-in queues, dosing records, appointment schedules, toxicology lab panels, billing ledgers, and clinical assessments.
2. **`ctrl` (System Control & Configuration)**: Manages clinic operating rules, staff credentials, user permissions, and legal/42 CFR Part 2 consents.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION SCREENS                                     │
│  [Dashboard]  [Visits]  [Dosing/Holds]  [Labs/UDS]  [Recovery]  [Billing]  [Consents]  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BHG INTEGRATION API & QUERY LAYER                               │
└─────────────────────┬────────────────────────────────────────────┬─────────────────────┘
                      │                                            │
                      ▼                                            ▼
         ┌─────────────────────────┐                  ┌─────────────────────────┐
         │      Schema: pats       │                  │      Schema: ctrl       │
         │  (Patient Clinical DB)  │                  │  (Control & Master DB)  │
         ├─────────────────────────┤                  ├─────────────────────────┤
         │ • tbl_CHECKIN           │                  │ • tbl_CLINIC            │
         │ • tbl_Appointments     │                  │ • tbl_USER              │
         │ • Tbl_AppointmentAttend │                  │ • tbl_USERSITES         │
         │ • tbl_DOSE / tbl_Bottle │                  │ • tbl_CONSENTS          │
         │ • tbl_UARESULTS         │                  │                         │
         │ • tbl_UARESULTDETAIL    │                  │                         │
         │ • tbl_TreatmentLevel    │                  │                         │
         │ • tbl_CLIENTDEMO1       │                  │                         │
         │ • tbl_BILLS / 3pElig    │                  │                         │
         └─────────────────────────┘                  └─────────────────────────┘
```

---

## 2. Comprehensive Module-by-Module Table Mapping

---

### 2.1 Medication Dosing Windows, Queues & Hold Flags ("No Holds Active")

The green shield on the patient dashboard and the dispensing queue under `/admin-check-ins` monitor whether a patient can receive their medication without clinical interruption.

#### Primary Table: `pats.tbl_CHECKIN`
* **Model Class**: `TblCheckin`
* **Role**: Tracks patient arrival, queue position, wait times, and clinical hold blocks.

| Column Name | Type / Format | Purpose & UI Feature Powered |
| :--- | :--- | :--- |
| **`CiHold`** | `INTEGER` / `FLAG` | **"No Holds Active" Indicator**: If `0`, the portal displays the green shield (*"No holds active — Arrive before 10:30 AM"*). If $>0$, displays an urgent warning: *"Please see counselor Alicia Monroe before dosing"*. |
| **`CiCltid`** | `INTEGER` | **Patient Foreign Key**: Links arrival event to `pats.tbl_CLIENTDEMO1.ClientId`. |
| **`CiDate`** | `DATETIME` | **Arrival Date**: Filters current day's dispensing queue. |
| **`CiTime`** | `DATETIME` / `TIME`| **Check-In Time**: Logs exact arrival timestamp at the clinic window. |
| **`CiQueue`** | `INTEGER` | **Queue Number**: Displays position in line for the dispensing window. |
| **`MinutesWaited`**| `INTEGER` | **Operational Metric**: Tracks lobby wait time before nurse administration. |
| **`CiServeddtm`** | `DATETIME` | **Dispense Timestamp**: Set when medication is successfully administered. |
| **`SiteCode`** | `VARCHAR` | **Clinic Center ID**: Identifies the clinic location (e.g., Knoxville Bernard, Citico). |

#### Secondary Table: `ctrl.tbl_CLINIC`
* **Model Class**: `TblClinic`
* **Role**: Clinic operating hours and dosing cutoff rules.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`DoseWarn`** | Pre-closing warning threshold (e.g., 30 minutes before dosing cutoff). |
| **`DoseStop`** | Daily dispensing window end time (e.g., `10:30 AM` weekdays, `9:30 AM` Saturdays). |
| **`Bottles`** | Site-level take-home bottle allowance policies. |
| **`BillHold`** | Financial hold trigger (whether unpaid dues block dispensing). |

---

### 2.2 Appointments, Counseling Sessions & 1-Click Check-In

Powers the "Next Counseling Visit" card on the Dashboard, the `/visits` patient page, and the Clinician Daily Agenda (`/admin-sessions`).

#### Primary Table: `pats.tbl_Appointments`
* **Model Class**: `TblAppointments`
* **Role**: Master scheduling ledger for one-on-one sessions, medical reviews, and group therapy.

| Column Name | Type / Format | Purpose & UI Feature Powered |
| :--- | :--- | :--- |
| **`UniqueId`** | `GUID` / `INT` | Primary appointment identifier. |
| **`StartDate`** | `DATETIME` | Session start time (e.g., `Today, 2:00 PM`). |
| **`EndDate`** | `DATETIME` | Session end time (e.g., `Today, 2:45 PM`). |
| **`Subject`** | `VARCHAR` | Visit title: *"Individual Counseling"*, *"Annual Medical Review"*, *"Group Therapy"*. |
| **`Location`** | `VARCHAR` | Location format: *"Office 204"* (In-Person) or *"Telehealth / Zoom"*. |
| **`Description`**| `TEXT` | Clinical agenda topics and preparation instructions. |
| **`Status`** | `VARCHAR` / `INT`| Appointment status: `Scheduled`, `Checked In`, `Completed`, `Rescheduled`, `Cancelled`. |
| **`ResourceId`** | `INTEGER` | **Counselor Foreign Key**: Links appointment to `ctrl.tbl_USER.Uskey`. |

#### Secondary Table: `pats.Tbl_AppointmentAttend`
* **Model Class**: `TblAppointmentAttend`
* **Role**: Tracks patient arrival and virtual waiting room status.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`aaaptID`** | Appointment ID foreign key linking to `pats.tbl_Appointments.UniqueId`. |
| **`aacltid`** | Client ID foreign key. |
| **`aaDTENROLLED`** | **1-Click Check-In Timestamp**: Set when the patient clicks **"Check In"** on mobile/web within 1 hour of the visit. Moves patient into the counselor's waiting room. |
| **`aaDTREMOVED`** | Timestamp when the counselor ends the session or records attendance. |

---

### 2.3 Medication Dosing History & Take-Home Bottle Tiers

Powers the daily dose details, take-home bottle schedules (*Step 3: 3 take-home bottles*), and diversion control.

#### Primary Table: `pats.tbl_DOSE`
* **Model Class**: `TblDose`
* **Role**: Individual dispensing events and dosage amounts.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`CltId`** | Patient identifier. |
| **`DtMedDate`** | Date medication was administered or dispensed. |
| **`Dose`** | **Prescribed Dosage**: Active daily dosage level (e.g., *Methadone 85 mg* or *Suboxone 16 mg*). |
| **`Bottletype`** | Identifies whether the dose was observed at the window or dispensed as a take-home bottle. |
| **`BlException`** | Flags physician temporary dosage adjustments or guest-dosing exceptions. |

#### Secondary Table: `pats.tbl_Bottle`
* **Model Class**: `TblBottle`
* **Role**: Take-home bottle tracking, serial numbers, and diversion control.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`BottleId`** | Unique serial ID printed on the bottle label and barcode. |
| **`BottleType`** | Bottle step tier classification (e.g., Weekend Bottle, Step 3 Weekly Take-Home). |
| **`LotNumber`** | DEA batch lot number for federal compliance. |
| **`InitialAmount`** | Prescribed dose volume per bottle. |
| **`DtReceived`** | Date and time the patient received the bottles at the clinic window. |
| **`DtClosed`** | Date returned/verified during random bottle recall inspections. |

---

### 2.4 Urine Drug Screen (UDS) & Toxicology Tracking

Powers the patient-facing `/labs` page and the clinician `/admin-labs` monitoring dashboard using destigmatized clinical terms.

#### Primary Table: `pats.tbl_UARESULTS` (Encounter Level)
* **Model Class**: `TblUaresults`
* **Role**: Overall collection encounter log.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`UarId`** | Screen encounter primary key. |
| **`UarLngCltId`**| Patient foreign key. |
| **`UarResultDt`** | Date of test result release. |
| **`UarDropDt`** | Urine specimen collection date and time. |
| **`UaNote`** | Clinical collector notes (e.g., temperature valid, visual inspection clear). |

#### Secondary Table: `pats.tbl_UARESULTDETAIL` (Panel Level)
* **Model Class**: `TblUaresultdetail`
* **Role**: Specific substance panel test results.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`UaDetail`** | **Substance Name**: Methadone, Buprenorphine, Opiates, Fentanyl, Oxycodone, Cocaine, Benzodiazepines, Amphetamines, THC. |
| **`UardRx`** | **Prescription Flag**: Indicates whether the drug is an expected prescribed medication (renders **Green Pill**: *"Prescribed Consistent"*). |
| **`UardResult`** | **Result Value**: Presumptive Negative / Presumptive Positive. |
| **`UardNote`** | Explanatory note or threshold cutoff indicator. |

#### Confirmatory Lab Table: `pats.tbl_LABRESULT` & `tbl_LABRESULTDETAIL`
* **Role**: Certified Gas Chromatography / Mass Spectrometry (GC/MS) confirmatory panels from external reference laboratories (Quest Diagnostics, Labcorp, Cordant).

---

### 2.5 Recovery Milestones, ASAM Levels & Phase Progression

Powers the Recovery Progress ring, milestone timeline, and BAM coping metrics.

#### Primary Table: `pats.tbl_TreatmentLevel`
* **Model Class**: `TblTreatmentLevel`
* **Role**: Federal & state treatment phase progression.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`CltId`** | Patient foreign key. |
| **`TreatmentLevel`**| **Active Clinical Phase**: Induction $\to$ Stabilization $\to$ Maintenance $\to$ Step Level (1 to 6). |
| **`RecordOn`** | Date of advancement or physician phase approval. |
| **`UserID`** | Physician / Clinical Director user ID who signed the phase advancement order. |

#### Secondary Table: `pats.tbl_BriefAddictionMonitor`
* **Model Class**: `TblBriefAddictionMonitor`
* **Role**: Standardized Brief Addiction Monitor (BAM) scores.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`UseCalc`** | Recent substance use severity score. |
| **`RiskCalc`** | Risk factor index (triggers, high-risk environments, cravings). |
| **`ProtectiveCalc`**| **Protective / Coping Factor Score**: Powers the recovery strength rating and protective behavior badges. |

---

### 2.6 Patient & Clinician Identity & Caseload Assignment

Powers the navigation bar user avatar, patient profile header, and care team cards.

#### Patient Identity: `pats.tbl_CLIENTDEMO1` & `tbl_CLIENTDEMO2`
* **Model Class**: `TblClientdemo1`

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`ClientId`** | Patient Master ID (e.g., `44029` $\to$ formatted as `BHG-44029`). |
| **`FirstName`** | Patient first name (*Jordan*). |
| **`LastName`** | Patient last name (*Williams*). |
| **`Dob`** | Date of birth for identity verification. |
| **`Email`** | Email address for appointment confirmations and notifications. |
| **`Address1`** | Primary residence for emergency outreach. |
| **`SiteCode`** | Primary treatment center assignment (*Knoxville Bernard*). |

#### Clinician Identity: `ctrl.tbl_USER` & `ctrl.tbl_USERSITES`
* **Model Class**: `TblUser`

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`Uskey`** | Clinician primary ID. |
| **`UsrFname`** | Clinician first name (*Alicia*). |
| **`UsrLname`** | Clinician last name (*Monroe*). |
| **`Usrcred`** | **Professional Credentials**: (*CADC-II, LCSW, MD*). Displayed on counselor contact card. |
| **`UsrCounselor`**| Boolean flag indicating counselor role. |
| **`UsrActive`** | Active employment status. |

---

### 2.7 Billing, Dues & Insurance Coverage

Powers the `/billing` page, outstanding balance calculations, insurance cards, and the "Pay Dues" modal.

#### Primary Table: `pats.tbl_BILLS`
* **Model Class**: `TblBills`
* **Role**: Patient billing and payments ledger.

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`BillCltid`** | Patient foreign key. |
| **`BillDate`** | Date of service or transaction. |
| **`BillBill`** | Charge amount (e.g., daily dispensing copay or weekly fee). |
| **`BillPay`** | Payment amount received. |
| **`BillPaytype`** | Payment method: Self-Pay, Credit Card, HSA, Cash, Medicaid. |
| **`BillReceiptNum`**| Merchant payment transaction receipt number (InstaMed / Stripe). |
| **`BillAdjust`** | Sliding-fee scale adjustment or courtesy waiver. |

#### Insurance Eligibility Table: `pats.tbl_3pElig`
* **Model Class**: `Tbl3pElig`
* **Role**: Real-time electronic payer verification (EDI 270/271).

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`EPayer`** | Payer name (e.g., *TennCare / BlueCare Tennessee*). |
| **`EStatus`** | Coverage status: `Active`, `Pending`, `Inactive`. |
| **`EDate`** | Last real-time eligibility verification timestamp. |

#### Financial Hardship Table: `pats.Tbl_FinancialHardshipApplication`
* **Role**: Sliding-fee scale requests and hardship applications submitted via the portal.

---

### 2.8 Consents & 42 CFR Part 2 Legal Releases

Powers the `/consents` page for digital signing of Releases of Information (ROI) and treatment agreements.

#### Primary Table: `ctrl.tbl_CONSENTS`
* **Model Class**: `TblConsents`

| Column Name | Purpose & UI Feature Powered |
| :--- | :--- |
| **`Cid`** | Consent form identifier. |
| **`CName`** | Document title: *"42 CFR Part 2 Consent to Disclose"*, *"OTP Treatment Agreement"*, *"Take-Home Bottle Agreement"*. |
| **`ClientSig`** | Digital signature of the patient. |
| **`StaffSig`** | Digital counter-signature of the clinician. |
| **`Cdays`** | **Duration / Expiration**: Number of days the release remains valid (e.g., 365 days). |
| **`CDeleted`** | Revocation flag (if patient rescinds consent in-portal). |

---

## 3. Quick Reference Matrix

| Feature / UI Component | Primary Database Table(s) | Foreign Key / Link |
| :--- | :--- | :--- |
| **Dosing Hours & Hold Status** | `pats.tbl_CHECKIN`, `ctrl.tbl_CLINIC` | `CiCltid` $\to$ `tbl_CLIENTDEMO1.ClientId` |
| **Counseling Visits & Check-In** | `pats.tbl_Appointments`, `pats.Tbl_AppointmentAttend` | `ResourceId` $\to$ `tbl_USER.Uskey` |
| **Prescribed Medication & Dosing** | `pats.tbl_DOSE`, `pats.tbl_Bottle` | `CltId` $\to$ `tbl_CLIENTDEMO1.ClientId` |
| **Toxicology Screens & Lab Panels** | `pats.tbl_UARESULTS`, `pats.tbl_UARESULTDETAIL` | `UarLngCltId` $\to$ `tbl_CLIENTDEMO1.ClientId` |
| **Milestone Badges & Phases** | `pats.tbl_TreatmentLevel`, `pats.tbl_BriefAddictionMonitor` | `CltId` $\to$ `tbl_CLIENTDEMO1.ClientId` |
| **Patient Profile Header** | `pats.tbl_CLIENTDEMO1`, `pats.tbl_CLIENTDEMO2` | Primary Key `ClientId` |
| **Assigned Counselor Card** | `ctrl.tbl_USER`, `ctrl.tbl_USERSITES` | Primary Key `Uskey` |
| **Dues Payment & Insurance** | `pats.tbl_BILLS`, `pats.tbl_3pElig` | `BillCltid` $\to$ `tbl_CLIENTDEMO1.ClientId` |
| **42 CFR Part 2 Digital ROI** | `ctrl.tbl_CONSENTS` | `Cid` |
