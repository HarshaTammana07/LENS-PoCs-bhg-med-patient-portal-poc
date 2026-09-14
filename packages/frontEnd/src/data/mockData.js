// ============================================================
// BHG - MOCK DATA (Internally consistent across all modules)
// ============================================================

export const patient = {
  id: '0630262C',
  name: 'Sarah Jenkins',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  age: 46,
  dob: 'March 14, 1980',
  gender: 'Female',
  bloodType: 'O+',
  email: 'patient@demo.com',
  phone: '(555) 987-6543',
  address: '124 Oak Street',
  city: 'New York',
  province: 'NY',
  postalCode: '10038',
  language: 'English',
  primaryCare: 'Dr. Sarah Mitchell',
  commPrefs: ['email', 'sms'],
  avatar: 'SJ',
  insurance: {
    provider: 'SunLife Financial',
    policyNumber: 'SL-7842910',
    groupNumber: 'GRP-4410',
    coverageType: 'Extended Health & Dental',
    effectiveDate: 'Jan 1, 2024',
    status: 'Active',
  },
  emergencyContact: {
    name: 'Michael Jenkins',
    relation: 'Spouse',
    phone: '(555) 987-6544',
    email: 'michael.jenkins@email.com',
  },
};

// -- PRE-OP CHECKLIST (shared by Dashboard + PreOpChecklist page) --
export const preOpChecklistItems = [
  { id: 'intake', label: 'Complete intake form', done: true },
  { id: 'insurance', label: 'Upload insurance card', done: true },
  { id: 'instructions', label: 'Read pre-op instructions', done: true },
  { id: 'consent', label: 'Sign consent forms', done: false },
  { id: 'escort', label: 'Confirm your escort / ride home', done: false },
  { id: 'fasting', label: 'Confirm fasting compliance', done: false, locked: true },
];

// -- APPOINTMENTS (Ottawa ASC. surgical patient) ---------------
export const appointments = [
  {
    id: 'APT-001',
    type: 'Laparoscopic Cholecystectomy',
    doctor: 'Dr. James Chen',
    specialty: 'General Surgery',
    department: 'General Surgery',
    date: 'June 25, 2026',
    day: '18',
    month: 'MAR',
    time: '9:00 AM',
    duration: '45 min procedure + 2 hr recovery',
    location: 'Ottawa ASC, 3rd Floor',
    address: '100 Main Street, Ottawa, ON K1A 0A1',
    mode: 'In-Person',
    status: 'Confirmed',
    statusColor: 'success',
    notes: 'Arrive at 9:00 AM. Stop eating after midnight March 17. Stop clear liquids by 5:30 AM March 18. Bring a licensed escort. You cannot leave unaccompanied.',
    providerBio: 'Dr. James Chen is a board-certified general surgeon specializing in minimally invasive laparoscopic procedures with 15 years of experience at Ottawa ASC.',
    upcoming: true,
    fastingStopEating: '11:30 PM',
    fastingStopLiquids: '5:30 AM',
    estimatedRecovery: '2 hours',
    preOpReadiness: [
      { label: 'Intake form completed', done: true, completedOn: 'March 5' },
      { label: 'Insurance verified', done: true, completedOn: 'March 5' },
      { label: 'Pre-op instructions read', done: true, completedOn: 'March 10' },
      { label: 'Escort confirmed', done: false },
    ],
  },
  {
    id: 'APT-002',
    type: 'Pre-Op Assessment',
    doctor: 'Lisa Park, RN',
    specialty: 'Nurse Navigator',
    department: 'Pre-Operative Services',
    date: 'February 28, 2026',
    day: '28',
    month: 'FEB',
    time: '10:00 AM',
    duration: '60 min',
    location: 'Ottawa ASC, Pre-Op Suite',
    address: '100 Main Street, Ottawa, ON K1A 0A1',
    mode: 'In-Person',
    status: 'Completed',
    statusColor: 'muted',
    notes: 'Pre-operative health assessment and clinical review completed. Blood work ordered and cleared.',
    upcoming: false,
  },
  {
    id: 'APT-003',
    type: 'Post-Op Follow-Up (Day 3)',
    doctor: 'Lisa Park, RN',
    specialty: 'Nurse Navigator',
    department: 'Post-Operative Services',
    date: 'March 21, 2026',
    day: '21',
    month: 'MAR',
    time: '11:00 AM',
    duration: '30 min',
    location: 'Ottawa ASC, Virtual',
    address: 'Video call link sent via portal',
    mode: 'Telehealth',
    status: 'Scheduled',
    statusColor: 'primary',
    notes: 'Day 3 post-operative check with your Nurse Navigator. Review wound site, pain management, and activity restrictions.',
    upcoming: true,
  },
];


