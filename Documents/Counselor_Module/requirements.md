# BHG Connected Care Portal — Clinician Portal Requirements

**Document status:** Draft for validation  
**Prepared:** September 16, 2026  
**Related overview:** `Documents/Counselor_Module/Project_overview.md`  
**Interaction flow:** `Documents/Counselor_Module/interaction_flow.md`

## 1. Requirement conventions

- **Shall** means mandatory.
- **Should** means recommended.
- **May** means optional.
- **P0** is release-blocking for safety, privacy, authorization, record integrity, or system boundaries.
- **P1** is required for a usable Clinician Portal.
- **P2** is a valuable follow-up capability.

## 2. Product definition

The Clinician Portal is an in-place refocus and rename of the existing **Clinic Operations** staff area. It is a **clinical coordination and visibility workspace** inside the existing BHG Connected Care Portal, not a separate Counselor module or third role. It consolidates approved clinician-facing information from BHG systems without taking ownership of session conduct, clinical note creation, prescribing, or Operations administration.

### 2.1 In scope

- Authorized counselor caseload.
- Dashboard and follow-up queue.
- Upcoming and historical appointment details.
- Appointment attendance/outcome status.
- Completed, cancelled, rescheduled, and not-held sessions.
- Patient no-show visibility and approved follow-up actions.
- Read-only finalized note or approved note summary for completed appointments.
- Source-system and synchronization status.
- Secure, non-urgent patient messaging.
- Shared counseling-appointment proposals and patient accept/request-change responses.
- Patient-facing recovery goals, action items, progress updates, and after-visit follow-up cards.
- Appointment-preparation requests and acknowledgements.
- Medication/dose concern routing and medical-provider appointment coordination without counselor prescribing.
- Resource/referral offers and visible warm-handoff status.
- SSO-aware links to AI Notetaker, SAMMS, and Nexavoice.
- Approved read-only patient, treatment, assessment, lab/UDS, or center context.

### 2.2 Explicitly out of scope

The Clinician Portal shall not:

- Start, pause, conduct, or end counseling sessions.
- Capture microphone/audio/video or join telehealth calls.
- Transcribe sessions or show live transcripts.
- Generate, regenerate, edit, approve, sign, or sync DAP/PIE notes.
- Display AI clinical prompts or perform AI analysis.
- Manage AI Notetaker configuration, audio, transcripts, or analytics.
- Manage Nexavoice treatment-center data, staff directories, insurance/cost data, templates, drug repositories, reports, holidays, knowledge articles, FAQs, users, or roles.
- Replace SAMMS as the system of record.
- Prescribe, dispense, or change medications or dosing decisions.
- Override holds, take-home decisions, appointment outcomes, or attendance.
- Perform billing, eligibility adjudication, claims, or payment administration.
- Directly edit ASAM assessments, treatment plans, discharge/transfer, or enrollment unless BHG later delegates a specific supported operation.

## 3. System ownership and integration boundaries

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| BND-001 | P0 | AI Notetaker shall remain the owner of live sessions, recording, transcription, AI assistance, note authoring/review, and note synchronization. | No equivalent workflow or control exists in the Counselor portal. |
| BND-002 | P0 | Nexavoice shall remain the owner of Operations reference, knowledge, template, reporting, holiday, and administrative workflows. | Portal contains no Nexavoice management form or duplicated report builder. |
| BND-003 | P0 | SAMMS shall remain the authoritative clinical record unless an approved source contract identifies another authority for a specific field. | Every integrated field has a documented authoritative source and conflict rule. |
| BND-004 | P0 | The Clinician Portal shall consume only purpose-built APIs, events, or approved deep links. | Browser traffic contains no raw database connection, SQL, or direct SAMMS table endpoint. |
| BND-005 | P1 | Every externally sourced record shall identify its source and last synchronized/updated time where freshness affects use. | Appointment, outcome, and note views show source/freshness or a documented equivalent. |
| BND-006 | P0 | A failed or delayed integration shall not be presented as current or successful. | UI displays delayed/unavailable status and safe next steps without inventing data. |
| BND-007 | P1 | The portal should link to the owning application when a user needs to perform an out-of-scope action. | Link label names the destination and opens only after authorization/SSO validation. |
| BND-008 | P0 | Data shall not be copied solely to recreate another application's workflow. | Architecture review confirms minimum necessary fields, retention, and cache purpose. |

