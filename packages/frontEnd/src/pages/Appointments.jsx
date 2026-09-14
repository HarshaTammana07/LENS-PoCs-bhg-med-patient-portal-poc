import React, { useState } from 'react';
import {
  Calendar, Clock, MapPin, Video, User, ChevronRight,
  X, RefreshCw, Plus, CheckCircle, AlertCircle,
  Phone, Stethoscope, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const specialties = ['Cardiology', 'Family Medicine', 'Radiology', 'Dermatology', 'Neurology', 'Orthopedics'];
const doctors = {
  Cardiology: ['Dr. Michael Torres', 'Dr. Priya Sharma'],
  'Family Medicine': ['Dr. Sarah Mitchell', 'Dr. James Lin'],
  Radiology: ['Dr. Anika Patel', 'Dr. Roberto Fuentes'],
  Dermatology: ['Dr. Leila Hoffman', 'Dr. Chris Park'],
  Neurology: ['Dr. Elena Volkov', 'Dr. Nathan Osei'],
  Orthopedics: ['Dr. Marcus Webb', 'Dr. Fatima Al-Hassan'],
};
const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '10:30 AM', '11:30 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

function AppointmentModal({ appt, onClose, onCancel }) {
  const { addToast } = useApp();
  const handleReschedule = () => {
    addToast('Reschedule request submitted. You\'ll be contacted within 1 business day.', 'success');
    onClose();
  };
  const handleCancel = () => {
    addToast('This appointment has been canceled. You can book a new visit anytime.', 'success');
    if (onCancel) onCancel(appt.id);
    onClose();
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{appt.type}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Appointment Details</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <span className={`badge badge-${appt.statusColor}`}>{appt.status}</span>
            <span className="badge badge-muted">{appt.mode}</span>
            <span className="badge badge-muted">{appt.department}</span>
          </div>

          <div className="grid grid-2" style={{ gap: 14, marginBottom: 20 }}>
            {[
              { icon: User, label: 'Provider', value: appt.doctor },
              { icon: Stethoscope, label: 'Specialty', value: appt.specialty },
              { icon: Calendar, label: 'Date', value: appt.date },
              { icon: Clock, label: 'Time', value: `${appt.time} · ${appt.duration}` },
              { icon: appt.mode === 'Telehealth' ? Video : MapPin, label: 'Location', value: appt.location },
              { icon: Phone, label: 'Contact', value: appt.department },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <row.icon size={15} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{row.label}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{row.value}</div>
                </div>
              </div>
            ))}
          </div>

          {appt.notes && (
            <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--warning-light)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#d97706', marginBottom: 4 }}>PREPARATION NOTES</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{appt.notes}</div>
            </div>
          )}

          {appt.providerBio && (
            <div style={{ padding: '12px 14px', background: 'var(--bg)', borderRadius: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>ABOUT YOUR PROVIDER</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{appt.providerBio}</div>
            </div>
          )}
        </div>
        <div className="modal-footer" style={{ flexWrap: 'wrap', gap: 10 }}>
          {appt.upcoming && (
            <>
              <button className="btn btn-secondary" onClick={handleReschedule}>
                <RefreshCw size={14} /> Reschedule
              </button>
              <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={handleCancel}>
                <X size={14} /> Cancel appointment
              </button>
            </>
          )}
          <button className="btn btn-primary" onClick={onClose}>
            <CheckCircle size={14} /> {appt.upcoming ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ onClose }) {
  const { addToast } = useApp();
  const [step, setStep] = useState(1);
  const [spec, setSpec] = useState('');
  const [doc, setDoc] = useState('');
  const [time, setTime] = useState('');
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    setDone(true);
    setTimeout(() => {
      addToast('Appointment booked successfully! Confirmation sent to your email.', 'success');
      onClose();
    }, 2000);
  };

  if (done) return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="success-animation">
          <div className="success-circle">
            <CheckCircle size={36} color="var(--success)" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Appointment Confirmed!</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>A confirmation has been sent to your email.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Book New Appointment</div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          {/* Step indicator */}
          <div className="steps" style={{ marginBottom: 24 }}>
            {['Specialty', 'Provider', 'Date & Time'].map((label, i) => {
              const n = i + 1;
              return (
                <React.Fragment key={n}>
                  <div className="step-item">
                    <div className={`step-circle ${step > n ? 'done' : step === n ? 'active' : ''}`}>
                      {step > n ? <CheckCircle size={14} color="#fff" /> : n}
                    </div>
                    <span className={`step-label ${step > n ? 'done' : step === n ? 'active' : ''}`}>{label}</span>
                  </div>
                  {i < 2 && <div className={`step-line ${step > n ? 'done' : ''}`} />}
                </React.Fragment>
              );
            })}
          </div>

          {step === 1 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>Select a Specialty</div>
              <div className="grid grid-2" style={{ gap: 10 }}>
                {specialties.map(s => (
                  <div
                    key={s}
                    onClick={() => { setSpec(s); setDoc(''); }}
                    style={{
                      padding: '14px 16px', borderRadius: 10, border: `2px solid ${spec === s ? 'var(--primary)' : 'var(--border)'}`,
                      background: spec === s ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
                      color: spec === s ? 'var(--primary)' : 'var(--text-primary)',
                      transition: 'var(--transition)',
                    }}
                  >
                    <Stethoscope size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} />{s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && spec && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>Choose Your Provider</div>
              {(doctors[spec] || []).map(d => (
                <div
                  key={d}
                  onClick={() => setDoc(d)}
                  style={{
                    padding: '14px 16px', borderRadius: 10, border: `2px solid ${doc === d ? 'var(--primary)' : 'var(--border)'}`,
                    background: doc === d ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    marginBottom: 10, transition: 'var(--transition)',
                  }}
                >
                  <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', fontSize: 11 }}>
                    {d.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: doc === d ? 'var(--primary)' : 'var(--text-primary)' }}>{d}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{spec} · Accepting new patients</div>
                  </div>
                  {doc === d && <CheckCircle size={16} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>Select a Time Slot</div>
              <div style={{ marginBottom: 14 }}>
                <input type="date" className="input-field" defaultValue="2026-05-15" style={{ marginBottom: 12 }} />
              </div>
              <div className="grid grid-3" style={{ gap: 8 }}>
                {timeSlots.map(t => (
                  <div
                    key={t}
                    onClick={() => setTime(t)}
                    style={{
                      padding: '10px 8px', borderRadius: 8, border: `2px solid ${time === t ? 'var(--primary)' : 'var(--border)'}`,
                      background: time === t ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 600,
                      color: time === t ? 'var(--primary)' : 'var(--text-primary)',
                      transition: 'var(--transition)',
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
              {spec && doc && time && (
                <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--success-light)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', marginBottom: 6 }}>Booking Summary</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{spec} with {doc}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>May 15, 2026 at {time}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button
              className="btn btn-primary"
              disabled={(step === 1 && !spec) || (step === 2 && !doc)}
              onClick={() => setStep(step + 1)}
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button className="btn btn-primary" disabled={!time} onClick={handleConfirm}>
              <CheckCircle size={14} /> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Appointments() {
  const { patientAppointments, updateAppointment, navigate } = useApp();
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(false);
  const [hiddenIds, setHiddenIds] = useState(() => new Set());

  const upcoming = patientAppointments.filter((a) => a.upcoming && !hiddenIds.has(a.id));

  const handleCanceled = (id) => {
    setHiddenIds((prev) => new Set([...prev, id]));
    updateAppointment(id, { upcoming: false, status: 'Canceled', statusColor: 'muted' });
  };

  return (
    <div className="animate-fade-in">
      {selected && (
        <AppointmentModal appt={selected} onClose={() => setSelected(null)} onCancel={handleCanceled} />
      )}
      {booking && <BookingModal onClose={() => setBooking(false)} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-header-title">Appointments</h1>
          <p className="page-header-subtitle">
            Upcoming visits only - for past care, open{' '}
            <button type="button" className="btn btn-ghost btn-sm" style={{ padding: 0, height: 'auto', verticalAlign: 'baseline' }} onClick={() => navigate('visits')}>
              Visits
            </button>
            .
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setBooking(true)}>
            <Plus size={15} /> Book appointment
          </button>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Past care is kept separate so your schedule stays focused on what&apos;s next.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {upcoming.length === 0 ? (
          <div className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Nothing on your calendar</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Book your next visit when you&apos;re ready - past visits stay under Visits.
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setBooking(true)}>
              <Plus size={15} /> Book appointment
            </button>
          </div>
        ) : (
          upcoming.map(appt => (
            <div key={appt.id} className="appt-card" onClick={() => setSelected(appt)}>
              <div className="appt-date-block">
                <div className="appt-date-day">{appt.day}</div>
                <div className="appt-date-mon">{appt.month}</div>
              </div>
              <div className="appt-info">
                <div className="appt-title">{appt.type}</div>
                <div className="appt-doctor">{appt.doctor} · {appt.specialty}</div>
                <div className="appt-meta">
                  <div className="appt-meta-item"><Clock size={12} /> {appt.time} · {appt.duration}</div>
                  <div className="appt-meta-item">
                    {appt.mode === 'Telehealth' ? <Video size={12} /> : <MapPin size={12} />} {appt.mode}
                  </div>
                  <div className="appt-meta-item"><MapPin size={12} /> {appt.location}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                <span className={`badge badge-${appt.statusColor}`}>{appt.status}</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
