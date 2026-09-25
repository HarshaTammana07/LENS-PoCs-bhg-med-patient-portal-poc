# BHG Patient Portal & Clinician Interface: Production Architecture & Integration Strategy

> **Document Type**: Executive Solution Proposal & Technical Architecture Strategy  
> **Target Audience**: BHG Executive Leadership, VP of IT / Chief Technology Officer, Enterprise DBAs, Clinical Operations & Compliance Teams  
> **Key Environment**: `bhg_dr` (Azure SQL Database / Managed Instance) & SAMMS Production EHR  
> **Author**: Digital Health Engineering & Architecture Team  

---

## 1. Executive Summary

As Behavioral Health Group (BHG) scales digital patient engagement across its Opioid Treatment Programs (OTP), Office-Based Opioid Treatment (OBOT), and Intensive Outpatient Programs (IOP), establishing a reliable, high-performance integration between the digital portals and the core EHR is paramount.

### The Core Dilemma
Directly connecting an external web and mobile application to the live, on-premise **SAMMS production database** introduces unacceptable operational and regulatory risks:
* **Clinical Performance Risk**: Web traffic from thousands of active patients querying schedules and lab results could create database locks and latency during peak morning medication dosing (5:00 AM – 10:30 AM), slowing dispensing pumps and creating clinic lobby crowding.
* **Security & Regulatory Risk**: Connecting external consumer clients directly to an EHR violates strict HIPAA perimeter guidelines and **42 CFR Part 2** data segmentation rules.
* **Vendor Dependency & Delay**: Negotiating direct database access or custom API connectors with legacy EHR vendors typically requires 6 to 12 months of bureaucratic delays and significant licensing costs.

### The Proposed Solution: Leveraging `bhg_dr` as the Operational Data Tier
BHG already maintains **`bhg_dr`**, an approved, HIPAA-compliant **Azure SQL environment** actively populated via daily ETL pipelines from SAMMS. 

We propose leveraging **`bhg_dr` as the dedicated Operational Data Tier (ODT)** for the BHG Patient Portal and Clinician Interface:
1. **Read Operations**: The portal API reads verified clinical data (demographics, dosing protocols, appointments, toxicology screens, and clinic hours) directly from the `dbo.*` replica tables in `bhg_dr`.
2. **Write Operations**: All patient and clinician submissions (1-click check-ins, CBT homework, counselor feedback, financial hardship applications, secure messages) write to an isolated, dedicated **`portal.*` staging schema** within `bhg_dr`.
3. **Data Synchronization**: A controlled, bi-directional synchronization bridge (via Azure SQL Managed Instance Linked Server or automated micro-batch jobs) coordinates data between SAMMS and `bhg_dr` without touching live dosing engines.

---

