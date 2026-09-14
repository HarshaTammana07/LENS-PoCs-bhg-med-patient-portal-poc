/**
 * Live portal dataset cache — filled from the portal API after login.
 */
import * as seed from '../data/mockData';

function brand(value) {
  if (value == null) return value;
  if (typeof value === 'string') {
    return value
      .replace(/\bOttawa ASC\b/gi, 'BHG Behavioral Health')
      .replace(/\bOttawa General Hospital\b/gi, 'BHG Med Hospital')
      .replace(/\bOttawa Primacy Health Centre\b/gi, 'BHG Primary Care')
      .replace(/\bLifeLabs Ottawa\b/gi, 'BHG Lab Services');
  }
  if (Array.isArray(value)) return value.map(brand);
  if (typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = brand(v);
    return out;
  }
  return value;
}

const fallback = brand({
  patient: seed.patient,
  appointments: seed.appointments,
  records: seed.records,
  notifications: seed.notifications,
  conversations: seed.conversations,
  billing: seed.billing,
  insuranceCoverage: seed.insuranceCoverage,
  preOpChecklistItems: seed.preOpChecklistItems,
  timelineEvents: seed.timelineEvents,
  helpCategories: seed.helpCategories,
  visits: seed.visits,
  healthHubVitals: seed.healthHubVitals,
  healthHubAllergies: seed.healthHubAllergies,
  healthHubProblems: seed.healthHubProblems,
  healthHubImmunizations: seed.healthHubImmunizations,
  healthHubClinicalMessages: seed.healthHubClinicalMessages,
  healthHubPHR: seed.healthHubPHR,
  healthAccessDocuments: seed.healthAccessDocuments,
  educationDocuments: seed.educationDocuments,
  refillRequests: seed.refillRequests,
  trackerBloodPressure: seed.trackerBloodPressure,
  trackerGlucose: seed.trackerGlucose,
  patientRecordAccessLog: seed.patientRecordAccessLog,
  mockPatients: seed.mockPatients,
  mockLabs: seed.mockLabs,
});

const CLINICAL_KEYS = new Set([
  'patient',
  'appointments',
  'preOpChecklistItems',
  'visits',
  'timelineEvents',
]);

let live = null;
let liveApplied = false;
let allowClinicalFallback = true;

export function setPortalData(bundle, { live: isLive = false, allowFallback = true } = {}) {
  live = bundle ? brand(bundle) : null;
  liveApplied = Boolean(isLive && bundle);
  allowClinicalFallback = allowFallback;
}

export function hasLivePortalData() {
  return liveApplied;
}

export function getPortalData() {
  return live || fallback;
}

/**
 * @param {string} key
 * @param {{ allowFallback?: boolean }} [opts]
 */
export function getPortalSlice(key, opts = {}) {
  const useFallback = opts.allowFallback ?? allowClinicalFallback;
  const data = getPortalData();
  if (data[key] !== undefined && data[key] !== null) {
    if (!useFallback && CLINICAL_KEYS.has(key) && !liveApplied) {
      return Array.isArray(fallback[key]) ? [] : null;
    }
    return data[key];
  }
  if (!useFallback && CLINICAL_KEYS.has(key)) {
    return Array.isArray(fallback[key]) ? [] : null;
  }
  return fallback[key];
}
