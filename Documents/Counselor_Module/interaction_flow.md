# Clinician Portal–Patient Portal POC Interaction Flow

**Status:** Proposed POC flow  
**Purpose:** Define connected Patient and Clinician Portal experiences without duplicating AI Notetaker, Nexavoice, or SAMMS. The Clinician Portal is the renamed and refocused existing Clinic Operations area, not a separate portal role.

## 1. POC roles

### Patient

- Reviews appointments, proposals, preparation items, follow-up cards, goals, medication-review status, referrals, and documents.
- Accepts, requests changes, acknowledges, completes, or reports progress.
- Sends secure non-urgent messages.

### Clinician Portal user (counselor persona)

- Views assigned caseload, appointments, outcomes, finalized notes, missed-session follow-up, and patient responses.
- Proposes counseling appointments and shared actions.
- Publishes patient-friendly follow-up information.
- Routes medication concerns to an authorized medical-provider workflow.
- Offers resources/referrals and monitors handoff status.

### Medical provider — simulated integration actor

- Owns medication evaluation, prescribing, dose changes, take-home decisions, and medication-review outcomes.
- Appears in the POC only as a fictional queue/appointment/outcome source.

### Connected systems — simulated

- **AI Notetaker:** conducts sessions and returns session/note status.
- **SAMMS:** authoritative patient, appointment, and final clinical record.
- **Nexavoice:** Operations reference and workflow application.

## 2. Primary connected-care loop

```text
CLINICIAN PORTAL                    PATIENT PORTAL                    CONNECTED SYSTEM

Review caseload and next visit
        │
        ├── Propose counseling appointment ───────► Review proposal
        │                                          │
        │                              Accept or request another time
        │                                          │
Review response ◄──────────────────────────────────┘
        │
Confirm appointment ──────────────────────────────► See confirmed visit
        │
Send preparation items ───────────────────────────► Confirm attendance / prepare
        │
        ├──────────────────────────────────────────────────────────► Appointment exists in
        │                                                            scheduler/SAMMS
        │
        │                                                Session conducted in AI Notetaker
        │                                                            │
Receive outcome + final-note status ◄────────────────────────────────┘
        │
View finalized note (read-only)
        │
Publish patient-friendly follow-up ───────────────► Review and acknowledge
        │                                          │
Propose shared goal/action ───────────────────────► Accept / request change / update progress
        │                                          │
Review progress ◄─────────────────────────────────┘
```

## 3. Appointment proposal and confirmation

### Happy path

1. Counselor selects an assigned patient.
2. Counselor chooses **Propose appointment**.
3. Counselor selects counseling type, modality, center, and one fictional available slot.
4. Proposal is saved as `PROPOSED` and appears in the Patient Portal.
5. Patient selects **Accept**.
6. Status becomes `PATIENT ACCEPTED`.
7. Counselor selects **Confirm**.
8. Both views show `CONFIRMED` with the same details and activity history.

### Change-request path

1. Patient selects **Request another time** and chooses an approved reason/alternative preference.
2. Status becomes `CHANGE REQUESTED`.
3. Counselor selects a replacement slot.
4. The replacement remains linked to the original proposal.
5. Patient accepts and Counselor confirms.

### POC boundary

The POC does not write to SAMMS or reserve a real slot. Every proposal is visibly labeled **Simulated scheduling**.

## 4. Completed appointment and follow-up

```text
External outcome received
        │
        ├── COMPLETED — NOTE PROCESSING
        │          └── Counselor can view status only
        │
        ├── COMPLETED — NOTE AVAILABLE
        │          ├── Counselor views fictional finalized note, read-only
        │          └── Counselor publishes separate patient-friendly follow-up card
        │
        └── COMPLETED — NOTE ERROR/UNAVAILABLE
                   └── Counselor sees safe status and simulated link to owner
```

The follow-up card may contain:

- Next appointment.
- Agreed recovery goal.
- Patient action items.
- Counselor/care-team action items.
- Approved educational resource or referral.
- Due date and acknowledgement action.

It must not expose the clinical note, transcript, AI output, diagnosis, or clinician-only assessment.

## 5. Not-held/no-show recovery flow

```text
Appointment outcome: NOT HELD — PATIENT NO-SHOW
        │
        ├── Add item to Counselor Follow-up Queue
        ├── Preserve original appointment/outcome
        └── Show recent attendance and future appointments
                    │
                    ├── Send secure non-urgent follow-up
                    ├── Propose replacement counseling appointment
                    ├── Offer transportation/resource support
                    └── Create simulated Operations handoff
```

Patient can:

- Read and respond to the follow-up.
- Select an approved reason category.
- Accept a replacement proposal or request another time.
- Accept/decline a transportation or other barrier-removal resource.

