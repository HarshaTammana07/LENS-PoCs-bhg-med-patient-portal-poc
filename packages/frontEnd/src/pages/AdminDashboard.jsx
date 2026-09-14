import React, { useState, useEffect } from 'react';
import {
  Users, Stethoscope, Building2, Wallet, LayoutDashboard,
  AlertCircle, TrendingUp, Activity, ShieldCheck, FlaskConical,
  CreditCard, Database, FileText, Bell, Search,
  ArrowUpRight, ArrowDownRight,
  CheckCircle, Clock, XCircle, AlertTriangle, X, Save,
  UserPlus, RefreshCw, Zap, Brain, MapPin,
  Calendar, Clipboard, BarChart2, PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── DATA CONSTANTS ─────────────────────────────────────────────────
const SEGMENT_TABS = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'staff', label: 'Staff', icon: Clipboard },
  { id: 'labs', label: 'Labs', icon: FlaskConical },
  { id: 'integrations', label: 'Integrations', icon: Database },
];

const getKPIs = (m) => [
  { label: 'Active Patients', value: m.census, trend: '+4.2%', up: true, icon: Users, color: 'var(--primary)', bg: 'var(--primary-light)', sub: 'Current Active Census' },
  { label: 'Active Providers', value: m.activeProviders, trend: '+2.0%', up: true, icon: Stethoscope, color: 'var(--success)', bg: 'var(--success-light)', sub: 'All Clinical Units' },
  { label: 'Total Staff on Shift', value: m.staffOnShift, trend: '+1.5%', up: true, icon: Clipboard, color: 'var(--accent)', bg: 'var(--accent-light)', sub: 'Current Roster' },
  { label: 'Hospital Capacity', value: m.capacity, trend: '+3%', up: false, icon: Building2, color: 'var(--primary)', bg: 'var(--primary-light)', sub: 'Total Bed Occupancy' },
  { label: "Today's Procedures", value: m.proceduresToday, trend: '+8.5%', up: true, icon: Activity, color: 'var(--primary)', bg: 'var(--primary-light)', sub: 'Scheduled Encounters' },
  { label: 'Pending Claims', value: m.pendingClaims, trend: '-1.4%', up: false, icon: Wallet, color: 'var(--warning)', bg: 'var(--warning-light)', sub: 'RCM Queue' },
  { label: 'ED Wait Time', value: m.waitTime, trend: '-4 min', up: true, icon: Clock, color: 'var(--accent)', bg: 'var(--accent-light)', sub: 'Rolling average' },
  { label: 'MTD Revenue', value: m.mtdRevenue, trend: '+6.1%', up: true, icon: TrendingUp, color: 'var(--success)', bg: 'var(--success-light)', sub: 'Net Collection' },
];

// --- DATA CONSTANTS REMOVED (Now using AppContext for Alerts) ---

const DEPARTMENTS = [
  { id: 'U001', name: 'Emergency Dept', type: 'ED', region: 'Sector A', visits: 612, capacity: 95, wait: 34, status: 'Critical', services: ['Trauma', 'Triage'], docs: 12, staff: 48 },
  { id: 'U002', name: 'Intensive Care Unit', type: 'Inpatient', region: 'Level 4', visits: 22, capacity: 94, wait: 0, status: 'Critical', services: ['Critical Care'], docs: 8, staff: 32 },
  { id: 'U003', name: 'Cardiology Unit', type: 'Specialty', region: 'Level 3', visits: 114, capacity: 82, wait: 14, status: 'High Load', services: ['Diagnostics', 'Echo'], docs: 14, staff: 28 },
  { id: 'U004', name: 'Surgical Suite', type: 'OR', region: 'Level 2', visits: 48, capacity: 71, wait: 28, status: 'Normal', services: ['General', 'Ortho'], docs: 18, staff: 42 },
  { id: 'U005', name: 'Radiology Imaging', type: 'Support', region: 'Level 1', visits: 186, capacity: 62, wait: 15, status: 'Normal', services: ['MRI', 'CT', 'X-Ray'], docs: 6, staff: 24 },
  { id: 'U006', name: 'Outpatient Clinic', type: 'Ambulatory', region: 'West Wing', visits: 241, capacity: 84, wait: 18, status: 'High Load', services: ['Primary Care'], docs: 22, staff: 18 },
  { id: 'U007', name: 'Laboratory Services', type: 'Support', region: 'Level 1', visits: 388, capacity: 47, wait: 12, status: 'Normal', services: ['Pathology', 'Blood Bank'], docs: 4, staff: 22 },
  { id: 'U008', name: 'Inpatient Med-Surg', type: 'Inpatient', region: 'Level 2', visits: 158, capacity: 55, wait: 0, status: 'Normal', services: ['Med-Surg'], docs: 10, staff: 42 },
];

