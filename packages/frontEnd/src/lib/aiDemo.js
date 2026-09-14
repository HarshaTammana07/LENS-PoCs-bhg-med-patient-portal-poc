import {
  appointments as mockAppointments,
  records as mockRecords,
  billing as mockBilling,
  conversations as mockConversations,
  helpCategories,
} from '../data/mockData';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/** Upcoming visits for assistant UI (pass live list from AppContext when available). */
export function getUpcomingAppointmentsList(appointmentsSource = mockAppointments) {
  const src = Array.isArray(appointmentsSource) ? appointmentsSource : mockAppointments;
  return src
    .filter((a) => a.upcoming)
    .map((a) => ({
      id: a.id,
      type: a.type,
      date: a.date,
      day: a.day,
      month: a.month,
      time: a.time,
      doctor: a.doctor,
      specialty: a.specialty,
      location: a.location,
      mode: a.mode,
      status: a.status,
    }));
}

function parseNumeric(value) {
  if (value == null) return null;
  const raw = String(value).trim();
  const m = raw.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function refToRange(ref) {
  if (!ref) return null;
  const s = String(ref);
  // Common forms: "4.0-10.0", "70–99", "< 200", ">= 3.5"
  const dash = s.match(/(-?\d+(\.\d+)?)\s*[–-]\s*(-?\d+(\.\d+)?)/);
  if (dash) return { low: Number(dash[1]), high: Number(dash[3]) };

  const lt = s.match(/<\s*(-?\d+(\.\d+)?)/);
  if (lt) return { low: null, high: Number(lt[1]) };

  const lte = s.match(/<=\s*(-?\d+(\.\d+)?)/);
  if (lte) return { low: null, high: Number(lte[1]) };

  const gt = s.match(/>\s*(-?\d+(\.\d+)?)/);
  if (gt) return { low: Number(gt[1]), high: null };

  const gte = s.match(/>=\s*(-?\d+(\.\d+)?)/);
  if (gte) return { low: Number(gte[1]), high: null };

  return null;
}

function compareToRef(num, range) {
  if (num == null || !range) return { flag: 'unknown' };
  if (range.low != null && num < range.low) return { flag: 'low' };
  if (range.high != null && num > range.high) return { flag: 'high' };
  return { flag: 'normal' };
}

export function generateLabSummary(record) {
  if (record?.id === 'REC-001') {
    return {
      title: 'AI Lab Summary - Complete Blood Count (CBC)',
      abnormalCount: 0,
      confidence: 92,
      text: [
        'Your complete blood count results are all within the normal range. Your white blood cell count is 6.2, which suggests no active infection or immune concerns. Your hemoglobin is 14.1, which is healthy and indicates good oxygen-carrying capacity. Your platelet count of 245 is well within range, meaning your blood clotting function appears normal.',
        '',
        'Overall, these results suggest you are in good health for your upcoming procedure.',
      ].join('\n'),
      disclaimer:
        'This summary is generated for informational purposes only. It is not a diagnosis or medical advice. Please contact your care team with any questions.',
    };
  }

  const rows = Array.isArray(record?.details) ? record.details : [];
  const parsed = rows
    .map((r) => {
      const num = parseNumeric(r.value);
      const range = refToRange(r.ref);
      const cmp = compareToRef(num, range);
      return { ...r, num, range, flag: cmp.flag };
    })
    .filter((r) => r.label && r.value);

  const abnormal = parsed.filter((r) => r.flag === 'high' || r.flag === 'low' || r.normal === false);
  const normalCount = parsed.filter((r) => r.flag === 'normal' || r.normal === true).length;

  const headline =
    abnormal.length === 0
      ? 'All checked values are within the expected range.'
      : abnormal.length === 1
        ? 'One value is outside the expected range.'
        : `${abnormal.length} values are outside the expected range.`;

  const confidence = clamp(Math.round((normalCount / Math.max(1, parsed.length)) * 100), 0, 100);

  const highlights =
    abnormal.length === 0
      ? []
      : abnormal.slice(0, 6).map((r) => {
          const dir = r.flag === 'low' ? 'Low' : 'High';
          const ref = r.ref ? ` (Ref: ${r.ref})` : '';
          return `${dir}: ${r.label} - ${r.value}${ref}`;
        });

  const body = [
    headline,
    '',
    `What this means (demo): This is a plain-language summary of your lab report. It highlights values that are marked high/low compared to the reference range.`,
    '',
    ...(highlights.length ? ['Abnormal highlights:', ...highlights.map((h) => `- ${h}`), ''] : []),
    `Coverage confidence: ${confidence}% (based on how many rows include numeric values + reference ranges).`,
    '',
    `Important: This is assistive information for a demo and is not medical advice. If you have concerns, contact your provider.`,
  ].join('\n');

  return {
    title: `AI Lab Summary - ${record?.title || 'Report'}`,
    abnormalCount: abnormal.length,
    confidence,
    text: body,
  };
}

/** Symptom / triage intents - before appointments so “feel sick” isn’t mistaken for scheduling only */
function detectSymptomsIntent(t) {
  if (/\b(symptom|symptoms|triage)\b/.test(t)) return true;
  if (/\bsymptom\s*check\b/.test(t)) return true;
  if (/\b(feel sick|feeling ill|not feeling well|unwell|under the weather)\b/.test(t)) return true;
  if (/\b(check my symptoms)\b/.test(t)) return true;
  if (/\b(chest pain|shortness of breath|heart attack|stroke|can\x27t breathe|cannot breathe)\b/.test(t)) return true;
  if (/\b(high fever|severe pain|passed out|lost consciousness|heavy bleeding|uncontrolled bleeding)\b/.test(t))
    return true;
  if (/\b(headache|nausea|cough|fever|dizzy|vomit|ear pain|sinus|uti|allergies|rash|fatigue)\b/.test(t)) return true;
  return false;
}

function detectIntent(t) {
  if (/\b(prescription|medication|refill|pill|pharmacy|drug)\b/.test(t)) return 'prescriptions';
  if (/\b(bill|billing|balance|invoice|payment due|owe|copay|statement|paid)\b/.test(t)) return 'bills';
  if (/\b(message|messages|chat|care team|inbox)\b/.test(t)) return 'messages';
  if (/\b(help|support|faq|how do i|contact)\b/.test(t)) return 'help';
  if (detectSymptomsIntent(t)) return 'symptoms';
  if (
    /\b(appointment|appointments|reschedule)\b/.test(t) ||
    (/\bbook\b/.test(t) && /\bappointment\b/.test(t)) ||
    (/\bschedule\b/.test(t) && /\bvisit\b/.test(t))
  ) {
    return 'appointments';
  }
  if (/\b(report|lab|labs|record|results|imaging|mri|scan|test result)\b/.test(t)) return 'records';
  return null;
}

export function mapRecordsForChat(source = mockRecords) {
  const src = Array.isArray(source) ? source : mockRecords;
  return src.slice(0, 8).map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    category: r.category,
    date: r.date,
    status: r.status,
  }));
}

