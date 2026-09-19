export const patient = {
  id: 'BHG-20481',
  name: 'Jordan Williams',
  firstName: 'Jordan',
  initials: 'JW',
  pronouns: 'they/them',
  dateOfBirth: 'June 18, 1988',
  phone: '(865) 555-0184',
  email: 'patient@demo.com',
  address: '418 Cedar Ridge Drive, Knoxville, TN 37918',
  preferredContact: 'Text message',
  language: 'English',
  enrolledSince: 'March 14, 2026',
  daysInTreatment: 184,
};

export const center = {
  name: 'BHG Knoxville Treatment Center',
  shortName: 'BHG Knoxville',
  address: '626 Bernard Avenue, Knoxville, TN 37921',
  phone: '(865) 522-0161',
  timezone: 'Eastern Time',
  todayHours: '5:30 AM – 12:30 PM',
  counselingHours: '6:00 AM – 4:00 PM',
  medicationWindow: '5:30 AM – 11:30 AM',
  status: 'Open',
  directions: 'Enter through the patient entrance on Bernard Avenue. Free parking is available.',
  holidayNotice: 'No holiday schedule changes this week.',
  mapsUrl: 'https://maps.app.goo.gl/bfS2XQkWKiNJ6M61A',
};

export function getCenterMapsUrl(centerData = center) {
  return centerData.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centerData.address)}`;
}

export const careTeam = [
  {
    id: 'ct-1',
    name: 'Alicia Monroe',
    initials: 'AM',
    role: 'Primary Counselor',
    detail: 'Individual counseling and treatment planning',
    nextAvailable: 'Today until 4:00 PM',
  },
  {
    id: 'ct-2',
    name: 'Dr. Marcus Hill',
    initials: 'MH',
    role: 'Medical Provider',
    detail: 'Medication orders and clinical care',
    nextAvailable: 'Provider visits by appointment',
  },
  {
    id: 'ct-3',
    name: 'Danielle Brooks',
    initials: 'DB',
    role: 'Patient Financial Counselor',
    detail: 'Coverage, payments, and assistance programs',
    nextAvailable: 'Weekdays until 3:30 PM',
  },
];

export const treatment = {
  program: 'Methadone Maintenance Treatment (MMT)',
  programShort: 'MMT',
  status: 'Active',
  phase: 'Stabilization',
  phaseSummary:
    'Your care team is focused on consistent medication visits, counseling engagement, and safe take-home stability before your next formal plan review.',
  medication: 'Methadone',
  currentOrder: '90 mg',
  orderUpdated: 'September 3, 2026',
  prescriber: 'Dr. Marcus Hill',
  visitStatus: 'Ready for today',
  visitStatusDetail: 'No action is required before your medication visit.',
  takeHomeStatus: '2 approved take-home days',
  takeHomeDetail: 'Tuesday and Wednesday. Clinic visits are Monday and Saturday this week.',
  nextReview: 'October 2, 2026',
  lastPlanUpdate: 'September 3, 2026',
  lastPlanFocus: 'Recovery supports, take-home plan, and counseling goals reviewed with Alicia Monroe.',
  authorization: 'Active through December 31, 2026',
  payer: 'TennCare Demo Plan',
  safetyNote:
    'Take medication exactly as directed. Contact your treatment center before changing how you take it.',
};

export const weeklySchedule = [
  { date: 'Mon, Sep 14', day: 'Monday', type: 'Observed medication visit', time: 'Before 11:30 AM', status: 'Due today', active: true },
  { date: 'Tue, Sep 15', day: 'Tuesday', type: 'Approved take-home day', time: 'Follow care plan', status: 'Take-home' },
  { date: 'Wed, Sep 16', day: 'Wednesday', type: 'Approved take-home day', time: 'Follow care plan', status: 'Take-home' },
  { date: 'Sat, Sep 19', day: 'Saturday', type: 'Observed medication visit', time: '6:00-9:00 AM', status: 'Upcoming' },
];

export const sharedCounselingSessionNotes = {
  focus: 'Recovery supports and updated treatment plan',
  discussed: [
    'Progress toward counseling attendance goals',
    'Take-home medication routine for Tuesday and Wednesday',
    'Clinic visits on Monday and Saturday',
    'Coping strategies for stressful weeks',
  ],
  nextSteps: 'Continue individual counseling twice monthly and discuss UDS results at your next visit.',
  patientSummary:
    'You and Alicia reviewed recovery supports, take-home routines, and updated goals. No crisis concerns were discussed.',
};

export const appointments = [
  {
    id: 'APT-1042',
    date: 'September 17, 2026',
    dateShort: 'SEP 17',
    time: '10:30 AM',
    title: 'Individual Counseling',
    provider: 'Alicia Monroe',
    location: 'BHG Knoxville · Room 4',
    modality: 'In person',
    timing: 'upcoming',
    status: 'Upcoming',
    duration: '50 minutes',
    preparation: 'Please arrive 10 minutes early.',
  },
  {
    id: 'APT-1088',
    date: 'September 24, 2026',
    dateShort: 'SEP 24',
    time: '2:00 PM',
    title: 'Recovery Skills Group',
    provider: 'Alicia Monroe',
    location: 'Secure Zoom visit',
    modality: 'Telehealth',
    timing: 'upcoming',
    status: 'Upcoming',
    duration: '60 minutes',
    preparation: 'Join from a private location in Tennessee.',
  },
  {
    id: 'APT-1104',
    date: 'October 2, 2026',
    dateShort: 'OCT 02',
    time: '8:15 AM',
    title: 'Medication Plan Review',
    provider: 'Dr. Marcus Hill',
    location: 'BHG Knoxville · Clinical Office',
    modality: 'In person',
    timing: 'upcoming',
    status: 'Upcoming',
    duration: '20 minutes',
    preparation: 'Bring questions about your current treatment plan.',
  },
  {
    id: 'APT-1120',
    date: 'October 15, 2026',
    dateShort: 'OCT 15',
    time: '10:30 AM',
    title: 'Individual Counseling',
    provider: 'Alicia Monroe',
    location: 'BHG Knoxville · Room 4',
    modality: 'In person',
    timing: 'upcoming',
    status: 'Upcoming',
    duration: '50 minutes',
    preparation: 'Routine bi-weekly counseling and recovery goal review.',
  },
  {
    id: 'APT-1031',
    date: 'September 3, 2026',
    dateShort: 'SEP 03',
    time: '10:30 AM',
    title: 'Individual Counseling',
    provider: 'Alicia Monroe',
    location: 'BHG Knoxville · Room 4',
    modality: 'In person',
    timing: 'past',
    status: 'Completed',
    duration: '50 minutes',
    preparation: 'Session completed.',
    sessionNotes: sharedCounselingSessionNotes,
    aiDemo: true,
  },
  {
    id: 'APT-1018',
    date: 'August 20, 2026',
    dateShort: 'AUG 20',
    time: '2:00 PM',
    title: 'Recovery Skills Group',
    provider: 'Alicia Monroe',
    location: 'BHG Knoxville · Group Room A',
    modality: 'In person',
    timing: 'past',
    status: 'Completed',
    duration: '60 minutes',
    preparation: 'Session completed.',
    sessionNotes: sharedCounselingSessionNotes,
    aiDemo: true,
  },
  {
    id: 'APT-1006',
    date: 'August 7, 2026',
    dateShort: 'AUG 07',
    time: '8:30 AM',
    title: 'Take-Home Medication Review',
    provider: 'Dr. Marcus Hill',
    location: 'BHG Knoxville · Clinical Office',
    modality: 'In person',
    timing: 'past',
    status: 'Completed',
    duration: '20 minutes',
    preparation: 'Visit completed.',
    visitSummary:
      'Take-home privileges were reviewed and Tuesday and Wednesday were approved. Continue clinic visits on Monday and Saturday.',
  },
];

export const counseling = {
  counselor: careTeam[0],
  nextSession: appointments[0],
  plan: 'Individual counseling twice monthly and recovery skills group monthly',
  lastSession: {
    date: 'September 3, 2026',
    type: 'Individual Counseling',
    focus: 'Reviewed recovery supports and updated the treatment plan.',
  },
  upcomingTopics: [
    'Recovery support and coping strategies',
    'Progress toward current treatment goals',
    'Recent UDS review with your counselor',
  ],
};

export const labStatus = {
  stats: {
    screensThisYear: 6,
    complianceLabel: 'On track',
    lastReviewed: 'August 20, 2026',
    nextWindow: 'Clinic-scheduled',
  },
  latest: {
    id: 'UDS-0926',
    collected: 'September 8, 2026',
    collectedShort: 'SEP 08',
    type: 'Routine urine drug screen',
    status: 'Ready to review',
    detail:
      'Your counselor will review this result privately at your next counseling visit. Detailed results are not shown here.',
    collectionSite: 'BHG Knoxville · Specimen collection window',
    reviewWith: 'Alicia Monroe',
    reviewWhen: 'September 17, 2026 · Individual Counseling',
  },
  workflow: [
    { step: 'Collected', status: 'done', detail: 'Specimen collected during your clinic visit on September 8.' },
    { step: 'Lab processing', status: 'done', detail: 'Sent to the treatment monitoring lab — processing complete.' },
    { step: 'Ready for review', status: 'current', detail: 'Waiting for a private review with your counselor.' },
    { step: 'Reviewed with you', status: 'pending', detail: 'Planned at your September 17 counseling session.' },
  ],
  nextExpected: 'Next screen scheduled according to your MMT care plan',
  privacy:
    'Detailed results are discussed with your care team. They are not shown on the dashboard to protect your privacy.',
  privacyPoints: [
    'Portal status shows collection and review progress — not detailed lab values.',
    'Counselors and providers discuss results in person or during a private session.',
    'Random screens may occur as part of standard outpatient treatment monitoring.',
  ],
  whatToExpect: [
    'Collection is usually quick during a medication or clinic visit.',
    'Results are reviewed supportively with your counselor — not posted online.',
    'If any follow-up is needed, your care team will explain next steps clearly.',
  ],
  history: [
    {
      id: 'UDS-0926',
      date: 'September 8, 2026',
      dateShort: 'SEP 08',
      type: 'Routine UDS',
      panelName: '8-Panel OTP Monitoring Panel',
      status: 'Ready to review',
      collection: 'Clinic visit',
      collectionSite: 'BHG Knoxville · Specimen Window',
      reviewedBy: null,
      reviewedDate: null,
      reviewPlan: 'Scheduled for private 1-on-1 review with Alicia Monroe during your next individual counseling visit on September 17, 2026.',
      privacyNote: 'Protected under 42 CFR Part 2 federal regulations. Detailed results are discussed privately with your clinical care team.',
    },
    {
      id: 'UDS-0820',
      date: 'August 20, 2026',
      dateShort: 'AUG 20',
      type: 'Routine UDS',
      panelName: '8-Panel OTP Monitoring Panel',
      status: 'Reviewed',
      collection: 'Clinic visit',
      collectionSite: 'BHG Knoxville · Specimen Window',
      reviewedBy: 'Alicia Monroe',
      reviewedDate: 'August 20, 2026',
      reviewPlan: 'Reviewed and discussed during individual counseling session. Treatment plan confirmed and take-home schedule maintained.',
      privacyNote: 'Protected under 42 CFR Part 2 federal regulations. Discussion recorded in clinical care plan notes.',
    },
    {
      id: 'UDS-0729',
      date: 'July 29, 2026',
      dateShort: 'JUL 29',
      type: 'Routine UDS',
      panelName: '8-Panel OTP Monitoring Panel',
      status: 'Reviewed',
      collection: 'Clinic visit',
      collectionSite: 'BHG Knoxville · Specimen Window',
      reviewedBy: 'Alicia Monroe',
      reviewedDate: 'July 31, 2026',
      reviewPlan: 'Reviewed during monthly treatment progress review. Phase status verified and active.',
      privacyNote: 'Protected under 42 CFR Part 2 federal regulations.',
    },
    {
      id: 'UDS-0708',
      date: 'July 8, 2026',
      dateShort: 'JUL 08',
      type: 'Random UDS',
      panelName: 'Random OTP Compliance Screening',
      status: 'Reviewed',
      collection: 'Same-day clinic',
      collectionSite: 'BHG Knoxville · Specimen Window',
      reviewedBy: 'Alicia Monroe',
      reviewedDate: 'July 10, 2026',
      reviewPlan: 'Reviewed following random compliance screening protocol. Care team confirmed compliance.',
      privacyNote: 'Protected under 42 CFR Part 2 federal regulations.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Hold / Visit Status  (maps to tbl_CHECKIN.ciHOLD + clinic rules)
// status: 'clear' | 'hold' | 'action-needed'
// ─────────────────────────────────────────────────────────────────────────────
export const visitHoldStatus = {
  status: 'clear',                          // 'clear' | 'hold' | 'action-needed'
  label: 'Ready for today',
  detail: 'No holds are active on your account. You may proceed to the medication window during the posted hours.',
  windowTime: '5:30 – 11:30 AM',
  windowLabel: 'Medication window',
  checkedAt: 'Today · 6:00 AM',
  holds: [],                                // empty = no active holds
  // To demo a hold, swap the block below in:
  // status: 'hold',
  // label: 'Account hold — contact center',
  // detail: 'There is an item on your account that must be resolved before your next medication visit. Please call or visit BHG Knoxville before arriving at the window.',
  // holds: [
  //   { type: 'Counseling compliance', detail: 'A required counseling session is overdue. Contact Alicia Monroe to schedule.', severity: 'high' },
  // ],
  history: [
    { date: 'Sep 14', status: 'clear',  label: 'Ready' },
    { date: 'Sep 13', status: 'clear',  label: 'Ready' },
    { date: 'Sep 12', status: 'clear',  label: 'Ready' },
    { date: 'Sep 11', status: 'clear',  label: 'Ready' },
    { date: 'Sep 10', status: 'clear',  label: 'Ready' },
    { date: 'Sep 9',  status: 'clear',  label: 'Ready' },
    { date: 'Sep 8',  status: 'hold',   label: 'Hold — resolved' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Take-Home Earned Status  (maps to tbl_Orders Sunday–Saturday, tbl_TakeHomeRiskAssessment)
// ─────────────────────────────────────────────────────────────────────────────
export const takeHomeDetail = {
  approvedDays: 2,
  maxDays: 6,                               // DEA phase maximum (stabilization phase)
  days: [
    { day: 'Mon', label: 'Monday',    status: 'observed' },
    { day: 'Tue', label: 'Tuesday',   status: 'approved' },
    { day: 'Wed', label: 'Wednesday', status: 'approved' },
    { day: 'Sat', label: 'Saturday',  status: 'observed' },
  ],
  lastAssessment: 'August 7, 2026',
  nextAssessment: 'October 2, 2026',
  assessedBy: 'Dr. Marcus Hill',
  agreement: 'Take-Home Medication Agreement signed August 7, 2026',
  phase: 'Stabilization',
  phaseSummary: 'Your current weekly schedule is Monday and Saturday clinic visits, with Tuesday and Wednesday take-home days.',
  // What earns / reduces take-home days — grounded in MMT program rules
  earningFactors: [
    { label: 'Medication visit consistency',  met: true,  detail: '91% on-time this period' },
    { label: 'Counseling attendance',         met: true,  detail: '4 of last 5 sessions attended' },
    { label: 'UDS monitoring compliance',     met: true,  detail: 'All screens completed as scheduled' },
    { label: 'No positive UDS for diversion', met: true,  detail: 'Consistent results last 60 days' },
    { label: 'Balance current',               met: false, detail: '$45 balance due September 28' },
  ],
  riskLevel: 'Low',
  diversion: 'No diversion concerns on file',
  safeguardNote: 'Take-home medications must be stored securely and taken only as directed. Contact the center before any changes.',
};

export const requiredActions = [
  {
    id: 'action-takehome',
    title: 'Review take-home day schedule',
    detail: 'Tuesday and Wednesday are approved take-home days. Clinic visits are Monday and Saturday.',
    due: 'This week',
    page: 'medication',
    priority: 'normal',
  },
  {
    id: 'action-uds',
    title: 'Review your recent UDS',
    detail: 'Discuss the September 8 result privately at your counseling visit.',
    due: 'September 17',
    page: 'labs',
    priority: 'normal',
  },
  {
    id: 'action-counseling',
    title: 'Prepare for individual counseling',
    detail: 'Session with Alicia Monroe on September 17 at 10:30 AM — arrive 10 minutes early.',
    due: 'September 17',
    page: 'appointments',
    priority: 'normal',
  },
  {
    id: 'action-telehealth',
    title: 'Confirm telehealth setup for group',
    detail: 'Recovery skills group on September 24 — join from a private location in Tennessee.',
    due: 'September 24',
    page: 'appointments',
    priority: 'normal',
  },
  {
    id: 'action-consent',
    title: 'Confirm communication consent',
    detail: 'Review your text and voicemail preferences with the center.',
    due: 'September 30',
    page: 'documents',
    priority: 'normal',
  },
  {
    id: 'action-plan-review',
    title: 'Prepare for care-plan review',
    detail: 'Medication plan review with Dr. Marcus Hill on October 2 — note any questions for your provider.',
    due: 'October 2',
    page: 'treatment',
    priority: 'normal',
  },
];

export const messages = [
  {
    id: 'MSG-301',
    from: 'Alicia Monroe',
    role: 'Primary Counselor',
    subject: 'Thursday counseling visit',
    preview: 'Hi Jordan, I’m looking forward to seeing you Thursday at 10:30 AM.',
    time: 'Today · 8:12 AM',
    unread: true,
  },
  {
    id: 'MSG-298',
    from: 'BHG Knoxville',
    role: 'Treatment Center',
    subject: 'Weekly center hours',
    preview: 'Our medication window hours are unchanged this week.',
    time: 'Yesterday · 2:45 PM',
    unread: true,
  },
  {
    id: 'MSG-287',
    from: 'Danielle Brooks',
    role: 'Patient Financial Counselor',
    subject: 'Coverage confirmed',
    preview: 'Your coverage is active. No action is needed at this time.',
    time: 'Sep 10 · 11:20 AM',
    unread: false,
  },
];

export const coverage = {
  payer: 'TennCare Demo Plan',
  planType: 'Medicaid Managed Care',
  memberId: 'TN-DEMO-48021',
  status: 'Active',
  verified: 'September 10, 2026',
  authorization: 'Active through December 31, 2026',
  authorizationId: 'AUTH-KNX-20481',
  groupNumber: 'TN-MCO-MMT-2026',
  balance: 45,
  dueDate: 'September 28, 2026',
  nextPayment: '$45.00 due September 28',
  balanceStatus: 'Payment due',
  lastPayment: { amount: 30, date: 'August 5, 2026', method: 'Debit card · ending 4821' },
  summary: {
    totalBilledYtd: 2840,
    insurancePaidYtd: 2765,
    patientShareYtd: 75,
    claimsYtd: 18,
    openClaims: 1,
  },
  assistance:
    'If your coverage changes or payment is difficult, speak with the patient financial counselor before your next visit. Treatment assistance may be available.',
  claims: [
    {
      id: 'CLM-89014',
      date: 'September 12, 2026',
      service: 'MMT observed medication visit',
      provider: 'BHG Knoxville',
      billed: 42,
      insurancePaid: 27,
      patientOwes: 15,
      status: 'Processing',
      detail: 'Claim submitted to TennCare. Patient responsibility will finalize after payer review.',
    },
    {
      id: 'CLM-88902',
      date: 'September 8, 2026',
      service: 'Individual counseling · 50 min',
      provider: 'Alicia Monroe',
      billed: 165,
      insurancePaid: 165,
      patientOwes: 0,
      status: 'Paid',
      detail: 'Paid in full by TennCare Demo Plan. No patient balance for this visit.',
    },
    {
      id: 'CLM-88741',
      date: 'September 3, 2026',
      service: 'Routine UDS · collection',
      provider: 'BHG Knoxville Lab',
      billed: 95,
      insurancePaid: 80,
      patientOwes: 15,
      status: 'Paid',
      detail: 'Standard treatment monitoring service. Your share was applied to the August statement.',
    },
    {
      id: 'CLM-88510',
      date: 'August 28, 2026',
      service: 'MMT observed medication visit',
      provider: 'BHG Knoxville',
      billed: 42,
      insurancePaid: 42,
      patientOwes: 0,
      status: 'Paid',
      detail: 'Medication visit covered under active MMT authorization.',
    },
    {
      id: 'CLM-88388',
      date: 'August 20, 2026',
      service: 'Recovery skills group · 60 min',
      provider: 'Alicia Monroe',
      billed: 120,
      insurancePaid: 120,
      patientOwes: 0,
      status: 'Paid',
      detail: 'Group counseling service paid by plan.',
    },
  ],
  paymentHistory: [
    {
      id: 'PAY-301',
      date: 'August 5, 2026',
      amount: 30,
      method: 'Debit card',
      status: 'Posted',
      detail: 'August patient responsibility · receipt emailed',
    },
    {
      id: 'PAY-278',
      date: 'July 8, 2026',
      amount: 30,
      method: 'Debit card',
      status: 'Posted',
      detail: 'July patient responsibility',
    },
    {
      id: 'PAY-251',
      date: 'June 4, 2026',
      amount: 15,
      method: 'Credit card',
      status: 'Posted',
      detail: 'UDS patient share',
    },
  ],
  statements: [
    {
      id: 'STM-0926',
      period: 'September 2026',
      issued: 'September 10, 2026',
      due: 'September 28, 2026',
      balance: 45,
      status: 'Open',
    },
    {
      id: 'STM-0826',
      period: 'August 2026',
      issued: 'August 8, 2026',
      due: 'August 26, 2026',
      balance: 0,
      status: 'Paid',
    },
    {
      id: 'STM-0726',
      period: 'July 2026',
      issued: 'July 9, 2026',
      due: 'July 27, 2026',
      balance: 0,
      status: 'Paid',
    },
  ],
};

export const documents = [
  { id: 'DOC-1', name: 'Patient Rights and Responsibilities', category: 'Program', date: 'March 14, 2026', status: 'Signed' },
  { id: 'DOC-2', name: 'Consent for Treatment', category: 'Consent', date: 'March 14, 2026', status: 'Signed' },
  { id: 'DOC-3', name: '42 CFR Part 2 Privacy Notice & Protections', category: 'Privacy', date: 'March 14, 2026', status: 'Acknowledged' },
  { id: 'DOC-4', name: 'Communication Preferences', category: 'Consent', date: 'March 14, 2026', status: 'Review due' },
  { id: 'DOC-5', name: 'Take-Home Medication Agreement', category: 'Medication', date: 'August 7, 2026', status: 'Signed' },
  { id: 'DOC-6', name: 'Official Treatment Enrollment Verification Letter', category: 'Verification', date: 'September 16, 2026', status: 'Certified', isLetter: true },
];

export const progress = {
  enrolledDays: 184,
  attendanceRate: 91,
  counselingSessions: 12,
  completedGoals: 3,
  lastReview: 'September 3, 2026',
  nextReview: 'October 2, 2026',
  counselor: 'Alicia Monroe',
  summary:
    'You are making steady progress in stabilization. Your care team sees strong medication-visit consistency and improving counseling engagement. The focus now is recovery supports and maintaining take-home stability.',
  currentGoals: [
    { title: 'Attend scheduled counseling visits', progress: 80, note: '4 of the last 5 completed', focus: 'Counseling engagement' },
    { title: 'Build a weekly recovery-support routine', progress: 65, note: 'Plan reviewed September 3', focus: 'Recovery supports' },
    { title: 'Maintain medication-visit consistency', progress: 92, note: 'Strong consistency this month', focus: 'Medication visits' },
  ],
  engagementAreas: [
    {
      title: 'Medication visits',
      metric: '92% on-time',
      progress: 92,
      note: 'Observed visits completed consistently this month.',
      page: 'medication',
    },
    {
      title: 'Counseling',
      metric: '12 sessions',
      progress: 80,
      note: 'Individual and group sessions on track with your plan.',
      page: 'appointments',
    },
    {
      title: 'Treatment monitoring',
      metric: 'On track',
      progress: 86,
      note: 'UDS collection and private review aligned with care plan.',
      page: 'labs',
    },
    {
      title: 'Take-home stability',
      metric: '2 days/week',
      progress: 88,
      note: 'Tuesday and Wednesday take-home days; Monday and Saturday clinic visits.',
      page: 'treatment',
    },
  ],
  completedGoalsList: [
    { title: 'Complete intake and orientation', completedDate: 'March 21, 2026', note: 'Program orientation and initial assessment finished.' },
    { title: 'Establish daily medication routine', completedDate: 'May 30, 2026', note: 'Consistent observed visits for 60 days.' },
    { title: 'Attend first recovery skills group', completedDate: 'July 12, 2026', note: 'Group participation documented with counselor.' },
  ],
  milestones: [
    { date: 'September 3, 2026', title: 'Treatment plan updated', detail: 'Goals reviewed with Alicia Monroe.' },
    { date: 'August 7, 2026', title: 'Take-home plan reviewed', detail: 'Tuesday and Wednesday take-home days approved under the current care plan.' },
    { date: 'June 14, 2026', title: '90 days in treatment', detail: 'Stabilization milestone reached. Recovery progress reviewed with care team.' },
    { date: 'March 14, 2026', title: 'Treatment started', detail: 'Enrollment completed and induction phase started at BHG Knoxville.' },
  ],
};

export const notifications = [
  {
    id: 'N-0',
    category: 'Appointments',
    title: '⏰ Check-In Reminder: Counseling Visit at 10:30 AM Today',
    detail: 'Your individual counseling session with Alicia Monroe, LPC is today Sep 17 at 10:30 AM in Room 204. Please check in at the front desk by 9:30 AM.',
    time: 'Today, 9:30 AM',
    unread: true,
    page: 'appointments',
    iconType: 'calendar',
  },
  {

    id: 'N-1',
    category: 'Appointments',
    title: 'Counseling Session Confirmed: Sep 17, 2026',
    detail: 'Individual counseling visit with Alicia Monroe, LPC in Room 204 at 10:30 AM is confirmed. Arrive 10 minutes early.',
    time: 'Yesterday, 4:15 PM',
    unread: true,
    page: 'appointments',
    iconType: 'calendar',
  },
  {
    id: 'N-2',
    category: 'Reports',
    title: 'Routine UDS Screening Results Ready',
    detail: 'Your UDS-9102 screening report from Quest Diagnostics is on file. Methadone compliance confirmed and non-prescribed substances negative.',
    time: 'Sep 10, 9:00 AM',
    unread: true,
    page: 'records',
    iconType: 'lab',
  },
  {
    id: 'N-3',
    category: 'Messages',
    title: 'New Message from Primary Counselor',
    detail: 'Alicia Monroe has sent you a follow-up message regarding your coping skills routine and next phase take-home review.',
    time: 'Sep 12, 8:00 AM',
    unread: false,
    page: 'messages',
    iconType: 'message',
  },
  {
    id: 'N-4',
    category: 'Billing',
    title: 'TennCare Coverage Pre-Authorization Approved',
    detail: 'TennCare Demo Plan has approved MAT benefits re-verification through December 31, 2026. Patient copay: $0.00.',
    time: 'Sep 8, 2:00 PM',
    unread: false,
    page: 'payments',
    iconType: 'billing',
  },
  {
    id: 'N-5',
    category: 'System',
    title: 'Consent Forms & 42 CFR Part 2 Ready to Review',
    detail: 'Your annual confidentiality and federal treatment disclosure forms are on file and available to view in Forms & Documents.',
    time: 'Sep 5, 10:00 AM',
    unread: false,
    page: 'documents',
    iconType: 'document',
  },
  {
    id: 'N-6',
    category: 'Appointments',
    title: 'Observed Medication Window Due Today',
    detail: 'Today is an observed clinic dosing day at BHG Knoxville. Please arrive before the morning medication window closes at 11:30 AM.',
    time: 'Today, 6:30 AM',
    unread: false,
    page: 'medication',
    iconType: 'pill',
  },
];

export const recoveryResources = [
  { title: '24/7 Crisis Support', detail: 'Call or text 988 for immediate crisis support.', action: 'Call 988', href: 'tel:988' },
  { title: 'BHG Knoxville', detail: 'Questions about treatment, visits, or medication.', action: '(865) 522-0161', href: 'tel:+18655220161' },
  { title: 'Emergency', detail: 'Call 911 or go to the nearest emergency department.', action: 'Call 911', href: 'tel:911' },
];

export const supportFaqs = [
  {
    id: 'medication',
    title: 'Medication & clinic visits',
    description: 'Observed visits, take-home days, and medication windows.',
    faqs: [
      {
        q: 'What are observed medication visits?',
        a: 'On observed days you take your medication at the clinic during the posted medication window. Your schedule is set by your care team based on your treatment phase and care plan.',
      },
      {
        q: 'How do take-home days work?',
        a: 'When approved, you may take medication at home on specific days shown in your Medication Schedule. Do not change how you take medication without speaking to the center first.',
      },
      {
        q: 'What if I miss a medication visit?',
        a: 'Call BHG Knoxville before changing your routine. Missed visits may affect your care plan and should be discussed with the clinic as soon as possible.',
      },
      {
        q: 'Can I dose at another clinic if I am traveling or moving?',
        a: 'Yes. BHG operates 115+ clinics nationwide. You can request temporary courtesy guest dosing for travel or a permanent center transfer directly under Treatment Center. Our care coordinators will transmit your active Phase 2 dosing schedule and medical records directly to the receiving clinic so you never miss a dose.',
      },
      {
        q: 'Can I change my medication dose in the portal?',
        a: 'No. Medication changes are made only by your prescriber after a clinical review. Use secure messages or call the center for non-urgent questions.',
      },
    ],
  },
  {
    id: 'counseling',
    title: 'Counseling & appointments',
    description: 'Required services, scheduling, and session notes.',
    faqs: [
      {
        q: 'Can I book counseling appointments online?',
        a: 'No. Counseling and provider visits are arranged by BHG staff. You can view upcoming visits and request a change when the portal allows.',
      },
      {
        q: 'Where are my counseling session notes?',
        a: 'Patient-facing summaries appear on completed counseling appointments after your visit. Detailed counselor documentation stays in your clinical record.',
      },
      {
        q: 'How do I request an appointment change?',
        a: 'Open Appointments, choose a visit, and select Request a change. The scheduling team will review and confirm any update.',
      },
      {
        q: 'What is telehealth counseling?',
        a: 'Some group or individual sessions may be offered by secure video. Join from a private location in Tennessee and follow the preparation notes on your appointment.',
      },
    ],
  },
  {
    id: 'labs',
    title: 'Lab & UDS',
    description: 'Treatment monitoring and result privacy.',
    faqs: [
      {
        q: 'Why don’t I see my urine drug screen results here?',
        a: 'Detailed results are reviewed privately with your counselor or provider. The portal shows collection status and review progress — not lab values.',
      },
      {
        q: 'What does “Ready to review” mean?',
        a: 'Your specimen was collected and processed. Your care team will discuss the result with you at a private visit — often counseling.',
      },
      {
        q: 'Are random screens normal?',
        a: 'Yes. Routine and random urine drug screens are part of Methadone Maintenance Treatment and help support your recovery plan.',
      },
    ],
  },
  {
    id: 'coverage',
    title: 'Coverage & payments',
    description: 'Insurance, authorization, and financial support.',
    faqs: [
      {
        q: 'How do I know if my coverage is active?',
        a: 'Your Coverage & Payments page shows payer, member ID, and last verification date. Contact the patient financial counselor if anything looks incorrect.',
      },
      {
        q: 'What if I cannot afford my patient balance?',
        a: 'Ask about assistance programs through your patient financial counselor before your next visit. Treatment support may be available.',
      },
      {
        q: 'Will my insurance authorization expire?',
        a: 'Authorizations are reviewed periodically. Your portal shows the current authorization period; the clinic will contact you if action is needed.',
      },
    ],
  },
  {
    id: 'portal',
    title: 'Portal & privacy',
    description: 'Account access, messages, and record privacy.',
    faqs: [
      {
        q: 'Are secure messages monitored in real time?',
        a: 'No. Messages are reviewed during clinic hours and are not for emergencies. Call 911 or 988 for immediate crisis support.',
      },
      {
        q: 'Who can see my portal information?',
        a: 'Your authorized BHG care team manages clinical information. The portal shows a patient-facing view designed to support — not replace — conversations with staff.',
      },
      {
        q: 'How do I update my contact preferences?',
        a: 'Open Profile & Privacy or complete communication consent under Forms & Documents. Changes may be reviewed by the clinic in this demonstration.',
      },
      {
        q: 'How do I transfer my treatment records to another clinic?',
        a: 'Under federal 42 CFR Part 2 and HIPAA regulations, your substance use treatment records require your explicit authorization to transfer. You can authorize a record transfer or arrange courtesy guest dosing directly from the Treatment Center page by selecting Request Transfer or Guest Dosing.',
      },
    ],
  },
  {
    id: 'crisis',
    title: 'Crisis & emergencies',
    description: 'When to call 911, 988, or the treatment center.',
    faqs: [
      {
        q: 'When should I call 911?',
        a: 'For medical emergencies, overdose, or immediate danger to yourself or others, call 911 or go to the nearest emergency department.',
      },
      {
        q: 'What is 988?',
        a: '988 is the Suicide & Crisis Lifeline — free, confidential support by call or text. It is available 24/7.',
      },
      {
        q: 'When should I call the treatment center instead?',
        a: 'Call BHG Knoxville for medication-window questions, missed visits, or same-day treatment operations — not for life-threatening emergencies.',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TREATMENT RECORDS DATA
// ─────────────────────────────────────────────────────────────────────────────

// Medication order history — tbl_Orders_2016 (OrderNum, MedType, Dose, Doctor,
// EffectiveDate, ExpirationDate, Active, Notes)
export const orderHistory = [
  {
    id: 'ORD-881',
    med: 'Methadone',
    dose: '90 mg',
    type: 'Observed + 2 take-home days',
    effectiveDate: 'September 3, 2026',
    expirationDate: 'December 31, 2026',
    prescriber: 'Dr. Marcus Hill',
    status: 'Active',
    notes: 'Dose increase from 80 mg. Take-home Tuesday and Wednesday approved; clinic visits Monday and Saturday.',
  },
  {
    id: 'ORD-774',
    med: 'Methadone',
    dose: '80 mg',
    type: 'Observed only',
    effectiveDate: 'July 15, 2026',
    expirationDate: 'September 2, 2026',
    prescriber: 'Dr. Marcus Hill',
    status: 'Superseded',
    notes: 'Initial stabilization dose. No take-home approved at this phase.',
  },
  {
    id: 'ORD-701',
    med: 'Methadone',
    dose: '60 mg',
    type: 'Observed only',
    effectiveDate: 'May 1, 2026',
    expirationDate: 'July 14, 2026',
    prescriber: 'Dr. Marcus Hill',
    status: 'Superseded',
    notes: 'Induction and early stabilization. Dose titrated upward per clinical assessment.',
  },
  {
    id: 'ORD-612',
    med: 'Methadone',
    dose: '30 mg',
    type: 'Observed only — induction',
    effectiveDate: 'March 14, 2026',
    expirationDate: 'April 30, 2026',
    prescriber: 'Dr. Marcus Hill',
    status: 'Superseded',
    notes: 'Starting induction dose. COWS score 14 on admission day.',
  },
];

// Recent dose history — tbl_DOSE (DtMedDate, Dose, Bottletype, BlVoid, StrVoidReason)
// Patient-safe: date, mg, visit type, status. No DEA/inventory fields.
export const medicationHistory = [
  { id: 'D-4201', date: 'Sep 14, 2026', mg: 90, visitType: 'Observed', status: 'Given',     location: 'BHG Knoxville' },
  { id: 'D-4198', date: 'Sep 13, 2026', mg: 90, visitType: 'Take-home', status: 'Take-home', location: 'Tuesday take-home' },
  { id: 'D-4195', date: 'Sep 12, 2026', mg: 90, visitType: 'Take-home', status: 'Take-home', location: 'Wednesday take-home' },
  { id: 'D-4192', date: 'Sep 11, 2026', mg: 90, visitType: 'Observed', status: 'Given',     location: 'BHG Knoxville' },
  { id: 'D-4189', date: 'Sep 10, 2026', mg: 90, visitType: 'Observed', status: 'Given',     location: 'BHG Knoxville' },
  { id: 'D-4186', date: 'Sep 9,  2026', mg: 90, visitType: 'Observed', status: 'Given',     location: 'BHG Knoxville' },
  { id: 'D-4183', date: 'Sep 8,  2026', mg: 90, visitType: 'Observed', status: 'Missed',    location: '— (unexcused)' },
  { id: 'D-4180', date: 'Sep 7,  2026', mg: 90, visitType: 'Take-home', status: 'Take-home', location: 'Tuesday take-home' },
  { id: 'D-4177', date: 'Sep 6,  2026', mg: 90, visitType: 'Take-home', status: 'Take-home', location: 'Wednesday take-home' },
  { id: 'D-4174', date: 'Sep 5,  2026', mg: 90, visitType: 'Observed', status: 'Given',     location: 'BHG Knoxville' },
];

// Counseling session log — tbl_DartsSrv (DsDtStart, DsTxtSrv, DstxtStaff,
// DsdblUnits, DsTelehealthSession, DsSigclt)
export const counselingSessions = [
  {
    id: 'DS-2901',
    date: 'September 3, 2026',
    dateShort: 'SEP 03',
    type: 'Individual counseling',
    serviceType: 'Individual',
    counselor: 'Alicia Monroe',
    duration: '50 min',
    format: 'In person',
    telehealth: false,
    patientSigned: true,
    billable: true,
    summary: 'Recovery supports, take-home plan, and updated treatment goals reviewed.',
  },
  {
    id: 'DS-2867',
    date: 'August 20, 2026',
    dateShort: 'AUG 20',
    type: 'Recovery skills group',
    serviceType: 'Group',
    counselor: 'Alicia Monroe',
    duration: '60 min',
    format: 'In person',
    telehealth: false,
    patientSigned: true,
    billable: true,
    summary: 'Group session focused on coping strategies and peer recovery support.',
  },
  {
    id: 'DS-2841',
    date: 'August 7, 2026',
    dateShort: 'AUG 07',
    type: 'Individual counseling',
    serviceType: 'Individual',
    counselor: 'Alicia Monroe',
    duration: '50 min',
    format: 'In person',
    telehealth: false,
    patientSigned: true,
    billable: true,
    summary: 'Treatment plan review and take-home medication risk assessment completed.',
  },
  {
    id: 'DS-2802',
    date: 'July 24, 2026',
    dateShort: 'JUL 24',
    type: 'Recovery skills group',
    serviceType: 'Group',
    counselor: 'Alicia Monroe',
    duration: '60 min',
    format: 'Telehealth',
    telehealth: true,
    patientSigned: true,
    billable: true,
    summary: 'Telehealth group via secure video. Coping skills and relapse prevention discussed.',
  },
  {
    id: 'DS-2771',
    date: 'July 10, 2026',
    dateShort: 'JUL 10',
    type: 'Individual counseling',
    serviceType: 'Individual',
    counselor: 'Alicia Monroe',
    duration: '50 min',
    format: 'In person',
    telehealth: false,
    patientSigned: true,
    billable: true,
    summary: 'Goals review and social supports assessed. Housing and employment discussed.',
  },
  {
    id: 'DS-2734',
    date: 'June 26, 2026',
    dateShort: 'JUN 26',
    type: 'Recovery skills group',
    serviceType: 'Group',
    counselor: 'Alicia Monroe',
    duration: '60 min',
    format: 'In person',
    telehealth: false,
    patientSigned: true,
    billable: true,
    summary: '90-day milestone session. Progress review and next-phase planning.',
  },
];

// BAM (Brief Addiction Monitor) assessments — tbl_BamForm + tbl_BamScore
// Shows date + three subscale scores (Use, Risk, Protective) — not question-level answers
export const bamAssessments = [
  {
    id: 'BAM-0903',
    date: 'September 3, 2026',
    dateShort: 'SEP 03',
    completedWith: 'Alicia Monroe',
    interval: 'Monthly',
    scores: [
      { subscale: 'Substance Use',    score: 1, maxScore: 12, lower: true,  interpretation: 'Lower is better — reflects less substance use in the past 30 days' },
      { subscale: 'Risk Factors',     score: 3, maxScore: 20, lower: true,  interpretation: 'Lower is better — fewer risk factors for relapse' },
      { subscale: 'Protective Factors', score: 14, maxScore: 16, lower: false, interpretation: 'Higher is better — stronger recovery supports and coping skills' },
    ],
    clinicianNote: 'Scores reflect continued improvement in protective factors. Review at next session.',
  },
  {
    id: 'BAM-0807',
    date: 'August 7, 2026',
    dateShort: 'AUG 07',
    completedWith: 'Alicia Monroe',
    interval: 'Monthly',
    scores: [
      { subscale: 'Substance Use',    score: 2, maxScore: 12, lower: true,  interpretation: 'Lower is better' },
      { subscale: 'Risk Factors',     score: 5, maxScore: 20, lower: true,  interpretation: 'Lower is better' },
      { subscale: 'Protective Factors', score: 12, maxScore: 16, lower: false, interpretation: 'Higher is better' },
    ],
    clinicianNote: 'Risk factors decreasing month over month. Protective factors strengthening.',
  },
  {
    id: 'BAM-0710',
    date: 'July 10, 2026',
    dateShort: 'JUL 10',
    completedWith: 'Alicia Monroe',
    interval: 'Monthly',
    scores: [
      { subscale: 'Substance Use',    score: 3, maxScore: 12, lower: true,  interpretation: 'Lower is better' },
      { subscale: 'Risk Factors',     score: 7, maxScore: 20, lower: true,  interpretation: 'Lower is better' },
      { subscale: 'Protective Factors', score: 10, maxScore: 16, lower: false, interpretation: 'Higher is better' },
    ],
    clinicianNote: 'Initial baseline post-stabilization. Tracking improvement over time.',
  },
];

// Intake / admission assessment summary — tbl_AdmissionAssessmentSummary
// Patient-safe: recommendation, summary narrative, ASAM level, date signed.
// No raw dimension scores or diagnosis codes.
export const intakeSummary = {
  date: 'March 14, 2026',
  program: 'Methadone Maintenance Treatment (MMT)',
  asamLevel: '1.0 \u2014 Outpatient Services',
  recommendation: 'Methadone Maintenance Treatment with methadone',
  clinicalSummary:
    'You were assessed as appropriate for Methadone Maintenance Treatment. Your care plan was designed around methadone treatment, regular counseling, and monitoring to support long-term recovery.',
  patientSignedDate: 'March 14, 2026',
  assessedBy: 'Dr. Marcus Hill + Alicia Monroe',
  cowsScore: 14,
  cowsInterpretation: 'Moderate withdrawal symptoms on admission day \u2014 informed your starting medication dose.',
  sixDimensions: [
    { name: 'Acute intoxication / withdrawal',  summary: 'Moderate opioid withdrawal symptoms present. Addressed with induction dose.' },
    { name: 'Biomedical conditions',             summary: 'No acute medical contraindications to MMT identified.' },
    { name: 'Emotional / behavioral',           summary: 'Mild anxiety noted. Counseling plan includes coping-skills focus.' },
    { name: 'Readiness to change',               summary: 'Patient expressed motivation for treatment and willingness to engage.' },
    { name: 'Relapse / continued use potential', summary: 'Moderate risk. Frequent monitoring and counseling cadence recommended.' },
    { name: 'Recovery / living environment',     summary: 'Stable housing. Limited immediate recovery supports \u2014 group therapy added to plan.' },
  ],
};

// Emergency contact — tbl_CLIENTDEMO2: Clt911Name, Clt911Ph, Clt911Relation
export const emergencyContact = {
  name: 'Morgan Williams',
  phone: '(865) 555-0291',
  relation: 'Sister',
};

export const defaultCbtHomework = [
  {
    id: 'HW-1',
    patient: 'Jordan Williams',
    patientId: 'BHG-20481',
    title: '3-Column Automatic Thought Record',
    category: 'Cognitive Restructuring',
    assignedDate: 'Sep 10, 2026',
    dueDate: 'Sep 17, 2026',
    status: 'Reviewed',
    situation: 'High stress shift at work on Monday; colleague called in sick and medication delivery was delayed.',
    automaticThought: '"I can\'t manage this pressure without using. Everything will fall apart."',
    cognitiveDistortion: 'Catastrophizing & All-or-Nothing Thinking',
    rationalResponse: '"I have handled stressful workdays before by taking my scheduled 10-minute break, using 4-7-8 breathing, and texting my peer mentor. Using will only create worse problems tomorrow."',
    outcome: 'Anxiety dropped from 8/10 to 3/10; finished shift without cravings.',
    counselorFeedback: 'Great work recognizing these thinking traps, Jordan. Practice noting down 1 counter-evidence thought during your work breaks.',
  },
  {
    id: 'HW-2',
    patient: 'Jordan Williams',
    patientId: 'BHG-20481',
    title: 'Urge Surfing & Craving Wave Protocol',
    category: 'Craving Management',
    assignedDate: 'Sep 10, 2026',
    dueDate: 'Sep 17, 2026',
    status: 'Reviewed',
    situation: 'Driving past former neighborhood on Tuesday evening.',
    automaticThought: '"Just driving by won\'t hurt, I just want to see who is around."',
    cognitiveDistortion: 'Minimization & Euphoric Recall',
    rationalResponse: '"That route is a known high-risk trigger. I committed to the highway bypass route. The craving is just a wave that will crest and subside."',
    outcome: 'Timed urge for 14 minutes with box breathing. Urge intensity reduced from 7/10 to 2/10.',
    counselorFeedback: 'Very strong adherence to the Marlatt wave protocol. Notice how the craving peaked at 6 minutes then dissipated.',
  },
  {
    id: 'HW-3',
    patient: 'Taylor Brooks',
    patientId: 'BHG-20476',
    title: 'Decatastrophizing & Probability Thinking',
    category: 'Cognitive Restructuring',
    assignedDate: 'Sep 14, 2026',
    dueDate: 'Sep 21, 2026',
    status: 'Submitted',
    situation: 'Bus ran 15 minutes late; worried about arriving before clinic dosing cutoff.',
    automaticThought: '"If I am late, they will kick me out of the program and I\'ll lose my job."',
    cognitiveDistortion: 'Catastrophizing',
    rationalResponse: '"The clinic policy allows calling ahead if public transit is delayed. One delay does not equal program discharge."',
    outcome: 'Called clinic while on bus; nurse documented arrival time.',
    counselorFeedback: '',
  },
  {
    id: 'HW-4',
    patient: 'Riley Parker',
    patientId: 'BHG-20432',
    title: 'Behavioral Activation & Routine Schedule',
    category: 'Behavioral Activation',
    assignedDate: 'Sep 14, 2026',
    dueDate: 'Sep 18, 2026',
    status: 'In progress',
    situation: 'Structuring non-work afternoon hours to avoid isolation.',
    automaticThought: 'Feeling unmotivated to leave apartment after dosing.',
    cognitiveDistortion: 'Emotional Reasoning',
    rationalResponse: '',
    outcome: '',
    counselorFeedback: '',
  },
];

