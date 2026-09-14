import React, { useMemo } from 'react';
import { Activity, Droplets, Brain, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPortalSlice } from '../lib/portalData';
import { generateTrackerSummary } from '../lib/aiDemo';

function SimpleBarChart({ data, valueKey, color, unit }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, paddingTop: 8 }}>
      {data.map((d) => {
        const h = Math.round((d[valueKey] / max) * 120);
        return (
          <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: '100%',
                maxWidth: 48,
                height: h,
                minHeight: 8,
                background: color,
                borderRadius: '8px 8px 4px 4px',
                opacity: 0.9,
              }}
              title={`${d.label}: ${d[valueKey]}${unit || ''}`}
            />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DualLineBpChart({ data }) {
  const maxS = Math.max(...data.map((d) => d.systolic));
  const minD = Math.min(...data.map((d) => d.diastolic));
  const pad = 20;
  const w = 320;
  const h = 120;
  const ptsS = data.map((d, i) => {
    const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2);
    const y = h - pad - ((d.systolic - minD) / (maxS - minD + 1)) * (h - pad * 2);
    return `${x},${y}`;
  });
  const ptsD = data.map((d, i) => {
    const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2);
    const y = h - pad - ((d.diastolic - minD) / (maxS - minD + 1)) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', maxWidth: 420, height: 'auto' }}>
      <polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points={ptsS.join(' ')} />
      <polyline fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="6 4" points={ptsD.join(' ')} />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1 || 1)) * (w - pad * 2);
        return (
          <text key={d.label} x={x} y={h - 4} fontSize="10" fill="var(--text-muted)" textAnchor="middle">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function Trackers() {
  const { userRole, navigate, portalData } = useApp();
  const trackerBloodPressure = portalData?.trackerBloodPressure || getPortalSlice('trackerBloodPressure');
  const trackerGlucose = portalData?.trackerGlucose || getPortalSlice('trackerGlucose');
  const healthHubProblems = portalData?.healthHubProblems || getPortalSlice('healthHubProblems');
  const aiSummary = useMemo(
    () => generateTrackerSummary(trackerBloodPressure, trackerGlucose, healthHubProblems),
    [trackerBloodPressure, trackerGlucose, healthHubProblems]
  );

  // For patient (ASC) role, trackers are not applicable
  if (!userRole || userRole === 'patient') {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-header-title">Trackers</h1>
            <p className="page-header-subtitle">Health trend tracking</p>
          </div>
        </div>
        <div
          className="card"
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            maxWidth: 540,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Activity size={24} color="var(--text-muted)" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
            Health trackers are not available for your current care plan
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 24 }}>
            Health trackers are not part of your surgical care plan at Ottawa ASC.
            If you have questions about your health monitoring, contact your Care Concierge.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('messages')}
          >
            <MessageSquare size={14} /> Contact your Care Concierge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Trackers</h1>
          <p className="page-header-subtitle">
            Spot trends in vitals and condition-specific markers over time (demo data).
          </p>
        </div>
      </div>

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
              <div className="card-subtitle">Plain-language readout of your trends (demo, same style as lab summaries elsewhere)</div>
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

      <div className="grid grid-2" style={{ gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color="var(--primary)" />
              </div>
              <div>
                <div className="card-title">Blood pressure</div>
                <div className="card-subtitle">Systolic / diastolic (mmHg)</div>
              </div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <DualLineBpChart data={trackerBloodPressure} />
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>
                Systolic <strong style={{ color: 'var(--primary)' }}>(solid line)</strong>
              </span>
              <span>
                Diastolic <strong style={{ color: 'var(--accent)' }}>(dashed line)</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplets size={18} color="var(--success)" />
              </div>
              <div>
                <div className="card-title">Fasting glucose</div>
                <div className="card-subtitle">mg/dL (lab fasting values)</div>
              </div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            <SimpleBarChart data={trackerGlucose} valueKey="value" color="var(--success)" unit=" mg/dL" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Condition focus</div>
          <div className="card-subtitle">Highlights tied to your care plan</div>
        </div>
        <div className="card-body" style={{ paddingTop: 0 }}>
          <div className="grid grid-3" style={{ gap: 14 }}>
            {healthHubProblems.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Since {p.since}</div>
                <div style={{ marginTop: 10 }}>
                  <span className="badge badge-primary badge-dot">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