export function mapPrescriptionsForChat(source = mockRecords) {
  const src = Array.isArray(source) ? source : mockRecords;
  return src
    .filter((r) => r.category === 'prescription' || /prescription/i.test(r.type || ''))
    .map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date,
      status: r.status,
    }));
}

export function getAssistantReply(
  userText,
  { role = 'patient', appointmentsList, billingSnapshot } = {}
) {
  const t = String(userText || '').toLowerCase();
  const apptSource = appointmentsList ?? mockAppointments;
  const billingData = billingSnapshot ?? mockBilling;

  const wantsNewBooking =
    !/\b(cancel|reschedule)\b/.test(t) &&
    (
      /\b(book|schedule)\s+(?:a|an|the\s+)?(?:new\s+)?appointment\b/.test(t) ||
      /\bbook\s+(?:a|an|the\s+)?(?:new\s+)?visit\b/.test(t) ||
      (/\b(book|schedule)\b/.test(t) &&
        /\b(new|another|additional)\b/.test(t) &&
        /\b(visit|appointment)\b/.test(t))
    );
  const bookNewChip = t.includes('book a new appointment');

  if ((wantsNewBooking || bookNewChip) && !/\breschedule\b/.test(t)) {
    return {
      intent: 'appointments_book',
      bookingInline: true,
      page: null,
      hideNavigate: true,
      text: `Let's book a new visit here in chat (demo). I'll guide you: specialty → provider → pick a time → confirm. Your Appointments tab will update after confirmation.`,
      upcomingAppointments: null,
      useLiveAppointments: false,
      suggestions: [],
    };
  }

  const hit = detectIntent(t);

  if (!hit) {
    return {
      intent: 'unknown',
      page: null,
      hideNavigate: false,
      text:
        role === 'patient'
          ? `Tell me what you need - for example labs, billing, booking, prescriptions, or messages. You can use the chips below to start.`
          : `Try asking about records, billing, or appointments.`,
      suggestions: ['Show my latest lab reports', 'Check my symptoms', 'Book a new appointment', 'Explain my latest bill'],
      upcomingAppointments: null,
      useLiveAppointments: false,
    };
  }

  const upcoming = hit === 'appointments' ? getUpcomingAppointmentsList(apptSource) : null;

  if (hit === 'appointments') {
    if (upcoming.length === 0) {
      return {
        intent: 'appointments',
        page: null,
        hideNavigate: true,
        text: `You don't have upcoming visits in this demo list. Use “Book a new appointment” to schedule here in chat, or open the full scheduler below.`,
        upcomingAppointments: [],
        useLiveAppointments: false,
        suggestions: ['Book a new appointment'],
      };
    }
    return {
      intent: 'appointments',
      page: null,
      hideNavigate: true,
      text: `Here are your upcoming appointments. Tap Reschedule to pick a new slot - your Appointments tab updates after you confirm (demo).`,
      upcomingAppointments: upcoming,
      useLiveAppointments: true,
      suggestions: ['Book a new appointment'],
    };
  }

  if (hit === 'records') {
    return {
      intent: 'records',
      page: null,
      hideNavigate: true,
      recordsInline: true,
      text: `Recent reports and results on file (demo). Tap “Explain this report” for a plain-language summary - labs use the same AI summary helper as My Records.`,
      suggestions: [],
    };
  }

  if (hit === 'prescriptions') {
    return {
      intent: 'prescriptions',
      page: null,
      hideNavigate: true,
      prescriptionsInline: true,
      text: `Here are prescription-related entries from your chart (demo). Request a refill to simulate routing to your pharmacy - you'll get a confirmation here.`,
      suggestions: [],
    };
  }

  if (hit === 'bills') {
    return {
      intent: 'bills',
      page: null,
      hideNavigate: true,
      billingInline: true,
      text: `Outstanding balance: $${billingData.currentBalance.toFixed(2)} · Due ${billingData.dueDate}. Review the March statement lines below; pay in full from chat (demo) - Billing updates instantly.`,
      suggestions: [],
    };
  }

  if (hit === 'messages') {
    return {
      intent: 'messages',
      page: null,
      hideNavigate: true,
      messagesInline: true,
      text: `Here are your recent threads (demo). Send a quick reply - we'll simulate delivery and show confirmation here.`,
      suggestions: [],
    };
  }

  if (hit === 'help') {
    return {
      intent: 'help',
      page: null,
      hideNavigate: true,
      helpInline: true,
      text: `Quick answers - tap a question to expand (demo).`,
      suggestions: [],
    };
  }

  if (hit === 'symptoms') {
    return {
      intent: 'symptoms',
      page: 'symptom-check',
      hideNavigate: true,
      symptomInline: true,
      text: [
        'Expanded triage (demo): mild vs moderate vs emergency symptoms - not binary ED routing.',
        'Select symptoms by section (red / amber / green). Combination rules escalate (e.g. vomiting + dehydration). Any emergency symptom triggers immediate ED advisory - no scheduling delay in that path.',
      ].join('\n'),
      suggestions: [],
    };
  }

  return {
    intent: 'unknown',
    page: null,
    hideNavigate: false,
    text: 'How can I help?',
    suggestions: ['Show my latest lab reports', 'Check my symptoms', 'Book a new appointment'],
    upcomingAppointments: null,
    useLiveAppointments: false,
  };
}

