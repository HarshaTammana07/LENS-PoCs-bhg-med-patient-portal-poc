/** Surgery date helpers + ?demo= query param overrides for Ottawa ASC POC demos */

export const SURGERY_DATE = new Date('2026-03-18');

export const SURGERY_META = {
  procedure: 'Laparoscopic Cholecystectomy',
  surgeon: 'Dr. James Chen',
  specialty: 'General Surgery',
  dateLabel: 'Tuesday, June 25, 2026',
  dateShort: 'June 25, 2026',
  arrivalTime: '9:00 AM',
  procedureTime: '9:00 AM',
  location: 'Ottawa ASC, 3rd Floor',
  address: 'Ottawa ASC, 100 Main Street, 3rd Floor',
  escortName: 'David Jenkins',
  fastingStopEating: '11:30 PM',
  fastingStopLiquids: '5:30 AM',
  concierge: 'Marie Laurent',
};

function parseSurgeryDate(appt) {
  if (appt?.surgeryDatetime) {
    const d = new Date(appt.surgeryDatetime);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (appt?.date) {
    const d = new Date(appt.date);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return SURGERY_DATE;
}

/** Build surgery display meta from synced appointment (APT-001) with static fallbacks. */
export function getSurgeryMeta(appt) {
  if (!appt) return SURGERY_META;
  const dt = parseSurgeryDate(appt);
  return {
    procedure: appt.type || SURGERY_META.procedure,
    surgeon: appt.doctor || SURGERY_META.surgeon,
    specialty: appt.specialty || SURGERY_META.specialty,
    dateLabel: dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    dateShort: appt.date || dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    arrivalTime: appt.time || SURGERY_META.arrivalTime,
    procedureTime: appt.time || SURGERY_META.procedureTime,
    location: appt.location || SURGERY_META.location,
    address: appt.address || appt.location || SURGERY_META.address,
    escortName: SURGERY_META.escortName,
    fastingStopEating: appt.fastingStopEating || SURGERY_META.fastingStopEating,
    fastingStopLiquids: appt.fastingStopLiquids || SURGERY_META.fastingStopLiquids,
    concierge: SURGERY_META.concierge,
  };
}

let _cachedDemoMode = null;

function parseDemoParam() {
  if (typeof window === 'undefined') return null;
  const demo = new URLSearchParams(window.location.search).get('demo');
  if (!demo) return null;

  if (demo === 'surgeryDay') return { type: 'daysUntil', value: 0, label: 'surgery day' };
  if (demo === 'tomorrow') return { type: 'daysUntil', value: 1, label: 'tomorrow' };
  if (demo === '3days') return { type: 'daysUntil', value: 3, label: '3 days until surgery' };

  const daysMatch = demo.match(/^days:(\d+)$/);
  if (daysMatch) {
    return { type: 'daysUntil', value: parseInt(daysMatch[1], 10), label: `${daysMatch[1]} days until surgery` };
  }

  return { type: 'raw', value: demo, label: demo };
}

/** Returns demo override info, or null if no ?demo= param */
export function getDemoMode() {
  if (_cachedDemoMode === null) {
    _cachedDemoMode = parseDemoParam();
  }
  return _cachedDemoMode;
}

/** True when any ?demo= query param is present */
export function hasDemoParam() {
  return getDemoMode() !== null;
}

function getRealDaysUntil(appt) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const surgery = parseSurgeryDate(appt);
  surgery.setHours(0, 0, 0, 0);
  return Math.ceil((surgery - today) / (1000 * 60 * 60 * 24));
}

/** Days until surgery; negative when surgery is in the past (unless demo override) */
export function getSurgeryDaysUntil(appt) {
  const demo = getDemoMode();
  if (demo?.type === 'daysUntil') return demo.value;
  return getRealDaysUntil(appt);
}

export function isSurgeryDay(appt) {
  return getSurgeryDaysUntil(appt) === 0;
}

export function isSurgeryTomorrow(appt) {
  return getSurgeryDaysUntil(appt) === 1;
}

export function isSurgeryWithin24h(appt) {
  const d = getSurgeryDaysUntil(appt);
  return d >= 0 && d <= 1;
}

/** Human-readable demo chip label for presenter UI */
export function getDemoChipLabel() {
  const demo = getDemoMode();
  if (!demo) return null;
  if (demo.type === 'daysUntil') return `Demo: ${demo.label}`;
  return `Demo: ${demo.label}`;
}

/** Whether countdown banner should show (hidden when surgery is past, unless demo) */
export function shouldShowCountdownBanner(appt) {
  const days = getSurgeryDaysUntil(appt);
  if (days < 0) return false;
  if (hasDemoParam() && days >= 0) return true;
  return days >= 0;
}

/** Primary synced surgery appointment for the logged-in patient. */
export function findPrimarySurgery(appointments, workflowPatientId) {
  if (!Array.isArray(appointments) || !appointments.length) return null;
  if (workflowPatientId != null) {
    const byWorkflow = appointments.find((a) => a.workflowPatientId === workflowPatientId);
    if (byWorkflow) return byWorkflow;
    const byId = appointments.find((a) => a.id === `APT-${workflowPatientId}`);
    if (byId) return byId;
  }
  return appointments.find((a) => a.upcoming) || appointments[0];
}

/** Post-op / follow-up appointment from bundle (excludes primary surgery). */
export function findPostOpFollowUp(appointments, primarySurgery) {
  if (!Array.isArray(appointments) || !appointments.length) return null;
  const primaryId = primarySurgery?.id;
  return appointments.find((a) => {
    if (primaryId && a.id === primaryId) return false;
    const type = String(a.type || '').toLowerCase();
    return type.includes('post-op') || type.includes('follow-up') || type.includes('follow up');
  });
}