// -- RECORDS --------------------------------------------------------
export const records = [
  {
    id: 'REC-001',
    title: 'Complete Blood Count (CBC) - January 2026',
    type: 'Lab Result',
    category: 'lab',
    date: 'January 22, 2026',
    provider: 'LifeLabs Ottawa',
    orderedBy: 'Dr. Sarah Mitchell',
    status: 'Available',
    statusColor: 'success',
    summary: 'CBC within reference intervals for an adult female. White blood cell count and platelets unremarkable; hemoglobin and hematocrit consistent with normal oxygen-carrying capacity.',
    details: [
      { label: 'WBC', value: '6.2 x10\u00B3/µL', normal: true, ref: '4.5-11.0' },
      { label: 'RBC', value: '4.35 x10\u2076/µL', normal: true, ref: '4.1-5.1 (female)' },
      { label: 'Hemoglobin', value: '13.4 g/dL', normal: true, ref: '12.0-15.5 (female)' },
      { label: 'Hematocrit', value: '40.5%', normal: true, ref: '36-46% (female)' },
      { label: 'MCV', value: '89 fL', normal: true, ref: '80-96' },
      { label: 'Platelets', value: '248 x10\u00B3/µL', normal: true, ref: '150-400' },
      { label: 'ANC', value: '3.6 x10\u00B3/µL', normal: true, ref: '1.8-7.7' },
    ],
  },
  {
    id: 'REC-002',
    title: 'MRI - Lumbar Spine (April 2026)',
    type: 'Imaging',
    category: 'imaging',
    date: 'April 7, 2026',
    provider: 'Ottawa General Hospital - Radiology',
    orderedBy: 'Dr. Anika Patel',
    status: 'Pending Review',
    statusColor: 'warning',
    summary: 'Small focal disc protrusion at L4-L5 without high-grade central canal or foraminal narrowing. Correlate clinically.',
    details: [
      { label: 'Study Type', value: 'MRI lumbar spine without IV contrast', normal: true },
      { label: 'Field strength', value: '1.5 T - Sagittal & axial T1/T2', normal: true },
      { label: 'Findings', value: 'Mild disc height loss L4-L5 with shallow posterior protrusion', normal: false },
      { label: 'Impression', value: 'No critical central canal stenosis', normal: true },
    ],
  },
  {
    id: 'REC-003',
    title: 'Cardiology Stress Test Report',
    type: 'Cardiology',
    category: 'specialist',
    date: 'March 10, 2026',
    provider: 'Ottawa General Hospital - Cardiac Lab',
    orderedBy: 'Dr. Michael Torres',
    status: 'Reviewed',
    statusColor: 'success',
    summary: 'Exercise tolerance adequate; no symptomatic angina during staged Bruce protocol. No diagnostic ST-segment deviation. BP response appropriate.',
    details: [
      { label: 'Protocol', value: 'Bruce treadmill (modified as tolerated)', normal: true },
      { label: 'Peak heart rate', value: '162 bpm (~93% age-predicted max)', normal: true, ref: '>=85% age-predicted max' },
      { label: 'BP at peak exercise', value: '166/88 mmHg', normal: true },
      { label: 'ECG', value: 'No horizontal/downsloping ST depression in monitored leads', normal: true },
      { label: 'Symptoms during test', value: 'None', normal: true },
      { label: 'Impression', value: 'Negative for exercise-induced ischemia', normal: true },
    ],
  },
  {
    id: 'REC-004',
    title: 'Comprehensive Metabolic Panel - January 2026',
    type: 'Lab Result',
    category: 'lab',
    date: 'January 22, 2026',
    provider: 'LifeLabs Ottawa',
    orderedBy: 'Dr. Sarah Mitchell',
    status: 'Available',
    statusColor: 'success',
    summary: 'Fasting glucose 102 mg/dL - above fasting reference interval. Electrolytes and renal/hepatic indices otherwise unremarkable.',
    details: [
      { label: 'Glucose (fasting)', value: '102 mg/dL', normal: false, ref: '65-99 (lab fasting ref.)' },
      { label: 'BUN', value: '15 mg/dL', normal: true, ref: '7-20' },
      { label: 'Creatinine', value: '0.72 mg/dL', normal: true, ref: '0.57-1.00 (female adult)' },
      { label: 'eGFR (CKD-EPI)', value: '92 mL/min/1.73m\u00B2', normal: true, ref: '>=60' },
      { label: 'Sodium', value: '139 mmol/L', normal: true, ref: '136-145' },
      { label: 'Potassium', value: '4.2 mmol/L', normal: true, ref: '3.5-5.2' },
      { label: 'ALT', value: '22 U/L', normal: true, ref: '<33 (female)' },
      { label: 'AST', value: '24 U/L', normal: true, ref: '<40' },
    ],
  },
  {
    id: 'REC-005',
    title: 'Visit Summary - Primary Care Feb 2026',
    type: 'Visit Summary',
    category: 'visit',
    date: 'February 14, 2026',
    provider: 'Ottawa Primacy Health Centre',
    orderedBy: 'Dr. Sarah Mitchell',
    status: 'Reviewed',
    statusColor: 'success',
    summary: 'Annual check-in. BP at goal on current plan (124/78 mmHg). BMI 26.1 (overweight range); lifestyle counseling documented.',
    details: [
      { label: 'Visit Type', value: 'Routine Check-in', normal: true },
      { label: 'Blood Pressure', value: '124/78 mmHg', normal: true },
      { label: 'BMI', value: '26.1 kg/m\u00B2', normal: false },
      { label: 'Referrals', value: 'Dermatology (eczema, left forearm)', normal: true },
      { label: 'Next Action', value: 'CBC repeat in 6 months', normal: true },
    ],
  },
  {
    id: 'REC-006',
    title: 'Prescription - Lisinopril 10mg',
    type: 'Prescription',
    category: 'prescription',
    date: 'March 10, 2026',
    provider: 'Ottawa General Hospital',
    orderedBy: 'Dr. Michael Torres',
    status: 'Active',
    statusColor: 'primary',
    summary: 'Initiated for elevated BP measurements. ACE inhibitor - hold 48 hours before surgery.',
    details: [
      { label: 'Medication', value: 'Lisinopril 10mg tablets', normal: true },
      { label: 'Dosage', value: 'Once daily (morning)', normal: true },
      { label: 'Days Supply', value: '90 days', normal: true },
      { label: 'Refills', value: '3 remaining', normal: true },
      { label: 'Pharmacy', value: 'Shoppers Drug Mart - Rideau St', normal: true },
      { label: 'Pre-surgery note', value: 'HOLD 48 hours before surgery (stop by March 16)', normal: false },
    ],
  },
  {
    id: 'REC-007',
    title: 'Surgical Consent: Laparoscopic Cholecystectomy',
    type: 'Consent Form',
    category: 'consent',
    date: 'March 12, 2026',
    provider: 'Ottawa ASC',
    orderedBy: 'Dr. James Chen',
    status: 'Signed',
    statusColor: 'success',
    summary: 'Patient consent for laparoscopic cholecystectomy obtained. Risks, benefits, and alternatives explained and understood.',
    details: [
      { label: 'Procedure', value: 'Laparoscopic Cholecystectomy', normal: true },
      { label: 'Surgeon', value: 'Dr. James Chen, General Surgery', normal: true },
      { label: 'Date Signed', value: 'March 12, 2026', normal: true },
      { label: 'Witness', value: 'Marie Laurent, Care Concierge', normal: true },
      { label: 'Status', value: 'Signed and on file', normal: true },
    ],
  },
  {
    id: 'REC-008',
    title: 'Anaesthesia Consent',
    type: 'Consent Form',
    category: 'consent',
    date: 'March 12, 2026',
    provider: 'Ottawa ASC',
    orderedBy: 'Ottawa ASC Anaesthesia Team',
    status: 'Signed',
    statusColor: 'success',
    summary: 'Patient consent for general anaesthesia obtained. Anaesthesia type, risks, and post-operative care reviewed and accepted.',
    details: [
      { label: 'Anaesthesia Type', value: 'General anaesthesia', normal: true },
      { label: 'Date Signed', value: 'March 12, 2026', normal: true },
      { label: 'ASA Classification', value: 'ASA II', normal: true },
      { label: 'Status', value: 'Signed and on file', normal: true },
    ],
  },
  {
    id: 'REC-009',
    title: 'Pre-Op Blood Work: CBC, CMP',
    type: 'Lab Result',
    category: 'lab',
    date: 'March 1, 2026',
    provider: 'Ottawa ASC Laboratory',
    orderedBy: 'Lisa Park, RN',
    status: 'Available',
    statusColor: 'success',
    summary: 'Pre-operative CBC and comprehensive metabolic panel. All values within normal reference ranges. Patient cleared for surgery.',
    details: [
      { label: 'WBC', value: '6.4 x10\u00B3/µL', normal: true, ref: '4.5-11.0' },
      { label: 'Hemoglobin', value: '14.1 g/dL', normal: true, ref: '12.0-15.5 (female)' },
      { label: 'Platelets', value: '241 x10\u00B3/µL', normal: true, ref: '150-400' },
      { label: 'Sodium', value: '140 mmol/L', normal: true, ref: '136-145' },
      { label: 'Potassium', value: '4.0 mmol/L', normal: true, ref: '3.5-5.2' },
      { label: 'Creatinine', value: '0.70 mg/dL', normal: true, ref: '0.57-1.00 (female)' },
      { label: 'Glucose (fasting)', value: '98 mg/dL', normal: true, ref: '65-99' },
      { label: 'ALT', value: '20 U/L', normal: true, ref: '<33 (female)' },
    ],
  },
  {
    id: 'REC-010',
    title: 'Pre-Op Assessment: Nurse Navigator',
    type: 'Visit Summary',
    category: 'visit',
    date: 'February 28, 2026',
    provider: 'Ottawa ASC',
    orderedBy: 'Lisa Park, RN',
    status: 'Reviewed',
    statusColor: 'success',
    summary: 'Pre-operative nursing assessment completed. Fasting and escort requirements reviewed and acknowledged. Cleared for surgery.',
    details: [
      { label: 'ASA Classification', value: 'ASA II', normal: true },
      { label: 'Blood Pressure', value: '122/76 mmHg', normal: true },
      { label: 'Heart Rate', value: '70 bpm', normal: true },
      { label: 'Allergies reviewed', value: 'Penicillin (rash), Sulfa (nausea)', normal: false },
      { label: 'Medications reviewed', value: 'Lisinopril hold confirmed (48 hr pre-op)', normal: true },
      { label: 'Surgical clearance', value: 'Cleared for surgery', normal: true },
    ],
  },
  {
    id: 'REC-011',
    title: 'Chest X-Ray Pre-Clearance',
    type: 'Imaging',
    category: 'imaging',
    date: 'February 28, 2026',
    provider: 'Ottawa ASC Radiology',
    orderedBy: 'Lisa Park, RN',
    status: 'Available',
    statusColor: 'success',
    summary: 'Pre-operative chest X-ray shows no acute cardiopulmonary abnormality. Lung fields clear bilaterally. Cleared for general anaesthesia.',
    details: [
      { label: 'Study Type', value: 'PA chest radiograph', normal: true },
      { label: 'Lung fields', value: 'Clear bilaterally, no infiltrates', normal: true },
      { label: 'Cardiac silhouette', value: 'Normal size', normal: true },
      { label: 'Impression', value: 'No acute cardiopulmonary abnormality', normal: true },
      { label: 'Clearance', value: 'Approved for general anaesthesia', normal: true },
    ],
  },
];

