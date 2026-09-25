# Microsoft Fabric: Real-Time Eventstream & Two-Speed Architecture Strategy

> **Document Type**: Enterprise Data Architecture Strategy & Implementation Blueprint  
> **Target Audience**: Chief Technology Officer (CTO), VP of Enterprise Data, Microsoft Fabric Architects, Healthcare DBAs  
> **Key Technologies**: Microsoft Fabric (F128 Capacity), Fabric Eventstreams, Real-Time Intelligence, OneLake Delta Parquet, SQL Change Data Capture (CDC), SAMMS EHR (120+ Multi-Clinic Databases)  
> **Author**: Digital Health Engineering & Cloud Data Architecture Team  

---

## 1. Executive Summary & Problem Statement

Behavioral Health Group (BHG) operates an enterprise estate spanning **120+ clinic database instances** in SAMMS. Currently, data engineering pipelines loop through all 120+ databases in nightly batch ETLs to extract reporting data into Microsoft Fabric on an **F128 capacity**.

### The Critical Architectural Pitfall
If the proposed **BHG Patient Portal** and **Clinician Portal** rely solely on the existing nightly batch ETL looping across all 120+ databases, the system faces severe, dangerous data staleness:
* **The Dosing Hold Disaster**: A clinic nurse or counselor places a **Medical/Administrative Hold** on a patient in SAMMS at 6:15 AM due to an overdue toxicology review. Because the nightly ETL only runs once every 24 hours, the patient's mobile app still displays **"No Holds Active"**. The patient drives to the clinic, is blocked at the dosing window, and experiences severe dosing anxiety, lobby frustration, and clinical risk.
* **The Broken Waiting Room**: A patient arrives in the clinic parking lot at 9:55 AM for a 10:00 AM visit and clicks **"1-Click Check-In"**. A daily batch pipeline means the counselor’s schedule agenda will not show the green **"Checked In"** badge until tomorrow morning!

### The Solution: The "Two-Speed" Data Architecture in Microsoft Fabric
The solution is not to run heavy batch ETLs constantly. Instead, we implement a battle-tested **Two-Speed Data Architecture (Cold Path + Hot Path)** natively inside Microsoft Fabric:
1. **Cold Path (Existing Nightly Batch ETL)**: Extracts the 35 static/historical tables (demographics, past dose logs, past lab results, master treatment plans) across the 120+ clinic databases.
2. **Hot Path (Fabric Eventstream & Real-Time Intelligence)**: Uses lightweight **SQL Change Data Capture (CDC)** to stream real-time events for **only 4 operational tables** (`tblHOLD`, `tblCHECKIN`, `Appointments`, `AppointmentAttend`) into Fabric with **sub-second to 10-second latency**.
3. **Portal Staging Tier (`portal.*`)**: Handles immediate, instant transactional writes (CBT submissions, hardship applications, check-in requests) with sub-second response times.

---