/**
 * Plain-language summary for the Trackers page (demo: derived from trend arrays).
 */
export function generateTrackerSummary(bp = [], glucose = [], problems = []) {
  if (!Array.isArray(bp) || !Array.isArray(glucose) || !bp.length || !glucose.length) {
    return {
      confidence: 0,
      text: 'When more blood pressure and glucose readings are available in your tracker, a short summary will appear here.',
      disclaimer: 'Educational preview only. Not medical advice.',
    };
  }

  const firstBp = bp[0];
  const lastBp = bp[bp.length - 1];
  const sysTrend = lastBp.systolic - firstBp.systolic;
  const diaTrend = lastBp.diastolic - firstBp.diastolic;
  const g0 = glucose[0].value;
  const g1 = glucose[glucose.length - 1].value;
  const gTrend = g1 - g0;

  const chunks = [];
  chunks.push(
    `From ${firstBp.label} through ${lastBp.label}, systolic blood pressure moved from ${firstBp.systolic} to ${lastBp.systolic} mmHg, and diastolic from ${firstBp.diastolic} to ${lastBp.diastolic} mmHg.`
  );

  if (sysTrend < 0 && diaTrend <= 0) {
    chunks.push(
      ' Both readings edged slightly lower over this window, which is often what clinicians like to see when watching blood pressure over time.'
    );
  } else if (sysTrend > 2 || diaTrend > 2) {
    chunks.push(
      ' One or both numbers are a bit higher than at the start of the series. If that continues, mention it at your next visit.'
    );
  } else {
    chunks.push(' Values stayed fairly steady across these months.');
  }

  chunks.push(` Fasting glucose went from ${g0} to ${g1} mg/dL.`);
  if (gTrend < -2) {
    chunks.push(' The trend is gently downward.');
  } else if (gTrend > 2) {
    chunks.push(' The latest reading is somewhat higher than earlier points; your team can advise whether repeat labs make sense.');
  } else {
    chunks.push(' Levels look fairly consistent with small month-to-month variation.');
  }

  const focus = Array.isArray(problems) ? problems.slice(0, 3).map((p) => p.name).filter(Boolean) : [];
  if (focus.length) {
    chunks.push(` Your care plan highlights include ${focus.join(', ')}. Use these charts with office visits, not as a substitute for them.`);
  }

  return {
    confidence: 86,
    text: chunks.join(''),
    disclaimer:
      'This summary is generated from demo tracker data for illustration. It is not a diagnosis or treatment plan. Contact your care team with concerns.',
  };
}