// -- NOTIFICATIONS --------------------------------------------------
export const notifications = [
  {
    id: 'NOT-001',
    type: 'appointment',
    title: 'Surgery Confirmed: June 25, 2026',
    description: 'Your Laparoscopic Cholecystectomy with Dr. James Chen on March 18 at 9:00 AM is confirmed. Arrive at Ottawa ASC, 3rd Floor.',
    time: 'Mar 10, 9:00 AM',
    timestamp: '2026-03-10T09:00:00',
    read: false,
    link: 'my-surgery',
    apptId: 'APT-001',
    icon: 'Calendar',
    color: 'success',
  },
  {
    id: 'NOT-002',
    type: 'report',
    title: 'Pre-Op Blood Work Results Ready',
    description: 'Your pre-operative CBC and CMP results are available. All values are within normal range. You are cleared for surgery.',
    time: 'Mar 8, 9:00 AM',
    timestamp: '2026-03-08T09:00:00',
    read: false,
    link: 'records',
    recordId: 'REC-009',
    icon: 'FlaskConical',
    color: 'success',
  },
  {
    id: 'NOT-003',
    type: 'message',
    title: 'New Message from Care Concierge',
    description: 'Marie Laurent has sent you a message about your pre-op checklist. Please complete remaining tasks by March 15.',
    time: 'Mar 12, 8:00 AM',
    timestamp: '2026-03-12T08:00:00',
    read: false,
    link: 'messages',
    icon: 'MessageSquare',
    color: 'accent',
  },
  {
    id: 'NOT-004',
    type: 'billing',
    title: 'Insurance Pre-Authorization Approved',
    description: 'SunLife Financial has approved pre-authorization PA-9311 for your Laparoscopic Cholecystectomy. Estimated patient cost: $1,500.00.',
    time: 'Mar 5, 2:00 PM',
    timestamp: '2026-03-05T14:00:00',
    read: true,
    link: 'insurance',
    icon: 'ShieldCheck',
    color: 'success',
  },
  {
    id: 'NOT-005',
    type: 'report',
    title: 'Consent Forms Ready to Sign',
    description: 'Your surgical and anaesthesia consent forms are ready for your review and signature in My Records.',
    time: 'Mar 11, 10:00 AM',
    timestamp: '2026-03-11T10:00:00',
    read: true,
    link: 'records',
    icon: 'FileText',
    color: 'primary',
  },
  {
    id: 'NOT-006',
    type: 'system',
    title: 'Pre-Op Checklist: 2 Tasks Remaining',
    description: 'You have 2 pre-op tasks to complete before March 15: Sign consent forms and confirm your escort.',
    time: 'Mar 13, 8:00 AM',
    timestamp: '2026-03-13T08:00:00',
    read: true,
    link: 'pre-op-checklist',
    icon: 'ClipboardList',
    color: 'warning',
  },
];

