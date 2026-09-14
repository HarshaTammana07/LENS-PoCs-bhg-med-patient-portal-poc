import React, { useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { SYMPTOM_SECTIONS, evaluateSymptomTriage } from '../lib/symptomTriage';

function tierCheckboxStyle(tier, checked, compact) {
  const border =
    tier === 'red'
      ? 'rgba(207, 46, 46, 0.35)'
      : tier === 'amber'
        ? 'rgba(217, 119, 6, 0.35)'
        : 'rgba(22, 163, 74, 0.25)';
  const bg =
    tier === 'red'
      ? checked
        ? 'rgba(207, 46, 46, 0.12)'
        : 'var(--surface)'
      : tier === 'amber'
        ? checked
          ? 'var(--warning-light)'
          : 'var(--surface)'
        : checked
          ? 'var(--success-light)'
          : 'var(--surface)';
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: compact ? 8 : 12,
    cursor: 'pointer',
    padding: compact ? '8px 10px' : '12px 14px',
    borderRadius: 10,
    border: `1px solid ${checked ? border : 'var(--border)'}`,
    background: bg,
    transition: 'background 0.15s ease',
  };
}

export default function SymptomTriagePanel({
  compact = false,
  showEmergencyBanner = true,
  auditModule = 'symptom-check',
  onRunAudit,
}) {
  const [selected, setSelected] = useState(() => new Set());
  const [result, setResult] = useState(null);

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setResult(null);
  }, []);

  const runGuidance = useCallback(() => {
    const ids = [...selected];
    const out = evaluateSymptomTriage(ids);
    setResult(out);
    if (onRunAudit) {
      onRunAudit({
        module: auditModule,
        urgency: out.urgency,
        count: ids.length,
      });
    }
  }, [onRunAudit, selected]);

  const urgencyColor =
    result?.urgency === 'HIGH'
      ? 'var(--danger)'
      : result?.urgency === 'MEDIUM'
        ? '#d97706'
        : result?.urgency === 'LOW'
          ? 'var(--success)'
          : 'var(--text-muted)';

  const panelBg =
    result?.urgency === 'HIGH'
      ? 'rgba(207, 46, 46, 0.08)'
      : result?.urgency === 'MEDIUM'
        ? 'var(--warning-light)'
        : result?.urgency === 'LOW'
          ? 'var(--success-light)'
          : 'var(--primary-light)';

  const fs = (n) => (compact ? n - 1 : n);

  return (
    <div style={{ width: '100%', textAlign: 'left' }}>
      {showEmergencyBanner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: compact ? '10px 12px' : '14px 16px',
            borderRadius: 12,
            background: 'var(--danger-light)',
            border: '1px solid rgba(207, 46, 46, 0.25)',
            marginBottom: compact ? 12 : 16,
            fontSize: fs(13),
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          <AlertTriangle size={compact ? 16 : 20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ color: 'var(--danger)' }}>Not for emergencies.</strong>{' '}
            If you are experiencing a life-threatening emergency, call emergency services. Demo rules only - not certified
            CDS.
          </div>
        </div>
      )}

      {SYMPTOM_SECTIONS.map((section) => (
        <div key={section.key} style={{ marginBottom: compact ? 14 : 18 }}>
          <div
            style={{
              fontSize: fs(12),
              fontWeight: 800,
              color: section.accent,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 4,
            }}
          >
            {section.title}
          </div>
          <div style={{ fontSize: fs(11), color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.45 }}>
            {section.subtitle}
          </div>
          <div
            style={{
              padding: compact ? 10 : 12,
              borderRadius: 12,
              background: section.bg,
              border: `1px solid var(--border)`,
              display: 'flex',
              flexDirection: 'column',
              gap: compact ? 6 : 8,
            }}
          >
            {section.items.map((opt) => (
              <label key={opt.id} style={tierCheckboxStyle(section.tier, selected.has(opt.id), compact)}>
                <input
                  type="checkbox"
                  checked={selected.has(opt.id)}
                  onChange={() => toggle(opt.id)}
                  style={{
                    marginTop: compact ? 2 : 3,
                    width: compact ? 16 : 18,
                    height: compact ? 16 : 18,
                    accentColor: section.accent,
                  }}
                />
                <span style={{ fontSize: fs(13), fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        className={`btn btn-primary ${compact ? 'btn-sm' : ''}`}
        style={{ width: '100%', marginTop: compact ? 6 : 8 }}
        onClick={runGuidance}
      >
        Get non-clinical guidance
      </button>

      {result && result.urgency !== 'NONE' && (
        <div
          style={{
            marginTop: compact ? 12 : 16,
            padding: compact ? '12px 12px' : '16px 16px',
            borderRadius: 12,
            border:
              result.urgency === 'HIGH'
                ? '1px solid rgba(207, 46, 46, 0.35)'
                : '1px solid var(--border)',
            background: panelBg,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.7,
              color: urgencyColor,
              marginBottom: 8,
              textTransform: 'uppercase',
            }}
          >
            Result (advisory) · Urgency: {result.urgencyLabel}
          </div>
          {result.disposition && (
            <div style={{ fontSize: fs(11), color: 'var(--text-muted)', marginBottom: 8 }}>
              Disposition: <strong style={{ color: 'var(--text-primary)' }}>{result.disposition}</strong>
              {result.patientInstruction ? ` · ${result.patientInstruction}` : ''}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <CheckCircle
              size={compact ? 18 : 22}
              color={
                result.urgency === 'HIGH' ? 'var(--danger)' : result.urgency === 'MEDIUM' ? '#d97706' : 'var(--success)'
              }
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <div style={{ fontSize: fs(14), fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                Recommendation: {result.recommendation} · Suggested: {result.suggestedCare}
              </div>
              <p style={{ fontSize: fs(12.5), color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                {result.body}
              </p>
              <p style={{ fontSize: fs(11.5), color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5 }}>
                {result.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}

      {result && result.urgency === 'NONE' && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 10,
            border: '1px dashed var(--border)',
            fontSize: fs(12),
            color: 'var(--text-muted)',
          }}
        >
          {result.body}
        </div>
      )}
    </div>
  );
}
