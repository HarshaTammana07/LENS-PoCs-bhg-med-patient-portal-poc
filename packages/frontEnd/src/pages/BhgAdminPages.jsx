import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  HeartHandshake,
  LockKeyhole,
  MessageSquareText,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TestTube2,
  UserRoundCheck,
  UsersRound,
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
  { id: 'DAY-2', centerId: 'knoxville-citico', time: '9:00 AM', patient: 'Jamie Carter', type: 'Individual counseling', resource: 'Morgan Reed, LPC', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed' },
  { id: 'DAY-3', centerId: 'knoxville-bernard', time: '10:30 AM', patient: 'Jordan Williams', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed' },
  { id: 'DAY-6', centerId: 'knoxville-bernard', time: '11:30 AM', patient: 'Avery Thompson', type: 'Recovery plan follow-up', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed' },
  { id: 'DAY-7', centerId: 'knoxville-bernard', time: '3:00 PM', patient: 'Cameron Ellis', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Pending' },
  { id: 'DAY-8', centerId: 'knoxville-citico', time: '11:00 AM', patient: 'Emerson Davis', type: 'Treatment plan review', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Confirmed' },
  { id: 'DAY-9', centerId: 'knoxville-citico', time: '3:30 PM', patient: 'Finley Howard', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'Zoom', mode: 'Secure Zoom visit', status: 'Pending' },
  { id: 'DAY-4', centerId: 'jackson-tn', time: '1:00 PM', patient: 'Group · 8 enrolled', type: 'Recovery skills group', resource: 'Morgan Reed, LPC-MHSP', modality: 'In person', mode: 'Group Room A', status: 'Confirmed' },
  { id: 'DAY-5', centerId: 'jackson-tn', time: '2:30 PM', patient: 'New intake', type: 'Comprehensive assessment', resource: 'Dr. Marcus Hill / Intake', modality: 'In person', mode: 'Intake Suite', status: 'Pending' },
  { id: 'DAY-10', centerId: 'jackson-tn', time: '11:00 AM', patient: 'Casey Morgan', type: 'Individual counseling', resource: 'Morgan Reed, LPC-MHSP', modality: 'In person', mode: 'Counseling Room 2', status: 'Confirmed' },
  { id: 'DAY-11', centerId: 'jackson-tn', time: '3:30 PM', patient: 'Kendall Wright', type: 'Recovery plan follow-up', resource: 'Morgan Reed, LPC-MHSP', modality: 'In person', mode: 'Counseling Room 2', status: 'Pending' },
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
  return <span className={`bhg-admin-status ${tone}`}>{children}</span>;
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
  const { navigate, workItems, appointmentProposals, appointmentOutcomes, selectedTreatmentCenterId, selectedTreatmentCenter, resetDemo } = useApp();
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
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={`${selectedTreatmentCenter.shortName} · Clinician Portal`} title="Good morning, Morgan" description="Your caseload, scheduled care, follow-up needs, and patient responses for Monday, September 14." action="Reset demo" onAction={resetDemo} />
      <div className="bhg-two-column bhg-two-column-wide bhg-admin-dashboard-grid bhg-admin-dashboard-priority-row">
        <section className="bhg-card bhg-upcoming-appointment-card">
          <div className="bhg-section-title"><div><h2>Upcoming appointment</h2><p>Your next scheduled counseling session in the selected treatment-center view.</p></div><Status>{upcomingAppointment ? upcomingAppointment.modality : 'No session'}</Status></div>
          {upcomingAppointment ? (
            <div className="bhg-upcoming-appointment-content">
              <span className="bhg-large-icon"><CalendarDays size={22} /></span>
              <div><strong>{upcomingAppointment.time} · {upcomingAppointment.patient}</strong><p>{upcomingAppointment.type}</p><small>{centerLabels[upcomingAppointment.centerId]} · {upcomingAppointment.mode}</small></div>
              <Status>{upcomingAppointment.status}</Status>
            </div>
          ) : <div className="bhg-admin-empty"><CalendarDays size={21} /><strong>No upcoming sessions</strong><span>Choose another treatment center to review its schedule.</span></div>}
          <button className="bhg-link-row" onClick={() => navigate('admin-appointments')}>Open sessions <ArrowRight size={14} /></button>
        </section>
        <section className="bhg-card bhg-admin-dashboard-side-card">
          <div className="bhg-section-title"><div><h2>Clinical follow-up</h2><p>Prioritized from appointments and the Patient Portal.</p></div></div>
          <div className="bhg-admin-alert"><AlertTriangle size={17} /><div><strong>{missedVisits} missed {missedVisits === 1 ? 'visit' : 'visits'}</strong><p>Document outcomes and begin patient-friendly outreach.</p></div></div>
          <div className="bhg-admin-alert info"><CalendarDays size={17} /><div><strong>{pendingOffers} appointment {pendingOffers === 1 ? 'offer' : 'offers'} awaiting response</strong><p>Patients can accept or request another time.</p></div></div>
          <div className="bhg-admin-alert info"><FileCheck2 size={17} /><div><strong>2 recovery goals due for review</strong><p>Review collaboratively at the next session.</p></div></div>
        </section>
      </div>
      <div className="bhg-admin-stat-grid">
        <Stat icon={UsersRound} label="Assigned Patients" value={centerPatients.length} note={programSummary} items={centerPatients.slice(0, 3).map((item) => ({ primary: item.name, secondary: `${item.program} · ${item.phase}` }))} action="Open My Caseload" onClick={() => navigate('admin-patients')} />
        <Stat icon={CalendarDays} label="Sessions Today" value={clinicianAppointments.length} note={modalitySummary} items={clinicianAppointments.slice(0, 3).map((item) => ({ primary: `${item.time} · ${item.patient}`, secondary: `${item.type} · ${item.modality}` }))} action="View sessions" onClick={() => navigate('admin-appointments')} tone="success" />
        <Stat icon={AlertTriangle} label="Missed Visits" value={missedVisits} note="Follow-up and rescheduling" items={missedVisitRecords.slice(0, 3).map((item) => ({ primary: item.patient, secondary: `${item.date} · ${item.service}` }))} action="Review outcomes" onClick={() => navigate('admin-appointments')} tone="warning" />
        <Stat icon={MessageSquareText} label="Patient Responses" value={openWorkItems + pendingOffers} note={`${centerOpenWorkItems.filter((item) => item.status === 'New').length} new · ${centerOpenWorkItems.filter((item) => item.status === 'In review').length} in review`} items={responseRecords.slice(0, 3)} action="Open response queue" onClick={() => navigate('admin-care-coordination')} tone="warning" />
      </div>
      <div className="bhg-two-column bhg-admin-dashboard-bottom-row">
        <section className="bhg-card bhg-admin-dashboard-equal-card">
          <div className="bhg-section-title"><div><h2>UDS & lab review status</h2><p>Reports requiring clinician review in the selected treatment-center view.</p></div><Status>{reportsNeedingReview} need review</Status></div>
          <div className="bhg-dashboard-record-list">
            {centerUds.slice(0, 3).map((item) => <div key={`${item.patient}-${item.collected}`}><span><strong>{item.patient}</strong><small>{item.type} · Collected {item.collected}</small></span><span><Status>{item.review}</Status><small>{item.result}</small></span></div>)}
          </div>
          <div className="bhg-admin-progress"><span style={{ width: `${centerUds.length ? Math.round((reviewedReports / centerUds.length) * 100) : 0}%` }} /></div>
          <div className="bhg-admin-progress-label"><span>{reviewedReports} reviewed</span><strong>{reportsNeedingReview} need review</strong></div>
          <button className="bhg-link-row" onClick={() => navigate('admin-labs')}>Open UDS & lab review <ArrowRight size={14} /></button>
        </section>
        <section className="bhg-card bhg-admin-work-queue bhg-admin-dashboard-equal-card">
          <div className="bhg-section-title"><div><h2>Patient response queue</h2><p>Top requests requiring a counselor response.</p></div><Status>{openWorkItems} open</Status></div>
          <WorkQueue limit={3} compact />
          <button className="bhg-link-row" onClick={() => navigate('admin-care-coordination')}>Open all patient responses <ArrowRight size={14} /></button>
        </section>
      </div>
    </div>
  );
}

export function AdminPatients() {
  const [query, setQuery] = useState('');
  const { navigate, selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const filtered = useMemo(() => rowsForCenter(patients, selectedTreatmentCenterId).filter((item) => `${item.name} ${item.id} ${item.program} ${item.center}`.toLowerCase().includes(query.toLowerCase())), [query, selectedTreatmentCenterId]);
  const openPatient = (patient) => navigate(`admin-patient-profile?patient=${encodeURIComponent(patient.id)}`);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="My Caseload" description="Assigned patients, treatment center, program phase, care-team ownership, and recent engagement." />
      <section className="bhg-card">
        <div className="bhg-admin-toolbar"><div className="bhg-admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, ID, or program" /></div><Status>{filtered.length} shown</Status></div>
        <Table columns={['Patient', 'Treatment center', 'Program / phase', 'Counselor', 'Status', 'Last activity', '']} rows={filtered} render={(row) => <>
          <td><button type="button" className="bhg-patient-link" onClick={() => openPatient(row)}><strong>{row.name}</strong><small>{row.id}</small></button></td><td>{row.center}</td><td>{row.program}<small>{row.phase}</small></td><td>{row.counselor}</td><td><Status>{row.status}</Status></td><td>{row.last}</td><td><button type="button" className="bhg-text-button" onClick={() => openPatient(row)}>Open profile</button></td>
        </>} />
      </section>
    </div>
  );
}

function ProfileDetails({ items }) {
  return (
    <div className="bhg-profile-details">
      {items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
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

  useEffect(() => {
    setActiveTab('overview');
    setSelectedNote(null);
    setSelectedNotHeld(null);
    setSelectedReport(null);
    setReports(buildPatientReports(patient));
  }, [patient]);

  const tabs = [
    ['overview', 'Overview'],
    ['asam', 'ASAM'],
    ['treatment-plan', 'Treatment Plan'],
    ['sessions', 'Sessions & Notes'],
    ['labs', 'UA & Labs'],
  ];

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
          <ProfileDetails items={[
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
    </div>
  );
}

export function AdminCheckIns() {
  const { selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const centerCheckIns = rowsForCenter(checkIns, selectedTreatmentCenterId);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="Medication visit status" description="Read-only visibility into daily medication visits, holds, and handoffs relevant to coordinated care." />
      <div className="bhg-admin-stat-grid three"><Stat icon={CheckCircle2} label="Completed" value={centerCheckIns.filter((item) => item.stage === 'Completed').length} note="Current portal view" tone="success" /><Stat icon={Clock3} label="Waiting / ready" value={centerCheckIns.filter((item) => /waiting|ready/i.test(item.stage)).length} note="Current portal view" /><Stat icon={AlertTriangle} label="Clinical holds" value={centerCheckIns.filter((item) => item.stage === 'Hold').length} note="No dosing until reviewed" tone="warning" /></div>
      <section className="bhg-card">
        <Table columns={['Arrival', 'Patient', 'Queue reason', 'Details', 'Status']} rows={centerCheckIns} render={(row) => <>
          <td>{row.time}</td><td><strong>{row.patient}</strong><small>{row.id}</small></td><td>{row.visit}</td><td>{row.detail}</td><td><Status>{row.stage}</Status></td>
        </>} />
      </section>
      <div className="bhg-info-banner"><ShieldCheck size={16} /> Clinicians can coordinate follow-up here. Prescribing, dose changes, take-home decisions, and hold clearance remain with authorized medical workflows.</div>
    </div>
  );
}

function SessionFilter({ label, value, options, onChange }) {
  return (
    <div className="bhg-session-filter-group">
      <span>{label}</span>
      <div>{options.map((option) => <button type="button" key={option} className={value === option ? 'active' : ''} onClick={() => onChange(option)}>{option}</button>)}</div>
    </div>
  );
}

export function AdminAppointments() {
  const { navigate, selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedGroupNotes, setSelectedGroupNotes] = useState(null);
  const [selectedNotHeld, setSelectedNotHeld] = useState(null);

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
        <div className="bhg-session-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by patient name, session type, service, or status" aria-label="Search sessions" /></div>
        <div className="bhg-session-filter-heading"><SlidersHorizontal size={16} /><span>Filters</span><small>Combine filters to narrow the session list.</small></div>
        <div className="bhg-session-filter-grid">
          <SessionFilter label="Status" value={statusFilter} options={['All', 'Scheduled', 'Completed', 'Session not held']} onChange={setStatusFilter} />
          <SessionFilter label="Modality" value={modalityFilter} options={['All', 'In person', 'Zoom']} onChange={setModalityFilter} />
          <SessionFilter label="Session type" value={typeFilter} options={['All', 'Individual', 'Group']} onChange={setTypeFilter} />
        </div>
      </section>

      <section className="bhg-card bhg-session-table-card">
        <div className="bhg-section-title"><div><h2>Session history</h2><p>Notes are available only for completed sessions and remain locked.</p></div><Status>{filteredSessions.length} sessions</Status></div>
        {filteredSessions.length ? <Table columns={['Date', 'Patient(s)', 'Treatment center', 'Service', 'Type', 'Modality', 'Status', 'Action']} rows={filteredSessions} render={(session) => <>
          <td><strong>{session.date}</strong><small>{session.time}</small></td>
          <td><strong>{session.type === 'Group' ? `${session.patients.length} patients` : session.patients[0]}</strong>{session.type === 'Group' && <small>{session.patients.join(', ')}</small>}</td>
          <td>{centerLabels[session.centerId]}</td><td>{session.service}</td><td>{session.type}</td><td><Status>{session.modality}</Status></td><td><Status>{session.status}</Status></td>
          <td><div className="bhg-session-actions">
            {session.status === 'Scheduled' && <span>No note</span>}
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
  const centerCounseling = rowsForCenter(counseling, selectedTreatmentCenterId);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="Counseling & goals" description="Track required services, collaborative goals, and patient follow-up without duplicating session note capture." />
      <div className="bhg-admin-stat-grid"><Stat icon={MessageSquareText} label="Assigned services" value={centerCounseling.length} note="Current portal view" /><Stat icon={HeartHandshake} label="On track" value={centerCounseling.filter((item) => item.completion === 'On track').length} note="Goals and services" tone="success" /><Stat icon={UsersRound} label="Treatment centers" value={selectedTreatmentCenterId === 'all' ? 3 : 1} note="Current portal view" /><Stat icon={AlertTriangle} label="Needs attention" value={centerCounseling.filter((item) => /attention|overdue|due today/i.test(item.completion)).length} note="Requires follow-up" tone="warning" /></div>
      <section className="bhg-card"><Table columns={['Patient', 'Required service', 'Counselor', 'Due', 'Next follow-up', 'Status']} rows={centerCounseling} render={(row) => <>
        <td><strong>{row.patient}</strong></td><td>{row.service}</td><td>{row.counselor}</td><td>{row.due}</td><td>{row.followUp}</td><td><Status>{row.completion}</Status></td>
      </>} /></section>
      <div className="bhg-info-banner"><ShieldCheck size={16} /> Session recording, transcription, and note generation stay in BHG’s AI notetaker. This portal displays only approved patient-facing summaries and follow-up actions.</div>
    </div>
  );
}

export function AdminLabs() {
  const { selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const centerUds = rowsForCenter(uds, selectedTreatmentCenterId);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="UDS & labs" description="Collection status and clinical review routing. Detailed results remain access-controlled." />
      <div className="bhg-admin-stat-grid three"><Stat icon={TestTube2} label="Collections shown" value={centerUds.length} note="Current portal view" /><Stat icon={CheckCircle2} label="Reviewed" value={centerUds.filter((item) => item.review === 'Reviewed').length} note="Current portal view" tone="success" /><Stat icon={AlertTriangle} label="Exceptions" value={centerUds.filter((item) => item.result === 'Exception').length} note="Clinical review required" tone="warning" /></div>
      <section className="bhg-card"><Table columns={['Patient', 'Test', 'Collected', 'Result category', 'Review']} rows={centerUds} render={(row) => <>
        <td><strong>{row.patient}</strong></td><td>{row.type}</td><td>{row.collected}</td><td><Status>{row.result}</Status></td><td><Status>{row.review}</Status></td>
      </>} /></section>
    </div>
  );
}

export function AdminCareCoordination() {
  const { workItems, selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const openWorkItems = workItems.filter((item) => item.status !== 'Resolved' && (selectedTreatmentCenterId === 'all' || (item.centerId || 'knoxville-bernard') === selectedTreatmentCenterId)).length;
  const centerReferrals = rowsForCenter(referrals, selectedTreatmentCenterId);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="Care coordination" description="Route patient needs, medical-review requests, referrals, and access barriers to the right team." />
      <div className="bhg-admin-stat-grid three"><Stat icon={MessageSquareText} label="Open patient requests" value={openWorkItems} note="From the Patient Portal" /><Stat icon={HeartHandshake} label="Active referrals" value={centerReferrals.length} note="Current portal view" tone="success" /><Stat icon={AlertTriangle} label="Access barriers" value={centerReferrals.filter((item) => /pending|reviewing/i.test(item.status)).length} note="Requires coordination" tone="warning" /></div>
      <section className="bhg-card"><div className="bhg-section-title"><div><h2>Patient request routing</h2><p>Medication questions go to an authorized medical provider; counselors coordinate and follow up.</p></div></div><WorkQueue /></section>
      <section className="bhg-card"><div className="bhg-section-title"><div><h2>Referrals and supports</h2><p>Shared care actions that can be surfaced to patients without exposing internal notes.</p></div></div><Table columns={['Patient', 'Need', 'Owner', 'Status']} rows={centerReferrals} render={(row) => <>
        <td><strong>{row.patient}</strong></td><td>{row.need}</td><td>{row.owner}</td><td><Status>{row.status}</Status></td>
      </>} /></section>
    </div>
  );
}
