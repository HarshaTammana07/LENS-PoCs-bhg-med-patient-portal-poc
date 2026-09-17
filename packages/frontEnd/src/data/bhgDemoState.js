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

export function mergeDemoWorkItems(seedItems = [], storedItems = []) {
  const seedIds = new Set(seedItems.map((item) => item.id));
  const storedById = new Map(storedItems.map((item) => [item.id, item]));
  const dynamicItems = storedItems.filter((item) => !seedIds.has(item.id));
  const seededItems = seedItems.map((item) => ({ ...item, ...storedById.get(item.id) }));
  return [...dynamicItems, ...seededItems];
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
    clinicianMessages: [
      {
        id: 'CM-501',
        patient: 'Kendall Wright',
        patientId: 'BHG-20296',
        centerId: 'jackson-tn',
        program: 'OTP · Induction',
        subject: 'Transportation for next visit',
        preview: 'I may need help getting to the center for my next appointment.',
        time: 'Today · 9:18 AM',
        unreadCount: 2,
        thread: [
          { id: 'cm-501-1', sender: 'Morgan Reed', time: 'Yesterday · 3:20 PM', text: 'Hi Kendall, I am checking in before your recovery plan follow-up. Is there anything that could make it difficult to attend?' },
          { id: 'cm-501-2', sender: 'Kendall Wright', time: 'Today · 9:12 AM', text: 'My usual ride is not available this week.' },
          { id: 'cm-501-3', sender: 'Kendall Wright', time: 'Today · 9:18 AM', text: 'I may need help getting to the center for my next appointment.' },
        ],
      },
      {
        id: 'CM-502',
        patient: 'Jordan Williams',
        patientId: 'BHG-20481',
        centerId: 'knoxville-bernard',
        program: 'OTP · Stabilization',
        subject: 'Thursday counseling visit',
        preview: 'Thank you. I have been keeping up with the morning routine we discussed.',
        time: 'Today · 8:42 AM',
        unreadCount: 1,
        thread: [
          { id: 'cm-502-1', sender: 'Morgan Reed', time: 'Sep 16 · 4:10 PM', text: 'Hi Jordan, your last screening looked stable. I would like to review your recovery goals at our Thursday visit.' },
          { id: 'cm-502-2', sender: 'Jordan Williams', time: 'Today · 8:42 AM', text: 'Thank you. I have been keeping up with the morning routine we discussed.' },
        ],
      },
      {
        id: 'CM-503',
        patient: 'Jamie Carter',
        patientId: 'BHG-20398',
        centerId: 'knoxville-citico',
        program: 'IOP · Active care',
        subject: 'Zoom appointment question',
        preview: 'Will the Zoom link appear in my portal before the session?',
        time: 'Today · 8:31 AM',
        unreadCount: 1,
        thread: [
          { id: 'cm-503-1', sender: 'Jamie Carter', time: 'Today · 8:31 AM', text: 'Will the Zoom link appear in my portal before the session?' },
        ],
      },
      {
        id: 'CM-504',
        patient: 'Casey Morgan',
        patientId: 'BHG-20459',
        centerId: 'jackson-tn',
        program: 'OBOT · Maintenance',
        subject: 'Recovery support resources',
        preview: 'I reviewed the peer-support options. Thank you for sending them.',
        time: 'Yesterday · 4:05 PM',
        unreadCount: 0,
        thread: [
          { id: 'cm-504-1', sender: 'Morgan Reed', time: 'Yesterday · 2:15 PM', text: 'I added the peer-support resources we discussed to your care plan.' },
          { id: 'cm-504-2', sender: 'Casey Morgan', time: 'Yesterday · 4:05 PM', text: 'I reviewed the peer-support options. Thank you for sending them.' },
        ],
      },
      {
        id: 'CM-505',
        patient: 'Taylor Brooks',
        patientId: 'BHG-20476',
        centerId: 'knoxville-citico',
        program: 'OTP · Maintenance',
        subject: 'Treatment plan review',
        preview: 'Your treatment plan review is scheduled for Friday at 1:00 PM.',
        time: 'Sep 15 · 2:10 PM',
        unreadCount: 0,
        thread: [
          { id: 'cm-505-1', sender: 'Morgan Reed', time: 'Sep 15 · 2:10 PM', text: 'Your treatment plan review is scheduled for Friday at 1:00 PM. Please reply if you need another time.' },
        ],
      },
    ],
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
      { id: 'OUT-1004', patient: 'Cameron Ellis', centerId: 'knoxville-bernard', service: 'Individual counseling', date: 'Sep 11', outcome: 'Patient did not attend', followUp: 'Zoom rescheduling outreach due' },
      { id: 'OUT-1005', patient: 'Kendall Wright', centerId: 'jackson-tn', service: 'Recovery plan follow-up', date: 'Sep 13', outcome: 'Patient did not attend', followUp: 'Transportation barrier follow-up due' },
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
      workItems: mergeDemoWorkItems(initial.workItems, stored.workItems),
      appointmentProposals: stored.appointmentProposals || initial.appointmentProposals,
      appointmentOutcomes: mergeDemoWorkItems(initial.appointmentOutcomes, stored.appointmentOutcomes),
    };
  } catch {
    return createInitialDemoState();
  }
}
