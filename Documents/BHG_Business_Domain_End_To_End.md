# BHG Business Domain — End-to-End Guide

This document explains **what Behavioral Health Group (BHG) is as a business**, **how a clinic actually runs**, and **how that shows up in SAMMS tables, Azure** `BHG_DR`**, and the ETLs in this repo**.

It is written for data engineers, analysts, product, and operations people who need the business story behind the tables — not another pipeline runbook.

**How this was built**


| Source                                                              | What it contributes                                                                 |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| This codebase                                                       | ~98+ warehouse tables, field models, ETL schedules, merge keys, row-count snapshots |
| Public BHG materials (`bhgrecovery.com`, media kit, outcomes pages) | Mission, service lines, insurance model, clinic count, published outcomes           |
| Industry / federal OTP rules (SAMHSA 42 CFR Part 8, DEA)            | Why daily dosing, take-homes, counseling, UA, and inventory exist                   |
| Press / ownership sources                                           | Growth path, PE ownership, acquisitions                                             |


Public numbers below are **as published by BHG or secondary sources around 2024–2026**. They can change. Warehouse row counts are a **point-in-time Azure** `BHG_DR` **snapshot** from this repo’s P1 mapping doc — they show relative scale, not live production.

---



## 1. Who BHG is

**Behavioral Health Group** is a Dallas-based outpatient addiction-treatment company. It is the largest Joint Commission–accredited outpatient opioid treatment network in the United States.


| Fact         | Typical published figure                                    | What our data says                                                                                                               |
| ------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Clinics      | 110+ Joint Commission–accredited centers                    | `ctrl.tbl_Clinic` ≈ **118** rows; finance ETL docs speak of **~115 active SAMMS sites**                                          |
| Geography    | 20+ states                                                  | Insurance pages list clinics across AL, AR, CO, GA, ID, IN, IA, KS, KY, LA, MD, MI, MN, MO, NV, NC, RI, SC, TN, VA, DC, and more |
| Daily census | ~**42,000 patients every day**                              | `pats.tbl_CheckIn` ≈ **32.2 million** historical check-ins; `pats.tbl_Enrollment` ≈ **879,000** enrollment episodes              |
| Workforce    | ~**1,900** employees                                        | `ctrl.tbl_User` / `tbl_UserSites` hold SAMMS staff and site access                                                               |
| Founded      | 2006                                                        | Headquarters: 5001 Spring Valley Road, Dallas, TX                                                                                |
| Ownership    | The Vistria Group (PE) since Dec 2018; previously Frontenac | Explains the push from cash-pay clinics to a national insurance-based healthcare platform                                        |


BHG is **not** a hospital system and **not** a residential rehab chain. The core product is **outpatient opioid-use-disorder (OUD) treatment**: patients live at home, come to a clinic (often daily at first), receive medication, counseling, labs, and case management, and stay in treatment for months or years.

That long-stay outpatient model is why the warehouse is huge on **check-ins, doses, bills, drug screens, and counseling sessions** — and relatively small on one-time intake forms.

---



## 2. The business they are in



### 2.1 The clinical product

BHG sells **evidence-based outpatient recovery**, not a single pill.

Their published model combines:

1. **Medications for opioid use disorder (MOUD)** — methadone, buprenorphine (Suboxone, Brixadi, Sublocade), naltrexone (Vivitrol). BHG says it is among ~4.2% of U.S. programs that offer all three FDA-approved OUD medications.
2. **Counseling** — individual and group; CBT, motivational interviewing, contingency management.
3. **Case management and wraparound support** — housing, jobs, Medicaid applications, transportation, family support.
4. **Labs / toxicology** — scheduled and random urine drug screens; some lab work in BHG-owned labs.
5. **IOP (Intensive Outpatient Program)** at select sites — more hours of group/individual therapy when a patient needs more structure.

They operate two regulated settings:


| Setting                                  | What it is                                                                                                                                       | Why it matters commercially                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **OTP — Opioid Treatment Program**       | Federally certified clinic that can **dispense methadone on site**. Daily observed dosing, take-home bottles, diversion control, counseling, UA. | Highest regulatory burden. Highest visit volume. Often billed as a **bundled daily/weekly rate**. This is the SAMMS “dosing window” business. |
| **OBOT — Office-Based Opioid Treatment** | Office setting that **prescribes** buprenorphine / naltrexone; patient may fill at a pharmacy.                                                   | More like conventional medical + behavioral-health billing. Lower daily foot traffic.                                                         |


Many BHG locations run **OTP and OBOT together**, so a patient can move between methadone (clinic-dispensed) and buprenorphine (clinic or prescription) as acuity changes. That “integrated dynamic care” idea is a BHG differentiator in their 2021 media kit (COPE / standard / motivational pathways).

They also publish **Medical Services** and a **pilot expansion beyond opioids** into a broader range of substances.

### 2.2 How BHG makes money

Revenue is **outpatient healthcare reimbursement**, not retail pharmacy and not inpatient bed-days.

**Payer mix (from BHG’s public insurance pages and from our finance tables)**


| Payer type                                                                                         | Business meaning                                                                                       | Tables that prove it                                                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **Medicaid** (state FFS + managed care: Aetna, Anthem, CareSource, Humana, Wellcare, United, etc.) | Largest typical OTP payer. Often a **bundled weekly/daily rate** covering meds + counseling + support. | `tbl_PayerClient`, `tbl_GlobalPayor`, `tbl_Claims`, `tbl_3pElig`                     |
| **Medicare Part B / Advantage**                                                                    | BHG says Part B often covers OUD treatment at 100% after deductible.                                   | Same payer/claim family; claim CMS-1500-style `f`* fields                            |
| **Commercial** (Aetna, UHC/Optum, BCBS, Cigna, Humana, TRICARE, VA)                                | Prior auth, copay, deductible, coinsurance. More line-item / CPT billing in some plans.                | `tbl_pbi3PayAuth`, `PayerClient.PyCopay/PyDeduct`, `ClaimLineItem` CPT/NDC           |
| **Self-pay / cash**                                                                                | Weekly or monthly patient payments at the window. Historical BHG model. Still important.               | `tbl_Bills` (`billBILL`, `billPAY`, `billPAYTYPE`), `ClientDemo2.Amount/Freq/Payday` |
| **Grants / hardship / sliding fee**                                                                | Access when insurance is missing or benefits lapse.                                                    | `tbl_FinancialHardshipApplication` (~69K), `tbl_Fmp` (~177K)                         |


BHG’s own FAQ: *“Most insurance plans cover outpatient addiction treatment as a **bundled service** rather than by individual line item — a set daily or weekly rate that includes medications, counseling and recovery support.”*

