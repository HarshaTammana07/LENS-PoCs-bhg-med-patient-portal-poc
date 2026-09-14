import React, { useEffect, useState } from 'react';
import { ClipboardList, Search, Filter, MoreHorizontal, AlertCircle, CheckCircle, Clock, FileText, X, Download, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MOCK_LABS = [
  { id: 'ORD-9912', patientName: 'Sarah Jenkins', mnr: '0630262C', test: 'Complete Blood Count (CBC)', status: 'Pending Review', date: '2026-04-20', priority: 'High' },
  { id: 'ORD-4482', patientName: 'Robert Miller', mnr: 'PT-19283', test: 'Lipid Profile', status: 'Completed', date: '2026-04-19', priority: 'Normal' },
  { id: 'ORD-1093', patientName: 'James Wilson', mnr: 'PT-20394', test: 'HbA1c & Fasting Glucose', status: 'Pending Review', date: '2026-04-20', priority: 'Critical' },
  { id: 'ORD-8821', patientName: 'Elizabeth Moore', mnr: 'PT-56473', test: 'Thyroid Function (TSH)', status: 'Completed', date: '2026-04-15', priority: 'Normal' },
  { id: 'ORD-3392', patientName: 'Linda Taylor', mnr: 'PT-99887', test: 'Complete Blood Count', status: 'Processing', date: '2026-04-20', priority: 'High' },
];

export default function LabOrders() {
  const { user, addToast } = useApp();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  
  // State for the Modal
  const [reviewingLab, setReviewingLab] = useState(null);

  useEffect(() => {
    const fetchLabs = async () => {
      setLoading(true);
      setLabs([...MOCK_LABS]);
      setLoading(false);
    };
    fetchLabs();
  }, [user]);

  const handleOpenReview = (lab) => {
    setReviewingLab(lab);
  };

  const handleConfirmReview = () => {
    setLabs(prev => prev.map(lab => lab.id === reviewingLab.id ? { ...lab, status: 'Completed' } : lab));
    addToast(`Lab order ${reviewingLab.id} electronically signed and completed.`, 'success');
    setReviewingLab(null); 
  };

  const handleViewReport = (id, patientName) => {
    addToast(`Opening full PDF report for ${patientName}...`, 'info');
  };

  const handleDownload = () => {
    addToast('Downloading PDF report...', 'info');
  };

  const handleShare = () => {
    addToast('Secure sharing link generated.', 'success');
  };

  const getPriorityDisplay = (priority) => {
    if (priority === 'Critical') return <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--danger)', fontWeight: 600, fontSize: 12 }}><AlertCircle size={14} /> Critical</span>;
    if (priority === 'High') return <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warning)', fontWeight: 600, fontSize: 12 }}><Clock size={14} /> High</span>;
    return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Normal</span>;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40, position: 'relative' }}>
      <header className="page-header" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ClipboardList size={28} color="var(--primary)" /> Lab Reports
          </h1>
          <p className="page-subtitle">Review incoming results and manage orders.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', width: 280 }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search by patient, test, or ID..." style={{ border: 'none', background: 'none', padding: '10px', width: '100%', fontSize: 13, outline: 'none' }} />
          </div>
          <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => { setShowFilter(!showFilter); addToast(showFilter ? 'Filters cleared.' : 'Lab order filters applied.', 'info'); }}><Filter size={16} /> Filter</button>
        </div>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Patient & Order</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Test Panel</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priority</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading lab data...</td></tr>
            ) : labs.map((lab, i) => (
              <tr key={lab.id} style={{ borderBottom: i === labs.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{lab.patientName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>MRN: {lab.mnr}</div>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>
                  {lab.test}
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>ID: {lab.id}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${lab.status === 'Completed' ? 'badge-primary' : lab.status === 'Pending Review' ? 'badge-warning' : 'badge-ghost'} badge-dot`}>
                    {lab.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  {getPriorityDisplay(lab.priority)}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {lab.date}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                    
                    {lab.status === 'Pending Review' ? (
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleOpenReview(lab)}
                        style={{ padding: '6px 12px', fontSize: 12 }}
                      >
                        <CheckCircle size={14} style={{ marginRight: 6 }} /> Review
                      </button>
                    ) : lab.status === 'Completed' ? (
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => handleViewReport(lab.id, lab.patientName)}
                        style={{ padding: '6px 12px', fontSize: 12 }}
                      >
                        <FileText size={14} style={{ marginRight: 6 }} /> Report
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '6px 12px' }}>Processing...</span>
                    )}

                    <div style={{ position: 'relative' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setActiveMenuId(activeMenuId === lab.id ? null : lab.id)}>
                        <MoreHorizontal size={16} />
                      </button>
                      {activeMenuId === lab.id && (
                        <div className="card" style={{ position: 'absolute', right: 0, top: '100%', width: 160, zIndex: 10, padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: 4 }}>
                          <div style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 4, textAlign: 'left' }} className="hover-bg" onClick={() => { addToast(`Message sent to patient for order ${lab.id}.`, 'success'); setActiveMenuId(null); }}>Message Patient</div>
                          <div style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 4, textAlign: 'left' }} className="hover-bg" onClick={() => { addToast(`Order ${lab.id} forwarded to lab department.`, 'success'); setActiveMenuId(null); }}>Forward Order</div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- REVIEW MODAL (POPUP) --- */}
      {reviewingLab && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 580, padding: 0, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Document Preview
              </div>
              <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => setReviewingLab(null)}>
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>

            {/* Document Preview Body */}
            <div style={{ padding: '0 24px 24px 24px' }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '32px 40px', border: '1px solid var(--border-light)' }}>
                
                {/* Clinic Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>BHG Health Network</h4>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Patient: {reviewingLab.patientName} · ID: {reviewingLab.mnr}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Report Date: {reviewingLab.date} · Lab Result</div>
                </div>

                {/* Monospace Lab Results */}
                <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: 13, color: '#334155' }}>
                  <div style={{ fontWeight: 700, marginBottom: 20 }}>REPORT: {reviewingLab.test.toUpperCase()} - {reviewingLab.date.toUpperCase()}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>WBC:</span><span>6.2 ×10³/μL (Ref: 4.5–11.0)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>RBC:</span><span>4.35 ×10⁶/μL (Ref: 4.1–5.1 female)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>Hemoglobin:</span><span>13.4 g/dL (Ref: 12.0–15.5 female)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>Hematocrit:</span><span>40.5% (Ref: 36–46% female)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>MCV:</span><span>89 fL (Ref: 80–96)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>Platelets:</span><span>248 ×10³/μL (Ref: 150–400)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>ANC:</span><span>3.6 ×10³/μL (Ref: 1.8–7.7)</span>
                  </div>

                  <div style={{ borderTop: '1px dashed #cbd5e1', margin: '24px 0 16px 0' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Authorized by:</span><span>Dr. Sarah Mitchell</span>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                    This document is confidential. Generated by BHG.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Left Side: Download & Share */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" onClick={handleDownload} style={{ padding: '8px 16px', fontSize: 13, background: '#fff' }}>
                  <Download size={16} style={{ marginRight: 8, color: 'var(--text-muted)' }} />
                  Download PDF
                </button>
                {/* <button className="btn btn-secondary" onClick={handleShare} style={{ padding: '8px 16px', fontSize: 13, background: '#fff' }}>
                  <Share2 size={16} style={{ marginRight: 8, color: 'var(--text-muted)' }} />
                  Share Record
                </button> */}
              </div>

              {/* Right Side: Sign Off */}
              <button className="btn btn-primary" onClick={handleConfirmReview} style={{ padding: '8px 16px', fontSize: 13 }}>
                <CheckCircle size={16} style={{ marginRight: 8 }} />
                Sign & Complete
              </button>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}