import React, { useMemo, useState } from 'react';
import {
  Search, FileText, FlaskConical, Scan, Pill, UserCheck,
  ChevronRight, X, Download, Share2,
  CheckCircle, AlertCircle, Calendar, MessageSquare, Brain, ClipboardCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPortalSlice } from '../lib/portalData';
import { generateLabSummary, generatePhrSummary } from '../lib/aiDemo';

const categoryIcons = {
  lab: { icon: FlaskConical, bg: 'var(--success-light)', color: 'var(--success)' },
  imaging: { icon: Scan, bg: 'var(--warning-light)', color: 'var(--warning)' },
  specialist: { icon: UserCheck, bg: 'var(--primary-light)', color: 'var(--primary)' },
  visit: { icon: FileText, bg: 'var(--accent-light)', color: 'var(--accent)' },
  prescription: { icon: Pill, bg: 'var(--purple-light)', color: 'var(--purple)' },
  consent: { icon: ClipboardCheck, bg: 'var(--success-light)', color: 'var(--success)' },
};

const filters = ['All', 'Lab Results', 'Imaging', 'Specialist', 'Visit Summary', 'Medication', 'Consent Forms'];
const filterMap = { 'Lab Results': 'lab', 'Imaging': 'imaging', 'Specialist': 'specialist', 'Visit Summary': 'visit', 'Medication': 'prescription', 'Consent Forms': 'consent' };

const HUB_TABS = [
  { id: 'vitals', label: 'Vitals' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'problems', label: 'Problems / Conditions' },
  { id: 'immunizations', label: 'Immunizations' },
  { id: 'labs', label: 'Lab Results' },
  { id: 'consent', label: 'Consent Forms' },
  { id: 'messages', label: 'Messages' },
  { id: 'phr', label: 'PHR' },
  { id: 'access', label: 'Health Access Documents' },
  { id: 'education', label: 'Education Documents' },
];

