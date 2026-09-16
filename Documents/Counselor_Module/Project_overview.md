# BHG Connected Care Portal — Clinician Portal Project Overview

**Document status:** Draft for product, clinical, operations, compliance, and engineering review  
**Prepared:** September 16, 2026  
**Project type:** Extension of the existing BHG Patient Portal proof of concept

**Companion flow:** `Documents/Counselor_Module/interaction_flow.md`

## 1. Purpose

This document defines the evolution of the existing **Clinic Operations** area into the **Clinician Portal** within the BHG Connected Care Portal. It is an in-place change to the current runnable staff experience, not a third portal or a separate Counselor role. The files in the `Documents` folder are domain references only. They describe BHG terminology, workflows, data, and neighboring products, but their application features are not automatically part of this portal.

The Clinician Portal must complement—not reproduce—the applications BHG already uses:

- **BHG AI Notetaker** conducts counseling sessions and owns recording, transcription, live AI assistance, clinical-note creation, counselor review, and note synchronization.
- **Nexavoice** supports BHG Operations users with treatment-center information, staff/insurance/cost reference data, intake guidance, templates, reports, holidays, knowledge articles, FAQs, and administrative tools.
- **SAMMS** remains the clinical system of record for appointments, patient data, enrollment, final clinical documentation, and related clinical transactions.
- **This Clinician Portal** provides an authorized, consolidated view of a clinician's assigned patients, appointments, finalized session outcomes, follow-up needs, and patient communication. The POC reuses the existing staff login, routes, components, and shared demo-state foundation.

The module may connect to AI Notetaker, Nexavoice, and SAMMS through approved APIs, events, or deep links. It must not copy their full workflows into this application.

## 2. Source basis and exclusions

The current repository and the following files were reviewed as reference material:

- `Documents/BHG_Business_Domain_End_To_End.md`
- `Documents/BHG_A_Notetaker_Counselor_Guide.txt`
- `Documents/BHG_nexavoice_brd.txt`
- `Documents/Tables_With_Columns.md`
- `Documents/flow.txt`
- `Documents/cursor_code_base_and_project_overview.md`

These documents provide domain knowledge and integration context. They do not define the scope of the Clinician Portal by themselves, and their content is not copied into the application.

The following files were not used as inputs:

- `docs/PATIENT_PORTAL_DEMO_SCRIPT.md` / `Patient_Portal_Demo_Script.md`
- Existing root `PROJECT_OVERVIEW.md` / `project_Overview.md`
- Existing root `REQUIREMENTS.md` / `Requirements.md`

## 3. Executive summary

Behavioral Health Group provides outpatient substance-use-disorder treatment that combines medications for opioid use disorder, counseling, monitoring, case management, and recovery support. Counselors need timely visibility into their assigned patients and their participation in care, but BHG already has specialized applications for conducting sessions, producing notes, and supporting Operations.

The Clinician Portal should therefore act as a **connected clinical coordination workspace**. It should answer:

1. Which patients are assigned to me and at which treatment centers?
2. What appointments are scheduled, completed, cancelled, or not held?
3. For completed counseling appointments, is a finalized note available and what approved information may I view?
4. For sessions not held, was the reason a patient no-show, cancellation, reschedule, counselor issue, or another approved reason?
5. Which patients require follow-up because of missed appointments, overdue counseling, unread messages, unresolved requests, or another approved care-continuity signal?
6. Where should I go when work must be completed in AI Notetaker, Nexavoice, or SAMMS?

The module is not intended to start or run a session, record audio, transcribe conversation, generate or edit clinical notes, perform AI analysis, or replace Operations tools.

## 4. Product boundaries

### 4.1 This Clinician Portal owns

- Counselor dashboard and attention queue.
- Authorized caseload view across assigned treatment centers.
- Patient summary using approved data from systems of record.
- Appointment timeline and calendar/list views.
- Appointment status and attendance outcome display.
- Read-only display of approved finalized note content or note summary for completed appointments.
- Clear identification of sessions that were not held and the approved reason.
- Follow-up task visibility and care-continuity indicators.
- Secure, non-urgent messages with patients when messaging is part of the connected portal.
- Shared counseling-appointment proposals and patient accept/request-change responses.
- Patient-facing recovery goals, agreed action items, appointment preparation, and resource/referral offers.
- Medication concern and dose-review requests routed to an authorized medical provider without counselor prescribing.
- Care-team handoffs whose status can be seen by both counselor and patient.
- Navigation/deep links to the correct external application for work that belongs there.
- Source-system, freshness, and synchronization-status indicators.

### 4.2 AI Notetaker owns

