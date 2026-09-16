import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  HeartHandshake,
  MessageSquareText,
  Pill,
  Search,
  ShieldCheck,
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
  { id: 'DAY-4', centerId: 'jackson-tn', time: '1:00 PM', patient: 'Group · 8 enrolled', type: 'Recovery skills group', resource: 'Morgan Reed, LPC-MHSP', modality: 'In person', mode: 'Group Room A', status: 'Confirmed' },
  { id: 'DAY-5', centerId: 'jackson-tn', time: '2:30 PM', patient: 'New intake', type: 'Comprehensive assessment', resource: 'Dr. Marcus Hill / Intake', modality: 'In person', mode: 'Intake Suite', status: 'Pending' },
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
];

const referrals = [
  { id: 'REF-1', patient: 'Jordan Williams', centerId: 'knoxville-bernard', need: 'Transportation support', owner: 'Care coordination', status: 'Patient reviewing' },
  { id: 'REF-2', patient: 'Casey Morgan', centerId: 'jackson-tn', need: 'Peer recovery support', owner: 'Morgan Reed', status: 'Connected' },
  { id: 'REF-3', patient: 'Riley Parker', centerId: 'knoxville-bernard', need: 'Housing resources', owner: 'Social services', status: 'Pending' },
];

function rowsForCenter(rows, centerId) {
  return centerId === 'all' ? rows : rows.filter((row) => row.centerId === centerId);
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

function Stat({ icon: Icon, label, value, note, tone = 'primary' }) {
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
    : /hold|attention|exception|overdue/.test(value) ? 'danger'
      : /pending|waiting|processing|due today/.test(value) ? 'warning' : 'primary';
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
  const openWorkItems = workItems.filter((item) => item.status !== 'Resolved' && (selectedTreatmentCenterId === 'all' || (item.centerId || 'knoxville-bernard') === selectedTreatmentCenterId)).length;
  const missedVisits = centerOutcomes.filter((item) => item.outcome === 'Patient did not attend').length;
  const pendingOffers = centerProposals.filter((item) => item.status === 'Awaiting patient response').length;
  const reviewedReports = centerUds.filter((item) => item.review === 'Reviewed').length;
  const reportsNeedingReview = centerUds.filter((item) => item.review !== 'Reviewed').length;
  const clinicianAppointments = centerAppointments.filter((item) => /counseling|group|assessment/i.test(item.type));
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={`${selectedTreatmentCenter.shortName} · Clinician Portal`} title="Good morning, Morgan" description="Your caseload, scheduled care, follow-up needs, and patient responses for Monday, September 14." action="Reset demo" onAction={resetDemo} />
      <div className="bhg-admin-stat-grid">
        <Stat icon={UsersRound} label="Assigned Patients" value={centerPatients.length} note={`${centerPatients.filter((item) => item.status === 'Review').length} need follow-up this week`} />
        <Stat icon={CalendarDays} label="Sessions today" value={clinicianAppointments.length} note={`${clinicianAppointments.filter((item) => /individual/i.test(item.type)).length} individual · ${clinicianAppointments.filter((item) => /group/i.test(item.type)).length} group`} tone="success" />
        <Stat icon={AlertTriangle} label="Missed-visit follow-up" value={missedVisits} note="Outreach and rescheduling" tone="warning" />
        <Stat icon={MessageSquareText} label="Patient responses" value={openWorkItems + pendingOffers} note="Requests and appointment offers" tone="warning" />
      </div>
      <div className="bhg-two-column bhg-two-column-wide bhg-admin-dashboard-grid">
        <section className="bhg-card bhg-admin-schedule-card">
          <div className="bhg-section-title"><div><h2>My appointments</h2><p>Based in Jackson TN · Knoxville counseling sessions are attended by Zoom.</p></div><Status>Today</Status></div>
          <div className="bhg-admin-schedule-scroll">
            <Table columns={['Time', 'Patient', 'Service', 'Modality', 'Status']} rows={clinicianAppointments} render={(row) => <>
              <td>{row.time}</td><td><strong>{row.patient}</strong></td><td>{row.type}<small>{row.mode}</small></td><td><Status>{row.modality}</Status></td><td><Status>{row.status}</Status></td>
            </>} />
          </div>
          <button className="bhg-link-row" onClick={() => navigate('admin-appointments')}>Open appointments and outcomes <ArrowRight size={14} /></button>
        </section>
        <section className="bhg-card bhg-admin-dashboard-side-card">
          <div className="bhg-section-title"><div><h2>Clinical follow-up</h2><p>Prioritized from appointments and the Patient Portal.</p></div></div>
          <div className="bhg-admin-alert"><AlertTriangle size={17} /><div><strong>{missedVisits} missed visit</strong><p>Document the outcome and start patient-friendly outreach.</p></div></div>
          <div className="bhg-admin-alert info"><CalendarDays size={17} /><div><strong>{pendingOffers} appointment offer awaiting response</strong><p>The patient can accept or request another time in the portal.</p></div></div>
          <div className="bhg-admin-alert info"><FileCheck2 size={17} /><div><strong>2 recovery goals due for review</strong><p>Review collaboratively at the next session.</p></div></div>
        </section>
      </div>
      <div className="bhg-two-column bhg-two-column-wide bhg-admin-dashboard-grid bhg-admin-dashboard-second-row">
        <section className="bhg-card bhg-admin-work-queue">
          <div className="bhg-section-title"><div><h2>Patient response queue</h2><p>Scheduling, medication-review, treatment-support, and missed-visit follow-up.</p></div><Status>{openWorkItems} open</Status></div>
          <WorkQueue limit={6} compact />
        </section>
        <section className="bhg-card bhg-admin-dashboard-side-card">
          <div className="bhg-section-title"><div><h2>UDS & lab review status</h2><p>Reports requiring clinician review in the selected treatment-center view.</p></div><Status>{reportsNeedingReview} need review</Status></div>
          <div className="bhg-detail-row"><span>Reviewed</span><strong>{reviewedReports}</strong></div>
          <div className="bhg-detail-row"><span>Pending or provider review</span><strong>{reportsNeedingReview}</strong></div>
          <div className="bhg-admin-progress"><span style={{ width: `${centerUds.length ? Math.round((reviewedReports / centerUds.length) * 100) : 0}%` }} /></div>
          <button className="bhg-link-row" onClick={() => navigate('admin-labs')}>Open UDS & lab review <ArrowRight size={14} /></button>
        </section>
      </div>
    </div>
  );
}