That is the commercial heart of OTP:

```
Patient stays in treatment (census)
    → daily/weekly visits (check-in + dose + counseling)
    → clinic bills a bundle or claim lines
    → payer or patient pays
    → revenue = census × collection rate × days in treatment
```

**What BHG is optimizing (this matches their “Performance Insights / commercial nerve center” job language)**

- **Inflow:** walk-ins, referrals, same-day intake (PPA, appointments, Salesforce IDs).
- **Conversion:** intake → enrolled → first dose.
- **Retention / census:** 90-day and 1-year stay. BHG publishes 62% retained at 90+ days vs ~42% Medicaid industry benchmark.
- **Payer economics:** eligibility, auth units, clean claims, denial follow-up.
- **Workforce productivity:** wait time at the window, counselor caseload, dosing throughput.



### 2.3 How BHG grew

Over roughly 2018–2022 BHG shifted from a **small cash-pay methadone chain** to a **professionalized, insurance-credentialed national platform**:

- Acquisitions (e.g. Center for Behavioral Health / CBH — ~20 centers in 8 states).
- De-novo clinics.
- Adding counseling depth, labs, OBOT, IOP, and billing sophistication.

The ETL estate is the data backbone of that professionalization: one warehouse so corporate finance, clinical quality, and clinic ops can see **all sites the same way**.

**PHC** in this repo is a **separate clinic brand / runner** (`PHC` project, SiteCode `PHC`) that shares Save* logic. Treat it as a related operating unit on the same SAMMS pattern, not as BHG’s public consumer brand.

---



## 3. How a BHG clinic operates (the operating system)

SAMMS is the **clinic EHR / practice-management system**. Each clinic has its own SQL Server database. Corporate BHG pulls those databases every night into `BHG_DR` (legacy) and Fabric (migration).

A typical OTP clinic day is a **factory of visits**, not a doctor’s appointment book.

```
                    ┌─ Walk-in / call center / Salesforce ─┐
                    ▼                                       │
              Intake / PPA                                  │
                    ▼                                       │
         Medical exam + counselor + consents                │
                    ▼                                       │
              First dose (same day)                         │
                    ▼                                       │
     ┌──────── daily loop (weeks to years) ────────┐        │
     │  Check-in → queue → dosing window → dose     │        │
     │  (sometimes UA, counseling, doctor visit)    │        │
     │  take-home bottles if earned                 │        │
     └──────────────────────────────────────────────┘        │
                    ▼                                       │
         Periodic reassessment / treatment plan              │
                    ▼                                       │
         Discharge, transfer, or restart ────────────────────┘
```

**Roles you will see in the data**


| Role                        | What they do                                              | Tables                                                      |
| --------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| Front desk / receptionist   | Check-in, payments, appointments                          | `tbl_CheckIn`, `tbl_Bills`, `tbl_Appointments`              |
| Dosing nurse                | Observe swallow, log dose, issue take-homes               | `tbl_DOSE`, `tbl_Orders`, `tbl_Bottle`, `tbl_LiquidLog`     |
| Counselor                   | Individual/group sessions, ASAM dimensions, notes         | `tbl_DartsSrv_*`, PA / assessment forms                     |
| Medical provider / MD       | Orders, dose changes, E&M, pregnancy, take-home decisions | `tbl_Orders_*`, `tbl_EandMForm*`, take-home forms           |
| Patient financial counselor | Eligibility, auth, hardship, payment plans                | `tbl_3pElig`, `tbl_pbi3PayAuth`, `tbl_Fmp`, hardship        |
| Biller / AR                 | Claims, denials, notes                                    | `tbl_Claims`, line items, `tbl_3pClaimNote`, `tbl_3pARNOTE` |
| Lab / UA tech               | Schedule and result drug screens                          | `tbl_UASched`, `tbl_UAResults`, `tbl_LABRESULT*`            |


Clinic policy itself is data: `ctrl.tbl_Clinic` has flags for **RequireDarts** (counseling required), **DoseCharge**, **BillHold**, UA schedule (`SCHEDUA`, `UAMONTHLY`), electronic signatures, bottle weight / specific gravity, third-party automation (`TPAUTOMATION`), and timezone offset. That is why two sites can run the same SAMMS product and still behave differently.

---



## 4. Patient journey — mapped to tables

This is the end-to-end patient life cycle as BHG runs it, with the warehouse objects that hold each step.

### Stage 0 — Finding BHG (before they are a SAMMS client)

Public path: call **844-535-7291**, walk in, or use the location finder. Same-day / next-day intake is a stated operating goal.

In data:


| What happens              | Table                                                          | Notes                                                                    |
| ------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Intake appointment booked | `pats.tbl_Appointments`                                        | `IsDropIn`, `IntakeAppointmentMissed`, `SalesForceId`, `AppointmentType` |
| Missed first visit        | same + `AppointmentAttend`                                     | Funnel leakage — commercial KPI                                          |
| Referral source           | `pats.tbl_PreadmissionReferralSource` (~47K, 515-day lookback) | Courts, hospitals, other providers, self                                 |


Salesforce IDs on appointments and `ClientDemo2` show BHG also runs a **CRM / intake funnel** outside SAMMS.

### Stage 1 — Pre-admission and first day (2–3 hours)

BHG’s published first-day script matches the tables almost 1:1.


| First-day step                    | Table(s)                                                      | Business meaning                                                                                          |
| --------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Photo ID, insurance card, payment | `tbl_ClientDemo1`, `tbl_PayerClient`, `tbl_3pElig`            | Identity + who will pay                                                                                   |
| Medical exam                      | New admission / comprehensive assessment, `tbl_EandMFormMDM`  | Provider documents medical decision-making                                                                |
| Withdrawal scoring                | `tbl_Cows_V6` (~684K COWS scores)                             | Clinical Opiate Withdrawal Scale — drives starting dose                                                   |
| Counselor interview               | `tbl_NewAdmissionassessment` + ASAM Dimension tables          | Six ASAM dimensions (acute intoxication, biomedical, emotional, readiness, relapse, recovery environment) |
| Substance-use history             | `tbl_Admissionassessmentsubstanceusehistory` (~71K)           | What they use, how often                                                                                  |
| Consents                          | `tbl_CONSENTS`, marketing consent, SMS consent                | 42 CFR Part 2 / privacy / comms                                                                           |
| Pregnancy path                    | `tbl_EandMFormPregnancy` (~58K), `ClientDemo1.Preg / PregEDC` | Special protocol; methadone is standard of care in pregnancy                                              |
| Financial setup                   | hardship app, FMP, `ClientDemo2.Amount/Freq`                  | Self-pay weekly fee or insurance                                                                          |
| Same-day first medication         | `tbl_Orders` (standing order) + `tbl_DOSE` (first dispense)   | “Patients typically begin MAT the same day”                                                               |