- Starting, pausing, conducting, and ending counseling sessions.
- In-person or telehealth recording.
- Zoom bot behavior.
- Live transcription and speaker identification.
- Live AI clinical prompts or safety reminders.
- Transcript correction.
- DAP/PIE note generation, editing, regeneration, approval, and synchronization.
- Audio/transcript playback and retention.
- AI Notetaker administration and performance analytics.

The Clinician Portal may display a session's resulting status and an approved patient-facing summary after processing, and may provide an **Open in AI Notetaker** link when the user has access. It shall not reproduce the above workflows.

### 4.3 Nexavoice owns

- Treatment-center master/reference management.
- Staff directories and center operating information.
- Insurance, cost, program, and schedule reference management for Operations.
- Intake, grant, lead, and pre-admission templates.
- Drug repository administration.
- Operations master reports and exports.
- Corporate/center holiday administration.
- Operations knowledge base, FAQs, user guides, org chart, users, and roles.

The Clinician Portal may display a small amount of approved center reference information or provide an **Open in Nexavoice** link. It shall not duplicate Nexavoice editing, reporting, template, or administrative workflows.

### 4.4 SAMMS owns

- Patient and enrollment master records.
- Counselor and treatment-center assignments.
- Appointment/schedule records where SAMMS is the scheduling authority.
- Final clinical documentation and signatures.
- Clinical transactions including approved discharge/transfer records.

The Clinician Portal consumes purpose-built APIs rather than accessing raw SAMMS tables from the browser.

## 5. Target counselor experience

### 5.1 Dashboard

The dashboard gives the signed-in counselor an immediate view of:

- Today's and upcoming appointments.
- Recently completed appointments.
- Completed appointments whose final note is available.
- Completed appointments whose note is still processing or unavailable.
- Sessions not held, grouped by patient no-show, patient cancellation, counselor cancellation, rescheduled, or other approved reason.
- Follow-up-needed patients, such as repeat no-shows or overdue required counseling.
- Unread patient messages and unresolved patient requests.
- Data synchronization warnings that affect reliability.

Every metric should link to the filtered records behind it.

The portal header includes a treatment-center selector because a counselor may work across multiple assigned centers. `All treatment centers` is the default combined view; selecting an individual center filters dashboard metrics and all patient-related tables consistently. Production options must be supplied by server-enforced counselor-to-center assignments rather than trusted browser values.

### 5.2 Caseload

The Caseload page shows only patients currently or historically authorized for the counselor. It may include:

- Patient name and approved identifier.
- Assigned center and program.
- Enrollment status and treatment phase/level.
- Last completed counseling appointment.
- Next scheduled counseling appointment.
- Recent attendance pattern.
- Approved UDS/lab review indicators.
- Approved treatment-plan or recovery-goal summary.
- Patient communication and follow-up status.

Detailed source-system editing remains in SAMMS or the owning application.

### 5.3 Appointments and session outcomes

The primary Counselor workflow is an appointment and outcome view, not a live-session view.

Recommended status model:

```text
UPCOMING
SCHEDULED
IN PROGRESS IN AI NOTETAKER
COMPLETED — NOTE PROCESSING
COMPLETED — NOTE AVAILABLE
COMPLETED — NOTE UNAVAILABLE/ERROR
NOT HELD — PATIENT NO-SHOW
NOT HELD — PATIENT CANCELLED
NOT HELD — COUNSELOR CANCELLED
NOT HELD — RESCHEDULED
CANCELLED — OTHER
```

For each appointment, the module should show:

- Patient, counselor, center, date/time, type, modality, and service.
- Source system and last synchronized time.
- Attendance/outcome and recorded reason.
- Final note availability.
- Appropriate next action, such as view finalized note, message patient, view patient, open AI Notetaker, open SAMMS, or view center information in Nexavoice.

### 5.4 Completed appointment and note view

When an appointment is complete and approved information exists, the Clinician Portal may display:

- Session metadata.
- Final DAP/PIE sections or an approved summary.
- Author, finalized/synced timestamp, source system, and record status.
- Read-only indication that corrections must occur in the owning clinical system.
- Link to the authoritative record in AI Notetaker or SAMMS, subject to access.

It must not display an editable note form, regenerate a note, change transcript content, or sync the note.

### 5.5 Not-held session follow-up

When a session does not occur, the module should make the reason and follow-up state visible. A counselor may, subject to policy:

- View the recorded no-show/cancellation reason.
- See whether the appointment was rescheduled.
- Send a non-urgent secure message to the patient.
- View the patient's future appointments and recent attendance history.
- See an Operations handoff or open the appropriate external application.

