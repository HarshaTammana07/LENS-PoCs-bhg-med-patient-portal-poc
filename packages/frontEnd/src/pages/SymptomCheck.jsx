import React from 'react';
import { HeartPulse } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SymptomTriagePanel from '../components/SymptomTriagePanel';

export default function SymptomCheck() {
  const { addAuditLog } = useApp();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartPulse size={22} color="var(--primary)" strokeWidth={2} />
          </div>
          <div>
            <h1 className="page-header-title">Symptom triage (advisory)</h1>
            <p className="page-header-subtitle">
              Risk-stratified triage (demo): emergency vs moderate vs mild - combination rules escalate when appropriate.
              Not a diagnosis; call emergency services for true emergencies.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="card-header">
          <div className="card-title">Symptom questionnaire</div>
          <div className="card-subtitle">
            Section A - emergency · Section B - moderate · Section C - mild (aligns with routing tiers)
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <SymptomTriagePanel
            auditModule="symptom-check"
            onRunAudit={({ urgency, count }) => {
              addAuditLog({
                action: 'Symptom triage (demo)',
                module: 'symptom-check',
                details: `${count} symptom(s) · urgency ${urgency}`,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