const DOCTORS = [
  { id: 'D001', name: 'Dr. Sarah Mitchell', specialty: 'Cardiology', unit: 'Cardiac ICU (4B)', status: 'Active', load: 94, patients: 42, initials: 'SM', color: '#1a6dd4', phone: '(555) 123-4567', email: 's.mitchell@BHG.com', facility: 'Cardiology Unit' },
  { id: 'D002', name: 'Dr. James Thornton', specialty: 'Orthopedics', unit: 'Surgical Suite A', status: 'Active', load: 82, patients: 38, initials: 'JT', color: '#00b5a3', phone: '(555) 234-5678', email: 'j.thornton@BHG.com', facility: 'Surgical Suite' },
  { id: 'D003', name: 'Dr. Olivia Chen', specialty: 'Neurology', unit: 'Neuro-Specialty Unit', status: 'Active', load: 77, patients: 29, initials: 'OC', color: '#7c3aed', phone: '(555) 345-6789', email: 'o.chen@BHG.com', facility: 'Neurology Dept' },
  { id: 'D004', name: 'Dr. Marcus Webb', specialty: 'Emergency Medicine', unit: 'ER Triage Zone 1', status: 'Active', load: 98, patients: 51, initials: 'MW', color: '#e84444', phone: '(555) 456-7890', email: 'm.webb@BHG.com', facility: 'Emergency Dept' },
  { id: 'D005', name: 'Dr. Robert Miller', specialty: 'Oncology', unit: 'Oncology Inpatient', status: 'Active', load: 89, patients: 34, initials: 'PR', color: '#f59e0b', phone: '(555) 567-8901', email: 'r.miller@BHG.com', facility: 'Oncology Unit' },
  { id: 'D006', name: 'Dr. David Park', specialty: 'Internal Medicine', unit: 'Med-Surg East', status: 'On Leave', load: 0, patients: 0, initials: 'DP', color: '#94a3b8', phone: '(555) 678-9012', email: 'd.park@BHG.com', facility: 'Inpatient Med-Surg' },
];

const PATIENTS = [
  { id: 'MRN-20041', name: 'Eleanor Walsh', status: 'Active', unit: 'Cardiology', lastVisit: 'Apr 19, 2026', condition: 'Cardiology Follow-up', insurance: 'BlueCross BCBS', facility: 'Cardiology Unit' },
  { id: 'MRN-20042', name: 'James Wilson', status: 'Active', unit: 'Specialty Unit', lastVisit: 'Apr 18, 2026', condition: 'Neurology', insurance: 'Aetna', facility: 'Neurology Dept' },
  { id: 'MRN-20043', name: 'Grace Hoffman', status: 'Discharged', unit: 'Med-Surg 4B', lastVisit: 'Apr 15, 2026', condition: 'Post-Op Recovery', insurance: 'UnitedHealthcare', facility: 'Inpatient Med-Surg' },
  { id: 'MRN-20044', name: 'James Okafor', status: 'Active', unit: 'Primary Care', lastVisit: 'Apr 20, 2026', condition: 'Routine', insurance: 'Cigna', facility: 'Outpatient Clinic' },
  { id: 'MRN-20045', name: 'Patricia Mills', status: 'Critical', unit: 'ICU', lastVisit: 'Apr 20, 2026', condition: 'ICU Admit', insurance: 'Medicare', facility: 'Intensive Care Unit' },
  { id: 'MRN-20046', name: 'David Nguyen', status: 'Active', unit: 'Surgical Suite', lastVisit: 'Apr 17, 2026', condition: 'Orthopedics', insurance: 'Medicaid', facility: 'Surgical Suite' },
  { id: 'MRN-20047', name: 'Linda Crawford', status: 'Scheduled', unit: 'Endocrinology', lastVisit: 'Apr 10, 2026', condition: 'New Encounter', insurance: 'BlueCross BCBS', facility: 'Outpatient Clinic' },
];

const INTEGRATIONS_DATA = [
  { id: 'INT-01', name: 'Epic EHR', category: 'Core Health Records', status: 'Operational', latency: '42ms', lastSync: 'Just now', uptime: '99.99%', impact: null },
  { id: 'INT-02', name: 'Cerner Millennium', category: 'Core Health Records', status: 'Operational', latency: '58ms', lastSync: '2 mins ago', uptime: '99.95%', impact: null },
  { id: 'INT-03', name: 'LabCore LIMS', category: 'Laboratory API', status: 'Degraded', latency: '1,420ms', lastSync: '14 mins ago', uptime: '98.20%', impact: 'Lab result delays affecting Laboratory Services' },
  { id: 'INT-04', name: 'Quest Diagnostics', category: 'Laboratory API', status: 'Operational', latency: '85ms', lastSync: '1 min ago', uptime: '99.9%', impact: null },
  { id: 'INT-05', name: 'Medicare/CMS Gateway', category: 'Billing & Claims', status: 'Operational', latency: '112ms', lastSync: '1 hour ago', uptime: '99.5%', impact: null },
  { id: 'INT-06', name: 'Clearinghouse EDI', category: 'Billing & Claims', status: 'Offline', latency: '--', lastSync: '2 hours ago', uptime: '95.0%', impact: 'Claim submission for 318 pending claims delayed' },
  { id: 'INT-07', name: 'Central Scheduling API', category: 'Operations', status: 'Operational', latency: '78ms', lastSync: '5 mins ago', uptime: '99.7%', impact: null },
  { id: 'INT-08', name: 'Pharmacy Network', category: 'Clinical', status: 'Operational', latency: '94ms', lastSync: '3 mins ago', uptime: '99.8%', impact: null },
];

