# BHG Portal Architecture: Microsoft Fabric (F128) Evolution & Integration Strategy

> **Document Type**: Strategic Architecture Whitepaper & Technical Migration Plan  
> **Target Audience**: Chief Information Officer (CIO), Chief Technology Officer (CTO), Enterprise Data Architects, Microsoft Fabric Program Leads, Healthcare DBAs  
> **Core Technologies**: Microsoft Fabric (F128 Capacity), OneLake, Lakehouse / Warehouse SQL Endpoint, Fabric Data Factory, On-Premises Data Gateway, SAMMS EHR  
> **Author**: Digital Health Engineering & Cloud Architecture Team  

---

## 1. Executive Summary & Strategic Context

Behavioral Health Group (BHG) is modernizing its enterprise data estate by migrating legacy ETL pipelines and the `bhg_dr` Azure SQL database to **Microsoft Fabric on an enterprise F128 capacity** (128 Capacity Units).

### The Strategic Question
> *"If BHG plans to offload `bhg_dr` and consolidate SAMMS EHR data into Microsoft Fabric, can we connect the BHG Patient Portal and Clinician Interface to Fabric? Is a linked connection from SAMMS to Fabric feasible, and how should we pitch this evolution to leadership?"*

### The Verdict: **YES, and it significantly strengthens our architecture.**
Microsoft Fabric is not just a replacement for `bhg_dr`; it is a **next-generation unified analytics and operational data platform**. 

Because Microsoft Fabric provides a native **T-SQL SQL Analytics Endpoint (TDS Port 1433)** over OneLake Delta tables, our portal backend can connect to Fabric using standard SQL Server connection strings with **virtually zero code changes**.

Furthermore, Microsoft Fabric introduces native **SQL Database Mirroring** and **On-Premises Data Gateway Pipelines**, establishing an automated, near-real-time data pipeline from SAMMS to Fabric without traditional fragile linked servers.

---

## 2. End-to-End Microsoft Fabric Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION FRONTEND LAYER                              │
│       BHG Patient Portal (Mobile / Web)     │      BHG Clinician Portal (Web)          │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │ HTTPS / TLS 1.3 (OAuth2 / Entra ID)
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   BHG SECURE API GATEWAY (Node.js / Azure App Services)                │
│       • 42 CFR Part 2 Redaction Engine      • Microsoft Entra ID (Azure AD) Auth       │
│       • REST & GraphQL Interface Layer      • Input Sanitization & Rate Limiting       │
└───────────────────┬────────────────────────────────────────────────┬───────────────────┘
                    │ T-SQL (Port 1433)                              │ Fast OLTP Writes /
                    │ Reads & Analytics                              │ Staging Submissions
                    ▼                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         MICROSOFT FABRIC ESTATE (F128 CAPACITY)                        │
│                                                                                        │
│  ┌──────────────────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │     FABRIC LAKEHOUSE (Gold / Curated)    │  │   FABRIC OPERATIONAL STAGING DB    │  │
│  │   • OneLake Delta Parquet Tables         │  │   (Fabric SQL Database / Staging)  │  │
│  │   • ClientMaster (MPI)                   │  │  • 1-Click Waiting Room Check-Ins  │  │
│  │   • tblORDER, tblDOSE (Prescriptions)    │  │  • Between-Session CBT Practice    │  │
│  │   • tblCHECKIN, tblHOLD (Queue/Holds)    │  │  • Counselor Feedback Logs         │  │
│  │   • Appointments & AppointmentAttend     │  │  • Financial Hardship Applications │  │
│  │   • tblUAResult (Toxicology LIS)         │  │  • Secure Message Threads          │  │
│  │   • SQL Analytics Endpoint (Port 1433)   │  │  • Digital Consents (42 CFR Part 2)│  │
│  └──────────────────▲───────────────────────┘  └─────────────────┬──────────────────┘  │
└─────────────────────┼────────────────────────────────────────────┼─────────────────────┘
                      │                                            │
        Fabric SQL    │ Fabric Data Factory Pipeline /             │ Write-Back Ingestion
        Mirroring /   │ On-Premises Data Gateway                   │ (Stored Procs / REST)
        CDC Feed      │ (Direct from SAMMS)                        │
                      │                                            │
