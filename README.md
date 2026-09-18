# BHG Connected Care Portal

An interactive, browser-persistent proof of concept for Behavioral Health Group’s outpatient addiction-treatment domain. It includes connected Patient Portal and Clinician Portal experiences.

> 📖 **Comprehensive Walkthrough & Module Guide**: For a detailed architectural breakdown and module-by-module explanation of both portals, see [APPLICATION_GUIDE.md](APPLICATION_GUIDE.md).

## Patient Experience

- Treatment and enrollment summary
- Medication visit hours and take-home bottle schedule
- Counseling and medical provider appointments (in-person & Zoom)
- Between-session CBT practice & coping exercises with counselor feedback
- Private Lab & UDS follow-up in destigmatized language
- Assigned care team with working message threads and compose flow
- Staff-managed appointment change requests and interactive proposal acceptance
- “Need help today?” treatment-support and crisis triage routing
- Coverage, payment statements, and financial-help requests
- Forms and consent summaries with 42 CFR Part 2 digital acknowledgment
- Recovery goals and milestones
- Treatment-center hours, directions (Google Maps), and crisis contacts
- BHG Support Assistant chatbot for 24/7 navigation and guidance

## Clinician Experience

- Multi-treatment center selector (Knoxville Bernard, Knoxville Citico, Jackson TN, All Centers)
- Clinician Dashboard with key caseload metrics, daily schedule, and urgent alerts
- Patient request triage queue (appointment changes, medication reviews, financial help)
- Sessions agenda with status filters (Confirmed, Pending, Checked In), date ranges, pagination, previous visit notes, and visit outcome recording
- My Caseload roster with program tiers, treatment phases, and patient profile drill-downs
- Comprehensive Patient Profile chart with CBT Practice review & counselor feedback block
- Group Sessions management (Scheduled, Completed, Not Held) with group documentation and per-patient attendance & individual clinical notes
- CBT Tool Library with direct interactive workflow to assign exercises into patient caseloads
- Care Coordination tracking for external provider referrals and medical releases
- Medication Visit Status tracking dispensing window queues and clinical review holds
- UDS & Lab monitoring across all patients with presumptive and confirmatory result tracking
- Secure clinician-to-patient messaging with real-time sync back to patient inbox
- One-click demo data reset to restore baseline demonstration scenarios

## Connected Bi-Directional Workflows

Patient requests appear in the Clinician Portal queue. Clinician responses return to patient messages, notifications, and request status. Clinicians can offer appointments, record visit outcomes, and create missed-visit follow-up; patients can accept an offered time or request another one. CBT assignments made in the clinician tool library immediately reflect in patient coping exercises and chart reviews. Medication-review requests are routed for clinical review without allowing counselor prescribing or dose changes. Demo state persists across refreshes and can be reset from the Clinician Dashboard.

The experience uses supportive, patient-facing language and fictional demonstration data. It does not provide medical advice.

## Stack

- React 18
- Vite 5
- React Router 6
- Lucide icons
- Seed data in `packages/frontEnd/src/data/bhgPatientData.js`
- Persistent connected demo state in `packages/frontEnd/src/data/bhgDemoState.js`

The existing Express package remains in the repository for future API integration, but the current portal does not call it.

## Run locally

```bash
cd packages/frontEnd
npm install
npm run dev
```

Open:

`http://localhost:5174/bhg-patientportal/`

## Demo sign-in

- Patient: `patient@demo.com`
- Clinician Portal: `admin@demo.com`
- Password: `Password123`

## Production integration direction

The frontend should eventually call a patient-safe API translation layer. Raw SAMMS tables should not be exposed directly to the browser.

```text
BHG Patient Portal
        ↓
Patient-safe API and authorization layer
        ↓
SAMMS and approved BHG services
```

Before production use, BHG stakeholders must validate medication visibility, take-home language, UDS presentation, hold communication, consent, 42 CFR Part 2, and SAMMS field mappings.
