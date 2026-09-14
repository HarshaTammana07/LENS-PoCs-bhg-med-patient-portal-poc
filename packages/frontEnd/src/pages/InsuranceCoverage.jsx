import React, { useState } from 'react';
import {
  User,
  Search,
  Plus,
  FileText,
  ShieldCheck,
  Upload,
  ChevronRight,
  Receipt,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { rollupAllStatements } from '../lib/billingRollup';

function ProgressBar({ label, used, total, fillColor, trackColor }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>${used.toLocaleString()}</strong>
          {' · '}
          ${total.toLocaleString()}
        </span>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: trackColor || 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 999,
            background: fillColor || 'var(--primary)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}

const copayIcons = { user: User, search: Search, plus: Plus };

export default function InsuranceCoverage() {
  const { user, addToast, navigate, patientBilling, patient, insuranceCoverage: coverage } = useApp();
  const subscriberName = user?.name || patient?.name;
  const policy = patient?.insurance ?? {};
  const stmts = patientBilling?.statements || [];
  const posted = rollupAllStatements(stmts);
  const balanceDue = patientBilling?.currentBalance ?? 0;
  const dueDate = patientBilling?.dueDate ?? 'N/A';

  const openStatementsTab = (tab) => {
    sessionStorage.setItem('mc_statements_tab', tab);
    navigate('statements');
  };

  const [frontReady, setFrontReady] = useState(false);
  const [backReady, setBackReady] = useState(false);

  const submitUpdates = () => {
    addToast('Thanks - your insurance card images were submitted for review (demo).', 'success');
    setFrontReady(false);
    setBackReady(false);
  };

  return (
    <div className="animate-fade-in insurance-coverage-page">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-left">
          <h1 className="page-header-title">Insurance &amp; coverage</h1>
          <p className="page-header-subtitle">
            Plan details, copays, and how your claims translate into what you owe - same numbers as Statements &amp;
            billing.
          </p>
        </div>
      </div>

      {/* Estimated Surgery Cost Card */}
      <div className="card" style={{ padding: '22px 26px', marginBottom: 24, border: '1px solid rgba(109,40,217,0.15)', background: 'linear-gradient(135deg, var(--surface), var(--primary-light) 200%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={20} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Estimated Surgery Cost</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
              Laparoscopic Cholecystectomy · June 25, 2026
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Facility fee', amount: '$3,200.00' },
            { label: 'Surgeon fee', amount: '$1,800.00' },
            { label: 'Anaesthesia fee', amount: '$950.00' },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--text-secondary)' }}>
              <span>{row.label}</span>
              <span style={{ fontWeight: 600 }}>{row.amount}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total estimated</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>$5,950.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--success)' }}>
            <span style={{ fontWeight: 600 }}>Insurance covers (est.)</span>
            <span style={{ fontWeight: 700 }}>−$4,450.00</span>
          </div>
          <div style={{ height: 2, background: 'var(--primary)', margin: '4px 0', opacity: 0.3 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Your estimated cost</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>$1,500.00</span>
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>
          This is an estimate based on your current coverage. Final charges may vary. Questions? Contact our financial team.
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('messages')}
        >
          <MessageSquare size={13} /> Message Financial Team
        </button>
      </div>

      <div className="insurance-layout">
        <div className="insurance-main">
          {/* Posted claims snapshot - mirrors Statements KPIs */}
          <div className="card" style={{ padding: '20px 22px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Receipt size={20} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Claims &amp; what you owe</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
                  Posted charges after insurance - open Statements for PDFs and payment history.
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 14,
                marginBottom: 16,
              }}
            >
              {[
                { label: 'Coverage status', value: 'Active · verified', sub: `${coverage.providerName}` },
                { label: 'Total billed (posted)', value: `$${posted.billed.toFixed(2)}`, sub: 'On your statements' },
                { label: 'Insurance paid', value: `$${posted.insurancePaid.toFixed(2)}`, sub: 'Toward those charges' },
                { label: 'Amount you owe now', value: `$${balanceDue.toFixed(2)}`, sub: `Due ${dueDate}` },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--bg)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 6 }}>
                    {row.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{row.value}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{row.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => openStatementsTab('overview')}>
                View statements &amp; downloads
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => openStatementsTab('statements')}>
                All statements (table)
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => openStatementsTab('history')}>
                Payment history
              </button>
            </div>
          </div>

          {/* Primary coverage hero */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              padding: '24px 26px',
              background: 'linear-gradient(145deg, #1e3a5f 0%, #0f2657 48%, #0c1b3a 100%)',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', opacity: 0.75, marginBottom: 10 }}>
                  {coverage.carrierLabel.toUpperCase()}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{coverage.providerName}</div>
                <div style={{ fontSize: 14, opacity: 0.92, fontWeight: 500 }}>{coverage.planName}</div>
                <div style={{ fontSize: 12.5, opacity: 0.72, marginTop: 8 }}>{coverage.networkNote}</div>
              </div>
              {coverage.verifiedActive && (
                <span
                  className="badge badge-success badge-dot"
                  style={{
                    fontSize: 11,
                    padding: '8px 14px',
                    background: 'rgba(16,185,129,0.25)',
                    border: '1px solid rgba(52,211,153,0.45)',
                    color: '#ecfdf5',
                  }}
                >
                  Verified active
                </span>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 16,
                marginTop: 22,
                paddingTop: 20,
                borderTop: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {[
                { k: 'Subscriber', v: subscriberName },
                { k: 'Policy ID', v: policy.policyNumber ?? '—' },
                { k: 'Group #', v: policy.groupNumber ?? '—' },
                { k: 'Effective', v: policy.effectiveDate ?? '—' },
              ].map((row) => (
                <div key={row.k}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', opacity: 0.65, marginBottom: 4 }}>{row.k}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{row.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Copay cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 14,
              marginBottom: 20,
            }}
          >
            {(['pcp', 'specialist', 'urgentCare']).map((key) => {
              const c = coverage.copays[key];
              const Icon = copayIcons[c.icon] || User;
              return (
                <div
                  key={key}
                  className="card"
                  style={{
                    padding: '18px 16px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                      {c.label.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    ${c.amount.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coverage tracker */}
          <div className="card" style={{ padding: '22px 24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 18 }}>Coverage tracker</div>
            <ProgressBar
              label={coverage.deductible.label}
              used={coverage.deductible.used}
              total={coverage.deductible.total}
              fillColor="var(--primary)"
              trackColor="var(--border-light)"
            />
            <ProgressBar
              label={coverage.oopMax.label}
              used={coverage.oopMax.used}
              total={coverage.oopMax.total}
              fillColor="#059669"
              trackColor="var(--border-light)"
            />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              Calculated as of last claim run: {coverage.calculatedAsOf}
            </p>
          </div>
        </div>

        <aside className="insurance-aside">
          <div className="card" style={{ padding: '20px 18px', marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Update coverage</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 16 }}>
              Did your plan change? Upload photos of your new card (front and back). Our team usually confirms within 2 business days.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => {
                  setFrontReady(true);
                  addToast('Front of card marked for upload (demo).', 'info');
                }}
                style={{
                  minHeight: 88,
                  borderRadius: 12,
                  border: `2px dashed ${frontReady ? 'var(--primary)' : 'var(--border)'}`,
                  background: frontReady ? 'var(--primary-light)' : 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                <Upload size={20} color="var(--primary)" />
                FRONT
              </button>
              <button
                type="button"
                onClick={() => {
                  setBackReady(true);
                  addToast('Back of card marked for upload (demo).', 'info');
                }}
                style={{
                  minHeight: 88,
                  borderRadius: 12,
                  border: `2px dashed ${backReady ? 'var(--primary)' : 'var(--border)'}`,
                  background: backReady ? 'var(--primary-light)' : 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                <Upload size={20} color="var(--primary)" />
                BACK
              </button>
            </div>
            <button type="button" className="btn btn-primary btn-sm btn-full" onClick={submitUpdates} disabled={!frontReady && !backReady}>
              Submit updates
            </button>
          </div>

          <div className="card" style={{ padding: '20px 18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={18} color="var(--success)" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Pre-authorizations</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {coverage.preAuthorizations.map((pa) => (
                <div
                  key={pa.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{pa.id}</span>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{pa.procedure}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Expires: {pa.expires}</div>
                    </div>
                    <span
                      className={`badge ${pa.status === 'Approved' ? 'badge-success' : 'badge-muted'} badge-dot`}
                      style={{ fontSize: 10 }}
                    >
                      {pa.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 14, width: '100%', justifyContent: 'center', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--primary)' }}
              onClick={() => navigate('messages')}
            >
              Check another procedure <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ padding: '16px 4px 8px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} color="var(--success)" />
              Coverage verified against payer directory - demo data.
            </div>
          </div>
        </aside>
      </div>

      <footer
        style={{
          marginTop: 36,
          paddingTop: 20,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
          fontSize: 11,
          color: 'var(--text-muted)',
        }}
      >
        <span>© {new Date().getFullYear()} BHG Health Network. All rights reserved.</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {['Privacy policy', 'Terms of service', 'HIPAA compliance', 'Contact support'].map((label) => (
            <button
              key={label}
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 0', height: 'auto', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-muted)' }}
              onClick={() => addToast(`${label} - opens help center (demo).`, 'info')}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
      </footer>

      <style>{`
        .insurance-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .insurance-layout {
            grid-template-columns: 1fr;
          }
          .insurance-aside {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
