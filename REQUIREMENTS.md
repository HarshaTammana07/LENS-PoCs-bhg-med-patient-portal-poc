# BHG Unified Patient Portal (POC) - Requirements Specification

## 1. 📌 Overview
### Product Name
BHG Patient Portal (POC)

### Objective
Build a proof-of-concept patient portal that demonstrates:
*   A unified healthcare experience
*   Integration-ready architecture (EMR, labs, devices)
*   Secure role-based access (RBAC)
*   A scalable foundation aligned with future Azure-based platform
*   A single AI-powered feature

## 2. 🎯 Goals
### Primary Goals
*   Demonstrate platform thinking (not just UI)
*   Show integration with multiple data sources
*   Implement secure RBR
*   Provide a working patient-doctor workflow
*   Showcase AI capability

### Success Criteria
*   Patient and doctor see different views (RBAC working)
*   Data is fetched via API (not static/mock in UI)
*   System is structured to integrate with:
    *   EMR
    *   Lab systems
    *   Device data
*   AI feature produces meaningful output
*   Architecture is clearly explainable

## 3. 👥 User Roles
### 👤 Patient
*   View own medical records
*   View appointments
*   View AI-generated summaries

### 🩺 Doctor
*   View assigned patients
*   View/edit medical records
*   Approve/update appointments

### 🧑‍💼 Admin
*   View all users
*   Access all records
*   Manage roles

## 4. 🔐 RBAC Model
### Roles
*   patient
*   doctor
*   admin

### Enforcement
#### Backend (Primary)
*   Policy-based authorization
*   Example:
    *   Patient → only own data
    *   Doctor → assigned patients
    *   Admin → full access

#### Frontend (Secondary)
*   Role-based UI rendering

## 5. ⚙️ Core Features (POC Scope)
### 5.1 Dashboard (MANDATORY)
**Purpose:** Demonstrate unified data aggregation
**Features:**
*   Upcoming appointment
*   Recent lab result
*   Notification summary

**Requirement:** Each item must indicate a data source (e.g., EMR, Lab System)

### 5.2 Medical Records (CORE FEATURE)
**Features:**
*   Lab results
*   Doctor notes

**Requirements:**
*   Records must include:
    *   source (EMR / Lab API)
    *   structured data
*   Doctor can add/update notes

### 5.3 Appointments (SIMPLIFIED)
**Features:**
*   View appointments
*   Status tracking: `pending`, `approved`, `completed`

**Role Behavior:**
*   Patient → view own appointments
*   *Doctor* → manage assigned appointments

### 5.4 AI Feature (ONE FEATURE ONLY)
**Feature:** Medical Summary
**Flow:**
1.  Doctor writes notes
2.  Backend sends to AI
3.  AI generates simplified summary
4.  Patient views summary

## 6. 🔌 Integration Layer (POC Simulation)
**Objective:** Demonstrate system readiness for real integrations
**Mock Services:** EMR Service, Lab Service, Appointment Service
**Example APIs:**
*   `GET /api/emr/patient/:id`
*   `GET /api/labs/:id`
*   `GET /api/appointments/:id`

**Requirement:** UI must not directly use mock data. All data must go through API layer.

## 7. 🧱 System Architecture
```text
Frontend (React Portal)
   ↓
Backend API (Node.js / NestJS)
   ↓
Integration Layer (Mock Services)
   ↓
Database (PostregSQL / Supabase)
```

## 8. 🗂️ Data Model (Simplified)
*   **users:** `id`, `name`, `role`
*   **appointments:** `id`, `patient_id`, `doctor_id`, `status`, `scheduled_at`
*   **medical_records:** `id`, `patient_id`, `doctor_id`, `content`, `source`, `ai_summary`

## 9. 🔄 Key User Flows
### Flow 1: Patient Journey
Patient logs in $\rightarrow$ Views dashboard $\rightarrow$ Views records $\rightarrow$ Reads AI summary

### Flow 2: Doctor Workflow
Doctor logs in $\rightarrow$ Views assigned patients $\rightarrow$ Adds/updates record $\rightarrow$ Triggers AI summary

### Flow 3: RBAC Enforcement
*   Patient cannot access others’ data
*   Doctor cannot access unassigned patients
*   Admin can access everything

## 10. 🔒 Security Requirements
### Must Have
*   JWT authentication
*   Backend RBAC enforcement
*   Input validation

### Design Intent (POC-level)
*   Secure API design
*   Role-based data access
*   Extensible to zero-trust model

## 11. 🚫 Out of Scope
*   Full EMR system
*   Billing system
*   Messaging system
*   Real device integrations
*   Full analytics platform
*   Multi-tenant production system

## 12. 🧠 AI Integration
*   **Provider:** OpenAI
*   **Use Case:** Simplify clinical notes for patient readability

## 13. 📊 Evaluation Metrics
*   RBAC correctness (data isolation)
*   API-driven architecture working
*   Integration abstraction demonstrated
*   AI summary quality
*   Demo clarity

## 14. 🚀 Future Scope
*   Real EMR integration
*   Device data ingestion
*   Advanced analytics (Power BI)
*   Multi-clinic support
*   Audit logs
*   Compliance (HIPAA/GDPR)

## 15. 🧭 Build Plan (POC)
### Phase 1
*   Backend setup
*   Auth + RBAC

### Phase 2
*   Records + appointments APIs
*   Integration layer

### Phase 3
*   Frontend integration

### Phase 4
*   AI feature
