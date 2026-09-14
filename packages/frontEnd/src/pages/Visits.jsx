import React from 'react';
import { Stethoscope, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Visits() {
  const { visits = [] } = useApp();
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Visits</h1>
          <p className="page-header-subtitle">
            Your surgical care visits and summaries. For your upcoming procedure, open My Surgery.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {visits.map((v) => (
          <div key={v.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 14, minWidth: 0 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Stethoscope size={22} color="var(--primary)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {v.summary}
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--primary)', marginTop: 3 }}>
                    {v.doctor} · {v.specialty}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={13} /> {v.date}
                    </span>
                    <span className="badge badge-muted">{v.specialty}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ paddingTop: 14, display: 'grid', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    What we discussed
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{v.diagnosis}</div>
                </div>
                <div style={{ padding: '12px 14px', background: 'var(--bg)', borderRadius: 10, borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Visit notes</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{v.notes}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
