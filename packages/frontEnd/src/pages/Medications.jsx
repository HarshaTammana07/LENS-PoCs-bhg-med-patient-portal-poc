import React from 'react';
import { Pill, AlertTriangle, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MEDS = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    dosage: '10 mg tablet',
    frequency: 'Once daily in the morning',
    status: 'active',
  },
  {
    id: 'med-2',
    name: 'Atorvastatin',
    dosage: '20 mg tablet',
    frequency: 'Once daily at bedtime',
    status: 'active',
  },
  {
    id: 'med-3',
    name: 'Metformin ER',
    dosage: '500 mg tablet',
    frequency: 'Twice daily with meals',
    status: 'active',
  },
  {
    id: 'med-4',
    name: 'Hydrocortisone cream',
    dosage: '1% topical',
    frequency: 'Thin layer twice daily as needed',
    status: 'inactive',
  },
];

export default function Medications() {
  const { navigate } = useApp();
  const activeCount = MEDS.filter((m) => m.status === 'active').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Medications</h1>
          <p className="page-header-subtitle">
            {activeCount} active · {MEDS.length - activeCount} not currently used. Ask your care team before changing anything.
          </p>
        </div>
      </div>

      {/* Pre-surgery medication alert */}
      <div
        style={{
          marginBottom: 20,
          padding: '16px 20px',
          borderRadius: 12,
          background: 'var(--warning-light)',
          border: '1px solid rgba(245,158,11,0.3)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}
      >
        <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#92400e', marginBottom: 4 }}>
            Pre-Surgery Medication Notice
          </div>
          <div style={{ fontSize: 13.5, color: '#78350f', lineHeight: 1.6 }}>
            Please <strong>STOP taking Lisinopril</strong> 48 hours before your surgery (by <strong>March 16</strong>).
            Continue all other medications as usual unless advised otherwise by your care team.
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 12 }}
            onClick={() => navigate('messages')}
          >
            <MessageSquare size={13} /> Questions? Message your Nurse Navigator
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>How often</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MEDS.map((med) => (
                <tr key={med.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: med.status === 'active' ? 'var(--primary-light)' : 'var(--bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Pill size={18} color={med.status === 'active' ? 'var(--primary)' : 'var(--text-muted)'} />
                      </div>
                      <span style={{ fontWeight: 700 }}>{med.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{med.dosage}</td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 280 }}>{med.frequency}</td>
                  <td>
                    {med.status === 'active' ? (
                      <span className="badge badge-success badge-dot">Active</span>
                    ) : (
                      <span className="badge badge-muted">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
        Have a question about your medications?{' '}
        <button type="button" className="btn btn-ghost btn-sm" style={{ padding: 0, height: 'auto' }} onClick={() => navigate('messages')}>
          Message your Nurse Navigator
        </button>
        .
      </p>
    </div>
  );
}