## 4. Architecture constraints

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| ARC-001 | P0 | The module shall be integrated into the existing `packages/frontEnd` React 18/Vite 5/React Router 6 application. | Counselor routes run from the documented frontend package. |
| ARC-002 | P0 | Existing frontend/backend frameworks, dependency strategy, ports, router/base path, and deployment configuration shall remain unchanged unless separately approved. | Delivery diff contains no unapproved configuration or framework change. |
| ARC-003 | P0 | Production integration shall pass through the existing Express service or an approved backend-for-frontend layer. | All protected requests are authenticated, authorized, validated, and audited server-side. |
| ARC-004 | P0 | Production secrets shall use approved secret management and shall not have source-code fallback credentials. | Secret scanning passes and startup fails safely when required secrets are missing. |
| ARC-005 | P1 | The Patient Portal and Clinician Portal shall share appropriate UI primitives and connected workflow records while maintaining role-isolated routes and permissions. | Regression tests show existing Patient routes and refocused staff routes remain intact. |
| ARC-006 | P0 | Clinic Operations shall be renamed to Clinician Portal in all user-facing navigation, login, headings, and accessibility labels; internal `admin` identifiers may remain during the POC to avoid an unnecessary framework/configuration migration. | No user-facing Clinic Operations label remains in the runnable frontend and authentication behavior is unchanged. |
| ARC-007 | P1 | The module shall preserve `/bhg-patientportal/` deployment behavior. | Direct navigation and refresh work under the configured base path. |
| ARC-008 | P1 | POC mock data shall be clearly isolated from production service paths. | Production mode cannot silently load Counselor clinical data from LocalStorage or seed modules. |

## 5. Identity and authorization

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| IAM-001 | P0 | Production users shall authenticate through BHG-approved Microsoft Entra ID/Azure AD SSO and applicable MFA policies. | Server validates identity and claims; unauthenticated access is rejected. |
| IAM-002 | P0 | Authorization shall be enforced at the API and UI layers. | Direct API calls cannot bypass hidden routes or controls. |
| IAM-003 | P0 | Counselors shall access only assigned patients, authorized historical records, and assigned centers. | Cross-counselor, cross-patient, and cross-center IDOR tests fail. |
| IAM-004 | P0 | Admin/supervisor access to other counselors' records shall require an explicit approved permission and organizational scope. | A center-scoped supervisor cannot read an unauthorized center. |
| IAM-005 | P0 | Client-selected role, counselor ID, patient ID, or center ID shall never grant access. | Manipulating URL, request body, or browser storage does not expand access. |
| IAM-006 | P1 | Counselors assigned to multiple centers shall switch among only those centers or use an authorized combined view. | Center filter values come from server assignments and scope all pages consistently. |
| IAM-007 | P0 | External application links shall not grant access beyond the destination application's own authorization. | Link-out uses approved SSO/deep-link mechanism and destination revalidates access. |

## 6. Navigation and shared shell

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| NAV-001 | P1 | Counselor navigation shall include Dashboard, Caseload, Appointments & Outcomes, Messages, and approved read-only supporting views. | Each page is reachable from the sidebar with keyboard navigation. |
| NAV-002 | P0 | The sidebar shall not contain Start Session, Record, Transcript, Generate Note, Edit Note, Sync Note, or Nexavoice administration actions. | UI inventory confirms prohibited actions are absent. |
| NAV-003 | P1 | The shell shall show active center, counselor identity, role, source-health indicator, and sign-out. | Values are consistent across Counselor pages. |
| NAV-004 | P1 | Unauthorized/unknown routes shall redirect to the correct role home page without rendering protected content. | Automated route tests cover all roles and unauthenticated access. |
| NAV-005 | P2 | External application destinations may appear in a Connected Applications menu. | Each item clearly states its purpose and destination. |
| NAV-006 | P1 | The Clinician Portal header shall provide a treatment-center dropdown containing only centers assigned to the signed-in clinician plus an `All treatment centers` option. | `All treatment centers` is the default and the list is derived from authorized assignments. |
| NAV-007 | P1 | Changing the treatment-center selection shall consistently filter dashboard metrics, caseload, appointments/outcomes, counseling/goals, medication-visit status, UDS/labs, care-coordination requests, and referrals. | Every affected page reflects the selected center and returning to `All treatment centers` restores the authorized combined view. |

