import React, { useState, useMemo } from 'react';
import {
  FileText, Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle,
  Shield, ChevronDown, ChevronRight, Activity, Bell, Users, Settings,
  Database, CreditCard, RefreshCw, Download, Eye, Brain,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateAuditTrailSummary } from '../lib/aiDemo';

const ACTION_TYPES = ['All Actions', 'Admin Login', 'Failed Login Attempt', 'Provider Assignment', 'Alert Triggered', 'Patient Record Export', 'Provider Profile Updated', 'Settings Configuration Saved', 'Integration Force Sync', 'Billing Report Generated', 'Claim Batch Review', 'Alert Status Change'];
const ROLES = ['All Roles', 'admin', 'doctor', 'staff', '--'];
const MODULES_LIST = ['All Modules', 'Authentication', 'Assignments', 'Alerts', 'Records', 'Providers', 'Settings', 'Integrations', 'Billing', 'Compliance'];
const OUTCOMES = ['All Outcomes', 'Success', 'Failed'];

const moduleIcon = (mod) => {
  const m = { Authentication: Shield, Assignments: Users, Alerts: Bell, Records: FileText, Providers: Users, Settings: Settings, Integrations: Database, Billing: CreditCard, Compliance: Shield };
  return m[mod] || Activity;
};

const outcomeStyle = (outcome) => {
  if (outcome === 'Success') return { color: 'var(--success)', bg: 'var(--success-light)', icon: CheckCircle };
  if (outcome === 'Failed') return { color: 'var(--danger)', bg: 'rgba(239,68,68,0.1)', icon: XCircle };
  return { color: 'var(--text-muted)', bg: 'var(--bg)', icon: Clock };
};