## 2. End-to-End System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION SAMMS EHR (120+ CLINIC DATABASES)                    │
└───────────────────┬────────────────────────────────────────────────┬───────────────────┘
                    │                                                │
                    │ COLD PATH (Your Existing Batch ETL)            │ HOT PATH (Fabric Eventstream / CDC)
                    │ • Nightly scheduled loop across 120+ DBs       │ • Continuous log-based CDC streaming
                    │ • 35 Heavy / Historical / Static Tables        │ • 4 Critical Operational Tables:
                    │   - ClientMaster (Demographics)                │   - tblHOLD (Active Dosing Holds)
                    │   - tblORDER & tblDOSE (Prescriptions)         │   - tblCHECKIN (Queue & Lobby)
                    │   - Historical UDS Labs & Assessments          │   - Appointments (Today's Agenda)
                    │   - Signed Master Treatment Plans              │   - AppointmentAttend (1-Click)
                    │ • Latency: 24 Hours (Completely acceptable)    │ • Latency: 5 to 10 Seconds
                    │                                                │
                    ▼                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         MICROSOFT FABRIC ESTATE (F128 CAPACITY)                        │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────┐       │
│   │                 FABRIC ONELAKE GOLD LAKEHOUSE (Delta Parquet)              │       │
│   │   • Unified Gold Tables (Partitioned by Clinic / SiteID)                   │       │
│   │   • Combines Nightly Batch History + Real-Time Streaming Deltas            │       │
│   │   • Exposed via T-SQL SQL Analytics Endpoint (TDS Port 1433)               │       │
│   └─────────────────────────────────────▲──────────────────────────────────────┘       │
│                                         │                                              │
│   ┌─────────────────────────────────────┴──────────────────────────────────────┐       │
│   │                  FABRIC OPERATIONAL STAGING DB (`portal.*`)                │       │
│   │   • Low-latency ACID transactional store for web/mobile writes             │       │
│   │   • portal.CheckInEvents        • portal.CBTPracticeLogs                   │       │
│   │   • portal.CounselorFeedback    • portal.FinancialHardshipApps             │       │
│   └─────────────────────────────────────▲──────────────────────────────────────┘       │
└─────────────────────────────────────────┼──────────────────────────────────────────────┘
                                          │ Reads & Instant Writes
┌─────────────────────────────────────────┴──────────────────────────────────────────────┐
│                  BHG PATIENT PORTAL & CLINICIAN INTERFACE (Web & Mobile)               │
│                          Sub-Second End-User Experience                                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. How Microsoft Fabric Eventstreams & Real-Time Intelligence Work

Microsoft Fabric includes a dedicated engine designed specifically for streaming transactional changes into OneLake: **Fabric Eventstreams**.

```
  SAMMS SQL Server             SQL Transaction Log           Fabric Eventstream            OneLake Delta Table
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ Nurse sets Hold: │ ───────> │  CDC captures    │ ───────> │ Streams event    │ ───────> │ Merged in Gold   │
│ tblHOLD INSERT   │          │  log entry       │          │ without batch ETL│          │ Lakehouse (5 sec)│
└──────────────────┘          └──────────────────┘          └──────────────────┘          └──────────────────┘
```

### The 4 Key Engineering Advantages:
1. **Zero Locking on SAMMS Dispensing Pumps**:  
   Traditional SQL queries run `SELECT` statements that can lock rows or tables. CDC works by reading the **asynchronous transaction log (.ldf file)**. It places **zero query locks** on the active SAMMS database.
2. **Sub-10-Second Latency for Critical Dosing Safety**:  
   When a clinician releases or places a hold in SAMMS, the change is captured by CDC, pushed through the Fabric Eventstream, and updated in the OneLake Gold Lakehouse in **5 to 10 seconds**.
3. **No Heavy Custom Pipeline Code**:  
   Fabric Eventstreams natively ingest CDC streams and auto-merge changes directly into OneLake Delta Parquet tables using standard delta lake upsert (`MERGE`) operations.
4. **F128 Capacity Performance**:  
   The dedicated F128 capacity provides 128 Capacity Units of compute, effortlessly processing real-time event streams from multiple clinic locations simultaneously.

---

## 4. Multi-Clinic Scaling Strategy: Managing the 120+ Databases

Trying to enable real-time streaming on all 120+ databases on Day 1 is unnecessary and risky. Here is the recommended phased rollout strategy:

### Phase A: Unified Cold Path (All 120+ Clinics)
* BHG continues its existing daily loop ETL in Fabric Data Factory.
* All 120+ clinic databases are extracted nightly into OneLake.
* Tables are unified in the Gold Lakehouse and partitioned by `SiteID` or `ClinicCode` (e.g., `SiteID = 12` for Knoxville Bernard).
* **Result**: Demographics, historical lab results, and dosing protocols for all 120+ clinics are immediately queryable in the portal.

### Phase B: Targeted Hot Path (Pilot Clinics First)
* Enable CDC and Fabric Eventstreams on the 4 operational tables (`tblHOLD`, `tblCHECKIN`, `Appointments`, `AppointmentAttend`) **only for designated pilot clinics**:
  * *Pilot 1*: Knoxville Bernard (`SiteID = 12`)
  * *Pilot 2*: Knoxville Citico (`SiteID = 14`)
  * *Pilot 3*: Jackson TN (`SiteID = 22`)
* This validates real-time streaming in production without touching the remaining clinics.
* Once proven, roll out CDC in waves (e.g., 20 clinics per month).

---

## 5. Complete Matrix: What Tables Go Where?

| System Tier | Table / Entity | Ingestion Engine | Target Latency | Business & Clinical Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **HOT PATH** | **`dbo.tblHOLD`** | Fabric Eventstream (CDC) | **5–10 Seconds** | **Life Safety**: Real-time dosing hold verification ("No Holds Active" shield). |
| **HOT PATH** | **`dbo.tblCHECKIN`** | Fabric Eventstream (CDC) | **5–10 Seconds** | **Clinic Flow**: Medication window queue position and lobby wait times. |
| **HOT PATH** | **`dbo.Appointments`** | Fabric Eventstream (CDC) | **5–10 Seconds** | **Daily Agenda**: Today's appointment schedule and emergency changes. |
| **HOT PATH** | **`dbo.AppointmentAttend`**| Fabric Eventstream (CDC) | **5–10 Seconds** | **1-Click Check-In**: Arrival timestamp notifying counselor of patient presence. |
| **PORTAL STAGING** | **`portal.CheckInEvents`** | Portal API (ACID Store) | **Sub-Second (Instant)** | Captures mobile arrival check-in click before syncing to SAMMS. |
| **PORTAL STAGING** | **`portal.CBTPractice`** | Portal API (ACID Store) | **Sub-Second (Instant)** | Stores urge-surfing logs, craving waves, and trigger mapping exercises. |
| **PORTAL STAGING** | **`portal.CounselorFeedback`**| Portal API (ACID Store) | **Sub-Second (Instant)** | Stores counselor comments on CBT homework for patient view. |
| **PORTAL STAGING** | **`portal.FinancialHardship`**| Portal API (ACID Store) | **Sub-Second (Instant)** | Staging sliding-scale fee relief applications and proof of income docs. |
| **PORTAL STAGING** | **`portal.MessageThreads`** | Portal API (ACID Store) | **Sub-Second (Instant)** | Real-time two-way encrypted patient-to-counselor messaging. |
| **COLD PATH** | **`dbo.ClientMaster`** | Fabric Data Factory (Daily) | Nightly Batch | Master Patient Index, demographics, phone, email, and legal names. |
| **COLD PATH** | **`dbo.tblORDER`, `tblDOSE`** | Fabric Data Factory (Daily) | Nightly Batch | Verified prescription dose, 7-day schedule, and historical window administrations. |
| **COLD PATH** | **`dbo.tblBottle`** | Fabric Data Factory (Daily) | Nightly Batch | Take-home bottle inventory, lot numbers, NDC codes, and step compliance. |
| **COLD PATH** | **`dbo.tblUAResult`** | Fabric Data Factory (Daily) | Nightly Batch | Toxicology panels, prescribed vs. unexpected flags, and GC/MS values. |
| **COLD PATH** | **`dbo.BAMForm`, `SF_Cows`** | Fabric Data Factory (Daily) | Nightly Batch | Recovery milestone scores, BAM coping factors, and COWS stability. |
| **COLD PATH** | **`dbo.InitialTreatmentPlan`**| Fabric Data Factory (Daily) | Nightly Batch | Master ASAM treatment plans and clinical dimension severity ratings. |
| **COLD PATH** | **`dbo.tblBill`, `tbl3pElig`** | Fabric Data Factory (Daily) | Nightly Batch | Outstanding dues balance (`FIFObalance`) and active insurance verification. |
| **COLD PATH** | **`dbo.ConsentToDisclosure...`**| Fabric Data Factory (Daily) | Nightly Batch | 42 CFR Part 2 Releases of Information and annual treatment agreements. |

---

## 6. How to Pitch This to the Client (Executive Presentation Script)

When you meet with the client's Chief Technology Officer, VP of Data Architecture, and Microsoft Fabric Lead, deliver this exact narrative:

### Step 1: Validate Their Architecture & Confirm Agreement
> *"You have built a great enterprise pipeline looping through all 120+ clinic databases into Microsoft Fabric. For analytics, Power BI reporting, and historical data, that daily batch model is perfect.*
>
> *However, as we evaluated the patient experience, we identified a critical operational risk: a 24-hour batch delay means a patient whose dosing hold was placed at 6:00 AM would still see 'No Holds Active' on their phone, drive to the clinic, and be blocked at the dosing window. Similarly, waiting room check-ins cannot wait 24 hours."*

### Step 2: Introduce the Two-Speed Solution
> *"Rather than forcing all 120 databases into a high-risk continuous sync, we recommend a **Two-Speed Data Architecture inside your Fabric F128 environment**:*
> * **The Cold Path**: We keep 90% of the tables (35 tables: demographics, dose history, lab results, billing) on your **existing nightly batch loop**. Zero disruption to your current work.
> * **The Hot Path**: We use **Fabric Eventstreams & Real-Time Intelligence** with SQL Change Data Capture (CDC) strictly for the **4 operational tables** (`tblHOLD`, `tblCHECKIN`, `Appointments`, `AppointmentAttend`).*
> * **The Benefit**: This provides **sub-10-second real-time safety** for dosing holds and waiting room arrivals, with zero table locks on clinic dispensing pumps."*

### Step 3: Present the Rollout & Business Win
> *"We don't boil the ocean on day one. We test the real-time Eventstream on 2 or 3 pilot clinics (like Knoxville Bernard and Jackson TN) while the rest of the 120 clinics run on the daily batch. 
>
> This demonstrates the true enterprise power of your **Fabric F128 capacity**—making BHG an industry leader in running live, real-time healthcare engagement directly on Microsoft OneLake."*

---

## 7. Next Technical Steps

1. **CDC Audit**: Run a 10-minute check on the pilot clinic database to verify SQL Server CDC capability (`sys.sp_cdc_enable_db`).
2. **Fabric Eventstream Workspace Setup**: Provision a test Fabric Eventstream connected to an Azure Event Hub or SQL CDC listener.
3. **Delta Lake Upsert Verification**: Verify that the streaming delta merges into the Gold Lakehouse table within 5 to 10 seconds.
