import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard, Download, Eye, X, CheckCircle,
  ArrowRight, Lock, Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { rollupStatement, rollupAllStatements } from '../lib/billingRollup';

function PaymentModal({ onClose }) {
  const { addToast, patientBilling } = useApp();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(patientBilling.currentBalance.toFixed(2));
  const [method, setMethod] = useState('visa');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setAmount(patientBilling.currentBalance.toFixed(2));
  }, [patientBilling.currentBalance]);

  const handlePay = () => {
    setDone(true);
    setTimeout(() => {
      addToast(`Payment of $${amount} processed successfully!`, 'success');
      onClose();
    }, 2200);
  };

  if (done) return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="success-animation">
          <div className="success-circle">
            <CheckCircle size={36} color="var(--success)" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Payment Successful!</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)', marginBottom: 8 }}>${amount}</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Your payment has been processed. A receipt will be sent to your email.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Make a Payment</div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div className="input-label" style={{ marginBottom: 10 }}>Payment Amount</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  {[patientBilling.currentBalance.toFixed(2), '100.00', '50.00'].map(a => (
                    <button
                      key={a}
                      className={`btn btn-sm ${amount === a ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAmount(a)}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-secondary)' }}>$</span>
                  <input
                    className="input-field"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{ paddingLeft: 28 }}
                    type="number"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="input-label" style={{ marginBottom: 10 }}>Payment Method</div>
              {[
                { id: 'visa', label: 'Visa ending in 4821', sub: 'Expires 09/28' },
                { id: 'bank', label: 'Online Banking', sub: 'Interac e-Transfer' },
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    padding: '14px 16px', borderRadius: 10, border: `2px solid ${method === m.id ? 'var(--primary)' : 'var(--border)'}`,
                    background: method === m.id ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    marginBottom: 10, transition: 'var(--transition)',
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: method === m.id ? 'var(--primary)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={17} color={method === m.id ? '#fff' : 'var(--text-muted)'} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.sub}</div>
                  </div>
                  {method === m.id && <CheckCircle size={16} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
                </div>
              ))}

              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={13} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Payments are encrypted and processed securely via BHG Pay.</span>
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Payment Summary</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -1, marginBottom: 4 }}>${amount}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>To: BHG Patient Financial Services</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Via: {method === 'visa' ? 'Visa ending 4821' : 'Online Banking'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Statement: STM-001 - March 2026</div>
                <div style={{ marginTop: 14, padding: '8px 12px', background: 'var(--success-light)', borderRadius: 8, fontSize: 12.5, color: 'var(--success)', fontWeight: 500 }}>
                  ✓ Covers outstanding balance due April 24, 2026
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {step === 2 && <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>}
          {step === 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!amount || parseFloat(amount) <= 0}>
              Review Payment <ArrowRight size={14} />
            </button>
          ) : (
            <button className="btn btn-success" onClick={handlePay}>
              <CheckCircle size={14} /> Confirm & Pay ${amount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatementModal({ stmt, onClose }) {
  const { addToast } = useApp();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Statement - {stmt.period}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Issued {stmt.issued} · Due {stmt.due}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ overflowX: 'auto', marginBottom: 20 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Service Description</th>
                  <th>Code</th>
                  <th>Billed</th>
                  <th>Insurance</th>
                  <th>Your Share</th>
                </tr>
              </thead>
              <tbody>
                {stmt.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ maxWidth: 280, fontSize: 13 }}>{item.description}</td>
                    <td><span className="badge badge-muted">{item.code}</span></td>
                    <td style={{ fontWeight: 600 }}>${item.amount.toFixed(2)}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>-${item.covered.toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: item.patient > 0 ? 'var(--text-primary)' : 'var(--success)' }}>
                      {item.patient > 0 ? `$${item.patient.toFixed(2)}` : 'Covered'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 20, padding: '14px 0', borderTop: '2px solid var(--border)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Patient Responsibility</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stmt.status === 'Paid' ? 'var(--success)' : 'var(--text-primary)' }}>
                {stmt.total === 0 ? 'Fully Covered' : `$${stmt.total.toFixed(2)}`}
              </div>
              {stmt.status === 'Paid' && <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>✓ Paid in Full</div>}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => { addToast('Statement downloaded as PDF.', 'success'); onClose(); }}>
            <Download size={14} /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Billing({ pageTitle = 'Statements', pageSubtitle }) {
  const [tab, setTab] = useState('overview');
  const [paying, setPaying] = useState(false);
  const [viewStmt, setViewStmt] = useState(null);
  const { addToast, patientBilling: billing } = useApp();

  useEffect(() => {
    const t = sessionStorage.getItem('mc_statements_tab');
    if (t === 'overview' || t === 'statements' || t === 'history') {
      setTab(t);
      sessionStorage.removeItem('mc_statements_tab');
    }
  }, []);

  const stmts = billing.statements || [];
  const totals = useMemo(() => rollupAllStatements(stmts), [stmts]);
  const subtitle =
    pageSubtitle ||
    `See what you owe, what insurance already paid, and your statements - ${stmts.length} statement periods on file`;

  return (
    <div className="animate-fade-in">
      {paying && <PaymentModal onClose={() => setPaying(false)} />}
      {viewStmt && <StatementModal stmt={viewStmt} onClose={() => setViewStmt(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-header-title">{pageTitle}</h1>
          <p className="page-header-subtitle">{subtitle}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setPaying(true)}>
          <CreditCard size={15} /> Make a Payment
        </button>
      </div>

      <div
        className="card"
        style={{
          marginBottom: 20,
          padding: '16px 18px',
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
          borderLeft: '4px solid var(--primary)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <Info size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--text-primary)' }}>How to read this page:</strong> Charges show what providers billed.
          <strong style={{ color: 'var(--success)' }}> Insurance paid</strong> is what your plan paid toward those visits.
          <strong style={{ color: 'var(--text-primary)' }}> Your share</strong> is what may still be your responsibility.
          Your <strong>current balance</strong> below is what we still need from you after insurance - open any statement to view or download a PDF.
        </p>
      </div>

      {/* Balance card */}
      <div className="billing-summary" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="billing-label">Amount you owe now</div>
              <div className="billing-amount">${billing.currentBalance.toFixed(2)}</div>
              <div className="billing-due">Pay by {billing.dueDate} · after insurance has processed</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <button
                className="btn btn-sm"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => setPaying(true)}
              >
                Pay now →
              </button>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Last payment: ${billing.lastPayment.amount} on {billing.lastPayment.date}</div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Coverage status', value: 'Active, verified', sub: 'SunLife Financial · SL-7842910' },
              { label: 'Total billed (posted)', value: `$${totals.billed.toFixed(2)}`, sub: 'Sum of charges on your statements' },
              { label: 'Insurance paid', value: `$${totals.insurancePaid.toFixed(2)}`, sub: 'What your plan paid toward claims' },
              { label: 'Your share (posted)', value: `$${totals.yourShare.toFixed(2)}`, sub: 'Copays, deductible, non-covered' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', minWidth: 140 }}>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{item.value}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab${tab === 'overview' ? ' active' : ''}`} onClick={() => setTab('overview')}>At a glance</div>
        <div className={`tab${tab === 'statements' ? ' active' : ''}`} onClick={() => setTab('statements')}>All statements</div>
        <div className={`tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>Payment history</div>
      </div>

      {tab === 'overview' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Current and previous periods - click a card to view line items, insurance payments, and download a PDF.
          </p>
          <div className="grid grid-2" style={{ gap: 20 }}>
            {billing.statements.map((stmt) => {
              const r = rollupStatement(stmt);
              return (
                <div key={stmt.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setViewStmt(stmt)}>
                  <div className="card-header">
                    <div>
                      <div className="card-title">{stmt.period}</div>
                      <div className="card-subtitle">Issued {stmt.issued} · Due {stmt.due}</div>
                    </div>
                    <span className={`badge badge-${stmt.statusColor}`}>{stmt.status}</span>
                  </div>
                  <div className="card-body">
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Your balance this statement</div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: stmt.status === 'Paid' ? 'var(--success)' : 'var(--text-primary)', letterSpacing: -1 }}>
                      {stmt.total === 0 ? '$0.00' : `$${stmt.total.toFixed(2)}`}
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-light)', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                      <div>Billed <strong style={{ color: 'var(--text-primary)' }}>${r.billed.toFixed(2)}</strong></div>
                      <div>Insurance paid <strong style={{ color: 'var(--success)' }}>${r.insurancePaid.toFixed(2)}</strong></div>
                      <div>Your share <strong style={{ color: 'var(--text-primary)' }}>${r.yourShare.toFixed(2)}</strong></div>
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setViewStmt(stmt); }}>
                        <Eye size={13} /> View statement
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); addToast('PDF download started.', 'success'); }}>
                        <Download size={13} /> Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'statements' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            Every period lists total billed, what insurance covered, and what may still apply to you. Use View or Download on any row.
          </p>
          <div className="card">
            <div className="table-wrap">
              <table className="table table-row-hover">
                <thead>
                  <tr>
                    <th>Statement</th>
                    <th>Period</th>
                    <th>Issued</th>
                    <th>Total billed</th>
                    <th>Insurance paid</th>
                    <th>Your share</th>
                    <th>Balance due</th>
                    <th>Status</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {billing.statements.map((s) => {
                    const r = rollupStatement(s);
                    return (
                      <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => setViewStmt(s)}>
                        <td><span className="badge badge-muted">{s.id}</span></td>
                        <td style={{ fontWeight: 600 }}>{s.period}</td>
                        <td>{s.issued}</td>
                        <td style={{ fontWeight: 600 }}>${r.billed.toFixed(2)}</td>
                        <td style={{ fontWeight: 600, color: 'var(--success)' }}>${r.insurancePaid.toFixed(2)}</td>
                        <td style={{ fontWeight: 600 }}>${r.yourShare.toFixed(2)}</td>
                        <td style={{ fontWeight: 700 }}>{s.total === 0 ? '$0.00' : `$${s.total.toFixed(2)}`}</td>
                        <td><span className={`badge badge-${s.statusColor}`}>{s.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button type="button" className="btn btn-ghost btn-sm btn-icon" title="View statement" onClick={(e) => { e.stopPropagation(); setViewStmt(s); }}><Eye size={14} /></button>
                            <button type="button" className="btn btn-ghost btn-sm btn-icon" title="Download PDF" onClick={(e) => { e.stopPropagation(); addToast('PDF download started.', 'success'); }}><Download size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'history' && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            Payments applied to your account (does not replace your insurer&apos;s explanation of benefits).
          </p>
          <div className="card">
          <div className="table-wrap">
            <table className="table table-row-hover">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {billing.paymentHistory.map(p => (
                  <tr key={p.id}>
                    <td><span className="badge badge-muted">{p.reference}</span></td>
                    <td>{p.date}</td>
                    <td>{p.method}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>${p.amount.toFixed(2)}</td>
                    <td><span className="badge badge-success badge-dot">Paid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