const AUDIT_LOGS = [
  { id: 'AUD-001', action: 'Admin Login', user: 'Justin Coran', role: 'admin', ip: '192.168.1.42', time: 'Apr 20, 2026 10:04 AM', outcome: 'Success' },
  { id: 'AUD-002', action: 'Patient Record Export', user: 'Dr. Sarah Mitchell', role: 'doctor', ip: '10.0.2.12', time: 'Apr 20, 2026 09:48 AM', outcome: 'Success' },
  { id: 'AUD-003', action: 'Failed Login Attempt', user: 'unknown', role: '--', ip: '203.0.113.44', time: 'Apr 20, 2026 09:22 AM', outcome: 'Failed' },
  { id: 'AUD-004', action: 'Billing Report Generated', user: 'W. Harmon (Finance)', role: 'staff', ip: '10.0.1.8', time: 'Apr 20, 2026 08:55 AM', outcome: 'Success' },
  { id: 'AUD-005', action: 'Provider Profile Updated', user: 'Justin Coran', role: 'admin', ip: '192.168.1.42', time: 'Apr 19, 2026 04:31 PM', outcome: 'Success' },
  { id: 'AUD-006', action: 'Integration Force Sync', user: 'Justin Coran', role: 'admin', ip: '192.168.1.42', time: 'Apr 19, 2026 03:12 PM', outcome: 'Success' },
];

const AI_INSIGHTS = [
  { id: 1, type: 'Load Prediction', icon: TrendingUp, color: 'var(--primary)', title: 'Patient Volume Surge Expected', detail: 'Hospital projected to receive 18% above average patient volume in next 24 hours based on seasonal patterns and current ER admission trajectory.', severity: 'high', action: 'Open Overflow Slots', confidence: 91 },
  { id: 2, type: 'Claims Risk', icon: CreditCard, color: 'var(--warning)', title: 'Cardiology Claim Rejection Risk', detail: 'ICD-11 code mismatches detected in 23 pending Cardiology claims. AI model predicts 74% denial probability without pre-submission correction.', severity: 'medium', action: 'Review Claims Batch', confidence: 74 },
  { id: 3, type: 'Burnout Risk', icon: AlertTriangle, color: 'var(--danger)', title: 'Provider Overload: ER Team', detail: 'Dr. Marcus Webb and 2 ER colleagues have logged 14-hour shifts for 4 consecutive days. Burnout risk elevated. Recommend scheduling relief coverage.', severity: 'high', action: 'Adjust Schedule', confidence: 88 },
  { id: 4, type: 'Capacity Risk', icon: Building2, color: 'var(--accent)', title: 'Outpatient Clinic Approaching Limit', detail: 'Outpatient appointment fill rate has increased 22% over 7 days. Capacity ceiling predicted to be reached within 5 business days.', severity: 'medium', action: 'Add Capacity', confidence: 82 },
  { id: 5, type: 'Staffing Gap', icon: Users, color: 'var(--purple)', title: 'Night Shift RN Shortage Predicted', detail: 'Based on approved PTO requests and current roster, 4 RN positions will have no coverage coverage Friday–Sunday.', severity: 'high', action: 'Trigger Staffing Alert', confidence: 96 },
  { id: 6, type: 'Integration Delay', icon: Database, color: 'var(--warning)', title: 'Lab Results Delay Risk', detail: 'LabCore LIMS degraded performance is projected to delay 140+ radiology and pathology results by 2–4 hours if not resolved within the next 3 hours.', severity: 'medium', action: 'Escalate IT Issue', confidence: 79 },
];

const STAFF_DATA = [
  { id: 'ST001', name: 'Wendy Harmon', role: 'Billing Specialist', facility: 'Revenue Cycle', shift: 'Day', status: 'Active', dept: 'Finance', tasks: 14 },
  { id: 'ST002', name: 'James Wilson', role: 'RN', facility: 'Intensive Care Unit', shift: 'Night', status: 'Active', dept: 'Nursing', tasks: 22 },
  { id: 'ST003', name: 'Tanya Brooks', role: 'Medical Assistant', facility: 'Outpatient Clinic', shift: 'Day', status: 'Active', dept: 'Clinical', tasks: 18 },
  { id: 'ST004', name: 'Greg Holloway', role: 'IT Systems Admin', facility: 'IT Operations', shift: 'Day', status: 'Active', dept: 'Technology', tasks: 9 },
  { id: 'ST005', name: 'Denise Waters', role: 'RN', facility: 'Emergency Dept', shift: 'Day', status: 'On Leave', dept: 'Nursing', tasks: 0 },
  { id: 'ST006', name: 'Linda Taylor', role: 'Lab Technician', facility: 'Laboratory Services', shift: 'Day', status: 'Active', dept: 'Laboratory', tasks: 31 },
];

const LAB_DATA = [
  { id: 'LAB-001', test: 'CBC Panel', patient: 'Eleanor Walsh', facility: 'Cardiology Unit', ordered: 'Apr 20, 09:12 AM', status: 'Pending', priority: 'STAT', tat: '< 2h' },
  { id: 'LAB-002', test: 'Lipid Panel', patient: 'Robert Miller', facility: 'Oncology Unit', ordered: 'Apr 20, 08:45 AM', status: 'In Progress', priority: 'Routine', tat: '< 6h' },
  { id: 'LAB-003', test: 'CT Scan – Chest', patient: 'Patricia Mills', facility: 'Intensive Care Unit', ordered: 'Apr 20, 09:00 AM', status: 'Delayed', priority: 'STAT', tat: 'Overdue' },
  { id: 'LAB-004', test: 'Diagnostic Imaging (X-Ray)', patient: 'Linda Crawford', facility: 'Radiology Imaging', ordered: 'Apr 19, 02:15 PM', status: 'Resulted', priority: 'Routine', tat: 'Completed' },
  { id: 'LAB-005', test: 'Pathology – Biopsy', patient: 'Angela Ross', facility: 'Laboratory Services', ordered: 'Apr 20, 10:05 AM', status: 'Pending', priority: 'Routine', tat: '< 4h' },
  { id: 'LAB-006', test: 'Troponin I', patient: 'James Wilson', facility: 'Emergency Dept', ordered: 'Apr 20, 10:22 AM', status: 'In Progress', priority: 'STAT', tat: '< 1h' },
];