export function AdminPatients() {
  const [query, setQuery] = useState('');
  const { selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const filtered = useMemo(() => rowsForCenter(patients, selectedTreatmentCenterId).filter((item) => `${item.name} ${item.id} ${item.program} ${item.center}`.toLowerCase().includes(query.toLowerCase())), [query, selectedTreatmentCenterId]);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="My Caseload" description="Assigned patients, treatment center, program phase, care-team ownership, and recent engagement." />
      <section className="bhg-card">
        <div className="bhg-admin-toolbar"><div className="bhg-admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, ID, or program" /></div><Status>{filtered.length} shown</Status></div>
        <Table columns={['Patient', 'Treatment center', 'Program / phase', 'Counselor', 'Status', 'Last activity']} rows={filtered} render={(row) => <>
          <td><strong>{row.name}</strong><small>{row.id}</small></td><td>{row.center}</td><td>{row.program}<small>{row.phase}</small></td><td>{row.counselor}</td><td><Status>{row.status}</Status></td><td>{row.last}</td>
        </>} />
      </section>
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

export function AdminAppointments() {
  const { appointmentProposals, appointmentOutcomes, proposeAppointment, recordAppointmentOutcome, addToast, selectedTreatmentCenterId, selectedTreatmentCenter } = useApp();
  const [showOffer, setShowOffer] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [offer, setOffer] = useState({ date: 'September 29, 2026', dateShort: 'SEP 29', time: '11:00 AM' });
  const [outcome, setOutcome] = useState('Completed');
  const [followUp, setFollowUp] = useState('Patient-facing follow-up is available in the portal.');
  const centerPatients = rowsForCenter(patients, selectedTreatmentCenterId);
  const offerPatient = centerPatients[0] || patients[0];
  const offerModality = offerPatient.centerId === 'jackson-tn' ? 'In person' : 'Zoom';
  const centerAppointments = rowsForCenter(dailyAppointments, selectedTreatmentCenterId);
  const centerProposals = rowsForCenter(appointmentProposals, selectedTreatmentCenterId);
  const centerOutcomes = rowsForCenter(appointmentOutcomes, selectedTreatmentCenterId);

  const submitOffer = () => {
    proposeAppointment({
      patient: offerPatient.name,
      centerId: offerPatient.centerId,
      title: 'Individual counseling follow-up',
      date: offer.date,
      dateShort: offer.dateShort,
      time: offer.time,
      provider: 'Morgan Reed, LPC-MHSP',
      location: offerModality === 'Zoom' ? 'Secure Zoom visit' : 'BHG Jackson TN · Counseling Room',
      modality: offerModality,
      duration: '50 minutes',
      preparation: 'Review your recovery goals and bring any questions for your counselor.',
    });
    addToast('Appointment offer sent to the Patient Portal.');
    setShowOffer(false);
  };

  const submitOutcome = () => {
    recordAppointmentOutcome({ patient: selectedVisit.patient, centerId: selectedVisit.centerId, service: selectedVisit.type, outcome, followUp });
    addToast(outcome === 'Patient did not attend' ? 'Missed visit recorded and follow-up added.' : 'Appointment outcome recorded.');
    setSelectedVisit(null);
  };

  return (
    <div className="bhg-page">
      <AdminHeader eyebrow={selectedTreatmentCenter.shortName} title="Appointments & outcomes" description="Coordinate clinician visits, offer times through the Patient Portal, and capture completed or missed-visit outcomes." action="Offer appointment" onAction={() => setShowOffer(true)} />
      <section className="bhg-card">
        <div className="bhg-section-title"><div><h2>Monday, September 14</h2><p>34 scheduled services · 29 confirmed</p></div><Status>Today</Status></div>
        <Table columns={['Time', 'Patient / group', 'Center', 'Service', 'Modality', 'Status', 'Outcome']} rows={centerAppointments} render={(row) => <>
          <td><strong>{row.time}</strong></td><td>{row.patient}<small>{row.mode}</small></td><td>{centerLabels[row.centerId]}</td><td>{row.type}<small>{row.resource}</small></td><td><Status>{row.modality}</Status></td><td><Status>{row.status}</Status></td><td>{!row.patient.includes('Group') && row.patient !== 'New intake' ? <button className="bhg-text-button" onClick={() => { setSelectedVisit(row); setOutcome('Completed'); setFollowUp('Patient-facing follow-up is available in the portal.'); }}>Record</button> : '—'}</td>
        </>} />
      </section>
      <div className="bhg-two-column">
        <section className="bhg-card">
          <div className="bhg-section-title"><div><h2>Appointment offers</h2><p>Patients accept or request another time in their portal.</p></div></div>
          <Table columns={['Patient', 'Offered time', 'Service', 'Status']} rows={centerProposals} render={(row) => <>
            <td><strong>{row.patient}</strong></td><td>{row.date}<small>{row.time}</small></td><td>{row.title}</td><td><Status>{row.status}</Status></td>
          </>} />
        </section>
        <section className="bhg-card">
          <div className="bhg-section-title"><div><h2>Recent outcomes</h2><p>Missed visits automatically create follow-up work.</p></div></div>
          <Table columns={['Patient', 'Service', 'Outcome', 'Follow-up']} rows={centerOutcomes.slice(0, 5)} render={(row) => <>
            <td><strong>{row.patient}</strong><small>{row.date}</small></td><td>{row.service}</td><td><Status>{row.outcome}</Status></td><td>{row.followUp}</td>
          </>} />
        </section>
      </div>
      {showOffer && <WorkflowModal title="Offer an appointment" subtitle="The patient chooses accept or request another time." onClose={() => setShowOffer(false)} footer={<><button className="bhg-button bhg-button-secondary" onClick={() => setShowOffer(false)}>Cancel</button><button className="bhg-button" onClick={submitOffer}>Send offer</button></>}>
        <DemoBanner>This POC sends the offer to the first patient in the selected treatment-center caseload. A production version would select from authorized patients and available schedule slots.</DemoBanner>
        <Field label="Patient"><input value={offerPatient.name} readOnly /></Field>
        <Field label="Treatment center"><input value={offerPatient.center} readOnly /></Field>
        <Field label="Date"><input value={offer.date} onChange={(event) => setOffer((value) => ({ ...value, date: event.target.value }))} /></Field>
        <Field label="Display date"><input value={offer.dateShort} onChange={(event) => setOffer((value) => ({ ...value, dateShort: event.target.value.toUpperCase() }))} /></Field>
        <Field label="Time"><input value={offer.time} onChange={(event) => setOffer((value) => ({ ...value, time: event.target.value }))} /></Field>
        <Field label="Modality"><input value={offerModality} readOnly /></Field>
        <DemoBanner>Morgan attends sessions in person at Jackson TN. Sessions for Knoxville Bernard and Knoxville Citico are offered through Zoom.</DemoBanner>
      </WorkflowModal>}
      {selectedVisit && <WorkflowModal title="Record appointment outcome" subtitle={`${selectedVisit.patient} · ${selectedVisit.type}`} onClose={() => setSelectedVisit(null)} footer={<><button className="bhg-button bhg-button-secondary" onClick={() => setSelectedVisit(null)}>Cancel</button><button className="bhg-button" onClick={submitOutcome}>Save outcome</button></>}>
        <Field label="Outcome"><select value={outcome} onChange={(event) => { const value = event.target.value; setOutcome(value); if (value === 'Patient did not attend') setFollowUp('Please contact the treatment center to reschedule. Your care team is available to help with barriers to attending.'); }}><option>Completed</option><option>Patient did not attend</option><option>Cancelled by patient</option><option>Rescheduled</option></select></Field>
        <Field label="Patient-facing follow-up"><textarea rows="4" value={followUp} onChange={(event) => setFollowUp(event.target.value)} /></Field>
        <DemoBanner>Detailed clinical notes remain in the designated clinical documentation system. The Patient Portal receives only the outcome and approved follow-up.</DemoBanner>
      </WorkflowModal>}
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