Pre-admission landing tables:

- `ayx.tbl_PreAdmission_V6` (~28K) — structured intake form.
- `pats.tbl_SF_PatientPreAdmission` — PPA schedule (runner arg 12).



### Stage 2 — Enrollment = “this person is on census”

`pats.tbl_Enrollment` (~**879K** rows) is the **episode of care**.

Key fields:


| Field                                                         | Meaning                                                               |
| ------------------------------------------------------------- | --------------------------------------------------------------------- |
| `cltID` + `SiteCode`                                          | Patient at this clinic                                                |
| `Program` / `Modality` / `TreatmentLevel` / `MODULE`          | OTP vs other track, acuity, product                                   |
| `EnrollDate` / `EnrollReasonCode`                             | Why they started                                                      |
| `DischargeDate` / `DischargeReasonCode` / sub-reason          | Why they left (complete, transfer, AMA, incarceration, etc.)          |
| `Counselor` / `Physician`                                     | Assigned care team                                                    |
| `Transfer` / `ParentEnrollID`                                 | Moved from another BHG site or prior episode                          |
| `intakeIncome` / `dischargeIncome`                            | Social-outcome tracking                                               |
| `strEmpStat`, `strLiving`, `strEduc`, `strArrests`, `strBaby` | TEDS-style outcomes BHG publishes (jobs, housing, justice, pregnancy) |
| `NoDarts_Enroll` / `NoDarts_Discharge`                        | Counseling waived or not required at that moment                      |


