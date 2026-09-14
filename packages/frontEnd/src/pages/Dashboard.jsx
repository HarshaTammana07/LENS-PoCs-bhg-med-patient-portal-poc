import React, { useMemo, useState } from 'react';
import {
  FileText,
  CreditCard,
  MessageSquare,
  Activity,
  Stethoscope,
  ArrowRight,
  CheckCircle,
  Circle,
  Users,
  ClipboardList,
  Scissors,
  MapPin,
  AlertTriangle,
  Building2,
  Navigation,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getSurgeryDaysUntil,
  shouldShowCountdownBanner,
  getDemoChipLabel,
  getSurgeryMeta,
  findPrimarySurgery,
} from '../lib/surgeryDemo';

function StatNumber({ children, size = 32 }) {
  return (
    <span
      style={{
        fontSize: size,
        fontWeight: 800,
        color: 'var(--text-primary)',
        letterSpacing: '-0.04em',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {children}
    </span>
  );
}

function StatRow({ number, unit }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
      <StatNumber>{number}</StatNumber>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{unit}</span>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, description, meta, actionLabel, onAction, accent }) {
  return (
    <button
      type="button"
      className="card"
      onClick={onAction}
      style={{
        textAlign: 'left',
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'var(--transition)',
      }}
    >
      <div style={{ padding: '18px 18px 14px', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: accent || 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={20} color="var(--primary)" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.45 }}>
              {description}
            </div>
          </div>
        </div>
      </div>
      {meta && (
        <div style={{ padding: '0 18px 14px', fontSize: 12, color: 'var(--text-muted)' }}>{meta}</div>
      )}
      <div
        style={{
          marginTop: 'auto',
          padding: '12px 18px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'var(--bg)',
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)' }}>{actionLabel}</span>
        <ArrowRight size={15} color="var(--primary)" />
      </div>
    </button>
  );
}

// Surgery countdown banner
function SurgeryCountdownBanner({ navigate, addToast, surgery }) {
  const meta = getSurgeryMeta(surgery);
  const diffDays = getSurgeryDaysUntil(surgery);
  const [onMyWaySent, setOnMyWaySent] = useState(false);
  const [showOnMyWayConfirm, setShowOnMyWayConfirm] = useState(false);

  const isSurgeryDay = diffDays === 0;
  const isTomorrow = diffDays === 1;

  if (!shouldShowCountdownBanner(surgery)) return null;

  const handleOnMyWay = () => {
    setOnMyWaySent(true);
    setShowOnMyWayConfirm(false);
    addToast("We've notified Marie Laurent that you're on your way.", 'success');
  };

  return (
    <>
      {showOnMyWayConfirm && (
        <div className="modal-overlay" onClick={() => setShowOnMyWayConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Share your location?</div>
              <button type="button" className="modal-close" onClick={() => setShowOnMyWayConfirm(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Share your location with Ottawa ASC so your Care Concierge knows you&apos;re on the way? You can stop sharing at any time.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setShowOnMyWayConfirm(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleOnMyWay}>Yes, share location</button>
            </div>
          </div>
        </div>
      )}
    <div
      style={{
        marginBottom: 24,
        padding: '16px 20px',
        borderRadius: 14,
        background: isSurgeryDay
          ? 'linear-gradient(135deg, var(--primary-light), #ede9fe)'
          : isTomorrow
            ? 'var(--warning-light)'
            : 'linear-gradient(135deg, var(--primary-light), #ede9fe)',
        border: `1px solid ${
          isSurgeryDay
            ? 'rgba(149,92,225,0.15)'
            : isTomorrow
              ? 'rgba(245,158,11,0.3)'
              : 'rgba(149,92,225,0.15)'
        }`,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        {isSurgeryDay ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Building2 size={18} color="var(--primary)" />
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)' }}>TODAY IS YOUR SURGERY DAY</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Arrive by {meta.arrivalTime} · {meta.location}
            </div>
          </>
        ) : isTomorrow ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={18} color="#d97706" />
              <span style={{ fontSize: 15, fontWeight: 800, color: '#92400e' }}>
                Your surgery is TOMORROW — {meta.dateShort}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <div>Stop eating by {meta.fastingStopEating} tonight</div>
              <div>Stop clear liquids by {meta.fastingStopLiquids} tomorrow</div>
              <div>Arrive by {meta.arrivalTime} · Escort: {meta.escortName}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>
              Your surgery is in {diffDays} {diffDays === 1 ? 'day' : 'days'} — {meta.dateLabel}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {meta.procedure} with {meta.surgeon}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {meta.address}
            </div>
          </>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
        {isSurgeryDay ? (
          <>
            {!onMyWaySent ? (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowOnMyWayConfirm(true)}>
                <Navigation size={14} /> I&apos;m on my way
              </button>
            ) : (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOnMyWaySent(false)}>
                Sharing location... (Stop)
              </button>
            )}
            <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('my-surgery')}>
              Go to My Surgery →
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('pre-op-checklist')}>
              {isTomorrow ? 'View full instructions' : 'View pre-op instructions'}
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('messages')}>
              Message your CC
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default function Dashboard() {
  const {
    navigate,
    user,
    patientAppointments,
    patientBilling,
    addToast,
    visits = [],
    conversations = [],
    records: clinicalRecords = [],
    preOpChecklistItems = [],
  } = useApp();
  const demoChip = getDemoChipLabel();

  const visitCount = visits.length;
  const lastVisit = visits[0];

  const surgery = findPrimarySurgery(patientAppointments, user?.workflowPatientId);
  const surgeryMeta = getSurgeryMeta(surgery);
  const surgeryDate = surgery ? surgery.date : null;

  const daysUntil = getSurgeryDaysUntil(surgery);

  const unreadMessages = conversations.reduce((n, c) => n + (c.unread || 0), 0);
  const activeMeds = 3;
  const recordsCount = clinicalRecords.length;
  const statementCount = patientBilling?.statements?.length ?? 0;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const dateStr = new Date().toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const firstName = user?.name?.split(' ')[0] || 'there';

  const checklistItems = preOpChecklistItems;
  const checklistDone = checklistItems.filter((i) => i.done).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {greeting}, {firstName}
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 6 }}>{dateStr}</p>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 10, maxWidth: 640, lineHeight: 1.55 }}>
              Your Ottawa ASC surgical care hub for pre-op tasks, messages, and surgery day details.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('messages')}>
              <MessageSquare size={14} /> Message your Care Concierge
            </button>
          </div>
        </div>
      </div>

      {demoChip && (
        <div style={{ marginBottom: 12, padding: '8px 14px', borderRadius: 8, background: 'var(--bg)', border: '1px dashed var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
          {demoChip}
        </div>
      )}

      {/* Surgery Countdown Banner */}
      <SurgeryCountdownBanner navigate={navigate} addToast={addToast} surgery={surgery} />

      <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14 }}>
        Your care at a glance
      </h2>

      <div
        className="dashboard-care-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Surgery card */}
        <SummaryCard
          icon={Scissors}
          title="Your Upcoming Surgery"
          description={
            surgery ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {surgeryMeta.procedure}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {surgeryMeta.surgeon} · {surgeryMeta.specialty}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {surgeryMeta.dateShort} · {surgeryMeta.arrivalTime}
                </div>
                {daysUntil > 0 && (
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                    In {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                  </div>
                )}
              </>
            ) : (
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                No completed surgery synced yet. Complete pre-op to see your procedure here.
              </span>
            )
          }
          meta={
            surgery ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={12} /> {surgeryMeta.location}
              </span>
            ) : null
          }
          actionLabel="View surgery details"
          onAction={() => navigate('my-surgery')}
          accent="var(--primary-light)"
        />

        {/* Pre-Op Checklist card */}
        <SummaryCard
          icon={ClipboardList}
          title="Pre-Op Checklist"
          description={
            <>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                {checklistDone} of {checklistItems.length} tasks complete
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {checklistItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                    {item.done
                      ? <CheckCircle size={13} color="var(--success)" />
                      : <Circle size={13} color="var(--text-muted)" />}
                    <span style={{ color: item.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          }
          actionLabel="Complete remaining tasks"
          onAction={() => navigate('pre-op-checklist')}
          accent="var(--success-light)"
        />

        {/* Visits card */}
        <SummaryCard
          icon={Stethoscope}
          title="Visits"
          description={
            visitCount === 0 ? (
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                No visits on file yet.
              </span>
            ) : (
              <>
                <StatRow
                  number={visitCount}
                  unit={visitCount === 1 ? 'completed visit' : 'completed visits'}
                />
                {lastVisit && (
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45, display: 'block' }}>
                    Most recent: {lastVisit.date} · {lastVisit.summary}
                  </span>
                )}
              </>
            )
          }
          meta={lastVisit ? `With ${lastVisit.doctor}` : undefined}
          actionLabel="View visit history"
          onAction={() => navigate('visits')}
          accent="var(--accent-light)"
        />

        {/* Medications card */}
        <SummaryCard
          icon={ClipboardList}
          title="Medications"
          description={
            <>
              <StatRow number={activeMeds} unit="active medications" />
              <span style={{ fontSize: 12.5, color: '#d97706', lineHeight: 1.45, fontWeight: 600 }}>
                Lisinopril: stop 48 hr before surgery
              </span>
            </>
          }
          actionLabel="Review medications"
          onAction={() => navigate('medications')}
          accent="var(--warning-light)"
        />

        {/* Messages card */}
        <SummaryCard
          icon={MessageSquare}
          title="Messages"
          description={
            unreadMessages > 0 ? (
              <>
                <StatRow
                  number={unreadMessages}
                  unit={unreadMessages === 1 ? 'unread message' : 'unread messages'}
                />
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  From your care team. Secure inbox.
                </span>
              </>
            ) : (
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                You are caught up with your care team messages.
              </span>
            )
          }
          meta="Secure inbox"
          actionLabel="Open inbox"
          onAction={() => navigate('messages')}
          accent="#eef2ff"
        />

        {/* My Records card */}
        <SummaryCard
          icon={FileText}
          title="My Records"
          description={
            <>
              <StatRow
                number={recordsCount}
                unit={recordsCount === 1 ? 'document in your hub' : 'documents in your hub'}
              />
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Consent forms, lab results, assessments, and imaging.
              </span>
            </>
          }
          meta="Full health record hub"
          actionLabel="Open records"
          onAction={() => navigate('records')}
          accent="var(--accent-light)"
        />

        {/* Statements card */}
        <SummaryCard
          icon={CreditCard}
          title="Statements"
          description={
            <>
              <StatRow
                number={statementCount}
                unit={statementCount === 1 ? 'statement on file' : 'statements on file'}
              />
              {patientBilling && patientBilling.currentBalance > 0 ? (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 4 }}>
                    Balance due
                  </div>
                  <StatNumber size={26}>{`$${patientBilling.currentBalance.toFixed(2)}`}</StatNumber>
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'block', marginTop: 6 }}>
                    Due {patientBilling.dueDate}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  No outstanding balance. Thank you.
                </span>
              )}
            </>
          }
          meta="Insurance, payments, and PDF downloads"
          actionLabel="View statements"
          onAction={() => navigate('statements')}
          accent="var(--danger-light)"
        />

        {/* Your Care Team card */}
        <SummaryCard
          icon={Users}
          title="Your Care Team"
          description={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
              {[
                { name: 'Marie Laurent', role: 'Care Concierge' },
                { name: 'Dr. James Chen', role: 'Surgeon' },
                { name: 'Lisa Park, RN', role: 'Nurse Navigator' },
              ].map((member) => (
                <div key={member.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                    {member.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>— {member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          }
          actionLabel="Message Care Team"
          onAction={() => navigate('care-team')}
          accent="var(--primary-light)"
        />
      </div>

      {/* Care Journey section */}
      <div className="card" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={22} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Care journey</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                Booked → Intake Complete → Pre-Op Ready → Surgery Day → Recovering → Follow-Up Complete
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('timeline')}>
            Open timeline
          </button>
        </div>
      </div>
    </div>
  );
}