// -- MESSAGES -------------------------------------------------------
export const conversations = [
  {
    id: 'MSG-001',
    with: 'Care Concierge: Marie Laurent',
    avatar: 'ML',
    role: 'Your dedicated concierge for surgery prep and support',
    lastMessage: 'Please complete your pre-op checklist by March 15. Let me know if you have any questions!',
    lastTime: 'Today',
    unread: 2,
    messages: [
      { id: 1, sender: 'them', text: "Hi Sarah! I'm Marie, your Care Concierge at Ottawa ASC. I'll be your primary point of contact for everything related to your upcoming surgery.", time: 'Mar 1, 9:00 AM' },
      { id: 2, sender: 'me', text: 'Thank you Marie! I am a little nervous. What should I expect?', time: 'Mar 1, 9:30 AM' },
      { id: 3, sender: 'them', text: "That's completely normal! Your procedure is very routine for our team. Dr. Chen has performed hundreds of these. I'll walk you through everything step by step.", time: 'Mar 1, 9:45 AM' },
      { id: 4, sender: 'them', text: "Hi Sarah, your surgery is confirmed for March 18 at 9:00 AM. Please complete your pre-op checklist by March 15. Let me know if you have any questions. I'm here to help. Marie, Care Concierge", time: 'Mar 10, 11:00 AM' },
      { id: 5, sender: 'me', text: "Thanks! I still need to confirm my escort. My husband will drive me but I want to make sure that's OK.", time: 'Mar 10, 11:30 AM' },
      { id: 6, sender: 'them', text: "Absolutely, a spouse is perfect! Please add his name in the checklist. He can wait in our family lounge. It has Wi-Fi and coffee.", time: 'Mar 10, 11:45 AM' },
      { id: 7, sender: 'them', text: 'Please complete your pre-op checklist by March 15. Let me know if you have any questions!', time: 'Mar 12, 8:00 AM' },
    ],
  },
  {
    id: 'MSG-002',
    with: 'Billing & Accounts',
    avatar: 'BA',
    role: 'Patient Financial Services',
    lastMessage: 'Your pre-authorization for the procedure has been approved by SunLife.',
    lastTime: 'Mar 5',
    unread: 0,
    messages: [
      { id: 1, sender: 'them', text: 'Hi Sarah, this is the Ottawa ASC financial services team. We have confirmed your SunLife insurance coverage for the Laparoscopic Cholecystectomy on March 18.', time: 'Mar 3, 9:00 AM' },
      { id: 2, sender: 'them', text: 'Your estimated patient responsibility after insurance is $1,500.00. A detailed breakdown is available in your Insurance & Coverage section.', time: 'Mar 3, 9:01 AM' },
      { id: 3, sender: 'me', text: 'Thank you. Is there anything I need to pay before the procedure?', time: 'Mar 3, 10:00 AM' },
      { id: 4, sender: 'them', text: 'No payment is required upfront. We will send a statement after your procedure. You can pay online through the portal.', time: 'Mar 3, 10:30 AM' },
      { id: 5, sender: 'them', text: 'Your pre-authorization for the procedure has been approved by SunLife.', time: 'Mar 5, 2:00 PM' },
    ],
  },
  {
    id: 'MSG-003',
    with: 'Pre-Op Updates',
    avatar: 'PO',
    role: 'Automated surgical prep notifications',
    lastMessage: 'Reminder: Stop eating by 11:30 PM tonight before your March 18 surgery.',
    lastTime: 'Mar 17',
    unread: 1,
    messages: [
      { id: 1, sender: 'them', text: 'Pre-op checklist reminder: You have 2 tasks remaining. Please complete by March 15 to ensure your surgery proceeds as planned.', time: 'Mar 13, 8:00 AM' },
      { id: 2, sender: 'them', text: 'Your surgery is in 5 days. June 25, 2026 at 9:00 AM. Ottawa ASC, 100 Main Street, 3rd Floor.', time: 'Mar 13, 8:01 AM' },
      { id: 3, sender: 'them', text: 'Fasting reminder: Please stop eating by 11:30 PM tonight and stop drinking clear liquids by 5:30 AM tomorrow morning.', time: 'Mar 17, 6:00 PM' },
      { id: 4, sender: 'them', text: 'Reminder: Stop eating by 11:30 PM tonight before your March 18 surgery.', time: 'Mar 17, 8:00 PM' },
    ],
  },
  {
    id: 'MSG-004',
    with: 'Nurse Navigator: Lisa Park',
    avatar: 'LP',
    role: 'For clinical questions about your procedure and pre-op assessment',
    lastMessage: 'Your pre-op bloodwork results are all within normal range. You are cleared for surgery.',
    lastTime: 'Mar 8',
    unread: 0,
    messages: [
      { id: 1, sender: 'them', text: "Hi Sarah, I'm Lisa Park, your Nurse Navigator. I will be supporting you through your pre-op assessment and post-op follow-up.", time: 'Feb 25, 10:00 AM' },
      { id: 2, sender: 'me', text: 'Hi Lisa! I take Lisinopril daily. Do I need to stop it before surgery?', time: 'Feb 25, 10:30 AM' },
      { id: 3, sender: 'them', text: 'Great question, Sarah. Yes, please stop taking Lisinopril 48 hours before your surgery (by March 16). Continue all other medications as usual unless Dr. Chen advises otherwise.', time: 'Feb 25, 11:00 AM' },
      { id: 4, sender: 'me', text: 'Thank you! What about my pre-op bloodwork? When will I get results?', time: 'Mar 7, 2:00 PM' },
      { id: 5, sender: 'them', text: 'Your pre-op bloodwork results are all within normal range. You are cleared for surgery.', time: 'Mar 8, 9:00 AM' },
    ],
  },
];