/**
 * Plain-language snapshot for My Records → PHR (self-reported lifestyle fields + optional problems).
 */
export function generatePhrSummary(phr = [], problems = []) {
  const rows = Array.isArray(phr) ? phr : [];
  if (!rows.length) {
    return {
      confidence: 0,
      text: 'When PHR fields are saved, a short lifestyle and goals summary will appear here.',
      disclaimer: 'Educational preview only. Not medical advice.',
    };
  }

  const bits = rows.map((r) => {
    const label = r.label || 'Entry';
    const val = r.value ?? '';
    return `${label.toLowerCase()} is recorded as ${val}`;
  });

  const probNames = (Array.isArray(problems) ? problems : [])
    .slice(0, 4)
    .map((p) => p.name)
    .filter(Boolean);

  const chunks = [];
  chunks.push(
    `Your PHR snapshot pulls together how you describe day-to-day habits and preferences: ${bits.join('; ')}.`
  );
  chunks.push(
    ' These entries give clinicians lifestyle context next to labs and visits, especially when values change.'
  );
  if (probNames.length) {
    chunks.push(
      ` Together with problem list items such as ${probNames.join(', ')}, keeping PHR data current makes education and medication counseling more relevant.`
    );
  } else {
    chunks.push(' Updating this section after major life changes keeps your record useful between visits.');
  }

  return {
    confidence: 84,
    text: chunks.join(''),
    disclaimer:
      'PHR content is self-reported in this demo. It does not replace vitals or diagnoses documented elsewhere in your chart.',
  };
}