┌─────────────────────┴────────────────────────────────────────────▼─────────────────────┐
│                              PRODUCTION SAMMS EHR (On-Prem)                            │
│           • Methadone Dispensing Pumps        • Dosing Window Nurse Kiosks             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. How the "Linked Connection" from SAMMS to Fabric Works

In the Microsoft Fabric ecosystem, connecting an on-premise system like SAMMS to Fabric is achieved through **three modern cloud patterns** that replace legacy SQL Server Linked Servers:

### Pattern 1: Fabric SQL Server Database Mirroring (Near-Real-Time Streaming) — *Recommended*
* **How it Works**: Fabric features native **Database Mirroring for SQL Server**. It attaches to SAMMS using Change Data Capture (CDC) and continuously streams transactional deltas directly into OneLake in near-real-time (sub-minute latency).
* **Key Advantages**:
  * **Zero ETL code**: No SSIS, no pipeline maintenance.
  * **Zero read locks on SAMMS**: Reads are non-blocking log scans.
  * **Automatic Delta Lake conversion**: Transactional SQL tables are instantly available as queryable Delta Parquet files in OneLake.

### Pattern 2: Fabric Data Factory via On-Premises Data Gateway (Scheduled / Micro-Batch)
* **How it Works**: Fabric Data Factory connects across the secure **On-Premises Data Gateway** or Azure VNet Data Gateway installed in BHG's datacenter.
* **Key Advantages**:
  * Already familiar to BHG’s data engineering team (since existing daily ETLs are currently being migrated to Fabric).
  * Can run incremental micro-batches (e.g., every 5 minutes for `tblCHECKIN` and `tblHOLD`, daily for demographics).

### Pattern 3: T-SQL Cross-Database Queries via Fabric SQL Analytics Endpoint
* **How it Works**: Microsoft Fabric exposes a standard **T-SQL Tabular Data Stream (TDS) endpoint on port 1433** for every Lakehouse and Warehouse.
* **Key Advantages**:
  * From the perspective of the Portal API Gateway, **Fabric looks and acts exactly like an Azure SQL Server**.
  * Any application that can connect to SQL Server can connect to Fabric using standard SQL drivers (`mssql`, `node-tedious`, `ADO.NET`).

---

## 4. The 5 Major Selling Points: Pitching Fabric F128 to Leadership

### 🏆 1. Capitalizing on the F128 Capacity Investment
* **Executive Reality**: An **F128 Fabric Capacity** is a significant enterprise investment (equivalent to 128 dedicated compute units). Leadership wants to see maximum enterprise utilization across clinical analytics and patient-facing applications.
* **The Pitch**: *"By connecting the Patient and Clinician Portals to Fabric, BHG immediately expands the ROI of its F128 capacity. Rather than treating Fabric as a passive reporting warehouse, it becomes the operational engine powering live patient care."*

### ⚡ 2. Massive Performance & Compute Isolation
* **Executive Reality**: Portal usage spikes in the morning when thousands of patients check dosing hours, and clinicians review caseloads.
* **The Pitch**: *"With F128 capacity, Fabric dynamically allocates compute for high-speed queries without breaking a sweat. Automatic column-level indexing and Delta Lake caching ensure sub-second portal response times, completely isolated from clinic dispensing pumps."*

### 🔄 3. Seamless Evolution: Zero Rewrite of Portal Code
* **Executive Reality**: Leadership will worry that migrating from `bhg_dr` to Fabric will require rewriting the portal application.
* **The Pitch**: *"Because Fabric Lakehouses expose a standard SQL Server (T-SQL) port, our Portal API uses the exact same table schemas (`dbo.ClientMaster`, `dbo.tblORDER`, etc.) and identical queries. Transitioning from `bhg_dr` to Fabric is simply a matter of updating a connection string in Azure Key Vault."*