// -- BILLING --------------------------------------------------------
export const billing = {
  currentBalance: 0,
  dueDate: 'N/A',
  lastPayment: { amount: 0, date: 'N/A' },
  statements: [
    {
      id: 'STM-001',
      period: 'March 2026 Surgery',
      issued: 'March 25, 2026',
      due: 'April 25, 2026',
      total: 1500.00,
      status: 'Pending',
      statusColor: 'warning',
      items: [
        { description: 'Laparoscopic Cholecystectomy - Facility Fee', code: '47562', amount: 3200.00, covered: 3200.00, patient: 0 },
        { description: 'Surgeon Fee - Dr. James Chen', code: '47562-26', amount: 1800.00, covered: 1300.00, patient: 500.00 },
        { description: 'Anaesthesia Services', code: '00840', amount: 950.00, covered: 950.00, patient: 0 },
        { description: 'Patient Deductible Portion', code: 'DED', amount: 1000.00, covered: 0, patient: 1000.00 },
      ],
    },
  ],
  paymentHistory: [],
};
// -- INSURANCE & COVERAGE (aligned with patient.insurance + portal demo) --
export const insuranceCoverage = {
  carrierLabel: 'Primary medical coverage',
  providerName: 'SunLife Financial',
  planName: 'Extended Health & Dental - PPO Tier 1',
  networkNote: 'In network at participating BHG providers',
  verifiedActive: true,
  copays: {
    pcp: { label: 'PCP copay', amount: 20, icon: 'user' },
    specialist: { label: 'Specialist', amount: 45, icon: 'search' },
    urgentCare: { label: 'Urgent care', amount: 75, icon: 'plus' },
  },
  deductible: { label: 'Individual deductible', used: 850, total: 2000 },
  oopMax: { label: 'Out-of-pocket maximum', used: 2400, total: 6000 },
  calculatedAsOf: 'March 5, 2026',
  preAuthorizations: [
    { id: 'PA-9311', procedure: 'Laparoscopic Cholecystectomy', expires: 'April 15, 2026', status: 'Approved' },
    { id: 'PA-8821', procedure: 'Anaesthesia Services', expires: 'April 15, 2026', status: 'Approved' },
  ],
};