## 7. Counselor dashboard

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| DASH-001 | P1 | The dashboard shall show today's upcoming appointments. | Count and list reconcile to the authorized appointment source and active center filter. |
| DASH-002 | P1 | The dashboard shall show recently completed appointments and final-note availability. | Counts distinguish note available, processing, unavailable/error, and not expected where applicable. |
| DASH-003 | P1 | The dashboard shall show not-held sessions with approved reason categories. | Patient no-show, patient cancellation, counselor cancellation, rescheduled, and other are distinguishable. |
| DASH-004 | P1 | The dashboard shall identify follow-up-needed patients according to approved rules. | Each alert includes reason, source, as-of time, and permitted action. |
| DASH-005 | P1 | Dashboard metrics shall link to their filtered record lists. | Selecting a metric opens matching records without losing center/date context. |
| DASH-006 | P1 | The dashboard shall show unread messages and unresolved patient requests when supported by the connected portal. | Counts reconcile with the corresponding inbox/request view. |
| DASH-007 | P0 | The dashboard shall not show AI productivity or counselor-performance metrics copied from AI Notetaker. | No talk-time, transcription, AI prompt, note-generation, or AI sync-rate analytics appear. |
| DASH-008 | P1 | Integration delays shall be visible and shall not silently reduce counts. | Page displays data freshness and partial/unavailable source warnings. |

## 8. Caseload and patient summary

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| CASE-001 | P0 | Caseload results shall contain only patients authorized for the signed-in counselor and selected center scope. | Server-side assignment tests pass for active and historical patients. |
| CASE-002 | P1 | Counselors shall search/filter by approved patient identifier, name, center, program, enrollment status, and follow-up status. | Search does not reveal names or identifiers outside scope. |
| CASE-003 | P1 | Each patient row shall show last completed appointment, next scheduled appointment, and recent attendance outcome. | Values reconcile to the appointment source and use consistent status definitions. |
| CASE-004 | P1 | Patient summary shall show approved read-only enrollment, program, phase/level, care-team, and relevant care-plan information. | Field-level approval and source are documented. |
| CASE-005 | P1 | Patient summary may show approved UDS/lab or assessment indicators needed for coordination. | Minimum-necessary fields are approved; raw details are not displayed by default. |
| CASE-006 | P1 | The patient timeline shall combine appointments, outcomes, finalized-note availability, messages, and approved milestones without changing source records. | Each event identifies source and links to available detail. |
| CASE-007 | P0 | The module shall not provide editable ASAM, treatment-plan, medication, enrollment, or discharge fields by default. | UI and API reject mutations for these domains. |

## 9. Appointments and outcomes

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| APT-001 | P1 | The module shall list authorized appointments with patient, counselor, center, date/time, service/type, modality, source, and status. | Records reconcile with source data for the selected date range. |
| APT-002 | P1 | Users shall filter by center, date, patient, service/type, modality, and outcome. | Combined filters are deterministic and accessible. |
| APT-003 | P1 | The canonical display statuses shall cover upcoming, scheduled, in progress externally, completed/note processing, completed/note available, completed/note error, not held/no-show, cancelled, and rescheduled. | Source statuses map to one documented portal status and retain raw source code server-side for audit. |
| APT-004 | P1 | A completed appointment shall show attendance, actual start/end when approved, duration, and note availability. | Missing values are labeled unavailable rather than inferred. |
| APT-005 | P1 | A not-held appointment shall show the approved reason and whether a replacement appointment exists. | No-show and cancellation reason reconcile to the authoritative source. |
| APT-006 | P0 | Appointment details imported from another system shall be read-only unless a future operation is explicitly delegated. | No edit/attendance override endpoint or control exists. |
| APT-007 | P1 | An appointment may offer permitted actions: view patient, view finalized note, send message, open AI Notetaker, open SAMMS, or view center details. | Only relevant, authorized actions appear for each state. |
| APT-008 | P0 | “Open in AI Notetaker” shall not be represented as conducting the session within this portal. | Destination and ownership are explicit before navigation. |
| APT-009 | P1 | Rescheduled appointments shall link the original and replacement records where the source provides that relationship. | Counselor can distinguish rescheduled from missed without a replacement. |
| APT-010 | P0 | Outcome refresh and event processing shall be idempotent. | Replayed events do not create duplicate appointments or conflicting outcomes. |

