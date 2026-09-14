import React, { useState } from 'react';
import { 
  AlertCircle, Bell, Search, Filter, RefreshCw, 
  ChevronRight, AlertTriangle, Activity, Database,
  ArrowUpRight, Clock, ShieldAlert, Zap, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Sharing the same data structure as the Dashboard for consistency
// --- DATA CONSTANTS REMOVED (Now using AppContext for Alerts) ---

function SeverityBadge({ severity }) {
  const map = {
    critical: { cls: 'badge-danger', label: 'Critical' },
    high: { cls: 'badge-warning', label: 'High' },
    medium: { cls: 'badge-primary', label: 'Medium' },
    low: { cls: 'badge-success', label: 'Low' },
  };
  const { cls, label } = map[severity] || map.low;
  return <span className={`badge ${cls} badge-dot`}>{label}</span>;
}

export default function AdminAlerts() {
  const { adminAlerts, addToast } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const categories = ['All', 'Operational', 'Billing', 'Compliance', 'Technology', 'Security', 'Staffing'];
  
  const filtered = adminAlerts.filter(a => {
    const matchCat = filter === 'All' || a.category === filter;
    const matchSearch = (a.message || '').toLowerCase().includes(search.toLowerCase()) || 
                       (a.unit || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const stats = {
    total: adminAlerts.length,
    urgent: adminAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length,
    resolved: 142, // Mock stat
    activeTime: '12m'
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldAlert size={28} color="var(--danger)" />
          Institutional Alert Center
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
          Real-time operational monitoring and critical incident response across all facility nodes.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Active Alerts', value: stats.total, sub: 'Currently unaddressed', icon: Bell, color: 'var(--primary)', bg: 'var(--primary-light)' },
          { label: 'Urgent Incidents', value: stats.urgent, sub: 'High/Critical severity', icon: AlertTriangle, color: 'var(--danger)', bg: 'var(--danger-light)' },
          { label: 'Avg Resolution', value: stats.activeTime, sub: 'Target: < 15m', icon: Clock, color: 'var(--success)', bg: 'var(--success-light)' },
          { label: 'Weekly Cleared', value: stats.resolved, sub: '+12% vs last week', icon: Activity, color: 'var(--accent)', bg: 'var(--accent-light)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ padding: 0, minHeight: '60vh' }}>
        {/* Controls Bar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-chip ${filter === cat ? 'active' : ''}`}
                style={{ padding: '6px 16px', fontSize: 12 }}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="search-bar" style={{ width: 260, height: 38 }}>
              <Search size={16} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search alerts or units..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize: 13, border: 'none', background: 'transparent', outline: 'none', flex: 1, padding: '0 8px' }}
              />
            </div>
            <button className="btn btn-secondary btn-sm" style={{ height: 38 }}>
              <RefreshCw size={14} /> Sync
            </button>
          </div>
        </div>

        {/* Alerts Table/List */}
        <div className="table-wrap">
          <table className="table table-row-hover">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Incident Details</th>
                <th>Category</th>
                <th>Originating Unit</th>
                <th>Timestamp</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(alert => (
                <tr key={alert.id}>
                  <td>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.severity === 'critical' ? 'var(--danger)' : alert.severity === 'high' ? 'var(--warning)' : 'var(--primary)' }} />
                  </td>
                  <td>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.message}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>System Tag: #{alert.type.replace(' ', '-').toUpperCase()}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{alert.category}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                      <Database size={13} color="var(--text-muted)" />
                      {alert.unit}
                    </div>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {alert.time}
                  </td>
                  <td>
                    <SeverityBadge severity={alert.severity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Search size={40} style={{ marginBottom: 16, opacity: 0.5 }} />
              <div style={{ fontSize: 15, fontWeight: 600 }}>No alerts found matching your criteria.</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters or search term.</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Insight */}
      <div style={{ marginTop: 20, background: 'var(--bg)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(149,92,225,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={20} color="var(--primary)" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>AI Response Optimization Active</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>System is automatically prioritizing critical incidents based on facility load and patient impact scores.</div>
        </div>
      </div>
    </div>
  );
}
