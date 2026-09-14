/**
 * Demo-only risk-stratified triage - not a certified clinical decision support system.
 * Expands coverage beyond binary ED routing; combination rules escalate contextually.
 */

/** Emergency - immediate ED / emergency services (non-outpatient routing in demo logic). */
export const SYMPTOM_IDS_RED = [
  'chest_pain',
  'shortness_breath',
  'severe_worsening',
  'major_trauma',
  'neuro_deficit',
  'uncontrolled_bleeding',
  'loss_consciousness',
];

/** Moderate - clinic / urgent care within 24–48h typical (unless combos escalate). */
export const SYMPTOM_IDS_AMBER = [
  'fever',
  'persistent_cough',
  'ear_pain',
  'sinus_pressure',
  'urinary_symptoms',
  'dehydration',
  'vomiting_diarrhea',
  'back_pain_nontrauma',
  'joint_pain_swelling',
  'mild_asthma_symptoms',
  'marked_weakness_dizziness',
];

/** Mild - self-care / primary care if persists (do not ED unless combined with red/combos). */
export const SYMPTOM_IDS_GREEN = [
  'mild_headache',
  'cold_symptoms',
  'sore_throat_mild',
  'mild_fatigue',
  'body_aches_mild',
  'seasonal_allergies',
  'mild_stomach',
  'minor_skin_rash',
  'mild_bowel_change',
];

export const SYMPTOM_SECTIONS = [
  {
    key: 'red',
    tier: 'red',
    title: 'Emergency symptoms',
    subtitle: 'Possible cardiac, respiratory, trauma, neuro, or rapid deterioration - bypass outpatient triage',
    accent: 'var(--danger)',
    bg: 'rgba(207, 46, 46, 0.06)',
    items: [
      { id: 'chest_pain', label: 'Chest pain or pressure (possible cardiac event)' },
      { id: 'shortness_breath', label: 'Shortness of breath (respiratory distress, PE, or cardiac)' },
      { id: 'severe_worsening', label: 'Severe or rapidly worsening symptoms' },
      { id: 'major_trauma', label: 'Recent major injury / trauma' },
      { id: 'neuro_deficit', label: 'Confusion, weakness on one side, speech trouble, severe headache (stroke signs)' },
      { id: 'uncontrolled_bleeding', label: 'Uncontrolled or heavy bleeding' },
      { id: 'loss_consciousness', label: 'Loss of consciousness or near-fainting with concern' },
    ],
  },
  {
    key: 'amber',
    tier: 'amber',
    title: 'Moderate symptoms',
    subtitle: 'Often clinic or urgent care - escalate if worsening or combined with red flags',
    accent: '#d97706',
    bg: 'var(--warning-light)',
    items: [
      { id: 'fever', label: 'Fever (suspected or confirmed)' },
      { id: 'persistent_cough', label: 'Persistent cough (roughly 3–5+ days)' },
      { id: 'ear_pain', label: 'Ear pain' },
      { id: 'sinus_pressure', label: 'Sinus pain / pressure' },
      { id: 'urinary_symptoms', label: 'Urinary burning, urgency, or frequency' },
      { id: 'dehydration', label: 'Signs of dehydration (dry mouth, minimal urine, dizziness)' },
      { id: 'vomiting_diarrhea', label: 'Vomiting or diarrhea (no blood, short duration)' },
      { id: 'back_pain_nontrauma', label: 'Back pain (non-traumatic)' },
      { id: 'joint_pain_swelling', label: 'Joint pain or swelling' },
      { id: 'mild_asthma_symptoms', label: 'Asthma symptoms - mild, usually controlled' },
      { id: 'marked_weakness_dizziness', label: 'Marked weakness or dizziness (without red neuro signs above)' },
    ],
  },
  {
    key: 'green',
    tier: 'green',
    title: 'Mild symptoms',
    subtitle: 'Often self-limited - schedule primary care if persistent or worsening',
    accent: 'var(--success)',
    bg: 'var(--success-light)',
    items: [
      { id: 'mild_headache', label: 'Mild headache' },
      { id: 'cold_symptoms', label: 'Common cold (runny nose, sneezing, mild cough)' },
      { id: 'sore_throat_mild', label: 'Sore throat without breathing difficulty' },
      { id: 'mild_fatigue', label: 'Mild fatigue' },
      { id: 'body_aches_mild', label: 'Mild body aches' },
      { id: 'seasonal_allergies', label: 'Seasonal allergies' },
      { id: 'mild_stomach', label: 'Mild stomach discomfort (no vomiting blood)' },
      { id: 'minor_skin_rash', label: 'Minor skin rash (non-spreading, no fever)' },
      { id: 'mild_bowel_change', label: 'Mild constipation or diarrhea (brief)' },
    ],
  },
];

const RED = new Set(SYMPTOM_IDS_RED);
const AMBER = new Set(SYMPTOM_IDS_AMBER);
const GREEN = new Set(SYMPTOM_IDS_GREEN);

function labelsFor(ids) {
  const map = new Map();
  SYMPTOM_SECTIONS.forEach((s) => s.items.forEach((i) => map.set(i.id, i.label)));
  return ids.map((id) => map.get(id) || id);
}

/** Contextual escalation - HIGH without a red-tier checkbox (fever+SOB etc. are already covered by red selections). */
function combinationDemandsHigh(set) {
  if (set.has('vomiting_diarrhea') && set.has('dehydration')) return true;
  if (set.has('marked_weakness_dizziness') && set.has('vomiting_diarrhea')) return true;
  return false;
}

