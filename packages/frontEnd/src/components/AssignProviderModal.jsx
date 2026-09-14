import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, UserPlus, AlertTriangle, CheckCircle, Clock, Shield, Users, ChevronDown, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PROVIDERS = [
  { id: 'D001', name: 'Dr. Sarah Mitchell', specialty: 'Cardiology', unit: 'Cardiology Unit', status: 'Active', load: 94, patients: 42, initials: 'SM', color: '#1a6dd4' },
  { id: 'D002', name: 'Dr. James Thornton', specialty: 'Orthopedics', unit: 'Surgical Suite', status: 'Active', load: 82, patients: 38, initials: 'JT', color: '#00b5a3' },
  { id: 'D003', name: 'Dr. Olivia Chen', specialty: 'Neurology', unit: 'Neurology Dept', status: 'Active', load: 77, patients: 29, initials: 'OC', color: '#7c3aed' },
  { id: 'D004', name: 'Dr. Marcus Webb', specialty: 'Emergency Medicine', unit: 'Emergency Dept', status: 'Active', load: 98, patients: 51, initials: 'MW', color: '#e84444' },
  { id: 'D005', name: 'Dr. Robert Miller', specialty: 'Oncology', unit: 'Oncology Unit', status: 'Active', load: 89, patients: 34, initials: 'RM', color: '#f59e0b' },
  { id: 'D006', name: 'Dr. David Park', specialty: 'Internal Medicine', unit: 'Inpatient Med-Surg', status: 'On Leave', load: 0, patients: 0, initials: 'DP', color: '#94a3b8' },
  { id: 'D007', name: 'Dr. Angela Ross', specialty: 'Pulmonology', unit: 'Intensive Care Unit', status: 'Active', load: 71, patients: 24, initials: 'AR', color: '#06b6d4' },
  { id: 'D008', name: 'Dr. Kevin Torres', specialty: 'General Surgery', unit: 'Surgical Suite', status: 'Active', load: 64, patients: 19, initials: 'KT', color: '#22c55e' },
];

const PATIENTS = [
  { id: 'MRN-20041', name: 'Eleanor Walsh', unit: 'Cardiology Unit', condition: 'Cardiology Follow-up', insurance: 'BlueCross BCBS' },
  { id: 'MRN-20042', name: 'James Wilson', unit: 'Neurology Dept', condition: 'Neurology', insurance: 'Aetna' },
  { id: 'MRN-20043', name: 'Grace Hoffman', unit: 'Inpatient Med-Surg', condition: 'Post-Op Recovery', insurance: 'UnitedHealthcare' },
  { id: 'MRN-20044', name: 'James Okafor', unit: 'Outpatient Clinic', condition: 'Routine', insurance: 'Cigna' },
  { id: 'MRN-20045', name: 'Patricia Mills', unit: 'Intensive Care Unit', condition: 'ICU Admit', insurance: 'Medicare' },
  { id: 'MRN-20046', name: 'David Nguyen', unit: 'Surgical Suite', condition: 'Orthopedics', insurance: 'Medicaid' },
  { id: 'MRN-20047', name: 'Linda Crawford', unit: 'Outpatient Clinic', condition: 'New Encounter', insurance: 'BlueCross BCBS' },
];

const SPECIALTIES = ['All Specialties', 'Cardiology', 'Orthopedics', 'Neurology', 'Emergency Medicine', 'Oncology', 'Internal Medicine', 'Pulmonology', 'General Surgery'];
const REASONS = ['Patient Admission', 'Emergency Allocation', 'Shift Coverage', 'Specialist Consult', 'Procedure Assignment', 'Care Transfer', 'Follow-up Visit', 'Lab / Diagnostic Order'];
const PRIORITIES = ['Standard', 'Urgent', 'Emergency'];

