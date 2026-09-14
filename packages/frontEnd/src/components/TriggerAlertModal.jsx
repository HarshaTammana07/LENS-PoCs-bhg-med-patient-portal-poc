import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Bell, CheckCircle, Shield, Users, Database, CreditCard, Clock, Zap, Activity, FlaskConical, ShieldAlert, Server, KeyRound, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ALERT_TYPES = [
  { value: 'Staffing Shortage', icon: Users, color: 'var(--purple)' },
  { value: 'Provider Overload', icon: Activity, color: 'var(--danger)' },
  { value: 'Patient Load Spike', icon: Zap, color: 'var(--warning)' },
  { value: 'Lab Delay', icon: FlaskConical, color: 'var(--accent)' },
  { value: 'Billing Issue', icon: CreditCard, color: 'var(--warning)' },
  { value: 'Integration Failure', icon: Database, color: 'var(--danger)' },
  { value: 'Compliance Risk', icon: ShieldAlert, color: 'var(--primary)' },
  { value: 'System Outage', icon: Server, color: 'var(--danger)' },
  { value: 'Credential Expiry', icon: KeyRound, color: 'var(--warning)' },
  { value: 'Critical Inventory Shortage', icon: Package, color: 'var(--accent)' },
];

const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const TARGETS = ['All Staff', 'Nursing Leadership', 'ER Operations', 'IT Operations', 'Revenue Cycle', 'Medical Staff Office', 'Department Heads', 'CMO', 'CFO', 'Pharmacy'];
const MODULES = ['Operations', 'Staffing', 'Billing', 'Integrations', 'Compliance', 'Clinical', 'Pharmacy', 'Laboratory'];
const ESCALATIONS = ['None', 'Department Head', 'Director', 'CMO', 'CFO', 'CEO', 'IT Director'];