function buildHigh({ set, reason }) {
  const ids = [...set];
  const multi = ids.length >= 2;
  const redHits = ids.filter((id) => RED.has(id));

  const body = multi
    ? [
        'Multiple symptoms are selected - in this demo we treat combined patterns as higher risk.',
        'Assume possible life-threatening scenario until evaluated by emergency professionals.',
        '',
        '• Emergency: YES',
        '• Suggested disposition: Immediate Emergency Department (ED)',
        '• Mode: Ambulance / emergency services - call your local emergency number (e.g. 911); do not self-transport unless unavoidable.',
        '',
        ...(redHits.length
          ? [`Red-flag areas noted: ${labelsFor(redHits).slice(0, 4).join('; ')}${redHits.length > 4 ? '…' : ''}`]
          : ['Escalation driven by symptom combination rules (fever + breathing difficulty, dehydration with vomiting, etc.).']),
      ].join('\n')
    : [
        'A high-acuity warning symptom is selected. Treat as emergency escalation in this demo.',
        '',
        '• Recommendation: Emergency',
        '• Disposition: Immediate ED referral - no outpatient routing or scheduling delay in this advisory flow.',
        '• Patient instruction: Call your local emergency number now; do not drive yourself if symptoms are severe.',
      ].join('\n');

  return {
    urgency: 'HIGH',
    urgencyLabel: 'HIGH',
    recommendation: 'Emergency',
    suggestedCare: 'Urgent / Emergency Department (ED)',
    disposition: 'Immediate ED referral',
    patientInstruction: 'Call local emergency number (e.g. 911); ambulance preferred when severe.',
    body,
    disclaimer:
      'Demo triage only - not a diagnosis. If you believe you have an emergency, call emergency services immediately.',
    meta: { reason, multi, redCount: redHits.length },
  };
}

function buildMedium(ambers, greens) {
  const parts = [];
  if (ambers.length) parts.push(`Moderate-acuity items: ${labelsFor(ambers).slice(0, 5).join('; ')}${ambers.length > 5 ? '…' : ''}.`);
  if (greens.length) parts.push(`Mild items also selected: ${labelsFor(greens).slice(0, 4).join('; ')}${greens.length > 4 ? '…' : ''}.`);

  return {
    urgency: 'MEDIUM',
    urgencyLabel: 'MEDIUM',
    recommendation: 'Clinic / urgent care',
    suggestedCare: 'Primary care or urgent care within 24–48 hours',
    disposition: 'Outpatient evaluation',
    patientInstruction: 'Seek clinician advice sooner if symptoms worsen or new red flags appear.',
    body: [
      parts.join(' ') || 'Moderate concern in this demo routing model.',
      '',
      'This does not route to the ED unless you develop emergency symptoms - use Section A on this screen if those appear.',
    ].join('\n'),
    disclaimer:
      'Demo only. Not medical advice. If you develop chest pain, trouble breathing, severe bleeding, or confusion, seek emergency care.',
    meta: {},
  };
}

function buildLow(greens) {
  return {
    urgency: 'LOW',
    urgencyLabel: 'LOW',
    recommendation: 'Self-care / routine primary care',
    suggestedCare: 'Monitor; schedule PCP if symptoms persist or worsen',
    disposition: 'Self-care with optional PCP follow-up',
    patientInstruction: 'Rest, fluids as appropriate; contact your primary care clinic if not improving.',
    body: [
      `Mild symptoms only: ${labelsFor(greens).join('; ')}.`,
      '',
      'No emergency routing from this selection alone in the demo engine. If anything worsens or matches emergency symptoms above, re-run the check.',
    ].join('\n'),
    disclaimer:
      'Demo triage only. If you are unsure or symptoms change, contact a clinician or urgent care.',
    meta: {},
  };
}

function buildEmpty() {
  return {
    urgency: 'NONE',
    urgencyLabel: '',
    recommendation: '',
    suggestedCare: '',
    disposition: 'No selection',
    patientInstruction: '',
    body: 'Select any symptoms that apply across the sections, then tap “Get non-clinical guidance.”',
    disclaimer:
      'Not for emergencies - if you have a life-threatening emergency, call emergency services.',
    meta: {},
  };
}

/**
 * @param {string[]} selectedIds
 * @returns {object} Advisory result with urgency, bodies, disclaimers
 */
export function evaluateSymptomTriage(selectedIds) {
  const set = new Set(selectedIds.filter(Boolean));

  if (set.size === 0) {
    return buildEmpty();
  }

  for (const id of set) {
    if (!RED.has(id) && !AMBER.has(id) && !GREEN.has(id)) {
      /* ignore unknown */
    }
  }

  const known = [...set].filter((id) => RED.has(id) || AMBER.has(id) || GREEN.has(id));
  const knownSet = new Set(known);

  if (known.length === 0) {
    return buildEmpty();
  }

  const reds = known.filter((id) => RED.has(id));
  if (reds.length > 0) {
    return buildHigh({ set: knownSet, reason: 'red_flag' });
  }

  if (combinationDemandsHigh(knownSet)) {
    return buildHigh({ set: knownSet, reason: 'combination' });
  }

  const ambers = known.filter((id) => AMBER.has(id));
  const greens = known.filter((id) => GREEN.has(id));

  if (ambers.length === 0 && greens.length > 0) {
    return buildLow(greens);
  }

  if (ambers.length > 0) {
    return buildMedium(ambers, greens);
  }

  return buildMedium([], greens);
}