## 10. Finalized note view

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| NOTE-001 | P0 | The module shall display only notes that the authoritative source marks finalized/approved and permitted for portal display. | Draft, processing, failed, or unapproved notes cannot be opened as final notes. |
| NOTE-002 | P1 | The note view shall show appointment metadata, note format/type, approved final content or approved summary, author, finalization time, and source. | Display reconciles to the source record/version. |
| NOTE-003 | P0 | Finalized notes shall be read-only. | No edit, regenerate, approve, sign, or sync control/API is present. |
| NOTE-004 | P0 | Corrections and addenda shall be made in the owning application or SAMMS. | Portal gives clear direction/link and refreshes the corrected final version when received. |
| NOTE-005 | P0 | The module shall not store or display audio, transcript, AI prompts, or intermediate note drafts. | Data inventory and network/storage tests confirm absence. |
| NOTE-006 | P1 | If a note is processing, unavailable, restricted, or failed, the UI shall show the correct status and next action. | Status is never replaced by fabricated content or an empty “final” note. |
| NOTE-007 | P0 | Full-note versus summary access shall be controlled by BHG-approved policy and field-level authorization. | Restricted sections/types remain inaccessible even if a user knows the record ID. |
| NOTE-008 | P1 | The view shall expose an approved link to the authoritative record when available. | Destination reauthorizes the user and opens the matching record or a safe landing page. |
| NOTE-009 | P0 | Note access shall be audited. | Audit includes actor, patient/record reference, time, source/version, outcome, and center scope. |
| NOTE-010 | P1 | Amended/corrected note versions shall replace or supersede cached display according to the source contract. | The UI identifies the current version and does not present a superseded version as current. |

## 11. No-show and follow-up workflow

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| FUP-001 | P1 | Patient no-shows shall appear in a counselor follow-up queue. | Queue includes patient, missed appointment, source reason, recent attendance, and permitted actions. |
| FUP-002 | P1 | The system shall distinguish no-show from patient cancellation, counselor cancellation, reschedule, and system/other cancellation. | Category mapping is approved and test cases cover each source status. |
| FUP-003 | P1 | Approved follow-up actions may include secure message, view patient, view future appointments, or link to the owning scheduler. | No action silently changes the source appointment outcome. |
| FUP-004 | P2 | Repeated no-shows may create a care-continuity alert using a BHG-approved rule. | Rule, time window, exclusions, owner, and dismissal/resolution behavior are documented. |
| FUP-005 | P0 | Follow-up alerts shall not state clinical conclusions or recommend medication/dosing action. | Clinical review confirms alert wording is factual and source-based. |
| FUP-006 | P1 | Resolved follow-up state shall be visible without overwriting the original attendance outcome. | Resolution has actor/time/action and is independently audited. |

## 12. Secure messaging

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| MSG-001 | P0 | Counselors shall message only currently authorized patients through durable server-side threads. | Access survives device/browser changes and cross-patient tests fail. |
| MSG-002 | P1 | Messages may support appointment reminders and follow-up after missed sessions. | Templates/content remain non-diagnostic and do not claim continuous monitoring. |
| MSG-003 | P1 | Compose and thread views shall show non-urgent use guidance and 911/988 crisis direction. | Warning is accessible and present at relevant decision points. |
| MSG-004 | P0 | Notifications shall not expose sensitive note, diagnosis, or SUD details outside authenticated views. | Email/push/browser notification content follows minimum-necessary templates. |
| MSG-005 | P1 | Delivery, failure, unread, and awaiting-reply states shall be explicit and retry-safe. | Failed send is not shown as delivered; retry does not duplicate content. |

## 13. Patient Portal collaboration