The portal should not let users falsify attendance or overwrite an outcome owned by AI Notetaker or SAMMS.

### 5.6 Messages and care coordination

Counselors may use the existing portal's secure messaging capability for non-urgent communication with assigned patients. Messages should support appointment reminders, follow-up after a missed session, and general care coordination. Crisis guidance must remain visible, and messages must not be represented as continuously monitored.

### 5.7 Shared appointment coordination

The POC should demonstrate an interaction that is more useful than a free-text message:

1. The counselor proposes a counseling appointment using available fictional slots.
2. The patient sees the proposal in the Patient Portal and can accept it or request another time.
3. The counselor sees the response and confirms a replacement when needed.
4. Both views show the same status: `PROPOSED`, `PATIENT ACCEPTED`, `CHANGE REQUESTED`, `CONFIRMED`, `CANCELLED`, or `COMPLETED`.
5. Once completed in the external session application, the Counselor view shows the outcome and final-note availability.

For the POC, this is a browser-persisted simulation across the Patient and existing staff roles. It must be labeled as simulated scheduling until a real scheduling API and source-of-truth rule are approved.

### 5.8 Recovery goals and shared action plan

BHG describes counseling as a personalized, goal-oriented partnership, and SAMHSA guidance supports shared decision-making between the patient and clinical team. The portal can make that partnership visible without replacing the formal SAMMS treatment plan.

The POC should support a lightweight **Shared Recovery Plan**:

- Counselor proposes a patient-friendly recovery goal or next step.
- Patient accepts it, requests a change, or records a progress update.
- Counselor reviews the patient's update and can acknowledge or revise the proposed next step.
- Both parties see due date, owner, current status, and activity history.
- Items may include attending the next counseling visit, completing an appointment-preparation item, contacting a referral resource, or practicing an agreed coping strategy.

This plan is a portal engagement aid, not the legal clinical treatment plan. It must not contain medication orders, diagnoses, or hidden clinician-only content.

### 5.9 Appointment preparation and after-visit follow-up

Before an appointment, a counselor may send a short preparation request, such as:

- Confirm attendance or request a different time.
- Select topics the patient wants to discuss.
- Complete a non-diagnostic check-in approved by BHG.
- Review a resource or bring an approved document.

After a completed appointment, the Patient Portal may show a patient-friendly follow-up card containing only information deliberately shared with the patient:

- Next appointment.
- Agreed recovery goal or action items.
- Referral/resource information.
- Care-team follow-up status.

The patient-facing card is not the clinical DAP/PIE note and must not expose the counselor's protected working or clinical documentation.

### 5.10 Medication and dosing care coordination

Medication is part of BHG's integrated care, but ordering medication, changing dose, approving take-homes, and dispensing belong to qualified medical/OTP practitioners. The Clinician Portal must not allow counselor prescribing.

The POC should instead support a closed-loop coordination flow:

1. Patient selects **Request medication review** or reports an approved concern category such as side effects, cravings/withdrawal concerns, missed dose, or question about the current schedule.
2. Counselor sees the request and routes it to a fictional authorized medical-provider queue.
3. Counselor may propose a **Medication Review Appointment** from provider-owned fictional slots, but cannot enter a medication or dose order.
4. Patient accepts or requests another time.
5. The medical-provider outcome is simulated as `REVIEW SCHEDULED`, `PROVIDER REVIEWED`, or `FOLLOW-UP REQUIRED`.
6. Any medication name, prescribed dose, schedule, or take-home status remains read-only and is presented as sourced from the medical system.

Urgent symptoms must direct the patient to BHG's approved urgent/emergency path rather than wait for a portal response.

### 5.11 Resources, referrals, and warm handoffs

Counselors help patients address barriers involving transportation, housing, employment, coverage, peer support, and other recovery needs. The POC should let a counselor offer an approved fictional resource or referral. The patient can accept, decline, or ask for help. Both views then show a simple handoff status such as `OFFERED`, `ACCEPTED`, `REFERRED`, `CONTACTED`, or `CLOSED`.

When the next action belongs to Operations, the Clinician Portal may create a simulated Operations handoff and link to Nexavoice. It must not reproduce the Nexavoice work queue or administrative workflow.

### 5.12 Documents and acknowledgements

The counselor may request that a patient review an approved educational item, form, or consent already supported by the Patient Portal. The patient can acknowledge, complete, or decline as policy permits. The Counselor view displays completion status but does not become the master consent/document-management system.

## 6. Connected application model

