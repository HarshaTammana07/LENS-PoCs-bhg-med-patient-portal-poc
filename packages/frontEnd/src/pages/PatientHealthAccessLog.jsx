import React, { useMemo, useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPortalSlice } from '../lib/portalData';
import { generatePatientAccessLogSummary } from '../lib/aiDemo';

export default function PatientHealthAccessLog() {
  const { portalData } = useApp();
  const patientRecordAccessLog =
    portalData?.patientRecordAccessLog || getPortalSlice('patientRecordAccessLog');
  const [bannerOpen, setBannerOpen] = useState(true);
  const aiSummary = useMemo(() => generatePatientAccessLogSummary(patientRecordAccessLog), [patientRecordAccessLog]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Health access log</h1>
          <p className="page-header-subtitle">
            Track Personal Health Record and visit summary activity on this portal (demo data).
          </p>
        </div>
      </div>

      {bannerOpen ? (
        <div
          style={{
            marginBottom: 18,
            padding: '14px 16px',
            borderRadius: 12,
            border: '1px solid rgba(236, 72, 153, 0.35)',
            background: 'rgba(253, 242, 248, 0.85)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Notice:</strong> This log reflects activity in the Medical
              Concepts demo portal only. Other systems may maintain separate access records.
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ flexShrink: 0 }}
              onClick={() => setBannerOpen(false)}
              aria-label="Dismiss notice"
            >
              <ChevronUp size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: 18 }}
          onClick={() => setBannerOpen(true)}
        >
          <ChevronDown size={14} /> Show notice
        </button>
      )}

      <div
        className="card"
        style={{
          marginBottom: 22,
          border: '1px solid rgba(149, 92, 225, 0.22)',
          background: 'linear-gradient(145deg, var(--primary-light) 0%, var(--surface) 52%, var(--surface) 100%)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="card-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
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
              <div className="card-title">AI summary</div>
              <div className="card-subtitle">Patterns in who opened your documents (demo)</div>
            </div>
          </div>
          {aiSummary.confidence > 0 && (
            <span className="badge badge-muted" style={{ marginLeft: 'auto' }}>
              Confidence {aiSummary.confidence}%
            </span>
          )}
        </div>
        <div className="card-body" style={{ paddingTop: 0 }}>
          <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{aiSummary.text}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14, marginBottom: 0, lineHeight: 1.55 }}>
            {aiSummary.disclaimer}
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-light)', fontSize: 13, fontWeight: 700 }}>
          Recent activity
        </div>
        {patientRecordAccessLog.map((row, i) => (
          <div
            key={row.id}
            style={{
              padding: '16px 18px',
              borderBottom: i < patientRecordAccessLog.length - 1 ? '1px solid var(--border-light)' : 'none',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: 0.02 }}>
                Accessed by: {row.accessedBy}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Type: <strong style={{ color: 'var(--text-secondary)' }}>{row.action}</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                On (server time): {row.time}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Status: {row.status}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 10 }}>
                Document: <span style={{ fontWeight: 600 }}>{row.document}</span>
              </div>
            </div>
            <div style={{ color: 'var(--text-muted)', flexShrink: 0 }} title={row.channel === 'mobile' ? 'Mobile' : 'Web'}>
              {row.channel === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