### 13.1 Shared appointment coordination

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| COL-APT-001 | P1 | A counselor shall propose a counseling appointment to an assigned patient using available POC slots. | Proposal appears in Counselor and Patient views with the same patient, service, center, date/time, and `PROPOSED` status. |
| COL-APT-002 | P1 | The patient shall accept the proposed appointment or request another time. | Response immediately appears in the Counselor view as `PATIENT ACCEPTED` or `CHANGE REQUESTED`. |
| COL-APT-003 | P1 | The counselor shall confirm a replacement slot after a change request. | Both roles show the replacement and link it to the original proposal. |
| COL-APT-004 | P1 | Both roles shall see one controlled status model: `PROPOSED`, `PATIENT ACCEPTED`, `CHANGE REQUESTED`, `CONFIRMED`, `CANCELLED`, or `COMPLETED`. | Status transitions follow a tested state machine and display actor/time history. |
| COL-APT-005 | P0 | POC appointment collaboration shall be labeled simulated and shall not claim to update SAMMS or another scheduler. | All affected views contain a demo/integration label; no external write is attempted. |
| COL-APT-006 | P1 | A no-show follow-up shall allow the counselor to propose a replacement counseling appointment. | Patient receives the proposal without changing the original no-show outcome. |
| COL-APT-007 | P1 | The Patient Portal shall show appointment preparation, location/modality, and approved instructions for confirmed appointments. | Details match the Counselor view and omit clinician-only information. |

### 13.2 Shared recovery plan and action items

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| COL-GOAL-001 | P1 | Counselors shall propose patient-friendly recovery goals or action items to an assigned patient. | Patient sees title, rationale, due date, owner, and proposed status. |
| COL-GOAL-002 | P1 | Patients shall accept, request a change, or post a progress update on a proposed item. | Counselor sees the response and activity history without relying on a free-text message thread. |
| COL-GOAL-003 | P1 | Counselors shall acknowledge progress and may revise a proposed next step. | Every revision retains prior value, actor, timestamp, and patient response. |
| COL-GOAL-004 | P0 | Shared Recovery Plan items shall not be represented as the legal SAMMS treatment plan. | Both roles see a clear portal-engagement label; no SAMMS update is claimed. |
| COL-GOAL-005 | P0 | Goals/action items shall not contain medication orders, dose changes, diagnoses, or hidden clinician-only content. | Input validation, UI guidance, and scenario tests enforce the boundary. |
| COL-GOAL-006 | P1 | Example POC items shall include attending a visit, completing appointment preparation, reviewing an approved resource, contacting a referral, or practicing an agreed coping strategy. | Seed data and demo flow include at least three distinct item types. |

### 13.3 Appointment preparation and after-visit follow-up

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| COL-VIS-001 | P1 | Counselors shall send an approved preparation request for an upcoming appointment. | Patient can confirm attendance, select discussion topics, complete an approved non-diagnostic check-in, or acknowledge instructions. |
| COL-VIS-002 | P0 | Preparation questions shall not diagnose, triage an emergency, or replace a clinical assessment. | Approved question set is fixed/configured and safety language is present. |
| COL-VIS-003 | P1 | After a completed appointment, the counselor may publish a patient-friendly follow-up card. | Card can include next appointment, agreed goals/actions, resources, and care-team follow-up. |
| COL-VIS-004 | P0 | The patient-facing follow-up card shall be separate from the clinical DAP/PIE note. | Patient cannot access clinician-only note content through card identifiers or APIs. |
| COL-VIS-005 | P1 | The patient shall acknowledge the follow-up card and update assigned actions. | Counselor sees acknowledgement/progress and time without altering the final clinical note. |

