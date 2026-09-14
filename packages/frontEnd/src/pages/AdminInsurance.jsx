import React, { useState, useEffect } from 'react';
import { 
  BarChart2, TrendingUp, DollarSign, Activity, 
  CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const CHART_DATA = {
  Week: [
    { label: 'Mon', h: 62 }, { label: 'Tue', h: 78 }, { label: 'Wed', h: 65 }, 
    { label: 'Thu', h: 92 }, { label: 'Fri', h: 84 }, { label: 'Sat', h: 32 }, { label: 'Sun', h: 28 }
  ],
  Month: [
    { label: 'Week 1', h: 72 }, { label: 'Week 2', h: 88 }, 
    { label: 'Week 3', h: 75 }, { label: 'Week 4', h: 94 }
  ],
  Year: [
    { label: 'Jan', h: 42 }, { label: 'Feb', h: 48 }, { label: 'Mar', h: 55 }, 
    { label: 'Apr', h: 62 }, { label: 'May', h: 68 }, { label: 'Jun', h: 74 }, 
    { label: 'Jul', h: 82 }, { label: 'Aug', h: 78 }, { label: 'Sep', h: 85 }, 
    { label: 'Oct', h: 92 }, { label: 'Nov', h: 88 }, { label: 'Dec', h: 96 }
  ]
};

const DENIAL_DATA = {
  Week: [
    { reason: 'Eligibility / Benefit Gap', pct: 35, color: 'var(--danger)' },
    { reason: 'Coordination of Benefits', pct: 28, color: 'var(--warning)' },
    { reason: 'Coding (ICD/CPT) Error', pct: 15, color: 'var(--primary)' },
    { reason: 'Prior Auth Breaches', pct: 12, color: 'var(--accent)' }
  ],
  Month: [
    { reason: 'Eligibility / Benefit Gap', pct: 41, color: 'var(--danger)' },
    { reason: 'Coordination of Benefits', pct: 24, color: 'var(--warning)' },
    { reason: 'Coding (ICD/CPT) Error', pct: 18, color: 'var(--primary)' },
    { reason: 'Prior Auth Breaches', pct: 11, color: 'var(--accent)' }
  ],
  Year: [
    { reason: 'Eligibility / Benefit Gap', pct: 38, color: 'var(--danger)' },
    { reason: 'Coordination of Benefits', pct: 30, color: 'var(--warning)' },
    { reason: 'Coding (ICD/CPT) Error', pct: 14, color: 'var(--primary)' },
    { reason: 'Prior Auth Breaches', pct: 10, color: 'var(--accent)' }
  ]
};

const RECENT_BATCHES = [
  { id: 'BCH-2026-04A', facility: 'Emergency Dept', claims: 450, value: '$1,240,000', status: 'Submitted', date: 'Apr 24, 2026', denials: 12 },
  { id: 'BCH-2026-04B', facility: 'Cardiology Unit', claims: 228, value: '$682,500', status: 'Processing', date: 'Apr 23, 2026', denials: 4 },
  { id: 'BCH-2026-04C', facility: 'Surgical Suite', claims: 312, value: '$890,200', status: 'Cleared', date: 'Apr 22, 2026', denials: 8 },
  { id: 'BCH-2026-03Z', facility: 'Inpatient Med-Surg', claims: 518, value: '$1,420,800', status: 'Cleared', date: 'Apr 20, 2026', denials: 18 },
  { id: 'BCH-2026-03Y', facility: 'Outpatient Clinic', claims: 186, value: '$412,000', status: 'Rejected', date: 'Apr 18, 2026', denials: 24 },
];

function StatusBadge({ status }) {
  const map = {
    Submitted: 'badge-primary', Processing: 'badge-accent', Cleared: 'badge-success', Rejected: 'badge-danger'
  };
  return <span className={`badge ${map[status] || 'badge-muted'} badge-dot`}>{status}</span>;
}

export default function AdminInsurance() {
  const { addToast } = useApp();
  const [timeframe, setTimeframe] = useState('Month');
  const [animate, setAnimate] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [timeframe]);

  const activeData = CHART_DATA[timeframe];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <DollarSign size={28} color="var(--primary)" /> Claims & Revenue Command
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>Institutional Revenue Cycle Management (RCM) • Institutional Payer Mix</p>
        </div>
        <div style={{ display: 'flex', gap: 8, background: 'var(--border-light)', padding: 4, borderRadius: 10 }}>
          {['Week', 'Month', 'Year'].map(t => (
            <button key={t} className={`filter-chip ${timeframe === t ? 'active' : ''}`} style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => setTimeframe(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* RCM METRICS */}
      <div className="grid grid-4" style={{ marginBottom: 24, gap: 16 }}>
        {[
          { label: 'Gross Revenue Submitted', value: timeframe === 'Week' ? '$1.4M' : timeframe === 'Month' ? '$12.6M' : '$152.4M', sub: timeframe === 'Week' ? '+1.2% vs Prev' : '+4.2% vs Prev', icon: DollarSign, color: 'var(--primary)' },
          { label: 'Clean Claim Rate (CCR)', value: timeframe === 'Week' ? '91.8%' : timeframe === 'Month' ? '92.4%' : '94.1%', sub: 'Target: >90%', icon: CheckCircle, color: 'var(--success)' },
          { label: 'Average Denial Rate', value: timeframe === 'Week' ? '8.2%' : timeframe === 'Month' ? '7.6%' : '5.9%', sub: timeframe === 'Week' ? '↑ 1.1% (Alert)' : '↓ 0.5% (Good)', icon: XCircle, color: 'var(--danger)' },
          { label: 'Avg Days Out (AR)', value: timeframe === 'Week' ? '21d' : timeframe === 'Month' ? '18d' : '16d', sub: 'Rolling average', icon: Activity, color: 'var(--accent)' },
        ].map((m, i) => (
          <div key={i} className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={18} color={m.color} />
              </div>
              <TrendingUp size={16} color="var(--success)" opacity={0.6} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{m.value}</div>
            <div style={{ fontSize: 11, color: m.label === 'Average Denial Rate' ? 'var(--danger)' : 'var(--success)', fontWeight: 700, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* REVENUE CYCLE CHART */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Revenue Cycle Performance</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Billed vs. Collected amounts ({timeframe} View)</p>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: 2 }} /> Billed</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 8, height: 8, background: 'var(--success)', borderRadius: 2 }} /> Collected</div>
            </div>
          </div>
          
          <div style={{ height: 320, width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: timeframe === 'Year' ? 4 : 16, paddingLeft: 35, borderBottom: '1px solid var(--border-light)' }}>
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map(p => (
              <div key={p} style={{ position: 'absolute', left: 35, right: 0, bottom: `${p}%`, borderTop: '1px dashed var(--border-light)', zIndex: 0 }} />
            ))}
            
            {/* Y-Axis */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, paddingBottom: 10 }}>
              <span>$0</span><span>$2.5M</span><span>$5M</span><span>$7.5M</span><span>$10M</span>
            </div>

            {/* CHART BARS */}
            {activeData.map((d, i) => (
              <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
                <div style={{ width: timeframe === 'Year' ? '40%' : '20%', height: animate ? `${d.h}%` : '0%', background: 'var(--primary)', borderRadius: '4px 4px 0 0', transition: `height 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s` }} />
                <div style={{ width: timeframe === 'Year' ? '40%' : '20%', height: animate ? `${d.h * 0.9}%` : '0%', background: 'var(--success)', borderRadius: '4px 4px 0 0', transition: `height 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05 + 0.1}s` }} />
                
                {/* Labels */}
                <div style={{ position: 'absolute', top: '100%', marginTop: 8, fontSize: timeframe === 'Year' ? 9 : 10, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {d.label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, background: 'var(--bg)', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Avg Collection Time</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>14.2 Days</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Auto-Remediation Rate</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>64%</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => addToast('Downloading institution-wide financial ledger…', 'info')}>Export Ledger (CSV)</button>
          </div>
        </div>

        {/* SIDE PANELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Denial Reasons */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, color: 'var(--text-primary)' }}>Top Denial Vectors</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {DENIAL_DATA[timeframe].map(item => (
                <div key={item.reason}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{item.reason}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: animate ? `${item.pct}%` : '0%', background: item.color, transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 24, fontSize: 11 }} onClick={() => addToast('Opening denial remediation workflow…', 'info')}>Denial Remediation Suite</button>
          </div>

          {/* Institutional Payer Mix */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, color: 'var(--text-primary)' }}>Institutional Payer Mix</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { name: 'Medicare (CMS)', pct: '42%', val: '$2.8M' },
                { name: 'Blue Cross Blue Shield', pct: '31%', val: '$2.1M' },
                { name: 'UnitedHealthcare', pct: '18%', val: '$1.2M' },
                { name: 'Standard Self-Pay', pct: '9%', val: '$0.6M' }
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: i === 3 ? 'none' : '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.pct} of total volume</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{p.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MERGED: REVENUE CYCLE BATCHES TABLE */}
      <div className="card" style={{ marginTop: 24, padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Institutional Claim Batches</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Real-time status of multi-claim submissions by facility unit</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => addToast('Syncing with clearinghouse gateway…', 'info')}>Force Sync Gateway</button>
        </div>
        <div className="table-wrap">
          <table className="table table-row-hover">
            <thead>
              <tr>
                <th>Batch Identifier</th>
                <th>Assigned Unit</th>
                <th>Claim Count</th>
                <th>Gross Value</th>
                <th>Payer Denials</th>
                <th>Transmission Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BATCHES.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{b.id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Created: {b.date}</div>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{b.facility}</td>
                  <td style={{ fontSize: 13, fontWeight: 700 }}>{b.claims.toLocaleString()}</td>
                  <td style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)' }}>{b.value}</td>
                  <td style={{ fontSize: 13, fontWeight: 800, color: b.denials > 15 ? 'var(--danger)' : 'var(--text-secondary)' }}>{b.denials}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedBatch(b); addToast(`Opening detailed ledger for ${b.id}...`, 'info'); }}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* BATCH DETAIL MODAL */}
      {selectedBatch && (
        <div className="modal-overlay" onClick={() => setSelectedBatch(null)}>
          <div className="modal modal-lg animate-scale-up" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Batch Audit: {selectedBatch.id}</h2>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                   <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Facility: <strong style={{ color: 'var(--text-primary)' }}>{selectedBatch.facility}</strong></span>
                   <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Date: <strong style={{ color: 'var(--text-primary)' }}>{selectedBatch.date}</strong></span>
                </div>
              </div>
              <button className="btn btn-icon" onClick={() => setSelectedBatch(null)}><X size={20} /></button>
            </div>
            <div style={{ padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
                <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Claims</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{selectedBatch.claims}</div>
                </div>
                <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Value</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: 'var(--primary)' }}>{selectedBatch.value}</div>
                </div>
                <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payer Denials</div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: selectedBatch.denials > 15 ? 'var(--danger)' : 'var(--success)' }}>{selectedBatch.denials}</div>
                </div>
              </div>

              <div className="table-wrap" style={{ border: '1px solid var(--border-light)', borderRadius: 12 }}>
                <table className="table">
                  <thead>
                    <tr><th>Claim ID</th><th>Patient</th><th>Service Date</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[1,2,3,4,5].map(i => (
                      <tr key={i}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>CLM-2026-X{i}04</td>
                        <td style={{ fontWeight: 600 }}>{['Sarah Jenkins', 'Eleanor Walsh', 'David Nguyen', 'James Wilson', 'Patricia Mills'][i-1]}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Apr {20 + i}, 2026</td>
                        <td style={{ fontWeight: 700 }}>${(Math.random() * 5000 + 1000).toFixed(2)}</td>
                        <td><StatusBadge status={i === 2 && selectedBatch.denials > 0 ? 'Rejected' : 'Cleared'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer" style={{ background: 'var(--bg)' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedBatch(null)}>Close Audit</button>
              <button className="btn btn-primary" onClick={() => addToast('Downloading detailed compliance report...', 'success')}>Download Report (PDF)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

