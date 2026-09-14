import React, { useState } from 'react';
import { Pill, AlertCircle, RefreshCw, BarChart2, Plus, Sparkles, X, Activity, Box, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const INITIAL_INVENTORY = [
  { id: 1, name: 'Amoxicillin 500mg (Oral)', stock: 1200, minStock: 500, category: 'Antibiotics', lastRestock: '2026-04-10', status: 'Optimal', unit: 'Capsules' },
  { id: 2, name: 'Lisinopril 10mg (Oral)', stock: 350, minStock: 400, category: 'Cardiovascular', lastRestock: '2026-03-22', status: 'Low Stock', unit: 'Tablets' },
  { id: 3, name: 'Metformin 850mg (Oral)', stock: 2100, minStock: 1000, category: 'Antidiabetic', lastRestock: '2026-04-15', status: 'Optimal', unit: 'Tablets' },
  { id: 4, name: 'Atorvastatin 20mg (Oral)', stock: 180, minStock: 300, category: 'Statins', lastRestock: '2026-03-10', status: 'Critical', unit: 'Tablets' },
  { id: 5, name: 'Ibuprofen 400mg (Oral)', stock: 5000, minStock: 2000, category: 'Analgesics', lastRestock: '2026-04-01', status: 'Optimal', unit: 'Tablets' },
];

export default function AdminMedications() {
  const { addToast } = useApp();
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [showAI, setShowAI] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newMed, setNewMed] = useState({ name: '', category: 'Antibiotics', stock: 100, minStock: 50, unit: 'Tablets' });

  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMed.name) return addToast('Product name is required', 'error');
    
    setInventory([
      { 
        id: Date.now(), 
        name: newMed.name, 
        stock: newMed.stock, 
        minStock: newMed.minStock, 
        category: newMed.category, 
        lastRestock: new Date().toISOString().split('T')[0], 
        status: newMed.stock < newMed.minStock ? 'Critical' : 'Optimal',
        unit: newMed.unit
      },
      ...inventory
    ]);
    setShowAdd(false);
    setNewMed({ name: '', category: 'Antibiotics', stock: 100, minStock: 50, unit: 'Tablets' });
    addToast(`${newMed.name} successfully registered in system.`, 'success');
  };

  const handleUpdateMed = (updated) => {
    setInventory(prev => prev.map(item => item.id === updated.id ? {
      ...updated,
      status: updated.stock < updated.minStock ? 'Critical' : updated.stock < updated.minStock * 1.5 ? 'Low Stock' : 'Optimal'
    } : item));
    setEditItem(null);
    addToast(`${updated.name} updated successfully.`, 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return 'var(--success)';
      case 'Low Stock': return 'var(--warning)';
      case 'Critical': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.6px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Box size={28} color="var(--primary)" /> Inventory & Supply Chain
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>Pharmaceutical Stock Control • Automated Procurement • AI-Driven Restock Analysis</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" style={{ background: 'linear-gradient(135deg, #7c3aed, var(--primary))', color: '#fff', border: 'none', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)' }} onClick={() => setShowAI(true)}>
            <Sparkles size={16} /> AI Predictive Restock
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> New Asset Entry
          </button>
        </div>
      </div>

      {/* SUPPLY METRICS */}
      <div className="grid grid-4" style={{ marginBottom: 24, gap: 16 }}>
        {[
          { label: 'Active SKUs', value: '1,204', sub: '12 added this week', icon: Box, color: 'var(--primary)' },
          { label: 'Stock Alerts', value: '28', sub: 'Critical & Low Stock', icon: AlertCircle, color: 'var(--danger)' },
          { label: 'Pending Orders', value: '8', sub: 'Inbound Logistics', icon: Truck, color: 'var(--warning)' },
          { label: 'Fulfillment Rate', value: '98.5%', sub: '+1.2% efficiency', icon: CheckCircle, color: 'var(--success)' },
        ].map((m, i) => (
          <div key={i} className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={16} color={m.color} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{m.label}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{m.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* INVENTORY TABLE */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Central Pharmacy Inventory</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
              <RefreshCw size={12} /> Auto-Sync: 1m ago
            </div>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => addToast('Synchronizing local stock with fulfillment center…', 'info')}>Export Manifest</button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table table-row-hover" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th>Product Description</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min. Threshold</th>
                <th>Last Fulfillment</th>
                <th>Operational Status</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Unit: {item.unit}</div>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{item.category}</td>
                  <td style={{ fontSize: 13, fontWeight: 800 }}>{item.stock.toLocaleString()} <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{item.unit}</span></td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.minStock.toLocaleString()}</td>
                  <td style={{ fontSize: 13 }}>{item.lastRestock}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, color: getStatusColor(item.status) }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: getStatusColor(item.status) }} />
                      {item.status.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => setEditItem(item)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: 'var(--primary)' }} onClick={() => addToast(`Opening supplier portal for ${item.name}…`, 'info')}>Order More</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI ANALYSIS MODAL */}
      {showAI && (
        <div className="modal-overlay" onClick={() => setShowAI(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ overflow: 'hidden' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Sparkles size={20} />
                <div className="modal-title" style={{ color: '#fff' }}>AI Predictive Stock Analysis</div>
              </div>
              <button className="modal-close" style={{ color: '#fff' }} onClick={() => setShowAI(false)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ padding: 24 }}>
              <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 12, marginBottom: 24, border: '1px solid rgba(124, 58, 237, 0.1)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <Activity size={20} color="#7c3aed" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#7c3aed', marginBottom: 4 }}>Demand Projection Insights</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Neural analysis of local clinical trends, seasonality profiles, and current unit census suggests immediate procurement of <strong>3 high-volume items</strong> to avoid care delivery delays.
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 18, borderLeft: '4px solid var(--danger)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: 12 }}>Priority 1: Immediate Procurement</div>
                  {[
                    { name: 'Atorvastatin 20mg', reason: 'Stockout projected in 96h', qty: '500 units' },
                    { name: 'Lisinopril 10mg', reason: 'Demand surge (+21% WoW)', qty: '400 units' },
                  ].map((it, idx) => (
                    <div key={idx} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{it.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{it.reason}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>+{it.qty}</div>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ padding: 18, borderLeft: '4px solid var(--warning)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: 12 }}>Priority 2: Strategic Buffering</div>
                  {[
                    { name: 'Albuterol Inhalers', reason: 'Pollen seasonal uplift', qty: '200 units' },
                    { name: 'Flu Vaccine Batch', reason: 'Q2 immunization cycle', qty: '1,000 units' },
                  ].map((it, idx) => (
                    <div key={idx} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{it.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{it.reason}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>+{it.qty}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border-light)' }}>
              <button className="btn btn-ghost" onClick={() => setShowAI(false)}>Dismiss</button>
              <button className="btn" style={{ background: '#7c3aed', color: '#fff', border: 'none' }} onClick={() => { setShowAI(false); addToast('Electronic Purchase Orders (EPO) generated via MedSurg Gateway.', 'success'); }}>
                Generate Global Purchase Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MED MODAL */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <div className="modal-title">New Pharmaceutical Asset</div>
              <button className="modal-close" onClick={() => setShowAdd(false)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddMed} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="input-label">Product Name & Dosage</label>
                  <input type="text" className="input-field" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} placeholder="e.g. Levothyroxine 100mcg" autoFocus />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="input-label">Operational Category</label>
                    <select className="input-field" value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})}>
                      <option>Antibiotics</option>
                      <option>Cardiovascular</option>
                      <option>Antidiabetic</option>
                      <option>Analgesics</option>
                      <option>Statins</option>
                      <option>Other / Specialty</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Unit of Measure (UOM)</label>
                    <input type="text" className="input-field" value={newMed.unit} onChange={e => setNewMed({...newMed, unit: e.target.value})} placeholder="Tablets / Vials" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="input-label">Initial Stock Level</label>
                    <input type="number" className="input-field" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: parseInt(e.target.value)})} min="0" />
                  </div>
                  <div>
                    <label className="input-label">Min. Safety Stock</label>
                    <input type="number" className="input-field" value={newMed.minStock} onChange={e => setNewMed({...newMed, minStock: parseInt(e.target.value)})} min="0" />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Commit to Inventory</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* EDIT MED MODAL */}
      {editItem && (
        <div className="modal-overlay" onClick={() => setEditItem(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <div className="modal-title">Edit Pharmacy Asset</div>
              <button className="modal-close" onClick={() => setEditItem(null)}><X size={15} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateMed(editItem); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="input-label">Product Name & Dosage</label>
                  <input type="text" className="input-field" value={editItem.name} onChange={e => setEditItem({...editItem, name: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="input-label">Operational Category</label>
                    <select className="input-field" value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})}>
                      <option>Antibiotics</option>
                      <option>Cardiovascular</option>
                      <option>Antidiabetic</option>
                      <option>Analgesics</option>
                      <option>Statins</option>
                      <option>Other / Specialty</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Unit of Measure (UOM)</label>
                    <input type="text" className="input-field" value={editItem.unit} onChange={e => setEditItem({...editItem, unit: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label className="input-label">Current Stock Level</label>
                    <input type="number" className="input-field" value={editItem.stock} onChange={e => setEditItem({...editItem, stock: parseInt(e.target.value)})} min="0" />
                  </div>
                  <div>
                    <label className="input-label">Min. Safety Threshold</label>
                    <input type="number" className="input-field" value={editItem.minStock} onChange={e => setEditItem({...editItem, minStock: parseInt(e.target.value)})} min="0" />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditItem(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

