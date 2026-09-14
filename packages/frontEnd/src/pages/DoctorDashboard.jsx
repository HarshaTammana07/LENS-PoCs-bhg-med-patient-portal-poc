import React, { useEffect, useState } from 'react';
import {
  Users, Activity, CheckCircle, Clock, Search, 
  RefreshCw, AlertTriangle, FileText, FlaskConical, 
  Pill, MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// --- CLINICAL WORKLIST DATA ---
const CLINICAL_CENSUS = [
  { id: 'MRN-20041', name: 'Eleanor Walsh', unit: 'Cardiology (3B)', reason: 'Chest Pain / Post-MI', status: 'Stable', v: '98/62', p: '72' },
  { id: 'MRN-20045', name: 'Patricia Mills', unit: 'ICU (Level 4)', reason: 'Septic Shock / ARDS', status: 'Critical', v: '88/54', p: '110' },
  { id: 'MRN-20042', name: 'James Wilson', unit: 'Neurology (2A)', reason: 'TIA / Monitoring', status: 'Stable', v: '130/85', p: '68' },
  { id: 'MRN-20052', name: 'Charles Kim', unit: 'Oncology', reason: 'Chemo / Observation', status: 'Guarded', v: '110/65', p: '82' },
];

const INITIAL_STAT_QUEUE = [
  { id: 'ORD-101', patient: 'Patricia Mills', task: 'Critical Lab: CMP Result', action: 'Review', type: 'Alert' },
  { id: 'ORD-102', patient: 'Eleanor Walsh', task: 'Unsigned Chart: Disch Summary', action: 'Sign', type: 'Document' },
];

export default function DoctorDashboard() {
  const { user, navigate, addToast, addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState({ name: '', id: '' });
  const [statQueue, setStatQueue] = useState(INITIAL_STAT_QUEUE);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setDoctorInfo({
      name: user.name || 'Doctor',
      id: (user.id || 'DEMO-DOC').replace(/^demo-/, '').toUpperCase().slice(0, 8) || 'DEMO-DOC',
    });
    setLoading(false);
  }, [user?.id, user?.name]);

  const handleStatAction = (id, action) => {
    setStatQueue(prev => prev.filter(item => item.id !== id));
    addToast(`${action} completed for order ${id}. Queue updated.`, 'success');
    addNotification(`Provider Action: ${action} finalized for ${id}`, 'operational', 'low');
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }} className="spin" />;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* PROFESSIONAL HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ padding: '4px 10px', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 800, borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Clinical Workspace
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
              On-Call: St. Mary's General Hospital
            </div>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.6px' }}>Good morning, {doctorInfo.name}</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>Main Campus · Internal Medicine · PRV-{doctorInfo.id}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="search-bar" style={{ width: 280 }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Global Electronic Medical Record Search..." style={{ border: 'none', background: 'none', padding: '10px', width: '100%', fontSize: 13, outline: 'none' }} />
          </div>
        </div>
      </div>

      {/* OPERATIONAL KPI STRIP */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Patient Census', val: '42', sub: '18 Active Encounters', icon: Users, col: 'var(--primary)', bg: 'var(--primary-light)' },
          { label: 'STAT Lab Reviews', val: '3', sub: 'High Priority (O2 Level)', icon: Activity, col: 'var(--danger)', bg: 'var(--danger-light)' },
          { label: 'Unsigned Charts', val: '0', sub: 'All catches complete', icon: CheckCircle, col: 'var(--success)', bg: 'var(--success-light)' },
          { label: 'Shift Remaining', val: '4.5h', sub: 'End of Shift: 07:00 PM', icon: Clock, col: 'var(--accent)', bg: 'var(--accent-light)' },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: k.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} color={k.col} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{k.val}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginTop: 4 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: k.col, fontWeight: 600, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: 24 }}>
        {/* CLINICAL PATIENT WORKLIST */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Active Clinical Census</h2>
              <p className="card-subtitle">Assigned inpatients and new ER admits</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => addToast('Refreshing census data...', 'info')}><RefreshCw size={14} /> Sync EMR</button>
          </div>
          <div className="table-wrap">
            <table className="table table-row-hover">
              <thead>
                <tr>
                  <th>Patient identity</th>
                  <th>Unit / Bed</th>
                  <th>Reason for Admit</th>
                  <th>Status</th>
                  <th>Vitals (BP/HR)</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {CLINICAL_CENSUS.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.id}</div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{p.unit}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.reason}</td>
                    <td>
                      <span className={`badge ${p.status === 'Critical' ? 'badge-danger' : p.status === 'Guarded' ? 'badge-warning' : 'badge-success'} badge-dot`}>{p.status}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{p.v} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>·</span> {p.p} bpm</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('records')}>Chart</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WORKFLOW PANELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* STAT ACTION QUEUE */}
          <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.02)' }}>
            <div className="card-header"><h3 className="card-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={16} /> Action Required (STAT)</h3></div>
            <div className="card-body" style={{ padding: '0 20px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {statQueue.map(item => (
                  <div key={item.id} style={{ padding: 14, background: '#fff', borderRadius: 10, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{item.task}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.patient}</div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: 11 }} onClick={() => handleStatAction(item.id, item.action)}>{item.action} Now</button>
                  </div>
                ))}
                {statQueue.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 12 }}>
                    <CheckCircle size={20} color="var(--success)" style={{ marginBottom: 6, opacity: 0.6 }} />
                    <div>STAT Queue Empty</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CLINICAL ACTIONS */}
          <div className="card">
            <div className="card-header"><h3 className="card-title">Provider Workbench</h3></div>
            <div className="card-body" style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" style={{ justifyContent: 'flex-start', padding: '12px 16px' }} onClick={() => {
                addToast('AI Clinician Agent initialized. Generating note base...', 'info');
                addNotification(`Clinical Note started by Dr. ${doctorInfo.name} for Room 302`, 'clinical', 'low');
              }}>
                <FileText size={16} /> Write Clinical Note (AI)
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px 16px' }} onClick={() => {
                navigate('lab-orders');
                addNotification(`STAT Lab Order placed for Eleanor Walsh (MRN-20041)`, 'operational', 'high');
              }}>
                <FlaskConical size={16} /> Order Diagnostics
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px 16px' }} onClick={() => addToast('Opening E-Prescribe workbench...', 'info')}>
                <Pill size={16} /> Prescribe Medication
              </button>
              <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '12px 16px', color: 'var(--primary)' }} onClick={() => navigate('messages')}>
                <MessageSquare size={16} /> Internal Team Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}