```text
                         ┌──────────────────────────┐
                         │ BHG AI Notetaker         │
                         │ Conduct session          │
                         │ Produce/finalize note    │
                         └────────────┬─────────────┘
                                      │ approved status/note outcome
                                      ▼
┌──────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────┐
│ Nexavoice            │◄──►│ Clinician Portal         │◄──►│ SAMMS                │
│ Operations reference │    │ Clinical coordination    │    │ System of record     │
│ and knowledge        │    │ and read-only visibility │    │                      │
└──────────────────────┘    └────────────┬─────────────┘    └──────────────────────┘
                                         │
                                         ▼
                              Existing Patient Portal
                              Messages and requests
```

Preferred integration patterns:

- Purpose-built APIs for current status and approved read-only detail.
- Events/webhooks for appointment and note-status changes where supported.
- Scheduled synchronization when real-time integration is unavailable.
- SSO-aware deep links for actions that must be completed in another application.
- Source/freshness indicators and safe fallback when a dependency is unavailable.

Data should not be copied simply to recreate another product. Cache only the minimum fields required for portal performance, continuity, and audit.

## 7. Current repository understanding

### Runnable application

- `packages/frontEnd`: React 18, Vite 5, React Router 6, Lucide icons, Patient Portal and the existing staff experience now labeled Clinician Portal.
- `packages/backend`: Express 4 and PostgreSQL access for existing portal/demo APIs.
- Deployment base path: `/bhg-patientportal/`.

These frameworks and configurations must remain unchanged.

### Existing root Counselor prototype (reference only)

The untracked root `src/` contains useful Counselor UI concepts, including a dashboard, caseload, session list, patient profile, messages, and center scoping. It also contains functions that now fall outside the intended module boundary:

- Manual DAP note drafting and finalization.
- ASAM and treatment-plan editing.
- Group-session attendance entry.
- Discharge/transfer mutation.

These functions should not be moved into the runnable app merely because they exist. Each must be evaluated against the ownership boundaries above. The recommended reuse is:

| Prototype capability | Direction |
|---|---|
| Counselor dashboard | Reuse concept; change metrics to appointments, outcomes, notes available, and follow-up |
| Caseload list/profile | Reuse concept; enforce approved read-only fields and source ownership |
| Session list | Rework as Appointments & Outcomes |
| Manual note form | Exclude; replace with read-only finalized note view |
| Group attendance entry | Exclude; display outcome from owning system |
| ASAM/treatment-plan editing | Exclude unless SAMMS explicitly delegates a supported operation |
| Secure messages | Retain as connected portal capability with server persistence |
| Discharge/transfer editing | Exclude by default; display status or deep-link to owner |
| Multi-center filter | Retain with server-enforced authorization |

## 8. Data mapping direction

Candidate domain mappings must be validated by the SAMMS/Informatics and AI Notetaker teams:

| Portal concept | Likely source |
|---|---|
| Counselor identity and center access | Identity provider plus approved staff/center assignment API |
| Assigned caseload | SAMMS enrollment and counselor assignment |
| Appointments | SAMMS appointment service and/or AI Notetaker schedule integration |
| Attendance and not-held outcome | AI Notetaker/SAMMS authoritative outcome |
| Final note availability | AI Notetaker/SAMMS note status |
| Final DAP/PIE note | SAMMS or approved AI Notetaker read API |
| Center details | Nexavoice read API or approved center master service |
| Patient messages | Connected portal messaging service |

Documented SAMMS tables such as `tbl_Appointments`, `Tbl_AppointmentAttend`, `tbl_DartsSrv*`, `tbl_ENROLLMENT`, and `ctrl.tbl_USERSITES` establish domain relationships only. They are not permission to expose raw tables or fields.

## 9. Privacy, compliance, and safety

The module displays sensitive substance-use-disorder information and must support HIPAA and 42 CFR Part 2 requirements, subject to BHG Compliance and legal validation.

Key controls:

- Server-side counselor, center, patient, and record authorization.
- Minimum-necessary note and patient fields.
- Read-only final-note presentation with source and status.
- No audio, transcript, AI prompt, or draft-note storage in this portal.
- No PHI in URLs, logs, analytics, browser notifications, or error details.
- Complete audit of record access, note viewing, messaging, link-outs, and exports.
- Approved retention and caching rules.
- Secure, short-lived deep links or standard SSO navigation to external systems.
- Clear separation between a portal copy/cache and the authoritative record.

## 10. Delivery approach

### Phase 1 — Connected Clinician Portal POC

