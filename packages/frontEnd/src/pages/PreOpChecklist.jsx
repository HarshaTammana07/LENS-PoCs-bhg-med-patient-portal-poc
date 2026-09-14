import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, MessageSquare, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPortalSlice } from '../lib/portalData';

const preOpChecklistItems = getPortalSlice('preOpChecklistItems');

const INITIAL_ITEMS = [
  {
    id: 'intake',
    label: 'Complete intake form',
    detail: 'Completed on March 5 via AI phone call',
    done: preOpChecklistItems.find((i) => i.id === 'intake')?.done ?? true,
    completedOn: 'March 5',
    source: 'via AI phone call',
    actionLabel: null,
    actionNav: null,
  },
  {
    id: 'insurance',
    label: 'Upload insurance card',
    detail: 'Front and back uploaded March 5',
    done: preOpChecklistItems.find((i) => i.id === 'insurance')?.done ?? true,
    completedOn: 'March 5',
    source: 'uploaded in portal',
    actionLabel: null,
    actionNav: null,
  },
  {
    id: 'instructions',
    label: 'Read pre-op instructions',
    detail: 'Viewed on March 10',
    done: preOpChecklistItems.find((i) => i.id === 'instructions')?.done ?? true,
    completedOn: 'March 10',
    source: 'viewed in portal',
    actionLabel: null,
    actionNav: null,
  },
  {
    id: 'consent',
    label: 'Sign consent forms',
    detail: '2 forms require your signature',
    done: preOpChecklistItems.find((i) => i.id === 'consent')?.done ?? false,
    actionLabel: 'Go to My Records →',
    actionNav: 'records',
  },
  {
    id: 'escort',
    label: 'Confirm your escort / ride home',
    detail: 'Who will drive you home after surgery?',
    done: preOpChecklistItems.find((i) => i.id === 'escort')?.done ?? false,
    actionLabel: 'Add escort details →',
    actionNav: null,
  },
  {
    id: 'fasting',
    label: 'Confirm fasting compliance',
    detail: 'Available 24 hours before surgery',
    done: preOpChecklistItems.find((i) => i.id === 'fasting')?.done ?? false,
    actionLabel: null,
    actionNav: null,
    locked: true,
  },
];

function EscortModal({ onClose, onConfirm }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Confirm Your Escort</div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            You must have a responsible adult accompany you home after your surgery. Please provide their name and phone number.
          </p>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Escort full name</label>
            <input
              className="input-field"
              placeholder="e.g. Michael Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Escort phone number</label>
            <input
              className="input-field"
              placeholder="e.g. (555) 987-6544"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!name.trim() || !phone.trim()}
            onClick={() => { onConfirm(name, phone); onClose(); }}
          >
            <CheckCircle size={14} /> Confirm Escort
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PreOpChecklist() {
  const { navigate, addToast } = useApp();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [showEscortModal, setShowEscortModal] = useState(false);

  const doneCount = items.filter((i) => i.done).length;
  const progressPct = Math.round((doneCount / items.length) * 100);

  const handleAction = (item) => {
    if (item.actionNav) {
      navigate(item.actionNav);
      return;
    }
    if (item.id === 'escort') {
      setShowEscortModal(true);
    }
  };

  const completeEscort = (name) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === 'escort'
          ? { ...i, done: true, detail: `Escort confirmed: ${name}`, completedOn: 'Today', source: 'added in portal' }
          : i
      )
    );
    addToast(`Escort confirmed: ${name}. Your care team has been notified.`, 'success');
  };

  return (
    <div className="animate-fade-in">
      {showEscortModal && (
        <EscortModal
          onClose={() => setShowEscortModal(false)}
          onConfirm={completeEscort}
        />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Pre-Op Checklist</h1>
          <p className="page-header-subtitle">
            Complete these tasks before your surgery on <strong>June 25, 2026</strong>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Progress: {doneCount} of {items.length} complete
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: doneCount === items.length ? 'var(--success)' : 'var(--primary)' }}>
            {progressPct}%
          </span>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              borderRadius: 999,
              background: doneCount === items.length ? 'var(--success)' : 'var(--primary)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        {doneCount === items.length && (
          <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 600, color: 'var(--success)' }}>
            All tasks complete. You are ready for surgery.
          </div>
        )}
      </div>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              padding: '18px 22px',
              borderTop: idx === 0 ? '1px solid var(--border)' : 'none',
              borderBottom: '1px solid var(--border)',
              borderLeft: '1px solid var(--border)',
              borderRight: '1px solid var(--border)',
              borderRadius: idx === 0 ? '12px 12px 0 0' : idx === items.length - 1 ? '0 0 12px 12px' : 0,
              background: item.done ? 'var(--bg)' : 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: item.locked ? 0.55 : 1,
            }}
          >
            <div style={{ flexShrink: 0 }}>
              {item.done
                ? <CheckCircle size={22} color="var(--success)" />
                : item.locked
                ? <Circle size={22} color="var(--text-muted)" />
                : <Circle size={22} color="var(--primary)" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: item.done ? 'var(--text-secondary)' : 'var(--text-primary)',
                  textDecoration: item.done ? 'line-through' : 'none',
                  marginBottom: 3,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                {item.done && item.completedOn
                  ? `Completed ${item.completedOn}${item.source ? ' ' + item.source : ''}`
                  : item.detail}
              </div>
            </div>
            {!item.done && !item.locked && (item.actionLabel || item.actionNav) && (
              <button
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0 }}
                onClick={() => handleAction(item)}
              >
                {item.actionLabel || 'Action'}
                <ArrowRight size={13} />
              </button>
            )}
            {item.done && (
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--success)',
                  background: 'var(--success-light)',
                  padding: '3px 10px',
                  borderRadius: 999,
                }}
              >
                Done
              </span>
            )}
            {item.locked && (
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  background: 'var(--bg)',
                  padding: '3px 10px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                }}
              >
                Unlocks Mar 17
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Help footer */}
      <div
        style={{
          marginTop: 24,
          padding: '16px 20px',
          borderRadius: 12,
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
          Need help? Message your Care Concierge <strong>Marie Laurent</strong>.
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('messages')}>
          <MessageSquare size={14} /> Message Marie
        </button>
      </div>
    </div>
  );
}
