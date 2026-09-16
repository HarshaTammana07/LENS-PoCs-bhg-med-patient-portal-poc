import {
  appointments,
  documents,
  messages,
  notifications,
  patient,
} from './bhgPatientData';

export const DEMO_STATE_KEY = 'bhg-connected-demo-state-v5';

const messageDetails = {
  'MSG-301': [
    { id: 'r-301-1', sender: 'Alicia Monroe', time: 'Sep 12 · 4:10 PM', text: 'Hi Jordan, your last screening looked stable. I’d like to review your recovery goals and weekly routine at our Thursday visit.' },
    { id: 'r-301-2', sender: 'You', time: 'Sep 13 · 9:05 AM', text: 'Thank you. I’ve been keeping up with the morning routine we discussed.' },
    { id: 'r-301-3', sender: 'Alicia Monroe', time: 'Today · 8:12 AM', text: 'That’s great progress. I’m looking forward to seeing you Thursday at 10:30 AM — we can build on what’s working and adjust anything that feels hard.' },
  ],
  'MSG-298': [
    { id: 'r-298-1', sender: 'BHG Knoxville', time: 'Yesterday · 2:45 PM', text: 'Our medication window hours are unchanged this week. Please arrive before 11:30 AM on clinic days.' },
    { id: 'r-298-2', sender: 'BHG Knoxville', time: 'Yesterday · 2:46 PM', text: 'If you need a schedule exception, reply here or call the front desk before your visit.' },
  ],
  'MSG-287': [
    { id: 'r-287-1', sender: 'Danielle Brooks', time: 'Sep 9 · 3:40 PM', text: 'Hi Jordan, I reviewed your TennCare authorization for outpatient treatment services.' },
    { id: 'r-287-2', sender: 'Danielle Brooks', time: 'Sep 10 · 11:20 AM', text: 'Your coverage is active through December 31, 2026. No action is needed at this time. Reach out if your plan changes.' },
  ],
};

function mergeAppointments(storedAppointments = []) {
  const storedById = new Map(storedAppointments.map((item) => [item.id, item]));
  return appointments.map((seedItem) => {
    const saved = storedById.get(seedItem.id);
    return {
      ...seedItem,
      requestStatus: saved?.requestStatus ?? null,
    };
  });
}

export function createInitialDemoState() {
  return {
    patient: { ...patient },
    appointments: appointments.map((item) => ({ ...item, requestStatus: null })),
    documents: documents.map((item) => ({ ...item })),
    messages: messages.map((item) => ({
      ...item,
      thread: messageDetails[item.id] || [],
    })),
    notifications: notifications.map((item) => ({ ...item })),
    workItems: [
      {
        id: 'REQ-1106',
        type: 'Missed-visit follow-up',
        title: 'Reschedule individual counseling',
        detail: 'I missed yesterday’s appointment because my ride was unavailable. Can I get another time?',
        patient: 'Kendall Wright',
        centerId: 'jackson-tn',
        created: 'Today · 9:18 AM',
        status: 'New',
        response: '',
      },
      {
        id: 'REQ-1105',
        type: 'Transportation support',
        title: 'Help getting to the center',
        detail: 'I need help understanding transportation options for my next in-person visit.',
        patient: 'Casey Morgan',
        centerId: 'jackson-tn',
        created: 'Today · 8:54 AM',
        status: 'In review',
        response: '',
      },
      {
        id: 'REQ-1104',
        type: 'Appointment offer response',
        title: 'Recovery plan follow-up',
        detail: 'The patient requested a different Zoom appointment time.',
        patient: 'Jamie Carter',
        centerId: 'knoxville-citico',
        created: 'Today · 8:31 AM',
        status: 'New',
        response: '',
      },
      {
        id: 'REQ-1103',
        type: 'Medication review request',
        title: 'Question for medical provider',
        detail: 'I would like to discuss how I have been feeling before my next medication-plan review.',
        patient: 'Taylor Brooks',
        centerId: 'knoxville-citico',
        created: 'Today · 8:05 AM',
        status: 'New',
        response: '',
      },
      {
        id: 'REQ-1102',
        type: 'Treatment support',
        title: 'Recovery goal check-in',
        detail: 'I completed the coping exercise and would like to review the next step.',
        patient: 'Cameron Ellis',
        centerId: 'knoxville-bernard',
        created: 'Today · 7:46 AM',
        status: 'In review',
        response: '',
      },
      {
        id: 'REQ-1101',
        type: 'Appointment change',
        title: 'Individual counseling',
        detail: 'Could I move my Zoom counseling session to later in the afternoon?',
        patient: 'Jordan Williams',
        centerId: 'knoxville-bernard',
        created: 'Today · 7:22 AM',
        status: 'New',
        response: '',
      },
      {
        id: 'REQ-1001',
        type: 'Financial assistance',
        title: 'Coverage question',
        detail: 'Please confirm whether transportation support is available.',
        patient: patient.name,
        centerId: 'knoxville-bernard',
        created: 'Sep 10 · 9:20 AM',
        status: 'Resolved',
        response: 'A patient financial counselor will discuss available transportation resources at your next visit.',
      },
    ],
    appointmentProposals: [
      {
        id: 'OFFER-1001',
        patient: patient.name,
        centerId: 'knoxville-bernard',
        title: 'Recovery plan follow-up',
        date: 'September 29, 2026',
        dateShort: 'SEP 29',
        time: '11:00 AM',
        provider: 'Alicia Monroe',
        location: 'Secure Zoom visit',
        modality: 'Zoom',
        duration: '30 minutes',
        preparation: 'Choose accept or request another time. This is not confirmed until you respond.',
        status: 'Awaiting patient response',
        created: 'Sep 14 · 10:15 AM',
      },
    ],
    appointmentOutcomes: [
      { id: 'OUT-1001', patient: 'Jordan Williams', centerId: 'knoxville-bernard', service: 'Individual counseling', date: 'Sep 3', outcome: 'Completed', followUp: 'Patient-facing summary published' },
      { id: 'OUT-1002', patient: 'Jamie Carter', centerId: 'knoxville-citico', service: 'Individual counseling', date: 'Sep 12', outcome: 'Patient did not attend', followUp: 'Outreach due today' },
      { id: 'OUT-1003', patient: 'Taylor Brooks', centerId: 'knoxville-citico', service: 'Recovery skills group', date: 'Sep 10', outcome: 'Completed', followUp: 'No additional action' },
    ],
    activity: [
      { id: 'ACT-1', title: 'Coverage verified', detail: 'TennCare Demo Plan confirmed active.', time: 'Sep 10' },
      { id: 'ACT-2', title: 'Treatment plan updated', detail: 'Goals reviewed with Alicia Monroe.', time: 'Sep 3' },
    ],
  };
}

export function loadDemoState() {
  try {
    const initial = createInitialDemoState();
    const stored = JSON.parse(localStorage.getItem(DEMO_STATE_KEY));
    if (!stored) return initial;
    return {
      ...initial,
      ...stored,
      patient: { ...initial.patient, ...stored.patient },
      appointments: mergeAppointments(stored.appointments),
      appointmentProposals: stored.appointmentProposals || initial.appointmentProposals,
      appointmentOutcomes: stored.appointmentOutcomes || initial.appointmentOutcomes,
    };
  } catch {
    return createInitialDemoState();
  }
}