### 13.4 Medication and dosing care coordination

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| MED-001 | P0 | Counselors shall not prescribe medication, enter/change a dose order, approve take-homes, or authorize dispensing. | No UI/API permits these actions; role-boundary tests pass. |
| MED-002 | P1 | A patient shall request a medication review using approved concern categories. | Categories include medication question, possible side effect, cravings/withdrawal concern, missed dose, and current-schedule question, with urgent-care guidance. |
| MED-003 | P1 | The counselor shall route a medication-review request to a fictional authorized medical-provider queue. | Request shows patient, category, submitted time, urgency guidance, owner, and `ROUTED` status; no prescription is created. |
| MED-004 | P1 | The counselor may propose a Medication Review Appointment from fictional provider-owned slots. | Patient can accept/request change; appointment is labeled medical-provider review, not a counseling or dosing order. |
| MED-005 | P1 | Both roles shall see closed-loop status: `SUBMITTED`, `COUNSELOR REVIEWED`, `ROUTED`, `REVIEW SCHEDULED`, `PROVIDER REVIEWED`, or `FOLLOW-UP REQUIRED`. | State transitions record actor/time and never imply medication was changed. |
| MED-006 | P0 | Medication name, prescribed dose, dosing schedule, and take-home status shall be read-only and attributed to the medical source. | Counselor and Patient views cannot mutate values; stale/unavailable data is labeled. |
| MED-007 | P0 | Possible emergencies shall bypass routine portal workflow and show BHG-approved urgent/emergency instructions. | User is told not to wait for a portal reply; 911/988/center guidance follows approved configuration. |
| MED-008 | P1 | The POC may simulate a provider outcome but shall not simulate a new prescription or dose change as a counselor action. | Demo outcome is limited to reviewed/follow-up states and remains clearly fictional. |

### 13.5 Resources, referrals, and documents

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| REF-001 | P1 | Counselors shall offer approved fictional resources/referrals for transportation, housing, employment, coverage, peer support, community care, or another configured category. | Patient sees source, purpose, contact/action information, and privacy notice where applicable. |
| REF-002 | P1 | Patients shall accept, decline, or request help with a resource/referral. | Counselor sees the response and may mark `REFERRED`, `CONTACTED`, or `CLOSED`. |
| REF-003 | P1 | A warm handoff to Medical or Operations shall show owner and status to the patient when appropriate. | Portal displays a coordination status without exposing internal notes. |
| REF-004 | P0 | An Operations handoff shall not reproduce the Nexavoice work queue. | Portal stores only the minimum handoff reference/status and links to Nexavoice when configured. |
| DOC-001 | P1 | Counselors may request review/acknowledgement of an approved Patient Portal document, educational item, or form. | Patient can acknowledge/complete/decline as policy allows; Counselor sees status. |
| DOC-002 | P0 | The portal shall not claim to be the master consent or document-management system. | Authoritative source and simulated POC status are clearly labeled. |

## 14. Nexavoice connection

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| NEX-001 | P1 | The portal may display approved read-only center contact, hours, closure, program, or routing information sourced from Nexavoice or an approved master service. | Display shows source/freshness and contains only counselor-relevant fields. |
| NEX-002 | P0 | The portal shall not edit Nexavoice-owned treatment-center, insurance, cost, staff, template, drug, report, holiday, knowledge, FAQ, user, or role data. | No write API/control exists for those domains. |
| NEX-003 | P1 | Users may open Nexavoice for Operations-owned detail or action when authorized. | Link names the destination and Nexavoice independently authorizes access. |
| NEX-004 | P0 | Nexavoice data shall not be copied into portal mock data and represented as live. | POC labels simulated values; production values come from an approved source. |

## 15. Privacy, compliance, and audit

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| CMP-001 | P0 | Production design shall receive BHG HIPAA and 42 CFR Part 2 review before PHI use. | Approval and data-flow inventory are recorded release gates. |
| CMP-002 | P0 | The system shall enforce minimum-necessary field and record access. | Field-level and record-level authorization tests cover appointments, outcomes, notes, and messages. |
| CMP-003 | P0 | PHI shall be encrypted in transit and at rest with approved key management. | Security verification confirms TLS, storage encryption, and restricted keys. |
| CMP-004 | P0 | PHI shall not appear in URLs, client logs, analytics, crash reports, or unauthenticated notifications. | Inspection finds no prohibited values in supported workflows. |
| CMP-005 | P0 | The system shall audit login/logout, patient/appointment/note view, message action, follow-up resolution, link-out, export, and administrative change. | Events include actor, action, target, time, outcome, center, and correlation ID. |
| CMP-006 | P0 | Audit records shall be tamper-evident and unavailable to ordinary counselors. | Modification/access attempts are denied and monitored. |
| CMP-007 | P0 | Cached appointment, outcome, note, and message data shall follow approved retention and legal-hold policy. | Retention/delete/hold tests pass and do not affect authoritative records. |
| CMP-008 | P0 | Export/print/download of notes shall be disabled by default and separately authorized if required. | Unauthorized export paths fail and approved exports are audited. |