/**
 * High-level narrative over operational audit rows (admin Activity Center).
 */
export function generateAuditTrailSummary(logs = []) {
  const list = Array.isArray(logs) ? logs : [];
  if (!list.length) {
    return {
      confidence: 0,
      text: 'When audit events are recorded, a short narrative summary will appear here.',
      disclaimer: 'Demo narrative only. Does not replace formal compliance reporting.',
    };
  }

  const total = list.length;
  const failed = list.filter((l) => l.outcome === 'Failed').length;
  const success = list.filter((l) => l.outcome === 'Success').length;

  const byModule = {};
  const byAction = {};
  list.forEach((l) => {
    const m = l.module || 'Other';
    byModule[m] = (byModule[m] || 0) + 1;
    const a = l.action || 'Unknown';
    byAction[a] = (byAction[a] || 0) + 1;
  });

  const topModules = Object.entries(byModule)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const topActions = Object.entries(byAction)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const roles = {};
  list.forEach((l) => {
    const r = l.role || '--';
    roles[r] = (roles[r] || 0) + 1;
  });
  const privileged = (roles.admin || 0) + (roles.staff || 0) + (roles.doctor || 0);

  const parts = [];
  parts.push(
    `This trail lists ${total} recent events: ${success} completed successfully and ${failed} failed.`
  );
  if (failed > 0) {
    parts.push(' Failed sign-ins or blocked actions are worth reviewing even in a demo environment.');
  }
  parts.push(
    ` Activity concentrates in ${topModules.map(([name, n]) => `${name} (${n})`).join(', ')}.`
  );
  parts.push(` Frequent actions include ${topActions.map(([name, n]) => `${name} (${n}×)`).join(' and ')}.`);
  if (privileged >= total * 0.45) {
    parts.push(' Much of the volume comes from admin, staff, or clinician roles, which is typical for operational monitoring.');
  }
  parts.push(' Use the filters below to narrow by user, module, or outcome.');

  return {
    confidence: 78,
    text: parts.join(''),
    disclaimer:
      'This overview is generated from the visible audit table for demonstration. It is not a certification or legal attestation.',
  };
}

/**
 * Patient-facing narrative over “who accessed my chart” style rows (demo).
 */
export function generatePatientAccessLogSummary(logs = []) {
  const list = Array.isArray(logs) ? logs : [];
  if (!list.length) {
    return {
      confidence: 0,
      text: 'When access history is available, a short summary will appear here.',
      disclaimer: 'Demo preview only.',
    };
  }

  const n = list.length;
  const byDoc = {};
  const byChannel = { mobile: 0, web: 0, other: 0 };
  list.forEach((row) => {
    const d = row.document || 'Record';
    byDoc[d] = (byDoc[d] || 0) + 1;
    const ch = row.channel === 'mobile' ? 'mobile' : row.channel === 'web' ? 'web' : 'other';
    byChannel[ch] += 1;
  });
  const topDocs = Object.entries(byDoc)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, c]) => `${name} (${c})`);

  const mobileHeavy = byChannel.mobile >= byChannel.web;
  const parts = [];
  parts.push(`This list shows ${n} recent access events tied to your account.`);
  parts.push(` Document types include ${topDocs.join(', ')}.`);
  if (mobileHeavy && byChannel.mobile > 0) {
    parts.push(' Several views came from a mobile session, which is common when clinicians check charts between visits.');
  } else if (byChannel.web > 0) {
    parts.push(' Most entries line up with desktop or browser access during clinic hours.');
  }
  parts.push(' If something looks unfamiliar, contact your clinic privacy office with the timestamp.');

  return {
    confidence: 81,
    text: parts.join(''),
    disclaimer:
      'This summary is derived from demo access rows. It does not prove legal disclosure and may not include every system.',
  };
}