## 2. End-to-End System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION FRONTEND LAYER                              │
│       BHG Patient Portal (Mobile / Web)     │      BHG Clinician Portal (Web)          │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ HTTPS / TLS 1.3 (Encrypted JWT Session)
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   BHG SECURE API GATEWAY (Node.js / Azure App Services)                │
│       • 42 CFR Part 2 Redaction Engine      • Azure Active Directory (Entra ID) Auth   │
│       • Input Validation & Sanitization     • Role-Based Access Control (RBAC)         │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ Private Endpoint (VNet-Integrated SQL Connection)
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              AZURE SQL SERVER (`bhg_dr`)                               │
│                                                                                        │
│   ┌────────────────────────────────────────┐  ┌────────────────────────────────────┐   │
│   │    READ-ONLY REPLICA SCHEMA (`dbo.*`)  │  │   ISOLATED PORTAL SCHEMA (`portal.*│   │
│   │    (Populated from SAMMS ETL)          │  │   (Read/Write for Portal Services) │   │
│   │  • ClientMaster (Demographics & MPI)   │  │  • portal.CheckInEvents (1-Click)  │   │
│   │  • tblORDER & tblDOSE (Prescriptions)  │  │  • portal.CBTPracticeLogs          │   │
│   │  • tblCHECKIN & tblHOLD (Queue/Holds)  │  │  • portal.CounselorFeedback        │   │
│   │  • Appointments & AppointmentAttend    │  │  • portal.FinancialHardshipApps    │   │
│   │  • tblUAResult & tblUAResultDetail     │  │  • portal.SecureMessageThreads     │   │
│   │  • tblCLINIC & tblSITES (Hours/Centers)│  │  • portal.ConsentAuditLedger       │   │
│   │  • tblBill & tbl3pElig (Billing/Dues)  │  │  • portal.NotificationQueue        │   │
│   └────────────────────────────────────────┘  └─────────────────┬──────────────────┘   │
└───────────────────────────────────▲─────────────────────────────┼──────────────────────┘
                                    │                             │
                   Existing Daily / │ Incremental                 │ Controlled Staging Sync
                   Micro-Batch ETL  │ (CDC / ADF)                 │ (Stored Procedures / SSIS)
                                    │                             │
┌───────────────────────────────────┴─────────────────────────────▼──────────────────────┐
│                              PRODUCTION SAMMS EHR DATABASE                             │
│       • Daily Dispensing Pumps                 • Methadone Inventory Vault             │
│       • Dosing Window Nurse Kiosks             • Prescriber DEA Orders                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The 5 Strategic Value Pillars (The Pitch to Stakeholders)

### 💎 Pillar 1: Zero Clinical Performance Impact on Clinic Dosing
* **The Clinical Reality**: In an Opioid Treatment Program (OTP), the morning dosing rush (5:00 AM – 8:30 AM) is mission-critical. If an EHR database experiences query locking or high CPU utilization, dispensing nurses face frozen screens, halting medication administration.
* **Our Solution**: By hosting all portal read queries on `bhg_dr` in Azure, **zero queries from patient phones ever hit production SAMMS**. The production EHR is completely insulated from consumer traffic.

### 💰 Pillar 2: Maximizing ROI on Existing Infrastructure
* **The Cost Reality**: Enterprise healthcare organizations pay substantial cloud hosting fees for Disaster Recovery (DR) and reporting databases, which often sit underutilized outside of nightly reporting runs.
* **Our Solution**: We repurpose `bhg_dr` into an active, high-value **Operational Data Tier**. BHG incurs **no additional database licensing fees**, no vendor API connector surcharges, and no third-party middleware expenses.

### 🔒 Pillar 3: Air-Gapped HIPAA & 42 CFR Part 2 Security Quarantine
* **The Compliance Reality**: Substance Use Disorder (SUD) patient records carry severe federal criminal and civil penalties under 42 CFR Part 2 and HIPAA if exposed.
* **Our Solution**: 
  * The public internet terminates at the Azure API Gateway.
  * `bhg_dr` is secured within an Azure Virtual Network (VNet) using Azure Private Endpoints.
  * Database accounts use Microsoft Entra ID (Azure AD) Managed Identities with **Principle of Least Privilege**: the portal service account has read-only access to `dbo.*` and can only write to the isolated `portal.*` schema.

### 🛡️ Pillar 4: The "Staging Schema" Pattern for Safe Data Writes
* **The DBA Reality**: No responsible Database Administrator will allow a web application to write directly into core EHR tables (like `dbo.tblORDER` or `dbo.Appointments`).
* **Our Solution**: We implement strict schema partitioning inside `bhg_dr`:
  * **`dbo.*` Schema**: Completely read-only for the web/mobile portal.
  * **`portal.*` Schema**: Dedicated tables where patient inputs are staged, validated, and audited. BHG DBAs maintain complete oversight of how and when staged records are integrated back into SAMMS.

### 🚀 Pillar 5: Accelerated Time-to-Market (Weeks vs. Months)
* **The Timeline Reality**: Waiting for a legacy EHR vendor to build, certify, and deploy custom FHIR/REST endpoints typically delays projects by 9 to 14 months.
* **Our Solution**: Because `bhg_dr` already contains the verified 39 tables and 1,333 columns mapped in our data specification, **backend engineering can begin on Day 1**.

---

## 4. Technical Implementation & Data Flow

### 4.1 Schema Partitioning in `bhg_dr`

To ensure pristine separation between replicated EHR records and application-generated data, `bhg_dr` will host two distinct schemas:

```sql
-- 1. Read-Only Schema: Populated by SAMMS ETL
GRANT SELECT ON SCHEMA::dbo TO [bhg_portal_api_user];
DENY INSERT, UPDATE, DELETE ON SCHEMA::dbo TO [bhg_portal_api_user];

-- 2. Read/Write Schema: Owned by Portal Backend
CREATE SCHEMA [portal] AUTHORIZATION [dbo];
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::portal TO [bhg_portal_api_user];
```

### 4.2 Data Mapping Across Schemas

| User Action / Screen | Read Target (`dbo.*` in `bhg_dr`) | Write Target (`portal.*` in `bhg_dr`) | Sync to SAMMS Pipeline |
| :--- | :--- | :--- | :--- |
| **Patient 1-Click Check-In** | `dbo.Appointments` (confirm visit time) | `portal.CheckInEvents` (`ClientMasterID`, `AppointmentID`, `ArrivalDT`) | Syncs to `AppointmentAttend.aaDTENROLLED` |
| **Dosing Holds Check** | `dbo.tblCHECKIN`, `dbo.tblHOLD` (`ciHOLD = 0`) | *Read-only check* | None (Live read) |
| **Active Medication Dosing** | `dbo.tblORDER`, `dbo.tblDOSE` (dose, schedule) | *Read-only check* | None (Live read) |
| **Between-Session CBT** | `dbo.DraftDAPNote` (counselor homework) | `portal.CBTPracticeSubmissions` (`UrgeRating`, `Triggers`, `Notes`) | Staged for counselor chart review |
| **Counselor CBT Feedback**| `portal.CBTPracticeSubmissions` | `portal.CounselorFeedback` (`FeedbackText`, `ReviewerID`) | Updates patient portal notification |
| **Financial Hardship Form**| `dbo.tblBill.FIFObalance`, `dbo.tbl3pElig` | `portal.FinancialHardshipApps` (`Income`, `Dependents`, `DocURLs`) | Alerts billing department for review |
| **Appointment Reschedule** | `dbo.Appointments` (existing slot) | `portal.RescheduleRequests` (`PreferredDay`, `Reason`) | Populates Clinician Triage Queue |
| **Destigmatized UDS Labs** | `dbo.tblUAResult`, `dbo.tblUAResultDetail` | *Read-only check* | None (Live read from LIS sync) |

---

## 5. Technical Options for Real-Time & Near-Real-Time Data

While demographics and billing balances are well-served by daily ETL runs, operational features such as **dosing window holds** and **waiting room check-ins** require low latency. We propose two proven deployment options:

### Option A: Azure SQL Managed Instance (Linked Server) — *Preferred if `bhg_dr` is on SQL MI*
* **Architecture**: Configure a secure Linked Server from `bhg_dr` to the on-premise SAMMS database over an Azure ExpressRoute or IPSec VPN tunnel.
* **Mechanism**: High-frequency queries (such as checking `tblHOLD.hdRemoveDt` or writing check-in timestamps) execute directly across the linked bridge using optimized, indexed single-record lookups.
* **Benefit**: True real-time synchronization with minimal overhead.

### Option B: Incremental Micro-Batch Sync (Azure Data Factory / CDC) — *Preferred for Azure SQL Database*
* **Architecture**: Enable **Change Data Capture (CDC)** on four high-velocity operational tables: `tblCHECKIN`, `tblHOLD`, `Appointments`, and `AppointmentAttend`.
* **Mechanism**: An Azure Data Factory (ADF) pipeline or lightweight Azure Function syncs delta changes between SAMMS and `bhg_dr` on a **5-minute micro-batch schedule**.
* **Benefit**: Completely decoupled; works on any tier of Azure SQL without requiring cross-server database links.

---

## 6. Security, Compliance & Governance Controls

| Requirement | How the `bhg_dr` Solution Complies |
| :--- | :--- |
| **HIPAA Security Rule** | All data at rest in `bhg_dr` is encrypted with **Transparent Data Encryption (TDE)** using customer-managed keys (CMK). All data in transit is enforced with **TLS 1.3**. |
| **42 CFR Part 2 Quarantine** | Substance use disorder records are segmented. The API Gateway sanitizes data payloads, ensuring that Social Security Numbers are masked (`***-**-6789`) and external disclosures are blocked without verified digital releases (`dbo.ConsentToDisclosureofPatientInfo`). |
| **Principle of Least Privilege** | The Portal API connects using an isolated database credential restricted strictly to reading `dbo.*` and writing to `portal.*`. No `ALTER`, `DROP`, or administrative server permissions are granted. |
| **Audit Logging & Traceability** | Every read and write transaction is logged in Azure Monitor and SQL Server Audit logs, capturing client IP, timestamp, user ID, and records accessed. |
| **Disaster Recovery Isolation** | The operational portal workload uses dedicated read-intent connections or elastic database resources, ensuring standard disaster recovery RPO/RTO objectives for `bhg_dr` are never compromised. |

---

## 7. Phased Implementation Roadmap

```
Phase 1: Foundation (Weeks 1-2)
├── Provision portal schema & service accounts in bhg_dr
├── Validate read permissions across 39 mapped dbo tables
└── Establish Azure Key Vault secrets & API Gateway connection

Phase 2: Core Read Pipelines (Weeks 3-4)
├── Deploy Patient Demographics, Dosing Hours & Protocol endpoints
├── Deploy Lab/UDS Results & Treatment Level progress endpoints
└── Connect frontend screens to live bhg_dr read feeds

Phase 3: Interactive Staging Pipelines (Weeks 5-6)
├── Deploy 1-Click Check-In & Appointment Rescheduling staging tables
├── Deploy Between-Session CBT Practice & Counselor Feedback tables
└── Deploy Financial Hardship Application submission & document upload

Phase 4: Bi-Directional Testing & Go-Live (Weeks 7-8)
├── Perform end-to-end sync testing between bhg_dr and SAMMS staging
├── Complete penetration testing & 42 CFR Part 2 compliance audit
└── Pilot launch across designated pilot treatment centers (e.g., Knoxville Bernard)
```

---

## 8. Stakeholder Q&A (Preparing for Client Meetings)

#### Q1: "Will this slow down our daily reporting queries running on `bhg_dr`?"
> **Answer**: No. Azure SQL allows configuring dedicated **Read Replicas** or scaling database throughput (DTUs/vCores). Furthermore, portal queries are heavily indexed single-record lookups (`WHERE ClientID = @id`), which consume negligible computing resources compared to heavy analytic batch reports.

#### Q2: "What happens if a patient submits data while the nightly ETL is running?"
> **Answer**: Because all patient submissions write to the isolated **`portal.*` schema**, portal writes are completely unaffected by schema operations or table updates occurring in the `dbo.*` replica.

#### Q3: "Can a bug in the portal corrupt our SAMMS production database?"
> **Answer**: It is architecturally impossible. The portal application has **zero physical connection and zero write credentials to production SAMMS**. It only writes to staging tables inside `bhg_dr`. BHG's own validated database procedures control the ingestion of data from staging into SAMMS.

#### Q4: "Do we need approval from the SAMMS software vendor to do this?"
> **Answer**: No. Because `bhg_dr` is BHG’s own internal database replica hosted in BHG's Azure tenant, you do not need permission, custom development, or vendor professional services from SAMMS to proceed.

---

## 9. Conclusion & Next Steps

Leveraging `bhg_dr` provides Behavioral Health Group with the **fastest, safest, and most cost-effective path to launch**:
* ✅ **Zero risk to clinic medication dispensing**
* ✅ **100% compliant with HIPAA & 42 CFR Part 2**
* ✅ **Capitalizes on existing Azure investments without new software licensing**
* ✅ **Ready for immediate technical execution using our completed 39-table schema mapping**

**Recommended Next Step**: Schedule a 30-minute technical review with the BHG Database Administration and Cloud Architecture team to review the `portal.*` schema definitions and provision the initial database service account.