## 16. Non-functional requirements

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| NFR-001 | P1 | Standard Counselor pages should load within 2 seconds at the agreed percentile/network profile. | Performance report documents dataset, percentile, profile, and result. |
| NFR-002 | P1 | Appointment/outcome/note status shall meet a documented freshness objective. | UI displays last sync and alerts when the objective is missed. |
| NFR-003 | P0 | Integration updates and user mutations shall be idempotent or protected from duplicate submission. | Replay/double-submit tests create one logical event. |
| NFR-004 | P0 | The module shall meet WCAG 2.2 AA for core workflows. | Automated, keyboard, screen-reader, contrast, zoom/reflow, and error tests pass. |
| NFR-005 | P1 | Current and previous major Chrome/Edge versions shall be supported; other browsers follow BHG device policy. | Supported-browser matrix passes core flows. |
| NFR-006 | P0 | Errors shall be PHI-safe, actionable, and include a support correlation ID. | User can distinguish unavailable, unauthorized, delayed, and failed states. |
| NFR-007 | P1 | The system shall monitor portal, database, identity, SAMMS, AI Notetaker, Nexavoice, and messaging dependencies without exposing sensitive configuration. | Health dashboards and alerts identify the affected dependency. |

## 17. Data and API requirements

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| DAT-001 | P0 | Every appointment, outcome, patient, and note reference shall use stable application and source identifiers. | UI does not use patient names or array positions as record keys. |
| DAT-002 | P0 | API contracts shall identify authoritative source, source version/status, and update time. | Conflict and superseded-version behavior is deterministic. |
| DAT-003 | P1 | Integration shall support incremental appointment/outcome/note-status updates and full reconciliation. | Deleted, amended, replayed, and late-arriving events are handled safely. |
| DAT-004 | P0 | APIs shall validate schema, enum/status mapping, scope, ownership, length, and allowed fields server-side. | Invalid/malicious payload tests fail without partial updates. |
| DAT-005 | P0 | Cross-role messages and notifications shall use server persistence, not shared browser-only state. | Separate Patient and Counselor sessions see consistent authorized threads. |
| DAT-006 | P1 | Status mappings shall retain source codes server-side while presenting controlled portal labels. | Support can trace every portal status to the source value and mapping version. |
| DAT-007 | P0 | The final-note API shall never return drafts, transcripts, audio, AI prompts, or fields prohibited by display policy. | Contract/security tests cover each prohibited category. |
| DAT-008 | P1 | POC shared appointment, goal, preparation, medication-review, referral, and acknowledgement records shall use one shared demo-state contract across Patient and Clinician Portal views. | Switching portal views in the POC shows the same record and latest state without duplicate copies. |
| DAT-009 | P0 | Production collaborative records shall use server persistence and optimistic concurrency rather than browser-only trust. | Cross-device behavior is consistent and stale writes return a conflict. |

## 18. Testing requirements

| ID | Pri. | Requirement | Acceptance criteria |
|---|---:|---|---|
| TST-001 | P0 | Automated tests shall cover authentication, counselor/center/patient authorization, and external-link authorization. | Release pipeline blocks on failed IAM/IDOR tests. |
| TST-002 | P1 | End-to-end tests shall cover upcoming, completed/note available, note processing, note error, patient no-show, cancelled, and rescheduled appointments. | Each flow verifies displayed source, freshness, permitted actions, and audit event. |
| TST-003 | P0 | Note tests shall prove that only final approved content is readable and no editing/generation/sync is possible. | Draft and out-of-scope note requests are rejected. |
| TST-004 | P0 | Integration tests shall cover late, duplicate, amended, missing, unavailable, and conflicting source data. | UI never shows duplicate records or a false final/current state. |
| TST-005 | P1 | Regression tests shall cover existing Patient routes and all refocused Clinician Portal staff routes. | The in-place Clinician Portal change does not break existing authentication or Patient Portal workflows. |
| TST-006 | P0 | Security tests shall include SAST, dependency/secret scanning, XSS, CSRF, IDOR, session handling, and PHI leakage. | Critical/high findings are resolved or formally accepted. |
| TST-007 | P1 | Accessibility testing shall cover keyboard, screen reader, focus, contrast, status semantics, errors, and zoom/reflow. | No P0/P1 accessibility defect remains. |
| TST-008 | P1 | Bidirectional POC tests shall switch between Patient and Clinician Portal views for appointment, goal, preparation, medication-review, referral, and acknowledgement workflows. | Each transition appears once, preserves history, and respects allowed actions for each role. |
| TST-009 | P0 | Medication-role tests shall prove that counselor actions can route/schedule a review but cannot prescribe, change dose, approve take-homes, or alter dispensing. | All prohibited mutations are absent or rejected. |