// -- TIMELINE -----------------------------------------------
export const timelineEvents = [
  { id: 'TL-001', date: 'April 17, 2026', type: 'report', icon: 'FileText', color: 'warning', title: 'MRI Report Available', desc: 'Lumbar Spine MRI (Apr 7) results available for review.', link: 'records', ref: 'REC-002' },
  { id: 'TL-002', date: 'March 10, 2026', type: 'appointment', icon: 'Calendar', color: 'success', title: 'Surgery Confirmed', desc: 'Laparoscopic Cholecystectomy confirmed for March 18 with Dr. Chen.', link: 'my-surgery', ref: 'APT-001' },
  { id: 'TL-003', date: 'April 10, 2026', type: 'message', icon: 'MessageSquare', color: 'accent', title: 'Billing Inquiry Resolved', desc: 'Billing team clarified March 2026 charges via secure message.', link: 'messages', ref: 'MSG-002' },
  { id: 'TL-004', date: 'April 7, 2026', type: 'report', icon: 'Scan', color: 'primary', title: 'MRI Scan Performed', desc: 'Lumbar Spine MRI conducted at Ottawa General Radiology.', link: 'records', ref: 'REC-002' },
  { id: 'TL-005', date: 'April 1, 2026', type: 'billing', icon: 'Receipt', color: 'muted', title: 'Statement Issued - March 2026', desc: 'New statement of $248.00 issued. Due April 24.', link: 'statements', ref: 'STM-001' },
  { id: 'TL-006', date: 'March 10, 2026', type: 'appointment', icon: 'HeartPulse', color: 'primary', title: 'Cardiology Stress Test', desc: 'Exercise stress test completed - negative for ischemia.', link: 'appointments', ref: 'APT-004' },
  { id: 'TL-007', date: 'March 10, 2026', type: 'prescription', icon: 'Pill', color: 'accent', title: 'Prescription Issued', desc: 'Lisinopril 10mg prescribed by Dr. Torres for mild hypertension.', link: 'records', ref: 'REC-006' },
  { id: 'TL-008', date: 'February 28, 2026', type: 'billing', icon: 'CheckCircle', color: 'success', title: 'Payment Received - $130.00', desc: 'Visa ending 4821. February statement fully settled.', link: 'statements', ref: 'PAY-001' },
  { id: 'TL-009', date: 'February 28, 2026', type: 'appointment', icon: 'UserCheck', color: 'primary', title: 'Pre-Op Assessment Completed', desc: 'Nurse Navigator Lisa Park completed clinical clearance. All vitals within normal range.', link: 'visits', ref: 'VIS-001' },
  { id: 'TL-013', date: 'March 12, 2026', type: 'appointment', icon: 'FileText', color: 'success', title: 'Consent Forms Signed', desc: 'Surgical consent and anaesthesia consent signed electronically in portal.', link: 'records', ref: 'REC-007' },
  { id: 'TL-014', date: 'March 5, 2026', type: 'system', icon: 'Shield', color: 'success', title: 'Insurance Verified', desc: 'SunLife Financial coverage verified. Pre-authorization approved.', link: 'insurance', ref: null },
  { id: 'TL-015', date: 'March 5, 2026', type: 'system', icon: 'Activity', color: 'primary', title: 'Intake Completed via AI Agent', desc: 'Allergies, medications, and insurance information collected via AI phone call.', link: 'pre-op-checklist', ref: null },
  { id: 'TL-010', date: 'January 24, 2026', type: 'report', icon: 'FlaskConical', color: 'success', title: 'Lab Results Posted', desc: 'CBC reviewed; CMP shows borderline fasting glucose - see metabolic panel in My Records.', link: 'records', ref: 'REC-004' },
  { id: 'TL-011', date: 'January 22, 2026', type: 'appointment', icon: 'Syringe', color: 'muted', title: 'Lab Work Collected', desc: 'Fasting CBC and CMP collected at LifeLabs Ottawa.', link: 'appointments', ref: 'APT-006' },
  { id: 'TL-012', date: 'January 5, 2026', type: 'system', icon: 'Shield', color: 'muted', title: 'Portal Account Activated', desc: 'BHG Patient Portal account registered and verified.', link: 'profile', ref: null },
];

