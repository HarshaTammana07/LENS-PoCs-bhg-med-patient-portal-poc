import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
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
  { id: 'BHG-20481', name: 'Jordan Williams', program: 'OTP', phase: 'Stabilization', counselor: 'Alicia Monroe', payer: 'TennCare', status: 'Active', last: 'Today, 6:42 AM' },
  { id: 'BHG-20476', name: 'Taylor Brooks', program: 'OTP', phase: 'Maintenance', counselor: 'Alicia Monroe', payer: 'Self-pay', status: 'Active', last: 'Today, 7:05 AM' },
  { id: 'BHG-20459', name: 'Casey Morgan', program: 'OBOT', phase: 'Maintenance', counselor: 'Devon Price', payer: 'BlueCare', status: 'Active', last: 'Sep 11, 2026' },
  { id: 'BHG-20432', name: 'Riley Parker', program: 'OTP', phase: 'Induction', counselor: 'Devon Price', payer: 'TennCare', status: 'Review', last: 'Today, 8:16 AM' },
  { id: 'BHG-20398', name: 'Jamie Carter', program: 'IOP', phase: 'Active care', counselor: 'Nina Patel', payer: 'Cigna', status: 'Active', last: 'Sep 12, 2026' },
];

const checkIns = [
  { time: 'Expected', patient: 'Jordan Williams', id: 'BHG-20481', visit: 'Medication window', stage: 'Expected', detail: 'Before 11:30 AM' },
  { time: '7:05 AM', patient: 'Taylor Brooks', id: 'BHG-20476', visit: 'Observed dose', stage: 'Completed', detail: '80 mg · Nurse K. Evans' },
  { time: '7:48 AM', patient: 'Alex Johnson', id: 'BHG-20467', visit: 'Medication window', stage: 'Ready', detail: 'Order verified' },
  { time: '8:16 AM', patient: 'Riley Parker', id: 'BHG-20432', visit: 'Clinical review', stage: 'Hold', detail: 'Provider review required' },
  { time: '8:31 AM', patient: 'Sam Lee', id: 'BHG-20415', visit: 'Medication window', stage: 'Waiting', detail: '2 ahead in queue' },
];

const appointments = [
  { time: '8:15 AM', patient: 'Riley Parker', type: 'Medication plan review', resource: 'Dr. Marcus Hill', mode: 'Clinical Office', status: 'Checked in' },
  { time: '9:00 AM', patient: 'Jamie Carter', type: 'Individual counseling', resource: 'Nina Patel, LPC', mode: 'Room 3', status: 'Confirmed' },
  { time: '10:30 AM', patient: 'Jordan Williams', type: 'Individual counseling', resource: 'Alicia Monroe, LPC-MHSP', mode: 'Room 4', status: 'Confirmed' },
  { time: '1:00 PM', patient: 'Group · 8 enrolled', type: 'Recovery skills group', resource: 'Alicia Monroe, LPC-MHSP', mode: 'Group Room A', status: 'Confirmed' },
  { time: '2:30 PM', patient: 'New intake', type: 'Comprehensive assessment', resource: 'Dr. Marcus Hill / Intake', mode: 'Intake Suite', status: 'Pending' },
];

const counseling = [
  { patient: 'Jordan Williams', service: 'Individual counseling', counselor: 'Alicia Monroe', due: 'Sep 17', completion: 'On track', lastNote: 'Sep 10' },
  { patient: 'Taylor Brooks', service: 'Treatment plan review', counselor: 'Alicia Monroe', due: 'Today', completion: 'Due today', lastNote: 'Aug 14' },
  { patient: 'Casey Morgan', service: 'Individual counseling', counselor: 'Devon Price', due: 'Sep 16', completion: 'On track', lastNote: 'Sep 9' },
  { patient: 'Riley Parker', service: 'Initial treatment plan', counselor: 'Devon Price', due: 'Overdue', completion: 'Attention', lastNote: 'Sep 2' },
];

const uds = [
  { patient: 'Jordan Williams', type: 'Random UDS', collected: 'Sep 12', result: 'Consistent', review: 'Reviewed' },
  { patient: 'Taylor Brooks', type: 'Random UDS', collected: 'Sep 14', result: 'Processing', review: 'Pending' },
  { patient: 'Casey Morgan', type: 'Oral fluid', collected: 'Sep 11', result: 'Consistent', review: 'Reviewed' },
  { patient: 'Riley Parker', type: 'Random UDS', collected: 'Sep 14', result: 'Exception', review: 'Provider review' },
];