The portal never changes `NO-SHOW` to another outcome. Follow-up resolution is tracked separately.

## 6. Shared Recovery Plan flow

```text
Counselor proposes goal/action
        ↓
Patient: Accept | Request change | Decline with optional reason
        ↓
Accepted item becomes ACTIVE
        ↓
Patient posts progress: Not started | In progress | Completed | Need help
        ↓
Counselor acknowledges, comments, or proposes next step
        ↓
Item becomes COMPLETED or remains ACTIVE
```

Examples:

- Attend the next individual counseling visit.
- Review a coping-skills resource before the next visit.
- Contact a transportation resource.
- Complete an approved appointment-preparation check-in.
- Bring an approved document to the center.

This is an engagement/action plan, not the formal SAMMS treatment plan.

## 7. Medication concern and medical-review flow

```text
Patient selects Request medication review
        │
        ├── Medication question
        ├── Possible side effect
        ├── Cravings/withdrawal concern
        ├── Missed dose
        └── Current schedule question
        │
Urgent/emergency guidance displayed
        │
Counselor receives coordination request
        │
Counselor routes to Medical Provider queue
        │
Optional: propose fictional Medication Review Appointment
        │
Patient accepts or requests another time
        │
Simulated provider outcome returned:
PROVIDER REVIEWED | REVIEW SCHEDULED | FOLLOW-UP REQUIRED
```

Hard boundary:

- Counselor cannot select a drug, enter a prescription, change a dose, approve take-homes, authorize dispensing, or alter the dosing schedule.
- Any medication and schedule shown in the portal is read-only and attributed to the medical source.

## 8. Resource/referral and warm-handoff flow

1. Counselor selects an approved fictional resource category: transportation, housing, employment, insurance/coverage help, peer support, community healthcare, or another configured category.
2. Counselor sends an offer to the patient.
3. Patient selects **Accept**, **Decline**, or **I need help contacting them**.
4. Counselor records a simulated warm handoff to Medical or Operations when appropriate.
5. Both roles see `OFFERED`, `ACCEPTED`, `REFERRED`, `CONTACTED`, or `CLOSED`.
6. When Operations work is needed, the Counselor sees a simulated **Open in Nexavoice** action.

The portal contains only the coordination status and patient-facing information, not a duplicate Nexavoice queue.

## 9. Document/resource acknowledgement flow

1. Counselor selects an approved fictional educational item, form, or existing Patient Portal document.
2. Patient receives an action card.
3. Patient selects **Reviewed**, **Completed**, **Declined**, or **Need help** as allowed.
4. Counselor sees the updated state and may follow up.
5. The item links to its authoritative source where appropriate.

The portal does not become the master consent/document system.

## 10. Suggested Counselor navigation

```text
Dashboard
Caseload
Appointments & Outcomes
Follow-up Queue
Shared Recovery Plans
Care Coordination
Messages
Connected Applications
```

`Care Coordination` contains medication-review requests, resources/referrals, warm handoffs, and document acknowledgements. It does not contain prescribing, dosing authorization, billing administration, or Nexavoice management.

## 11. Suggested Patient Portal additions

```text
Home
My Treatment
Medication Schedule (existing read-only data)
Appointments
Counseling
My Action Plan
Requests & Referrals
Messages
Forms & Documents
```

Recommended home cards:

- Appointment proposal waiting for response.
- Appointment preparation due.
- New follow-up card from counselor.
- Recovery action due/update requested.
- Medication-review request status.
- Resource/referral offer.
- Document acknowledgement due.

## 12. POC demo story

1. Sign in as Counselor and view the assigned caseload.
2. Propose a counseling appointment for Jordan Williams.
3. Switch to Patient; request a different time.
4. Switch to Counselor; propose replacement and confirm after Patient accepts.
5. Counselor sends preparation items and a recovery action.
6. Patient completes preparation and marks the action `In progress`.
7. Simulate the appointment as completed with a finalized note available.
8. Counselor views the note read-only and publishes a patient-friendly follow-up card.
9. Patient acknowledges the follow-up card.
10. Patient submits a medication-review concern.
11. Counselor routes it and proposes a medical-provider appointment without changing medication.
12. Patient accepts; simulated provider status becomes `REVIEW SCHEDULED`.
13. Counselor offers a transportation resource; Patient accepts; handoff moves to `REFERRED`.
14. Show a different patient with a no-show and demonstrate secure follow-up plus replacement appointment proposal.

This story demonstrates meaningful counselor–patient interaction while preserving the boundaries of AI Notetaker, Nexavoice, SAMMS, and licensed medical practice.