// -- HELP ARTICLES ------------------------------------------
export const helpCategories = [
  {
    id: 'HC-01',
    title: 'Appointments',
    icon: 'Calendar',
    color: 'primary',
    count: 6,
    faqs: [
      { q: 'How do I book a new appointment?', a: 'Navigate to the Appointments module and click "Book Appointment". Choose your specialty, select a provider, pick a date and time, and confirm. You\'ll receive a confirmation notification immediately.' },
      { q: 'Can I reschedule or cancel an appointment?', a: 'Yes. Open the appointment details and click "Request Reschedule". A patient services representative will confirm a new time within 1 business day.' },
      { q: 'How do I attend a telehealth appointment?', a: 'Telehealth appointments include a secure video link sent to your email and shown in the portal 30 minutes before start time. Ensure your camera and microphone are enabled.' },
    ],
  },
  {
    id: 'HC-02',
    title: 'Medical Records',
    icon: 'FileText',
    color: 'accent',
    count: 5,
    faqs: [
      { q: 'How do I view my lab results?', a: 'Go to My Records, then filter by "Lab Results". Click any result to see detailed values, reference ranges, and ordering physician notes.' },
      { q: 'When will my results be available?', a: 'Most routine lab results are available within 1–3 business days. Imaging reports may take 3–5 days. You\'ll receive a notification when they\'re ready.' },
      { q: 'Can I share my records with another provider?', a: 'Yes. In the record detail view, click "Share Record". You can share securely by email or generate a one-time access link for a healthcare provider.' },
    ],
  },
  {
    id: 'HC-03',
    title: 'Billing & Payments',
    icon: 'CreditCard',
    color: 'warning',
    count: 7,
    faqs: [
      { q: 'How do I pay my balance online?', a: 'Go to Billing & Statements, then click "Make a Payment". Enter your payment details and confirm. Visa, Mastercard, and online banking are accepted.' },
      { q: 'Why is there a balance after insurance?', a: 'Your insurance covers a portion of the cost based on your plan. The remaining balance is your patient responsibility (copay, deductible, or non-covered service).' },
      { q: 'How do I download a statement?', a: 'Open the Billing section, find your statement, and click the download icon. A PDF version of your itemized statement will be downloaded.' },
    ],
  },
  {
    id: 'HC-04',
    title: 'Technical Support',
    icon: 'Wrench',
    color: 'purple',
    count: 4,
    faqs: [
      { q: 'I forgot my password. How do I reset it?', a: 'On the login screen, click "Forgot Password". Enter your registered email address and follow the secure reset link sent to your inbox.' },
      { q: 'Why can\'t I log in to my account?', a: 'Ensure you\'re using the correct credentials. If you\'ve had 5 failed attempts, your account will be temporarily locked. Contact support to unlock it.' },
      { q: 'Is my data secure?', a: 'Yes. BHG uses end-to-end encryption. Your health information is protected at rest and in transit.' },
    ],
  },
];

// -- PAST VISITS (surgical care history) ---------------------------
export const visits = [
  {
    id: 'VIS-001',
    date: 'February 28, 2026',
    doctor: 'Lisa Park, RN',
    specialty: 'Nurse Navigator',
    summary: 'Pre-Op Assessment',
    diagnosis: 'Surgical clearance obtained. All vitals and bloodwork within normal range.',
    notes: 'Clinical pre-operative assessment completed. Reviewed allergies (penicillin, sulfa). ECG normal. Anaesthesia risk classified as ASA II. Patient educated on fasting, escort requirement, and post-op wound care. Blood work results communicated March 8.',
  },
  {
    id: 'VIS-002',
    date: 'June 25, 2026',
    doctor: 'Dr. James Chen',
    specialty: 'General Surgery',
    summary: 'Laparoscopic Cholecystectomy',
    diagnosis: 'Successful laparoscopic removal of gallbladder. No complications.',
    notes: 'Procedure performed under general anaesthesia. Three-port laparoscopic approach. Operative time 42 minutes. Estimated blood loss minimal. Patient transferred to recovery at 8:25 AM, vital signs stable throughout. Discharged home at 11:15 AM with escort. Discharge instructions provided.',
  },
  {
    id: 'VIS-003',
    date: 'March 21, 2026',
    doctor: 'Lisa Park, RN',
    specialty: 'Nurse Navigator',
    summary: 'Post-Op Follow-Up (Day 3)',
    diagnosis: 'Recovery progressing as expected. Wound sites healing well.',
    notes: 'Telehealth follow-up. Patient reports mild soreness at incision sites, which is normal for day 3 post-op. No signs of infection. Pain managed with over-the-counter ibuprofen. Activity restrictions reviewed. Return to normal activity expected within 10 to 14 days. Next follow-up scheduled with Dr. Chen at 2-week mark if needed.',
  },
];

// -- MY RECORDS HUB (structured tabs) ----------------------------
export const healthHubVitals = [
  { id: 'V-1', date: 'Apr 12, 2026', bp: '124/78', heartRate: 72, weightKg: 72.4, tempC: 36.6, source: 'Primary Care Clinic' },
  { id: 'V-2', date: 'Mar 10, 2026', bp: '128/82', heartRate: 78, weightKg: 72.8, tempC: 36.5, source: 'Cardiology' },
  { id: 'V-3', date: 'Feb 14, 2026', bp: '126/80', heartRate: 74, weightKg: 73.1, tempC: 36.7, source: 'Primary Care Clinic' },
];

export const healthHubAllergies = [
  { id: 'A-1', substance: 'Penicillin', reaction: 'Rash', severity: 'Moderate', status: 'Active' },
  { id: 'A-2', substance: 'Sulfa drugs', reaction: 'Nausea', severity: 'Mild', status: 'Active' },
];

export const healthHubProblems = [
  { id: 'P-1', name: 'Essential hypertension', since: '2019', status: 'Managed' },
  { id: 'P-2', name: 'Impaired fasting glucose', since: 'Jan 2026', status: 'Monitoring' },
  { id: 'P-3', name: 'Localized eczema', since: 'Feb 2026', status: 'Improving' },
];

export const healthHubImmunizations = [
  { id: 'I-1', vaccine: 'Influenza (quadrivalent)', date: 'Oct 18, 2025', provider: 'Pharmacy - Rideau St' },
  { id: 'I-2', vaccine: 'Tdap', date: 'Mar 3, 2022', provider: 'Primary Care Clinic' },
  { id: 'I-3', vaccine: 'COVID-19 (bivalent)', date: 'Sep 12, 2024', provider: 'Community clinic' },
];

