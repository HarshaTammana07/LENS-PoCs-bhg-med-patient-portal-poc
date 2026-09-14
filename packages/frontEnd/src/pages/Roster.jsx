import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MOCK_PATIENTS = [
  { id: 'PT-1928374', name: 'Eleanor Walsh', status: 'Active' },
  { id: 'PT-5647382', name: 'James Wilson', status: 'Inactive' },
  { id: 'PT-2039485', name: 'Michael Chen', status: 'Active' },
  { id: 'PT-9988776', name: 'Grace Hoffman', status: 'Active' },
];

export default function Roster() {
  const { addToast, mockPatients = [] } = useApp();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setLoading(true);
    const rows = (mockPatients.length ? mockPatients : MOCK_PATIENTS).map((p) => ({
      id: p.id || p.mnr,
      name: p.name,
      status: p.status || 'Active',
    }));
    setPatients(rows);
    setLoading(false);
  }, [mockPatients]);

  const updateStatus = (id, newStatus) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    setActiveMenuId(null);
    const pName = patients.find(p => p.id === id)?.name || 'Patient';
    addToast(`Status for ${pName} updated to ${newStatus}.`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      <header className="page-header" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={28} color="var(--primary)" /> My Patients
          </h1>
          <p className="page-subtitle">Manage your active patient panel and census.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', width: 250 }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search by name or MRN..." style={{ border: 'none', background: 'none', padding: '10px', width: '100%', fontSize: 13, outline: 'none' }} />
          </div>
          <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => { setShowFilter(!showFilter); addToast(showFilter ? 'Filters cleared.' : 'Patient panel filters applied.', 'info'); }}><Filter size={16} /> Filter</button>
        </div>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Patient Name</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>MRN / ID</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading census data...</td></tr>
            ) : patients.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar" style={{ width: 36, height: 36, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 14 }}>
                      {p.name ? p.name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name || 'Unknown Patient'}</div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {p.id.toString().substring(0, 8).toUpperCase()}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${p.status === 'Active' ? 'badge-success' : p.status === 'Completed' ? 'badge-primary' : 'badge-ghost'} badge-dot`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', position: 'relative' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}>
                    <MoreHorizontal size={16} />
                  </button>
                  {/* Status Dropdown Menu */}
                  {activeMenuId === p.id && (
                    <div className="card" style={{ position: 'absolute', right: 40, top: 0, width: 140, zIndex: 10, padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {['Active', 'Inactive', 'Completed'].map(status => (
                        <div key={status} onClick={() => updateStatus(p.id, status)} style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 4, textAlign: 'left' }} className="hover-bg">
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}