### 🌐 4. Unified OneLake (Single Source of Truth)
* **Executive Reality**: Siloed databases mean data discrepancies between clinical dashboards, finance, and patient mobile apps.
* **The Pitch**: *"OneLake eliminates copies and sync lag. A toxicology result or attendance record loaded into OneLake is immediately visible to executive Power BI reports, clinical dashboards, and the patient's phone simultaneously."*

### 🛡️ 5. Unified Purview Governance & 42 CFR Part 2 Auditing
* **Executive Reality**: Substance use disorder (SUD) data governance across multiple cloud databases creates compliance exposure.
* **The Pitch**: *"Microsoft Fabric integrates natively with Microsoft Purview for sensitivity labeling, access control, and 42 CFR Part 2 auditing. All data access is governed under a single pane of glass."*

---

## 5. Architectural Detail: Handling Reads vs. Writes in Fabric

A critical technical distinction must be maintained when using Fabric for customer-facing applications:

| Operation Type | Architectural Recommendation | Why This is Best Practice |
| :--- | :--- | :--- |
| **READ Queries**<br>*(Demographics, Prescriptions, Appointments, Labs, Dosing Hours)* | Direct query against **Fabric SQL Analytics Endpoint (Port 1433)** over OneLake Delta tables. | Lightning-fast columnar reads, zero impact on SAMMS, leverages F128 in-memory caching. |
| **WRITE Operations**<br>*(1-Click Check-Ins, CBT homework, Counselor feedback, Hardship applications)* | Written to a dedicated **Fabric SQL Database (OLTP)** or staged in an **Operational Staging Store**. | Fabric Warehouse is an OLAP/analytical engine optimized for bulk operations. High-frequency individual web transactions (OLTP) should write to an ACID transactional staging table, which Fabric mirrors into OneLake and syncs back to SAMMS. |

---

## 6. Two-Phase Transition Roadmap (Zero Downtime)

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Immediate Launch with bhg_dr (Next 30–60 Days)                │
├────────────────────────────────────────────────────────────────────────┤
│ • Deploy Portals against bhg_dr Azure SQL (already live & populated).  │
│ • Zero blockers; development proceeds immediately.                     │
│ • Establishes proven baseline for patient and clinician engagement.   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Seamless Cutover to Microsoft Fabric F128 (Planned Migration) │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Fabric Team completes SAMMS → Fabric Lakehouse migration.           │
│ 2. Verify the 39 SAMMS tables exist in Fabric Gold Lakehouse.          │
│ 3. Point Portal API Gateway connection string from bhg_dr to Fabric    │
│    SQL Analytics Endpoint.                                             │
│ 4. Validate read/write parity and decommission bhg_dr.                 │
│ 5. ZERO changes to React frontend code.                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Client Pitch Presentation Outline (Executive Ready)

When presenting this vision to the client's CTO, VP of IT, and Fabric Lead, follow this 4-step narrative:

1. **Acknowledge & Validate Their Roadmap**:  
   *"We understand BHG is investing in Microsoft Fabric with F128 capacity to modernize enterprise data operations. Our architecture was designed from the ground up to support this strategic direction."*

2. **Present the Two-Phase Strategy**:  
   *"We don't need to wait for Fabric migration to complete to deliver patient value. We launch Phase 1 on `bhg_dr` today, and execute a zero-downtime cutover to Fabric in Phase 2 when your data team is ready."*

3. **Demonstrate Technical Compatibility**:  
   *"Because Fabric provides a native T-SQL TDS endpoint over OneLake, our 39-table schema mapping works identically in both environments. Not a single line of portal UI code needs to be rewritten."*

4. **Highlight the Business Win**:  
   *"This approach maximizes the utilization of your F128 capacity investment, eliminates the recurring maintenance cost of `bhg_dr`, and establishes BHG as a pioneer in running digital patient engagement directly on Microsoft Fabric."*