export const healthHubClinicalMessages = [
  { id: 'CM-1', date: 'Apr 15, 2026', from: 'Dr. Mitchell’s office', subject: 'Fasting instructions', preview: 'Please fast 12 hours before your May 8 visit for lab work.' },
  { id: 'CM-2', date: 'Apr 2, 2026', from: 'Cardiology', subject: 'Stress test results', preview: 'Your recent stress test showed no signs of reduced blood flow with exercise.' },
];

export const healthHubPHR = [
  { id: 'PHR-1', label: 'Exercise minutes / week', value: '~120', updated: 'Apr 2026' },
  { id: 'PHR-2', label: 'Typical sleep', value: '7 hours', updated: 'Apr 2026' },
  { id: 'PHR-3', label: 'Dietary preference', value: 'Low sodium', updated: 'Mar 2026' },
  { id: 'PHR-4', label: 'Advance care plan on file', value: 'Not yet (optional)', updated: 'N/A' },
];

export const healthAccessDocuments = [
  { id: 'HAD-1', name: 'Consent to treat - 2026', type: 'Consent', date: 'Jan 5, 2026' },
  { id: 'HAD-2', name: 'Release of information - PCP', type: 'Authorization', date: 'Mar 12, 2026' },
];

export const educationDocuments = [
  { id: 'ED-1', title: 'Understanding blood pressure readings', topic: 'Heart health', date: 'Mar 2026' },
  { id: 'ED-2', title: 'Healthy eating with elevated glucose', topic: 'Nutrition', date: 'Feb 2026' },
];

export const refillRequests = [
  { id: 'RF-1', medication: 'Lisinopril 10 mg', status: 'Sent to pharmacy', requested: 'Mar 18, 2026' },
  { id: 'RF-2', medication: 'Metformin ER 500 mg', status: 'Completed', requested: 'Feb 4, 2026' },
];

// -- TRACKERS (vitals trends - mock series) -----------------------
export const trackerBloodPressure = [
  { label: 'Jan', systolic: 128, diastolic: 82 },
  { label: 'Feb', systolic: 126, diastolic: 80 },
  { label: 'Mar', systolic: 128, diastolic: 82 },
  { label: 'Apr', systolic: 124, diastolic: 78 },
];

export const trackerGlucose = [
  { label: 'Jan', value: 102 },
  { label: 'Feb', value: 99 },
  { label: 'Mar', value: 101 },
  { label: 'Apr', value: 98 },
];

/** Patient-facing “who viewed my record” style log (demo). */
export const patientRecordAccessLog = [
  {
    id: 'PAL-1',
    accessedBy: 'Care team viewer',
    action: 'VIEW',
    time: '2026-01-08 15:09:17 EST',
    status: 'N/A',
    document: 'Visit Summary',
    channel: 'mobile',
  },
  {
    id: 'PAL-2',
    accessedBy: 'Dr. Sarah Mitchell',
    action: 'VIEW',
    time: '2026-01-06 09:42:03 EST',
    status: 'N/A',
    document: 'Visit Summary',
    channel: 'web',
  },
  {
    id: 'PAL-3',
    accessedBy: 'BHG portal (you)',
    action: 'VIEW',
    time: '2026-01-05 18:21:44 EST',
    status: 'N/A',
    document: 'Lab Results',
    channel: 'web',
  },
  {
    id: 'PAL-4',
    accessedBy: 'Nursing triage',
    action: 'VIEW',
    time: '2026-01-04 11:03:29 EST',
    status: 'N/A',
    document: 'Visit Summary',
    channel: 'mobile',
  },
];

export const DEMO_CREDENTIALS = { email: 'patient@demo.com', password: 'Password123' };

export const mockPatients = [
  { id: 'PT-8472910', name: 'Sarah Jenkins', mnr: '0630262C', status: 'Active', risk: 'Elevated', dob: '1980-03-14', lastVisit: '2026-04-18' },
  { id: 'PT-1928374', name: 'Rajesh Kumar', mnr: '9928374A', status: 'Active', risk: 'Low', dob: '1975-11-22', lastVisit: '2026-04-10' },
  { id: 'PT-5647382', name: 'Ananya Reddy', mnr: '4456372B', status: 'Inactive', risk: 'Stable', dob: '1992-06-05', lastVisit: '2026-02-15' },
  { id: 'PT-2039485', name: 'Michael Chen', mnr: '8839201D', status: 'Active', risk: 'Critical', dob: '1968-09-30', lastVisit: '2026-04-19' },
];

export const mockLabs = [
  { id: 'L-001', patientName: 'Sarah Jenkins', test: 'CMP Panel', status: 'Pending Review', date: '2026-04-20', priority: 'High' },
  { id: 'L-002', patientName: 'Rajesh Kumar', test: 'Lipid Profile', status: 'Completed', date: '2026-04-19', priority: 'Normal' },
  { id: 'L-003', patientName: 'Michael Chen', test: 'HbA1c', status: 'Pending Review', date: '2026-04-20', priority: 'Critical' },
  { id: 'L-004', patientName: 'Ananya Reddy', test: 'Thyroid Function', status: 'Completed', date: '2026-04-15', priority: 'Normal' },
];