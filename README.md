# BHG Connected Care Portal

An interactive, browser-persistent proof of concept for Behavioral Health Group’s outpatient addiction-treatment domain. It includes connected patient and clinic-operations experiences.

## Patient experience

- Treatment and enrollment summary
- Medication visit and take-home schedule
- Counseling and provider appointments
- Private Lab & UDS follow-up
- Assigned care team with working message threads and compose flow
- Staff-managed appointment change requests
- “Need help today?” treatment-support routing
- Coverage, payment, forms, and consent summaries
- Financial-help requests, consent acknowledgment, and profile preferences
- Recovery goals and milestones
- Treatment-center hours, directions, and crisis contacts
- BHG Support Assistant for portal guidance, schedules, coverage, and care-team navigation

Patient requests appear in the clinic-operations queue. Clinic responses return to patient messages, notifications, and request status. Demo state persists across refreshes and can be reset from the operations dashboard.

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
- Clinic operations: `admin@demo.com`
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