- Integrate the useful Counselor shell into `packages/frontEnd` without framework/configuration changes.
- Add role-specific routing and center scoping using fictional data.
- Deliver Dashboard, Caseload, Appointments & Outcomes, read-only Completed Note view, and Messages.
- Add shared appointment proposals with Patient accept/request-change responses.
- Add Shared Recovery Plan goals/action items and patient progress updates.
- Add appointment-preparation requests and patient-visible after-visit follow-up cards.
- Add medication-review requests and medical-provider appointment handoffs without prescribing.
- Add resource/referral offers, warm-handoff status, and document acknowledgements.
- Demonstrate completed, note-processing, note-available, patient-no-show, cancelled, and rescheduled cases.
- Provide clearly simulated deep links/integration badges.

### Phase 2 — Secured data integration

- Add Entra ID/Azure AD and server-enforced authorization.
- Integrate appointment, attendance/outcome, and final-note status/read APIs.
- Add source/freshness, reconciliation, retry, and audit behavior.
- Move cross-role messaging to durable server persistence.

### Phase 3 — Cross-application navigation and workflow events

- Add approved SSO/deep links to AI Notetaker, SAMMS, and Nexavoice.
- Add events or scheduled synchronization for status changes.
- Add follow-up rules for repeated no-shows and other approved care-continuity signals.

## 11. Success measures

- Counselors can find today's appointments and their outcomes from one screen.
- Completed appointments show accurate final-note availability and approved read-only content.
- Not-held sessions clearly show no-show/cancellation/reschedule reasons and follow-up state.
- Status and note data reconcile to the authoritative source within the agreed service-level objective.
- No session-conducting, recording, transcription, AI drafting, note editing, or Operations administration is duplicated.
- Every external action routes the counselor to the correct owning application.
- Patient and counselor can complete at least one meaningful bidirectional workflow beyond messaging: appointment coordination, shared action-plan progress, medication-review routing, or referral acceptance.
- The POC demonstrates medication collaboration without giving counselors prescriber or dosing authority.
- No counselor can access another counselor's patients or notes outside approved coverage/supervision rules.
- Existing Patient Portal workflows and internal staff route architecture remain intact while Clinic Operations navigation is renamed and refocused as Clinician Portal.

## 12. POC product decisions

The POC will proceed with the following assumptions so that stakeholder feedback can be gathered from working software:

1. All patients, appointments, notes, medications, slots, resources, and integrations are fictional.
2. Browser-persisted demo state connects the Patient and Counselor views; no external system is called.
3. The Clinician Portal shows only approved read-only clinical outcomes; the Patient Portal receives deliberately shared patient-friendly summaries and follow-up cards, not raw notes or transcripts.
4. Appointment proposals are collaborative requests, not authoritative scheduling. The UI labels them simulated until an approved scheduler is connected.
5. A patient no-show creates a Counselor follow-up item. The counselor can send a secure message and propose a replacement counseling appointment.
6. Counselors cannot prescribe medication, change a dose, approve take-homes, or modify a dosing schedule. They can route a medication-review request and propose a medical-provider appointment.
7. Medication and dosing data is read-only and clearly attributed to a medical source.
8. The Shared Recovery Plan is a patient-engagement feature, not the SAMMS treatment plan.
9. AI Notetaker, Nexavoice, and SAMMS remain separate. The POC uses labeled integration cards and simulated deep links only.
10. ASAM, UDS/lab, treatment-plan, discharge/transfer, and enrollment information is read-only in the initial POC.
11. Center information is minimal and read-only; Nexavoice remains the Operations owner.
12. Counselor access is limited to an assigned fictional caseload and assigned fictional centers.

## 13. Public references

- [BHG patient services and care model](https://www.bhgrecovery.com/patients/)
- [BHG counseling services](https://www.bhgrecovery.com/treatment/counseling/)
- [BHG support services](https://www.bhgrecovery.com/treatment/support-services/)
- [SAMHSA — 42 CFR Part 8](https://www.samhsa.gov/substance-use/treatment/opioid-treatment-program/42-cfr-part-8)
- [SAMHSA — Part 8 counseling and medication FAQ](https://www.samhsa.gov/substance-use/treatment/opioid-treatment-program/42-cfr-part-8/faqs)
- [SAMHSA — Federal Guidelines for Opioid Treatment Programs](https://library.samhsa.gov/sites/default/files/federal-guidelines-opioid-treatment-pep24-02-011.pdf)
- [AHRQ Integration Academy — optimize patient portals](https://integrationacademy.ahrq.gov/products/playbooks/behavioral-health-and-primary-care/implementing-plan/leverage-technology-for-ibh)
- [AHRQ Integration Academy — shared care plans](https://integrationacademy.ahrq.gov/products/playbooks/behavioral-health-and-primary-care/implementing-plan/develop-shared-care-plan)
- [HHS — confidentiality of SUD patient records](https://www.hhs.gov/hipaa/part-2/index.html)