## 19. POC acceptance criteria

The Clinician Portal POC is ready for review when:

1. It runs from `packages/frontEnd` with the existing framework and configuration.
2. Existing Patient routes continue to work and existing staff routes are refocused without framework or configuration changes.
3. The existing fictional staff account sees Clinician Portal navigation and an authorized mock caseload; no separate Counselor role is introduced.
4. Dashboard shows upcoming, completed, note-available, note-processing, no-show, cancelled, and rescheduled scenarios.
5. Appointments & Outcomes supports useful filters and accurate detail views.
6. A completed appointment opens a read-only fictional finalized DAP/PIE note or approved summary.
7. No note editing, session conducting, recording, transcription, AI prompting, or note sync control exists.
8. A patient no-show appears in the follow-up queue and supports a fictional non-urgent secure-message action.
9. AI Notetaker, Nexavoice, and SAMMS destinations are clearly labeled as separate connected applications.
10. Mock integrations are never represented as live.
11. Counselor proposes a counseling appointment; Patient accepts or requests a different time; both views stay synchronized.
12. Counselor proposes a recovery goal/action; Patient accepts or posts progress; Counselor acknowledges it.
13. Counselor sends appointment-preparation items and a patient-friendly after-visit follow-up card; Patient completes/acknowledges them.
14. Patient requests a medication review; Counselor routes it and proposes a medical-provider appointment without prescribing or changing a dose.
15. Counselor offers a resource/referral; Patient accepts/declines; both see the handoff status.
16. Counselor requests a document/resource acknowledgement; Patient response returns to the Counselor view.
17. Route, authorization, state-transition, medication-boundary, regression, and accessibility tests pass.

## 20. Production release gates

Production use is blocked until:

- BHG Product, Clinical, Compliance/Privacy, Security, Legal, Informatics/SAMMS, AI Notetaker, Nexavoice, and Operations owners approve boundaries and data flows.
- Entra ID/Azure AD and server-side record authorization are complete.
- Authoritative-source and status-mapping contracts are approved.
- Final-note display policy and field-level restrictions are approved.
- Appointment/outcome/note APIs or events pass reconciliation, freshness, retry, and amendment testing.
- SSO/deep links are approved and reauthorize at the destination.
- HIPAA, 42 CFR Part 2, retention, audit, export, incident, and downtime controls pass.
- Security, accessibility, performance, monitoring, backup/recovery, and clinical-user UAT pass.

## 21. POC assumptions and implementation decisions

- Use fictional seeded data and browser persistence; do not call external systems.
- Show a full fictional finalized note to the Counselor in read-only mode; do not expose it to the Patient role.
- Give the Patient a separate patient-friendly follow-up card with explicitly shared actions/resources.
- Implement appointment proposals as simulated collaborative requests, not authoritative SAMMS scheduling.
- Support no-show follow-up with secure message plus replacement counseling-appointment proposal.
- Implement a Shared Recovery Plan as a portal engagement aid, not a SAMMS treatment plan.
- Make medication, dose, dosing schedule, and take-home values read-only.
- Let Patient submit medication-review concerns and Counselor route/schedule a medical-provider review; never provide counselor prescribing.
- Include fictional provider-owned appointment slots to demonstrate closed-loop coordination.
- Include resource/referral offers with patient accept/decline/request-help responses.
- Keep ASAM, UDS/labs, treatment plan, discharge/transfer, enrollment, and center master data read-only.
- Represent AI Notetaker, Nexavoice, and SAMMS with source badges and simulated deep links only.
- Restrict the POC Counselor to an assigned fictional caseload and centers.
- Gather stakeholder feedback from these working flows before defining production mappings and policies.
