import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  MessageSquareText,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TestTube2,
  TrendingDown,
  UserRound,
  UserRoundCheck,
  UsersRound,
  Video,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DemoBanner, Field, WorkflowModal } from '../components/PrototypeUI';

const patients = [
  { id: 'BHG-20481', name: 'Jordan Williams', centerId: 'knoxville-bernard', center: 'Knoxville Bernard', program: 'OTP', phase: 'Stabilization', counselor: 'Morgan Reed', payer: 'TennCare', status: 'Active', last: 'Today, 6:42 AM' },
  { id: 'BHG-20476', name: 'Taylor Brooks', centerId: 'knoxville-citico', center: 'Knoxville Citico', program: 'OTP', phase: 'Maintenance', counselor: 'Morgan Reed', payer: 'Self-pay', status: 'Active', last: 'Today, 7:05 AM' },
  { id: 'BHG-20459', name: 'Casey Morgan', centerId: 'jackson-tn', center: 'Jackson TN', program: 'OBOT', phase: 'Maintenance', counselor: 'Morgan Reed', payer: 'BlueCare', status: 'Active', last: 'Sep 11, 2026' },
  { id: 'BHG-20432', name: 'Riley Parker', centerId: 'knoxville-bernard', center: 'Knoxville Bernard', program: 'OTP', phase: 'Induction', counselor: 'Morgan Reed', payer: 'TennCare', status: 'Review', last: 'Today, 8:16 AM' },
  { id: 'BHG-20398', name: 'Jamie Carter', centerId: 'knoxville-citico', center: 'Knoxville Citico', program: 'IOP', phase: 'Active care', counselor: 'Morgan Reed', payer: 'Cigna', status: 'Active', last: 'Sep 12, 2026' },
  { id: 'BHG-20384', name: 'Avery Thompson', centerId: 'knoxville-bernard', center: 'Knoxville Bernard', program: 'OTP', phase: 'Maintenance', counselor: 'Morgan Reed', payer: 'BlueCare', status: 'Active', last: 'Today, 9:12 AM' },
  { id: 'BHG-20371', name: 'Cameron Ellis', centerId: 'knoxville-bernard', center: 'Knoxville Bernard', program: 'IOP', phase: 'Active care', counselor: 'Morgan Reed', payer: 'TennCare', status: 'Review', last: 'Sep 15, 2026' },
  { id: 'BHG-20356', name: 'Drew Sullivan', centerId: 'knoxville-bernard', center: 'Knoxville Bernard', program: 'OBOT', phase: 'Maintenance', counselor: 'Morgan Reed', payer: 'UnitedHealthcare', status: 'Active', last: 'Sep 14, 2026' },
  { id: 'BHG-20342', name: 'Emerson Davis', centerId: 'knoxville-citico', center: 'Knoxville Citico', program: 'OTP', phase: 'Stabilization', counselor: 'Morgan Reed', payer: 'TennCare', status: 'Active', last: 'Today, 8:44 AM' },
  { id: 'BHG-20327', name: 'Finley Howard', centerId: 'knoxville-citico', center: 'Knoxville Citico', program: 'OBOT', phase: 'Maintenance', counselor: 'Morgan Reed', payer: 'BlueCare', status: 'Review', last: 'Sep 15, 2026' },
  { id: 'BHG-20315', name: 'Harper Lewis', centerId: 'knoxville-citico', center: 'Knoxville Citico', program: 'IOP', phase: 'Active care', counselor: 'Morgan Reed', payer: 'Aetna', status: 'Active', last: 'Sep 13, 2026' },
  { id: 'BHG-20296', name: 'Kendall Wright', centerId: 'jackson-tn', center: 'Jackson TN', program: 'OTP', phase: 'Induction', counselor: 'Morgan Reed', payer: 'TennCare', status: 'Review', last: 'Today, 7:36 AM' },
  { id: 'BHG-20283', name: 'Logan Mitchell', centerId: 'jackson-tn', center: 'Jackson TN', program: 'OTP', phase: 'Maintenance', counselor: 'Morgan Reed', payer: 'Self-pay', status: 'Active', last: 'Today, 8:02 AM' },
  { id: 'BHG-20268', name: 'Peyton Ross', centerId: 'jackson-tn', center: 'Jackson TN', program: 'OBOT', phase: 'Stabilization', counselor: 'Morgan Reed', payer: 'BlueCare', status: 'Active', last: 'Sep 14, 2026' },
  { id: 'BHG-20251', name: 'Reese Bennett', centerId: 'jackson-tn', center: 'Jackson TN', program: 'IOP', phase: 'Active care', counselor: 'Morgan Reed', payer: 'Cigna', status: 'Active', last: 'Sep 12, 2026' },
];

const checkIns = [
  { time: 'Expected', patient: 'Jordan Williams', centerId: 'knoxville-bernard', id: 'BHG-20481', visit: 'Medication window', stage: 'Expected', detail: 'Before 11:30 AM' },
  { time: '7:05 AM', patient: 'Taylor Brooks', centerId: 'knoxville-citico', id: 'BHG-20476', visit: 'Medication visit', stage: 'Completed', detail: 'Completed by nursing team' },
  { time: '7:48 AM', patient: 'Alex Johnson', centerId: 'jackson-tn', id: 'BHG-20467', visit: 'Medication window', stage: 'Ready', detail: 'Order verified' },
  { time: '8:16 AM', patient: 'Riley Parker', centerId: 'knoxville-bernard', id: 'BHG-20432', visit: 'Clinical review', stage: 'Hold', detail: 'Provider review required' },
  { time: '8:31 AM', patient: 'Sam Lee', centerId: 'knoxville-citico', id: 'BHG-20415', visit: 'Medication window', stage: 'Waiting', detail: '2 ahead in queue' },
];