const s = {
  page: { padding: '24px 28px', maxWidth: 1400, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  card: { background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' },
  filterBar: { display: 'flex', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', alignItems: 'center' },
  select: { padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 12, outline: 'none' },
  input: { padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)', fontSize: 12, outline: 'none', minWidth: 200 },
  th: { padding: '10px 14px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--bg)' },
  td: { padding: '12px 14px', fontSize: 12, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' },
  badge: (color, bg) => ({ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, color, background: bg }),
  stat: { padding: '16px 20px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', textAlign: 'center' },
};

export default function AuditActivity() {
  const { auditLogs, adminAlerts, providerAssignments, updateAlertStatus, addAuditLog, addToast } = useApp();

  const [tab, setTab] = useState('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All Actions');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [filterModule, setFilterModule] = useState('All Modules');
  const [filterOutcome, setFilterOutcome] = useState('All Outcomes');
  const [expandedRow, setExpandedRow] = useState(null);
  const [alertFilter, setAlertFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (filterAction !== 'All Actions' && log.action !== filterAction) return false;
      if (filterRole !== 'All Roles' && log.role !== filterRole) return false;
      if (filterModule !== 'All Modules' && log.module !== filterModule) return false;
      if (filterOutcome !== 'All Outcomes' && log.outcome !== filterOutcome) return false;
      if (searchTerm && !log.user.toLowerCase().includes(searchTerm.toLowerCase()) && !log.action.toLowerCase().includes(searchTerm.toLowerCase()) && !log.details?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [auditLogs, filterAction, filterRole, filterModule, filterOutcome, searchTerm]);

  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'all') return adminAlerts;
    return adminAlerts.filter(a => a.status.toLowerCase().replace(' ', '-') === alertFilter);
  }, [adminAlerts, alertFilter]);

  const handleAlertAction = (alertId, newStatus) => {
    updateAlertStatus(alertId, newStatus);
    addAuditLog({
      action: 'Alert Status Change',
      user: 'Justin Coran',
      role: 'admin',
      ip: '192.168.1.42',
      module: 'Alerts',
      details: `Alert ${alertId} status changed to ${newStatus}`,
    });
    addToast(`Alert ${newStatus.toLowerCase()}`, 'success');
  };

  const logStats = useMemo(() => ({
    total: auditLogs.length,
    success: auditLogs.filter(l => l.outcome === 'Success').length,
    failed: auditLogs.filter(l => l.outcome === 'Failed').length,
    today: auditLogs.filter(l => l.time.includes('Apr 22')).length,
  }), [auditLogs]);

  const auditAiSummary = useMemo(() => generateAuditTrailSummary(auditLogs), [auditLogs]);

  const alertStats = useMemo(() => ({
    total: adminAlerts.length,
    open: adminAlerts.filter(a => a.status === 'Open').length,
    inProgress: adminAlerts.filter(a => a.status === 'In Progress').length,
    critical: adminAlerts.filter(a => a.severity === 'critical').length,
  }), [adminAlerts]);

  const sevBadge = (sev) => {
    const m = { critical: { c: '#ef4444', bg: 'rgba(239,68,68,0.12)' }, high: { c: '#f59e0b', bg: 'rgba(245,158,11,0.12)' }, medium: { c: 'var(--primary)', bg: 'var(--primary-light)' }, low: { c: 'var(--success)', bg: 'var(--success-light)' } };
    const v = m[sev] || m.medium;
    return s.badge(v.c, v.bg);
  };

  const statusBadge = (status) => {
    const m = { 'Open': { c: '#f59e0b', bg: 'rgba(245,158,11,0.12)' }, 'In Progress': { c: 'var(--primary)', bg: 'var(--primary-light)' }, 'Resolved': { c: 'var(--success)', bg: 'var(--success-light)' }, 'Escalated': { c: '#ef4444', bg: 'rgba(239,68,68,0.12)' } };
    const v = m[status] || m['Open'];
    return s.badge(v.c, v.bg);
  };

  return (
    <div style={s.page}>
      {/* Page Header */}
      <div style={s.header}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={22} color="var(--primary)" /> Audit & Activity Center
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Complete operational traceability - HIPAA-compliant activity tracking</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { id: 'audit', label: 'Audit Trail', icon: FileText, count: auditLogs.length },
          { id: 'alerts', label: 'Alert Center', icon: Bell, count: adminAlerts.filter(a => a.status === 'Open').length },
          { id: 'assignments', label: 'Assignments', icon: Users, count: providerAssignments.filter(a => a.status === 'Active').length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: tab === t.id ? 'var(--card-bg)' : 'transparent', color: tab === t.id ? 'var(--primary)' : 'var(--text-muted)', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            <t.icon size={14} />
            {t.label}
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 6, background: tab === t.id ? 'var(--primary-light)' : 'var(--bg)', color: tab === t.id ? 'var(--primary)' : 'var(--text-muted)' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ─── AUDIT TRAIL TAB ─── */}
      {tab === 'audit' && (
        <>
          <div
            style={{
              ...s.card,
              marginBottom: 20,
              border: '1px solid rgba(149, 92, 225, 0.22)',
              background: 'linear-gradient(145deg, var(--primary-light) 0%, var(--card-bg) 55%, var(--card-bg) 100%)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: 'rgba(149, 92, 225, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Brain size={22} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>AI summary</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Narrative over the visible audit trail (demo)</div>
                </div>
              </div>
              {auditAiSummary.confidence > 0 && (
                <span style={{ ...s.badge('var(--text-muted)', 'var(--bg)'), marginLeft: 'auto' }}>Confidence {auditAiSummary.confidence}%</span>
              )}
            </div>
            <div style={{ padding: '12px 20px 18px', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {auditAiSummary.text}
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 12, marginBottom: 0, lineHeight: 1.55 }}>
                {auditAiSummary.disclaimer}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Events', value: logStats.total, color: 'var(--primary)', icon: Activity },
              { label: 'Successful', value: logStats.success, color: 'var(--success)', icon: CheckCircle },
              { label: 'Failed', value: logStats.failed, color: 'var(--danger)', icon: XCircle },
              { label: 'Today', value: logStats.today, color: 'var(--accent)', icon: Clock },
            ].map(st => (
              <div key={st.label} style={s.stat}>
                <st.icon size={18} color={st.color} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 22, fontWeight: 800, color: st.color }}>{st.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{st.label}</div>
              </div>
            ))}
          </div>

          <div style={s.card}>
            {/* Filters */}
            <div style={s.filterBar}>
              <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
                <input placeholder="Search by user, action, or details..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...s.input, paddingLeft: 30, width: '100%' }} />
              </div>
              <select value={filterAction} onChange={e => setFilterAction(e.target.value)} style={s.select}>
                {ACTION_TYPES.map(a => <option key={a}>{a}</option>)}
              </select>
               <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={s.select}>
                {ROLES.map(r => <option key={r}>{r === '--' ? '-- (Unknown)' : r}</option>)}
              </select>
              <select value={filterModule} onChange={e => setFilterModule(e.target.value)} style={s.select}>
                {MODULES_LIST.map(m => <option key={m}>{m}</option>)}
              </select>
              <select value={filterOutcome} onChange={e => setFilterOutcome(e.target.value)} style={s.select}>
                {OUTCOMES.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Action</th>
                    <th style={s.th}>User</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Module</th>
                    <th style={s.th}>IP Address</th>
                    <th style={s.th}>Timestamp</th>
                    <th style={s.th}>Outcome</th>
                    <th style={s.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => {
                    const os = outcomeStyle(log.outcome);
                    const ModIcon = moduleIcon(log.module);
                    const isExpanded = expandedRow === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                          onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ ...s.td, fontWeight: 600, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.id}</td>
                          <td style={s.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <ModIcon size={13} color="var(--text-muted)" />
                              <span style={{ fontWeight: 600 }}>{log.action}</span>
                            </div>
                          </td>
                          <td style={{ ...s.td, fontWeight: 500 }}>{log.user}</td>
                          <td style={s.td}><span style={s.badge('var(--text-secondary)', 'var(--bg)')}>{log.role}</span></td>
                          <td style={s.td}><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{log.module}</span></td>
                          <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{log.ip || ' - '}</td>
                          <td style={{ ...s.td, fontSize: 11, color: 'var(--text-muted)' }}>{log.time}</td>
                          <td style={s.td}><span style={s.badge(os.color, os.bg)}><os.icon size={10} />{log.outcome}</span></td>
                          <td style={{ ...s.td, textAlign: 'center' }}>
                            {isExpanded ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td colSpan={9} style={{ padding: '12px 20px 16px 46px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Details</div>
                              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{log.details || 'No additional details available.'}</div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {filteredLogs.length === 0 && (
                    <tr><td colSpan={9} style={{ ...s.td, textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No audit records match the current filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div style={{ padding: '10px 20px', fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
              Showing {filteredLogs.length} of {auditLogs.length} records
            </div>
          </div>
        </>
      )}

      {/* ─── ALERT CENTER TAB ─── */}
      {tab === 'alerts' && (
        <>
          {/* Alert Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Alerts', value: alertStats.total, color: 'var(--primary)' },
              { label: 'Open', value: alertStats.open, color: 'var(--warning)' },
              { label: 'In Progress', value: alertStats.inProgress, color: 'var(--primary)' },
              { label: 'Critical', value: alertStats.critical, color: 'var(--danger)' },
            ].map(st => (
              <div key={st.label} style={s.stat}>
                <div style={{ fontSize: 22, fontWeight: 800, color: st.color }}>{st.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{st.label}</div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {['all', 'open', 'in-progress', 'resolved', 'escalated'].map(f => (
              <button key={f} onClick={() => setAlertFilter(f)}
                style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: alertFilter === f ? 'var(--primary)' : 'var(--card-bg)', color: alertFilter === f ? '#fff' : 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Alert Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredAlerts.map(alert => (
              <div key={alert.id} style={{ ...s.card, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={sevBadge(alert.severity)}>{alert.severity}</span>
                    <span style={statusBadge(alert.status)}>{alert.status}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{alert.id}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.createdAt}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{alert.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>{alert.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>Type: <strong style={{ color: 'var(--text-secondary)' }}>{alert.type}</strong></span>
                    <span>Target: <strong style={{ color: 'var(--text-secondary)' }}>{alert.target}</strong></span>
                    <span>Module: <strong style={{ color: 'var(--text-secondary)' }}>{alert.module}</strong></span>
                    <span>By: <strong style={{ color: 'var(--text-secondary)' }}>{alert.createdBy}</strong></span>
                  </div>
                  {/* Response Management removed as requested */}
                </div>
              </div>
            ))}
            {filteredAlerts.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>No alerts match the current filter.</div>
            )}
          </div>
        </>
      )}

      {/* ─── ASSIGNMENTS TAB ─── */}
      {tab === 'assignments' && (
        <>
          <div style={s.card}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              Provider Assignments ({providerAssignments.length})
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Patient</th>
                    <th style={s.th}>Provider</th>
                    <th style={s.th}>Unit</th>
                    <th style={s.th}>Reason</th>
                    <th style={s.th}>Priority</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {providerAssignments.map(a => (
                    <tr key={a.id}>
                      <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{a.id}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>
                        {a.patientName}
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>{a.patientId}</div>
                      </td>
                      <td style={{ ...s.td, fontWeight: 600, color: 'var(--primary)' }}>{a.providerName}</td>
                      <td style={{ ...s.td, fontSize: 11 }}>{a.unit}</td>
                      <td style={{ ...s.td, fontSize: 11 }}>{a.reason}</td>
                      <td style={s.td}>
                        <span style={s.badge(
                          a.priority === 'Emergency' ? '#ef4444' : a.priority === 'Urgent' ? '#f59e0b' : 'var(--success)',
                          a.priority === 'Emergency' ? 'rgba(239,68,68,0.12)' : a.priority === 'Urgent' ? 'rgba(245,158,11,0.12)' : 'var(--success-light)'
                        )}>{a.priority}</span>
                      </td>
                      <td style={{ ...s.td, fontSize: 11, color: 'var(--text-muted)' }}>{a.date}</td>
                      <td style={s.td}><span style={s.badge('var(--success)', 'var(--success-light)')}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