/** Patient-facing explainer for UDS monitoring — no detailed results (demo). */
export function generateUdsMonitoringSummary(labStatus) {
  const latest = labStatus?.latest;
  if (!latest) {
    return {
      confidence: 0,
      text: 'No screening information is available to summarize.',
      disclaimer: 'Demo preview only — not a medical record.',
    };
  }

  const parts = [
    `Your most recent ${latest.type.toLowerCase()} was collected on ${latest.collected}.`,
    ` Its current status is “${latest.status}.”`,
    ` At BHG, urine drug screens support your treatment plan and are reviewed privately with ${latest.reviewWith || 'your counselor'}.`,
    ` Detailed results are not shown in the patient portal; ${latest.reviewWhen ? `your next planned review is ${latest.reviewWhen}.` : 'your care team will schedule a private review.'}`,
    ' If you have questions before then, use secure messages or speak with the clinic during medication hours.',
  ];

  return {
    confidence: 86,
    text: parts.join(''),
    disclaimer:
      'This AI summary explains how treatment monitoring works in plain language. It does not display lab results and is not medical advice.',
  };
}

/** Patient-facing plain-language summary of a completed counseling visit (demo). */
export function generateCounselingSessionSummary(appointment) {
  const notes = appointment?.sessionNotes;
  if (!notes) {
    return {
      confidence: 0,
      text: 'No counseling session notes are available to summarize for this visit.',
      disclaimer: 'Demo preview only — not a medical record.',
    };
  }

  const parts = [];
  parts.push(
    `Your ${appointment.title} with ${appointment.provider} on ${appointment.date} focused on ${notes.focus}.`
  );
  if (notes.discussed?.length) {
    parts.push(` During the visit you discussed: ${notes.discussed.join('; ')}.`);
  }
  if (notes.nextSteps) {
    parts.push(` Recommended next steps: ${notes.nextSteps}`);
  }
  if (notes.patientSummary) {
    parts.push(` ${notes.patientSummary}`);
  }

  const followUps = appointment?.aiDemo
    ? [
        {
          id: 'message',
          label: 'Message your counselor',
          detail: 'Send a secure follow-up about take-home routines or coping strategies.',
          page: 'messages',
        },
        {
          id: 'goals',
          label: 'Review recovery goals',
          detail: 'Check progress on counseling attendance and recovery supports.',
          page: 'progress',
        },
      ]
    : [];

  return {
    confidence: 88,
    text: parts.join(''),
    disclaimer:
      'This AI summary helps you understand your visit in plain language. It is not a legal medical record and does not replace speaking with your counselor or provider.',
    followUps,
  };
}

/** Help FAQ payload for chat UI */
export function getHelpTopicsForChat() {
  return helpCategories.slice(0, 4).map((c) => ({
    id: c.id,
    title: c.title,
    faqs: (c.faqs || []).slice(0, 3),
  }));
}

/** Message threads preview for chat UI */
export function getMessageThreadsForChat() {
  return mockConversations.map((c) => ({
    id: c.id,
    with: c.with,
    role: c.role,
    preview: c.lastMessage,
    lastTime: c.lastTime,
  }));
}

