import React, { useState } from 'react';
import {
  Calendar, Clock, MapPin, CheckCircle, Circle,
  AlertTriangle, Navigation, X, Scissors, Phone, Building2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getSurgeryDaysUntil,
  isSurgeryDay as checkSurgeryDay,
  isSurgeryTomorrow,
  hasDemoParam,
  getDemoChipLabel,
  getSurgeryMeta,
  findPrimarySurgery,
  findPostOpFollowUp,
} from '../lib/surgeryDemo';

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose, danger }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            style={danger ? { background: 'var(--danger)' } : {}}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MySurgery() {
  const {
    navigate,
    addToast,
    user,
    patientAppointments,
    preOpChecklistItems = [],
    portalBundleLoading,
    portalLoadError,
    refreshPortalData,
  } = useApp();
  const surgery = findPrimarySurgery(patientAppointments, user?.workflowPatientId);
  const postOpFollowUp = findPostOpFollowUp(patientAppointments, surgery);
  const meta = getSurgeryMeta(surgery);
  const [simulateSurgeryDay, setSimulateSurgeryDay] = useState(false);
  const showSurgeryDay = checkSurgeryDay(surgery) || simulateSurgeryDay;
  const showFastingReminder = isSurgeryTomorrow(surgery) && !simulateSurgeryDay;

  const [dialog, setDialog] = useState(null);
  const [onMyWaySent, setOnMyWaySent] = useState(false);
  const [arrivedSent, setArrivedSent] = useState(false);
  const [arrivalTime, setArrivalTime] = useState(null);

  const firstName = user?.name?.split(' ')[0] || 'Sarah';
  const demoChip = getDemoChipLabel();

  const preOpItems = surgery?.preOpReadiness?.length
    ? surgery.preOpReadiness
    : preOpChecklistItems.map((item) => ({
        label: item.label,
        done: item.done,
        completedOn: item.completedOn,
      }));

  const handleOnMyWay = () => {
    setOnMyWaySent(true);
    addToast("We've notified your Care Concierge Marie that you're on your way. See you soon!", 'success');
  };

  const handleArrived = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' });
    setArrivalTime(timeStr);
    setArrivedSent(true);
    addToast(`Welcome, ${firstName}! Marie Laurent has been notified and will greet you shortly.`, 'success');
  };

  return (
    <div className="animate-fade-in">
      {dialog === 'on-my-way' && (
        <ConfirmDialog
          title="Share your location?"
          message="Share your location with Ottawa ASC so your Care Concierge knows you're on the way? You can stop sharing at any time."
          confirmLabel="Yes, share location"
          onConfirm={handleOnMyWay}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'arrived' && (
        <ConfirmDialog
          title="Confirm arrival"
          message="Confirm you have arrived at Ottawa ASC?"
          confirmLabel="Yes, I have arrived"
          onConfirm={handleArrived}
          onClose={() => setDialog(null)}
        />
      )}

      {demoChip && (
        <div
          style={{
            marginBottom: 12,
            padding: '8px 14px',
            borderRadius: 8,
            background: 'var(--bg)',
            border: '1px dashed var(--border)',
            fontSize: 12,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span>{demoChip}</span>
          {hasDemoParam() && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}>
              <input
                type="checkbox"
                checked={simulateSurgeryDay}
                onChange={(e) => setSimulateSurgeryDay(e.target.checked)}
              />
              Simulate surgery day
            </label>
          )}
        </div>
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">My Surgery</h1>
          <p className="page-header-subtitle">
            Your upcoming procedure and everything you need to prepare.
          </p>
        </div>
      </div>

      {portalLoadError && (
        <div
          className="card"
          style={{
            padding: '14px 18px',
            marginBottom: 16,
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'var(--danger-light, #fef2f2)',
          }}
        >
          <p style={{ fontSize: 14, color: 'var(--danger)', margin: '0 0 10px' }}>{portalLoadError}</p>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => refreshPortalData()}>
            Retry loading
          </button>
        </div>
      )}

      {portalBundleLoading ? (
        <div className="card" style={{ padding: '24px 22px' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Loading your surgery details…
          </p>
        </div>
      ) : !surgery ? (
        <div className="card" style={{ padding: '24px 22px' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            No surgery has been synced to your portal yet. Complete your pre-op call first, then sign in again to see your procedure details here.
          </p>
        </div>
      ) : (
      <>

      {showFastingReminder && (
        <div
          style={{
            marginBottom: 20,
            padding: '14px 18px',
            borderRadius: 12,
            background: 'var(--warning-light)',
            border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#92400e', marginBottom: 2 }}>Fasting Reminder</div>
            <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
              Please stop eating by <strong>{meta.fastingStopEating} tonight</strong> and stop drinking clear liquids by <strong>{meta.fastingStopLiquids} tomorrow</strong>.
              Take only approved medications with a small sip of water.
            </div>
          </div>
        </div>
      )}

      {showSurgeryDay && (
        <div
          style={{
            marginBottom: 20,
            padding: '22px 24px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #e6f7f0, #d1fae5)',
            border: '1px solid rgba(16,185,129,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Building2 size={22} color="#059669" />
            <div style={{ fontSize: 17, fontWeight: 800, color: '#047857', letterSpacing: '0.02em' }}>
              TODAY IS YOUR SURGERY DAY
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.55 }}>
            Your Care Concierge <strong>{meta.concierge}</strong> is expecting you.
            She will greet you when you arrive at {meta.location}.
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}
          >
            {!onMyWaySent ? (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '14px 18px', fontSize: 14, justifyContent: 'flex-start', textAlign: 'left', flexDirection: 'column', alignItems: 'flex-start', gap: 6, height: 'auto' }}
                onClick={() => setDialog('on-my-way')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                  <Navigation size={16} /> I&apos;m on my way
                </span>
                <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85, lineHeight: 1.4 }}>
                  Share my location so we&apos;re ready when you arrive
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '14px 18px', fontSize: 14, justifyContent: 'flex-start', height: 'auto' }}
                onClick={() => setOnMyWaySent(false)}
              >
                <Navigation size={16} /> Sharing location... (Stop sharing)
              </button>
            )}

            {!arrivedSent ? (
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '14px 18px', fontSize: 14, justifyContent: 'flex-start', textAlign: 'left', flexDirection: 'column', alignItems: 'flex-start', gap: 6, height: 'auto' }}
                onClick={() => setDialog('arrived')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                  <CheckCircle size={16} /> I have arrived
                </span>
                <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.9, lineHeight: 1.4 }}>
                  Let the team know you&apos;re here
                </span>
              </button>
            ) : (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 10,
                  background: 'var(--success-light)',
                  border: '1px solid rgba(22,163,74,0.25)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <CheckCircle size={16} />
                Arrival confirmed at {arrivalTime}
              </div>
            )}
          </div>

          <div style={{ fontSize: 13, color: '#065f46', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} />
            Your surgery is at {meta.procedureTime} · Please arrive by {meta.arrivalTime}
          </div>
        </div>
      )}

      {/* Primary Surgery Card */}
      <div className="card" style={{ padding: '24px 26px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Scissors size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>
                {meta.procedure}
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                {meta.surgeon} · {meta.specialty}
              </div>
            </div>
          </div>
          <span className="badge badge-success" style={{ fontSize: 12.5, padding: '5px 12px' }}>
            ● Confirmed
          </span>
        </div>

        <div className="grid grid-2" style={{ gap: 14, marginBottom: 22 }}>
          {[
            { icon: Calendar, label: 'Date', value: meta.dateShort },
            { icon: Clock, label: 'Arrival time', value: `${meta.arrivalTime}. Please arrive on time.` },
            { icon: Clock, label: 'Estimated duration', value: surgery?.duration || '45 min procedure + 2 hr recovery' },
            { icon: MapPin, label: 'Location', value: meta.address },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <row.icon size={15} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{row.label}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '16px 18px',
            borderRadius: 12,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
            Pre-Op Readiness
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {preOpItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                {item.done
                  ? <CheckCircle size={15} color="var(--success)" />
                  : <Circle size={15} color="var(--text-muted)" />}
                <span style={{ color: item.done ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: item.done ? 400 : 600 }}>
                  {item.label}
                  {item.done && item.completedOn && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>({item.completedOn})</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('pre-op-checklist')}>
            View Pre-Op Instructions
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const q = encodeURIComponent(meta.address || meta.location || 'BHG Behavioral Health');
              window.open(`https://maps.google.com/?q=${q}`, '_blank');
            }}
          >
            <MapPin size={14} /> Get Directions
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('messages')}>
            <Phone size={14} /> Message Care Concierge
          </button>
        </div>
      </div>

      </>
      )}

      {postOpFollowUp && (
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {postOpFollowUp.type}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              {postOpFollowUp.date} · {postOpFollowUp.time}
              {postOpFollowUp.mode ? ` · ${postOpFollowUp.mode}` : ''}
              {postOpFollowUp.doctor ? ` · ${postOpFollowUp.doctor}` : ''}
            </div>
          </div>
          <span className={`badge badge-${postOpFollowUp.statusColor || 'primary'}`}>
            {postOpFollowUp.status || 'Scheduled'}
          </span>
        </div>
      </div>
      )}
    </div>
  );
}
