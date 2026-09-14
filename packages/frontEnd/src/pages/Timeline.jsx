import React, { useState } from 'react';
import {
  Calendar, FileText, MessageSquare, CreditCard, Receipt,
  HeartPulse, Activity, Pill, Scan, Shield, CheckCircle,
  Filter, ChevronRight
} from 'lucide-react';
import { timelineEvents as seedTimeline } from '../data/mockData';
import { useApp } from '../context/AppContext';

const iconMap = {
  FileText, Calendar, MessageSquare, CreditCard, Receipt,
  HeartPulse, Activity, Pill, Scan, Shield, CheckCircle,
  FlaskConical: FileText, UserCheck: Calendar,
};
const colorMap = {
  success: { bg: 'var(--success-light)', color: 'var(--success)' },
  primary: { bg: 'var(--primary-light)', color: 'var(--primary)' },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  danger:  { bg: 'var(--danger-light)',  color: 'var(--danger)' },
  accent:  { bg: 'var(--accent-light)',  color: 'var(--accent)' },
  muted:   { bg: 'var(--bg)',            color: 'var(--text-muted)' },
};

const typeFilters = ['All', 'appointment', 'report', 'billing', 'message', 'prescription', 'system'];
const typeMeta = {
  appointment: { label: 'Appointments', color: 'primary' },
  report:      { label: 'Reports',      color: 'warning' },
  billing:     { label: 'Billing',      color: 'success' },
  message:     { label: 'Messages',     color: 'accent' },
  prescription:{ label: 'Prescriptions',color: 'purple' },
  system:      { label: 'System',       color: 'muted' },
};

export default function Timeline() {
  const { navigate, timelineEvents: portalTimeline } = useApp();
  const timelineEvents = portalTimeline?.length ? portalTimeline : seedTimeline;
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? timelineEvents : timelineEvents.filter(e => e.type === filter);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Care Journey</h1>
          <p className="page-header-subtitle">Your complete health timeline - {timelineEvents.length} events recorded</p>
        </div>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(typeMeta).map(([type, meta]) => {
          const count = timelineEvents.filter(e => e.type === type).length;
          return (
            <div key={type} style={{
              padding: '8px 16px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer',
              transition: 'var(--transition)', fontWeight: 600,
            }}
              onClick={() => setFilter(filter === type ? 'All' : type)}
            >
              <span className={`badge badge-${meta.color}`} style={{ padding: '2px 8px', fontSize: 11 }}>{count}</span>
              {meta.label}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Main timeline */}
        <div style={{ flex: 1 }}>
          <div className="filter-bar" style={{ marginBottom: 20 }}>
            <button className={`filter-chip${filter === 'All' ? ' active' : ''}`} onClick={() => setFilter('All')}>All Events</button>
            {Object.entries(typeMeta).map(([type, meta]) => (
              <button key={type} className={`filter-chip${filter === type ? ' active' : ''}`} onClick={() => setFilter(type)}>
                {meta.label}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: '24px 28px' }}>
            <div className="timeline">
              {filtered.map((ev, i) => {
                const cs = colorMap[ev.color] || colorMap.muted;
                const Icon = iconMap[ev.icon] || Activity;
                return (
                  <div
                    key={ev.id}
                    className="timeline-item"
                    style={{ cursor: 'pointer', paddingBottom: i < filtered.length - 1 ? 28 : 0 }}
                    onClick={() => navigate(ev.link)}
                  >
                    <div className="timeline-dot" style={{ background: cs.bg, border: `2px solid ${cs.color}22` }}>
                      <Icon size={16} color={cs.color} />
                    </div>
                    <div className="timeline-content" style={{ paddingBottom: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div className="timeline-title">{ev.title}</div>
                          <div className="timeline-desc">{ev.desc}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                            <div className="timeline-time">{ev.date}</div>
                            <span className={`badge badge-${typeMeta[ev.type]?.color || 'muted'}`} style={{ fontSize: 10.5 }}>
                              {typeMeta[ev.type]?.label || ev.type}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right summary panel */}
        <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title" style={{ fontSize: 13 }}>Journey Stats</div></div>
            <div className="card-body" style={{ padding: '12px 20px' }}>
              {[
                { label: 'Total Events', value: timelineEvents.length },
                { label: 'Appointments', value: timelineEvents.filter(e => e.type === 'appointment').length },
                { label: 'Reports', value: timelineEvents.filter(e => e.type === 'report').length },
                { label: 'Billing Events', value: timelineEvents.filter(e => e.type === 'billing').length },
                { label: 'Messages', value: timelineEvents.filter(e => e.type === 'message').length },
                { label: 'Prescriptions', value: timelineEvents.filter(e => e.type === 'prescription').length },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                  <span style={{ fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title" style={{ fontSize: 13 }}>Care Since</div></div>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>Jan</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-muted)' }}>2026</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>4+ months of unified health data</div>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, var(--primary), #1050a8)', borderRadius: 14, padding: 18, color: '#fff' }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Platform Insight</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>
              Every event in your timeline is connected across modules - records, appointments, billing, and messages - from one centralized platform.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