function DetailPanel({ record, onClose, patient }) {
  const { addToast, addAuditLog, navigate } = useApp();
  const patientName = patient?.name || 'Patient';
  const patientId = patient?.id || '—';
  const cat = categoryIcons[record.category] || categoryIcons.lab;
  const Icon = cat.icon;
  const [aiOpen, setAiOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const ai = useMemo(() => {
    if (record.category !== 'lab') return null;
    return generateLabSummary(record);
  }, [record]);

  const handleGenerateAi = () => {
    if (aiOpen) return;
    setGenerating(true);
    addAuditLog({ action: 'AI Summary Generated', module: 'records', details: `Generated AI summary for ${record.title}` });
    setTimeout(() => {
      setGenerating(false);
      setAiOpen(true);
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
      <div style={{ flex: 1, background: 'rgba(10,18,40,0.4)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div style={{
        width: 520, background: 'var(--surface)', height: '100%', overflow: 'auto',
        boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column',
        animation: 'fadeInRight 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} color={cat.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{record.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>{record.type} · {record.date}</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '24px 28px', overflow: 'auto' }}>
          {/* Status + meta */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <span className={`badge badge-${record.statusColor}`}>{record.status}</span>
            <span className="badge badge-muted"><Calendar size={11} /> {record.date}</span>
          </div>

          {/* Provider info */}
          <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Provider / Lab</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{record.provider}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ordered by</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{record.orderedBy}</span>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Summary</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, padding: '12px 14px', background: 'var(--bg)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
              {record.summary}
            </div>
          </div>

          {/* Details table */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Detail Breakdown</div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              {record.details.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 16px',
                  borderBottom: i < record.details.length - 1 ? '1px solid var(--border-light)' : 'none',
                  background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)'
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: row.normal === false ? 'var(--warning)' : 'var(--text-primary)' }}>{row.value}</span>
                    {row.ref && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ref: {row.ref}</span>}
                    {row.normal === false ? <AlertCircle size={13} color="var(--warning)" /> : row.normal === true ? <CheckCircle size={13} color="var(--success)" /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {record.category === 'lab' && ai && (
            <div style={{ marginBottom: 20 }}>
              {!aiOpen && !generating && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', gap: 8 }}
                  onClick={handleGenerateAi}
                >
                  <Brain size={16} /> Generate AI Summary
                </button>
              )}
              {generating && (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
                  Generating summary...
                </div>
              )}
              {aiOpen && !generating && (
                <div
                  style={{
                    border: '1px solid rgba(149, 92, 225, 0.22)',
                    borderRadius: 12,
                    background: 'linear-gradient(145deg, #e0f7fa 0%, var(--surface) 52%, var(--surface) 100%)',
                    padding: '16px 18px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Brain size={20} color="var(--primary)" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>AI Summary</div>
                    <span className="badge badge-muted" style={{ flexShrink: 0 }}>
                      Confidence {ai.confidence}%
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 14px', whiteSpace: 'pre-wrap' }}>
                    {ai.text}
                  </p>
                  {ai.disclaimer && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 14px' }}>
                      {ai.disclaimer}
                    </p>
                  )}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('messages')}>
                    <MessageSquare size={14} /> Message Care Team about these results
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PDF mock viewer */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Document Preview</div>
            <div className="doc-viewer">
              <div className="doc-viewer-header">
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>BHG Health Network</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Patient: {patientName} · MRN: {patientId}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Report Date: {record.date} · {record.type}</div>
              </div>
              <div className="doc-viewer-section-title">REPORT: {record.title.toUpperCase()}</div>
              {record.details.map((row, i) => (
                <div key={i} className="doc-viewer-row">
                  <span>{row.label}:</span>
                  <span style={{ color: row.normal === false ? '#d97706' : 'inherit' }}>{row.value} {row.ref ? `(Ref: ${row.ref})` : ''}</span>
                </div>
              ))}
              <div className="doc-viewer-row" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border)' }}>
                <span>Authorized by:</span>
                <span>{record.orderedBy}</span>
              </div>
              <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                This document is confidential. Generated by BHG Patient Portal.
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => {
            addToast(`PDF export started for ${record.title}. Download will begin shortly.`, 'success');
            addAuditLog({ action: 'Export Record PDF', module: 'records', details: `Exported ${record.title}` });
          }}>
            <Download size={14} /> Download PDF
          </button>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => {
            addToast(`Share link copied for ${record.title}. You can now share it securely.`, 'info');
            addAuditLog({ action: 'Share Record', module: 'records', details: `Shared ${record.title}` });
          }}>
            <Share2 size={14} /> Share Record
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Records() {
  const {
    portalData,
    patient: ctxPatient,
    records: ctxRecords,
  } = useApp();
  const patient = ctxPatient || getPortalSlice('patient');
  const records = ctxRecords || getPortalSlice('records');
  const healthHubVitals = portalData?.healthHubVitals || getPortalSlice('healthHubVitals');
  const healthHubAllergies = portalData?.healthHubAllergies || getPortalSlice('healthHubAllergies');
  const healthHubProblems = portalData?.healthHubProblems || getPortalSlice('healthHubProblems');
  const healthHubImmunizations = portalData?.healthHubImmunizations || getPortalSlice('healthHubImmunizations');
  const healthHubClinicalMessages = portalData?.healthHubClinicalMessages || getPortalSlice('healthHubClinicalMessages');
  const healthHubPHR = portalData?.healthHubPHR || getPortalSlice('healthHubPHR');
  const healthAccessDocuments = portalData?.healthAccessDocuments || getPortalSlice('healthAccessDocuments');
  const educationDocuments = portalData?.educationDocuments || getPortalSlice('educationDocuments');
  const refillRequests = portalData?.refillRequests || getPortalSlice('refillRequests');

  const [hubTab, setHubTab] = useState('labs');
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filtered = records.filter((r) => {
    const matchFilter = activeFilter === 'All' || (filterMap[activeFilter] && r.category === filterMap[activeFilter]);
    const matchQuery =
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.type.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const pendingReview = records.filter((r) => r.status === 'Pending Review').length;

  const phrAiSummary = useMemo(
    () => generatePhrSummary(healthHubPHR, healthHubProblems),
    []
  );

  return (
    <div className="animate-fade-in">
      {selectedRecord && (
        <DetailPanel
          record={selectedRecord}
          patient={patient}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">My Records</h1>
          <p className="page-header-subtitle">
            Your health record hub · {records.length} clinical documents · {pendingReview} pending review
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '10px 12px',
          marginBottom: 20,
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {HUB_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setHubTab(t.id)}
            className={`filter-chip${hubTab === t.id ? ' active' : ''}`}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {hubTab === 'labs' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search labs, imaging, visit summaries..."
              />
              {query && (
                <X size={14} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setQuery('')} />
              )}
            </div>
          </div>

          <div className="filter-bar">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-chip${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="card">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FileText size={28} />
                </div>
                <div className="empty-state-title">No records found</div>
                <div className="empty-state-desc">Try changing your filter or search term</div>
              </div>
            ) : (
              filtered.map((record) => {
                const cat = categoryIcons[record.category] || categoryIcons.lab;
                const Icon = cat.icon;
                return (
                  <div key={record.id} className="record-item" onClick={() => setSelectedRecord(record)}>
                    <div className="record-item-icon" style={{ background: cat.bg }}>
                      <Icon size={19} color={cat.color} />
                    </div>
                    <div className="record-item-info">
                      <div className="record-item-title">{record.title}</div>
                      <div className="record-item-meta">
                        <span>{record.type}</span>
                        <span>·</span>
                        <span>{record.date}</span>
                        <span>·</span>
                        <span>{record.provider}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span className={`badge badge-${record.statusColor}`}>{record.status}</span>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {hubTab === 'vitals' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Blood pressure</th>
                <th>Heart rate</th>
                <th>Weight</th>
                <th>Temp</th>
                <th>Where</th>
              </tr>
            </thead>
            <tbody>
              {healthHubVitals.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.date}</td>
                  <td>{v.bp} mmHg</td>
                  <td>{v.heartRate} bpm</td>
                  <td>{v.weightKg} kg</td>
                  <td>{v.tempC} °C</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{v.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hubTab === 'allergies' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Allergen</th>
                <th>Reaction</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {healthHubAllergies.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.substance}</td>
                  <td>{a.reaction}</td>
                  <td>{a.severity}</td>
                  <td>
                    <span className="badge badge-warning badge-dot">{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hubTab === 'problems' && (
        <div className="grid grid-3" style={{ gap: 14 }}>
          {healthHubProblems.map((p) => (
            <div key={p.id} className="card" style={{ padding: '18px 18px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Since {p.since}</div>
              <div style={{ marginTop: 12 }}>
                <span className="badge badge-primary badge-dot">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {hubTab === 'immunizations' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Date</th>
                <th>Given at</th>
              </tr>
            </thead>
            <tbody>
              {healthHubImmunizations.map((i) => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 600 }}>{i.vaccine}</td>
                  <td>{i.date}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{i.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hubTab === 'messages' && (
        <div className="card" style={{ padding: 0 }}>
          {healthHubClinicalMessages.map((m) => (
            <div
              key={m.id}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MessageSquare size={18} color="var(--primary)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{m.date}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{m.subject}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{m.from}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>{m.preview}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hubTab === 'phr' && (
        <>
          <div
            className="card"
            style={{
              marginBottom: 18,
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
                  <div className="card-subtitle">Lifestyle and goals from your PHR fields (demo)</div>
                </div>
              </div>
              {phrAiSummary.confidence > 0 && (
                <span className="badge badge-muted" style={{ marginLeft: 'auto' }}>
                  Confidence {phrAiSummary.confidence}%
                </span>
              )}
            </div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{phrAiSummary.text}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14, marginBottom: 0, lineHeight: 1.55 }}>
                {phrAiSummary.disclaimer}
              </p>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: 14 }}>
            {healthHubPHR.map((row) => (
              <div key={row.id} className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{row.label}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{row.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Updated {row.updated}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {hubTab === 'access' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {healthAccessDocuments.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td>
                    <span className="badge badge-muted">{d.type}</span>
                  </td>
                  <td>{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hubTab === 'education' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Topic</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {educationDocuments.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.title}</td>
                  <td>{d.topic}</td>
                  <td>{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hubTab === 'consent' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {records.filter((r) => r.category === 'consent').map((r) => (
            <div key={r.id} className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ClipboardCheck size={18} color="var(--success)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{r.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>{r.date} · {r.provider}</div>
                </div>
              </div>
              <span className={`badge badge-${r.statusColor} badge-dot`}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
