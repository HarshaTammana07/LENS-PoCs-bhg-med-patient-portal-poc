import {
  appointments,
  documents,
  messages,
  notifications,
  patient,
} from './bhgPatientData';

export const DEMO_STATE_KEY = 'bhg-connected-demo-state-v1';

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
        id: 'REQ-1001',
        type: 'Financial assistance',
        title: 'Coverage question',
        detail: 'Please confirm whether transportation support is available.',
        patient: patient.name,
        created: 'Sep 10 · 9:20 AM',
        status: 'Resolved',
        response: 'A patient financial counselor will discuss available transportation resources at your next visit.',
      },
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
    };
  } catch {
    return createInitialDemoState();
  }
}