const billing = [
  { payer: 'TennCare / Medicaid', patients: 312, eligibility: '97%', auth: '11 expiring', balance: '$18,420' },
  { payer: 'Commercial', patients: 104, eligibility: '94%', auth: '6 expiring', balance: '$12,860' },
  { payer: 'Self-pay', patients: 69, eligibility: '—', auth: 'Not required', balance: '$7,940' },
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

function WorkQueue({ limit }) {
  const { workItems, resolveWorkItem, addToast } = useApp();
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const items = workItems.filter((item) => item.status !== 'Resolved').slice(0, limit);
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
        <Table columns={['Request', 'Patient', 'Received', 'Status', 'Action']} rows={items} render={(row) => <>
          <td><strong>{row.type}</strong><small>{row.title}</small></td>
          <td>{row.patient}</td><td>{row.created}</td><td><Status>{row.status}</Status></td>
          <td><button className="bhg-text-button" onClick={() => { setSelected(row); setResponse(''); }}>Review</button></td>
        </>} />
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
  const { navigate, addToast, openWorkItems, resetDemo } = useApp();
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow="BHG Knoxville · Clinic operations" title="Good morning, Morgan" description="Daily outpatient treatment operations for Monday, September 14." action="Reset demo" onAction={resetDemo} />
      <div className="bhg-admin-stat-grid">
        <Stat icon={UsersRound} label="Active census" value="485" note="OTP 381 · OBOT 72 · IOP 32" />
        <Stat icon={UserRoundCheck} label="Medication check-ins" value="176" note="142 completed · 31 expected" tone="success" />
        <Stat icon={CalendarDays} label="Clinical appointments" value="34" note="5 counseling · 2 provider next" />
        <Stat icon={AlertTriangle} label="Patient requests" value={openWorkItems} note="Shared from the patient portal" tone="warning" />
      </div>
      <div className="bhg-two-column bhg-two-column-wide">
        <section className="bhg-card">
          <div className="bhg-section-title"><div><h2>Today’s medication window</h2><p>Daily arrivals are check-ins, separate from scheduled appointments.</p></div><Status>Open</Status></div>
          <div className="bhg-admin-progress"><span style={{ width: '81%' }} /></div>
          <div className="bhg-admin-progress-label"><span>176 checked in</span><strong>217 expected today</strong></div>
          <Table columns={['Time', 'Patient', 'Visit', 'Status']} rows={checkIns.slice(0, 4)} render={(row) => <>
            <td>{row.time}</td><td><strong>{row.patient}</strong><small>{row.id}</small></td><td>{row.visit}<small>{row.detail}</small></td><td><Status>{row.stage}</Status></td>
          </>} />
          <button className="bhg-link-row" onClick={() => navigate('admin-check-ins')}>Open medication queue <ArrowRight size={14} /></button>
        </section>
        <div className="bhg-stack">
          <section className="bhg-card">
            <div className="bhg-section-title"><div><h2>Operational alerts</h2><p>Review before end of shift.</p></div></div>
            <div className="bhg-admin-alert"><AlertTriangle size={17} /><div><strong>2 medication holds</strong><p>Provider review is required before dosing.</p></div></div>
            <div className="bhg-admin-alert info"><FileCheck2 size={17} /><div><strong>11 authorizations expiring</strong><p>Due within the next 14 days.</p></div></div>
            <div className="bhg-admin-alert info"><MessageSquareText size={17} /><div><strong>3 unsigned Darts notes</strong><p>Counseling documentation is pending.</p></div></div>
          </section>
          <section className="bhg-card">
            <div className="bhg-section-title"><div><h2>SAMMS status</h2><p>Static demonstration of core interfaces.</p></div><Status>Operational</Status></div>
            <div className="bhg-detail-row"><span>Appointments sync</span><strong>2 minutes ago</strong></div>
            <div className="bhg-detail-row"><span>Lab results</span><strong>5 minutes ago</strong></div>
            <button className="bhg-button bhg-button-secondary bhg-admin-full" onClick={() => addToast('Demo synchronization completed.', 'info')}>Run demo sync</button>
          </section>
        </div>
      </div>
      <section className="bhg-card bhg-admin-work-queue">
        <div className="bhg-section-title"><div><h2>Patient request queue</h2><p>Messages, scheduling, treatment support, consent, and financial-help requests.</p></div><Status>{openWorkItems} open</Status></div>
        <WorkQueue limit={6} />
      </section>
    </div>
  );
}