const s = {
  overlay: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' },
  modal: { background: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 920, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' },
  body: { flex: 1, overflowY: 'auto', padding: '24px 28px' },
  footer: { padding: '20px 28px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 12, background: '#ffffff' },
  label: { fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' },
  select: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  input: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  patientCard: { padding: '16px', borderRadius: 10, border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14, background: '#ffffff' },
  provCard: { padding: '16px', borderRadius: 10, border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14, background: '#ffffff' },
  badge: (color, bg) => ({ display: 'inline-flex', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, color, background: bg }),
  btn: (primary, disabled) => ({ padding: '11px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer', background: primary ? '#1a6dd4' : '#ffffff', color: primary ? '#fff' : '#475569', border: primary ? 'none' : '1px solid #cbd5e1', opacity: disabled ? 0.5 : 1, transition: 'all 0.2s' }),
  warn: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 10, background: '#fffbeb', border: '1px solid #fbbf24', marginTop: 16 },
};

export default function AssignProviderModal() {
  const { showAssignModal, setShowAssignModal, addProviderAssignment, addAuditLog, addToast, addNotification, providerAssignments } = useApp();

  const [step, setStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [specialty, setSpecialty] = useState('All Specialties');
  const [providerSearch, setProviderSearch] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('Standard');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [overrideWarning, setOverrideWarning] = useState(false);
  const [saving, setSaving] = useState(false);

  // ESC key handling and body scroll prevention
  useEffect(() => {
    if (showAssignModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showAssignModal) {
        close();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('modal-open');
    };
  }, [showAssignModal]);

  const reset = () => {
    setStep(1); setSelectedPatient(null); setSelectedProvider(null);
    setSpecialty('All Specialties'); setProviderSearch(''); setReason('');
    setPriority('Standard'); setStartDate(''); setNotes(''); setOverrideWarning(false); setSaving(false);
  };

  const close = () => { setShowAssignModal(false); setTimeout(reset, 300); };

  const filteredProviders = useMemo(() => {
    return PROVIDERS.filter(p => {
      if (specialty !== 'All Specialties' && p.specialty !== specialty) return false;
      if (providerSearch && !p.name.toLowerCase().includes(providerSearch.toLowerCase()) && !p.specialty.toLowerCase().includes(providerSearch.toLowerCase())) return false;
      return true;
    });
  }, [specialty, providerSearch]);

  const hasWarning = selectedProvider && (selectedProvider.status === 'On Leave' || selectedProvider.load >= 90);

  const canSubmit = selectedPatient && selectedProvider && reason && (!hasWarning || overrideWarning);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSaving(true);
    setTimeout(() => {
      addProviderAssignment({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        unit: selectedProvider.unit,
        reason,
        priority,
      });
      addAuditLog({
        action: 'Provider Assignment',
        user: 'Justin Coran',
        role: 'admin',
        ip: '192.168.1.42',
        module: 'Assignments',
        details: `Assigned ${selectedProvider.name} to patient ${selectedPatient.name} (${reason}) - Priority: ${priority}`,
      });
      addNotification(`Provider assigned: ${selectedProvider.name} → ${selectedPatient.name}`, 'operational', priority === 'Emergency' ? 'high' : 'medium');
      addToast(`${selectedProvider.name} assigned to ${selectedPatient.name}`, 'success');
      close();
    }, 800);
  };

  if (!showAssignModal) return null;

  return (
    <div style={s.overlay} onClick={close}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Assign Provider</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Step {step} of 3 - {step === 1 ? 'Select Patient' : step === 2 ? 'Select Provider' : 'Confirm Assignment'}</div>
            </div>
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={20} /></button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 4, padding: '0 24px', paddingTop: 16 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Body */}
        <div style={s.body}>

          {/* STEP 1: Patient Selection */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>Select Patient</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PATIENTS.filter(p => p.status !== 'Discharged').map(p => {
                  const isSelected = selectedPatient?.id === p.id;
                  const existingAssignment = providerAssignments.find(a => a.patientId === p.id && a.status === 'Active');
                  return (
                    <div key={p.id} onClick={() => setSelectedPatient(p)}
                      style={{ 
                        ...s.patientCard, 
                        borderLeft: isSelected ? '4px solid #1a6dd4' : '4px solid transparent',
                        background: isSelected ? '#f0f7ff' : '#ffffff',
                        boxShadow: isSelected ? '0 2px 8px rgba(26,109,212,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                      }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: isSelected ? '#1a6dd4' : '#f1f5f9', color: isSelected ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                        {p.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{p.condition} - {p.unit}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{p.id}</div>
                        {existingAssignment && (
                          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, marginTop: 4 }}>Currently assigned to {existingAssignment.providerName}</div>
                        )}
                      </div>
                      <span style={{ ...s.badge(p.insurance === 'Medicare' || p.insurance === 'Medicaid' ? '#059669' : '#1a6dd4', p.insurance === 'Medicare' || p.insurance === 'Medicaid' ? '#d1fae5' : '#dbeafe'), flexShrink: 0 }}>
                        {p.insurance}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Provider Selection */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Select Provider for <span style={{ color: 'var(--primary)' }}>{selectedPatient?.name}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Condition: {selectedPatient?.condition} | Unit: {selectedPatient?.unit}</div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-muted)' }} />
                  <input placeholder="Search providers..." value={providerSearch} onChange={e => setProviderSearch(e.target.value)}
                    style={{ ...s.input, paddingLeft: 32 }} />
                </div>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ ...s.select, width: 200 }}>
                  {SPECIALTIES.map(sp => <option key={sp}>{sp}</option>)}
                </select>
              </div>

              {/* Provider Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredProviders.map(p => {
                  const isSelected = selectedProvider?.id === p.id;
                  const overloaded = p.load >= 90;
                  const onLeave = p.status === 'On Leave';
                  return (
                    <div key={p.id} onClick={() => { setSelectedProvider(p); setOverrideWarning(false); }}
                      style={{ 
                        ...s.provCard, 
                        borderLeft: isSelected ? '4px solid #1a6dd4' : '4px solid transparent',
                        background: isSelected ? '#f0f7ff' : onLeave ? '#f8fafc' : '#ffffff', 
                        opacity: onLeave ? 0.6 : 1,
                        boxShadow: isSelected ? '0 2px 8px rgba(26,109,212,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                      }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: p.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {p.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>
                          {p.name}
                          {onLeave && <span style={{ ...s.badge('#64748b', '#e2e8f0'), marginLeft: 8 }}>On Leave</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{p.specialty} - {p.unit}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: overloaded ? '#ef4444' : p.load >= 75 ? '#f59e0b' : '#10b981' }}>{p.load}%</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.patients} patients</div>
                      </div>
                      {/* Load bar */}
                      <div style={{ width: 70, height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{ width: `${p.load}%`, height: '100%', borderRadius: 3, background: overloaded ? '#ef4444' : p.load >= 75 ? '#f59e0b' : '#10b981', transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  );
                })}
                {filteredProviders.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 14 }}>No providers match the current filter criteria.</div>
                )}
              </div>

              {/* Warning for overloaded / on leave */}
              {hasWarning && (
                <div style={s.warn}>
                  <AlertTriangle size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning)' }}>
                      {selectedProvider.status === 'On Leave' ? 'Provider is currently on leave' : `Provider workload is at ${selectedProvider.load}% (overloaded)`}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      Assigning may impact care quality. Check the override box to proceed.
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={overrideWarning} onChange={e => setOverrideWarning(e.target.checked)} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Override - I acknowledge the risk</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Assignment Details & Confirmation */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Assignment Details</div>

              {/* Summary card */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '14px 16px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Patient</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedPatient?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{selectedPatient?.id} - {selectedPatient?.condition}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Provider</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedProvider?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{selectedProvider?.specialty} - {selectedProvider?.unit}</div>
                </div>
              </div>

              <div style={s.grid2}>
                <div>
                  <label style={s.label}>Reason for Assignment *</label>
                  <select value={reason} onChange={e => setReason(e.target.value)} style={s.select}>
                    <option value="">Select reason...</option>
                    {REASONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Priority Level</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} style={s.select}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Start Date / Time</label>
                  <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} style={s.input} />
                </div>
                <div>
                  <label style={s.label}>Department / Unit</label>
                  <input value={selectedProvider?.unit || ''} readOnly style={{ ...s.input, opacity: 0.7 }} />
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label style={s.label}>Notes (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional context for this assignment..." style={s.textarea} />
              </div>

              {overrideWarning && (
                <div style={{ ...s.warn, marginTop: 14, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
                  <Shield size={14} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>
                    Admin override active - This assignment bypasses workload / availability checks.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={s.footer}>
          {step > 1 && <button onClick={() => setStep(step - 1)} style={s.btn(false, false)}>Back</button>}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !selectedPatient : !selectedProvider || (hasWarning && !overrideWarning)}
              style={s.btn(true, step === 1 ? !selectedPatient : !selectedProvider || (hasWarning && !overrideWarning))}>
              Continue
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canSubmit || saving}
              style={s.btn(true, !canSubmit || saving)}>
              {saving ? (
                <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Saving...</>
              ) : (
                <><CheckCircle size={14} /> Confirm Assignment</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
