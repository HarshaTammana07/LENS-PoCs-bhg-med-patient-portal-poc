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
    { id: 'r-301-1', sender: 'Alicia Monroe', time: 'Today · 8:12 AM', text: 'Hi Jordan, I’m looking forward to seeing you Thursday at 10:30 AM. We can review your recent screening and recovery goals together.' },
  ],
  'MSG-298': [
    { id: 'r-298-1', sender: 'BHG Knoxville', time: 'Yesterday · 2:45 PM', text: 'Our medication window hours are unchanged this week. Please arrive before 11:30 AM on clinic days.' },
  ],
  'MSG-287': [
    { id: 'r-287-1', sender: 'Danielle Brooks', time: 'Sep 10 · 11:20 AM', text: 'Your TennCare coverage was verified and remains active. No action is needed at this time.' },
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