**Census** (the #1 operating KPI) ≈ patients with an open enrollment (no discharge, or discharge in the future) who are still dosing / checking in.

`tbl_TreatmentLevel` (P2) is the current acuity / programming level — the “which pathway is this patient on” table.

### Stage 3 — Daily life: check-in, dose, sometimes counseling

This is where almost all of the data volume lives.

#### 3a. Check-in (largest table in P1)

`pats.tbl_CheckIn` — **32.2 million rows (~31% of P1 volume)**.

A check-in is **arrival at the clinic that day**, usually for the dosing window.


| Field                                                    | Business meaning                                                                                    |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `ciCLTID`, `ciDate`, `ciTIME`                            | Who arrived when                                                                                    |
| `ciQueue`, `ciQUEUETIME`, `MinutesWaited`, `ciSERVEDdtm` | Queue science — window throughput                                                                   |
| `ciHOLD`                                                 | Patient is on **hold** (balance, missed counseling, positive UA, clinical lock) — they may not dose |
| `ciDoses`, `ciAmt`                                       | Doses / amount associated with this visit                                                           |
| `ciServedStaff`, `ciUSER`                                | Who worked the window                                                                               |
| `ciCode`                                                 | Visit / service code                                                                                |


**Admin implication:** holds and wait time are how clinic managers run the morning rush. **Finance implication:** a held patient may still be on census but is not generating a billable observed dose that day.

#### 3b. The medication order (the prescription / standing order)

`pats.tbl_Orders_2016` … `_2028` (year-partitioned).

An **order is not a dispense**. It is the doctor’s standing instruction: drug, milligrams, which days of the week, split-dose, take-home pattern, effective/expiration dates, signatures.


| Field group                                        | Business meaning                                        |
| -------------------------------------------------- | ------------------------------------------------------- |
| `cltID`, `OrderNum`, `medType`, `Dose`, `Dose2`    | Who, which med, how many mg (split-dose = Dose + Dose2) |
| `Sunday`…`Saturday` (and `*2`)                     | Dosing calendar — clinic days vs take-home days         |
| `EffectiveDate` / `ExpirationDate` / `Active`      | Current vs expired order                                |
| `Doctor`, `sigDr`, `sigMid`, images                | DEA / medical-director control                          |
| `Intervals`, `Weeknum`, `Type`, `Stype`, `Pckcode` | Take-home / phase / pack coding                         |
| `Blind`, `SplitFirst`, `Aws`                       | Special protocols (blind dose, split, withdrawal scale) |
| `blVerbal`, `OverApprove`                          | Verbal order / override — compliance-sensitive          |
| `Guest` path on dose (not order)                   | Guest-dosing when traveling to another OTP              |


**Relationship:** one active order can generate **hundreds of dose rows**.

#### 3c. The dose (the actual medication event)

`pats.tbl_DOSE` — one row per dispense / administration.


| Field                                               | Business meaning                        |
| --------------------------------------------------- | --------------------------------------- |
| `DoseId`, `CltId`, `DtMedDate`, `DtDate`, `Dtgiven` | When the dose was prepared / given      |
| `Dose`                                              | Milligrams given that event             |
| `Ordernum`                                          | Link back to the standing order         |
| `Bottletype`, `InventoryGroup`                      | Which inventory / take-home bottle type |
| `BlBulk`, `BlPrepack`                               | Bulk liquid vs prepackaged take-homes   |
| `BlVoid`, `StrVoidReason`, `BlException`            | Wrong dose, spilled, refused, exception |
| `Dosenote`, `Dosesig`, `DoseSigImg`                 | Nurse documentation + patient signature |
| `GuestId`                                           | Dosing as a guest at this clinic        |
| `Manualauthdtm` / `Manualauthuser`                  | Manual override of an automated hold    |


`pats.tbl_DOSE_Excuse` — excused missed doses (`StrExcused`, `DtEx`). Missed unexcused doses are a **retention and take-home** signal.

**Inventory behind the dose**

OTP methadone is a **DEA Schedule II liquid** tracked bottle-by-bottle:


| Table              | Meaning                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------- |
| `tbl_Bottle`       | Received lot, DEA number, initial amount, specific gravity, weight, expiry, closed date |
| `tbl_LiquidLog`    | Daily liquid inventory movements                                                        |
| `ctrl.tbl_INVTYPE` | Inventory types                                                                         |


This is **compliance and shrink control**, not retail SKU management. A clinic that cannot reconcile bottles can lose its DEA registration.

#### 3d. Counseling (Darts)

`pats.tbl_DartsSrv_20XX` — counseling / billable service sessions.

“DART” in SAMMS = a **service session**: individual therapy, group, case management, sometimes a billable unit tied to a claim.


| Field                                           | Business meaning                          |
| ----------------------------------------------- | ----------------------------------------- |
| `dsID`, `dsClt`, `SiteCode`                     | Session key                               |
| `dsDtStart` / `dsDtEnd`, `dsdblUnits`           | Time and billable units                   |
| `dsTxtSrv`, `dsTxtType`, `ServiceType`          | What service                              |
| `dsPROGRAM`, `dsGROUPNUM`, `dsDartsGroup`       | Group vs individual, program              |
| `dstxtStaff`, signatures / cosign / client sign | Counselor + supervisor + patient          |
| `dsDIM1–6`, `dsTxDim1–6`                        | ASAM / treatment-plan dimensions touched  |
| `dsDIAG` / `dsDIAG10`                           | Diagnosis on the session                  |
| `dsAPTID`                                       | **Link to appointment**                   |
| `dsNoteID`, `dstxtNote`                         | Clinical note                             |
| `DSbilled`                                      | **Has this session been billed?**         |
| `dsTelehealthSession`                           | Remote counseling                         |
| `HoldId`                                        | Counseling hold tied to dosing privileges |
| `dsInvalidatedOn`                               | Voided / error session                    |


ETL lookback is aggressive (−15 / −90 / −200 days across five date columns) because sessions get signed, billed, and corrected days later.

`ctrl.tbl_Clinic.RequireDarts` plus `HoldId` implement a core OTP rule: **no counseling compliance → hold at the window → no dose**.

### Stage 4 — Appointments (not the same as check-in)

`pats.tbl_Appointments` + `tbl_AppointmentAttend` (~26K attend rows).

Appointments are the **calendar**: counselor slots, provider visits, intake, groups, IOP. Check-in is the **dosing-window queue**. A stable methadone patient may check in 20+ times a month and have only 2–4 appointments.


| Field                                 | Business meaning                      |
| ------------------------------------- | ------------------------------------- |
| `StartDate` / `EndDate`, `ResourceId` | When and which staff/room             |
| `Service`, `ServiceModifier`          | Billable service on the slot          |
| `IsDropIn` / `IsSchedule`             | Walk-in vs booked                     |
| `GroupName`, `NoofParticipants`       | Group therapy                         |
| `IntakeAppointmentMissed`             | Intake no-show                        |
| `SalesForceId`                        | CRM sync                              |
| `dsAPTID` on Darts                    | Session created from this appointment |




### Stage 5 — Monitoring: drug screens, labs, forms

Federal OTP rules require **toxicology** and ongoing assessment.


| Table                          | Volume            | Meaning                                                               |
| ------------------------------ | ----------------- | --------------------------------------------------------------------- |
| `tbl_UASched`                  | **10.2M**         | When a UA is due (random + scheduled)                                 |
| `tbl_UAResults`                | **13.1M**         | Screen result header                                                  |
| `tbl_UAResultDetail`           | P2 (large)        | Analyte lines (opioids, benzos, fentanyl, methadone metabolite, etc.) |
| `tbl_LABRESULT` / `DETAIL`     | INV schedule      | Broader lab (hepatitis, pregnancy, CMP, etc.)                         |
| `tbl_BAMForm` / `BAMScore`     | 64K / **1.5M**    | Brief Addiction Monitor — outcome instrument                          |
| `tbl_PA` + Dimension 1–6       | ~112K each        | Periodic reassessment (ASAM)                                          |
| `tbl_NewPeriodicReassessment*` | newer form family | Same idea, newer SAMMS form                                           |
| State assessments (MN, VA)     | small             | State-mandated comprehensive assessments                              |
| `tbl_SF_DataForms`             | **4.2M**          | Dynamic form instances                                                |
| `FormQuestionAnswers`          | Forms schedule    | Question-level answers + signatures                                   |


**Take-home privilege** is a clinical-legal decision. Tables:

- `tbl_TakeHomeRiskAssessment` (~92K)
- `tbl_takehomeagreementanddiversioncontrol` (~15K)

Positive UA, missed doses, and counseling no-shows typically **reduce take-homes** (patient must come daily again). That is both a clinical safety rule and a **visit-volume / revenue-timing** event.

### Stage 6 — Payment and insurance (runs in parallel with care)

See section 6. On the patient journey, the important idea is:

- **Day 0:** financial counselor verifies benefits (`tbl_3pElig`), assigns payer (`tbl_PayerClient`), requests auth if needed (`tbl_pbi3PayAuth`), or sets a self-pay rate / hardship / FMP.
- **Every week:** either a **patient bill** (`tbl_Bills`) or a **third-party claim** (`tbl_Claims` + line items), often tied to counseling sessions via `tbl_vw3pBillSub` (`dsID`).
- **When something breaks:** AR notes, claim notes, rebills, hardship.



### Stage 7 — Discharge, transfer, restart

`tbl_Enrollment.Discharge*` plus `tbl_newdischargetransferplanform` (~72K).

Patients commonly **cycle**: discharge → relapse → new pre-admission → new enrollment. That is why enrollment row count (879K) is much larger than “42,000 daily patients.” The daily number is **active census**; the table is **all episodes over years**.

Guest dosing (`tbl_DOSE.GuestId`, clinic `DischargeGuest`) supports BHG’s pitch that a national network lets a patient **travel and still dose**.

---



## 5. Admin and staff journeys

“Admin” at BHG is several jobs. Each has a different table spine.

### 5.1 Clinic operations manager / treatment-center director

**Job:** run today’s clinic — census, window wait, holds, staffing, compliance.


| Question they ask                                     | Tables                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| How many patients came today? How long did they wait? | `tbl_CheckIn` (`MinutesWaited`, queue)                          |
| Who is on hold and why?                               | `CheckIn.ciHOLD`, Darts `HoldId`, billing holds on `tbl_Clinic` |
| Are we fully staffed at the window and in counseling? | `tbl_User`, `tbl_UserSites`, appointment resources              |
| Are take-home and UA rules being followed?            | UA tables, take-home forms, dose excuses                        |
| Inventory reconcile?                                  | `tbl_Bottle`, `tbl_LiquidLog`                                   |




### 5.2 Front desk / dosing window

**Job:** identify the patient, collect money if due, route to nurse, keep the line moving.

Journey: patient arrives → check-in row → optional payment (`tbl_Bills`) → nurse prepares dose from active order → patient signs (`DoseSig`) → leave. If counseling is due, they are walked to a counselor before exit.

Fingerprint / photo fields on `ClientDemo2` (`FingerPrint1/2`, `PICPATH`) exist because **identity at the window** is a diversion-control requirement.

### 5.3 Counselor

**Job:** keep the caseload engaged, document ASAM work, hit required session frequency.

Journey: appointment (or walk-in) → Darts session → note + signature → units → `DSbilled` later. Periodic PA / BAM. Counselor name also sits on `ClientDemo2` and `Enrollment`.

### 5.4 Medical provider

**Job:** write/change orders, manage dose titration (BHG: 75% at protective dose within 60 days), pregnancy, E&M visits, take-home decisions, exceptions.

Journey: see patient → E&M form → new/changed `tbl_Orders` (signed) → subsequent `tbl_DOSE` rows follow the new mg.

### 5.5 Patient financial counselor (clinic admin)

**Job:** make sure someone will pay before or during care.

```
Insurance card
    → tbl_3pElig (eligibility ping, ~584K events)
    → tbl_PayerClient (assignment: member ID, copay, deductible, auth #, MMT vs bupe flags)
    → tbl_pbi3PayAuth (prior auth units / dates / service)
    → or self-pay rate on ClientDemo2 + tbl_Bills
    → hardship / FMP if they cannot pay
```

`tbl_PayerClient` even has `PyMmt` and `PyBupe` — **methadone vs buprenorphine coverage flags**. That is how OTP vs OBOT billing is encoded per patient.

### 5.6 Central billing / AR (corporate + clinic)

**Job:** turn visits into cash.

```
Services rendered (dose + darts + labs)
    → fee schedule (tbl_FeeSched) + codes (tbl_Codes, tbl_SERVICES)
    → claim header (tbl_Claims) CMS-1500-shaped f1…f33 fields
    → claim lines (tbl_ClaimLineItem): CPT, modifier, NDC, units, charge, dsID
    → activity (tbl_ClaimLineItemActivity): status changes, payments, denials
    → notes (tbl_3pClaimNote) and AR notes (tbl_3pARNOTE) on the line
    → rebill (tpcREBILLREASON)
```

`ctrl.tbl_3PSETUP` (~346 rows) is **per-clinic payer plumbing**: NPI, tax ID, SFTP, clearinghouse. `tbl_claimstatus` is the status code list.

`tbl_Claims.tpcStrWeek` / `tpcWKSTART` show the **weekly bundle** mindset: many OTP claims are “week of Monday …”.

### 5.7 Corporate / PE operating system

Why this warehouse exists at the top of the house:


| Corporate need                              | Data used                                            |
| ------------------------------------------- | ---------------------------------------------------- |
| Same-store census and retention             | Enrollment + CheckIn + Dose                          |
| Payer mix and yield                         | PayerClient, Claims, Bills, FeeSched                 |
| Denial / AR aging                           | Claim activity + AR notes                            |
| Clinical quality (Joint Commission, SAMHSA) | UA, assessments, Darts, take-home, COWS              |
| M&A integration                             | New SiteCode, same table shape                       |
| Labor productivity                          | Check-in wait, Darts units per counselor             |
| Salesforce / marketing funnel               | Appointment + Client Salesforce IDs, referral source |


---



## 6. The revenue engine — finance tables in business language



### 6.1 Two ledgers: patient ledger vs insurance ledger

BHG has **two parallel money systems** in SAMMS.

```
                    PATIENT
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
   Self-pay / copay              Third-party (3p)
   pats.tbl_Bills                pats.tbl_Claims
   24.2 million rows             + line items + activity
         │                           │
         │                           ├── tbl_vw3pBillSub (12.8M)
         │                           │     links Darts dsID → billable auth
         │                           ├── tbl_pbi3PayAuth (134K)
         │                           └── tbl_3pElig (584K)
         ▼                           ▼
      Cash in drawer / ACH        Clearinghouse → payer → ERA
```

`3p` **= third-party insurance.** That prefix is everywhere: `3pElig`, `3pClaim`, `3pArnote`, `3psetup`, `3PAYauth`.

### 6.2 `tbl_Bills` — the patient money table (24.2M rows)

This is **not** an insurance claim. It is the **clinic ledger line**: charge, payment, adjustment.


| Field                                        | Meaning                                              |
| -------------------------------------------- | ---------------------------------------------------- |
| `billCLTID`, `billDate`                      | Patient and day                                      |
| `billBILL`                                   | Amount charged                                       |
| `billPAY` / `billPAYTYPE`                    | Amount and method (cash, card, Medicaid copay, etc.) |
| `billAdjust` / `billReason` / `billADJUSTID` | Write-off, hardship, error                           |
| `billReceiptNum`, `blnDeposit`, `dtDeposit`  | Receipt and bank deposit                             |
| `FIFOallocated` / `FIFObalance`              | Payment applied oldest-first to open charges         |
| `BillAptID` / `BillServID`                   | Tie to appointment or service                        |
| `Costcenter`                                 | Internal accounting                                  |
| `billGuestID`                                | Guest-dose billing                                   |


This table is **#2 by P1 volume** because a long-stay patient can generate a bill line **every visit or every week for years**.

### 6.3 Claims family — insurance revenue


| Table                       | Role                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `tbl_Claims`                | One claim / weekly bundle. Payer, status, member, CMS-1500 boxes (`f21diag*`, `f23priorauth`, `f28totalcharge`, `f29amtpaid`…), `tpcStrWeek` |
| `tbl_ClaimLineItem`         | Service lines: CPT, modifier, NDC (drug), units, charge, `tpcliDSID` **→ Darts session**, mg (`tpcliIntMg`)                                  |
| `tbl_ClaimLineItemActivity` | Lifecycle: submitted, paid, denied, appealed                                                                                                 |
| `tbl_3pClaimNote`           | Biller ticklers / workflow notes                                                                                                             |
| `tbl_3pARNOTE`              | AR notes **on a line item** (`ArnLiid`) — denial follow-up                                                                                   |
| `tbl_vw3pBillSub`           | **12.8M** rows — “this Darts session (`dsID`) is the billable unit under this auth/modifier”                                                 |
| `tbl_pbi3PayAuth`           | Prior authorization: payer, service, units, effective/term dates, auth code, request/response docs                                           |
| `tbl_tbldiag10` (~196K)     | Patient ICD-10 list used on claims (`F11.20` etc.)                                                                                           |


**Line-item ↔ counseling** is the key join for “did we get paid for therapy?”  
**Line-item mg / NDC** is the key join for “did we get paid for medication?”

### 6.4 Access products (keep census when money is the barrier)


| Table                              | ~Rows | Meaning                                                                                                                                    |
| ---------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `tbl_Fmp`                          | 177K  | **Flexible Medication Program** — payment plan / at-risk agreement (`FmpIntRate`, `AtriskType`, start/end). Keep dosing while catching up. |
| `tbl_FinancialHardshipApplication` | 69K   | Sliding fee / charity documentation                                                                                                        |
| `ClientDemo2.credit`, `BackFee`    | —     | Store credit / back-owed fees                                                                                                              |


These exist because **a missed week of payment should not automatically become a missed week of methadone** if BHG can document a plan. Clinically that prevents withdrawal and overdose; commercially it protects census.

### 6.5 Payer master data


| Table                        | Meaning                                                  |
| ---------------------------- | -------------------------------------------------------- |
| `tbl_GlobalPayor`            | Enterprise payer list                                    |
| `tbl_FeeSched`               | What each payer pays for each service                    |
| `tbl_PayerCltHistory` (724K) | Every insurance change — the reason claims suddenly deny |
| `tbl_3PSETUP`                | Clinic billing identity (NPI, tax ID, SFTP)              |


---



## 7. How doses, orders, appointments, and finance relate

This is the relationship the business actually runs on.

```
                         ctrl.tbl_Clinic  (rules for this site)
                                 │
                                 ▼
              pats.tbl_ClientDemo1/2  ◄── identity, counselor, self-pay rate
                                 │
                                 ▼
              pats.tbl_Enrollment     ◄── episode / census
                                 │
        ┌───────────────┬────────┼────────────┬─────────────────┐
        ▼               ▼        ▼            ▼                 ▼
   tbl_Orders      tbl_DOSE   tbl_CheckIn  tbl_Appointments   tbl_PayerClient
   (standing Rx)   (dispense) (window)     (calendar)         (who pays)
        │               │        │            │                 │
        │               │        │            ▼                 │
        │               │        │       tbl_DartsSrv           │
        │               │        │       (counseling)           │
        │               │        │            │                 │
        │               └────────┴────────────┤                 │
        │                                    ▼                 ▼
        │                         tbl_Bills (patient $)   tbl_3pElig / Auth
        │                                    │                 │
        │                                    │                 ▼
        └──────── NDC / mg / dsID ──► tbl_Claims + ClaimLineItem
                                              │
                                              ▼
                                    ClaimLineItemActivity + AR notes
```

**Join keys you should memorize**


| Business entity           | Key                                                                |
| ------------------------- | ------------------------------------------------------------------ |
| Clinic                    | `SiteCode` (on almost every row)                                   |
| Patient                   | `SiteCode` + `ClientID` / `cltID` / `dsClt` / `BillCltid` / `eClt` |
| Standing medication order | `SiteCode` + `OrderNum` + `cltID`                                  |
| Dispense                  | `SiteCode` + `DoseId` (dose.`Ordernum` → order)                    |
| Window visit              | `SiteCode` + `ciID` (+ `ciDate`)                                   |
| Appointment               | appointment unique id; Darts.`dsAPTID`                             |
| Counseling session        | `SiteCode` + `dsID`                                                |
| Patient charge            | `SiteCode` + `BillId`                                              |
| Insurance claim           | `SiteCode` + `tpcID`                                               |
| Claim line                | `SiteCode` + `tpcliID` (`tpcliTPCID` → claim, `tpcliDSID` → Darts) |
| Auth                      | `SiteCode` + `TpaId`                                               |
| Eligibility event         | `SiteCode` + `EId`                                                 |




### 7.1 The four engines in one sentence each


| Engine                   | One sentence                                                                          | Why BHG cares                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Orders**               | The doctor’s current legal instruction for what drug and how much, on which days.     | Without a valid order, the nurse cannot dose (DEA). Dose changes are the titration story.                           |
| **Doses**                | Proof the medication left the bottle and entered the patient (or a take-home bottle). | Clinical outcome, DEA inventory, and often the trigger that a visit happened.                                       |
| **Appointments + Darts** | The scheduled and delivered counseling / medical visit.                               | Required for OTP certification; **the usual billable unit** on insurance (`dsID` on claim lines and `vw3pBillSub`). |
| **Finance**              | Who owes what, what was billed to insurance, what was collected.                      | This is revenue, margin, and access (hardship/FMP).                                                                 |




### 7.2 Typical money paths

**Path A — Classic OTP Medicaid bundle**

1. Patient assigned to Medicaid on `PayerClient`.
2. Auth (if any) on `pbi3PayAuth` for a date range / unit count.
3. Patient checks in and doses daily; counselor sees them on the required cadence.
4. Darts session marked billed; `vw3pBillSub` ties `dsID` to the auth.
5. Weekly `tbl_Claims` with `tpcWKSTART` submitted; lines may include medication NDC/mg and counseling CPT.
6. Activity table records paid/denied; AR notes if denied.

**Path B — Self-pay**

1. `ClientDemo2.Amount` + `Freq` + `Payday` (e.g. $xx weekly on Friday).
2. Front desk posts `tbl_Bills` charge and payment at the window.
3. If they cannot pay: FMP or hardship; `ciHOLD` may fire if clinic policy says so.

**Path C — Commercial / Medicare with copay**

1. Eligibility + auth.
2. Insurance claim **and** a patient `tbl_Bills` row for copay/deductible (`PayerClient.PyCopay`, `PyDeductleft`).

**Path D — Guest dose (travel)**

1. Dose row with `GuestId`.
2. Bill may use `billGuestID`. Home clinic and guest clinic both appear as SiteCodes.



### 7.3 What is *not* a 1:1 relationship (common analytics mistakes)


| Assumption                                | Reality                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------- |
| 1 check-in = 1 dose                       | Usually, but holds, excuses, voids, and multi-bottle take-homes break it.     |
| 1 dose = 1 bill                           | Bundle billing, weekly claims, and take-home packs mean many doses per claim. |
| 1 appointment = 1 Darts                   | No-shows, drop-ins, and uncharted sessions (`dsuncharted`) exist.             |
| 1 patient = 1 enrollment                  | Many episodes; always filter open enrollments for census.                     |
| Orders year table = calendar year of care | Rows are routed by `OrderDate` year; active orders span years.                |
| `tbl_Bills` = insurance revenue           | That table is the **patient** ledger. Insurance is `tbl_Claims`.              |


---



## 8. Other businesses and adjacent operations

BHG is not only “the methadone window.” The data model shows a **platform** of related businesses.

### 8.1 OBOT / office-based prescribing

Same patient master, different `Enrollment.Modality` / `MODULE` / payer flags (`PyBupe`). Orders still exist, but dispense may be a **pharmacy fill** rather than `tbl_DOSE`. Claim lines look more like standard medical CPT.

### 8.2 IOP and higher-intensity counseling

More Darts units, group appointments, longer `dsDtStart`–`dsDtEnd`. Select sites only.

### 8.3 Toxicology / labs

UA volume (10M+ schedules, 13M+ results) is a **clinical control system** and, in some payer contracts, a **billable service**. BHG has also operated **dedicated labs** (acquisition materials mentioned two labs). `Samms-LAB` (runner arg 5) is a special site path for lab demographics.

### 8.4 Guest dosing / national continuity

A network benefit: a BHG patient from Kentucky can dose in Tennessee while traveling. Guest fields exist specifically for that.

### 8.5 Pregnancy and women’s services

Dedicated E&M pregnancy forms, `ClientDemo1.Preg`, enrollment baby flags. OTP methadone in pregnancy is a distinct clinical product and a compliance focus.

### 8.6 State-specific clinical products

MN and VA comprehensive assessments, CSTAR (Missouri Medicaid), and other state forms exist because **licensure and Medicaid contracts are state-by-state**. That is why BHG’s insurance page is a long state list, not one national fee.

### 8.7 Contact center + Salesforce + marketing

Appointment and client Salesforce IDs, marketing consent, SMS consent, referral source. Corporate growth (the “commercial nerve center”) lives partly **outside** SAMMS.

### 8.8 HR / workforce (UKG) and other integrations

Referenced as future / adjacent integrations in project docs; **not first-class BHG_DR tables in this repo**. Clinic users in SAMMS are `tbl_User`, not the HRIS.

### 8.9 PHC

Separate ETL runner, same Save* patterns, PHC-specific consents and some forms (e.g. suicide severity). Operationally another SAMMS fleet.

### 8.10 What BHG is *not* doing (given this data)

- No inpatient / residential bed-management tables.
- No retail pharmacy POS (they **dispense** in OTP; they do not look like a drugstore).
- No claims *adjudication engine* — they **submit** claims; payers adjudicate.
- Methasoft / AdvancedMD sites are **excluded** from Regional P1/P2 (`ConnectionID <> 3`) — acquired clinics on other EHRs are a known integration edge.

---



## 9. How BHG benefits — clinically, operationally, financially



### 9.1 Clinical benefit (why the care model works)

Published BHG outcomes (their numbers, not this repo):

- 99% improved quality of life; 83% decreased substance use.
- 75% reach a protective target dose within 60 days.
- 62% retained at 90+ days (vs ~42% Medicaid OTP benchmark).
- 60% of previously unemployed working or in school at one year.
- 97% of those with prior arrests have no new arrest in year one.
- 82% of prior ER users do not return to the ER in the next year.

The **data model is built to produce those metrics**: dose titration (orders + doses), retention (enrollment + check-in), counseling dose (Darts), employment/justice (enrollment social fields), UA (illicit use).

### 9.2 Operational benefit of one warehouse

80–115 clinic databases are useless for a PE-backed operator if each SiteCode is an island.


| Benefit             | How the ETL estate delivers it                                          |
| ------------------- | ----------------------------------------------------------------------- |
| One census          | Enrollment + CheckIn + Dose rolled up by SiteCode / region / timezone   |
| One revenue picture | Bills + Claims + activity + fee schedule                                |
| Fast clinic ops     | Wait time, holds, no-shows                                              |
| Compliance evidence | Bottles, signatures, take-home assessments, UA                          |
| M&A                 | New clinic = new SiteCode, same mappings                                |
| Change detection    | `RowChkSum` so nightly jobs only write diffs                            |
| Scale               | Year partitions on Darts and Orders; Fabric Bronze/Silver/Gold underway |




### 9.3 Financial / PE benefit

The unit of value is **a retained, reimbursed patient-day** (or patient-week).

```
Enterprise value ≈
    number of clinics
  × average census
  × days in treatment
  × net collection per day
  − clinic labor, meds, rent, corporate
```

Tables that feed each lever:


| Lever                                      | Tables                                               |
| ------------------------------------------ | ---------------------------------------------------- |
| Clinic count                               | `tbl_Clinic`, `tbl_LocationCons`                     |
| Census                                     | `tbl_Enrollment`, `tbl_CheckIn`, `tbl_DOSE`          |
| Length of stay                             | Enrollment dates, last dose / last check-in          |
| Gross charges                              | `tbl_Bills.billBILL`, `ClaimLineItem.tpcliAmtCharge` |
| Collections                                | `billPAY`, claim activity paid amounts               |
| Denial leakage                             | Claim status, AR notes, rebills                      |
| Access / conversion                        | PPA, appointments, Salesforce, 3pElig                |
| Mix shift (Medicaid vs commercial vs cash) | `PayerClient`, `GlobalPayor`                         |
| Med cost / shrink                          | `tbl_Bottle`, `tbl_DOSE` mg, inventory group         |


**That is why finance, doses, orders, and appointments are not separate “modules” to the business.** They are four views of the same visit.

---



## 10. Data volume as a picture of the business

P1 snapshot: **57 tables, 103.8 million rows**. Top five are **~89%** of that volume. That ranking *is* the operating model.


| Rank | Table           | Rows  | What the volume means                                    |
| ---- | --------------- | ----- | -------------------------------------------------------- |
| 1    | CheckIn         | 32.2M | Daily physical presence is the product                   |
| 2    | Bills           | 24.2M | Someone is charged or pays on a very high cadence        |
| 3    | UAResults       | 13.1M | Toxicology is continuous, not occasional                 |
| 4    | vw3pBillSub     | 12.8M | Insurance billing is tied to **sessions**, at huge scale |
| 5    | UASched         | 10.2M | Screens are planned, not only resulted                   |
| 6    | SF_DataForms    | 4.2M  | Form-heavy regulated care                                |
| 7    | BAMScore        | 1.5M  | Outcomes are scored repeatedly                           |
| 8    | Enrollment      | 879K  | Many episodes; census is a filter, not the table size    |
| 9    | PayerCltHistory | 724K  | Insurance churn is a first-class problem                 |
| 10   | COWS            | 684K  | Withdrawal is measured, especially at start / restart    |


Dedicated high-volume schedules (not in that P1 103.8M):


| Schedule    | Arg | Domain                                                             | Why it is separate                      |
| ----------- | --- | ------------------------------------------------------------------ | --------------------------------------- |
| SAMMSGlobal | 1   | Users, payers, fee sched, consents                                 | Shared reference, not per-patient flood |
| Regional P1 | 2   | Core clinical + much of finance                                    | Timezone-batched daily                  |
| Catch-all   | 3   | Leftovers                                                          | —                                       |
| Regional P2 | 4   | Claims family, payer client, some assessments                      | Heavier insurance objects               |
| Samms-LAB   | 5   | Lab site demographics                                              | Special site                            |
| Samms-Forms | 6   | Form Q&A + signatures                                              | Enormous, form-driven                   |
| Notes       | 7   | Claim notes + AR notes                                             | Billing workflow                        |
| INV         | 8   | Bottles, liquid log, lab results, appointments, legacy assessments | Inventory + calendar + old forms        |
| DartSvc     | 9   | Counseling sessions                                                | Year-partitioned, lookback-heavy        |
| Dose        | 10  | Dose + excuse                                                      | Year windows / CDC pilot                |
| Orders      | 11  | Standing medication orders                                         | Year-partitioned 2016–2028              |
| PPA         | 12  | Pre-admission                                                      | Intake funnel                           |


**Universal technical patterns that exist because of the business**

- `SiteCode` **everywhere** — 100+ independent clinics, one brand.
- `RowChkSum` — high daily volume; only send what changed.
- **Year tables for Darts and Orders** — multi-year retention of counseling and prescriptions.
- **Soft** `RowState` — clinical/billing rows are voided, not physically deleted (audit).
- **Lookbacks of 15–200 days** — signatures, billing, and corrections happen after the visit.

---



## 11. Domain glossary


| Term                         | Meaning at BHG                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| **SAMMS**                    | Clinic EHR / PM system. One SQL database per site. Source of almost all tables here.   |
| **BHG_DR**                   | Central Azure SQL warehouse the C# ETL fills.                                          |
| **SiteCode**                 | Clinic identifier (AH, CBBO, B12B, …). Multi-tenant key.                               |
| **Client / clt**             | Patient. IDs are **per site**, not global. Same person at two clinics = two ClientIDs. |
| **M4ID**                     | Alternate patient ID used at the window / legacy ID.                                   |
| **Census**                   | Count of active patients (open enrollment, still treating).                            |
| **OTP**                      | Opioid Treatment Program — can dispense methadone on site.                             |
| **OBOT**                     | Office-based opioid treatment — prescribe buprenorphine/naltrexone.                    |
| **MOUD / MAT**               | Medications for OUD / medication-assisted treatment.                                   |
| **Methadone**                | Daily (or take-home) clinic-dispensed full agonist.                                    |
| **Buprenorphine / Suboxone** | Partial agonist; OTP or prescription.                                                  |
| **Naltrexone / Vivitrol**    | Antagonist; often monthly injection.                                                   |
| **Take-home**                | Unsupervised doses in labeled bottles. Earned by stability; tracked for diversion.     |
| **Diversion**                | Medication sold or given away. The compliance risk that drives UA, ID, bottle logs.    |
| **Hold**                     | Patient blocked from dosing until counseling, payment, or clinical issue is cleared.   |
| **Guest dose**               | Dose at a non-home OTP while traveling.                                                |
| **Darts / DartsSrv**         | Counseling or billable service session.                                                |
| **ASAM dimensions**          | Six-dimension assessment used for placement and treatment planning.                    |
| **COWS**                     | Clinical Opiate Withdrawal Scale.                                                      |
| **BAM**                      | Brief Addiction Monitor — outcome scores.                                              |
| **UA**                       | Urinalysis / urine drug screen.                                                        |
| **3p**                       | Third-party insurance.                                                                 |
| **Elig**                     | Eligibility verification event.                                                        |
| **Auth / 3PayAuth**          | Prior authorization from a payer.                                                      |
| **BillSub**                  | Link from a Darts session to authorized billable units.                                |
| **FMP**                      | Flexible Medication Program — payment / at-risk plan so dosing continues.              |
| **Hardship**                 | Sliding-fee / charity application.                                                     |
| **Claim line / CPT / NDC**   | Insurance service line: procedure code and drug code.                                  |
| **AR note**                  | Collections / denial note on a claim line.                                             |
| **Bundle**                   | One daily or weekly rate covering meds + counseling + support.                         |
| **RowChkSum**                | Source checksum; ETL skip-if-unchanged.                                                |
| **P1 / P2**                  | Regional ETL phases (not “Phase 1 finance product”). Timezone routing of tables.       |
| **PHC**                      | Related clinic fleet with its own runner.                                              |
| **PPA**                      | Patient pre-admission.                                                                 |


---



## 12. One-page “how BHG works”

```
BHG is a national chain of outpatient addiction clinics.
Most patients have opioid use disorder.

They come to a local clinic (often daily at first).
A nurse dispenses methadone or similar under an MD order.
A counselor sees them on a required schedule.
A lab checks urine for illicit use and medication adherence.
If they stabilize, they earn take-home bottles and come less often.

Medicaid, Medicare, commercial insurance, cash, grants, or hardship pays.
Insurance is often a weekly bundle; cash is a weekly window payment.
Claims and patient bills are how the clinic is funded.
Holds, auths, and eligibility are how the clinic avoids unpaid dosing.

Corporate BHG copies every clinic’s SAMMS database into one warehouse
so finance, clinical quality, and operators can manage ~115 sites
and ~42,000 daily patients as one company.
```

---



## 13. Sources and caveats

**Public / web**

- [BHG — Why we’re here](https://www.bhgrecovery.com/about-bhg/why-were-here/)
- [BHG — Get started / intake](https://www.bhgrecovery.com/patients/get-started/)
- [BHG — Insurance and payment](https://www.bhgrecovery.com/patients/insurance-and-payment/)
- [BHG — Medications](https://www.bhgrecovery.com/treatment/medications/)
- [BHG — Outcomes](https://www.bhgrecovery.com/about-bhg/outcomes/)
- [BHG — IOP](https://www.bhgrecovery.com/treatment/intensive-outpatient-program/)
- [BHG 2021 executive overview (media kit)](https://7851312.fs1.hubspotusercontent-na2.net/hubfs/7851312/BHG%20Media%20Kit%20-%202021.pdf)
- [Vistria — CBH acquisition](https://vistria.com/behavioral-health-group-acquires-center-for-behavioral-health/)
- SAMHSA / 42 CFR Part 8 OTP rules (take-homes, counseling, diversion)
- Ownership summaries: Vistria (2018), Mergr company profile

**This repo**

- `Regional_P1_P2_Source_to_Destination.md` — source→dest + row counts
- `BHG-DR-LIB/Models/*` — field-level entities
- `Documentation/*_Workflow_Documentation.md` — module ETL purpose
- `SaveP1Documentation/P1_Silver_Logic_Reference.md`
- `Scheduler_ETL_and_Tables.md`
- Workspace rule: `.cursor/rules/bcappcode-etl-architecture.mdc`

**Caveats**

- Row counts are a warehouse snapshot, not today’s census.
- Public clinic/patient counts are marketing figures; use Enrollment + CheckIn for analytics.
- Field interpretations (e.g. FMP = payment plan) come from names, surrounding finance docs, and OTP practice — confirm with a BHG biller before using in an audit.
- Do not treat `tbl_Bills` totals as “BHG revenue.” Add claims collections and net of adjustments.
- Patient identifiers are PHI. Site-level ClientIDs are not unique across the company.

---

*Written for BCAppCode. Last updated: 2026-09-11.*