// ─── HELPER COMPONENTS ───────────────────────────────────────────────
function SeverityBadge({ severity }) {
  const map = {
    critical: { cls: 'badge-danger', label: 'Critical' },
    high: { cls: 'badge-warning', label: 'High' },
    medium: { cls: 'badge-primary', label: 'Medium' },
    low: { cls: 'badge-success', label: 'Low' },
  };
  const { cls, label } = map[severity] || map.low;
  return <span className={`badge ${cls} badge-dot`}>{label}</span>;
}

function StatusBadge({ status }) {
  const map = {
    Active: 'badge-success', Critical: 'badge-danger', Discharged: 'badge-muted',
    Scheduled: 'badge-primary', 'On Leave': 'badge-warning', Offline: 'badge-danger',
    Degraded: 'badge-warning', Operational: 'badge-success', Resulted: 'badge-success',
    Delayed: 'badge-danger', 'In Progress': 'badge-accent', Pending: 'badge-warning',
    Submitted: 'badge-primary', Processing: 'badge-accent', Cleared: 'badge-success',
    Rejected: 'badge-danger', 'High Load': 'badge-warning', Normal: 'badge-success',
  };
  return <span className={`badge ${map[status] || 'badge-muted'} badge-dot`}>{status}</span>;
}

function LoadBar({ pct, color }) {
  const c = pct >= 90 ? 'var(--danger)' : pct >= 75 ? 'var(--warning)' : 'var(--success)';
  return (
    <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color || c, borderRadius: 99, transition: 'width 0.8s ease' }} />
    </div>
  );
}