const dailyAppointments = [
  { id: 'DAY-1', centerId: 'knoxville-bernard', time: '8:15 AM', patient: 'Riley Parker', type: 'Medication plan review', resource: 'Dr. Marcus Hill', modality: 'In person', mode: 'Clinical Office', status: 'Checked in' },
  { id: 'DAY-2', centerId: 'knoxville-citico', time: '9:00 AM', patient: 'Jamie Carter', type: 'Individual counseling', resource: 'Morgan Reed, LPC', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed', isFollowUp: true, previousSessionSummary: 'Reviewed coping strategies; continue the weekly routine check-in.' },
  { id: 'DAY-3', centerId: 'knoxville-bernard', time: '10:30 AM', patient: 'Jordan Williams', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed', isFollowUp: true, previousSessionSummary: 'Stable mood and sleep; continue grounding and goal review.' },
  { id: 'DAY-6', centerId: 'knoxville-bernard', time: '11:30 AM', patient: 'Avery Thompson', type: 'Recovery plan follow-up', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed', isFollowUp: true, previousSessionSummary: 'Identified two supports; update the weekly action plan.' },
  { id: 'DAY-7', centerId: 'knoxville-bernard', time: '3:00 PM', patient: 'Cameron Ellis', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Pending', isFollowUp: true, previousSessionSummary: 'Reviewed missed-visit barriers and agreed on Zoom follow-up.' },
  { id: 'DAY-8', centerId: 'knoxville-citico', time: '11:00 AM', patient: 'Emerson Davis', type: 'Treatment plan review', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed', isFollowUp: true, previousSessionSummary: 'Reviewed counseling attendance and recovery-support goals.' },
  { id: 'DAY-9', centerId: 'knoxville-citico', time: '3:30 PM', patient: 'Finley Howard', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Pending', isFollowUp: false, previousSessionSummary: '' },
  { id: 'DAY-4', centerId: 'jackson-tn', time: '1:00 PM', patient: 'Group · 8 enrolled', type: 'Recovery skills group', resource: 'Morgan Reed, LPC-MHSP', modality: 'In person', mode: 'Group Room A', status: 'Confirmed', isFollowUp: false, previousSessionSummary: '' },
  { id: 'DAY-5', centerId: 'jackson-tn', time: '2:30 PM', patient: 'New intake', type: 'Comprehensive assessment', resource: 'Dr. Marcus Hill / Intake', modality: 'In person', mode: 'Intake Suite', status: 'Pending' },
  { id: 'DAY-10', centerId: 'jackson-tn', time: '11:00 AM', patient: 'Casey Morgan', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'In person', mode: 'Counseling Room 2', status: 'Confirmed', isFollowUp: false, previousSessionSummary: '' },
  { id: 'DAY-11', centerId: 'jackson-tn', time: '3:30 PM', patient: 'Kendall Wright', type: 'Recovery plan follow-up', resource: 'Morgan Reed, LPC-MHSP', modality: 'In person', mode: 'Counseling Room 2', status: 'Pending', isFollowUp: true, previousSessionSummary: 'Transportation remains a barrier; confirm the support plan.' },
];

const counseling = [
  { patient: 'Jordan Williams', centerId: 'knoxville-bernard', service: 'Individual counseling', counselor: 'Morgan Reed', due: 'Sep 17', completion: 'On track', followUp: 'Review coping routine' },
  { patient: 'Taylor Brooks', centerId: 'knoxville-citico', service: 'Treatment plan review', counselor: 'Morgan Reed', due: 'Today', completion: 'Due today', followUp: 'Confirm patient goals' },
  { patient: 'Casey Morgan', centerId: 'jackson-tn', service: 'Individual counseling', counselor: 'Morgan Reed', due: 'Sep 16', completion: 'On track', followUp: 'Transportation referral offered' },
  { patient: 'Riley Parker', centerId: 'knoxville-bernard', service: 'Initial treatment plan', counselor: 'Morgan Reed', due: 'Overdue', completion: 'Attention', followUp: 'Outreach required' },
];

const uds = [
  { patient: 'Jordan Williams', centerId: 'knoxville-bernard', type: 'Random UDS', collected: 'Sep 12', result: 'Consistent', review: 'Reviewed' },
  { patient: 'Taylor Brooks', centerId: 'knoxville-citico', type: 'Random UDS', collected: 'Sep 14', result: 'Processing', review: 'Pending' },
  { patient: 'Casey Morgan', centerId: 'jackson-tn', type: 'Oral fluid', collected: 'Sep 11', result: 'Consistent', review: 'Reviewed' },
  { patient: 'Riley Parker', centerId: 'knoxville-bernard', type: 'Random UDS', collected: 'Sep 14', result: 'Exception', review: 'Provider review' },
  { patient: 'Avery Thompson', centerId: 'knoxville-bernard', type: 'Random UDS', collected: 'Sep 15', result: 'Processing', review: 'Pending' },
  { patient: 'Jamie Carter', centerId: 'knoxville-citico', type: 'Random UDS', collected: 'Sep 13', result: 'Consistent', review: 'Reviewed' },
  { patient: 'Emerson Davis', centerId: 'knoxville-citico', type: 'Oral fluid', collected: 'Sep 15', result: 'Processing', review: 'Pending' },
  { patient: 'Kendall Wright', centerId: 'jackson-tn', type: 'Random UDS', collected: 'Sep 14', result: 'Exception', review: 'Provider review' },
  { patient: 'Logan Mitchell', centerId: 'jackson-tn', type: 'Random UDS', collected: 'Sep 15', result: 'Consistent', review: 'Reviewed' },
];

const referrals = [
  { id: 'REF-1', patient: 'Jordan Williams', centerId: 'knoxville-bernard', need: 'Transportation support', owner: 'Care coordination', status: 'Patient reviewing' },
  { id: 'REF-2', patient: 'Casey Morgan', centerId: 'jackson-tn', need: 'Peer recovery support', owner: 'Morgan Reed', status: 'Connected' },
  { id: 'REF-3', patient: 'Riley Parker', centerId: 'knoxville-bernard', need: 'Housing resources', owner: 'Social services', status: 'Pending' },
];

const asamDimensions = [
  ['Dimension 1 — Acute intoxication / withdrawal potential', 'Withdrawal management is complete. Current risk is low, with no acute symptoms reported.'],
  ['Dimension 2 — Biomedical conditions & complications', 'No acute medical needs are reported. Continue coordination with the medical team as needed.'],
  ['Dimension 3 — Emotional, behavioral & cognitive conditions', 'Mild situational anxiety is being addressed through counseling and coping-skills practice.'],
  ['Dimension 4 — Readiness to change', 'Action stage — actively engaged in the treatment plan and collaborative goal setting.'],
  ['Dimension 5 — Relapse / continued use potential', 'Moderate risk during early stabilization; a structured routine and regular follow-up remain helpful.'],
  ['Dimension 6 — Recovery environment', 'Stable housing and supportive family contact are reported. Peer-support connection is in progress.'],
];

const treatmentGoals = [
  { title: 'Attend scheduled counseling visits', progress: 80, detail: '4 of the last 5 scheduled sessions completed' },
  { title: 'Maintain treatment stability', progress: 70, detail: 'No missed medication visits this month' },
  { title: 'Build a recovery support network', progress: 45, detail: 'Attending a monthly recovery-skills group' },
];

function buildPatientSessions(patient) {
  const modality = patient.centerId === 'jackson-tn' ? 'In person' : 'Zoom';
  return [
    {
      id: `${patient.id}-SESSION-1`,
      date: 'September 24, 2026',
      time: '10:30 AM',
      service: 'Individual counseling',
      modality,
      status: 'Scheduled',
    },
    {
      id: `${patient.id}-SESSION-2`,
      date: 'September 10, 2026',
      time: '2:00 PM',
      service: 'Individual counseling',
      modality,
      status: 'Completed',
      note: {
        data: `${patient.name} attended the scheduled counseling session and reviewed current routines, recovery supports, and recent barriers to care.`,
        assessment: 'Patient was engaged and able to identify practical coping strategies. Current goals remain appropriate for this phase of treatment.',
        plan: 'Continue the current treatment plan, practice the agreed coping routine, and review progress at the next scheduled session.',
        finalized: 'September 10, 2026 at 3:02 PM',
      },
    },
    {
      id: `${patient.id}-SESSION-3`,
      date: 'August 27, 2026',
      time: '9:00 AM',
      service: 'Treatment plan follow-up',
      modality,
      status: 'Session not held',
      outcome: 'Patient did not attend. Outreach and a rescheduling option were sent through the Patient Portal.',
    },
  ];
}
function buildPatientReports(patient) {
  const existing = uds.find((item) => item.patient === patient.name);
  const firstResult = existing?.result || (Number(patient.id.slice(-1)) % 2 ? 'Consistent' : 'Within expected range');
  const firstReview = existing?.review === 'Reviewed' ? 'Reviewed' : 'Under review';
  return [
    {
      id: `${patient.id}-LAB-1`,
      date: 'September 12, 2026',
      type: 'Urine drug screen (UDS)',
      result: firstResult,
      reviewStatus: firstReview,
      source: 'BHG laboratory interface',
      summary: firstResult === 'Exception' ? 'One or more findings require clinical correlation and follow-up.' : 'Result is consistent with the documented treatment plan.',
    },
    {
      id: `${patient.id}-LAB-2`,
      date: 'August 29, 2026',
      type: 'Oral fluid test',
      result: 'Consistent',
      reviewStatus: 'Reviewed',
      source: 'BHG laboratory interface',
      summary: 'Result is consistent with the documented treatment plan.',
    },
    {
      id: `${patient.id}-LAB-3`,
      date: 'August 14, 2026',
      type: 'Liver function panel',
      result: 'Within expected range',
      reviewStatus: 'Under review',
      source: 'Connected reference laboratory',
      summary: 'Values are available for clinician review; no patient-facing interpretation has been added.',
    },
  ];
}

function createSessionNote(patientName, focus, finalized) {
  return {
    data: `${patientName} attended the scheduled session and participated in a review of ${focus}. The patient discussed recent progress, current supports, and barriers affecting treatment engagement.`,
    assessment: `The patient was engaged and demonstrated insight into the treatment goals discussed. Current presentation supports continuing the established level of care and recovery plan.`,
    plan: `Continue the current treatment plan, practice the agreed recovery strategies, and review progress during the next scheduled counseling session.`,
    finalized,
    author: 'Morgan Reed, LPC-MHSP',
  };
}

const sessionRecords = [
  { id: 'SESSION-101', centerId: 'knoxville-bernard', date: 'September 17, 2026', time: '10:30 AM', patients: ['Jordan Williams'], service: 'Individual counseling', type: 'Individual', modality: 'Zoom', status: 'Scheduled' },
  { id: 'SESSION-102', centerId: 'knoxville-citico', date: 'September 14, 2026', time: '1:00 PM', patients: ['Taylor Brooks'], service: 'Treatment plan review', type: 'Individual', modality: 'Zoom', status: 'Completed', note: createSessionNote('Taylor Brooks', 'treatment-plan goals and attendance progress', 'September 14, 2026 at 1:54 PM') },
  { id: 'SESSION-103', centerId: 'knoxville-bernard', date: 'September 18, 2026', time: '9:00 AM', patients: ['Riley Parker'], service: 'Individual counseling', type: 'Individual', modality: 'Zoom', status: 'Scheduled' },
  {
    id: 'SESSION-104', centerId: 'jackson-tn', date: 'September 13, 2026', time: '2:00 PM', patients: ['Casey Morgan', 'Kendall Wright', 'Reese Bennett'], service: 'Recovery skills group', type: 'Group', modality: 'In person', status: 'Completed',
    attendance: [
      { name: 'Casey Morgan', status: 'Present' },
      { name: 'Kendall Wright', status: 'Present' },
      { name: 'Reese Bennett', status: 'Absent' },
    ],
    groupNotes: {
      'Casey Morgan': createSessionNote('Casey Morgan', 'coping strategies and recovery-support planning', 'September 13, 2026 at 3:18 PM'),
      'Kendall Wright': createSessionNote('Kendall Wright', 'coping strategies and recovery-support planning', 'September 13, 2026 at 3:22 PM'),
    },
  },
  { id: 'SESSION-105', centerId: 'knoxville-bernard', date: 'September 10, 2026', time: '2:00 PM', patients: ['Jordan Williams'], service: 'Individual counseling', type: 'Individual', modality: 'Zoom', status: 'Completed', note: createSessionNote('Jordan Williams', 'current routines, coping strategies, and recovery supports', 'September 10, 2026 at 3:02 PM') },
  { id: 'SESSION-106', centerId: 'jackson-tn', date: 'September 9, 2026', time: '11:00 AM', patients: ['Casey Morgan'], service: 'Individual counseling', type: 'Individual', modality: 'In person', status: 'Completed', note: createSessionNote('Casey Morgan', 'stabilization progress and anxiety-management strategies', 'September 9, 2026 at 11:58 AM') },
  { id: 'SESSION-107', centerId: 'knoxville-citico', date: 'September 8, 2026', time: '3:30 PM', patients: ['Jamie Carter'], service: 'Individual counseling', type: 'Individual', modality: 'Zoom', status: 'Session not held', reason: 'Patient did not join the scheduled Zoom session. Two outreach attempts were made, and a rescheduling option was sent through the Patient Portal.' },
  { id: 'SESSION-108', centerId: 'knoxville-bernard', date: 'September 7, 2026', time: '11:30 AM', patients: ['Cameron Ellis'], service: 'Recovery plan follow-up', type: 'Individual', modality: 'Zoom', status: 'Completed', note: createSessionNote('Cameron Ellis', 'recovery-plan milestones and service engagement', 'September 7, 2026 at 12:20 PM') },
  { id: 'SESSION-109', centerId: 'knoxville-citico', date: 'September 19, 2026', time: '3:30 PM', patients: ['Finley Howard'], service: 'Individual counseling', type: 'Individual', modality: 'Zoom', status: 'Scheduled' },
  { id: 'SESSION-110', centerId: 'jackson-tn', date: 'September 20, 2026', time: '1:00 PM', patients: ['Casey Morgan', 'Kendall Wright', 'Logan Mitchell', 'Peyton Ross'], service: 'Recovery skills group', type: 'Group', modality: 'In person', status: 'Scheduled' },
  { id: 'SESSION-111', centerId: 'jackson-tn', date: 'September 6, 2026', time: '9:30 AM', patients: ['Kendall Wright'], service: 'Treatment plan review', type: 'Individual', modality: 'In person', status: 'Session not held', reason: 'Patient was not present at the treatment center for the scheduled session. The care team documented outreach and offered the next available appointment.' },
  { id: 'SESSION-112', centerId: 'knoxville-bernard', date: 'September 5, 2026', time: '10:00 AM', patients: ['Avery Thompson'], service: 'Individual counseling', type: 'Individual', modality: 'Zoom', status: 'Completed', note: createSessionNote('Avery Thompson', 'maintenance-phase routines and relapse-prevention planning', 'September 5, 2026 at 10:57 AM') },
];

function rowsForCenter(rows, centerId) {
  return centerId === 'all' ? rows : rows.filter((row) => row.centerId === centerId);
}

function timeOrder(value) {
  const match = String(value).match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return (hours * 60) + Number(match[2]);
}

const centerLabels = {
  'knoxville-bernard': 'Knoxville Bernard',
  'knoxville-citico': 'Knoxville Citico',
  'jackson-tn': 'Jackson TN',
};

const defaultCbtHomework = [
  {
    id: 'HW-1',
    patient: 'Jordan Williams',
    patientId: 'BHG-20481',
    title: '3-Column Automatic Thought Record',
    category: 'Cognitive Restructuring',
    assignedDate: 'Sep 10, 2026',
    dueDate: 'Sep 17, 2026',
    status: 'Completed',
    situation: 'High stress shift at work on Monday; colleague called in sick and medication delivery was delayed.',
    automaticThought: '"I can\'t manage this pressure without using. Everything will fall apart."',
    cognitiveDistortion: 'Catastrophizing & All-or-Nothing Thinking',
    rationalResponse: '"I have handled stressful workdays before by taking my scheduled 10-minute break, using 4-7-8 breathing, and texting my peer mentor. Using will only create worse problems tomorrow."',
    outcome: 'Anxiety dropped from 8/10 to 3/10; finished shift without cravings.',
    counselorFeedback: 'Superb evidence evaluation, Jordan. Identifying the catastrophizing trap allowed you to ground yourself before the urge escalated.',
  },
  {
    id: 'HW-2',
    patient: 'Jordan Williams',
    patientId: 'BHG-20481',
    title: 'Urge Surfing & Craving Wave Protocol',
    category: 'Craving Management',
    assignedDate: 'Sep 10, 2026',
    dueDate: 'Sep 17, 2026',
    status: 'Completed',
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

const cbtOutcomesData = {
  'Jordan Williams': {
    phq9: [
      { milestone: 'Intake (March 2026)', score: 17, severity: 'Moderately severe', date: 'Mar 14, 2026', max: 27 },
      { milestone: '90-Day Review (June 2026)', score: 12, severity: 'Moderate', date: 'Jun 12, 2026', max: 27 },
      { milestone: 'Current (September 2026)', score: 6, severity: 'Mild', date: 'Sep 10, 2026', max: 27 },
    ],
    gad7: [
      { milestone: 'Intake (March 2026)', score: 15, severity: 'Severe', date: 'Mar 14, 2026', max: 21 },
      { milestone: '90-Day Review (June 2026)', score: 9, severity: 'Mild', date: 'Jun 12, 2026', max: 21 },
      { milestone: 'Current (September 2026)', score: 4, severity: 'Minimal', date: 'Sep 10, 2026', max: 21 },
    ],
    cravingIndex: [
      { milestone: 'Intake (March 2026)', score: 8, label: 'High (8/10)', date: 'Mar 14, 2026', max: 10 },
      { milestone: '90-Day Review (June 2026)', score: 4, label: 'Moderate (4/10)', date: 'Jun 12, 2026', max: 10 },
      { milestone: 'Current (September 2026)', score: 2, label: 'Low (2/10)', date: 'Sep 10, 2026', max: 10 },
    ],
    summary: 'Significant 65% reduction in depressive symptoms (PHQ-9 17 → 6) and 73% reduction in anxiety (GAD-7 15 → 4). Cravings are well-managed with cognitive reframing and daily grounding routines.',
  },
};

function getPatientOutcomes(patientName) {
  return cbtOutcomesData[patientName] || {
    phq9: [
      { milestone: 'Baseline Intake', score: 16, severity: 'Moderately severe', date: 'Apr 2026', max: 27 },
      { milestone: '90-Day Review', score: 11, severity: 'Moderate', date: 'Jul 2026', max: 27 },
      { milestone: 'Current Review', score: 7, severity: 'Mild', date: 'Sep 2026', max: 27 },
    ],
    gad7: [
      { milestone: 'Baseline Intake', score: 14, severity: 'Moderate', date: 'Apr 2026', max: 21 },
      { milestone: '90-Day Review', score: 9, severity: 'Mild', date: 'Jul 2026', max: 21 },
      { milestone: 'Current Review', score: 5, severity: 'Mild', date: 'Sep 2026', max: 21 },
    ],
    cravingIndex: [
      { milestone: 'Baseline Intake', score: 7, label: 'High (7/10)', date: 'Apr 2026', max: 10 },
      { milestone: '90-Day Review', score: 4, label: 'Moderate (4/10)', date: 'Jul 2026', max: 10 },
      { milestone: 'Current Review', score: 2, label: 'Low (2/10)', date: 'Sep 2026', max: 10 },
    ],
    summary: 'Clinical trajectory demonstrates positive response to CBT coping tools, stabilized medication adherence, and decreasing craving intensity.',
  };
}

const relapsePreventionData = {
  'Jordan Williams': {
    updated: 'September 3, 2026',
    counselor: 'Morgan Reed, LPC-MHSP',
    triggers: [
      { category: 'Internal Thoughts', detail: '"I had a tough week, I deserve a break" or feeling emotionally exhausted after consecutive shifts.' },
      { category: 'Interpersonal Conflict', detail: 'Arguments with estranged family members; unexpected contact with former using acquaintances.' },
      { category: 'Physical / Environmental', detail: 'Poor sleep (< 5 hours); driving past Old Broadway corridor during late evening hours.' },
    ],
    copingTools: [
      { tool: '15-Minute Urge Surfing', steps: 'Set phone timer for 15 minutes. Focus on physical sensation of craving as a wave in chest/throat without fighting it. Notice intensity crest and drop by minute 10.' },
      { tool: '5-4-3-2-1 Sensory Grounding', steps: '5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 deep diaphragmatic breath.' },
      { tool: 'Cognitive Reframing', steps: 'Ask: "What has giving in to this thought cost me in the past? What does staying clean protect today?"' },
    ],
    safeSpaces: [
      'Home living room with spouse present and phone on "do not disturb".',
      'Knoxville Citico Recovery Community Center (open Mon–Sat until 8:00 PM).',
      'Quiet walking path at Victor Ashe Park.',
    ],
    contacts: [
      { role: 'Personal Support', name: 'Sarah Williams (Spouse)', contact: 'Verified support · (865) 555-0142' },
      { role: 'Peer Recovery Specialist', name: 'Marcus B. (Peer Support)', contact: 'BHG Peer Specialist · Available 8 AM – 4 PM' },
      { role: 'Clinic Hours Line', name: 'BHG Knoxville Bernard', contact: '(865) 555-2040 · Mon–Fri 5:30 AM – 1:30 PM' },
      { role: '24/7 Crisis Line', name: '988 Suicide & Crisis Lifeline', contact: 'Dial 988 (Free, confidential 24/7)' },
      { role: 'State Referral', name: 'Tennessee REDLINE', contact: '1-800-889-9789 (24/7 Addiction Hotline)' },
    ],
  },
};

function getRelapsePlan(patientName) {
  return relapsePreventionData[patientName] || {
    updated: 'August 28, 2026',
    counselor: 'Morgan Reed, LPC-MHSP',
    triggers: [
      { category: 'Internal Triggers', detail: 'Fatigue, sudden mood shifts, catastrophic thoughts when facing unexpected stress.' },
      { category: 'External Triggers', detail: 'Old hangouts, paydays, social isolation on weekends.' },
    ],
    copingTools: [
      { tool: 'Urge Surfing Protocol', steps: 'Notice physical craving sensation as a wave that peaks and naturally recedes.' },
      { tool: '5-4-3-2-1 Grounding', steps: 'Engage sensory observation to redirect automatic cognitive spirals.' },
    ],
    safeSpaces: [
      'Primary residence with recovery-supportive family.',
      'Local 12-step or SMART Recovery meeting hall.',
    ],
    contacts: [
      { role: 'Primary Recovery Contact', name: 'Designated Support Person', contact: 'Family / Sponsor contact' },
      { role: 'BHG Treatment Center', name: 'Clinic Nursing & Counselor Desk', contact: 'Clinic Hours Direct Line' },
      { role: '24/7 Crisis Hotline', name: '988 Suicide & Crisis Lifeline', contact: 'Dial 988' },
    ],
  };
}

const cbtResourceLibrary = [
  {
    id: 'CBT-RES-1',
    title: '10 Common Cognitive Distortions Cheat Sheet',
    category: 'Cognitive Restructuring',
    summary: 'Patient-friendly guide identifying thinking traps like all-or-nothing thinking, catastrophizing, mind reading, and emotional reasoning.',
    duration: '4 min read',
    instructions: "Review this list when you notice a sudden spike in anxiety or an urge to use. Ask yourself: 'Which of these 10 thinking traps is my mind falling into right now?'",
    content: "1. All-or-Nothing Thinking: Seeing things in black-or-white categories. If a situation isn't perfect, you see it as a total failure.\n2. Overgeneralization: Viewing a single negative event as a never-ending pattern of defeat.\n3. Mental Filter: Dwelling on a single negative detail exclusively, so that your vision of all reality becomes darkened.\n4. Disqualifying the Positive: Rejecting positive experiences by insisting they 'don't count' for some reason.\n5. Jumping to Conclusions: Interpreting things negatively without supporting facts (Mind Reading or Fortune Telling).\n6. Magnification (Catastrophizing) or Minimization: Exaggerating the importance of your problems or shrinking desirable qualities.\n7. Emotional Reasoning: Assuming that your negative emotions reflect how things really are: 'I feel it, therefore it must be true.'\n8. 'Should' Statements: Telling yourself that things should be the way you hoped or expected them to be.\n9. Labeling: An extreme form of all-or-nothing thinking; assigning a global negative label to yourself or others.\n10. Personalization: Holding yourself personally responsible for an event that isn't entirely under your control.",
  },
  {
    id: 'CBT-RES-2',
    title: 'Marlatt Urge Surfing Protocol',
    category: 'Craving Management',
    summary: 'Evidence-based mindfulness technique to ride the craving wave without acting out. Includes the 15-minute timer method.',
    duration: '3 min exercise',
    instructions: 'Cravings are like ocean waves—they build in intensity, crest at 5-10 minutes, and naturally subside. You do not need to fight the wave; you only need to surf it.',
    content: "Step 1: Notice and Acknowledge\nRecognize that a craving is occurring. Say to yourself: 'I am experiencing an urge to use right now. This is a temporary brain signal, not a command.'\n\nStep 2: Set a 15-Minute Timer\nCommit to doing nothing except observing the sensation for the next 15 minutes. Put your phone timer on.\n\nStep 3: Track Physical Sensations\nWhere is the craving in your body? Notice tightness in your chest, dryness in throat, or restlessness in hands. Describe the physical sensation objectively without judgment.\n\nStep 4: Practice Diaphragmatic Breathing\nInhale slowly for 4 seconds, hold for 4 seconds, exhale for 6 seconds. Imagine the breath flowing around the craving sensation.\n\nStep 5: Watch the Wave Crest & Fall\nNotice that at minute 6-8, the intensity peaks and begins dropping. By minute 12-15, the wave has broken.",
  },
  {
    id: 'CBT-RES-3',
    title: '3-Column Automatic Thought Record Template',
    category: 'Cognitive Restructuring',
    summary: 'Standard CBT worksheet helping patients capture triggers, automatic beliefs, and generate rational counter-evidence.',
    duration: '5 min practice',
    instructions: 'Use this 3-column table whenever an activating situation causes emotional distress or a craving urge.',
    content: "Column 1: Activating Situation / Trigger\nWho, what, when, where. What happened right before the negative feeling?\n\nColumn 2: Automatic Thought & Cognitive Trap\nWhat ran through your mind? (e.g. 'I can't stand this pressure, I need to use to cope.') What distortion is present (e.g. Catastrophizing)?\n\nColumn 3: Rational Counter-Response & Outcome\nWhat does factual evidence say? What have you handled before? (e.g. 'This workday is stressful, but using will destroy my job and family tomorrow. I can take a 10-minute walk and call my peer mentor.') Outcome: Rate distress drop.",
  },
  {
    id: 'CBT-RES-4',
    title: 'Sleep Hygiene & Stimulus Control for Recovery',
    category: 'Behavioral Activation',
    summary: 'Bedtime routines, blue-light boundaries, and circadian stabilization strategies for patients during medication transitions.',
    duration: '5 min read',
    instructions: 'Stable sleep restores frontal lobe executive control, which is essential for emotional regulation and craving resistance.',
    content: "1. Stimulus Control: Bed is strictly for sleep. If you are awake after 20 minutes, get out of bed and sit in dim lighting with a non-screen book until sleepy.\n2. Circadian Consistency: Wake up at the exact same time 7 days a week, regardless of when you fell asleep.\n3. Light Boundaries: No smartphone or television screens within 60 minutes of bedtime.\n4. Caffeine Cutoff: No caffeine after 12:00 PM noon.\n5. Evening Decompression: 10 minutes of gentle stretching or 4-7-8 relaxation breathing before lights out.",
  },
  {
    id: 'CBT-RES-5',
    title: '5-4-3-2-1 Sensory Grounding Guide',
    category: 'Anxiety & Panic',
    summary: 'Immediate grounding exercise for acute anxiety, panic spikes, or intense situational triggers.',
    duration: '2 min exercise',
    instructions: 'When anxiety spikes or obsessive thoughts spiral, ground your nervous system in the present environment.',
    content: "Look around your immediate surroundings right now:\n• 5 Things You Can SEE: Name 5 distinct objects (e.g. lamp, pattern on floor, picture frame).\n• 4 Things You Can TOUCH: Notice physical texture (e.g. cotton shirt, cold tabletop, denim fabric).\n• 3 Things You Can HEAR: Listen for ambient sounds (e.g. air conditioning hum, passing car, distant clock).\n• 2 Things You Can SMELL: Notice coffee, fresh air, soap, or clean shirt.\n• 1 Thing You Can TASTE: Sip cold water, notice mint, or take one deep diaphragmatic breath.",
  },
  {
    id: 'CBT-RES-6',
    title: 'Decatastrophizing & Probability Matrix',
    category: 'Cognitive Restructuring',
    summary: 'Helps patients separate imagined worst-case scenarios from realistic probabilities and manageable outcomes.',
    duration: '4 min exercise',
    instructions: "When your mind says 'Everything will be ruined', systematically evaluate the real probability.",
    content: "Question 1: What is the absolute worst that could happen?\nQuestion 2: If that worst-case happened, how would I cope? Who would help me?\nQuestion 3: What is the realistic, most probable outcome based on history?\nQuestion 4: What is the best that could happen?\nQuestion 5: What is one small, practical action I can take in the next 15 minutes?",
  },
];

function buildPatientGroupNote(patientName, patientId, status, groupName, topic, finalized = 'September 13, 2026 at 3:15 PM') {
  if (status === 'Absent' || status === 'Excused') {
    return {
      participationSummary: `${status === 'Absent' ? 'Absent due to work/transit barrier' : 'Excused for medical dosing review'}; proactive counselor follow-up completed.`,
      individualNote: {
        data: `${patientName} (${patientId}) was documented as ${status} for the scheduled ${groupName} session focusing on "${topic}".`,
        assessment: `Patient communicated barrier proactively. Overall treatment engagement remains active. Recovery supports and home environment stable.`,
        plan: `Session handout provided via Patient Portal CBT library. Offered 15-minute 1-on-1 check-in before next session.`,
        serviceCode: 'Non-billable (Documented absence/excusal)',
        finalized,
        author: 'Morgan Reed, LPC-MHSP',
      },
    };
  }

  const focusSnippets = [
    `Patient engaged constructively during the group discussion on "${topic}". Demonstrated solid grasp of cognitive reframing and urge surfing.`,
    `Actively participated in group exercises on "${topic}". Shared recent trigger experience and validated peer feedback.`,
    `Contributed to group dialogue regarding "${topic}". Identified personalized relapse prevention barriers and recovery supports.`,
    `Attended and focused throughout the session on "${topic}". Practiced grounding techniques and committed to between-session practice.`,
  ];
  const hash = (patientName.length + (patientId ? patientId.length : 0)) % focusSnippets.length;

  return {
    participationSummary: focusSnippets[hash],
    individualNote: {
      data: `${patientName} (${patientId}) attended the full group session on "${topic}". Patient was alert, oriented x4, and participated constructively in group discussions, sharing specific challenges and coping strategies.`,
      assessment: `Patient demonstrates consistent investment in the recovery process and positive group cohesion. Understanding of CBT and relapse prevention concepts is progressing appropriately. Mood euthymic, affect congruent, no acute distress reported.`,
      plan: `Continue group therapy cohort attendance as scheduled. Complete between-session skill practice in the patient portal. Review progress at next group meeting.`,
      serviceCode: 'H0015 - Group Psychotherapy (MAT IOP, 60 min)',
      finalized,
      author: 'Morgan Reed, LPC-MHSP',
    },
  };
}

const defaultGroupPrograms = [
  {
    id: 'GRP-101',
    centerId: 'knoxville-bernard',
    name: 'Recovery Skills Group',
    status: 'Scheduled',
    schedule: 'Tuesdays & Thursdays · 1:00 PM – 2:00 PM',
    sessionDate: 'Thursday, Sep 17, 2026',
    sessionTime: '1:00 PM – 2:00 PM',
    modality: 'In person',
    location: 'Knoxville Bernard · Group Room A',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'Coping with High-Risk Social Triggers & Urge Surfing',
    capacity: '8 / 12 enrolled',
    attendance: [
      { name: 'Casey Morgan', id: 'BHG-20459', status: 'Present', notes: 'Active participation in role-play' },
      { name: 'Kendall Wright', id: 'BHG-20296', status: 'Present', notes: 'Discussed transit barriers' },
      { name: 'Reese Bennett', id: 'BHG-20251', status: 'Absent', notes: 'Work conflict reported' },
      { name: 'Logan Mitchell', id: 'BHG-20283', status: 'Present', notes: 'Shared grounding technique' },
      { name: 'Peyton Ross', id: 'BHG-20268', status: 'Present', notes: 'Identified 2 peer supports' },
      { name: 'Cameron Ellis', id: 'BHG-20371', status: 'Present', notes: 'Discussed craving peaks' },
      { name: 'Jordan Williams', id: 'BHG-20481', status: 'Present', notes: 'Shared 15-min urge surfing log' },
      { name: 'Avery Thompson', id: 'BHG-20384', status: 'Present', notes: 'Active in group goal setting' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Recovery Skills Group', 'Coping with High-Risk Social Triggers & Urge Surfing', 'September 13, 2026 at 3:15 PM'), ...m })),
    lastGroupDapNote: {
      data: '8 patients attended the Recovery Skills group. Group focused on identifying sudden social cues and practicing Marlatt urge-surfing protocol.',
      assessment: 'Cohort demonstrated positive cohesion and shared personal coping reframings. High risk triggers identified around late-afternoon fatigue.',
      plan: 'Each attendee to log at least one urge-surfing or grounding exercise prior to next Thursday session.',
      finalized: 'September 13, 2026 at 3:15 PM',
      locked: true,
    },
    previousAppointment: {
      date: 'Thursday, Sep 10, 2026',
      time: '1:00 PM – 2:00 PM',
      topic: 'Urge Surfing Fundamentals & Managing Environmental Cues',
      attendance: '7 of 8 attended (88%)',
      modality: 'In person',
      status: 'Completed & Documented',
      summary: 'Reviewed Marlatt wave model. Casey and Jordan shared live trigger logs.',
    },
  },
  {
    id: 'GRP-102',
    centerId: 'knoxville-citico',
    name: 'Early Stabilization CBT Group',
    status: 'Completed',
    schedule: 'Wednesdays · 10:00 AM – 11:00 AM',
    sessionDate: 'Wednesday, Sep 16, 2026',
    sessionTime: '10:00 AM – 11:00 AM',
    modality: 'Zoom',
    location: 'Secure Zoom Telehealth Room',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'Identifying Cognitive Traps: Catastrophizing vs. Rational Evidence',
    capacity: '5 / 8 enrolled',
    attendance: [
      { name: 'Jordan Williams', id: 'BHG-20481', status: 'Present', notes: 'Completed thought record review' },
      { name: 'Taylor Brooks', id: 'BHG-20476', status: 'Present', notes: 'Addressed all-or-nothing trap' },
      { name: 'Riley Parker', id: 'BHG-20432', status: 'Excused', notes: 'Attended medical dosing review' },
      { name: 'Jamie Carter', id: 'BHG-20398', status: 'Present', notes: 'Practiced probability testing' },
      { name: 'Emerson Davis', id: 'BHG-20342', status: 'Present', notes: 'Engaged in group discussion' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Early Stabilization CBT Group', 'Identifying Cognitive Traps: Catastrophizing vs. Rational Evidence', 'September 16, 2026 at 11:15 AM'), ...m })),
    lastGroupDapNote: {
      data: 'Group conducted via secure telehealth. Explored common thinking errors during induction and dose stabilization.',
      assessment: 'Patients engaged well with the 3-column thought record model. Taylor and Jordan provided peer reinforcement on catastrophizing.',
      plan: 'Members will practice identifying one cognitive trap during stressful moments this week.',
      finalized: 'September 16, 2026 at 11:15 AM',
      locked: true,
    },
    previousAppointment: {
      date: 'Wednesday, Sep 9, 2026',
      time: '10:00 AM – 11:00 AM',
      topic: 'Introduction to 3-Column Automatic Thought Records',
      attendance: '5 of 5 attended (100%)',
      modality: 'Zoom Telehealth',
      status: 'Completed & Documented',
      summary: 'Explored cognitive distortions and reframing self-stigma during induction.',
    },
  },
  {
    id: 'GRP-103',
    centerId: 'jackson-tn',
    name: 'Relapse Prevention & Maintenance Group',
    status: 'Completed',
    schedule: 'Fridays · 2:00 PM – 3:30 PM',
    sessionDate: 'Friday, Sep 11, 2026',
    sessionTime: '2:00 PM – 3:30 PM',
    modality: 'In person',
    location: 'Jackson TN · Counseling Room 1',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'Marlatt Relapse Prevention & Building Safe Recovery Environments',
    capacity: '6 / 10 enrolled',
    attendance: [
      { name: 'Drew Sullivan', id: 'BHG-20356', status: 'Present', notes: 'Updated safe contact list' },
      { name: 'Emerson Davis', id: 'BHG-20342', status: 'Present', notes: 'Discussed sleep hygiene boundaries' },
      { name: 'Finley Howard', id: 'BHG-20327', status: 'Present', notes: 'Reviewed high-risk transit routes' },
      { name: 'Harper Lewis', id: 'BHG-20315', status: 'Present', notes: 'Shared community meeting resources' },
      { name: 'Casey Morgan', id: 'BHG-20459', status: 'Present', notes: 'Identified peer support mentor' },
      { name: 'Logan Mitchell', id: 'BHG-20283', status: 'Present', notes: 'Active in safety planning' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Relapse Prevention & Maintenance Group', 'Marlatt Relapse Prevention & Building Safe Recovery Environments', 'September 11, 2026 at 3:45 PM'), ...m })),
    lastGroupDapNote: {
      data: 'Maintenance group convened in person. Reviewed individual safety contacts and environmental trigger avoidance plans.',
      assessment: 'Group members demonstrated stable recovery engagement. Good peer support exchange regarding handling family holiday stress.',
      plan: 'Review updated crisis contacts and emergency 988/Redline cards at next session.',
      finalized: 'September 11, 2026 at 3:45 PM',
      locked: true,
    },
    previousAppointment: {
      date: 'Friday, Sep 4, 2026',
      time: '2:00 PM – 3:30 PM',
      topic: 'Social Safety Nets & Assertive Refusal Rehearsals',
      attendance: '6 of 6 attended (100%)',
      modality: 'In person',
      status: 'Completed & Documented',
      summary: 'Practiced refusal scripts for social gatherings and weekend trigger avoidance.',
    },
  },
  {
    id: 'GRP-104',
    centerId: 'knoxville-bernard',
    name: 'Evening Seeking Safety & CBT Group',
    status: 'Scheduled',
    schedule: 'Mondays · 5:30 PM – 6:45 PM',
    sessionDate: 'Monday, Sep 21, 2026',
    sessionTime: '5:30 PM – 6:45 PM',
    modality: 'Zoom',
    location: 'Secure Zoom Telehealth Room 2',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'Grounding Skills for Evening Trigger Windows & Safe Coping',
    capacity: '7 / 10 enrolled',
    attendance: [
      { name: 'Jordan Williams', id: 'BHG-20481', status: 'Present', notes: 'Discussed evening de-escalation' },
      { name: 'Riley Parker', id: 'BHG-20432', status: 'Present', notes: 'Practiced 5-4-3-2-1 technique' },
      { name: 'Drew Sullivan', id: 'BHG-20356', status: 'Present', notes: 'Reviewed safe recovery routine' },
      { name: 'Cameron Ellis', id: 'BHG-20371', status: 'Excused', notes: 'Evening shift conflict' },
      { name: 'Avery Thompson', id: 'BHG-20384', status: 'Present', notes: 'Offered peer support' },
      { name: 'Jamie Carter', id: 'BHG-20398', status: 'Present', notes: 'Shared grounding victory' },
      { name: 'Kendall Wright', id: 'BHG-20296', status: 'Present', notes: 'Attended via telehealth' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Evening Seeking Safety & CBT Group', 'Grounding Skills for Evening Trigger Windows & Safe Coping', 'September 14, 2026 at 7:00 PM'), ...m })),
    lastGroupDapNote: {
      data: 'Evening cohort convened via Zoom. Practiced grounding and somatic safety for late-evening triggers.',
      assessment: 'High cohesion; patients reported benefit from post-work evening group structure.',
      plan: 'Next session: explore safe sleep rituals and stimulus control.',
      finalized: 'September 14, 2026 at 7:00 PM',
      locked: true,
    },
    previousAppointment: {
      date: 'Monday, Sep 7, 2026',
      time: '5:30 PM – 6:45 PM',
      topic: 'Somatic Safety & Identifying Early Nervous System Arousal',
      attendance: '6 of 7 attended (86%)',
      modality: 'Zoom Telehealth',
      status: 'Completed & Documented',
      summary: 'Reviewed somatic body mapping of cravings; introduced 4-7-8 relaxation breath.',
    },
  },
  {
    id: 'GRP-105',
    centerId: 'knoxville-citico',
    name: 'Mindfulness & Craving Mastery Cohort',
    status: 'Completed',
    schedule: 'Thursdays · 11:30 AM – 12:45 PM',
    sessionDate: 'Thursday, Sep 10, 2026',
    sessionTime: '11:30 AM – 12:45 PM',
    modality: 'In person',
    location: 'Knoxville Citico · Group Room 2',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'Mindfulness-Based Relapse Prevention & Decatastrophizing',
    capacity: '6 / 8 enrolled',
    attendance: [
      { name: 'Taylor Brooks', id: 'BHG-20476', status: 'Present', notes: 'Practiced urge surfing timer' },
      { name: 'Emerson Davis', id: 'BHG-20342', status: 'Present', notes: 'Completed probability worksheet' },
      { name: 'Finley Howard', id: 'BHG-20327', status: 'Present', notes: 'Engaged in mindful breathing' },
      { name: 'Harper Lewis', id: 'BHG-20315', status: 'Present', notes: 'Active in group discussion' },
      { name: 'Jamie Carter', id: 'BHG-20398', status: 'Present', notes: 'Identified trigger cues' },
      { name: 'Casey Morgan', id: 'BHG-20459', status: 'Excused', notes: 'Medical review appointment' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Mindfulness & Craving Mastery Cohort', 'Mindfulness-Based Relapse Prevention & Decatastrophizing', 'September 10, 2026 at 1:15 PM'), ...m })),
    lastGroupDapNote: {
      data: 'Mindfulness cohort held in Room 2. Conducted body scan and craving probability analysis.',
      assessment: 'Patients expressed reduction in anticipatory panic regarding dosing windows.',
      plan: 'Complete one mindfulness exercise before next Thursday meeting.',
      finalized: 'September 10, 2026 at 1:15 PM',
      locked: true,
    },
    previousAppointment: {
      date: 'Thursday, Sep 3, 2026',
      time: '11:30 AM – 12:45 PM',
      topic: 'The Habit Loop & Mindful Cue Interruption',
      attendance: '5 of 6 attended (83%)',
      modality: 'In person',
      status: 'Completed & Documented',
      summary: 'Analyzed cue-routine-reward loop and substituted behavioral urge surfing.',
    },
  },
  {
    id: 'GRP-106',
    centerId: 'jackson-tn',
    name: 'Behavioral Activation & Routine Rebuilding',
    status: 'Scheduled',
    schedule: 'Tuesdays · 10:00 AM – 11:15 AM',
    sessionDate: 'Tuesday, Sep 22, 2026',
    sessionTime: '10:00 AM – 11:15 AM',
    modality: 'In person',
    location: 'Jackson TN · Community Room',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'Structuring Weekly Mastery & Pleasure Schedules',
    capacity: '5 / 8 enrolled',
    attendance: [
      { name: 'Casey Morgan', id: 'BHG-20459', status: 'Present', notes: 'Drafted weekly schedule' },
      { name: 'Kendall Wright', id: 'BHG-20296', status: 'Present', notes: 'Added peer support walk' },
      { name: 'Logan Mitchell', id: 'BHG-20283', status: 'Present', notes: 'Scheduled hobby block' },
      { name: 'Peyton Ross', id: 'BHG-20268', status: 'Present', notes: 'Structured weekend hours' },
      { name: 'Drew Sullivan', id: 'BHG-20356', status: 'Present', notes: 'Identified leisure goals' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Behavioral Activation & Routine Rebuilding', 'Structuring Weekly Mastery & Pleasure Schedules', 'September 15, 2026 at 11:30 AM'), ...m })),
    lastGroupDapNote: {
      data: 'Cohort focused on behavioral activation to counteract post-acute withdrawal boredom.',
      assessment: 'High patient commitment to scheduling positive reinforcement activities.',
      plan: 'Track Mastery & Pleasure scores daily in patient app.',
      finalized: 'September 15, 2026 at 11:30 AM',
      locked: false,
    },
    previousAppointment: {
      date: 'Tuesday, Sep 8, 2026',
      time: '10:00 AM – 11:15 AM',
      topic: 'Overcoming Post-Acute Anhedonia with Small Micro-Habits',
      attendance: '5 of 5 attended (100%)',
      modality: 'In person',
      status: 'Completed & Documented',
      summary: 'Discussed dopamine reset and built 10-minute daily mastery activities.',
    },
  },
  {
    id: 'GRP-107',
    centerId: 'knoxville-bernard',
    name: 'Seeking Safety Trauma & Recovery Group',
    status: 'Session not held',
    schedule: 'Mondays · 1:00 PM – 2:30 PM',
    sessionDate: 'Monday, Sep 14, 2026',
    sessionTime: '1:00 PM – 2:30 PM',
    modality: 'In person',
    location: 'Knoxville Bernard · Group Room B',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'Grounding & Compassionate Emotional Safety',
    capacity: '7 / 10 enrolled',
    reason: 'Treatment center delayed opening due to severe regional storm and localized flash flooding. Enrolled cohort participants received broadcast portal alert and phone notification. Session rescheduled to Thursday, Sep 17.',
    outreachStatus: '7 of 7 patients notified via Portal & SMS',
    rescheduledDate: 'Thursday, Sep 17, 2026 at 1:00 PM',
    attendance: [
      { name: 'Jordan Williams', id: 'BHG-20481', status: 'Excused', notes: 'Confirmed storm closure receipt' },
      { name: 'Riley Parker', id: 'BHG-20432', status: 'Excused', notes: 'Contacted clinic nurse' },
      { name: 'Casey Morgan', id: 'BHG-20459', status: 'Excused', notes: 'Accepted makeup session' },
      { name: 'Logan Mitchell', id: 'BHG-20283', status: 'Excused', notes: 'Acknowledged SMS alert' },
      { name: 'Peyton Ross', id: 'BHG-20268', status: 'Excused', notes: 'Rescheduled to Sep 17' },
      { name: 'Taylor Brooks', id: 'BHG-20476', status: 'Excused', notes: 'Safe at home' },
      { name: 'Jamie Carter', id: 'BHG-20398', status: 'Excused', notes: 'Attending Thursday makeup' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Seeking Safety Trauma & Recovery Group', 'Grounding & Compassionate Emotional Safety', 'September 14, 2026 at 1:15 PM'), ...m })),
  },
  {
    id: 'GRP-108',
    centerId: 'knoxville-citico',
    name: 'Weekend Relapse Prevention Quorum',
    status: 'Session not held',
    schedule: 'Saturdays · 9:30 AM – 10:45 AM',
    sessionDate: 'Saturday, Sep 12, 2026',
    sessionTime: '9:30 AM – 10:45 AM',
    modality: 'Zoom',
    location: 'Secure Zoom Telehealth Room 3',
    facilitator: 'Morgan Reed, LPC-MHSP',
    focusTopic: 'High-Risk Weekend Triggers & Boundary Defense',
    capacity: '6 / 8 enrolled',
    reason: 'Cohort quorum threshold not met (< 3 confirmed participants due to holiday travel). Facilitator conducted brief 15-minute 1-on-1 supportive check-ins with the 2 attending patients in lieu of group billing.',
    outreachStatus: 'Quorum exception documented; 1-on-1 check-ins completed',
    rescheduledDate: 'Saturday, Sep 19, 2026 at 9:30 AM',
    attendance: [
      { name: 'Taylor Brooks', id: 'BHG-20476', status: 'Excused', notes: 'Completed 1-on-1 check-in' },
      { name: 'Jamie Carter', id: 'BHG-20398', status: 'Excused', notes: 'Completed 1-on-1 check-in' },
      { name: 'Emerson Davis', id: 'BHG-20342', status: 'Absent', notes: 'Holiday travel reported' },
      { name: 'Finley Howard', id: 'BHG-20327', status: 'Absent', notes: 'Family commitment' },
      { name: 'Harper Lewis', id: 'BHG-20315', status: 'Absent', notes: 'Family commitment' },
      { name: 'Riley Parker', id: 'BHG-20432', status: 'Absent', notes: 'Work conflict' },
    ].map((m) => ({ ...buildPatientGroupNote(m.name, m.id, m.status, 'Weekend Relapse Prevention Quorum', 'High-Risk Weekend Triggers & Boundary Defense', 'September 12, 2026 at 10:00 AM'), ...m })),
  },
];

function AdminHeader({ eyebrow, title, description, action, onAction }) {
  return (
    <div className="bhg-page-header">
      <div>
        <div className="bhg-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <button className="bhg-button" onClick={onAction}>{action}<ArrowRight size={15} /></button>}
    </div>
  );
}
function Stat({ icon: Icon, label, value, note, items = [], tone = 'primary', action, onClick }) {
  if (onClick) {
    return (
      <button type="button" className={`bhg-admin-stat bhg-admin-stat-action ${tone}`} onClick={onClick}>
        <span className="bhg-admin-stat-icon"><Icon size={18} /></span>
        <span className="bhg-admin-stat-content">
          <small>{label}</small><strong>{value}</strong><p>{note}</p>
          <span className="bhg-admin-stat-list">
            {items.slice(0, 3).map((item, index) => <span className="bhg-admin-stat-list-item" key={`${item.primary}-${index}`}><b>{item.primary}</b><em>{item.secondary}</em></span>)}
          </span>
        </span>
        <span className="bhg-admin-stat-link">{action}<ArrowRight size={14} /></span>
      </button>
    );
  }
  return (
    <div className={`bhg-admin-stat ${tone}`}>
      <span><Icon size={18} /></span>
      <div><small>{label}</small><strong>{value}</strong><p>{note}</p></div>
    </div>
  );
}
function Status({ children }) {
  const value = String(children).toLowerCase();
  const tone = /completed|confirmed|active|consistent|reviewed|on track|checked in/.test(value)
    ? 'success'
    : /not held|hold|attention|exception|overdue/.test(value) ? 'danger'
      : /under review|pending|waiting|processing|due today/.test(value) ? 'warning' : 'primary';
  return <span className={`bhg-pill bhg-pill-${tone}`}>{children}</span>;
}

function Table({ columns, rows, render }) {
  return (
    <div className="bhg-admin-table-wrap">
      <table className="bhg-admin-table">
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={row.id || `${row.patient}-${index}`}>{render(row)}</tr>)}</tbody>
      </table>
    </div>
  );
}
function AdminSearchBar({ value, onChange, placeholder = 'Search...', onClear, actionButton, style }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap', width: '100%', ...style }}>
      <div className="search-bar bhg-admin-search" style={{ flex: 1, minWidth: 260, background: 'white' }}>
        <Search size={16} color="#64748B" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '13.5px' }}
        />
        {value && (
          <X size={14} style={{ cursor: 'pointer', color: '#64748B' }} onClick={onClear || (() => onChange(''))} />
        )}
      </div>
      {actionButton}
    </div>
  );
}

function AdminFilterBar({ options, value, onChange, label, style, chipStyle }) {
  return (
    <div
      className="filter-bar bhg-admin-filter-bar"
      role="group"
      aria-label={label || 'Filter options'}
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        flexWrap: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 4,
        ...style,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`filter-chip${value === opt ? ' active' : ''}`}
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          style={{
            fontSize: '12.5px',
            padding: '6px 14px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            background: value === opt ? '#005A70' : 'white',
            color: value === opt ? 'white' : '#475569',
            border: value === opt ? '1px solid #005A70' : '1px solid #CBD5E1',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: value === opt ? 600 : 500,
            ...chipStyle,
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function WorkQueue({ limit, compact = false }) {
  const { workItems, resolveWorkItem, addToast, selectedTreatmentCenterId } = useApp();
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const openItems = workItems.filter((item) => item.status !== 'Resolved' && (
    selectedTreatmentCenterId === 'all' || (item.centerId || 'knoxville-bernard') === selectedTreatmentCenterId
  ));
  const items = limit ? openItems.slice(0, limit) : openItems;
  const resolve = () => {
    if (!response.trim()) return;
    resolveWorkItem(selected.id, response.trim());
    addToast('Request resolved and patient notified.');
    setSelected(null);
    setResponse('');
  };
  return (
    <>
      {items.length ? (
        compact ? (
          <div className="bhg-response-list">
            {items.map((row) => (
              <button type="button" className="bhg-response-item" key={row.id} onClick={() => { setSelected(row); setResponse(''); }}>
                <span className="bhg-response-main"><strong>{row.type}</strong><small>{row.patient} · {centerLabels[row.centerId || 'knoxville-bernard']}</small></span>
                <span className="bhg-response-meta"><Status>{row.status}</Status><small>{row.created}</small></span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        ) : (
          <Table columns={['Request', 'Patient', 'Center', 'Received', 'Status', 'Action']} rows={items} render={(row) => <>
            <td><strong>{row.type}</strong><small>{row.title}</small></td>
            <td>{row.patient}</td><td>{centerLabels[row.centerId || 'knoxville-bernard']}</td><td>{row.created}</td><td><Status>{row.status}</Status></td>
            <td><button className="bhg-text-button" onClick={() => { setSelected(row); setResponse(''); }}>Review</button></td>
          </>} />
        )
      ) : <div className="bhg-admin-empty"><CheckCircle2 size={22} /><strong>All patient requests are resolved</strong><span>New requests will appear here automatically.</span></div>}
      {selected && <WorkflowModal title={selected.type} subtitle={`${selected.patient} · ${selected.created}`} onClose={() => setSelected(null)} footer={<><button className="bhg-button bhg-button-secondary" onClick={() => setSelected(null)}>Cancel</button><button className="bhg-button" disabled={!response.trim()} onClick={resolve}>Resolve and notify patient</button></>}>
        <DemoBanner>This response will appear in the patient portal’s notifications and secure messages.</DemoBanner>
        <div className="bhg-request-detail"><strong>{selected.title}</strong><p>{selected.detail}</p></div>
        <Field label="Response to patient"><textarea rows="4" value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Explain the next step in patient-friendly language…" /></Field>
      </WorkflowModal>}
    </>
  );
}

export function AdminDashboard() {
  const { navigate, workItems, appointmentProposals, appointmentOutcomes, clinicianMessages = [], selectedTreatmentCenterId, selectedTreatmentCenter, resetDemo, addToast } = useApp();
  const [dashboardHomework, setDashboardHomework] = useState(defaultCbtHomework);
  const [selectedDashboardHw, setSelectedDashboardHw] = useState(null);
  const [counselorFeedbackDraft, setCounselorFeedbackDraft] = useState('');

  const centerPatients = rowsForCenter(patients, selectedTreatmentCenterId);
  const centerAppointments = rowsForCenter(dailyAppointments, selectedTreatmentCenterId);
  const centerOutcomes = rowsForCenter(appointmentOutcomes, selectedTreatmentCenterId);
  const centerProposals = rowsForCenter(appointmentProposals, selectedTreatmentCenterId);
  const centerUds = rowsForCenter(uds, selectedTreatmentCenterId);
  const centerOpenWorkItems = workItems.filter((item) => item.status !== 'Resolved' && (selectedTreatmentCenterId === 'all' || (item.centerId || 'knoxville-bernard') === selectedTreatmentCenterId));
  const openWorkItems = centerOpenWorkItems.length;
  const missedVisitRecords = centerOutcomes.filter((item) => item.outcome === 'Patient did not attend');
  const missedVisits = missedVisitRecords.length;
  const pendingOffers = centerProposals.filter((item) => item.status === 'Awaiting patient response').length;
  const reviewedReports = centerUds.filter((item) => item.review === 'Reviewed').length;
  const reportsNeedingReview = centerUds.filter((item) => item.review !== 'Reviewed').length;
  const clinicianAppointments = centerAppointments.filter((item) => /Morgan Reed/i.test(item.resource)).sort((a, b) => timeOrder(a.time) - timeOrder(b.time));
  const upcomingAppointment = clinicianAppointments[0];
  const programSummary = ['OBOT', 'IOP', 'OTP'].map((program) => `${centerPatients.filter((item) => item.program === program).length} ${program}`).join(' · ');
  const modalitySummary = `${clinicianAppointments.filter((item) => item.modality === 'Zoom').length} Zoom · ${clinicianAppointments.filter((item) => item.modality === 'In person').length} in person`;
  const responseRecords = [
    ...centerOpenWorkItems.map((item) => ({ primary: item.patient, secondary: item.type })),
    ...centerProposals.filter((item) => item.status === 'Awaiting patient response').map((item) => ({ primary: item.patient, secondary: 'Appointment offer awaiting response' })),
  ];
  const centerMessageThreads = clinicianMessages.filter((item) => selectedTreatmentCenterId === 'all' || item.centerId === selectedTreatmentCenterId);
  const unopenedMessageCount = centerMessageThreads.reduce((total, item) => total + (item.unreadCount || 0), 0);

  const centerHomework = useMemo(() => {
    return dashboardHomework.filter((h) => {
      const pt = patients.find((p) => p.name === h.patient);
      return selectedTreatmentCenterId === 'all' || pt?.centerId === selectedTreatmentCenterId;
    });
  }, [dashboardHomework, selectedTreatmentCenterId]);
  const submittedHw = centerHomework.filter((h) => h.status === 'Submitted');

  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={`${selectedTreatmentCenter.shortName} · Clinician Portal`} title="Good morning, Morgan" description="Your caseload, scheduled care, follow-up needs, and patient responses for Monday, September 14." action="Reset demo" onAction={resetDemo} />
      <div className="bhg-two-column bhg-two-column-wide bhg-admin-dashboard-grid bhg-admin-dashboard-priority-row">
        <section className="bhg-clinician-appointment-hero">
          {upcomingAppointment ? (
            <>
              <span className="bhg-clinician-appointment-icon"><CalendarDays size={23} /></span>
              <div className="bhg-clinician-appointment-copy">
                <span>Upcoming counseling session</span>
                <strong>{upcomingAppointment.time} · {upcomingAppointment.patient}</strong>
                <p>{upcomingAppointment.type}</p>
                <div className="bhg-clinician-appointment-meta">
                  <span><ShieldCheck size={14} /> {upcomingAppointment.status}</span>
                  <span><CalendarDays size={14} /> {upcomingAppointment.modality}</span>
                  <span>{centerLabels[upcomingAppointment.centerId]} · {upcomingAppointment.mode}</span>
                </div>
                <div className={`bhg-clinician-previous-summary${upcomingAppointment.isFollowUp && upcomingAppointment.previousSessionSummary ? '' : ' empty'}`}>
                  <strong>Previous session:</strong>
                  <span title={upcomingAppointment.previousSessionSummary || undefined}>{upcomingAppointment.isFollowUp && upcomingAppointment.previousSessionSummary ? upcomingAppointment.previousSessionSummary : 'No previous session summary'}</span>
                </div>
              </div>
              <button className="bhg-clinician-appointment-action" onClick={() => navigate('admin-appointments')}>View session <ArrowRight size={15} /></button>
            </>
          ) : <div className="bhg-clinician-appointment-empty"><CalendarDays size={23} /><div><strong>No upcoming sessions</strong><span>Choose another treatment center to review its schedule.</span></div></div>}
        </section>
        <section className="bhg-card bhg-dashboard-secure-messages">
          <div className="bhg-section-title"><div><h2>Secure messages</h2></div><Status>{unopenedMessageCount} unopened</Status></div>
          <div className="bhg-dashboard-message-list">
            {centerMessageThreads.slice(0, 2).map((message) => (
              <button key={message.id} type="button" onClick={() => navigate('admin-messages', { state: { messageId: message.id } })}>
                <span className="bhg-dashboard-message-avatar">{clinicianMessageInitials(message.patient)}</span>
                <span className="bhg-dashboard-message-copy"><strong>{message.patient}</strong><small>{message.subject}</small></span>
                {message.unreadCount > 0 ? <span className="bhg-dashboard-message-count">{message.unreadCount}</span> : <ArrowRight size={14} />}
              </button>
            ))}
            {!centerMessageThreads.length && <div className="bhg-dashboard-message-empty"><MessageCircle size={18} /><span>No patient messages in this view.</span></div>}
          </div>
          <button className="bhg-link-row" onClick={() => navigate('admin-messages')}>Open secure messages <ArrowRight size={14} /></button>
        </section>
      </div>
      <div className="bhg-admin-stat-grid">
        <Stat icon={UsersRound} label="Assigned Patients" value={centerPatients.length} note={programSummary} items={centerPatients.slice(0, 3).map((item) => ({ primary: item.name, secondary: `${item.program} · ${item.phase}` }))} action="Open My Caseload" onClick={() => navigate('admin-patients')} />
        <Stat icon={CalendarDays} label="Sessions Today" value={clinicianAppointments.length} note={modalitySummary} items={clinicianAppointments.slice(0, 3).map((item) => ({ primary: `${item.time} · ${item.patient}`, secondary: `${item.type} · ${item.modality}` }))} action="View sessions" onClick={() => navigate('admin-appointments')} tone="success" />
        <Stat icon={AlertTriangle} label="Missed Visits" value={missedVisits} note="Follow-up and rescheduling" items={missedVisitRecords.slice(0, 3).map((item) => ({ primary: item.patient, secondary: `${item.date} · ${item.service}` }))} action="Review outcomes" onClick={() => navigate('admin-appointments')} tone="warning" />
        <Stat icon={MessageSquareText} label="Patient Responses" value={openWorkItems + pendingOffers} note={`${centerOpenWorkItems.filter((item) => item.status === 'New').length} new · ${centerOpenWorkItems.filter((item) => item.status === 'In review').length} in review`} items={responseRecords.slice(0, 3)} action="Open response queue" onClick={() => navigate('admin-care-coordination')} tone="warning" />
      </div>
      <div className="bhg-admin-dashboard-bottom-row">
        <section className="bhg-card bhg-admin-dashboard-equal-card">
          <div className="bhg-section-title"><div><h2>UDS & lab review status</h2><p>Reports requiring clinician review in this center view.</p></div><Status>{reportsNeedingReview} need review</Status></div>
          <div className="bhg-dashboard-record-list">
            {centerUds.slice(0, 3).map((item) => <div key={`${item.patient}-${item.collected}`}><span><strong>{item.patient}</strong><small>{item.type} · Collected {item.collected}</small></span><span><Status>{item.review}</Status><small>{item.result}</small></span></div>)}
          </div>
          <div className="bhg-admin-progress"><span style={{ width: `${centerUds.length ? Math.round((reviewedReports / centerUds.length) * 100) : 0}%` }} /></div>
          <div className="bhg-admin-progress-label"><span>{reviewedReports} reviewed</span><strong>{reportsNeedingReview} need review</strong></div>
          <button className="bhg-link-row" onClick={() => navigate('admin-labs')}>Open UDS & lab review <ArrowRight size={14} /></button>
        </section>

        <section className="bhg-card bhg-admin-dashboard-equal-card">
          <div className="bhg-section-title">
            <div>
              <h2>CBT practice review</h2>
              <p>Between-session logs & thought records awaiting review.</p>
            </div>
            <Status>{submittedHw.length ? `${submittedHw.length} need review` : 'Up to date'}</Status>
          </div>
          <div className="bhg-dashboard-record-list">
            {centerHomework.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedDashboardHw(item);
                  setCounselorFeedbackDraft(item.counselorFeedback || '');
                }}
                title="Click to review log"
              >
                <span>
                  <strong>{item.patient}</strong>
                  <small>{item.title}</small>
                </span>
                <span>
                  <Status>{item.status}</Status>
                  <small style={{ color: item.status === 'Submitted' ? '#005A70' : '#64748B', fontWeight: item.status === 'Submitted' ? 600 : 400 }}>
                    {item.status === 'Submitted' ? 'Review log' : item.category}
                  </small>
                </span>
              </div>
            ))}
          </div>
          <div className="bhg-admin-progress">
            <span style={{ width: `${centerHomework.length ? Math.round((centerHomework.filter((h) => h.status === 'Completed').length / centerHomework.length) * 100) : 0}%`, background: '#059669' }} />
          </div>
          <div className="bhg-admin-progress-label">
            <span>{centerHomework.filter((h) => h.status === 'Completed').length} completed</span>
            <strong>{submittedHw.length} pending review</strong>
          </div>
          <button className="bhg-link-row" onClick={() => navigate('admin-patients')}>
            View all caseload practice <ArrowRight size={14} />
          </button>
        </section>

        <section className="bhg-card bhg-admin-work-queue bhg-admin-dashboard-equal-card">
          <div className="bhg-section-title"><div><h2>Patient response queue</h2><p>Top requests requiring a counselor response.</p></div><Status>{openWorkItems} open</Status></div>
          <WorkQueue limit={3} compact />
          <button className="bhg-link-row" onClick={() => navigate('admin-care-coordination')}>Open all patient responses <ArrowRight size={14} /></button>
        </section>
      </div>

      {selectedDashboardHw && (
        <WorkflowModal
          title={`CBT Practice Review · ${selectedDashboardHw.patient}`}
          subtitle={`${selectedDashboardHw.title} · ${selectedDashboardHw.category}`}
          onClose={() => setSelectedDashboardHw(null)}
          footer={
            <>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => setSelectedDashboardHw(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bhg-button"
                onClick={() => {
                  const updated = dashboardHomework.map((h) =>
                    h.id === selectedDashboardHw.id
                      ? { ...h, counselorFeedback: counselorFeedbackDraft, status: 'Completed' }
                      : h
                  );
                  setDashboardHomework(updated);
                  const idx = defaultCbtHomework.findIndex((h) => h.id === selectedDashboardHw.id);
                  if (idx !== -1) {
                    defaultCbtHomework[idx].counselorFeedback = counselorFeedbackDraft;
                    defaultCbtHomework[idx].status = 'Completed';
                  }
                  addToast(`Counselor feedback saved for ${selectedDashboardHw.patient}.`, 'success');
                  setSelectedDashboardHw(null);
                }}
              >
                Save Feedback & Mark Reviewed
              </button>
            </>
          }
        >
          <DemoBanner>Reviewing this thought record provides feedback directly to the patient's portal.</DemoBanner>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, padding: 10, background: '#F8FAFC', borderRadius: 8 }}>
              <div><small style={{ color: '#64748B', display: 'block' }}>Category</small><strong>{selectedDashboardHw.category}</strong></div>
              <div><small style={{ color: '#64748B', display: 'block' }}>Status</small><Status>{selectedDashboardHw.status}</Status></div>
              <div><small style={{ color: '#64748B', display: 'block' }}>Due Date</small><strong>{selectedDashboardHw.dueDate}</strong></div>
            </div>

            {selectedDashboardHw.situation && (
              <div style={{ padding: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: 2, fontSize: '12px' }}>1. Trigger / Activating Situation</strong>
                <p style={{ margin: 0, color: '#334155', fontSize: '12.5px' }}>{selectedDashboardHw.situation}</p>
              </div>
            )}

            {selectedDashboardHw.automaticThought && (
              <div style={{ padding: 10, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8 }}>
                <strong style={{ color: '#991B1B', display: 'block', marginBottom: 2, fontSize: '12px' }}>2. Automatic Thought & Cognitive Trap</strong>
                <p style={{ margin: 0, color: '#7F1D1D', fontSize: '12.5px', fontStyle: 'italic' }}>{selectedDashboardHw.automaticThought}</p>
                {selectedDashboardHw.cognitiveDistortion && (
                  <div style={{ marginTop: 4, fontSize: '11px', color: '#B91C1C' }}>
                    <b>Distortion:</b> {selectedDashboardHw.cognitiveDistortion}
                  </div>
                )}
              </div>
            )}

            {selectedDashboardHw.rationalResponse && (
              <div style={{ padding: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
                <strong style={{ color: '#166534', display: 'block', marginBottom: 2, fontSize: '12px' }}>3. Rational Counter-Response</strong>
                <p style={{ margin: 0, color: '#14532D', fontSize: '12.5px' }}>{selectedDashboardHw.rationalResponse}</p>
              </div>
            )}

            <Field label="Counselor Clinical Feedback (visible to patient)">
              <textarea
                rows="3"
                value={counselorFeedbackDraft}
                onChange={(e) => setCounselorFeedbackDraft(e.target.value)}
                placeholder="Reinforce the rational response and cognitive reframing..."
              />
            </Field>
          </div>
        </WorkflowModal>
      )}
    </div>
  );
}
const clinicianMessageQuickReplies = [
  'Thank you for the update.',
  'Please confirm that this time works for you.',
  'I will review this with you at our next session.',
  'Please call the treatment center if you need help today.',
];

function clinicianMessageInitials(name) {
  return String(name || '').split(' ').map((part) => part[0]).slice(0, 2).join('');
}

export function AdminMessages() {
  const location = useLocation();
  const {
    clinicianMessages = [],
    selectedTreatmentCenterId,
    selectedTreatmentCenter,
    markClinicianMessageRead,
    sendClinicianMessage,
    addToast,
  } = useApp();
  const visibleMessages = useMemo(() => clinicianMessages.filter((item) => (
    selectedTreatmentCenterId === 'all' || item.centerId === selectedTreatmentCenterId
  )), [clinicianMessages, selectedTreatmentCenterId]);
  const availablePatients = useMemo(() => patients.filter((item) => (
    selectedTreatmentCenterId === 'all' || item.centerId === selectedTreatmentCenterId
  )), [selectedTreatmentCenterId]);
  const [selectedId, setSelectedId] = useState(() => location.state?.messageId || null);
  const [showListOnMobile, setShowListOnMobile] = useState(false);
  const [compose, setCompose] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [draft, setDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const threadScrollRef = useRef(null);

  const filteredMessages = useMemo(() => visibleMessages.filter((item) => {
    const matchesFilter = filter === 'All'
      || (filter === 'Unread' && item.unreadCount > 0)
      || (filter === 'OTP' && /OTP/i.test(item.program))
      || (filter === 'OBOT' && /OBOT/i.test(item.program))
      || (filter === 'IOP' && /IOP/i.test(item.program));
    const matchesSearch = `${item.patient} ${item.subject} ${item.preview} ${item.program}`.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesFilter && matchesSearch;
  }), [filter, searchQuery, visibleMessages]);

  const selected = visibleMessages.find((item) => item.id === selectedId) || null;
  const unreadVisible = visibleMessages.reduce((total, item) => total + (item.unreadCount || 0), 0);

  useEffect(() => {
    if (selected && visibleMessages.some((item) => item.id === selected.id)) return;
    const next = visibleMessages.find((item) => item.unreadCount > 0) || visibleMessages[0] || null;
    setSelectedId(next?.id || null);
  }, [selected, visibleMessages]);

  useEffect(() => {
    if (selected?.unreadCount > 0) markClinicianMessageRead(selected.id);
  }, [markClinicianMessageRead, selected?.id, selected?.unreadCount]);

  useEffect(() => {
    if (!availablePatients.some((item) => item.id === recipientId)) {
      setRecipientId(availablePatients[0]?.id || '');
    }
  }, [availablePatients, recipientId]);

  useEffect(() => {
    const node = threadScrollRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [selected?.id, selected?.thread?.length]);

  const openThread = (message) => {
    setSelectedId(message.id);
    setShowListOnMobile(false);
    setDraft('');
    markClinicianMessageRead(message.id);
  };

  const submitReply = (text = draft) => {
    const message = text.trim();
    if (!message || !selected) return;
    sendClinicianMessage({
      patient: selected.patient,
      patientId: selected.patientId,
      centerId: selected.centerId,
      program: selected.program,
      subject: selected.subject,
      body: message,
      threadId: selected.id,
    });
    setDraft('');
    addToast(`Secure reply sent to ${selected.patient}.`);
  };

  const closeCompose = () => {
    setCompose(false);
    setSubject('');
    setBody('');
  };

  const submitNewMessage = () => {
    const recipient = availablePatients.find((item) => item.id === recipientId);
    if (!recipient || !subject.trim() || !body.trim()) return;
    sendClinicianMessage({
      patient: recipient.name,
      patientId: recipient.id,
      centerId: recipient.centerId,
      program: `${recipient.program} · ${recipient.phase}`,
      subject: subject.trim(),
      body: body.trim(),
    });
    addToast(`Secure message sent to ${recipient.name}.`);
    closeCompose();
  };

  return (
    <div className="bhg-page bhg-messages-page bhg-clinician-messages-page animate-fade-in">
      <section className="bhg-card bhg-messages-shell">
        <aside className={`bhg-messages-inbox ${showListOnMobile ? 'mobile-visible' : 'mobile-hidden'}`}>
          <div className="bhg-messages-inbox-head">
            <div>
              <span className="bhg-eyebrow">Patient communication</span>
              <strong>Secure messages</strong>
              <p>{unreadVisible ? `${unreadVisible} unopened · ` : ''}{visibleMessages.length} conversations · {selectedTreatmentCenter.shortName}</p>
            </div>
            <button type="button" className="bhg-button bhg-messages-inbox-new" onClick={() => setCompose(true)} disabled={!availablePatients.length}>
              <Plus size={15} /> New
            </button>
          </div>

          <div className="bhg-messages-inbox-controls">
            <AdminSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search conversations, patients..."
              style={{ marginBottom: 0 }}
            />
            <AdminFilterBar
              options={['All', 'Unread', 'OTP', 'OBOT', 'IOP']}
              value={filter}
              onChange={setFilter}
              label="Filter messages"
              style={{ paddingBottom: 0 }}
            />
          </div>

          <div className="bhg-messages-inbox-list">
            {filteredMessages.map((message) => {
              const active = message.id === selectedId;
              return (
                <button
                  key={message.id}
                  type="button"
                  className={`bhg-messages-inbox-item ${active ? 'active' : ''} ${message.unreadCount ? 'unread' : ''}`}
                  onClick={() => openThread(message)}
                >
                  <div className="bhg-messages-inbox-avatar-wrap">
                    <span className="bhg-messages-inbox-avatar">{clinicianMessageInitials(message.patient)}</span>
                    <span className="bhg-messages-inbox-online" aria-hidden="true" />
                  </div>
                  <div className="bhg-messages-inbox-copy">
                    <div className="bhg-messages-inbox-top"><strong>{message.patient}</strong><span>{message.time}</span></div>
                    <div className="bhg-messages-inbox-meta">
                      <span className="bhg-messages-inbox-role">{message.program}</span>
                      {message.unreadCount > 0 && <span className="bhg-messages-inbox-count">{message.unreadCount} new</span>}
                    </div>
                    <h3>{message.subject}</h3>
                    <p>{message.preview}</p>
                  </div>
                  {message.unreadCount > 0 && <span className="bhg-messages-inbox-unread" aria-label={`${message.unreadCount} unopened messages`} />}
                </button>
              );
            })}
            {!visibleMessages.length && <div className="bhg-messages-empty"><MessageCircle size={28} /><strong>No conversations here</strong><span>Choose another treatment center or start a new message.</span></div>}
          </div>

          <div className="bhg-messages-inbox-foot bhg-clinician-message-policy">
            <MessageCircle size={15} /> <span>For non-urgent patient communication during clinic hours.</span>
          </div>
        </aside>

        <section className={`bhg-messages-chat-panel ${showListOnMobile ? 'mobile-hidden' : 'mobile-visible'}`}>
          {selected ? (
            <>
              <header className="bhg-messages-chat-header">
                <button type="button" className="bhg-messages-back" onClick={() => setShowListOnMobile(true)}>
                  <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Inbox
                </button>
                <div className="bhg-messages-chat-contact">
                  <div className="bhg-person-avatar">{clinicianMessageInitials(selected.patient)}</div>
                  <div><strong>{selected.patient}</strong><span className="bhg-messages-status"><span className="bhg-messages-status-dot" aria-hidden="true" />Active · {selected.program}</span></div>
                </div>
                <div className="bhg-messages-chat-meta">
                  <span className="bhg-messages-chat-subject">{selected.subject}</span>
                  <span>{selected.thread.length} messages · {centerLabels[selected.centerId]}</span>
                </div>
              </header>

              <div className="bhg-messages-thread-wrap">
                <div ref={threadScrollRef} className="bhg-messages-thread">
                  {selected.thread.map((entry) => {
                    const mine = entry.sender === 'Morgan Reed';
                    return (
                      <div key={entry.id} className={`bhg-messages-bubble-row ${mine ? 'mine' : ''}`}>
                        {!mine && <span className="bhg-messages-bubble-label">{entry.sender}</span>}
                        <div className={`bhg-messages-bubble ${mine ? 'sent' : 'received'}`}>{entry.text}</div>
                        <span className={`bhg-messages-bubble-time ${mine ? '' : 'received'}`}>{entry.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bhg-messages-composer-dock">
                <div className="bhg-messages-quick-replies">
                  <button
                    type="button"
                    className="bhg-messages-quick-chip"
                    style={{
                      borderColor: '#005A70',
                      color: '#005A70',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      background: '#F0F9FF',
                    }}
                    onClick={() => setShowResourceModal(true)}
                  >
                    <BookOpen size={13} /> Attach CBT Handout
                  </button>
                  {clinicianMessageQuickReplies.map((reply) => <button key={reply} type="button" className="bhg-messages-quick-chip" onClick={() => submitReply(reply)}>{reply}</button>)}
                </div>
                <footer className="bhg-messages-compose">
                  <textarea
                    rows="1"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={`Write a secure reply to ${selected.patient}…`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        submitReply();
                      }
                    }}
                  />
                  <button type="button" className="bhg-button bhg-messages-send" disabled={!draft.trim()} onClick={() => submitReply()} aria-label="Send secure reply"><Send size={16} /></button>
                  <p>Secure messages · Clinic hours only · Not for emergencies (911 / 988)</p>
                </footer>
              </div>
            </>
          ) : (
            <div className="bhg-messages-empty"><MessageCircle size={34} /><strong>Select a conversation</strong><span>Choose a conversation or start a secure message to a patient.</span></div>
          )}
        </section>
      </section>

      {compose && (
        <WorkflowModal
          title="New secure message"
          subtitle="Non-urgent message to an assigned patient"
          onClose={closeCompose}
          size="lg"
          footer={<><button type="button" className="bhg-button bhg-button-secondary" onClick={closeCompose}>Cancel</button><button type="button" className="bhg-button" disabled={!recipientId || !subject.trim() || !body.trim()} onClick={submitNewMessage}><Send size={15} /> Send securely</button></>}
        >
          <DemoBanner>This message will appear in the patient’s secure inbox.</DemoBanner>
          <Field label="Patient">
            <select value={recipientId} onChange={(event) => setRecipientId(event.target.value)}>
              {availablePatients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.id} · {item.center}</option>)}
            </select>
          </Field>
          <Field label="Subject"><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Reason for this message" /></Field>
          <Field label="Message" hint="Use secure messages only for non-urgent communication."><textarea rows="4" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write your message to the patient…" /></Field>
        </WorkflowModal>
      )}

      {showResourceModal && selected && (
        <WorkflowModal
          title="CBT Psychoeducation & Handout Library"
          subtitle={`Select an evidence-based clinical handout to attach for ${selected.patient}`}
          onClose={() => setShowResourceModal(false)}
          size="lg"
          footer={
            <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setShowResourceModal(false)}>
              Cancel
            </button>
          }
        >
          <DemoBanner>Attached materials are securely embedded into the patient's message thread for between-session reference.</DemoBanner>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cbtResourceLibrary.map((res) => (
              <div
                key={res.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#FFFFFF',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{res.title}</strong>
                    <span style={{ fontSize: '11px', padding: '2px 7px', background: '#F1F5F9', borderRadius: 4, color: '#475569' }}>{res.category}</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{res.duration}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>{res.summary}</p>
                </div>
                <button
                  type="button"
                  className="bhg-button"
                  style={{ minHeight: 30, padding: '4px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    const snippet = `Hi ${selected.patient.split(' ')[0]},\n\nHere is the CBT resource we discussed: [${res.title}]:\n${res.summary}\n\nPlease take a few minutes to review this practice before our next session. Let me know if you have any questions!`;
                    setDraft((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
                    setShowResourceModal(false);
                    addToast(`Attached "${res.title}" to message draft.`, 'success');
                  }}
                >
                  Insert Handout
                </button>
              </div>
            ))}
          </div>
        </WorkflowModal>
      )}
    </div>
  );
}
export function AdminPatients() {
  const [query, setQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const { navigate, selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const filtered = useMemo(() => rowsForCenter(patients, selectedTreatmentCenterId).filter((item) => {
    const matchesProgram = programFilter === 'All'
      || (programFilter === 'Pending CBT Review' && defaultCbtHomework.some((h) => h.patient === item.name && h.status === 'Submitted'))
      || (programFilter === 'Clinical Review' && item.status === 'Review')
      || item.program === programFilter;
    const matchesQuery = `${item.name} ${item.id} ${item.program} ${item.phase} ${item.center}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesProgram && matchesQuery;
  }), [programFilter, query, selectedTreatmentCenterId]);
  const openPatient = (patient) => navigate(`admin-patient-profile?patient=${encodeURIComponent(patient.id)}`);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="My Caseload" description="Assigned patients, treatment center, program phase, care-team ownership, and recent engagement." />
      <section className="bhg-card bhg-caseload-card">
        <div className="bhg-caseload-controls">
          <AdminSearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search patient, ID, program, phase, or treatment center..."
          />
          <div className="bhg-caseload-filter-row">
            <AdminFilterBar
              options={['All', 'OTP', 'OBOT', 'IOP', 'Pending CBT Review', 'Clinical Review']}
              value={programFilter}
              onChange={setProgramFilter}
              label="Filter caseload by program"
            />
            <Status>{filtered.length} shown</Status>
          </div>
        </div>
        <Table columns={['Patient', 'Treatment center', 'Program / phase', 'CBT Practice', 'Status', 'Last activity', '']} rows={filtered} render={(row) => {
          const hw = defaultCbtHomework.filter((h) => h.patient === row.name);
          const pendingHw = hw.find((h) => h.status === 'Submitted');
          const completedCount = hw.filter((h) => h.status === 'Completed').length;
          return (
            <>
              <td><button type="button" className="bhg-patient-link" onClick={() => openPatient(row)}><strong>{row.name}</strong><small>{row.id}</small></button></td>
              <td>{row.center}</td>
              <td>{row.program}<small>{row.phase}</small></td>
              <td>
                {pendingHw ? (
                  <span className="bhg-pill bhg-pill-warning" style={{ fontSize: '10.5px' }}>Needs Review</span>
                ) : completedCount > 0 ? (
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>{completedCount} Completed</span>
                ) : hw.some((h) => h.status === 'In progress') ? (
                  <span style={{ fontSize: '11px', color: '#0284C7' }}>In progress</span>
                ) : (
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Up to date</span>
                )}
              </td>
              <td><Status>{row.status}</Status></td>
              <td>{row.last}</td>
              <td><button type="button" className="bhg-text-button" onClick={() => openPatient(row)}>Open profile</button></td>
            </>
          );
        }} />
      </section>
    </div>
  );
}

function ProfileDetails({ items, columns = 1, className = '' }) {
  return (
    <div className={`bhg-profile-details ${columns === 2 ? 'bhg-profile-details-2col' : ''} ${className}`.trim()}>
      {items.map(([label, value]) => (
        <div key={label} className="bhg-profile-detail-item">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export function AdminPatientProfile() {
  const { navigate, addToast } = useApp();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient');
  const patient = patients.find((item) => item.id === patientId) || patients[0];
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedNotHeld, setSelectedNotHeld] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState(() => buildPatientReports(patient));
  const sessions = useMemo(() => buildPatientSessions(patient), [patient]);
  const [homeworkList, setHomeworkList] = useState(defaultCbtHomework);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [assignHomeworkModal, setAssignHomeworkModal] = useState(false);
  const [newHwTitle, setNewHwTitle] = useState('3-Column Automatic Thought Record');
  const [newHwDueDate, setNewHwDueDate] = useState('Sep 24, 2026');
  const [counselorFeedbackDraft, setCounselorFeedbackDraft] = useState('');

  useEffect(() => {
    setActiveTab('overview');
    setSelectedNote(null);
    setSelectedNotHeld(null);
    setSelectedReport(null);
    setSelectedHomework(null);
    setAssignHomeworkModal(false);
    setReports(buildPatientReports(patient));
  }, [patient]);

  const tabs = [
    ['overview', 'Overview'],
    ['cbt-practice', 'CBT Practice'],
    ['outcomes', 'Outcomes & Assessments'],
    ['relapse-plan', 'Relapse Prevention'],
    ['asam', 'ASAM'],
    ['treatment-plan', 'Treatment Plan'],
    ['sessions', 'Sessions & Notes'],
    ['labs', 'UA & Labs'],
  ];

  const submitFeedback = () => {
    if (!selectedHomework) return;
    const updated = homeworkList.map((item) => (
      item.id === selectedHomework.id
        ? { ...item, counselorFeedback: counselorFeedbackDraft, status: 'Reviewed' }
        : item
    ));
    setHomeworkList(updated);
    setSelectedHomework(null);
    addToast('Counselor feedback saved and marked as reviewed.', 'success');
  };

  const handleAssignPractice = () => {
    const categoryMap = {
      '3-Column Automatic Thought Record': 'Cognitive Restructuring',
      'Urge Surfing & Craving Wave Protocol': 'Craving Management',
      'Decatastrophizing & Probability Thinking': 'Cognitive Restructuring',
      'Behavioral Activation & Routine Schedule': 'Behavioral Activation',
    };
    const newAssignment = {
      id: `HW-${Date.now()}`,
      patient: patient.name,
      patientId: patient.id,
      title: newHwTitle,
      category: categoryMap[newHwTitle] || 'Cognitive Behavioral Therapy',
      assignedDate: 'Today',
      dueDate: newHwDueDate,
      status: 'In progress',
      situation: 'Assigned for between-session practice.',
      automaticThought: '',
      cognitiveDistortion: '',
      rationalResponse: '',
      outcome: '',
      counselorFeedback: '',
    };
    setHomeworkList((prev) => [newAssignment, ...prev]);
    setAssignHomeworkModal(false);
    addToast(`Assigned "${newHwTitle}" to ${patient.name}.`, 'success');
  };

  const changeReviewStatus = () => {
    if (!selectedReport) return;
    const reviewStatus = selectedReport.reviewStatus === 'Reviewed' ? 'Under review' : 'Reviewed';
    setReports((items) => items.map((item) => item.id === selectedReport.id ? { ...item, reviewStatus } : item));
    setSelectedReport((item) => ({ ...item, reviewStatus }));
    addToast(reviewStatus === 'Reviewed' ? 'Report marked as reviewed.' : 'Report returned to under review.', reviewStatus === 'Reviewed' ? 'success' : 'info');
  };

  return (
    <div className="bhg-page bhg-profile-page">
      <button type="button" className="bhg-profile-back" onClick={() => navigate('admin-patients')}><ArrowLeft size={16} /> Back to My Caseload</button>
      <section className="bhg-card bhg-profile-header">
        <div>
          <div className="bhg-eyebrow">{patient.center}</div>
          <h1>{patient.name}</h1>
          <p>{patient.id} · {patient.program} · {patient.phase} · {patient.counselor}</p>
        </div>
        <Status>{patient.status}</Status>
      </section>

      <nav className="bhg-profile-tabs" aria-label="Patient profile sections">
        {tabs.map(([id, label]) => <button type="button" key={id} className={activeTab === id ? 'active' : ''} aria-current={activeTab === id ? 'page' : undefined} onClick={() => setActiveTab(id)}>{label}</button>)}
      </nav>

      <section className="bhg-card bhg-profile-panel">
        {activeTab === 'overview' && <>
          <div className="bhg-section-title"><div><h2>Patient overview</h2><p>Current enrollment, clinical context, and upcoming care.</p></div><Status>Assigned to you</Status></div>
          <ProfileDetails columns={2} items={[
            ['Primary diagnosis', 'Opioid Use Disorder, moderate'],
            ['Enrolled since', 'March 14, 2026'],
            ['Payer', patient.payer],
            ['Required service', patient.program === 'IOP' ? 'Intensive outpatient counseling' : 'Individual counseling twice monthly'],
            ['Treatment center', patient.center],
            ['Counselor', `${patient.counselor}, LPC-MHSP`],
            ['Last session', 'September 10, 2026'],
            ['Next session', 'September 24, 2026 at 10:30 AM'],
          ]} />
          <div className="bhg-info-banner"><ShieldCheck size={16} /> Medication decisions, prescribing, and dosing changes remain in authorized medical workflows.</div>
        </>}

        {activeTab === 'cbt-practice' && <>
          <div className="bhg-section-title">
            <div>
              <h2>CBT Skill Practice & Homework</h2>
              <p>Between-session practice logs, thought records, and behavioral activation.</p>
            </div>
            <button
              type="button"
              className="bhg-button"
              style={{ minHeight: 32, padding: '4px 12px', fontSize: '11.5px' }}
              onClick={() => setAssignHomeworkModal(true)}
            >
              <Plus size={14} /> Assign CBT Practice
            </button>
          </div>
          <Table
            columns={['Assignment', 'Category', 'Assigned', 'Due', 'Status', 'Action']}
            rows={homeworkList.filter((item) => item.patient === patient.name)}
            render={(item) => (
              <>
                <td><strong>{item.title}</strong></td>
                <td><span className="bhg-chip" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#F1F5F9', color: '#334155' }}>{item.category}</span></td>
                <td>{item.assignedDate}</td>
                <td>{item.dueDate}</td>
                <td><Status>{item.status}</Status></td>
                <td>
                  <button
                    type="button"
                    className="bhg-text-button"
                    onClick={() => {
                      setSelectedHomework(item);
                      setCounselorFeedbackDraft(item.counselorFeedback || '');
                    }}
                  >
                    {item.status === 'Completed' || item.status === 'Submitted' ? 'Review & Feedback' : 'View details'}
                  </button>
                </td>
              </>
            )}
          />
          {!homeworkList.filter((item) => item.patient === patient.name).length && (
            <div className="bhg-admin-empty">
              <FileText size={24} />
              <strong>No active CBT assignments for {patient.name}</strong>
              <span>Assign a thought record or urge surfing protocol to support recovery between sessions.</span>
            </div>
          )}
          <div className="bhg-info-banner">
            <Sparkles size={16} /> Patients complete assigned exercises in their Patient Portal. Responses are synchronized here for clinical review and session agenda setting.
          </div>
        </>}

        {activeTab === 'outcomes' && (() => {
          const outcomes = getPatientOutcomes(patient.name);
          return (
            <>
              <div className="bhg-section-title">
                <div>
                  <h2>Longitudinal CBT Outcomes & Assessments</h2>
                  <p>Standardized depression (PHQ-9), anxiety (GAD-7), and craving severity indices across treatment phases.</p>
                </div>
                <Status>Clinical Progress</Status>
              </div>
              <div className="bhg-info-banner" style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#065F46', marginBottom: 16 }}>
                <TrendingDown size={16} color="#059669" />
                <span><strong>Clinical Trajectory:</strong> {outcomes.summary}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {/* PHQ-9 Card */}
                <div className="bhg-card" style={{ padding: 16, border: '1px solid #CBD5E1', borderRadius: 10, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong>PHQ-9 Depression Screener</strong>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>0–27 Scale</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {outcomes.phq9.map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 3 }}>
                          <span>{item.milestone}</span>
                          <b>Score: {item.score} · <span style={{ color: item.score >= 15 ? '#DC2626' : item.score >= 10 ? '#D97706' : '#059669' }}>{item.severity}</span></b>
                        </div>
                        <div className="bhg-goal-track">
                          <span style={{ width: `${(item.score / item.max) * 100}%`, background: item.score >= 15 ? '#EF4444' : item.score >= 10 ? '#F59E0B' : '#10B981' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GAD-7 Card */}
                <div className="bhg-card" style={{ padding: 16, border: '1px solid #CBD5E1', borderRadius: 10, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong>GAD-7 Generalized Anxiety</strong>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>0–21 Scale</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {outcomes.gad7.map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 3 }}>
                          <span>{item.milestone}</span>
                          <b>Score: {item.score} · <span style={{ color: item.score >= 15 ? '#DC2626' : item.score >= 10 ? '#D97706' : '#059669' }}>{item.severity}</span></b>
                        </div>
                        <div className="bhg-goal-track">
                          <span style={{ width: `${(item.score / item.max) * 100}%`, background: item.score >= 15 ? '#EF4444' : item.score >= 10 ? '#F59E0B' : '#10B981' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Craving Index Card */}
                <div className="bhg-card" style={{ padding: 16, border: '1px solid #CBD5E1', borderRadius: 10, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <strong>Craving Severity (BAM Index)</strong>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>1–10 Scale</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {outcomes.cravingIndex.map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: 3 }}>
                          <span>{item.milestone}</span>
                          <b>{item.label}</b>
                        </div>
                        <div className="bhg-goal-track">
                          <span style={{ width: `${(item.score / item.max) * 100}%`, background: item.score >= 7 ? '#EF4444' : item.score >= 4 ? '#F59E0B' : '#10B981' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {activeTab === 'relapse-plan' && (() => {
          const plan = getRelapsePlan(patient.name);
          return (
            <>
              <div className="bhg-section-title">
                <div>
                  <h2>Relapse Prevention & Safety Plan (Marlatt Model)</h2>
                  <p>Co-developed relapse triggers, emergency urge-surfing tools, and designated recovery supports.</p>
                </div>
                <Status>Updated {plan.updated}</Status>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {/* High-Risk Triggers */}
                <div className="bhg-card" style={{ padding: 16, border: '1px solid #CBD5E1', borderRadius: 10, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#B91C1C' }}>
                    <AlertTriangle size={18} />
                    <strong>High-Risk Situations & Triggers</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {plan.triggers.map((t, idx) => (
                      <div key={idx} style={{ padding: '8px 10px', background: '#FEF2F2', borderRadius: 6, fontSize: '12px', borderLeft: '3px solid #EF4444' }}>
                        <b>{t.category}:</b> <span style={{ color: '#4B5563' }}>{t.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coping Tools */}
                <div className="bhg-card" style={{ padding: 16, border: '1px solid #CBD5E1', borderRadius: 10, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#005A70' }}>
                    <Sparkles size={18} />
                    <strong>Personalized Coping Strategies</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {plan.copingTools.map((c, idx) => (
                      <div key={idx} style={{ padding: '8px 10px', background: '#F0FDF4', borderRadius: 6, fontSize: '12px', borderLeft: '3px solid #10B981' }}>
                        <b>{c.tool}:</b> <span style={{ color: '#4B5563' }}>{c.steps}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safe Spaces */}
                <div className="bhg-card" style={{ padding: 16, border: '1px solid #CBD5E1', borderRadius: 10, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#0369A1' }}>
                    <ShieldCheck size={18} />
                    <strong>Safe Environments & Distractions</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '12px', color: '#374151', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {plan.safeSpaces.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Emergency Contacts */}
                <div className="bhg-card" style={{ padding: 16, border: '1px solid #CBD5E1', borderRadius: 10, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#6D28D9' }}>
                    <HeartHandshake size={18} />
                    <strong>Designated Supports & Crisis Lines</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {plan.contacts.map((contact, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '6px 8px', background: '#F8FAFC', borderRadius: 6 }}>
                        <div>
                          <strong>{contact.name}</strong>
                          <div style={{ color: '#64748B', fontSize: '11px' }}>{contact.role}</div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#005A70', fontWeight: 600 }}>{contact.contact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {activeTab === 'asam' && <>
          <div className="bhg-section-title"><div><h2>ASAM assessment</h2><p>The six dimensions from the latest signed assessment.</p></div><Status>Read only</Status></div>
          <DemoBanner>This portal displays the current assessment for care coordination. Reassessment documentation remains in the designated clinical system.</DemoBanner>
          <div className="bhg-asam-list">{asamDimensions.map(([title, detail]) => <article key={title}><strong>{title}</strong><p>{detail}</p></article>)}</div>
          <h3 className="bhg-profile-subheading">Assessment history</h3>
          <Table columns={['Assessment', 'Completed', 'Status']} rows={[
            { id: 'asam-periodic', patient: 'Periodic reassessment', date: 'September 3, 2026', status: 'Completed' },
            { id: 'asam-intake', patient: 'Intake ASAM assessment', date: 'March 14, 2026', status: 'Completed' },
          ]} render={(row) => <><td><strong>{row.patient}</strong></td><td>{row.date}</td><td><Status>{row.status}</Status></td></>} />
        </>}

        {activeTab === 'treatment-plan' && <>
          <div className="bhg-section-title"><div><h2>Treatment plan</h2><p>Signed plan focus and goal progress available to the assigned counselor.</p></div><Status>Read only</Status></div>
          <ProfileDetails items={[
            ['Current focus', 'Recovery supports, attendance, coping routines, and collaborative counseling goals'],
            ['Last reviewed', 'September 3, 2026'],
            ['Next review due', 'October 2, 2026'],
          ]} />
          <h3 className="bhg-profile-subheading">Goals</h3>
          <div className="bhg-goal-list">{treatmentGoals.map((goal) => <article key={goal.title}><div><strong>{goal.title}</strong><span>{goal.progress}%</span></div><div className="bhg-goal-track"><span style={{ width: `${goal.progress}%` }} /></div><p>{goal.detail}</p></article>)}</div>
        </>}

        {activeTab === 'sessions' && <>
          <div className="bhg-section-title"><div><h2>Sessions & notes</h2><p>Upcoming and historical counseling sessions. Finalized notes are view-only.</p></div></div>
          <Table columns={['Date', 'Service', 'Modality', 'Status', 'Note / outcome']} rows={sessions} render={(row) => <>
            <td><strong>{row.date}</strong><small>{row.time}</small></td><td>{row.service}</td><td><Status>{row.modality}</Status></td><td><Status>{row.status}</Status></td><td>{row.status === 'Completed' ? <button type="button" className="bhg-text-button" onClick={() => setSelectedNote(row)}>View note</button> : row.status === 'Session not held' ? <button type="button" className="bhg-text-button" onClick={() => setSelectedNotHeld(row)}>View note</button> : <span className="bhg-table-muted">No note</span>}</td>
          </>} />
          <div className="bhg-info-banner"><ShieldCheck size={16} /> Completed-session notes are locked and read-only. Scheduled sessions do not display a note; sessions not held display only the documented reason.</div>
        </>}

        {activeTab === 'labs' && <>
          <div className="bhg-section-title"><div><h2>UA & lab reports</h2><p>Report type, result category, and clinician-review status.</p></div><Status>{reports.filter((item) => item.reviewStatus === 'Under review').length} under review</Status></div>
          <Table columns={['Collected', 'Report type', 'Result', 'Review status', 'Action']} rows={reports} render={(row) => <>
            <td>{row.date}</td><td><strong>{row.type}</strong><small>{row.source}</small></td><td><Status>{row.result}</Status></td><td><Status>{row.reviewStatus}</Status></td><td><button type="button" className="bhg-text-button" onClick={() => setSelectedReport(row)}>Open report</button></td>
          </>} />
          <div className="bhg-info-banner"><TestTube2 size={16} /> This POC uses result categories for counselor review; detailed analytes remain within access-controlled laboratory records.</div>
        </>}
      </section>

      {selectedNote && <WorkflowModal title={`Session note · ${patient.name}`} subtitle={`${selectedNote.service} · ${selectedNote.date} at ${selectedNote.time}`} onClose={() => setSelectedNote(null)} footer={<button className="bhg-button" onClick={() => setSelectedNote(null)}>Close</button>}>
        <DemoBanner>This is a finalized, read-only note. Session recording, transcription, and note creation remain in BHG’s designated documentation system.</DemoBanner>
        <div className="bhg-readonly-note"><section><strong>Data</strong><p>{selectedNote.note.data}</p></section><section><strong>Assessment</strong><p>{selectedNote.note.assessment}</p></section><section><strong>Plan</strong><p>{selectedNote.note.plan}</p></section><small>Finalized by Morgan Reed, LPC-MHSP · {selectedNote.note.finalized}</small></div>
      </WorkflowModal>}

      {selectedNotHeld && <WorkflowModal title="Session not held" subtitle={`${selectedNotHeld.service} · ${selectedNotHeld.date} at ${selectedNotHeld.time}`} onClose={() => setSelectedNotHeld(null)} footer={<button className="bhg-button" onClick={() => setSelectedNotHeld(null)}>Close</button>}>
        <div className="bhg-not-held-reason"><AlertTriangle size={18} /><div><strong>Reason</strong><p>{selectedNotHeld.outcome}</p></div></div>
      </WorkflowModal>}

      {selectedReport && <WorkflowModal title={`${selectedReport.type} · ${patient.name}`} subtitle={`Collected ${selectedReport.date}`} onClose={() => setSelectedReport(null)} footer={<><button className="bhg-button bhg-button-secondary" onClick={() => setSelectedReport(null)}>Close</button><button className="bhg-button" onClick={changeReviewStatus}>{selectedReport.reviewStatus === 'Reviewed' ? <><RotateCcw size={15} /> Revert to under review</> : 'Mark as reviewed'}</button></>}>
        <DemoBanner>Review status is visible to the assigned care team. Changing it does not alter the source laboratory result.</DemoBanner>
        <ProfileDetails items={[
          ['Patient', `${patient.name} · ${patient.id}`],
          ['Report type', selectedReport.type],
          ['Collected', selectedReport.date],
          ['Result', selectedReport.result],
          ['Review status', selectedReport.reviewStatus],
          ['Source', selectedReport.source],
        ]} />
        <div className="bhg-report-summary"><strong>Clinical summary</strong><p>{selectedReport.summary}</p></div>
      </WorkflowModal>}

      {selectedHomework && (
        <WorkflowModal
          title={`CBT Assignment · ${selectedHomework.title}`}
          subtitle={`${patient.name} · Assigned ${selectedHomework.assignedDate} · Due ${selectedHomework.dueDate}`}
          onClose={() => setSelectedHomework(null)}
          size="lg"
          footer={
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setSelectedHomework(null)}>Close</button>
              <button type="button" className="bhg-button" onClick={submitFeedback}>
                <CheckCircle2 size={15} /> Save Feedback & Mark Reviewed
              </button>
            </>
          }
        >
          <DemoBanner>Patient response completed via Patient Portal. Reviewing and providing feedback reinforces between-session skill practice.</DemoBanner>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
              <div><small style={{ color: '#64748B', display: 'block' }}>Category</small><strong>{selectedHomework.category}</strong></div>
              <div><small style={{ color: '#64748B', display: 'block' }}>Status</small><Status>{selectedHomework.status}</Status></div>
              <div><small style={{ color: '#64748B', display: 'block' }}>Target Competency</small><strong>Cognitive reframing & craving management</strong></div>
            </div>

            {selectedHomework.situation && (
              <div style={{ padding: 12, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: 4 }}>1. Trigger / Activating Situation</strong>
                <p style={{ margin: 0, color: '#334155', fontSize: '13px' }}>{selectedHomework.situation}</p>
              </div>
            )}

            {selectedHomework.automaticThought && (
              <div style={{ padding: 12, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8 }}>
                <strong style={{ color: '#991B1B', display: 'block', marginBottom: 4 }}>2. Automatic Thought & Cognitive Trap</strong>
                <p style={{ margin: 0, color: '#7F1D1D', fontSize: '13px', fontStyle: 'italic' }}>{selectedHomework.automaticThought}</p>
                {selectedHomework.cognitiveDistortion && (
                  <div style={{ marginTop: 6, fontSize: '11.5px', color: '#B91C1C' }}>
                    <b>Identified Distortion:</b> {selectedHomework.cognitiveDistortion}
                  </div>
                )}
              </div>
            )}

            {selectedHomework.rationalResponse && (
              <div style={{ padding: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8 }}>
                <strong style={{ color: '#166534', display: 'block', marginBottom: 4 }}>3. Rational Counter-Response & Reframing</strong>
                <p style={{ margin: 0, color: '#14532D', fontSize: '13px' }}>{selectedHomework.rationalResponse}</p>
              </div>
            )}

            {selectedHomework.outcome && (
              <div style={{ padding: 10, background: '#F8FAFC', borderRadius: 8, fontSize: '12.5px' }}>
                <strong>Patient Reported Outcome:</strong> <span style={{ color: '#334155' }}>{selectedHomework.outcome}</span>
              </div>
            )}

            <Field label="Counselor Clinical Feedback (visible to patient in portal)">
              <textarea
                rows="3"
                value={counselorFeedbackDraft}
                onChange={(e) => setCounselorFeedbackDraft(e.target.value)}
                placeholder="Provide positive reinforcement and clinical prompts for the next session..."
              />
            </Field>
          </div>
        </WorkflowModal>
      )}

      {assignHomeworkModal && (
        <WorkflowModal
          title={`Assign CBT Skill Practice · ${patient.name}`}
          subtitle="Choose an evidence-based CBT exercise for between-session practice"
          onClose={() => setAssignHomeworkModal(false)}
          footer={
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setAssignHomeworkModal(false)}>Cancel</button>
              <button type="button" className="bhg-button" onClick={handleAssignPractice}>Assign to Patient</button>
            </>
          }
        >
          <DemoBanner>This assignment will appear on the patient’s home screen and goals tracker.</DemoBanner>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="CBT Practice Worksheet / Tool">
              <select value={newHwTitle} onChange={(e) => setNewHwTitle(e.target.value)}>
                <option value="3-Column Automatic Thought Record">3-Column Automatic Thought Record (Cognitive Restructuring)</option>
                <option value="Urge Surfing & Craving Wave Protocol">Urge Surfing & Craving Wave Protocol (Craving Management)</option>
                <option value="Decatastrophizing & Probability Thinking">Decatastrophizing & Probability Thinking (Anxiety / Cognitive)</option>
                <option value="Behavioral Activation & Routine Schedule">Behavioral Activation & Routine Schedule (Depression / Isolation)</option>
              </select>
            </Field>

            <Field label="Target Completion Due Date">
              <input
                type="text"
                value={newHwDueDate}
                onChange={(e) => setNewHwDueDate(e.target.value)}
                placeholder="e.g. Sep 24, 2026"
              />
            </Field>

            <div style={{ padding: 12, background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, fontSize: '12px', color: '#0369A1' }}>
              <BookOpen size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              <strong>Clinical Note:</strong> Patient will be notified on their patient portal dashboard. Completed logs can be reviewed right before your next counseling session.
            </div>
          </div>
        </WorkflowModal>
      )}
    </div>
  );
}
export function AdminCheckIns() {
  const { selectedTreatmentCenterId, selectedTreatmentCenter, addToast } = useApp();
  const [checkInsData, setCheckInsData] = useState(checkIns);
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [selectedHoldItem, setSelectedHoldItem] = useState(null);
  const [clearanceNote, setClearanceNote] = useState('Attended scheduled counseling session with Morgan Reed, LPC-MHSP. Treatment engagement and coping routine reviewed. Patient cleared for daily dosing window.');

  const centerCheckIns = rowsForCenter(checkInsData, selectedTreatmentCenterId);
  const filteredCheckIns = useMemo(() => centerCheckIns.filter((item) => {
    const matchesStage = stageFilter === 'All'
      || (stageFilter === 'Completed' && item.stage === 'Completed')
      || (stageFilter === 'Waiting / Ready' && /waiting|ready/i.test(item.stage))
      || (stageFilter === 'Clinical holds' && item.stage === 'Hold')
      || (stageFilter === 'Cleared' && item.stage === 'Cleared by Counselor');
    const matchesQuery = `${item.patient} ${item.id} ${item.visit} ${item.detail} ${item.stage}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesStage && matchesQuery;
  }), [centerCheckIns, query, stageFilter]);

  const confirmClearance = () => {
    if (!selectedHoldItem) return;
    setCheckInsData((prev) => prev.map((item) => (
      item.id === selectedHoldItem.id
        ? { ...item, stage: 'Cleared by Counselor', detail: 'Cleared by counselor Morgan Reed. Nursing team notified.' }
        : item
    )));
    addToast(`Clinical hold cleared for ${selectedHoldItem.patient}. Dosing nurse notified.`, 'success');
    setSelectedHoldItem(null);
  };

  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="Medication visit status" description="Visibility into daily medication visits, clinical holds, and coordinated counseling clearance for dosing." />
      <div className="bhg-admin-stat-grid three">
        <Stat icon={CheckCircle2} label="Completed" value={centerCheckIns.filter((item) => item.stage === 'Completed').length} note="Current portal view" tone="success" />
        <Stat icon={Clock3} label="Waiting / ready" value={centerCheckIns.filter((item) => /waiting|ready/i.test(item.stage)).length} note="Current portal view" />
        <Stat icon={AlertTriangle} label="Clinical holds" value={centerCheckIns.filter((item) => item.stage === 'Hold').length} note="Requires counselor or provider review" tone="warning" />
      </div>
      <section className="bhg-card">
        <AdminSearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search patient name, queue reason, or visit details..."
        />
        <div style={{ marginBottom: 16 }}>
          <AdminFilterBar
            options={['All', 'Completed', 'Waiting / Ready', 'Clinical holds', 'Cleared']}
            value={stageFilter}
            onChange={setStageFilter}
            label="Filter check-ins"
          />
        </div>
        <Table
          columns={['Arrival', 'Patient', 'Queue reason', 'Details', 'Status', 'Action']}
          rows={filteredCheckIns}
          render={(row) => (
            <>
              <td>{row.time}</td>
              <td><strong>{row.patient}</strong><small>{row.id}</small></td>
              <td>{row.visit}</td>
              <td>{row.detail}</td>
              <td><Status>{row.stage}</Status></td>
              <td>
                {row.stage === 'Hold' ? (
                  <button
                    type="button"
                    className="bhg-button"
                    style={{ minHeight: 28, padding: '3px 8px', fontSize: '11px', whiteSpace: 'nowrap' }}
                    onClick={() => {
                      setSelectedHoldItem(row);
                      setClearanceNote('Attended scheduled counseling session with Morgan Reed, LPC-MHSP. Treatment engagement and coping routine reviewed. Patient cleared for daily dosing window.');
                    }}
                  >
                    <CheckCircle2 size={13} style={{ marginRight: 4 }} /> Clear for Dosing
                  </button>
                ) : row.stage === 'Cleared by Counselor' ? (
                  <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>Cleared by Counselor</span>
                ) : (
                  <span className="bhg-table-muted">—</span>
                )}
              </td>
            </>
          )}
        />
      </section>
      <div className="bhg-info-banner">
        <ShieldCheck size={16} /> Counselors can clear clinical holds following completed counseling visits. Prescription modifications, dose adjustments, and take-home authorizations remain restricted to medical providers.
      </div>

      {selectedHoldItem && (
        <WorkflowModal
          title={`Clear Dosing Hold · ${selectedHoldItem.patient}`}
          subtitle={`${selectedHoldItem.visit} · ${selectedHoldItem.id}`}
          onClose={() => setSelectedHoldItem(null)}
          footer={
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setSelectedHoldItem(null)}>Cancel</button>
              <button type="button" className="bhg-button" onClick={confirmClearance}>
                <CheckCircle2 size={15} /> Confirm & Notify Dosing Nurse
              </button>
            </>
          }
        >
          <DemoBanner>Clearing this hold updates the dosing queue at the medical window in real time.</DemoBanner>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8 }}>
              <strong style={{ color: '#991B1B', display: 'block', marginBottom: 2 }}>Current Hold Reason</strong>
              <span style={{ fontSize: '13px', color: '#7F1D1D' }}>{selectedHoldItem.detail}</span>
            </div>

            <Field label="Counselor Clinical Clearance Note">
              <textarea
                rows="3"
                value={clearanceNote}
                onChange={(e) => setClearanceNote(e.target.value)}
              />
            </Field>

            <div style={{ padding: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, fontSize: '12px', color: '#166534' }}>
              <ShieldCheck size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              <strong>Nurse Handoff:</strong> Dosing team will see: <em>"{clearanceNote}"</em> timestamped by Morgan Reed, LPC-MHSP.
            </div>
          </div>
        </WorkflowModal>
      )}
    </div>
  );
}
function SessionFilter({ label, value, options, onChange }) {
  return (
    <div className="bhg-session-filter-group">
      <span>{label}</span>
      <AdminFilterBar
        options={options}
        value={value}
        onChange={onChange}
        label={`Filter sessions by ${label}`}
        style={{ gap: 4, paddingBottom: 0 }}
        chipStyle={{ fontSize: '11px', padding: '3px 8px', borderRadius: '13px' }}
      />
    </div>
  );
}

export function AdminAppointments() {
  const { navigate, selectedTreatmentCenterId, selectedTreatmentCenter, addToast } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedGroupNotes, setSelectedGroupNotes] = useState(null);
  const [selectedNotHeld, setSelectedNotHeld] = useState(null);
  const [selectedQuickPrep, setSelectedQuickPrep] = useState(null);

  const hasActiveFilters = statusFilter !== 'All' || modalityFilter !== 'All' || typeFilter !== 'All' || Boolean(query.trim());
  const resetFilters = () => {
    setStatusFilter('All');
    setModalityFilter('All');
    setTypeFilter('All');
    setQuery('');
  };

  const filteredSessions = useMemo(() => rowsForCenter(sessionRecords, selectedTreatmentCenterId).filter((session) => {
    const searchValue = `${session.patients.join(' ')} ${session.type} ${session.service} ${session.status} ${session.modality}`.toLowerCase();
    return searchValue.includes(query.trim().toLowerCase())
      && (statusFilter === 'All' || session.status === statusFilter)
      && (modalityFilter === 'All' || session.modality === modalityFilter)
      && (typeFilter === 'All' || session.type === typeFilter);
  }), [modalityFilter, query, selectedTreatmentCenterId, statusFilter, typeFilter]);

  const openNote = (session, patientName = session.patients[0]) => navigate(`admin-session-note?session=${encodeURIComponent(session.id)}&patient=${encodeURIComponent(patientName)}`);

  return (
    <div className="bhg-page bhg-sessions-page">
      <AdminHeader eyebrow={`Documentation workflow · ${selectedTreatmentCenter.shortName}`} title="Sessions" description="Review individual and group sessions, locked documentation, attendance, and sessions that were not held." />

      <section className="bhg-session-filter-card" aria-label="Session filters">
        <AdminSearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by patient name, session type, service, or status..."
          style={{ marginBottom: 0 }}
        />
        <div className="bhg-session-filter-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={14} color="#005A70" />
            <span>Filters</span>
            <small>Combine filters to narrow the session list.</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {hasActiveFilters && (
              <button
                type="button"
                className="bhg-text-button"
                onClick={resetFilters}
                style={{ fontSize: '11.5px', padding: '2px 8px', color: '#005A70', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Reset filters
              </button>
            )}
            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>
              {filteredSessions.length} session{filteredSessions.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        <div className="bhg-session-filter-grid">
          <SessionFilter label="Status" value={statusFilter} options={['All', 'Scheduled', 'Completed', 'Session not held']} onChange={setStatusFilter} />
          <span className="bhg-session-filter-divider" aria-hidden="true" />
          <SessionFilter label="Modality" value={modalityFilter} options={['All', 'In person', 'Zoom']} onChange={setModalityFilter} />
          <span className="bhg-session-filter-divider" aria-hidden="true" />
          <SessionFilter label="Type" value={typeFilter} options={['All', 'Individual', 'Group']} onChange={setTypeFilter} />
        </div>
      </section>

      <section className="bhg-card bhg-session-table-card">
        <div className="bhg-section-title"><div><h2>Session history</h2><p>Notes are available only for completed sessions and remain locked.</p></div><Status>{filteredSessions.length} sessions</Status></div>
        {filteredSessions.length ? <Table columns={['Date', 'Patient(s)', 'Treatment center', 'Service', 'Type', 'Modality', 'Status', 'Action']} rows={filteredSessions} render={(session) => <>
          <td><strong>{session.date}</strong><small>{session.time}</small></td>
          <td><strong>{session.type === 'Group' ? `${session.patients.length} patients` : session.patients[0]}</strong>{session.type === 'Group' && <small>{session.patients.join(', ')}</small>}</td>
          <td>{centerLabels[session.centerId]}</td><td>{session.service}</td><td>{session.type}</td><td><Status>{session.modality}</Status></td><td><Status>{session.status}</Status></td>
          <td><div className="bhg-session-actions">
            {session.type === 'Individual' && (
              <button
                type="button"
                className="bhg-text-button"
                style={{ color: '#005A70', fontWeight: 600 }}
                onClick={() => setSelectedQuickPrep(session)}
                title="Pre-session clinical briefing"
              >
                Quick Prep
              </button>
            )}
            {session.status === 'Scheduled' && session.type === 'Group' && <span>No note</span>}
            {session.status === 'Session not held' && <button type="button" className="bhg-text-button" onClick={() => setSelectedNotHeld(session)}>View note</button>}
            {session.status === 'Completed' && session.type === 'Individual' && <button type="button" className="bhg-text-button" onClick={() => openNote(session)}>Open note</button>}
            {session.status === 'Completed' && session.type === 'Group' && <><button type="button" className="bhg-text-button" onClick={() => setSelectedAttendance(session)}>Attendance</button><button type="button" className="bhg-text-button" onClick={() => setSelectedGroupNotes(session)}>Open notes</button></>}
          </div></td>
        </>} /> : <div className="bhg-admin-empty"><Search size={22} /><strong>No sessions match these filters</strong><span>Clear the search or select a different filter combination.</span></div>}
      </section>

      {selectedAttendance && <WorkflowModal title="Group session attendance" subtitle={`${selectedAttendance.service} · ${selectedAttendance.date} at ${selectedAttendance.time}`} onClose={() => setSelectedAttendance(null)} footer={<button className="bhg-button" onClick={() => setSelectedAttendance(null)}>Close</button>}>
        <DemoBanner>Attendance is synchronized from the completed session and is read-only in the Clinician Portal.</DemoBanner>
        <div className="bhg-attendance-list">{selectedAttendance.attendance.map((item) => <div key={item.name}><strong>{item.name}</strong><Status>{item.status}</Status></div>)}</div>
      </WorkflowModal>}

      {selectedGroupNotes && <WorkflowModal title={`Group session · ${selectedGroupNotes.service}`} subtitle={`${selectedGroupNotes.date} · ${selectedGroupNotes.time} · notes are kept separately per patient`} onClose={() => setSelectedGroupNotes(null)} footer={<button className="bhg-button" onClick={() => setSelectedGroupNotes(null)}>Close</button>}>
        <DemoBanner>Each attendee’s completed note is locked and maintained separately.</DemoBanner>
        <div className="bhg-group-note-list">{selectedGroupNotes.attendance.map((item) => <div key={item.name}><span><strong>{item.name}</strong><small>{item.status}</small></span>{selectedGroupNotes.groupNotes[item.name] ? <button type="button" className="bhg-text-button" onClick={() => openNote(selectedGroupNotes, item.name)}>Open note</button> : <span className="bhg-table-muted">No note</span>}</div>)}</div>
      </WorkflowModal>}

      {selectedNotHeld && <WorkflowModal title="Session not held" subtitle={`${selectedNotHeld.patients[0]} · ${selectedNotHeld.service} · ${selectedNotHeld.date}`} onClose={() => setSelectedNotHeld(null)} footer={<button className="bhg-button" onClick={() => setSelectedNotHeld(null)}>Close</button>}>
        <div className="bhg-not-held-reason"><AlertTriangle size={18} /><div><strong>Documented reason</strong><p>{selectedNotHeld.reason}</p></div></div>
      </WorkflowModal>}

      {selectedQuickPrep && (() => {
        const pName = selectedQuickPrep.patients[0];
        const pObj = patients.find((p) => p.name === pName);
        const todayCheckIn = checkIns.find((c) => c.patient === pName);
        const latestUds = uds.find((u) => u.patient === pName);
        const pHomework = defaultCbtHomework.filter((h) => h.patient === pName);
        const pOutcomes = getPatientOutcomes(pName);
        const priorSession = sessionRecords.find(
          (s) => s.status === 'Completed' && s.id !== selectedQuickPrep.id && s.patients.includes(pName)
        );
        const priorNote = priorSession?.type === 'Group' ? priorSession.groupNotes?.[pName] : priorSession?.note;

        return (
          <WorkflowModal
            title={`Pre-Session Quick-Prep · ${pName}`}
            subtitle={`${selectedQuickPrep.service} · ${selectedQuickPrep.date} at ${selectedQuickPrep.time} (${selectedQuickPrep.modality})`}
            onClose={() => setSelectedQuickPrep(null)}
            size="lg"
            footer={
              <>
                <button
                  type="button"
                  className="bhg-button bhg-button-secondary"
                  onClick={() => setSelectedQuickPrep(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="bhg-button bhg-button-secondary"
                  onClick={() => {
                    navigate(`admin-patient-profile?id=${pObj?.id || 'BHG-20481'}`);
                    setSelectedQuickPrep(null);
                  }}
                >
                  <FileText size={14} style={{ marginRight: 5 }} /> Open Full Chart
                </button>
                {selectedQuickPrep.modality === 'Zoom' && (
                  <button
                    type="button"
                    className="bhg-button"
                    onClick={() => {
                      addToast(`Connecting to simulated telehealth room for ${pName}...`, 'info');
                    }}
                  >
                    <Video size={14} style={{ marginRight: 5 }} /> Launch Telehealth Visit
                  </button>
                )}
              </>
            }
          >
            <DemoBanner>
              Pre-session clinical briefing combines medical dosing status, recent toxicology, DAP continuity, and CBT homework.
            </DemoBanner>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Top Quick Status Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 10,
                  padding: 12,
                  background: '#F8FAFC',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <small style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Program & Phase
                  </small>
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>
                    {pObj ? `${pObj.program} · ${pObj.phase}` : 'OTP · Stabilization'}
                  </strong>
                </div>

                <div>
                  <small style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Today's Medication Window
                  </small>
                  {todayCheckIn ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: todayCheckIn.stage === 'Hold' ? '#DC2626' : todayCheckIn.stage === 'Completed' ? '#059669' : '#0284C7',
                      }}
                    >
                      {todayCheckIn.stage === 'Hold' ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                      {todayCheckIn.stage === 'Completed' ? `Dosed (${todayCheckIn.time})` : todayCheckIn.stage === 'Hold' ? 'Hold - Counselor review' : todayCheckIn.stage}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12.5px', color: '#64748B' }}>Expected before 11:30 AM</span>
                  )}
                </div>

                <div>
                  <small style={{ color: '#64748B', display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Latest Toxicology (UDS)
                  </small>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: latestUds?.result === 'Exception' ? '#D97706' : '#059669',
                    }}
                  >
                    <TestTube2 size={13} />
                    {latestUds ? `${latestUds.result} (${latestUds.collected})` : 'Consistent (Sep 12)'}
                  </span>
                </div>
              </div>

              {/* DAP Note Continuity */}
              <div style={{ padding: 12, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <strong style={{ color: '#005A70', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={14} /> Prior Session Plan (Continuity Check)
                  </strong>
                  {priorSession && (
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      Session on {priorSession.date}
                    </span>
                  )}
                </div>
                {priorNote ? (
                  <p style={{ margin: 0, color: '#334155', fontSize: '12.5px', lineHeight: 1.5, background: '#F8FAFC', padding: '8px 10px', borderRadius: 6, fontStyle: 'italic' }}>
                    "{priorNote.plan}"
                  </p>
                ) : (
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12.5px' }}>
                    Initial session or no previous finalized DAP note recorded. Establish baseline goals during today's visit.
                  </p>
                )}
              </div>

              {/* CBT Homework & Between-Session Practice */}
              <div style={{ padding: 12, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ color: '#0F172A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookOpen size={14} color="#005A70" /> Between-Session CBT Practice
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {pHomework.length} exercise{pHomework.length === 1 ? '' : 's'} logged
                  </span>
                </div>

                {pHomework.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pHomework.slice(0, 2).map((hw) => (
                      <div
                        key={hw.id}
                        style={{
                          padding: '8px 10px',
                          background: hw.status === 'Completed' ? '#F0FDF4' : '#F8FAFC',
                          border: `1px solid ${hw.status === 'Completed' ? '#BBF7D0' : '#E2E8F0'}`,
                          borderRadius: 6,
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, color: '#0F172A' }}>{hw.title}</span>
                          <Status>{hw.status}</Status>
                        </div>
                        {hw.rationalResponse && (
                          <div style={{ color: '#166534', fontSize: '11.5px', marginTop: 2 }}>
                            <b>Patient Reframing:</b> "{hw.rationalResponse.slice(0, 110)}..."
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: '#64748B', fontSize: '12.5px' }}>
                    No completed homework submitted for this session. Assign practice via the Patient Profile.
                  </p>
                )}
              </div>

              {/* Longitudinal Trends & Trajectory */}
              <div style={{ padding: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <strong style={{ color: '#0F172A', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <TrendingDown size={14} color="#059669" /> CBT Trajectory Snapshot
                </strong>
                <div style={{ display: 'flex', gap: 16, fontSize: '12px', color: '#334155', marginBottom: 4 }}>
                  <span>
                    <b>PHQ-9:</b> {pOutcomes.phq9[pOutcomes.phq9.length - 1].score} ({pOutcomes.phq9[pOutcomes.phq9.length - 1].severity})
                  </span>
                  <span>
                    <b>GAD-7:</b> {pOutcomes.gad7[pOutcomes.gad7.length - 1].score} ({pOutcomes.gad7[pOutcomes.gad7.length - 1].severity})
                  </span>
                  <span>
                    <b>Craving:</b> {pOutcomes.cravingIndex[pOutcomes.cravingIndex.length - 1].label}
                  </span>
                </div>
                <small style={{ color: '#64748B', fontSize: '11px', display: 'block' }}>{pOutcomes.summary}</small>
              </div>
            </div>
          </WorkflowModal>
        );
      })()}
    </div>
  );
}

export function AdminSessionNote() {
  const { navigate } = useApp();
  const [searchParams] = useSearchParams();
  const session = sessionRecords.find((item) => item.id === searchParams.get('session'));
  const patientName = searchParams.get('patient') || session?.patients[0] || 'Patient';
  const note = session?.type === 'Group' ? session.groupNotes?.[patientName] : session?.note;

  if (!session || session.status !== 'Completed' || !note) {
    return <div className="bhg-page"><button type="button" className="bhg-profile-back" onClick={() => navigate('admin-appointments')}><ArrowLeft size={16} /> Back to Sessions</button><section className="bhg-card bhg-admin-empty"><AlertTriangle size={22} /><strong>Completed note not available</strong><span>Notes appear only for completed sessions with finalized documentation.</span></section></div>;
  }

  return (
    <div className="bhg-page bhg-session-note-page">
      <button type="button" className="bhg-profile-back" onClick={() => navigate('admin-appointments')}><ArrowLeft size={16} /> Back to Sessions</button>
      <section className="bhg-card bhg-session-note-header">
        <div><div className="bhg-eyebrow">{session.type} session · {centerLabels[session.centerId]}</div><h1>DAP Note · {patientName}</h1><p>{session.service} · {session.date} · {session.time} · {session.modality}</p></div>
        <Status>Completed</Status>
      </section>
      <div className="bhg-session-note-lock"><LockKeyhole size={18} /><div><strong>Signed and locked</strong><p>This finalized note is view-only and cannot be edited from the Clinician Portal.</p></div></div>
      <section className="bhg-card bhg-session-note-content">
        <article><span>Data</span><p>{note.data}</p></article>
        <article><span>Assessment</span><p>{note.assessment}</p></article>
        <article><span>Plan</span><p>{note.plan}</p></article>
        <footer><LockKeyhole size={14} /> Finalized by {note.author} · {note.finalized}</footer>
      </section>
    </div>
  );
}

export function AdminCounseling() {
  const { selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const centerCounseling = rowsForCenter(counseling, selectedTreatmentCenterId);
  const filteredCounseling = useMemo(() => centerCounseling.filter((item) => {
    const matchesStatus = statusFilter === 'All'
      || (statusFilter === 'On track' && item.completion === 'On track')
      || (statusFilter === 'Due today' && item.completion === 'Due today')
      || (statusFilter === 'Needs attention' && /attention|overdue/i.test(item.completion));
    const matchesQuery = `${item.patient} ${item.service} ${item.counselor} ${item.followUp}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesStatus && matchesQuery;
  }), [centerCounseling, query, statusFilter]);

  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="Counseling & goals" description="Track required services, collaborative goals, and patient follow-up without duplicating session note capture." />
      <div className="bhg-admin-stat-grid"><Stat icon={MessageSquareText} label="Assigned services" value={centerCounseling.length} note="Current portal view" /><Stat icon={HeartHandshake} label="On track" value={centerCounseling.filter((item) => item.completion === 'On track').length} note="Goals and services" tone="success" /><Stat icon={UsersRound} label="Treatment centers" value={selectedTreatmentCenterId === 'all' ? 3 : 1} note="Current portal view" /><Stat icon={AlertTriangle} label="Needs attention" value={centerCounseling.filter((item) => /attention|overdue|due today/i.test(item.completion)).length} note="Requires follow-up" tone="warning" /></div>
      <section className="bhg-card">
        <AdminSearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by patient, required service, or counselor..."
        />
        <div style={{ marginBottom: 16 }}>
          <AdminFilterBar
            options={['All', 'On track', 'Due today', 'Needs attention']}
            value={statusFilter}
            onChange={setStatusFilter}
            label="Filter counseling"
          />
        </div>
        <Table columns={['Patient', 'Required service', 'Counselor', 'Due', 'Next follow-up', 'Status']} rows={filteredCounseling} render={(row) => <>
          <td><strong>{row.patient}</strong></td><td>{row.service}</td><td>{row.counselor}</td><td>{row.due}</td><td>{row.followUp}</td><td><Status>{row.completion}</Status></td>
        </>} />
      </section>
      <div className="bhg-info-banner"><ShieldCheck size={16} /> Session recording, transcription, and note generation stay in BHG’s AI notetaker. This portal displays only approved patient-facing summaries and follow-up actions.</div>
    </div>
  );
}

export function AdminLabs() {
  const { selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const [query, setQuery] = useState('');
  const [reviewFilter, setReviewFilter] = useState('All');
  const centerUds = rowsForCenter(uds, selectedTreatmentCenterId);
  const filteredUds = useMemo(() => centerUds.filter((item) => {
    const matchesFilter = reviewFilter === 'All'
      || (reviewFilter === 'Reviewed' && item.review === 'Reviewed')
      || (reviewFilter === 'Pending review' && item.review !== 'Reviewed')
      || (reviewFilter === 'Exceptions' && item.result === 'Exception');
    const matchesQuery = `${item.patient} ${item.type} ${item.result} ${item.review}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  }), [centerUds, query, reviewFilter]);

  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="UDS & labs" description="Collection status and clinical review routing. Detailed results remain access-controlled." />
      <div className="bhg-admin-stat-grid three"><Stat icon={TestTube2} label="Collections shown" value={centerUds.length} note="Current portal view" /><Stat icon={CheckCircle2} label="Reviewed" value={centerUds.filter((item) => item.review === 'Reviewed').length} note="Current portal view" tone="success" /><Stat icon={AlertTriangle} label="Exceptions" value={centerUds.filter((item) => item.result === 'Exception').length} note="Clinical review required" tone="warning" /></div>
      <section className="bhg-card">
        <AdminSearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by patient name, test type, or result..."
        />
        <div style={{ marginBottom: 16 }}>
          <AdminFilterBar
            options={['All', 'Reviewed', 'Pending review', 'Exceptions']}
            value={reviewFilter}
            onChange={setReviewFilter}
            label="Filter UDS and labs"
          />
        </div>
        <Table columns={['Patient', 'Test', 'Collected', 'Result category', 'Review']} rows={filteredUds} render={(row) => <>
          <td><strong>{row.patient}</strong></td><td>{row.type}</td><td>{row.collected}</td><td><Status>{row.result}</Status></td><td><Status>{row.review}</Status></td>
        </>} />
      </section>
    </div>
  );
}

export function AdminCareCoordination() {
  const { workItems, selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const [refQuery, setRefQuery] = useState('');
  const [refFilter, setRefFilter] = useState('All');
  const openWorkItems = workItems.filter((item) => item.status !== 'Resolved' && (selectedTreatmentCenterId === 'all' || (item.centerId || 'knoxville-bernard') === selectedTreatmentCenterId)).length;
  const centerReferrals = rowsForCenter(referrals, selectedTreatmentCenterId);
  const filteredReferrals = useMemo(() => centerReferrals.filter((item) => {
    const matchesFilter = refFilter === 'All'
      || (refFilter === 'Connected' && item.status === 'Connected')
      || (refFilter === 'Patient reviewing' && item.status === 'Patient reviewing')
      || (refFilter === 'Pending' && item.status === 'Pending');
    const matchesQuery = `${item.patient} ${item.need} ${item.owner} ${item.status}`.toLowerCase().includes(refQuery.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  }), [centerReferrals, refFilter, refQuery]);

  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="Care coordination" description="Route patient needs, medical-review requests, referrals, and access barriers to the right team." />
      <div className="bhg-admin-stat-grid three"><Stat icon={MessageSquareText} label="Open patient requests" value={openWorkItems} note="From the Patient Portal" /><Stat icon={HeartHandshake} label="Active referrals" value={centerReferrals.length} note="Current portal view" tone="success" /><Stat icon={AlertTriangle} label="Access barriers" value={centerReferrals.filter((item) => /pending|reviewing/i.test(item.status)).length} note="Requires coordination" tone="warning" /></div>
      <section className="bhg-card"><div className="bhg-section-title"><div><h2>Patient request routing</h2><p>Medication questions go to an authorized medical provider; counselors coordinate and follow up.</p></div></div><WorkQueue /></section>
      <section className="bhg-card">
        <div className="bhg-section-title"><div><h2>Referrals and supports</h2><p>Shared care actions that can be surfaced to patients without exposing internal notes.</p></div></div>
        <AdminSearchBar
          value={refQuery}
          onChange={setRefQuery}
          placeholder="Search patient, need, or owner..."
        />
        <div style={{ marginBottom: 16 }}>
          <AdminFilterBar
            options={['All', 'Connected', 'Patient reviewing', 'Pending']}
            value={refFilter}
            onChange={setRefFilter}
            label="Filter referrals"
          />
        </div>
        <Table columns={['Patient', 'Need', 'Owner', 'Status']} rows={filteredReferrals} render={(row) => <>
          <td><strong>{row.patient}</strong></td><td>{row.need}</td><td>{row.owner}</td><td><Status>{row.status}</Status></td>
        </>} />
      </section>
    </div>
  );
}

// ==========================================
// CBT TOOL LIBRARY COMPONENT
// ==========================================

export function AdminCbtLibrary() {
  const { selectedTreatmentCenter, addToast } = useApp();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [previewTool, setPreviewTool] = useState(null);
  const [assignTool, setAssignTool] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [assignDueDate, setAssignDueDate] = useState('Sep 24, 2026');
  const [assignNote, setAssignNote] = useState('');

  const filteredTools = useMemo(() => {
    return cbtResourceLibrary.filter((tool) => {
      const matchesCategory = categoryFilter === 'All' || tool.category === categoryFilter;
      const matchesQuery = `${tool.title} ${tool.category} ${tool.summary} ${tool.instructions || ''}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [categoryFilter, query]);

  const handlePrint = (tool) => {
    addToast(`Prepared printable PDF worksheet for "${tool.title}".`, 'success');
  };

  const handleAssignSubmit = () => {
    const pt = patients.find((p) => p.id === selectedPatientId) || patients[0];
    addToast(`Assigned "${assignTool.title}" to ${pt.name}. Due: ${assignDueDate}`, 'success');
    setAssignTool(null);
    setAssignNote('');
  };

  return (
    <div className="bhg-page clinician-content">
      <AdminHeader
        eyebrow={`Evidence-based therapy · ${selectedTreatmentCenter.shortName}`}
        title="CBT Tool Library"
        description="Clinically validated handouts, worksheets, and cognitive restructuring exercises tailored for addiction medicine and relapse prevention."
      />

      <div className="bhg-admin-stat-grid three">
        <Stat icon={BookOpen} label="Tools in Library" value={cbtResourceLibrary.length} note="Evidence-based protocols" />
        <Stat icon={Sparkles} label="Clinical Domains" value="4 Domains" note="Restructuring, Craving, Behavioral, Panic" tone="success" />
        <Stat icon={CheckCircle2} label="Caseload Adherence" value="83%" note="Completed & active homework" tone="primary" />
      </div>

      <section className="bhg-card">
        <AdminSearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by tool name, clinical category, or cognitive technique..."
        />
        <div style={{ marginBottom: 16 }}>
          <AdminFilterBar
            options={['All', 'Cognitive Restructuring', 'Craving Management', 'Behavioral Activation', 'Anxiety & Panic']}
            value={categoryFilter}
            onChange={setCategoryFilter}
            label="Filter CBT tools by clinical category"
          />
        </div>

        <div className="bhg-cbt-tool-grid">
          {filteredTools.map((tool) => (
            <div className="bhg-cbt-tool-card" key={tool.id}>
              <div>
                <div className="bhg-cbt-tool-header">
                  <span className="bhg-pill bhg-pill-primary">{tool.category}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                    <Clock3 size={13} /> {tool.duration || '15 mins'}
                  </span>
                </div>
                <h3 className="bhg-cbt-tool-title">{tool.title}</h3>
                <p className="bhg-cbt-tool-summary">{tool.summary}</p>
                {tool.instructions && (
                  <div className="bhg-cbt-tool-outcome">
                    <strong>Counselor Guidance:</strong> {tool.instructions}
                  </div>
                )}
              </div>

              <div className="bhg-cbt-tool-actions">
                <button
                  type="button"
                  className="bhg-button secondary"
                  style={{ fontSize: 12.5, padding: '7px 12px' }}
                  onClick={() => setPreviewTool(tool)}
                >
                  <BookOpen size={14} /> Preview Guide
                </button>
                <button
                  type="button"
                  className="bhg-button"
                  style={{ fontSize: 12.5, padding: '7px 12px' }}
                  onClick={() => {
                    setAssignTool(tool);
                    setSelectedPatientId(patients[0]?.id || '');
                  }}
                >
                  <Plus size={14} /> Assign to Patient
                </button>
                <button
                  type="button"
                  className="bhg-button secondary"
                  style={{ fontSize: 12.5, padding: '7px 10px', marginLeft: 'auto' }}
                  title="Print or export PDF worksheet"
                  onClick={() => handlePrint(tool)}
                >
                  <Printer size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Preview Modal */}
      {previewTool && (
        <WorkflowModal
          title={previewTool.title}
          eyebrow={`CBT Protocol · ${previewTool.category}`}
          onClose={() => setPreviewTool(null)}
          actions={
            <>
              <button
                type="button"
                className="bhg-button secondary"
                onClick={() => handlePrint(previewTool)}
              >
                <Printer size={14} /> Print Worksheet
              </button>
              <button
                type="button"
                className="bhg-button"
                onClick={() => {
                  const t = previewTool;
                  setPreviewTool(null);
                  setAssignTool(t);
                  setSelectedPatientId(patients[0]?.id || '');
                }}
              >
                <Plus size={14} /> Assign to Patient
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: 13, color: '#1e293b' }}>Clinical Summary & Objective:</strong>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{previewTool.summary}</p>
            </div>

            {previewTool.instructions && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>Clinical Instructions & Practice:</h4>
                <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{previewTool.instructions}</p>
              </div>
            )}

            {previewTool.content && (
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Handout / Worksheet Material:</h4>
                <pre style={{ margin: 0, fontSize: 12.5, color: '#334155', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.55 }}>
                  {previewTool.content}
                </pre>
              </div>
            )}
          </div>
        </WorkflowModal>
      )}

      {/* Assign Tool to Patient Modal */}
      {assignTool && (
        <WorkflowModal
          title={`Assign "${assignTool.title}"`}
          eyebrow="Prescribe CBT Exercise"
          onClose={() => setAssignTool(null)}
          actions={
            <button type="button" className="bhg-button" onClick={handleAssignSubmit}>
              <Send size={14} /> Send Assignment to Patient Portal
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Target Patient from Caseload">
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              >
                {patients.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name} ({pt.id}) · {pt.program} ({pt.phase})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Assignment Target Due Date">
              <input
                type="text"
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
                placeholder="e.g. Sep 24, 2026"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </Field>

            <Field label="Counselor Guidance Note (Shown to Patient in Portal)">
              <textarea
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
                rows={3}
                placeholder="e.g., Focus on your Tuesday evening commute triggers and practice the 4-4-6 breathing before logging."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13.5 }}
              />
            </Field>

            <div style={{ fontSize: 12, color: '#64748b', background: '#f8fafc', padding: 10, borderRadius: 6 }}>
              ℹ️ Once assigned, this exercise appears immediately in the patient’s Recovery Goals tab and triggers a secure notification.
            </div>
          </div>
        </WorkflowModal>
      )}
    </div>
  );
}

// ==========================================
// GROUP SESSIONS COMPONENT
// ==========================================

export function AdminGroupSessions() {
  const { selectedTreatmentCenterId, selectedTreatmentCenter, addToast } = useApp();
  const [groups, setGroups] = useState(defaultGroupPrograms);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [activeRosterGroup, setActiveRosterGroup] = useState(null);
  const [activeDapGroup, setActiveDapGroup] = useState(null);
  const [activePrevModal, setActivePrevModal] = useState(null);
  const [telehealthModalGroup, setTelehealthModalGroup] = useState(null);
  const [activeNotesGroup, setActiveNotesGroup] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [activeNotHeldGroup, setActiveNotHeldGroup] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // DAP Note editing state
  const [dapData, setDapData] = useState('');
  const [dapAssessment, setDapAssessment] = useState('');
  const [dapPlan, setDapPlan] = useState('');

  const centerGroups = useMemo(() => groups.filter((grp) => (
    selectedTreatmentCenterId === 'all' || grp.centerId === selectedTreatmentCenterId
  )), [groups, selectedTreatmentCenterId]);

  const filteredGroups = useMemo(() => {
    return centerGroups.filter((grp) => {
      const matchesStatus = statusFilter === 'All' || grp.status === statusFilter;
      const matchesModality = modalityFilter === 'All'
        || (modalityFilter === 'In person' && grp.modality.includes('In person'))
        || (modalityFilter === 'Zoom' && grp.modality.includes('Zoom'));
      const topic = grp.focusTopic || grp.currentTopic || grp.reason || '';
      const matchesQuery = `${grp.name} ${grp.facilitator} ${topic} ${grp.location} ${grp.status}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesStatus && matchesModality && matchesQuery;
    });
  }, [centerGroups, statusFilter, modalityFilter, query]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, modalityFilter, selectedTreatmentCenterId, itemsPerPage]);

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage) || 1;
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(start, start + itemsPerPage);
  }, [filteredGroups, currentPage, itemsPerPage]);

  const scheduledCount = useMemo(() => centerGroups.filter((g) => g.status === 'Scheduled').length, [centerGroups]);
  const completedCount = useMemo(() => centerGroups.filter((g) => g.status === 'Completed').length, [centerGroups]);
  const notHeldCount = useMemo(() => centerGroups.filter((g) => g.status === 'Session not held').length, [centerGroups]);

  const handleToggleAttendance = (groupId, memberId, newStatus) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== groupId) return grp;
        const roster = grp.attendance || [];
        const updatedRoster = roster.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m));
        return { ...grp, attendance: updatedRoster };
      })
    );
    if (activeRosterGroup && activeRosterGroup.id === groupId) {
      setActiveRosterGroup((prev) => {
        const roster = prev.attendance || [];
        const updatedRoster = roster.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m));
        return { ...prev, attendance: updatedRoster };
      });
    }
  };

  const openDapModal = (grp) => {
    setActiveDapGroup(grp);
    const note = grp.lastGroupDapNote || grp.dapNote || {};
    setDapData(note.data || '');
    setDapAssessment(note.assessment || '');
    setDapPlan(note.plan || '');
  };

  const saveDapNote = (lock = false) => {
    if (!activeDapGroup) return;
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id !== activeDapGroup.id) return grp;
        const prevNote = grp.lastGroupDapNote || grp.dapNote || {};
        const updatedNote = {
          ...prevNote,
          data: dapData,
          assessment: dapAssessment,
          plan: dapPlan,
          finalized: lock ? 'Locked & Signed' : prevNote.finalized,
          locked: lock || prevNote.locked,
        };
        return {
          ...grp,
          lastGroupDapNote: updatedNote,
          dapNote: updatedNote,
        };
      })
    );
    addToast(lock ? `Group note for "${activeDapGroup.name}" locked & signed.` : `Group draft note saved.`, 'success');
    setActiveDapGroup(null);
  };

  const openPatientNotesModal = (grp) => {
    setActiveNotesGroup(grp);
    setSelectedPatientId(null);
  };

  return (
    <div className="bhg-page clinician-content">
      <AdminHeader
        eyebrow={`Group therapy workflow · ${selectedTreatmentCenter.shortName}`}
        title="Group Sessions"
        description="Facilitate recovery skills cohorts, manage attendee rosters, track group participation, and lock compliant DAP clinical documentation."
      />

      <div className="bhg-admin-stat-grid four">
        <Stat icon={UsersRound} label="Cohorts shown" value={filteredGroups.length} note="Current filtered view" />
        <Stat icon={CalendarDays} label="Scheduled" value={scheduledCount} note="Upcoming sessions" tone="primary" />
        <Stat icon={CheckCircle2} label="Completed" value={completedCount} note="Documented & locked" tone="success" />
        <Stat icon={AlertTriangle} label="Not Held" value={notHeldCount} note="Documented exceptions" tone="warning" />
      </div>

      <section className="bhg-card">
        <AdminSearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by group name, topic, facilitator, room, or status..."
        />
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ flex: '1 1 320px' }}>
            <AdminFilterBar
              options={['All', 'Scheduled', 'Completed', 'Session not held']}
              value={statusFilter}
              onChange={setStatusFilter}
              label="Filter group sessions by status"
            />
          </div>
          <div style={{ flex: '0 1 240px' }}>
            <AdminFilterBar
              options={['All', 'In person', 'Zoom']}
              value={modalityFilter}
              onChange={setModalityFilter}
              label="Filter group sessions by modality"
            />
          </div>
        </div>

        <div className="bhg-group-grid">
          {paginatedGroups.map((grp) => {
            const roster = grp.attendance || [];
            const isZoom = grp.modality.includes('Zoom');
            const dap = grp.lastGroupDapNote || grp.dapNote || {};
            const isLocked = dap.locked || (dap.finalized && dap.finalized.includes('Locked'));
            const prevAppt = grp.previousAppointment;
            const isNotHeld = grp.status === 'Session not held';
            const isScheduled = grp.status === 'Scheduled';

            return (
              <div className="bhg-group-card" key={grp.id}>
                <div>
                  <div className="bhg-group-card-header">
                    <h3 className="bhg-group-title">{grp.name}</h3>
                    <span className="bhg-group-card-statuses">
                      <span
                        className={`bhg-group-status-pill ${
                          grp.status === 'Completed'
                            ? 'completed'
                            : isNotHeld
                            ? 'not-held'
                            : 'scheduled'
                        }`}
                      >
                        {grp.status === 'Completed' && <CheckCircle2 size={11} />}
                        {isNotHeld && <AlertTriangle size={11} />}
                        {isScheduled && <CalendarDays size={11} />}
                        {grp.status}
                      </span>
                      <span className={`bhg-pill ${isZoom ? 'bhg-pill-warning' : 'bhg-pill-success'}`}>
                        {grp.modality}
                      </span>
                    </span>
                  </div>

                  <div className="bhg-group-meta-list">
                    <div className="bhg-group-meta-item">
                      <CalendarDays size={13} color="#005A70" />
                      <span>{grp.sessionDate || grp.schedule}{grp.sessionTime ? ` · ${grp.sessionTime}` : ''}</span>
                    </div>
                    <div className="bhg-group-meta-item">
                      <Building2 size={13} color="#64748b" />
                      <span>{grp.location}</span>
                    </div>
                    <div className="bhg-group-meta-item">
                      <UserRound size={13} color="#64748b" />
                      <span>{grp.facilitator}</span>
                    </div>
                  </div>

                  {isNotHeld ? (
                    <div className="bhg-group-not-held-box">
                      <div className="bhg-group-not-held-header">
                        <AlertTriangle size={13} /> Session Not Held
                      </div>
                      <p className="bhg-group-not-held-text">{grp.reason}</p>
                      <div style={{ fontSize: 11, color: '#b45309', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span>{grp.outreachStatus}</span>
                        {grp.rescheduledDate && <strong>Makeup: {grp.rescheduledDate}</strong>}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bhg-group-topic-box">
                        <small>{isScheduled ? 'Upcoming Clinical Topic' : 'Current Clinical Topic'}</small>
                        <p>{grp.focusTopic || grp.currentTopic}</p>
                      </div>

                      {prevAppt && (
                        <div
                          className="bhg-group-previous-box"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setActivePrevModal(grp)}
                          title="Click to view previous appointment details and locked clinical note"
                        >
                          <div className="bhg-group-previous-header">
                            <small>
                              <Clock3 size={11} /> Previous Appointment
                            </small>
                            <span>{prevAppt.date}</span>
                          </div>
                          <p className="bhg-group-previous-topic">
                            <strong>Focus:</strong> {prevAppt.topic}
                          </p>
                          <div className="bhg-group-previous-meta">
                            <span>👥 {prevAppt.attendance}</span>
                            <span style={{ fontWeight: 600, color: '#0d9488' }}>
                              ✓ {prevAppt.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="bhg-group-roster-preview">
                    <div className="bhg-group-roster-preview-header">
                      <span>Enrolled Cohort ({roster.length} members)</span>
                      <span style={{ color: '#0284c7' }}>{grp.capacity || 'Active'}</span>
                    </div>
                    <div className="bhg-group-roster-chips">
                      {roster.map((member) => (
                        <span
                          key={member.id}
                          className={`bhg-group-roster-chip ${(member.status || 'Present').toLowerCase()}`}
                        >
                          <strong>{member.name}</strong> ({member.status || 'Present'})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bhg-group-card-actions">
                  {isNotHeld ? (
                    <>
                      <button
                        type="button"
                        className="bhg-button secondary"
                        style={{ fontSize: 12, padding: '7px 10px' }}
                        onClick={() => setActiveRosterGroup(grp)}
                      >
                        <UsersRound size={14} /> Cohort Roster
                      </button>

                      <button
                        type="button"
                        className="bhg-button"
                        style={{ fontSize: 12, padding: '7px 10px' }}
                        onClick={() => setActiveNotHeldGroup(grp)}
                      >
                        <AlertTriangle size={14} /> View Reason & Log
                      </button>

                      <button
                        type="button"
                        className="bhg-button secondary bhg-btn-full"
                        style={{ fontSize: 12, padding: '7px 10px' }}
                        onClick={() => addToast(`Reschedule request initiated for ${grp.name}. Notifications queued.`, 'info')}
                      >
                        <CalendarDays size={14} /> Reschedule Group Session
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="bhg-button"
                        style={{ fontSize: 12, padding: '7px 10px' }}
                        onClick={() => setActiveRosterGroup(grp)}
                      >
                        <UsersRound size={14} /> {isScheduled ? 'Roster & Prep' : 'Roster & Attendance'}
                      </button>

                      {isScheduled ? (
                        <span className="bhg-group-notes-unavailable"><LockKeyhole size={13} /> Notes available after completion</span>
                      ) : (
                        <button
                          type="button"
                          className="bhg-button secondary"
                          style={{ fontSize: 12, padding: '7px 10px' }}
                          onClick={() => openPatientNotesModal(grp)}
                        >
                          <FileText size={14} /> Session Notes
                        </button>
                      )}

                      {isZoom ? (
                        <button
                          type="button"
                          className="bhg-button secondary bhg-btn-full"
                          style={{ fontSize: 12, padding: '7px 10px' }}
                          onClick={() => setTelehealthModalGroup(grp)}
                        >
                          <Video size={14} /> Launch Zoom Telehealth
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="bhg-button secondary bhg-btn-full"
                          style={{ fontSize: 12, padding: '7px 10px' }}
                          onClick={() => openDapModal(grp)}
                        >
                          <FileText size={14} /> {isLocked ? 'View Master DAP Note' : 'Edit DAP Note'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {!paginatedGroups.length && (
            <div className="bhg-admin-empty bhg-group-empty">
              <Search size={22} />
              <strong>No group sessions match these filters</strong>
              <span>Clear the search or choose a different status or modality.</span>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredGroups.length > 0 && (
          <div className="bhg-pagination-bar">
            <div className="bhg-pagination-info">
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredGroups.length)}</strong> of <strong>{filteredGroups.length}</strong> cohorts
            </div>
            <div className="bhg-pagination-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
                <label htmlFor="grp-per-page" style={{ fontSize: 12, color: '#64748b' }}>Per page:</label>
                <select
                  id="grp-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bhg-pagination-select"
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                </select>
              </div>
              <button
                type="button"
                className="bhg-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ArrowLeft size={13} /> Previous
              </button>
              <div className="bhg-pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    className={`bhg-pagination-page-btn ${currentPage === pg ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pg)}
                  >
                    {pg}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="bhg-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Roster & Attendance Modal */}
      {activeRosterGroup && (
        <WorkflowModal
          title={`Cohort Roster & Attendance — ${activeRosterGroup.name}`}
          subtitle={`${activeRosterGroup.sessionDate || activeRosterGroup.schedule} · ${activeRosterGroup.sessionTime || ''} · ${activeRosterGroup.location}`}
          onClose={() => setActiveRosterGroup(null)}
          size="lg"
          footer={
            <button
              type="button"
              className="bhg-button"
              onClick={() => {
                addToast(`Attendance saved for ${activeRosterGroup.name}.`, 'success');
                setActiveRosterGroup(null);
              }}
            >
              <CheckCircle2 size={14} /> Save Attendance Record
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
              Mark real-time attendance for today's session. Attendance records auto-sync to billing units and patient compliance logs.
            </p>

            <div className="bhg-admin-table-wrap">
              <table className="bhg-admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Status</th>
                    <th>Attendance Marking</th>
                    <th>Clinical Participation Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeRosterGroup.attendance || []).map((member) => (
                    <tr key={member.id}>
                      <td>
                        <strong>{member.name}</strong>
                        <small style={{ display: 'block', color: '#64748b' }}>{member.id}</small>
                      </td>
                      <td>
                        <Status>{member.status || 'Present'}</Status>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['Present', 'Excused', 'Absent'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              className={`filter-chip ${(member.status || 'Present') === st ? 'active' : ''}`}
                              style={{ padding: '4px 8px', fontSize: 11.5 }}
                              onClick={() => handleToggleAttendance(activeRosterGroup.id, member.id, st)}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12.5, color: '#334155' }}>{member.notes || 'None recorded'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </WorkflowModal>
      )}

      {/* Group Session Notes Popup Modal (Displays Each Patient Note & Detail) */}
      {activeNotesGroup && (() => {
        const roster = activeNotesGroup.attendance || [];
        const presentCount = roster.filter((p) => p.status === 'Present').length;
        const excusedCount = roster.filter((p) => p.status === 'Excused').length;
        const absentCount = roster.filter((p) => p.status === 'Absent').length;
        const currentPatient = selectedPatientId ? roster.find((p) => p.id === selectedPatientId) : null;
        const currIdx = selectedPatientId ? roster.findIndex((p) => p.id === selectedPatientId) : -1;

        return (
          <WorkflowModal
            title={
              selectedPatientId && currentPatient
                ? `Patient Group Note · ${currentPatient.name}`
                : `Group Session Notes — ${activeNotesGroup.name}`
            }
            subtitle={`${activeNotesGroup.sessionDate || activeNotesGroup.schedule} · ${activeNotesGroup.sessionTime || ''} · ${activeNotesGroup.modality} · Facilitator: ${activeNotesGroup.facilitator}`}
            onClose={() => {
              setActiveNotesGroup(null);
              setSelectedPatientId(null);
            }}
            size="lg"
            footer={
              selectedPatientId ? (
                <button
                  type="button"
                  className="bhg-button"
                  onClick={() => setSelectedPatientId(null)}
                >
                  <ArrowLeft size={14} /> Back to Cohort Notes
                </button>
              ) : (
                <button
                  type="button"
                  className="bhg-button"
                  onClick={() => setActiveNotesGroup(null)}
                >
                  Close Notes
                </button>
              )
            }
          >
            {selectedPatientId && currentPatient ? (
              <div className="bhg-patient-note-detail">
                <div className="bhg-patient-note-nav">
                  <button
                    type="button"
                    className="bhg-text-button"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#005A70', fontWeight: 600 }}
                    onClick={() => setSelectedPatientId(null)}
                  >
                    <ArrowLeft size={14} /> Back to All Patient Notes ({roster.length})
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      className="bhg-pagination-btn"
                      disabled={currIdx <= 0}
                      onClick={() => setSelectedPatientId(roster[currIdx - 1].id)}
                    >
                      <ChevronLeft size={13} /> Previous
                    </button>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                      {currIdx + 1} of {roster.length}
                    </span>
                    <button
                      type="button"
                      className="bhg-pagination-btn"
                      disabled={currIdx >= roster.length - 1}
                      onClick={() => setSelectedPatientId(roster[currIdx + 1].id)}
                    >
                      Next <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="bhg-patient-meta-banner">
                  <div>
                    <strong style={{ fontSize: 15, color: '#0f172a' }}>{currentPatient.name}</strong>
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#64748b' }}>ID: {currentPatient.id}</span>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                      {activeNotesGroup.name} · {activeNotesGroup.sessionDate || activeNotesGroup.schedule} · {activeNotesGroup.location}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="bhg-pill bhg-pill-primary" style={{ fontSize: 11 }}>
                      {currentPatient.individualNote?.serviceCode || 'H0015 - Group Therapy'}
                    </span>
                    <Status>{currentPatient.status || 'Present'}</Status>
                  </div>
                </div>

                <div className="bhg-dap-section">
                  <div className="bhg-dap-section-header">
                    <span>Data (Clinical Presentation, Behaviors & Contributions)</span>
                  </div>
                  <p className="bhg-dap-section-text">
                    {currentPatient.individualNote?.data || `${currentPatient.name} participated in scheduled group session activities.`}
                  </p>
                </div>

                <div className="bhg-dap-section">
                  <div className="bhg-dap-section-header">
                    <span>Assessment (Insight, CBT Acquisition & Risk Level)</span>
                  </div>
                  <p className="bhg-dap-section-text">
                    {currentPatient.individualNote?.assessment || 'Patient demonstrated appropriate group engagement.'}
                  </p>
                </div>

                <div className="bhg-dap-section">
                  <div className="bhg-dap-section-header">
                    <span>Plan (Between-Session Practice & Next Milestone)</span>
                  </div>
                  <p className="bhg-dap-section-text">
                    {currentPatient.individualNote?.plan || 'Continue regular cohort attendance and practice assigned coping exercises.'}
                  </p>
                </div>

                <div className="bhg-dap-signature-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <LockKeyhole size={14} color="#065f46" />
                    <strong>Finalized & Electronically Signed Record</strong>
                  </div>
                  <span>Signed on {currentPatient.individualNote?.finalized || 'September 2026'} by {currentPatient.individualNote?.author || 'Morgan Reed, LPC-MHSP'}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong style={{ fontSize: 13, color: '#005A70' }}>
                      Session Topic: {activeNotesGroup.focusTopic || activeNotesGroup.currentTopic}
                    </strong>
                    <span className="bhg-pill bhg-pill-success" style={{ fontSize: 10.5 }}>
                      ✓ {activeNotesGroup.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Documented Attendance: <strong>{presentCount} Present</strong> · <strong>{excusedCount} Excused</strong> · <strong>{absentCount} Absent</strong>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 6 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: 13.5, color: '#0f172a' }}>
                    Individual Patient Documentation ({roster.length} Attendees)
                  </h4>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                    Click "Open Patient Note" on any attendee to review their individualized clinical DAP note and participation record.
                  </p>
                </div>

                <div className="bhg-patient-note-list">
                  {roster.map((patient) => {
                    const initials = patient.name.split(' ').map((n) => n[0]).join('');
                    return (
                      <div key={patient.id} className="bhg-patient-note-card">
                        <div className="bhg-patient-note-avatar">{initials}</div>
                        <div className="bhg-patient-note-body">
                          <div className="bhg-patient-note-title-row">
                            <strong>{patient.name}</strong>
                            <small>{patient.id}</small>
                            <Status>{patient.status || 'Present'}</Status>
                          </div>
                          <p className="bhg-patient-note-snippet">
                            {patient.participationSummary || patient.notes || 'Documented clinical participation note.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="bhg-button secondary"
                          style={{ fontSize: 12, padding: '6px 12px', flexShrink: 0 }}
                          onClick={() => setSelectedPatientId(patient.id)}
                        >
                          <FileText size={13} /> Open Patient Note
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </WorkflowModal>
        );
      })()}

      {/* Session Not Held Modal */}
      {activeNotHeldGroup && (
        <WorkflowModal
          title={`Group Session Not Held — ${activeNotHeldGroup.name}`}
          subtitle={`${activeNotHeldGroup.sessionDate || activeNotHeldGroup.schedule} · ${activeNotHeldGroup.sessionTime || ''} · ${activeNotHeldGroup.location}`}
          onClose={() => setActiveNotHeldGroup(null)}
          size="lg"
          footer={
            <button
              type="button"
              className="bhg-button"
              onClick={() => {
                addToast(`Makeup session scheduled for ${activeNotHeldGroup.rescheduledDate || 'next week'}.`, 'success');
                setActiveNotHeldGroup(null);
              }}
            >
              Confirm Reschedule
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 14, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b45309', marginBottom: 6 }}>
                <AlertTriangle size={18} />
                <strong style={{ fontSize: 14 }}>Documented Exception Reason</strong>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
                {activeNotHeldGroup.reason}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <small style={{ display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Patient Outreach Log</small>
                <strong style={{ fontSize: 13, color: '#0f172a' }}>{activeNotHeldGroup.outreachStatus}</strong>
                <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>✓ All notifications delivered</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <small style={{ display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Makeup Session</small>
                <strong style={{ fontSize: 13, color: '#0f172a' }}>{activeNotHeldGroup.rescheduledDate || 'Next scheduled cycle'}</strong>
                <div style={{ fontSize: 12, color: '#005A70', marginTop: 4 }}>Roster transferred</div>
              </div>
            </div>

            <div>
              <strong style={{ fontSize: 13, color: '#0f172a', display: 'block', marginBottom: 8 }}>
                Enrolled Cohort Members ({activeNotHeldGroup.attendance.length})
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeNotHeldGroup.attendance.map((p) => (
                  <span key={p.id} className="bhg-group-roster-chip excused">
                    <strong>{p.name}</strong> ({p.notes || 'Excused'})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </WorkflowModal>
      )}

      {/* Previous Appointment Details Modal */}
      {activePrevModal && (
        <WorkflowModal
          title={`Previous Group Appointment · ${activePrevModal.name}`}
          subtitle={`${activePrevModal.previousAppointment?.date || 'Past Session'} · ${activePrevModal.location}`}
          onClose={() => setActivePrevModal(null)}
          footer={
            <button
              type="button"
              className="bhg-button"
              onClick={() => setActivePrevModal(null)}
            >
              Close Record
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: 14, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <strong style={{ fontSize: 13.5, color: '#0f766e' }}>Previous Appointment Session Summary</strong>
                <span className="bhg-pill bhg-pill-success">
                  <CheckCircle2 size={12} /> {activePrevModal.previousAppointment?.status || 'Completed'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#134e4a', lineHeight: 1.5 }}>
                {activePrevModal.previousAppointment?.summary || 'Completed group therapy cohort meeting.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <small style={{ display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Date & Time</small>
                <strong style={{ fontSize: 13, color: '#1e293b' }}>{activePrevModal.previousAppointment?.date}</strong>
                <div style={{ fontSize: 12, color: '#475569' }}>{activePrevModal.previousAppointment?.time}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <small style={{ display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Modality & Room</small>
                <strong style={{ fontSize: 13, color: '#1e293b' }}>{activePrevModal.previousAppointment?.modality}</strong>
                <div style={{ fontSize: 12, color: '#475569' }}>{activePrevModal.location}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <small style={{ display: 'block', fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Documented Attendance</small>
                <strong style={{ fontSize: 13, color: '#1e293b' }}>{activePrevModal.previousAppointment?.attendance}</strong>
                <div style={{ fontSize: 12, color: '#059669' }}>Sync to Billing: Verified</div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 14, borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <LockKeyhole size={14} color="#005A70" />
                <strong style={{ fontSize: 13, color: '#0f172a' }}>Locked DAP Clinical Note for Previous Appointment</strong>
              </div>
              <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>Data: </span>
                  {activePrevModal.lastGroupDapNote?.data || 'Group engaged in scheduled curriculum topics.'}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>Assessment: </span>
                  {activePrevModal.lastGroupDapNote?.assessment || 'High cohesion and constructive peer exchange.'}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>Plan: </span>
                  {activePrevModal.lastGroupDapNote?.plan || 'Continue recovery skills reinforcement in subsequent sessions.'}
                </div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #f1f5f9', fontSize: 11.5, color: '#64748b' }}>
                Finalized and electronically signed on {activePrevModal.lastGroupDapNote?.finalized || 'September 2026'} by Morgan Reed, LPC-MHSP.
              </div>
            </div>
          </div>
        </WorkflowModal>
      )}

      {/* Group DAP Note Modal */}
      {activeDapGroup && (() => {
        const dap = activeDapGroup.lastGroupDapNote || activeDapGroup.dapNote || {};
        const isLocked = dap.locked || (dap.finalized && dap.finalized.includes('Locked'));

        return (
          <WorkflowModal
            title={`Group Therapy Clinical Note (DAP) — ${activeDapGroup.name}`}
            subtitle={`Facilitator: ${activeDapGroup.facilitator}`}
            onClose={() => setActiveDapGroup(null)}
            size="lg"
            footer={
              isLocked ? (
                <span className="bhg-pill bhg-pill-success" style={{ padding: '6px 14px' }}>
                  <LockKeyhole size={14} /> Finalized & Signed
                </span>
              ) : (
                <>
                  <button type="button" className="bhg-button secondary" onClick={() => saveDapNote(false)}>
                    Save Draft
                  </button>
                  <button type="button" className="bhg-button" onClick={() => saveDapNote(true)}>
                    <LockKeyhole size={14} /> Sign & Lock Group Note
                  </button>
                </>
              )
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isLocked && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: 12, borderRadius: 8, fontSize: 13, color: '#065f46' }}>
                  🔒 <strong>Locked Clinical Document:</strong> This group DAP note has been finalized, signed by Morgan Reed, LPC-MHSP, and submitted to billing.
                </div>
              )}

              <Field label="Data (Group Topics, Exercises, and Observed Patient Behaviors)">
                <textarea
                  value={dapData}
                  disabled={isLocked}
                  onChange={(e) => setDapData(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </Field>

              <Field label="Assessment (Clinical Dynamics, Cohesiveness, and CBT Progress)">
                <textarea
                  value={dapAssessment}
                  disabled={isLocked}
                  onChange={(e) => setDapAssessment(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </Field>

              <Field label="Plan (Next Curriculum Target & Assigned Practice)">
                <textarea
                  value={dapPlan}
                  disabled={isLocked}
                  onChange={(e) => setDapPlan(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
                />
              </Field>
            </div>
          </WorkflowModal>
        );
      })()}

      {/* Telehealth Modal */}
      {telehealthModalGroup && (
        <WorkflowModal
          title={`Join Telehealth — ${telehealthModalGroup.name}`}
          subtitle="BHG Secure Zoom Room"
          onClose={() => setTelehealthModalGroup(null)}
          footer={
            <button
              type="button"
              className="bhg-button"
              onClick={() => {
                addToast(`Launching encrypted Zoom session for ${telehealthModalGroup.name}...`, 'success');
                setTelehealthModalGroup(null);
              }}
            >
              <Video size={14} /> Launch Video Session as Host
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#334155' }}>
              You are launching the secure HIPAA-compliant telehealth room for <strong>{telehealthModalGroup.name}</strong>.
            </p>
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}>
              <div><strong>Meeting Room:</strong> BHG Clinical Telehealth Room</div>
              <div style={{ marginTop: 6 }}><strong>Scheduled Time:</strong> {telehealthModalGroup.schedule}</div>
              <div style={{ marginTop: 6 }}><strong>Location:</strong> {telehealthModalGroup.location}</div>
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              🔒 End-to-end encryption is enabled. Waiting room is active; patients must be admitted by the clinician host.
            </div>
          </div>
        </WorkflowModal>
      )}
    </div>
  );
}