const s = {
  overlay: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' },
  modal: { background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 760, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' },
  body: { flex: 1, overflowY: 'auto', padding: '24px 28px' },
  footer: { padding: '20px 28px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#ffffff' },
  label: { fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' },
  select: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 100, boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  btn: (primary, disabled) => ({ padding: '11px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', background: primary ? '#ef4444' : '#ffffff', color: primary ? '#fff' : '#475569', border: primary ? 'none' : '1px solid #cbd5e1', opacity: disabled ? 0.5 : 1, transition: 'all 0.2s' }),
  alertTypeBtn: (selected, color) => ({ 
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', 
    border: selected ? `2px solid ${color}` : '1px solid #e2e8f0', 
    background: selected ? `${color}15` : '#ffffff', 
    color: selected ? color : '#64748b', 
    transition: 'all 0.2s',
    boxShadow: selected ? `0 2px 8px ${color}20` : 'none'
  }),
  sevBadge: (sev, selected) => {
    const m = { critical: { c: '#ef4444', bg: '#fee2e2' }, high: { c: '#f59e0b', bg: '#fef3c7' }, medium: { c: '#1a6dd4', bg: '#dbeafe' }, low: { c: '#10b981', bg: '#d1fae5' } };
    const v = m[sev] || m.medium;
    return { 
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, 
      color: selected ? '#ffffff' : v.c, 
      background: selected ? v.c : v.bg, 
      cursor: 'pointer', 
      border: selected ? '2px solid transparent' : `2px solid ${v.bg}`, 
      transition: 'all 0.2s',
      textTransform: 'capitalize'
    };
  },
};

export default function TriggerAlertModal() {
  const { showAlertModal, setShowAlertModal, addAdminAlert, addAuditLog, addToast, addNotification } = useApp();

  const [alertType, setAlertType] = useState('');
  const [severity, setSeverity] = useState('high');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [module, setModule] = useState('');
  const [escalation, setEscalation] = useState('None');
  const [saving, setSaving] = useState(false);

  // ESC key handling and body scroll prevention
  useEffect(() => {
    if (showAlertModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showAlertModal) {
        close();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('modal-open');
    };
  }, [showAlertModal]);

  const reset = () => {
    setAlertType(''); setSeverity('high'); setTitle(''); setDescription('');
    setTarget(''); setModule(''); setEscalation('None'); setSaving(false);
  };

  const close = () => { setShowAlertModal(false); setTimeout(reset, 300); };

  const canSubmit = alertType && title.trim() && description.trim() && target && module;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSaving(true);
    setTimeout(() => {
      addAdminAlert({
        type: alertType,
        severity,
        title: title.trim(),
        description: description.trim(),
        target,
        module,
        escalation,
        createdBy: 'Justin Coran',
      });
      addAuditLog({
        action: 'Alert Triggered',
        user: 'Justin Coran',
        role: 'admin',
        ip: '192.168.1.42',
        module: 'Alerts',
        details: `${severity.toUpperCase()} alert: "${title}" - Type: ${alertType}, Target: ${target}`,
      });
      const sevLabel = severity === 'critical' ? 'CRITICAL' : severity === 'high' ? 'HIGH' : severity.toUpperCase();
      addNotification(`[${sevLabel}] ${title}`, 'operational', severity === 'critical' || severity === 'high' ? 'high' : 'medium');
      addToast(`Alert triggered: ${title}`, severity === 'critical' ? 'danger' : 'warning');
      close();
    }, 700);
  };

  // Auto-fill title templates on type selection
  const handleTypeSelect = (type) => {
    setAlertType(type);
    const templates = {
      'Staffing Shortage': 'staffing shortage',
      'Provider Overload': 'provider workload critical',
      'Patient Load Spike': 'patient census exceeding capacity',
      'Lab Delay': 'laboratory results delayed',
      'Billing Issue': 'billing / claims issue detected',
      'Integration Failure': 'system integration failure',
      'Compliance Risk': 'compliance risk identified',
      'System Outage': 'system outage detected',
      'Credential Expiry': 'provider credentials expiring',
      'Critical Inventory Shortage': 'critical supply shortage',
    };
    if (!title.trim()) setTitle(templates[type] ? type + ' - ' : '');
  };

  if (!showAlertModal) return null;

  return (
    <div style={s.overlay} onClick={close}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} color="var(--danger)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Trigger Alert</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Create an operational alert for immediate visibility</div>
            </div>
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
        </div>

        {/* Body */}
        <div style={s.body}>
          {/* Alert Type Selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={s.label}>Alert Type *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {ALERT_TYPES.map(({ value, icon: Icon, color }) => {
                const isSelected = alertType === value;
                return (
                  <div key={value} onClick={() => handleTypeSelect(value)}
                    style={s.alertTypeBtn(isSelected, color)}>
                    <Icon size={16} />
                    <span style={{ flex: 1 }}>{value}</span>
                    {isSelected && <CheckCircle size={14} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div style={{ marginBottom: 24 }}>
            <label style={s.label}>Severity Level *</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {SEVERITIES.map(sev => (
                <div key={sev} onClick={() => setSeverity(sev)}
                  style={s.sevBadge(sev, severity === sev)}>
                  {sev}
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Alert Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., ICU Night Shift - 3 RN positions unfilled" style={s.input} />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the situation, impact, and any recommended actions..." style={s.textarea} />
          </div>

          {/* Grid fields */}
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Target Audience *</label>
              <select value={target} onChange={e => setTarget(e.target.value)} style={s.select}>
                <option value="">Select target...</option>
                {TARGETS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Related Module *</label>
              <select value={module} onChange={e => setModule(e.target.value)} style={s.select}>
                <option value="">Select module...</option>
                {MODULES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={s.label}>Escalation</label>
              <select value={escalation} onChange={e => setEscalation(e.target.value)} style={s.select}>
                {ESCALATIONS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Preview */}
          {alertType && title.trim() && (
            <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Alert Preview</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={s.sevBadge(severity)}>{severity}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{description || 'No description provided'}</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>
                <span>Type: {alertType}</span>
                {target && <span>Target: {target}</span>}
                {module && <span>Module: {module}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <button onClick={close} style={s.btn(false, false)}>Cancel</button>
          <button onClick={handleSubmit} disabled={!canSubmit || saving}
            style={s.btn(true, !canSubmit || saving)}>
            {saving ? (
              <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Sending...</>
            ) : (
              <><Bell size={14} /> Trigger Alert</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