// ─── SYNC STATUS MODAL ───────────────────────────────────────────────
function SyncStatusModal({ interface: int, onClose }) {
  const [step, setStep] = useState(0);
  const logs = [
    { time: '0ms', msg: `Initializing handshake with ${int.name} gateway...`, status: 'info' },
    { time: '140ms', msg: 'Validating OAuth2 credentials and encryption keys...', status: 'info' },
    { time: '380ms', msg: 'Requesting manifest synchronization (Protocol HL7/FHIR)...', status: 'info' },
    { time: '820ms', msg: `Receiving delta packets from ${int.category}...`, status: 'success' },
    { time: '1240ms', msg: 'Applying 42 local database updates...', status: 'success' },
    { time: '1580ms', msg: 'System integrity check completed. No data loss detected.', status: 'success' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => s < logs.length ? s + 1 : s);
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-md" onClick={e => e.stopPropagation()} style={{ background: '#000', border: '1px solid #333', color: '#fff' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid #222' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <RefreshCw size={18} className="spin" /> {int.name} Sync Health Report
          </div>
          <button className="modal-close" onClick={onClose} style={{ color: '#fff' }}><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ padding: 24, minHeight: 300 }}>
          <div style={{ background: '#111', borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, border: '1px solid #222' }}>
            {logs.slice(0, step).map((log, i) => (
              <div key={i} style={{ marginBottom: 6, display: 'flex', gap: 12 }}>
                <span style={{ color: '#666', width: 50 }}>[{log.time}]</span>
                <span style={{ color: log.status === 'success' ? '#10b981' : '#3b82f6' }}>{log.msg}</span>
              </div>
            ))}
            {step < logs.length && <div style={{ color: '#666' }}>_ Running telemetry sync...</div>}
          </div>

          {step === logs.length && (
            <div className="animate-fade-in" style={{ marginTop: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#111', padding: 12, borderRadius: 8, border: '1px solid #222' }}>
                  <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', marginBottom: 4 }}>Uptime Health</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{int.uptime}</div>
                </div>
                <div style={{ background: '#111', padding: 12, borderRadius: 8, border: '1px solid #222' }}>
                  <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', marginBottom: 4 }}>Current Latency</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>{int.latency}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer" style={{ borderTop: '1px solid #222', background: '#000' }}>
          <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={onClose}>Close Report</button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT MODAL ──────────────────────────────────────────────────────
function EditModal({ item, type, onClose, onSave }) {
  const [form, setForm] = useState({ ...item });
  const handleSave = () => { 
    onSave(form); 
    onClose(); 
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Edit {type}: {item.name || item.id}</div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {Object.entries(form).filter(([k]) => k !== 'id' && k !== 'initials' && k !== 'color' && k !== 'load' && k !== 'tasks' && typeof form[k] !== 'object').map(([key, val]) => (
            <div key={key} className="input-group">
              <label className="input-label" style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                className="input-field"
                value={val}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}><Save size={14} /> Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-PANEL COMPONENTS ────────────────────────────────────────────
function OverviewPanel({ isMounted, addToast, navigate, setActiveTab }) {
  const { adminAlerts, addAuditLog, hospitalMetrics } = useApp();
  const KPI_DATA = getKPIs(hospitalMetrics);
  const [alertFilter, setAlertFilter] = useState('All');
  const [chartPeriod, setChartPeriod] = useState('Week');
  const alertCategories = ['All', 'Operational', 'Billing', 'Compliance', 'Technology', 'Administrative'];
  
  const handleAlertFilter = (cat) => {
    setAlertFilter(cat);
    addAuditLog({ action: 'Filter Applied', details: `Filtered operational alerts by: ${cat}` });
  };
  
  const handleChartPeriod = (p) => {
    setChartPeriod(p);
    addAuditLog({ action: 'Analytics Interaction', details: `Changed chart timeframe to: ${p}` });
  };

  const filteredAlerts = alertFilter === 'All' ? adminAlerts : adminAlerts.filter(a => a.category === alertFilter);

  const getChartData = () => {
    if (chartPeriod === 'Week') return [85, 92, 78, 100, 88, 74, 95];
    if (chartPeriod === 'Month') return [55, 62, 71, 75, 68, 92, 78, 100, 88, 74, 80, 95, 70, 84, 88, 90, 85, 76, 80, 92, 95, 88, 85, 100, 90, 85, 78, 82, 88, 95];
    return [45, 55, 60, 65, 70, 75, 85, 90, 88, 92, 95, 100]; // Year
  };
  const getPrevData = (curr) => {
    return curr.map((v, i) => Math.max(10, Math.min(100, v + (Math.sin(i) * 15 - 5))));
  }
  const chartData = getChartData();
  const prevData = getPrevData(chartData);
  
  const generatePath = (data) => {
    if (!data.length) return '';
    return data.map((val, i) => `${i === 0 ? 'M' : 'L'} ${(i / (data.length - 1)) * 100} ${100 - val}`).join(' ');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="card" style={{ padding: 20, cursor: 'default', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={18} color={kpi.color} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{kpi.value}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', marginTop: 3 }}>{kpi.label}</div>
            {kpi.label !== 'Active Patients' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                {kpi.up === true && <ArrowUpRight size={12} color="var(--success)" />}
                {kpi.up === false && <ArrowDownRight size={12} color="var(--danger)" />}
                <span style={{ fontSize: 11, fontWeight: 600, color: kpi.up === true ? 'var(--success)' : kpi.up === false ? 'var(--danger)' : 'var(--text-muted)' }}>{kpi.trend}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs last month</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card chart-container" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BarChart2 size={16} color="var(--primary)" /> Operational Performance</div>
              <div className="card-subtitle">Hospital-wide clinical throughput & unit load</div>
            </div>
            <div style={{ display: 'flex', gap: 8, background: 'var(--bg)', padding: 4, borderRadius: 8 }}>
              {['Week', 'Month', 'Year'].map(t => (
                <button key={t} className={`filter-chip ${chartPeriod === t ? 'active' : ''}`} onClick={() => handleChartPeriod(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 200, width: '100%', position: 'relative', padding: '10px 0' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 10, bottom: 30, pointerEvents: 'none' }}>
              {[100, 75, 50, 25].map(val => (
                <div key={val} style={{ position: 'absolute', left: 35, right: 0, top: `${(100 - val)}%`, borderTop: '1px dashed var(--border-light)', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: -35, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{val}%</span>
                </div>
              ))}
            </div>
            <div style={{ marginLeft: 35, height: '100%', position: 'relative' }}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: 'calc(100% - 30px)', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                  <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={generatePath(prevData)} fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
                <path d={`${generatePath(chartData)} L 100 100 L 0 100 Z`} fill="url(#areaGrad)" opacity="0.6" />
                <path d={generatePath(chartData)} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, paddingTop: 8 }}>
                {chartPeriod === 'Week' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
                {chartPeriod === 'Month' && ['1st', '5th', '10th', '15th', '20th', '25th', '30th'].map(d => <span key={d}>{d}</span>)}
                {chartPeriod === 'Year' && ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
            <div className="chart-tooltip" style={{ position: 'absolute', background: 'var(--text-primary)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, opacity: 0, transform: 'translate(-50%, -100%)', pointerEvents: 'none', transition: 'opacity 0.2s, left 0.1s, top 0.1s', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}></div>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}><PieChart size={16} color="var(--primary)" /> Provider Utilization</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'conic-gradient(var(--primary) 0% 45%, var(--accent) 45% 75%, var(--border) 75% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isMounted ? 'scale(1)' : 'scale(0.8)', opacity: isMounted ? 1 : 0, transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <div style={{ width: 84, height: 84, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800 }}>218</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Doctors</span>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Clinical Staff', 'var(--primary)', '45%'], ['Specialty Care', 'var(--accent)', '30%'], ['Support / Other', 'var(--border)', '25%']].map(([l, c, p]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{l}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} color="var(--danger)" /> Alert Center
              <span className="badge badge-danger" style={{ marginLeft: 4 }}>{adminAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length} urgent</span>
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {alertCategories.map(c => (
                <button key={c} className={`filter-chip ${alertFilter === c ? 'active' : ''}`} style={{ padding: '4px 12px', fontSize: 11 }} onClick={() => handleAlertFilter(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {filteredAlerts.map(alert => (
              <div key={alert.id} style={{ display: 'flex', gap: 14, padding: '14px 24px', borderBottom: '1px solid var(--border-light)', alignItems: 'flex-start', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.severity === 'critical' ? 'var(--danger)' : alert.severity === 'high' ? 'var(--warning)' : alert.severity === 'medium' ? 'var(--primary)' : 'var(--success)', marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.message}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>{alert.type} · {alert.facility} · {alert.time}</div>
                    </div>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  {/* Response Management button removed */}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stethoscope size={16} color="var(--accent)" /> Active Providers
            </h3>
            <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => { handleTabChange('doctors'); addToast('Switching to Provider Directory...', 'info'); }}>View Directory →</span>
          </div>
          <div style={{ padding: '0 4px', maxHeight: 340, overflowY: 'auto' }}>
            {DOCTORS.slice(0, 5).map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&q=80&uid=${d.id}`} alt={d.name} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.specialty} · {d.facility}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginBottom: 0 }}>
        {AI_INSIGHTS.filter(i => i.id === 4).map(insight => (
          <AIInsightCard key={insight.id} insight={insight} addToast={addToast} />
        ))}
      </div>
    </div>
  );
}

function PatientsPanel({ addToast }) {
  const { hospitalMetrics } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editItem, setEditItem] = useState(null);
  const [patients, setPatients] = useState(PATIENTS);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['All', 'Active', 'Critical', 'Scheduled', 'Discharged'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Active Patients', value: hospitalMetrics.census, sub: 'Currently in System', color: 'var(--primary)', bg: 'var(--primary-light)', icon: Users },
          { label: 'Critical / ICU', value: '18', sub: 'Active Monitoring', color: 'var(--danger)', bg: 'var(--danger-light)', icon: AlertTriangle },
          { label: 'Scheduled Admits', value: '24', sub: 'Arrivals Today', color: 'var(--accent)', bg: 'var(--accent-light)', icon: Clock },
          { label: 'Pending Discharge', value: '42', sub: 'Processing Final', color: 'var(--success)', bg: 'var(--success-light)', icon: CheckCircle },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} color={k.color} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{k.label === 'Inpatient Census' ? 'Active Patients' : k.label}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.label === 'Inpatient Census' ? k.color : 'var(--text-primary)' }}>{k.value}</div>
            {k.label !== 'Inpatient Census' && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Operational Patient Directory</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {statuses.map(s => <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} style={{ fontSize: 12, padding: '5px 14px' }} onClick={() => setStatusFilter(s)}>{s}</button>)}
            <div className="search-bar" style={{ width: 220, height: 36 }}>
              <Search size={14} color="var(--text-muted)" />
              <input type="text" placeholder="Search Patient or MRN…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13, padding: '0 8px', flex: 1, border: 'none', background: 'transparent' }} />
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table table-row-hover" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th>Patient Name & MRN</th>
                <th>Status</th>
                <th>Assigned Unit</th>
                <th>Last Update</th>
                <th>Condition</th>
                <th>Payer</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: `hsl(${parseInt(p.id.replace('MRN-', '')) * 37 % 360}, 55%, 45%)` }}>{p.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{p.facility}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.lastVisit}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.condition}</td>
                  <td><span className="badge badge-outline" style={{ fontSize: 10 }}>{p.insurance}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => setEditItem(p)}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editItem && <EditModal item={editItem} type="Patient" onClose={() => setEditItem(null)} onSave={updated => { setPatients(prev => prev.map(p => p.id === updated.id ? updated : p)); addToast('Operational record updated.', 'success'); }} />}
    </div>
  );
}


function DoctorsPanel({ addToast }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editItem, setEditItem] = useState(null);
  const [doctors, setDoctors] = useState(DOCTORS);

  const filtered = doctors.filter(d => {
    const ms = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === 'All' || d.status === statusFilter;
    return ms && mf;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Active Roster', value: '218', sub: '14 Units Covered', color: 'var(--primary)', bg: 'var(--primary-light)', icon: Stethoscope },
          { label: 'Avg Unit Load', value: '82%', sub: 'Target: 75%', color: 'var(--success)', bg: 'var(--success-light)', icon: Activity },
          { label: 'Critical Burnout', value: '7', sub: 'Action Required', color: 'var(--danger)', bg: 'var(--danger-light)', icon: AlertTriangle },
          { label: 'Licensure Alerts', value: '12', sub: 'Expiring < 60d', color: 'var(--warning)', bg: 'var(--warning-light)', icon: ShieldCheck },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} color={k.color} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{k.label}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {AI_INSIGHTS.filter(i => i.id === 3 || i.id === 5).map(insight => (
          <AIInsightCard key={insight.id} insight={insight} addToast={addToast} />
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Professional Provider Roster</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['All', 'Active', 'On Leave'].map(s => <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} style={{ fontSize: 12, padding: '5px 14px' }} onClick={() => setStatusFilter(s)}>{s}</button>)}
            <div className="search-bar" style={{ width: 220, height: 36 }}>
              <Search size={14} color="var(--text-muted)" />
              <input type="text" placeholder="Search by Name/Specialty…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13, padding: '0 8px', flex: 1, border: 'none', background: 'transparent' }} />
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table table-row-hover" style={{ minWidth: 950 }}>
            <thead>
              <tr>
                <th>Provider Details</th>
                <th>Specialty</th>
                <th>Assigned Unit</th>
                <th>Status</th>
                <th>Active Patients</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={`https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&q=80&uid=${d.id}`} alt={d.name} style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid var(--border)', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{d.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{d.specialty}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 700 }}>{d.unit}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td style={{ width: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: d.patients > 40 ? 'var(--danger)' : 'var(--primary)' }}>{d.status === 'On Leave' ? ' - ' : d.patients}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => setEditItem(d)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editItem && <EditModal item={editItem} type="Provider" onClose={() => setEditItem(null)} onSave={updated => { setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d)); addToast('Provider configuration updated.', 'success'); }} />}
    </div>
  );
}


function StaffPanel({ addToast }) {
  const { hospitalMetrics } = useApp();
  const [staff, setStaff] = useState(STAFF_DATA);
  const [editItem, setEditItem] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Clinical Staff (FTE)', value: hospitalMetrics.totalStaff, sub: 'Across 14 departments', color: 'var(--primary)', bg: 'var(--primary-light)', icon: Users },
          { label: 'Active on Rotation', value: hospitalMetrics.staffOnShift, sub: 'Current Shift Coverage', color: 'var(--success)', bg: 'var(--success-light)', icon: CheckCircle },
          { label: 'Critical Shift Gaps', value: '3', sub: 'Requires immediate fill', color: 'var(--danger)', bg: 'var(--danger-light)', icon: AlertTriangle },
          { label: 'On Leave Today', value: hospitalMetrics.onLeaveToday || '12', sub: 'Approved daily absences', color: 'var(--warning)', bg: 'var(--warning-light)', icon: Calendar },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} color={k.color} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{k.label}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Clinical Staff Ops Roster</h3>
        </div>
        <div className="table-wrap">
          <table className="table table-row-hover" style={{ minWidth: 900 }}>
            <thead><tr><th>Staff Member</th><th>Role</th><th>Dept</th><th>Assigned Unit</th><th>Shift</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800 }}>{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500 }}>{s.role}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.dept}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.facility}</td>
                  <td><span style={{ 
                    fontSize: 10, padding: '4px 10px', borderRadius: 6, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                    background: s.shift === 'Night' ? '#000000' : '#ffffff', 
                    color: s.shift === 'Night' ? '#ffffff' : '#000000',
                    border: s.shift === 'Day' ? '1px solid var(--border)' : 'none',
                    display: 'inline-block', minWidth: 60, textAlign: 'center'
                  }}>{s.shift}</span></td>
                  <td><StatusBadge status={s.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => setEditItem(s)}>Edit Ops</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editItem && <EditModal item={editItem} type="Staff" onClose={() => setEditItem(null)} onSave={updated => { setStaff(prev => prev.map(s => s.id === updated.id ? updated : s)); addToast('Operational record synchronized.', 'success'); }} />}
    </div>
  );
}

function LabsPanel({ addToast }) {
  const { hospitalMetrics } = useApp();
  const [labs, setLabs] = useState(LAB_DATA);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Open Lab Orders', value: hospitalMetrics.labOrders, sub: '18 STAT (High Priority)', color: 'var(--warning)', bg: 'var(--warning-light)', icon: FlaskConical },
          { label: 'Analytic Processing', value: '112', sub: 'Current Active Load', color: 'var(--primary)', bg: 'var(--primary-light)', icon: Activity },
          { label: 'TAT Breaches', value: '8', sub: 'Action Required', color: 'var(--danger)', bg: 'var(--danger-light)', icon: AlertTriangle },
          { label: 'System Recovery', value: '4.2h', sub: 'Avg Results TAT', color: 'var(--success)', bg: 'var(--success-light)', icon: Clock },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} color={k.color} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{k.label}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Laboratory Workflow Queue</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => addToast('Synchronizing with LIMS interface…', 'info')}><RefreshCw size={13} /> Sync Interface</button>
        </div>
        <div className="table-wrap">
          <table className="table table-row-hover" style={{ minWidth: 900 }}>
            <thead><tr><th>Order ID</th><th>Test Parameter</th><th>Patient</th><th>Originating Unit</th><th>Requested At</th><th>Priority</th><th>Status</th><th>TAT Marker</th></tr></thead>
            <tbody>
              {labs.map(l => (
                <tr key={l.id}>
                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: 600 }}>{l.id}</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{l.test}</td>
                  <td style={{ fontSize: 13.5, fontWeight: 500 }}>{l.patient}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l.facility}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l.ordered}</td>
                  <td><span className={`badge ${l.priority === 'STAT' ? 'badge-danger' : 'badge-outline'}`} style={{ fontSize: 10 }}>{l.priority}</span></td>
                  <td><StatusBadge status={l.status} /></td>
                  <td style={{ fontSize: 12, fontWeight: 800, color: l.tat === 'Overdue' ? 'var(--danger)' : l.tat === 'Completed' ? 'var(--success)' : 'var(--text-secondary)' }}>{l.tat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IntegrationsPanel({ addToast }) {
  const [integrations, setIntegrations] = useState(INTEGRATIONS_DATA);
  const [syncing, setSyncing] = useState(null);
  const [selectedInt, setSelectedInt] = useState(null);
  const { addAuditLog } = useApp();

  const handleSync = (id, name) => {
    setSyncing(id);
    addAuditLog({ action: 'Integration Sync', details: `Force sync initiated for: ${name}` });
    setTimeout(() => { 
      setSyncing(null); 
      setSelectedInt(integrations.find(i => i.id === id));
      addToast(`${name} interface synchronized.`, 'success');
    }, 1200);
  };
  const opCount = integrations.filter(i => i.status === 'Operational').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {selectedInt && <SyncStatusModal interface={selectedInt} onClose={() => setSelectedInt(null)} />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Active Interfaces', value: integrations.length, sub: 'Connected Ecosystem', color: 'var(--primary)', bg: 'var(--primary-light)', icon: Database },
          { label: 'Operational (200 OK)', value: opCount, sub: 'Healthier than average', color: 'var(--success)', bg: 'var(--success-light)', icon: CheckCircle },
          { label: 'Latency Warnings', value: integrations.filter(i => i.status === 'Degraded').length, sub: 'Requires Optimization', color: 'var(--warning)', bg: 'var(--warning-light)', icon: AlertTriangle },
          { label: 'Critical Outages', value: integrations.filter(i => i.status === 'Offline').length, sub: 'Action Required', color: 'var(--danger)', bg: 'var(--danger-light)', icon: XCircle },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} color={k.color} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{k.label}</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color: 'var(--text-primary)' }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Core System Interface Monitor</h3>
        </div>
        <div className="table-wrap">
          <table className="table table-row-hover" style={{ minWidth: 1000 }}>
            <thead><tr><th>Interface Layer</th><th>Operational Category</th><th>Status</th><th>Latency</th><th>Uptime</th><th>Last Heartbeat</th><th>Business Dependency</th><th style={{ textAlign: 'right' }}>Management</th></tr></thead>
            <tbody>
              {integrations.map(int => (
                <tr key={int.id}>
                  <td style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text-primary)' }}>{int.name}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{int.category}</td>
                  <td><StatusBadge status={int.status} /></td>
                  <td style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: parseInt(int.latency) > 500 ? 'var(--danger)' : 'var(--text-primary)' }}>{int.latency}</td>
                  <td style={{ fontSize: 13, fontWeight: 800 }}>{int.uptime}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{int.lastSync}</td>
                  <td style={{ fontSize: 12, color: int.impact ? 'var(--warning)' : 'var(--text-muted)', maxWidth: 220, fontStyle: int.impact ? 'normal' : 'italic' }}>{int.impact || 'No operational impact'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => handleSync(int.id, int.name)} disabled={syncing === int.id || int.status === 'Offline'}>
                      <RefreshCw size={12} style={{ marginRight: 6 }} className={syncing === int.id ? 'spin' : ''} /> {syncing === int.id ? 'Syncing…' : 'Sync Interface'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AIInsightCard({ insight, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { addAuditLog } = useApp();

  const handleAction = () => {
    setShowModal(true);
  };

  const executeAction = () => {
    setProcessing(true);
    addAuditLog({ action: 'AI Action Execution', details: `Executed AI insight action: ${insight.action}` });
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      addToast(`AI Action Executed: ${insight.action} - ${insight.title}`, 'success');
      setTimeout(() => {
        setShowModal(false);
        setCompleted(false);
      }, 1500);
    }, 2000);
  };

  return (
    <>
      <div className="card" style={{ padding: 22, border: `1px solid ${insight.severity === 'high' ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`, background: insight.severity === 'high' ? 'rgba(239,68,68,0.02)' : 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${insight.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <insight.icon size={18} color={insight.color} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{insight.type}</span>
          </div>
          <SeverityBadge severity={insight.severity} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>{insight.title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{insight.detail}</div>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>AI Confidence</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${insight.confidence}%`, height: '100%', background: insight.confidence >= 90 ? 'var(--danger)' : insight.confidence >= 75 ? 'var(--warning)' : 'var(--primary)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>{insight.confidence}%</span>
          </div>
        </div>
        <button className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: 12 }} onClick={handleAction}><Zap size={12} /> {insight.action}</button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !processing && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={18} color="var(--primary)" /> AI Agent: {insight.action}
              </div>
              <button className="modal-close" onClick={() => !processing && setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{insight.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{insight.detail}</div>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>AI Analysis Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Confidence Score</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: insight.confidence >= 90 ? 'var(--danger)' : 'var(--warning)' }}>{insight.confidence}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Severity Level</span>
                  <SeverityBadge severity={insight.severity} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Category</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{insight.type}</span>
                </div>
              </div>
              {completed && (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <CheckCircle size={16} color="var(--success)" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>Action executed successfully</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => !processing && setShowModal(false)} disabled={processing}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={executeAction} disabled={processing || completed}>
                {processing ? (
                  <><RefreshCw size={13} className="spin" /> Processing...</>
                ) : completed ? (
                  <><CheckCircle size={13} /> Done</>
                ) : (
                  <><Zap size={13} /> Execute {insight.action}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────
export default function AdminDashboard() {
  const { addToast, adminAlerts, addAuditLog, navigate } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMounted, setIsMounted] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  useEffect(() => { setIsMounted(true); }, []);

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview': return <OverviewPanel isMounted={isMounted} addToast={addToast} navigate={navigate} setActiveTab={setActiveTab} />;
      case 'patients': return <PatientsPanel addToast={addToast} />;
      case 'doctors': return <DoctorsPanel addToast={addToast} />;
      case 'staff': return <StaffPanel addToast={addToast} />;
      case 'labs': return <LabsPanel addToast={addToast} />;
      case 'integrations': return <IntegrationsPanel addToast={addToast} />;

      default: return <OverviewPanel isMounted={isMounted} addToast={addToast} navigate={navigate} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* Notification Dropdown */}
      {notifOpen && (
        <div style={{ position: 'fixed', top: 80, right: 28, width: 380, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-xl)', zIndex: 999 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Notifications</div>
            <button className="modal-close" onClick={() => setNotifOpen(false)}><X size={14} /></button>
          </div>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {adminAlerts.slice(0, 6).map(n => (
              <div key={n.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.severity === 'critical' ? 'var(--danger)' : n.severity === 'high' ? 'var(--warning)' : 'var(--primary)', marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 20px', textAlign: 'center' }}>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--primary)' }} onClick={() => { setNotifOpen(false); setActiveTab('overview'); }}>View all alerts</button>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={26} color="var(--primary)" />
            Command Center
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>
            Institutional Operations · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: 8, padding: '6px 12px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>All Systems Operational</span>
          </div>
          <button className="topbar-icon-btn" style={{ position: 'relative' }} onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={17} />
            <div className="topbar-notif-dot" />
          </button>
        </div>
      </div>

      {/* SEGMENT SWITCHER */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 6, overflowX: 'auto', flexShrink: 0 }}>
        {SEGMENT_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(26,109,212,0.25)' : 'none',
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ACTIVE PANEL */}
      <div className="animate-fade-in" key={activeTab}>
        {renderPanel()}
      </div>
    </div>
  );
}