export function AdminPatients() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => patients.filter((item) => `${item.name} ${item.id} ${item.program}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow="Census management" title="Patients" description="Clinic roster, program enrollment, counselor assignment, and payer summary." />
      <section className="bhg-card">
        <div className="bhg-admin-toolbar"><div className="bhg-admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient, ID, or program" /></div><Status>{filtered.length} shown</Status></div>
        <Table columns={['Patient', 'Program / phase', 'Counselor', 'Payer', 'Status', 'Last activity']} rows={filtered} render={(row) => <>
          <td><strong>{row.name}</strong><small>{row.id}</small></td><td>{row.program}<small>{row.phase}</small></td><td>{row.counselor}</td><td>{row.payer}</td><td><Status>{row.status}</Status></td><td>{row.last}</td>
        </>} />
      </section>
    </div>
  );
}

export function AdminCheckIns() {
  const { addToast } = useApp();
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow="Medication operations" title="Check-in & dosing queue" description="Daily medication-window arrivals. This queue is operationally separate from the appointment calendar." action="Add walk-in" onAction={() => addToast('Walk-in check-in created for this static demo.', 'success')} />
      <div className="bhg-admin-stat-grid three"><Stat icon={CheckCircle2} label="Completed" value="142" note="Since 5:30 AM" tone="success" /><Stat icon={Clock3} label="Waiting / ready" value="8" note="Average wait 7 minutes" /><Stat icon={AlertTriangle} label="Clinical holds" value="2" note="No dosing until reviewed" tone="warning" /></div>
      <section className="bhg-card">
        <Table columns={['Arrival', 'Patient', 'Queue reason', 'Details', 'Status']} rows={checkIns} render={(row) => <>
          <td>{row.time}</td><td><strong>{row.patient}</strong><small>{row.id}</small></td><td>{row.visit}</td><td>{row.detail}</td><td><Status>{row.stage}</Status></td>
        </>} />
      </section>
      <div className="bhg-info-banner"><ShieldCheck size={16} /> Medication orders, dosing decisions, and holds remain controlled clinical workflows in SAMMS.</div>
    </div>
  );
}

export function AdminAppointments() {
  const { addToast } = useApp();
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow="Clinic-managed scheduling" title="Appointments" description="Counseling, provider, intake, group, and IOP calendar—not the daily medication check-in queue." action="New appointment" onAction={() => addToast('New appointment draft opened in this static demo.', 'success')} />
      <section className="bhg-card">
        <div className="bhg-section-title"><div><h2>Monday, September 14</h2><p>34 scheduled services · 29 confirmed</p></div><Status>Today</Status></div>
        <Table columns={['Time', 'Patient / group', 'Service', 'Resource', 'Location', 'Status']} rows={appointments} render={(row) => <>
          <td><strong>{row.time}</strong></td><td>{row.patient}</td><td>{row.type}</td><td>{row.resource}</td><td>{row.mode}</td><td><Status>{row.status}</Status></td>
        </>} />
      </section>
    </div>
  );
}

export function AdminCounseling() {
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow="Darts service workflow" title="Counseling" description="Required services, counselor workload, treatment-plan deadlines, and documentation follow-up." />
      <div className="bhg-admin-stat-grid"><Stat icon={MessageSquareText} label="Sessions today" value="21" note="16 individual · 5 group" /><Stat icon={FileCheck2} label="Notes signed" value="18" note="3 still pending" tone="success" /><Stat icon={UsersRound} label="Counselors on site" value="6" note="2 groups running" /><Stat icon={AlertTriangle} label="Past due services" value="4" note="Requires outreach" tone="warning" /></div>
      <section className="bhg-card"><Table columns={['Patient', 'Required service', 'Counselor', 'Due', 'Last note', 'Status']} rows={counseling} render={(row) => <>
        <td><strong>{row.patient}</strong></td><td>{row.service}</td><td>{row.counselor}</td><td>{row.due}</td><td>{row.lastNote}</td><td><Status>{row.completion}</Status></td>
      </>} /></section>
    </div>
  );
}

export function AdminLabs() {
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow="Treatment monitoring" title="UDS & labs" description="Collection status and clinical review routing. Detailed results remain access-controlled." />
      <div className="bhg-admin-stat-grid three"><Stat icon={TestTube2} label="Collections today" value="18" note="15 complete · 3 pending" /><Stat icon={CheckCircle2} label="Reviewed" value="27" note="In the last 24 hours" tone="success" /><Stat icon={AlertTriangle} label="Exceptions" value="3" note="Clinical review required" tone="warning" /></div>
      <section className="bhg-card"><Table columns={['Patient', 'Test', 'Collected', 'Result category', 'Review']} rows={uds} render={(row) => <>
        <td><strong>{row.patient}</strong></td><td>{row.type}</td><td>{row.collected}</td><td><Status>{row.result}</Status></td><td><Status>{row.review}</Status></td>
      </>} /></section>
    </div>
  );
}

export function AdminBilling() {
  return (
    <div className="bhg-page">
      <AdminHeader eyebrow="Revenue-cycle operations" title="Coverage & billing" description="Eligibility, authorizations, patient responsibility, and outstanding balances." />
      <div className="bhg-admin-stat-grid"><Stat icon={CreditCard} label="Eligible coverage" value="96%" note="Verified active patients" tone="success" /><Stat icon={FileCheck2} label="Authorizations expiring" value="17" note="Within 14 days" tone="warning" /><Stat icon={Clock3} label="Claims pending" value="42" note="$31,280 total" /><Stat icon={AlertTriangle} label="Billing holds" value="6" note="Needs correction" tone="warning" /></div>
      <section className="bhg-card"><Table columns={['Payer group', 'Patients', 'Eligibility', 'Authorization status', 'Outstanding']} rows={billing} render={(row) => <>
        <td><strong>{row.payer}</strong></td><td>{row.patients}</td><td>{row.eligibility}</td><td>{row.auth}</td><td><strong>{row.balance}</strong></td>
      </>} /></section>
    </div>
  );
}
