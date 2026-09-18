import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Clock,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Filter,
  FlaskConical,
  HeartHandshake,
  HelpCircle,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Pill,
  Plus,
  Printer,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TestTube2,
  UserCheck,
  UserRound,
  UsersRound,
  Video,
  Upload,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCounselingSessionSummary, generateUdsMonitoringSummary } from '../lib/aiDemo';
import {
  getCenterMapsUrl,
  sharedCounselingSessionNotes,
  supportFaqs,
  orderHistory,
  medicationHistory,
  counselingSessions,
  defaultCbtHomework,
} from '../data/bhgPatientData';
import { DemoBanner, Field, RequestStatus, WorkflowDrawer, WorkflowModal } from '../components/PrototypeUI';

function appointmentStatusTone(status) {
  if (status === 'Upcoming') return 'primary';
  if (status === 'Completed') return 'success';
  return 'neutral';
}

function appointmentTiming(item) {
  if (item.timing) return item.timing;
  if (item.status === 'Completed') return 'past';
  return 'upcoming';
}

function isCounselingAppointment(appointment) {
  return /counseling|group/i.test(appointment?.title || '');
}

function isMedicationAppointment(appointment) {
  return /medication/i.test(appointment?.title || '');
}

function displayProviderName(provider = '') {
  return provider.replace(/,\s*LPC-MHSP\b/gi, '').replace(/,\s*LPC\b/gi, '');
}

function getSessionNotes(appointment) {
  if (appointment?.sessionNotes) return appointment.sessionNotes;
  if (isCounselingAppointment(appointment) && appointmentTiming(appointment) === 'past') {
    return sharedCounselingSessionNotes;
  }
  return null;
}

function AppointmentCard({ appointment, onDetails, onChange, onJoinVideo, onAddToCalendar }) {
  const canRequestChange = appointmentTiming(appointment) === 'upcoming' && !isMedicationAppointment(appointment);
  const isTelehealth = /telehealth|zoom/i.test(appointment?.modality || '') || /zoom/i.test(appointment?.location || '');
  const isUpcoming = appointmentTiming(appointment) === 'upcoming';

  return (
    <Card className="bhg-appointment">
      <div className="bhg-date-tile">
        <span>{appointment.dateShort.split(' ')[0]}</span>
        <strong>{appointment.dateShort.split(' ')[1]}</strong>
      </div>
      <div className="bhg-appointment-main">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <PillBadge tone={appointmentStatusTone(appointment.status)}>{appointment.status}</PillBadge>
          {isUpcoming && isTelehealth && (
            <span style={{ fontSize: '11px', background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Video size={12} /> Telehealth
            </span>
          )}
          {isUpcoming && !isTelehealth && (
            <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
              In Person · Check in at desk
            </span>
          )}
        </div>
        <h2>{appointment.title}</h2>
        <p>{displayProviderName(appointment.provider)}</p>
        <div className="bhg-meta-line">
          <span><Clock3 size={15} /> {appointment.time} · {appointment.duration}</span>
          <span><MapPin size={15} /> {appointment.location}</span>
        </div>
        <small>{appointmentTiming(appointment) === 'past' ? (appointment.visitSummary || getSessionNotes(appointment)?.focus || 'Visit completed.') : appointment.preparation}</small>
      </div>
      <div className="bhg-appointment-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        {appointment.requestStatus && <PillBadge tone="warning">{appointment.requestStatus}</PillBadge>}
        {isUpcoming && isTelehealth && (
          <button
            type="button"
            className="bhg-button"
            style={{ padding: '7px 14px', fontSize: '12px', background: '#0284C7', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => onJoinVideo(appointment)}
          >
            <Video size={14} /> Join Zoom session visit
          </button>
        )}
        <div style={{ display: 'flex', gap: '6px' }}>
          <ActionButton secondary onClick={() => onDetails(appointment)}>View details</ActionButton>
          {isUpcoming && onAddToCalendar && (
            <button
              type="button"
              className="bhg-button bhg-button-secondary"
              style={{ padding: '6px 9px', fontSize: '12px' }}
              title="Add to calendar"
              onClick={() => onAddToCalendar(appointment)}
            >
              <CalendarDays size={14} />
            </button>
          )}
        </div>
        {canRequestChange && (
          <button type="button" className="bhg-text-button" onClick={() => onChange(appointment)}>Request a change</button>
        )}
      </div>
    </Card>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="bhg-page-header">
      <div>
        {eyebrow && <div className="bhg-eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = '' }) {
  return <section className={`bhg-card ${className}`}>{children}</section>;
}

function PillBadge({ children, tone = 'neutral' }) {
  return <span className={`bhg-pill bhg-pill-${tone}`}>{children}</span>;
}

function ActionButton({ children, onClick, secondary = false }) {
  return (
    <button className={`bhg-button ${secondary ? 'bhg-button-secondary' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="bhg-section-title">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="bhg-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function requestDestination(request) {
  if (request.appointmentId) return { page: 'appointments', messageId: request.messageId };
  if (request.type === 'Financial assistance') return { page: 'payments', messageId: request.messageId };
  if (request.type === 'Consent update') return { page: 'documents' };
  return { page: 'messages', messageId: request.messageId };
}

/* ---------- Dashboard visual sub-components ---------- */

function AttendanceDonut({ rate }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (rate / 100) * circ;
  const cx = size / 2;

  return (
    <svg
      className="bhg-donut-svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${rate}% visit consistency`}
      role="img"
    >
      {/* track */}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      {/* filled arc — starts from the top (−90°) */}
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        transform={`rotate(-90 ${cx} ${cx})`}
        className="bhg-donut-arc"
      />
      <text x={cx} y={cx - 3} textAnchor="middle" className="bhg-donut-pct">{rate}%</text>
      <text x={cx} y={cx + 12} textAnchor="middle" className="bhg-donut-label">consistent</text>
    </svg>
  );
}

function WeeklyStrip({ schedule }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 8,
        marginTop: 4,
      }}
      aria-label="This week's medication schedule"
    >
      {schedule.map((item) => {
        const isToday = item.active;
        const isTakeHome = item.status === 'Take-home';

        const dayName = item.day.slice(0, 3); // Mon, Tue, Wed, Sat
        const badgeLabel = isToday
          ? 'Today'
          : isTakeHome
            ? 'Take-Home'
            : 'Clinic Visit';

        const locationTitle = isTakeHome ? 'Take-Home Bottle' : 'In-Person Dosing';
        const instructionText = isToday
          ? item.time // "Before 11:30 AM"
          : isTakeHome
            ? 'Take at home'
            : item.time; // "6:00-9:00 AM"

        return (
          <div
            key={item.date}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 10px',
              borderRadius: 10,
              border: isToday
                ? '1.5px solid #005571'
                : isTakeHome
                  ? '1px solid #BBF7D0'
                  : '1px solid #E2E8F0',
              background: isToday
                ? '#00334A'
                : isTakeHome
                  ? '#F0FDF4'
                  : '#F8FAFC',
              color: isToday ? '#FFFFFF' : '#0F172A',
              boxShadow: isToday ? '0 3px 8px rgba(0, 51, 74, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
              position: 'relative',
              textAlign: 'left',
              minHeight: 74,
              justifyContent: 'space-between',
            }}
          >
            {/* Top row: Day + Type Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: isToday ? '#87D5F2' : '#334155',
                }}
              >
                {dayName}
              </span>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 6,
                  background: isToday
                    ? 'rgba(255, 255, 255, 0.2)'
                    : isTakeHome
                      ? '#DCFCE7'
                      : '#E0F2FE',
                  color: isToday
                    ? '#FFFFFF'
                    : isTakeHome
                      ? '#15803D'
                      : '#0369A1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                {isTakeHome ? <Pill size={10} /> : isToday ? <Clock size={10} /> : <MapPin size={10} />}
                {badgeLabel}
              </span>
            </div>

            {/* Middle: Clear Action (In-Person Dosing vs Take-Home Bottle) */}
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 750,
                color: isToday ? '#FFFFFF' : '#0F172A',
                lineHeight: 1.25,
                marginTop: 4,
              }}
            >
              {locationTitle}
            </div>

            {/* Bottom: Timing or instruction */}
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: isToday ? 'rgba(255, 255, 255, 0.85)' : '#64748B',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {instructionText}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecoverySnapshot({ progress, treatment, weeklySchedule, onOpen }) {
  const latestMilestone = progress.milestones[0];

  return (
    <button type="button" className="bhg-recovery-snapshot bhg-card bhg-card-compact" onClick={onOpen}>
      <SectionTitle
        title="Recovery journey"
        description="Every day in treatment is a step forward."
        action={<span className="bhg-recovery-link">View journey <ArrowRight size={14} /></span>}
      />

      {/* Warm, simple encouragement banner */}
      <div className="bhg-encouragement-banner">
        <div className="bhg-encouragement-badge">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="bhg-encouragement-days">{progress.enrolledDays} days in recovery</div>
          <div className="bhg-encouragement-sub">{treatment.phase} achieved · 2 weekly take-home days</div>
        </div>
      </div>

      {/* Weekly schedule strip */}
      {weeklySchedule && (
        <div className="bhg-snapshot-strip-wrap">
          <span className="bhg-snapshot-strip-label">This week</span>
          <WeeklyStrip schedule={weeklySchedule} />
        </div>
      )}

      {/* Human care focus with counselor */}
      <div className="bhg-encouragement-focus">
        <HeartHandshake size={16} />
        <span>
          <strong>Active care focus:</strong> Maintaining take-home routine, counseling engagement, and coping strategies with {progress.counselor}.
        </span>
      </div>

      {latestMilestone && (
        <div className="bhg-recovery-milestone">
          <Target size={15} />
          <span><strong>Latest milestone:</strong> {latestMilestone.title} · {latestMilestone.date}</span>
        </div>
      )}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HOLD / VISIT STATUS CARD
   Maps to tbl_CHECKIN.ciHOLD + clinic RequireDarts hold logic
   ══════════════════════════════════════════════════════════════════════════ */

function HoldStatusCard({ visitHoldStatus, center, navigate }) {
  const isClear = visitHoldStatus.status === 'clear';
  const isHold = visitHoldStatus.status === 'hold';

  return (
    <div className={`bhg-hold-card bhg-hold-${visitHoldStatus.status}`} role="region" aria-label="Today's visit status">
      {/* ── Header ── */}
      <div className="bhg-hold-header">
        <div className="bhg-hold-icon-wrap" aria-hidden="true">
          {isClear
            ? <CheckCircle2 size={22} />
            : isHold
              ? <AlertCircle size={22} />
              : <Clock3 size={22} />}
        </div>
        <div className="bhg-hold-heading">
          <div className="bhg-eyebrow">Today's visit status</div>
          <h2>{visitHoldStatus.label}</h2>
          <p>{visitHoldStatus.detail}</p>
        </div>
        <div className="bhg-hold-window-badge">
          <Clock3 size={13} />
          <span>{visitHoldStatus.windowLabel}</span>
          <strong>{visitHoldStatus.windowTime}</strong>
        </div>
      </div>

      {/* ── Active holds (shown only when status = hold) ── */}
      {visitHoldStatus.holds.length > 0 && (
        <div className="bhg-hold-items">
          {visitHoldStatus.holds.map((hold) => (
            <div key={hold.type} className={`bhg-hold-item bhg-hold-item-${hold.severity}`}>
              <AlertCircle size={15} />
              <div>
                <strong>{hold.type}</strong>
                <span>{hold.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 7-day mini history ── */}
      <div className="bhg-hold-history">
        <span className="bhg-hold-history-label">Last 7 days</span>
        <div className="bhg-hold-history-strip">
          {[...visitHoldStatus.history].reverse().map((day) => (
            <div
              key={day.date}
              className={`bhg-hold-day bhg-hold-day-${day.status}`}
              title={`${day.date}: ${day.label}`}
            >
              <span className="bhg-hold-day-date">{day.date.split(' ')[1]}</span>
              <span className="bhg-hold-day-dot" aria-hidden="true" />
              <span className="bhg-hold-day-label">
                {day.status === 'clear' ? '✓' : '!'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer action ── */}
      <div className="bhg-hold-footer">
        <span className="bhg-hold-checked">
          <ShieldCheck size={13} /> Verified {visitHoldStatus.checkedAt}
        </span>
        {isHold
          ? <a href={`tel:${center.phone.replace(/\D/g, '')}`} className="bhg-hold-cta bhg-hold-cta-urgent">
            <Phone size={13} /> Call the center now
          </a>
          : <button type="button" className="bhg-hold-cta" onClick={() => navigate('medication')}>
            View schedule <ArrowRight size={13} />
          </button>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TAKE-HOME EARNED STATUS CARD
   Maps to tbl_Orders Sunday–Saturday + tbl_TakeHomeRiskAssessment
   ══════════════════════════════════════════════════════════════════════════ */

function TakeHomeStatusCard({ takeHomeDetail, navigate }) {
  const [showFactors, setShowFactors] = useState(false);
  const metCount = takeHomeDetail.earningFactors.filter((f) => f.met).length;
  const totalCount = takeHomeDetail.earningFactors.length;
  const fillPct = Math.round((takeHomeDetail.approvedDays / takeHomeDetail.maxDays) * 100);

  return (
    <div className="bhg-takehome-card" role="region" aria-label="Take-home medication status">

      {/* ── Header ── */}
      <div className="bhg-takehome-header">
        <div className="bhg-takehome-icon-wrap" aria-hidden="true"><Pill size={20} /></div>
        <div>
          <div className="bhg-eyebrow">Take-home medication</div>
          <h2>{takeHomeDetail.approvedDays} approved day{takeHomeDetail.approvedDays !== 1 ? 's' : ''} per week</h2>
          <p>Reviewed by {takeHomeDetail.assessedBy} · {takeHomeDetail.lastAssessment}</p>
        </div>
        <span className="bhg-takehome-phase-badge">{takeHomeDetail.phase}</span>
      </div>

      {/* ── Day-of-week visual ── */}
      <div className="bhg-takehome-days" aria-label="Weekly medication schedule">
        {takeHomeDetail.days.map((d) => (
          <div key={d.day} className={`bhg-th-day bhg-th-day-${d.status}`} title={`${d.label}: ${d.status}`}>
            <span className="bhg-th-day-abbrev">{d.day}</span>
            <span className="bhg-th-day-icon" aria-hidden="true">
              {d.status === 'approved' ? '🏠' : d.status === 'observed' ? '🏥' : '—'}
            </span>
            <span className="bhg-th-day-label">
              {d.status === 'approved' ? 'Home' : d.status === 'observed' ? 'Clinic' : 'Closed'}
            </span>
          </div>
        ))}
      </div>

      {/* ── Progress toward max ── */}
      <div className="bhg-takehome-progress-wrap">
        <div className="bhg-takehome-progress-labels">
          <span>Days earned</span>
          <span>{takeHomeDetail.approvedDays} of {takeHomeDetail.maxDays} possible</span>
        </div>
        <div className="bhg-takehome-progress-bar">
          <span style={{ width: `${fillPct}%` }} className="bhg-takehome-progress-fill" />
          {/* phase marker at the max */}
          <span className="bhg-takehome-phase-line" style={{ left: '100%' }} aria-hidden="true" />
        </div>
        <p className="bhg-takehome-phase-note">{takeHomeDetail.phaseSummary}</p>
      </div>

      {/* ── Earning factors accordion ── */}
      <button
        type="button"
        className="bhg-takehome-factors-toggle"
        onClick={() => setShowFactors((v) => !v)}
        aria-expanded={showFactors}
      >
        <span>
          <strong>{metCount} of {totalCount}</strong> factors currently met
        </span>
        {showFactors ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {showFactors && (
        <div className="bhg-takehome-factors">
          {takeHomeDetail.earningFactors.map((factor) => (
            <div key={factor.label} className={`bhg-th-factor bhg-th-factor-${factor.met ? 'met' : 'unmet'}`}>
              <span className="bhg-th-factor-icon" aria-hidden="true">
                {factor.met ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              </span>
              <div>
                <strong>{factor.label}</strong>
                <span>{factor.detail}</span>
              </div>
            </div>
          ))}
          <p className="bhg-th-factors-note">
            <ShieldCheck size={13} /> {takeHomeDetail.safeguardNote}
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="bhg-takehome-footer">
        <span><ShieldCheck size={13} /> {takeHomeDetail.diversion}</span>
        <button type="button" className="bhg-hold-cta" onClick={() => navigate('medication')}>
          Full schedule <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function HelpNowModal({ onClose }) {
  const { center, createRequest, addToast } = useApp();
  const [reason, setReason] = useState('I may miss today’s medication visit');
  const [details, setDetails] = useState('');
  const submit = () => {
    createRequest({ type: 'Treatment support', title: reason, detail: details || reason, page: 'messages' });
    addToast('Your support request was sent and saved in Secure messages.');
    onClose();
  };
  return (
    <WorkflowModal
      title="Need help today?"
      subtitle="Choose the safest next step. Do not change how you take medication without speaking with the center."
      onClose={onClose}
      footer={<><button className="bhg-button bhg-button-secondary" onClick={onClose}>Cancel</button><button className="bhg-button" onClick={submit}>Send non-urgent request</button></>}
    >
      <DemoBanner />
      <div className="bhg-help-actions">
        <a href={`tel:${center.phone.replace(/\D/g, '')}`}><Phone size={19} /><strong>Call BHG Knoxville</strong><span>Medication, visit, or same-day questions</span></a>
        <a href="tel:988"><HeartHandshake size={19} /><strong>Call or text 988</strong><span>Mental-health or substance-use crisis support</span></a>
        <a href="tel:911"><AlertCircle size={19} /><strong>Call 911</strong><span>Immediate danger or medical emergency</span></a>
      </div>
      <Field label="What do you need help with?">
        <select value={reason} onChange={(event) => setReason(event.target.value)}>
          <option>I may miss today’s medication visit</option>
          <option>I have a medication question</option>
          <option>I need transportation or guest-dosing guidance</option>
          <option>I need help with coverage or payment</option>
          <option>I need to contact my counselor</option>
        </select>
      </Field>
      <Field label="Additional details" hint="Do not use messages for emergencies.">
        <textarea rows="3" value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Tell the care team how they can help…" />
      </Field>
    </WorkflowModal>
  );
}

export function Dashboard() {
  const {
    patient,
    center,
    treatment,
    appointments,
    requiredActions,
    messages,
    coverage,
    workItems,
    progress,
    weeklySchedule,
    visitHoldStatus,
    labStatus,
    navigate,
  } = useApp();
  const [showHelp, setShowHelp] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const nextAppointment = appointments[0];
  const upcomingVisits = appointments.filter((appointment) => appointmentTiming(appointment) === 'upcoming');
  const followingVisits = upcomingVisits.slice(1, 4);
  const unreadMessages = messages.filter((message) => message.unread).length;
  const latestRequest = workItems[0];
  const holdSummary = visitHoldStatus.status === 'clear' ? 'No holds active' : visitHoldStatus.label;
  const shortDay = (item) => item.date.split(',')[0];
  const clinicDays = weeklySchedule
    .filter((item) => item.status !== 'Take-home')
    .map(shortDay)
    .join(', ');
  const takeHomeDays = weeklySchedule
    .filter((item) => item.status === 'Take-home')
    .map(shortDay)
    .join(', ');

  return (
    <div className="bhg-page bhg-dashboard animate-fade-in">
      <div className="bhg-dashboard-header">
        <div>
          <div className="bhg-eyebrow">Monday, September 14</div>
          <h1>Good morning, {patient.firstName}</h1>
          <p>Here’s what you need for your treatment today.</p>
        </div>
        <div className="bhg-header-actions">
          <ActionButton onClick={() => setShowHelp(true)}><Phone size={15} /> Need help today?</ActionButton>
          <ActionButton onClick={() => navigate('messages')} secondary><MessageCircle size={15} /> Message care team</ActionButton>
        </div>
      </div>

      <div className="bhg-center-strip">
        <div className="bhg-center-strip-main">
          <MapPin size={15} />
          <strong>{center.shortName}</strong>
          <PillBadge tone="success">{center.status} today</PillBadge>
        </div>
        <span className="bhg-center-strip-item">Medication window {center.medicationWindow}</span>
        <a className="bhg-center-strip-item bhg-center-strip-link" href={`tel:${center.phone.replace(/\D/g, '')}`}>
          <Phone size={14} /> {center.phone}
        </a>
        <a className="bhg-center-strip-item bhg-center-strip-link" href={getCenterMapsUrl(center)} target="_blank" rel="noreferrer">
          <Navigation size={14} /> Get directions
        </a>
        <button type="button" className="bhg-center-strip-item bhg-center-strip-link" onClick={() => navigate('center')}>
          Center hours <ArrowRight size={14} />
        </button>
      </div>

      <div className="bhg-dashboard-body">
        <div className={`bhg-dashboard-top${latestRequest ? '' : ' bhg-dashboard-top-single'}`}>
          <section className="bhg-today-hero bhg-today-hero-compact">
            <div className="bhg-today-icon"><Pill size={20} /></div>
            <div className="bhg-today-main">
              <div className="bhg-eyebrow">Today’s medication visit</div>
              <h2>Arrive before 11:30 AM</h2>
              <div className="bhg-inline-status">
                <span><ShieldCheck size={14} /> {holdSummary}</span>
                <span><Pill size={14} /> Clinic: {clinicDays}</span>
                <span><Pill size={14} /> Take-home: {takeHomeDays || 'None this week'}</span>
              </div>
            </div>
            <div className="bhg-today-actions">
              <ActionButton onClick={() => navigate('medication')}>View schedule <ArrowRight size={15} /></ActionButton>
            </div>
          </section>

          {latestRequest && (
            <button type="button" className="bhg-request-card bhg-card bhg-card-compact" onClick={() => setSelectedRequest(latestRequest)}>
              <SectionTitle
                title="Latest request"
                description={`${latestRequest.type} · ${latestRequest.created}`}
                action={<PillBadge tone={latestRequest.status === 'Resolved' ? 'success' : 'warning'}>{latestRequest.status}</PillBadge>}
              />
              <RequestStatus status={latestRequest.status} response={latestRequest.response} />
              <span className="bhg-request-card-link">View request details <ChevronRight size={15} /></span>
            </button>
          )}
        </div>

        <div className="bhg-metric-grid bhg-metric-grid-compact">
          <button className="bhg-metric" onClick={() => navigate('appointments')}>
            <span className="bhg-metric-icon"><CalendarDays size={17} /></span>
            <span className="bhg-metric-label">Next counseling visit</span>
            <strong>{nextAppointment.dateShort}</strong>
            <span>{nextAppointment.time} · In person</span>
            <ChevronRight size={16} className="bhg-metric-arrow" />
          </button>
          <button className="bhg-metric" onClick={() => navigate('treatment')}>
            <span className="bhg-metric-icon"><HeartHandshake size={17} /></span>
            <span className="bhg-metric-label">My treatment</span>
            <strong>{treatment.programShort}</strong>
            <span>{treatment.phase} · {treatment.medication}</span>
            <ChevronRight size={16} className="bhg-metric-arrow" />
          </button>
          <button className="bhg-metric" onClick={() => navigate('labs')}>
            <span className="bhg-metric-icon"><TestTube2 size={17} /></span>
            <span className="bhg-metric-label">Lab & UDS</span>
            <strong>{labStatus.latest.status}</strong>
            <span>{labStatus.latest.type} · Private review</span>
            <ChevronRight size={16} className="bhg-metric-arrow" />
          </button>
          <button className="bhg-metric" onClick={() => navigate('messages')}>
            <span className="bhg-metric-icon"><MessageCircle size={17} /></span>
            <span className="bhg-metric-label">Secure messages</span>
            <strong>{unreadMessages} unread</strong>
            <span>From your BHG care team</span>
            <ChevronRight size={16} className="bhg-metric-arrow" />
          </button>
          <button className="bhg-metric" onClick={() => navigate('payments')}>
            <span className="bhg-metric-icon"><ShieldCheck size={17} /></span>
            <span className="bhg-metric-label">Coverage</span>
            <strong>{coverage.status}</strong>
            <span>{coverage.nextPayment}</span>
            <ChevronRight size={16} className="bhg-metric-arrow" />
          </button>
        </div>

        <div className="bhg-dashboard-bottom">
          <RecoverySnapshot progress={progress} treatment={treatment} weeklySchedule={weeklySchedule} onOpen={() => navigate('progress')} />
          <Card className="bhg-card-compact bhg-dashboard-schedule">
            <SectionTitle
              title="Upcoming schedule"
              description="What’s coming up on your calendar."
              action={
                <button type="button" className="bhg-card-link-btn" onClick={() => navigate('appointments')}>
                  View all <ArrowRight size={14} />
                </button>
              }
            />
            <div className="bhg-treatment-visits">
              {followingVisits.length > 0 ? (
                followingVisits.map((appointment) => (
                  <button
                    key={appointment.id}
                    type="button"
                    className="bhg-treatment-visit-row"
                    onClick={() => navigate('appointments')}
                    aria-label={`View appointment ${appointment.title} on ${appointment.date}`}
                  >
                    <div className="bhg-date-tile compact">
                      <span>{appointment.dateShort.split(' ')[0]}</span>
                      <strong>{appointment.dateShort.split(' ')[1]}</strong>
                    </div>
                    <div>
                      <strong>{appointment.title}</strong>
                      <span>{appointment.time} · {displayProviderName(appointment.provider)}</span>
                      <small>{appointment.location} · {appointment.modality}</small>
                    </div>
                    <PillBadge tone={appointmentStatusTone(appointment.status)}>{appointment.status}</PillBadge>
                    <ChevronRight size={16} />
                  </button>
                ))
              ) : (
                <p className="bhg-body-copy" style={{ padding: '12px 6px', color: 'var(--text-muted)' }}>
                  No further visits scheduled after {nextAppointment?.dateShort}.
                </p>
              )}
            </div>
            <button type="button" className="bhg-link-row" onClick={() => navigate('appointments')}>
              Manage appointments & schedule changes <ArrowRight size={15} />
            </button>
          </Card>
        </div>
      </div>

      <div className="bhg-privacy-note">
        <LockKeyhole size={17} />
        <span>Your treatment information is private. Only you and authorized members of your care team can access it.</span>
      </div>
      {showHelp && <HelpNowModal onClose={() => setShowHelp(false)} />}
      {selectedRequest && (
        <WorkflowModal
          title={selectedRequest.title}
          subtitle={`${selectedRequest.type} · ${selectedRequest.created}`}
          onClose={() => setSelectedRequest(null)}
          footer={
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setSelectedRequest(null)}>Close</button>
              <button
                type="button"
                className="bhg-button"
                onClick={() => {
                  const destination = requestDestination(selectedRequest);
                  setSelectedRequest(null);
                  navigate(destination.page, destination.messageId ? { state: { messageId: destination.messageId } } : undefined);
                }}
              >
                {requestDestination(selectedRequest).page === 'messages' && selectedRequest.messageId
                  ? 'View in secure messages'
                  : 'Go to related page'} <ArrowRight size={15} />
              </button>
            </>
          }
        >
          <RequestStatus status={selectedRequest.status} response={selectedRequest.response} />
          <div className="bhg-request-detail">
            <strong>What you sent</strong>
            <p>{selectedRequest.detail}</p>
          </div>
        </WorkflowModal>
      )}
    </div>
  );
}

export function Treatment() {
  const { treatment, patient, careTeam, counseling, progress, center, navigate } = useApp();
  const [selectedCbtPractice, setSelectedCbtPractice] = useState(null);

  const counselor = careTeam.find((m) => m.role.toLowerCase().includes('counselor')) || careTeam[0];
  const doctor = careTeam.find((m) => m.role.toLowerCase().includes('provider')) || careTeam[1];

  const patientHomework = useMemo(() => {
    return defaultCbtHomework.filter(
      (hw) => hw.patientId === patient.id || hw.patient === patient.name
    );
  }, [patient]);

  return (
    <div className="bhg-page bhg-treatment-page animate-fade-in">
      <PageHeader
        eyebrow="My Care Plan"
        title="My Treatment"
        description="Your personalized care plan, recovery milestones, and care team."
        action={<PillBadge tone="success">{treatment.status} · {treatment.phase}</PillBadge>}
      />

      {/* Hero Care Plan Card */}
      <Card className="bhg-feature-card">
        <div className="bhg-feature-heading">
          <span className="bhg-large-icon"><HeartHandshake size={25} /></span>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <PillBadge tone="primary">{treatment.programShort}</PillBadge>
              <PillBadge tone="neutral">Phase 2: {treatment.phase}</PillBadge>
            </div>
            <h2>{treatment.program}</h2>
            <p style={{ marginTop: '2px', color: 'var(--bhg-text-muted, #64748b)' }}>
              Enrolled {patient.enrolledSince} · <strong>{patient.daysInTreatment} days</strong> in recovery
            </p>
          </div>
        </div>

        {/* Clinical Overview Grid */}
        <div className="bhg-detail-grid bhg-detail-grid-treatment" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <span>Prescription Order</span>
            <strong>{treatment.medication} {treatment.currentOrder}</strong>
            <small style={{ color: 'var(--bhg-text-muted, #64748b)' }}>Prescribed by {treatment.prescriber}</small>
          </div>
          <div>
            <span>Take-Home Privileges</span>
            <strong>{treatment.takeHomeStatus}</strong>
            <small style={{ color: 'var(--bhg-text-muted, #64748b)' }}>Tuesday & Wednesday bottles</small>
          </div>
          <div>
            <span>Next Clinical Review</span>
            <strong>{treatment.nextReview}</strong>
            <small style={{ color: 'var(--bhg-text-muted, #64748b)' }}>With {treatment.prescriber}</small>
          </div>
          <div>
            <span>Coverage & Payer</span>
            <strong>{treatment.payer}</strong>
            <small style={{ color: 'var(--bhg-text-muted, #64748b)' }}>{treatment.authorization}</small>
          </div>
        </div>

        <div className="bhg-safe-callout bhg-treatment-inline-safety" style={{ marginTop: '16px' }}>
          <AlertCircle size={18} />
          <span>{treatment.phaseSummary}</span>
        </div>
      </Card>

      {/* Two Column: Recovery Goals & Care Team */}
      <div className="bhg-two-column" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Active Treatment & Recovery Goals */}
        <Card>
          <SectionTitle
            title="Active Recovery Goals"
            description={`Goals set in collaboration with ${counselor.name}.`}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '14px 0' }}>
            {(progress?.currentGoals || []).map((goal, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  background: 'var(--bhg-bg-subtle, #f8fafc)',
                  borderRadius: '10px',
                  border: '1px solid var(--bhg-border-subtle, #e2e8f0)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13.5px', color: 'var(--bhg-text, #1e293b)' }}>{goal.title}</strong>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--bhg-primary, #005A70)' }}>{goal.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', margin: '6px 0' }}>
                  <div style={{ width: `${goal.progress}%`, height: '100%', background: 'var(--bhg-primary, #005A70)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--bhg-text-muted, #64748b)' }}>
                  <span>{goal.note}</span>
                  <span>{goal.focus}</span>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="bhg-link-row" onClick={() => navigate('progress')}>
            View full recovery progress & milestones <ArrowRight size={16} />
          </button>
        </Card>

        {/* Clinical Care Team & Support */}
        <Card>
          <SectionTitle
            title="Your Care Team"
            description="Providers guiding your medication, counseling, and recovery support."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0' }}>
            {careTeam.map((member) => {
              const avatarStyles = {
                'Alicia Monroe': { bg: '#E0F2FE', color: '#0369A1' },
                'Dr. Marcus Hill': { bg: '#F0FDF4', color: '#15803D' },
                'Danielle Brooks': { bg: '#FEF3C7', color: '#B45309' },
              }[member.name] || { bg: '#F1F5F9', color: '#475569' };

              return (
                <div
                  key={member.id || member.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: avatarStyles.bg,
                      color: avatarStyles.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      flexShrink: 0,
                    }}
                  >
                    {member.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '13.5px', color: '#0F172A', lineHeight: 1.3 }}>
                      {member.name}
                    </strong>
                    <span
                      style={{
                        fontSize: '11.5px',
                        color: '#64748B',
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '1px',
                      }}
                    >
                      {member.role} · {member.detail}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="bhg-button bhg-button-secondary"
                    style={{
                      width: 36,
                      height: 36,
                      padding: 0,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#E0F2FE',
                      color: '#0284C7',
                      border: '1px solid #BAE6FD',
                      flexShrink: 0,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    title={`Send secure message to ${member.name}`}
                    aria-label={`Send secure message to ${member.name}`}
                    onClick={() => navigate('messages')}
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '10px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <MapPin size={15} style={{ color: '#005A70', flexShrink: 0 }} />
            <span><strong>{center.shortName}:</strong> Medication window {center.medicationWindow}</span>
          </div>

          <button type="button" className="bhg-link-row" style={{ marginTop: '12px' }} onClick={() => navigate('messages')}>
            Open secure messages with care team <ArrowRight size={16} />
          </button>
        </Card>
      </div>

      {/* Between-Session CBT Practice & Counselor Feedback Card */}
      <Card>
        <SectionTitle
          title="Between-Session CBT Practice & Coping Exercises"
          description={`Evidence-based exercises assigned by your counselor, ${counselor.name}. Review feedback and log practice between visits.`}
          action={
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <PillBadge tone="primary">{patientHomework.length} Active</PillBadge>
              <PillBadge tone="success">{patientHomework.filter((h) => h.status === 'Reviewed').length} Reviewed</PillBadge>
            </div>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px', marginTop: '14px' }}>
          {patientHomework.map((hw) => (
            <div
              key={hw.id}
              style={{
                padding: '14px 16px',
                background: hw.status === 'Reviewed' ? '#F0FDF4' : 'var(--bhg-bg-subtle, #f8fafc)',
                borderRadius: '10px',
                border: hw.status === 'Reviewed' ? '1px solid #BBF7D0' : '1px solid var(--bhg-border-subtle, #e2e8f0)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>{hw.title}</strong>
                  <span className={`bhg-pill ${hw.status === 'Reviewed' ? 'bhg-pill-success' : 'bhg-pill-primary'}`} style={{ fontSize: '11px' }}>
                    {hw.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: 8 }}>
                  <span>Category: <strong>{hw.category}</strong> · Target Due: {hw.dueDate}</span>
                </div>

                {hw.counselorFeedback ? (
                  <div style={{ background: '#FFFFFF', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '10px 12px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontSize: '11.5px', fontWeight: 700, marginBottom: '3px' }}>
                      <CheckCircle2 size={13} color="#059669" /> Counselor Clinical Feedback:
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#064E3B', fontStyle: 'italic', lineHeight: 1.45 }}>
                      "{hw.counselorFeedback}"
                    </p>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#475569', background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', marginTop: '6px' }}>
                    <strong>Counselor Guidance:</strong> {hw.situation || 'Practice between sessions to reinforce coping skills.'}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="bhg-button bhg-button-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', color: '#005A70' }}
                  onClick={() => setSelectedCbtPractice(hw)}
                >
                  <FileText size={13} style={{ marginRight: 5 }} /> View Exercise & Feedback
                </button>
              </div>
            </div>
          ))}
          {!patientHomework.length && (
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
              No active exercises currently assigned. Your counselor will introduce new tools during your counseling sessions.
            </p>
          )}
        </div>
      </Card>

      {/* Selected CBT Practice Modal */}
      {selectedCbtPractice && (
        <WorkflowModal
          title={selectedCbtPractice.title}
          subtitle={`Between-Session Practice · ${selectedCbtPractice.category}`}
          onClose={() => setSelectedCbtPractice(null)}
          size="md"
          footer={
            <button type="button" className="bhg-button" onClick={() => setSelectedCbtPractice(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12.5 }}>
              <div><strong>Status:</strong> <span className={`bhg-pill ${selectedCbtPractice.status === 'Reviewed' ? 'bhg-pill-success' : 'bhg-pill-primary'}`}>{selectedCbtPractice.status}</span></div>
              <div><strong>Due Date:</strong> {selectedCbtPractice.dueDate}</div>
            </div>

            {selectedCbtPractice.counselorFeedback && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  <CheckCircle2 size={15} color="#15803D" /> Counselor Clinical Feedback
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#14532D', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{selectedCbtPractice.counselorFeedback}"
                </p>
                <div style={{ fontSize: 11, color: '#166534', marginTop: 6 }}>
                  Shared by {patient.counselor || 'Alicia Monroe, LPC'}
                </div>
              </div>
            )}

            {selectedCbtPractice.situation && (
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px' }}>
                <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'block', marginBottom: 4 }}>1. Activating Situation / Trigger</strong>
                <p style={{ margin: 0, fontSize: 12.5, color: '#334155' }}>{selectedCbtPractice.situation}</p>
              </div>
            )}

            {selectedCbtPractice.automaticThought && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 14px' }}>
                <strong style={{ fontSize: 12.5, color: '#991B1B', display: 'block', marginBottom: 4 }}>2. Automatic Thought & Identified Distortion</strong>
                <p style={{ margin: 0, fontSize: 12.5, color: '#7F1D1D', fontStyle: 'italic' }}>{selectedCbtPractice.automaticThought}</p>
                {selectedCbtPractice.cognitiveDistortion && (
                  <div style={{ fontSize: 11.5, color: '#B91C1C', marginTop: 4 }}>
                    <strong>Distortion:</strong> {selectedCbtPractice.cognitiveDistortion}
                  </div>
                )}
              </div>
            )}

            {selectedCbtPractice.rationalResponse && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '12px 14px' }}>
                <strong style={{ fontSize: 12.5, color: '#166534', display: 'block', marginBottom: 4 }}>3. Your Rational Counter-Response</strong>
                <p style={{ margin: 0, fontSize: 12.5, color: '#14532D' }}>{selectedCbtPractice.rationalResponse}</p>
              </div>
            )}

            {selectedCbtPractice.outcome && (
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 12px', fontSize: 12 }}>
                <strong>Reported Outcome:</strong> <span style={{ color: '#334155' }}>{selectedCbtPractice.outcome}</span>
              </div>
            )}
          </div>
        </WorkflowModal>
      )}

      {/* Safety, Privacy & Support */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div>
            <SectionTitle
              title="Safe Storage & Take-Home Security"
              description="Federal and clinical guidelines for your safety."
            />
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginTop: '8px' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                All take-home doses must be kept in a locked lockbox and stored securely away from children and pets.
              </p>
              <p style={{ margin: 0, color: '#005A70', fontWeight: 500 }}>
                Need a lockbox or experiencing side effects? Contact your counselor or center right away.
              </p>
            </div>
          </div>

          <div>
            <SectionTitle
              title="24/7 Recovery Support & Crisis"
              description="Immediate, confidential help whenever you need it."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Phone size={16} style={{ color: '#005A70' }} />
                <span><strong>Clinic Front Desk:</strong> {center.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Phone size={16} style={{ color: '#dc2626' }} />
                <span><strong>Suicide & Crisis Lifeline:</strong> Call or text <strong>988</strong> (Free & 24/7)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                <LockKeyhole size={14} />
                <span>Substance treatment protected under federal 42 CFR Part 2 and HIPAA.</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function Medication() {
  const { treatment, weeklySchedule, center, navigate, createRequest, addToast } = useApp();
  const [showReviewRequest, setShowReviewRequest] = useState(false);
  const [reviewReason, setReviewReason] = useState('I have a question about how I am feeling');

  const requestReview = () => {
    createRequest({
      type: 'Medication review request',
      title: 'Request review by a medical provider',
      detail: reviewReason,
      page: 'medication',
    });
    addToast('Your request was sent for clinical review. Do not change your medication routine unless instructed.');
    setShowReviewRequest(false);
  };

  return (
    <div className="bhg-page animate-fade-in">
      <PageHeader
        eyebrow="My Care"
        title="Medication Schedule"
        description="Your current medication order, dispensing hours, and weekly schedule."
        action={<PillBadge tone="success">{treatment.visitStatus}</PillBadge>}
      />

      {/* Hero Overview Card: Clean, non-repetitive */}
      <Card className="bhg-feature-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span className="bhg-large-icon"><Pill size={26} /></span>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>{treatment.medication}</h2>
                <PillBadge tone="primary">{treatment.currentOrder}</PillBadge>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--bhg-text-muted, #64748b)' }}>
                Prescribed by {treatment.prescriber} · Order verified {treatment.orderUpdated}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="bhg-button bhg-button-secondary"
              onClick={() => setShowReviewRequest(true)}
            >
              Request dose review
            </button>
          </div>
        </div>

        {/* Dispensing Window Status Bar */}
        <div
          style={{
            marginTop: '18px',
            padding: '14px 16px',
            background: '#F0F9FF',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock3 size={18} style={{ color: '#0284C7' }} />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0369A1' }}>
                Today's Dispensing Window: 5:30 AM – 11:30 AM
              </div>
              <div style={{ fontSize: '12px', color: '#0C4A6E' }}>
                {center.shortName} · Arrive before 11:30 AM for observed dosing
              </div>
            </div>
          </div>
          <PillBadge tone="success">Open today</PillBadge>
        </div>
      </Card>

      {/* Weekly Schedule Section */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <SectionTitle
            title="Weekly Dosing Routine"
            description="Clear overview of clinic-observed visits and approved take-home bottle days."
          />
        </div>

        <div className="bhg-schedule-list">
          {weeklySchedule.map((item) => {
            const isSaturday = item.day.toLowerCase().includes('saturday');
            const isTakeHome = item.status === 'Take-home';
            return (
              <div key={item.date} className={`bhg-schedule-row ${item.active ? 'active' : ''}`}>
                <div className="bhg-schedule-date">
                  <strong>{item.day}</strong>
                  <span>{item.date}</span>
                </div>
                <div className="bhg-schedule-type">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '13px' }}>{item.type}</strong>
                    {isSaturday && (
                      <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        Weekend hours
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', marginTop: '3px', color: isSaturday ? '#B45309' : 'inherit' }}>
                    {isTakeHome ? 'Take dose at home as directed · Keep in lockbox' : `Dosing window: ${item.time} at ${center.shortName}`}
                  </span>
                </div>
                <div>
                  <PillBadge tone={item.active ? 'primary' : isTakeHome ? 'success' : 'neutral'}>
                    {item.status}
                  </PillBadge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Two Column: Take-Home Protocol & Support */}
      <div className="bhg-two-column" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Safe Storage & Bottle Protocol */}
        <Card>
          <SectionTitle
            title="Take-Home Bottle Protocol"
            description="Guidelines to keep your medication safe and maintain your privileges."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', fontSize: '13px', color: '#334155' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <LockKeyhole size={16} style={{ color: '#005A70', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>Lockbox Required:</strong> All take-home doses must be carried and stored in a secure lockbox at all times.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>Bottle Returns:</strong> Bring your empty take-home bottles (with labels intact) to your Saturday clinic visit.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <ShieldCheck size={16} style={{ color: '#0284C7', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong>Safe Usage:</strong> Never double-dose or share medication. Take strictly as directed by Dr. Hill.
              </div>
            </div>
          </div>
        </Card>

        {/* Missed Visit or Assistance */}
        <Card>
          <SectionTitle
            title="Running Late or Missed Visit?"
            description="We understand life happens. Reach out right away so we can help."
          />
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginTop: '12px' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              If you miss the medication window or have travel conflicts, call the clinic desk immediately so the clinical staff can advise you on safe steps.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#005A70', marginBottom: '14px' }}>
              <Phone size={15} />
              <span>Clinic Desk: {center.phone}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                style={{ fontSize: '12.5px' }}
                onClick={() => navigate('center')}
              >
                Clinic location & hours
              </button>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                style={{ fontSize: '12.5px' }}
                onClick={() => navigate('messages')}
              >
                Message care team
              </button>
            </div>
          </div>
        </Card>
      </div>

      {showReviewRequest && (
        <WorkflowModal
          title="Request a medication review"
          subtitle="This sends a concern to the clinical team; it does not change your prescription or dose."
          onClose={() => setShowReviewRequest(false)}
          footer={<><button type="button" className="bhg-button bhg-button-secondary" onClick={() => setShowReviewRequest(false)}>Cancel</button><button type="button" className="bhg-button" onClick={requestReview}>Send for review</button></>}
        >
          <DemoBanner>For urgent symptoms or emergencies, contact the treatment center or emergency services instead of using this form.</DemoBanner>
          <Field label="What would you like the medical provider to review?">
            <select value={reviewReason} onChange={(event) => setReviewReason(event.target.value)}>
              <option>I have a question about how I am feeling</option>
              <option>I want to discuss side effects</option>
              <option>I have a medication schedule question</option>
              <option>I want to discuss my next medication-plan review</option>
            </select>
          </Field>
        </WorkflowModal>
      )}
    </div>
  );
}

export function Appointments() {
  const { appointments, appointmentProposals, counseling, respondToAppointmentProposal, createRequest, addToast } = useApp();
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('details');
  const [detailTab, setDetailTab] = useState('overview');
  const [timeTab, setTimeTab] = useState('upcoming');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTelehealth, setActiveTelehealth] = useState(null);
  const [sessionAiSummary, setSessionAiSummary] = useState(null);
  const [generatingSessionAi, setGeneratingSessionAi] = useState(false);
  const [reason, setReason] = useState('I need a different date or time');
  const [note, setNote] = useState('');

  const upcoming = appointments.filter((item) => appointmentTiming(item) === 'upcoming');
  const past = appointments.filter((item) => appointmentTiming(item) === 'past');
  const pendingOffers = (appointmentProposals || []).filter((item) => item.status === 'Awaiting patient response');
  const sessionNotes = selected ? getSessionNotes(selected) : null;

  const matchesCategory = (item) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'counseling') {
      return isCounselingAppointment(item) && !/group/i.test(item.title);
    }
    if (categoryFilter === 'medical') {
      return item.provider.includes('Dr.') || /plan review|medication/i.test(item.title);
    }
    if (categoryFilter === 'group') {
      return /group/i.test(item.title) || /telehealth|zoom/i.test(item.modality);
    }
    return true;
  };

  const filteredUpcoming = upcoming.filter(matchesCategory);
  const filteredPast = past.filter(matchesCategory);

  const closeDrawer = () => {
    setSelected(null);
    setMode('details');
    setDetailTab('overview');
    setSessionAiSummary(null);
    setGeneratingSessionAi(false);
    setReason('I need a different date or time');
    setNote('');
  };

  const openAppointment = (appointment, nextMode) => {
    setSelected(appointment);
    setMode(nextMode);
    setDetailTab('overview');
    setSessionAiSummary(null);
    setGeneratingSessionAi(false);
    setReason('I need a different date or time');
    setNote('');
  };

  const handleJoinVideo = (appointment) => {
    setActiveTelehealth(appointment);
  };

  const handleAddToCalendar = (appointment) => {
    addToast(`Added "${appointment.title}" on ${appointment.date} to your calendar.`, 'success');
  };

  const submitChange = () => {
    createRequest({
      type: 'Appointment change',
      title: selected.title,
      detail: `${reason}${note ? ` — ${note}` : ''}`,
      appointmentId: selected.id,
      page: 'appointments',
    });
    addToast('Your visit request was sent to the scheduling team.');
    closeDrawer();
  };

  const runSessionAiSummary = () => {
    if (!selected || generatingSessionAi || sessionAiSummary) return;
    setGeneratingSessionAi(true);
    window.setTimeout(() => {
      setSessionAiSummary(generateCounselingSessionSummary(selected));
      setGeneratingSessionAi(false);
      addToast('AI session summary generated.', 'info');
    }, 450);
  };

  const drawerTitle = mode === 'change' ? 'Request a visit change' : selected?.title;
  const selectedIsCounseling = isCounselingAppointment(selected);
  const selectedIsMedication = isMedicationAppointment(selected);
  const selectedTiming = selected ? appointmentTiming(selected) : null;
  const counselingTabs = selectedTiming === 'upcoming'
    ? ['overview', 'prepare', 'goals', 'message']
    : ['overview', 'goals'];
  const drawerSubtitle = selected ? `${selected.date} at ${selected.time} · ${displayProviderName(selected.provider)}` : '';

  return (
    <div className={`bhg-page bhg-appointments-page animate-fade-in ${selected ? 'drawer-open' : ''}`}>
      <PageHeader
        eyebrow="My Care"
        title="Visits"
        description="Individual counseling, doctor visits, and recovery support groups."
      />

      {/* Filter & View Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
        {/* Time Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
          <button
            type="button"
            className={`bhg-tab-btn ${timeTab === 'upcoming' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: timeTab === 'upcoming' ? 'var(--bhg-primary, #005A70)' : '#F1F5F9',
              color: timeTab === 'upcoming' ? 'white' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
            onClick={() => setTimeTab('upcoming')}
          >
            Upcoming Visits ({upcoming.length})
          </button>
          <button
            type="button"
            className={`bhg-tab-btn ${timeTab === 'past' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: timeTab === 'past' ? 'var(--bhg-primary, #005A70)' : '#F1F5F9',
              color: timeTab === 'past' ? 'white' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
            onClick={() => setTimeTab('past')}
          >
            Past Visit History ({past.length})
          </button>
          <button
            type="button"
            className={`bhg-tab-btn ${timeTab === 'all' ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: timeTab === 'all' ? 'var(--bhg-primary, #005A70)' : '#F1F5F9',
              color: timeTab === 'all' ? 'white' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
            onClick={() => setTimeTab('all')}
          >
            All Visits ({appointments.length})
          </button>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginRight: '4px' }}>Filter by type:</span>
          {[
            { id: 'all', label: 'All Types' },
            { id: 'counseling', label: 'Counseling' },
            { id: 'medical', label: 'Medical / Doctor' },
            { id: 'group', label: 'Group Sessions' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              style={{
                padding: '4px 11px',
                borderRadius: '99px',
                fontSize: '12px',
                border: categoryFilter === cat.id ? '1px solid #005A70' : '1px solid #CBD5E1',
                background: categoryFilter === cat.id ? '#E0F2FE' : 'white',
                color: categoryFilter === cat.id ? '#0369A1' : '#475569',
                fontWeight: categoryFilter === cat.id ? 600 : 400,
                cursor: 'pointer',
              }}
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>


      {pendingOffers.length > 0 && (timeTab === 'upcoming' || timeTab === 'all') && (
        <section className="bhg-appointment-section" style={{ marginBottom: '22px' }}>
          <SectionTitle title="Proposed visit" description="Reply only if this time works for you." />
          <div className="bhg-stack">
            {pendingOffers.map((proposal) => (
              <Card className="bhg-card-compact" key={proposal.id}>
                <SectionTitle title={proposal.title} description={`${proposal.date} at ${proposal.time} · ${displayProviderName(proposal.provider)}`} />
                <div className="bhg-meta-line"><span><MapPin size={15} /> {proposal.location}</span><PillBadge tone={proposal.status === 'Accepted' ? 'success' : proposal.status === 'Change requested' ? 'warning' : 'primary'}>{proposal.status}</PillBadge></div>
                <div className="bhg-lab-actions">
                  <button type="button" className="bhg-button" onClick={() => { respondToAppointmentProposal(proposal.id, 'Accepted'); addToast('Visit time accepted.'); }}>Accept time</button>
                  <button type="button" className="bhg-button bhg-button-secondary" onClick={() => { respondToAppointmentProposal(proposal.id, 'Change requested'); addToast('Your request for another time was sent.'); }}>Request another time</button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {(timeTab === 'upcoming' || timeTab === 'all') && (
        <section className="bhg-appointment-section" style={{ marginBottom: '22px' }}>
          <SectionTitle title="Upcoming Visits" description="Scheduled appointments with your counselors and providers." />
          <div className="bhg-stack">
            {filteredUpcoming.length ? filteredUpcoming.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDetails={(item) => openAppointment(item, 'details')}
                onChange={(item) => openAppointment(item, 'change')}
                onJoinVideo={handleJoinVideo}
                onAddToCalendar={handleAddToCalendar}
              />
            )) : (
              <Card className="bhg-card-compact"><p className="bhg-body-copy">No upcoming visits match your selected filter.</p></Card>
            )}
          </div>
        </section>
      )}

      {(timeTab === 'past' || timeTab === 'all') && (
        <section className="bhg-appointment-section">
          <SectionTitle title="Past Visits & Session Recaps" description="Review clinical recaps, discussed topics, and action steps." />
          <div className="bhg-stack">
            {filteredPast.length ? filteredPast.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDetails={(item) => openAppointment(item, 'details')}
                onChange={(item) => openAppointment(item, 'change')}
                onJoinVideo={handleJoinVideo}
                onAddToCalendar={handleAddToCalendar}
              />
            )) : (
              <Card className="bhg-card-compact"><p className="bhg-body-copy">No previous visits match your selected filter.</p></Card>
            )}
          </div>
        </section>
      )}

      {/* Telehealth Virtual Waiting Room Modal */}
      {activeTelehealth && (
        <WorkflowModal
          title="Secure Zoom Session Visit"
          subtitle={`${activeTelehealth.title} · ${displayProviderName(activeTelehealth.provider)}`}
          onClose={() => setActiveTelehealth(null)}
          footer={
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setActiveTelehealth(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="bhg-button"
                style={{ background: '#0284C7' }}
                onClick={() => {
                  addToast(`Connected to Zoom session visit with ${displayProviderName(activeTelehealth.provider)}. Microphone & camera active.`, 'success');
                  setActiveTelehealth(null);
                }}
              >
                <Video size={15} style={{ marginRight: '6px' }} /> Join Zoom session visit
              </button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#E0F2FE', color: '#0369A1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Video size={30} />
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '17px' }}>Zoom Virtual Waiting Room</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              {activeTelehealth.date} at {activeTelehealth.time} ({activeTelehealth.duration})
            </p>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12.5px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} style={{ color: '#16A34A' }} /> Camera & Microphone:</span>
              <strong style={{ color: '#16A34A' }}>Connected & Tested</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={15} style={{ color: '#005A70' }} /> Privacy & Security:</span>
              <strong>42 CFR Part 2 & HIPAA Encrypted</strong>
            </div>
          </div>
          <p style={{ fontSize: '11.5px', color: '#64748b', marginTop: '12px', textAlign: 'center' }}>
            Please ensure you are located in a private, quiet space in Tennessee for the duration of this session.
          </p>
        </WorkflowModal>
      )}

      {/* Visit Details & Recaps Drawer */}
      {selected && (
        <WorkflowDrawer
          title={drawerTitle}
          subtitle={drawerSubtitle}
          onClose={closeDrawer}
          size="lg"
          footer={
            mode === 'change' ? (
              <>
                <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setMode('details')}>Back</button>
                <button type="button" className="bhg-button" onClick={submitChange}>Send request</button>
              </>
            ) : (
              <>
                <button type="button" className="bhg-button bhg-button-secondary" onClick={closeDrawer}>Close</button>
                {selectedTiming === 'upcoming' && !selectedIsMedication && (
                  <button type="button" className="bhg-button" onClick={() => setMode('change')}>Request a change</button>
                )}
              </>
            )
          }
        >
          <DemoBanner>
            {sessionNotes
              ? 'Patient-facing session summary only — not counselor documentation or raw clinical notes.'
              : 'Scheduling is managed by BHG staff; change requests are reviewed by the clinic.'}
          </DemoBanner>

          {mode === 'details' && (
            <>
              {selectedIsCounseling && (
                <div className="bhg-appointment-tabs" role="tablist" aria-label="Counseling appointment details">
                  {counselingTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={detailTab === tab}
                      className={detailTab === tab ? 'active' : ''}
                      onClick={() => setDetailTab(tab)}
                    >
                      {tab === 'prepare' ? 'Preparation' : tab === 'message' ? 'Message' : tab[0].toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {(!selectedIsCounseling || detailTab === 'overview') && (
                <>
                  <div className="bhg-workflow-summary">
                    <DetailRow label="Status" value={selected.status} />
                    <DetailRow label="Provider" value={displayProviderName(selected.provider)} />
                    <DetailRow label="Location" value={selected.location} />
                    <DetailRow label="Visit type" value={selected.modality} />
                    <DetailRow label="Duration" value={selected.duration} />
                    {selectedTiming === 'upcoming' ? (
                      <div className="bhg-safe-callout"><CalendarDays size={18} /><span>{selected.preparation}</span></div>
                    ) : selected.visitSummary ? (
                      <div className="bhg-safe-callout"><CheckCircle2 size={18} /><span>{selected.visitSummary}</span></div>
                    ) : sessionNotes ? (
                      <div className="bhg-safe-callout"><MessageCircle size={18} /><span>{sessionNotes.patientSummary}</span></div>
                    ) : null}
                    {selectedTiming === 'upcoming' && /telehealth|zoom/i.test(selected.modality) && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          type="button"
                          className="bhg-button"
                          style={{ background: '#0284C7', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          onClick={() => setActiveTelehealth(selected)}
                        >
                          <Video size={16} /> Join Zoom session visit
                        </button>
                        <button type="button" className="bhg-button bhg-button-secondary" onClick={() => addToast('Telehealth device check completed.', 'success')}>
                          Test device
                        </button>
                      </div>
                    )}
                  </div>

                  {sessionNotes && (
                    <div className="bhg-session-notes bhg-session-notes-panel">
                      <h3>Counseling session summary</h3>
                      <div className="bhg-request-detail">
                        <strong>Session focus</strong>
                        <p>{sessionNotes.focus}</p>
                      </div>
                      <div>
                        <strong className="bhg-notes-label">What you discussed</strong>
                        <ul>
                          {sessionNotes.discussed.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="bhg-request-detail">
                        <strong>Next steps from your care team</strong>
                        <p>{sessionNotes.nextSteps}</p>
                      </div>
                      <button type="button" className="bhg-button bhg-button-secondary" disabled={generatingSessionAi || Boolean(sessionAiSummary)} onClick={runSessionAiSummary}>
                        <Sparkles size={15} /> {generatingSessionAi ? 'Summarizing...' : sessionAiSummary ? 'Summary ready' : 'Explain with AI'}
                      </button>
                      {sessionAiSummary && (
                        <div className="bhg-lab-ai-summary">
                          <strong><Sparkles size={15} /> AI summary · {sessionAiSummary.confidence}% confidence</strong>
                          <p>{sessionAiSummary.text}</p>
                          <small>{sessionAiSummary.disclaimer}</small>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {selectedIsCounseling && detailTab === 'prepare' && (
                <div className="bhg-session-notes bhg-session-notes-panel">
                  <h3>Before this visit</h3>
                  <div className="bhg-safe-callout"><CalendarDays size={18} /><span>{selected.preparation}</span></div>
                  <div className="bhg-topic-list">
                    {counseling.upcomingTopics.map((topic) => <div key={topic}><CheckCircle2 size={17} /><span>{topic}</span></div>)}
                  </div>
                </div>
              )}

              {selectedIsCounseling && detailTab === 'goals' && (
                <div className="bhg-session-notes bhg-session-notes-panel">
                  <h3>Counseling plan</h3>
                  <p className="bhg-body-copy">{counseling.plan}</p>
                  <DetailRow label="Counselor" value={counseling.counselor.name} />
                  <DetailRow label="Last session" value={counseling.lastSession.date} />
                  <DetailRow label="Recent focus" value={counseling.lastSession.focus} />
                </div>
              )}

              {selectedIsCounseling && selectedTiming === 'upcoming' && detailTab === 'message' && (
                <div className="bhg-session-notes bhg-session-notes-panel">
                  <h3>Message your counselor</h3>
                  <p className="bhg-body-copy">Send a simple question before this counseling visit. Urgent symptoms or emergencies should be handled by phone or emergency services.</p>
                  <button
                    type="button"
                    className="bhg-button"
                    onClick={() => {
                      createRequest({
                        type: 'Counseling question',
                        title: selected.title,
                        detail: `Question about ${selected.date} counseling visit.`,
                        appointmentId: selected.id,
                        page: 'appointments',
                      });
                      addToast('Your counseling question was sent to the care team.');
                    }}
                  >
                    Send question
                  </button>
                </div>
              )}

            </>
          )}

          {mode === 'change' && (
            <>
              <Field label="Reason">
                <select value={reason} onChange={(event) => setReason(event.target.value)}>
                  <option>I need a different date or time</option>
                  <option>I need a different visit format</option>
                  <option>I cannot attend this visit</option>
                  <option>I need transportation support</option>
                </select>
              </Field>
              <Field label="Preferred timing or additional details" hint="The clinic will confirm any schedule change.">
                <textarea rows="4" value={note} onChange={(event) => setNote(event.target.value)} placeholder="For example: mornings work best…" />
              </Field>
            </>
          )}
        </WorkflowDrawer>
      )}
    </div>
  );
}


function labStatusTone(status) {
  if (status === 'Reviewed') return 'success';
  if (status === 'Ready to review') return 'warning';
  return 'neutral';
}

export function Labs() {
  const { labStatus, navigate } = useApp();
  const [selectedScreen, setSelectedScreen] = useState(null);

  return (
    <div className="bhg-page bhg-labs-page animate-fade-in">
      <PageHeader
        eyebrow="My Care"
        title="Lab & UDS Monitoring"
        description="Private, routine treatment monitoring and counseling reviews."
        action={<PillBadge tone="success">Status: {labStatus.stats.complianceLabel}</PillBadge>}
      />

      {/* Reassuring Compliance Status Banner */}
      <div
        style={{
          padding: '16px 20px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={24} style={{ color: '#16A34A', flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '14.5px', color: '#166534', display: 'block' }}>
              You are fully on track with routine screening
            </strong>
            <span style={{ fontSize: '12.5px', color: '#15803D' }}>
              {labStatus.stats.screensThisYear} routine screens completed this year · Compliant with your MMT care plan
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#166534', background: '#DCFCE7', padding: '4px 10px', borderRadius: '99px', fontWeight: 600 }}>
            Last reviewed: {labStatus.stats.lastReviewed}
          </span>
        </div>
      </div>

      {/* Latest Screen Card: Simple, reassuring, action-oriented */}
      <Card className="bhg-feature-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span className="bhg-large-icon"><TestTube2 size={26} /></span>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>Latest Routine Screen</h2>
                <PillBadge tone="warning">{labStatus.latest.status}</PillBadge>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                Collected {labStatus.latest.collected} at {labStatus.latest.collectionSite.split(' · ')[0]}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Point Clean Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            padding: '16px',
            background: 'var(--bhg-bg-subtle, #F8FAFC)',
            borderRadius: '10px',
            border: '1px solid var(--bhg-border-subtle, #E2E8F0)',
            marginBottom: '16px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Review Counselor</span>
            <strong style={{ fontSize: '13.5px', color: '#1E293B' }}>{labStatus.latest.reviewWith}</strong>
            <small style={{ display: 'block', color: '#64748B', fontSize: '11.5px', marginTop: '2px' }}>Primary Counselor</small>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Private Discussion Planned</span>
            <strong style={{ fontSize: '13.5px', color: '#005A70' }}>{labStatus.latest.reviewWhen.split(' · ')[0]}</strong>
            <small style={{ display: 'block', color: '#64748B', fontSize: '11.5px', marginTop: '2px' }}>At your scheduled counseling session</small>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>What you need to do</span>
            <strong style={{ fontSize: '13.5px', color: '#16A34A' }}>No action required</strong>
            <small style={{ display: 'block', color: '#64748B', fontSize: '11.5px', marginTop: '2px' }}>Alicia will review this with you in person</small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="bhg-button"
            style={{ fontSize: '12.5px' }}
            onClick={() => navigate('appointments')}
          >
            <CalendarDays size={14} style={{ marginRight: '6px' }} /> View upcoming session
          </button>
          <button
            type="button"
            className="bhg-button bhg-button-secondary"
            style={{ fontSize: '12.5px' }}
            onClick={() => navigate('messages')}
          >
            <MessageCircle size={14} style={{ marginRight: '6px' }} /> Message Alicia
          </button>
        </div>
      </Card>

      {/* Reassuring Privacy Box (Replaces the essay/lecture) */}
      <div
        style={{
          padding: '14px 18px',
          background: '#F8FAFC',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <LockKeyhole size={18} style={{ color: '#005A70', flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5' }}>
          <strong>Confidential 1-on-1 Reviews:</strong> Under federal law (42 CFR Part 2) and BHG policy, laboratory results are confidential and discussed privately with your counselor to support your recovery goals.
        </span>
      </div>

      {/* Screening History */}
      <Card className="bhg-lab-history-card">
        <SectionTitle
          title="Past Screenings"
          description="Log of completed routine treatment screens on file."
        />
        <div className="bhg-lab-history">
          {labStatus.history.map((item) => (
            <button
              key={item.id}
              type="button"
              className="bhg-lab-history-row bhg-clickable-row"
              onClick={() => setSelectedScreen(item)}
              aria-label={`View details for screening ${item.id} collected on ${item.date}`}
            >
              <div className="bhg-date-tile compact">
                <span>{item.dateShort.split(' ')[0]}</span>
                <strong>{item.dateShort.split(' ')[1]}</strong>
              </div>
              <div>
                <div className="bhg-lab-history-title-row">
                  <strong>{item.type}</strong>
                  <span className="bhg-lab-id-chip">{item.id}</span>
                </div>
                <span>{item.collectionSite || item.collection} · {item.date}</span>
                <small>
                  {item.reviewedBy
                    ? `Reviewed with ${item.reviewedBy} on ${item.reviewedDate}`
                    : `Scheduled for private review with ${labStatus.latest.reviewWith}`}
                </small>
              </div>
              <PillBadge tone={labStatusTone(item.status)}>{item.status}</PillBadge>
              <ChevronRight size={16} className="bhg-row-chevron" />
            </button>
          ))}
        </div>
      </Card>

      {/* Minimal, Calm Drawer */}
      {selectedScreen && (
        <WorkflowDrawer
          title={`Screening Record · ${selectedScreen.id}`}
          subtitle={`${selectedScreen.type} collected on ${selectedScreen.date}`}
          onClose={() => setSelectedScreen(null)}
          footer={
            <div className="bhg-drawer-actions">
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => setSelectedScreen(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="bhg-button"
                onClick={() => {
                  setSelectedScreen(null);
                  navigate('messages');
                }}
              >
                <MessageCircle size={15} style={{ marginRight: '6px' }} /> Message counselor
              </button>
            </div>
          }
        >
          <div className="bhg-screening-detail-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <PillBadge tone={labStatusTone(selectedScreen.status)}>{selectedScreen.status}</PillBadge>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Specimen ID: <strong>{selectedScreen.id}</strong></span>
            </div>

            <div className="bhg-detail-grid bhg-detail-grid-treatment" style={{ marginBottom: '16px' }}>
              <div><span>Collection Date</span><strong>{selectedScreen.date}</strong></div>
              <div><span>Screen Type</span><strong>{selectedScreen.type}</strong></div>
              <div><span>Site</span><strong>{selectedScreen.collectionSite || 'BHG Knoxville'}</strong></div>
              <div><span>Reviewer</span><strong>{selectedScreen.reviewedBy || labStatus.latest.reviewWith}</strong></div>
            </div>

            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '13px', color: '#1E293B', display: 'block' }}>
                    {selectedScreen.reviewedBy ? 'Reviewed & On File' : 'Pending 1-on-1 Review'}
                  </strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                    {selectedScreen.reviewPlan || `Scheduled for private review with ${labStatus.latest.reviewWith} at your upcoming counseling session.`}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '8px', fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LockKeyhole size={14} style={{ color: '#005A70', flexShrink: 0 }} />
              <span>Protected by federal 42 CFR Part 2 regulations. Analyte values remain private to your clinical care team.</span>
            </div>
          </div>
        </WorkflowDrawer>
      )}
    </div>
  );
}


export function SupportFaq() {
  const { center, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [openFaq, setOpenFaq] = useState({});

  const toggleFaq = (key) => setOpenFaq((prev) => ({ ...prev, [key]: !prev[key] }));

  const topFaqs = [
    {
      icon: Clock,
      title: 'Missed Medication Window?',
      desc: 'Medication window closes promptly at 11:30 AM. Call the clinic immediately if delayed.',
      categoryId: 'medication',
      targetQuestion: 'miss a medication visit',
    },
    {
      icon: Pill,
      title: 'Take-Home Bottle Rules',
      desc: 'Phase 2 allows 2 bottles/week. Must be transported and stored in a locked lockbox.',
      categoryId: 'medication',
      targetQuestion: 'take-home days work',
    },
    {
      icon: Share2,
      title: 'Traveling or Moving?',
      desc: 'Request courtesy guest dosing or a permanent clinic transfer across 115+ BHG centers.',
      categoryId: 'medication',
      targetQuestion: 'dose at another clinic',
    },
    {
      icon: CreditCard,
      title: 'Copay & Financial Help',
      desc: 'Sliding fee assistance and grant programs are available so your care is never interrupted.',
      categoryId: 'coverage',
      targetQuestion: 'cannot afford my patient balance',
    },
  ];

  const filteredCategories = supportFaqs
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter((faq) => {
        if (!query) return true;
        const value = query.toLowerCase();
        return faq.q.toLowerCase().includes(value) || faq.a.toLowerCase().includes(value);
      }),
    }))
    .filter((category) => !query || category.faqs.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter((category) => category.id === activeCategory)
    : filteredCategories;

  const allVisibleKeys = displayCategories.flatMap((cat) =>
    cat.faqs.map((_, idx) => `${cat.id}-${idx}`)
  );
  const totalQuestions = allVisibleKeys.length;
  const isAllOpen = totalQuestions > 0 && allVisibleKeys.every((key) => Boolean(openFaq[key]));

  const handleToggleAll = () => {
    if (isAllOpen) {
      setOpenFaq({});
    } else {
      const next = {};
      allVisibleKeys.forEach((key) => {
        next[key] = true;
      });
      setOpenFaq(next);
    }
  };

  const handleQuickPick = (item) => {
    setActiveCategory(item.categoryId);
    setQuery('');
    const cat = supportFaqs.find((c) => c.id === item.categoryId);
    if (cat) {
      const qIndex = cat.faqs.findIndex((f) => f.q.toLowerCase().includes(item.targetQuestion.toLowerCase()));
      if (qIndex >= 0) {
        setOpenFaq((prev) => ({ ...prev, [`${item.categoryId}-${qIndex}`]: true }));
      }
    }
  };

  return (
    <div className="bhg-page bhg-faq-page animate-fade-in">
      <PageHeader
        eyebrow="Support"
        title="Help & FAQ"
        description="Quick answers about medication dosing windows, counseling, take-home bottles, and clinic policies."
      />

      {/* Top High-Priority MAT Questions for instant help */}
      {!query && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 8 }}>
            Frequently Needed Answers
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
            {topFaqs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleQuickPick(item)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    gap: 6,
                    padding: '14px 16px',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#9CCDDD';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
                    <Icon size={16} />
                    <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.title}</strong>
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{item.desc}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    View full answer <ChevronRight size={13} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Category Filter Bar */}
      <Card className="bhg-faq-search-card">
        <div className="bhg-faq-search">
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search questions about medication, counseling, UDS, coverage…"
            aria-label="Search help topics"
          />
          {query && (
            <button type="button" className="bhg-faq-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        <div className="bhg-faq-filters">
          <button type="button" className={`bhg-faq-filter ${!activeCategory ? 'active' : ''}`} onClick={() => setActiveCategory(null)}>
            All topics ({supportFaqs.reduce((sum, c) => sum + c.faqs.length, 0)})
          </button>
          {supportFaqs.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`bhg-faq-filter ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              {category.title} ({category.faqs.length})
            </button>
          ))}
        </div>
      </Card>

      {/* Accordion Controls */}
      {totalQuestions > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 650, color: 'var(--text-secondary)' }}>
            Showing {totalQuestions} {totalQuestions === 1 ? 'question' : 'questions'} {activeCategory ? `in ${supportFaqs.find((c) => c.id === activeCategory)?.title}` : 'across all topics'}
          </span>
          <button
            type="button"
            className="bhg-button bhg-button-sm bhg-button-secondary"
            style={{ fontSize: 11.5, padding: '5px 12px' }}
            onClick={handleToggleAll}
          >
            {isAllOpen ? 'Collapse all questions' : 'Expand all questions'}
          </button>
        </div>
      )}

      {/* Question Accordion Sections */}
      {displayCategories.map((category) => (
        <Card key={category.id} className="bhg-faq-section">
          <SectionTitle title={category.title} description={category.description} />
          <div className="bhg-faq-list">
            {category.faqs.map((faq, index) => {
              const key = `${category.id}-${index}`;
              const isOpen = Boolean(openFaq[key]);
              return (
                <div key={key} className={`bhg-faq-item ${isOpen ? 'open' : ''}`}>
                  <button type="button" className="bhg-faq-question" onClick={() => toggleFaq(key)} aria-expanded={isOpen}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="bhg-faq-answer">
                      <p style={{ margin: 0, lineHeight: 1.55 }}>{faq.a}</p>
                      {(faq.q.toLowerCase().includes('traveling or moving') || faq.q.toLowerCase().includes('transfer my treatment records')) && (
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="bhg-button bhg-button-secondary bhg-button-sm"
                            onClick={() => navigate('center')}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 650 }}
                          >
                            <Share2 size={13} /> Open Clinic Transfer &amp; Guest Dosing Tool &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {displayCategories.length === 0 && (
        <Card className="bhg-card-compact" style={{ textAlign: 'center', padding: '32px 20px' }}>
          <p className="bhg-body-copy" style={{ margin: 0 }}>
            No questions matched &ldquo;<strong>{query}</strong>&rdquo;.
          </p>
          <button
            type="button"
            className="bhg-button bhg-button-secondary"
            style={{ marginTop: 12, display: 'inline-flex' }}
            onClick={() => { setQuery(''); setActiveCategory(null); }}
          >
            Clear search & show all topics
          </button>
        </Card>
      )}

      {/* Instant AI Assistant Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
          padding: '12px 16px',
          background: 'var(--primary-light)',
          border: '1px solid #9CCDDD',
          borderRadius: 10,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
            Looking for personalized answers about your Phase 2 schedule, next visit, or lockbox rules?
          </span>
        </div>
        <button
          type="button"
          className="bhg-button bhg-button-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          onClick={() => {
            const launcher = document.querySelector('.bhg-chat-launcher');
            if (launcher) launcher.click();
          }}
        >
          <MessageCircle size={14} /> Ask BHG Assistant
        </button>
      </div>

      {/* Direct Contact Options */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              Can’t find what you’re looking for?
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Your care team is available to help with medication questions, appointments, and billing.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href={`tel:${center.phone.replace(/\D/g, '')}`}
              className="bhg-button bhg-button-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <Phone size={14} /> Call {center.shortName}
            </a>
            <button
              type="button"
              className="bhg-button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={() => navigate('messages')}
            >
              <MessageCircle size={14} /> Send a message
            </button>
          </div>
        </div>

        <div className="bhg-safe-callout" style={{ marginTop: 14 }}>
          <AlertCircle size={16} />
          <span>
            <strong>Need immediate help?</strong> Call or text <strong>988</strong> for free, confidential 24/7 crisis support. For medical emergencies, dial <strong>911</strong>. Secure messages are reviewed during regular clinic hours.
          </span>
        </div>
      </Card>
    </div>
  );
}

export function CareTeam() {
  const { careTeam, center, navigate } = useApp();
  return (
    <div className="bhg-page animate-fade-in">
      <PageHeader eyebrow="Support" title="My care team" description="The people supporting your treatment and recovery." />
      <div className="bhg-team-grid">
        {careTeam.map((member) => (
          <Card key={member.id} className="bhg-team-card">
            <div className="bhg-person-avatar">{member.initials}</div>
            <div><PillBadge>{member.role}</PillBadge><h2>{member.name}</h2><p>{member.detail}</p><small>{member.nextAvailable}</small></div>
            <ActionButton secondary onClick={() => navigate('messages')}><MessageCircle size={15} /> Send message</ActionButton>
          </Card>
        ))}
      </div>
      <div className="bhg-info-banner">
        <Phone size={18} />
        <span>For time-sensitive medication or visit questions, call {center.name} at {center.phone}.</span>
      </div>
    </div>
  );
}

function messageInitials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('');
}

const messageQuickReplies = [
  'Thank you — I’ll be there.',
  'Can we review my take-home schedule?',
  'I have a question about my balance.',
  'Please call me back when available.',
];

const messageRecipients = [
  { label: 'Alicia Monroe - Primary Counselor', name: 'Alicia Monroe', role: 'Primary Counselor' },
  { label: 'Danielle Brooks · Patient Financial Counselor', name: 'Danielle Brooks', role: 'Patient Financial Counselor' },
  { label: 'BHG Knoxville · Treatment Center', name: 'BHG Knoxville', role: 'Treatment Center' },
];

export function Messages() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const deepLinkHandled = useRef(false);
  const threadEndRef = useRef(null);
  const threadScrollRef = useRef(null);
  const {
    messages,
    markMessageRead,
    sendMessage,
    addToast,
    center,
    unreadMessages,
  } = useApp();
  const [selectedId, setSelectedId] = useState(() => messages.find((item) => item.unread)?.id || messages[0]?.id || null);
  const [showListOnMobile, setShowListOnMobile] = useState(() => !messages.find((item) => item.unread)?.id && !messages[0]?.id);
  const [compose, setCompose] = useState(false);
  const [recipient, setRecipient] = useState(messageRecipients[0].label);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [draft, setDraft] = useState('');
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const selected = messages.find((message) => message.id === selectedId) || null;

  const scrollThreadToBottom = (behavior = 'smooth') => {
    const node = threadScrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior });
    setShowScrollBottom(false);
  };

  const handleThreadScroll = () => {
    const node = threadScrollRef.current;
    if (!node) return;
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight;
    setShowScrollBottom(distanceFromBottom > 120);
  };

  const openThread = (message) => {
    setSelectedId(message.id);
    setShowListOnMobile(false);
    markMessageRead(message.id);
    setDraft('');
  };

  useEffect(() => {
    scrollThreadToBottom(selected?.thread?.length ? 'smooth' : 'auto');
  }, [selected?.thread?.length, selectedId]);

  useEffect(() => {
    setShowScrollBottom(false);
    scrollThreadToBottom('auto');
  }, [selectedId]);

  useEffect(() => {
    if (deepLinkHandled.current) return;
    const messageId = location.state?.messageId;
    if (!messageId) return;
    const message = messages.find((item) => item.id === messageId);
    if (!message) return;
    deepLinkHandled.current = true;
    setSelectedId(message.id);
    setShowListOnMobile(false);
    markMessageRead(message.id);
    routerNavigate('/messages', { replace: true, state: {} });
  }, [location.state?.messageId, messages, markMessageRead, routerNavigate]);

  const closeCompose = () => {
    setCompose(false);
    setBody('');
    setSubject('');
    setRecipient(messageRecipients[0].label);
  };

  const submitNewMessage = () => {
    if (!body.trim() || !subject.trim()) return;
    const recipientMeta = messageRecipients.find((item) => item.label === recipient) || messageRecipients[0];
    sendMessage({
      recipient: recipientMeta.name,
      subject: subject.trim(),
      body: body.trim(),
    });
    addToast('Your secure message was sent.');
    closeCompose();
  };

  const submitReply = (text = draft) => {
    const message = text.trim();
    if (!message || !selected) return;
    sendMessage({
      recipient: selected.from,
      subject: selected.subject,
      body: message,
      threadId: selected.id,
    });
    addToast('Your secure message was sent.');
    setDraft('');
  };

  const requestCallback = () => {
    addToast(`Callback request sent. ${center.name} will contact you during clinic hours.`, 'success');
  };

  return (
    <div className="bhg-page bhg-messages-page animate-fade-in">
      <Card className="bhg-messages-shell">
        <aside className={`bhg-messages-inbox ${showListOnMobile ? 'mobile-visible' : 'mobile-hidden'}`}>
          <div className="bhg-messages-inbox-head">
            <div>
              <span className="bhg-eyebrow">Support</span>
              <strong>Secure messages</strong>
              <p>{unreadMessages ? `${unreadMessages} unread · ` : ''}{messages.length} conversations with your care team</p>
            </div>
            <button type="button" className="bhg-button bhg-messages-inbox-new" onClick={() => setCompose(true)}>
              <Plus size={15} /> New
            </button>
          </div>

          <div className="bhg-messages-inbox-list">
            {messages.map((message) => {
              const active = message.id === selectedId;
              const threadCount = message.thread?.length || 0;
              return (
                <button
                  key={message.id}
                  type="button"
                  className={`bhg-messages-inbox-item ${active ? 'active' : ''} ${message.unread ? 'unread' : ''}`}
                  onClick={() => openThread(message)}
                >
                  <div className="bhg-messages-inbox-avatar-wrap">
                    <span className="bhg-messages-inbox-avatar">{messageInitials(message.from)}</span>
                    <span className="bhg-messages-inbox-online" aria-hidden="true" />
                  </div>
                  <div className="bhg-messages-inbox-copy">
                    <div className="bhg-messages-inbox-top">
                      <strong>{message.from}</strong>
                      <span>{message.time}</span>
                    </div>
                    <div className="bhg-messages-inbox-meta">
                      <span className="bhg-messages-inbox-role">{message.role}</span>
                      {threadCount > 1 && <span className="bhg-messages-inbox-count">{threadCount} messages</span>}
                    </div>
                    <h3>{message.subject}</h3>
                    <p>{message.preview}</p>
                  </div>
                  {message.unread && <span className="bhg-messages-inbox-unread" aria-label="Unread message" />}
                </button>
              );
            })}
          </div>

          <div className="bhg-messages-inbox-foot">
            <button type="button" className="bhg-button bhg-button-secondary bhg-messages-callback" onClick={requestCallback}>
              <Phone size={15} /> Request callback
            </button>
          </div>
        </aside>

        <section className={`bhg-messages-chat-panel ${showListOnMobile ? 'mobile-hidden' : 'mobile-visible'}`}>
          {selected ? (
            <>
              <header className="bhg-messages-chat-header">
                <button type="button" className="bhg-messages-back" onClick={() => setShowListOnMobile(true)}>
                  <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Inbox
                </button>
                <div className="bhg-messages-chat-contact">
                  <div className="bhg-person-avatar">{messageInitials(selected.from)}</div>
                  <div>
                    <strong>{selected.from}</strong>
                    <span className="bhg-messages-status">
                      <span className="bhg-messages-status-dot" aria-hidden="true" />
                      Active · {selected.role}
                    </span>
                  </div>
                </div>
                <div className="bhg-messages-chat-meta">
                  <span className="bhg-messages-chat-subject">{selected.subject}</span>
                  <span>{selected.thread?.length || 0} messages · {selected.time}</span>
                </div>
              </header>

              <div className="bhg-messages-thread-wrap">
                <div
                  ref={threadScrollRef}
                  className="bhg-messages-thread"
                  onScroll={handleThreadScroll}
                >
                  {selected.thread.map((entry) => {
                    const mine = entry.sender === 'You';
                    return (
                      <div key={entry.id} className={`bhg-messages-bubble-row ${mine ? 'mine' : ''}`}>
                        {!mine && <span className="bhg-messages-bubble-label">{entry.sender}</span>}
                        <div className={`bhg-messages-bubble ${mine ? 'sent' : 'received'}`}>{entry.text}</div>
                        <span className={`bhg-messages-bubble-time ${mine ? '' : 'received'}`}>{entry.time}</span>
                      </div>
                    );
                  })}
                  <div ref={threadEndRef} />
                </div>
                <div className="bhg-messages-thread-fade" aria-hidden="true" />
                {showScrollBottom && (
                  <button
                    type="button"
                    className="bhg-messages-scroll-bottom"
                    aria-label="Scroll to latest message"
                    onClick={() => scrollThreadToBottom('smooth')}
                  >
                    <ChevronDown size={18} />
                  </button>
                )}
              </div>

              <div className="bhg-messages-composer-dock">
                <div className="bhg-messages-quick-replies">
                  {messageQuickReplies.map((reply) => (
                    <button key={reply} type="button" className="bhg-messages-quick-chip" onClick={() => submitReply(reply)}>
                      {reply}
                    </button>
                  ))}
                </div>

                <footer className="bhg-messages-compose">
                  <textarea
                    rows="1"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a secure reply…"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        submitReply();
                      }
                    }}
                  />
                  <button type="button" className="bhg-button bhg-messages-send" disabled={!draft.trim()} onClick={() => submitReply()}>
                    <Send size={16} />
                  </button>
                  <p>Secure messages · Clinic hours only · Not for emergencies (911 / 988) · {center.phone}</p>
                </footer>
              </div>
            </>
          ) : (
            <div className="bhg-messages-empty">
              <MessageCircle size={34} />
              <strong>Select a conversation</strong>
              <span>Choose a conversation on the left or start a new secure message.</span>
            </div>
          )}
        </section>
      </Card>

      {compose && (
        <WorkflowModal
          title="New secure message"
          subtitle="Non-urgent message to your BHG care team"
          onClose={closeCompose}
          size="lg"
          footer={(
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={closeCompose}>Cancel</button>
              <button type="button" className="bhg-button" disabled={!body.trim() || !subject.trim()} onClick={submitNewMessage}>
                <Send size={15} /> Send securely
              </button>
            </>
          )}
        >
          <DemoBanner />
          <Field label="To">
            <select value={recipient} onChange={(event) => setRecipient(event.target.value)}>
              {messageRecipients.map((item) => (
                <option key={item.label}>{item.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Subject">
            <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="How can your care team help?" />
          </Field>
          <Field label="Message" hint="Messages are generally reviewed during clinic hours.">
            <textarea rows="4" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write your non-urgent message…" />
          </Field>
        </WorkflowModal>
      )}
    </div>
  );
}

function claimStatusTone(status) {
  if (status === 'Paid') return 'success';
  if (status === 'Processing') return 'warning';
  if (status === 'Denied') return 'neutral';
  return 'primary';
}

export function Payments() {
  const { coverage, careTeam, createRequest, addToast, patient, center } = useApp();
  const [activeTab, setActiveTab] = useState('claims');
  const [showHelp, setShowHelp] = useState(false);
  const [showUpdateCoverage, setShowUpdateCoverage] = useState(false);
  const [frontCardUploaded, setFrontCardUploaded] = useState(false);
  const [backCardUploaded, setBackCardUploaded] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [helpType, setHelpType] = useState('I have a question about my coverage');
  const [details, setDetails] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);

  const submit = () => {
    createRequest({ type: 'Financial assistance', title: helpType, detail: details || helpType, page: 'payments' });
    addToast('Your financial-support request was sent.');
    setShowHelp(false);
  };

  const handleSubmitCoverageUpdate = () => {
    createRequest({
      type: 'Insurance update',
      title: `Insurance Card Upload: ${payerName || 'Updated Card'}`,
      detail: `Front card: ${frontCardUploaded ? 'Uploaded' : 'Provided'}, Back card: ${backCardUploaded ? 'Uploaded' : 'Provided'}. Member ID: ${newMemberId || 'On Card'}.`,
      page: 'payments',
    });
    addToast('Insurance card submitted. Our team usually confirms within 2 business days.', 'success');
    setShowUpdateCoverage(false);
    setFrontCardUploaded(false);
    setBackCardUploaded(false);
    setPayerName('');
    setNewMemberId('');
  };

  const payBalance = () => {
    addToast('Demo payment submitted. Your balance will update after processing.', 'success');
  };

  const financialCounselor = careTeam.find((m) => m.role.toLowerCase().includes('financial')) || careTeam[2] || {
    name: 'David Morales',
    role: 'Patient Financial Counselor',
    initials: 'DM',
  };

  return (
    <div className="bhg-page bhg-payments-page animate-fade-in">
      <PageHeader
        eyebrow="Account"
        title="Coverage & payments"
        description="Active insurance, current patient balance, and your complete billing history."
        action={<PillBadge tone={coverage.balance > 0 ? 'warning' : 'success'}>{coverage.balanceStatus}</PillBadge>}
      />

      {/* ── Top Summary Grid: Patient Balance & Active Coverage Side-by-Side ── */}
      <div className="bhg-two-column" style={{ marginBottom: 18 }}>
        {/* Card 1: Balance & Immediate Payment Actions */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Current Patient Balance
                </span>
                <div style={{ fontSize: 32, fontWeight: 800, color: coverage.balance > 0 ? 'var(--text-primary)' : 'var(--primary)', lineHeight: 1.15, marginTop: 2 }}>
                  ${coverage.balance.toFixed(2)}
                </div>
              </div>
              <PillBadge tone={coverage.balance > 0 ? 'warning' : 'success'}>
                {coverage.balanceStatus}
              </PillBadge>
            </div>

            <p style={{ margin: '0 0 14px 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
              {coverage.nextPayment} &middot; <strong style={{ color: 'var(--text-primary)' }}>Due {coverage.dueDate}</strong>
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              <button
                type="button"
                className="bhg-button"
                onClick={payBalance}
                disabled={coverage.balance <= 0}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <CreditCard size={15} /> Pay ${coverage.balance.toFixed(2)} now
              </button>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => setShowHelp(true)}
              >
                Request financial help
              </button>
            </div>
          </div>

          {/* Counselor & Sliding Scale Assurance Note */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 4,
            }}
          >
            <div className="bhg-person-avatar" style={{ width: 32, height: 32, fontSize: 11, flexShrink: 0 }}>
              {financialCounselor.initials}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong>{financialCounselor.name}</strong> &middot; {financialCounselor.role}
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                Treatment is never interrupted for cost. Sliding fee & grant assistance available.
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Active Insurance & Policy Details */}
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {coverage.payer}
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{coverage.planType}</span>
                </div>
              </div>
              <PillBadge tone="success">{coverage.status}</PillBadge>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '10px 14px',
                padding: '12px 14px',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Member ID</span>
                <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{coverage.memberId}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Group #</span>
                <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{coverage.groupNumber}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Authorization</span>
                <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{coverage.authorization}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Plan Paid YTD</span>
                <strong style={{ fontSize: 12.5, color: '#166534' }}>${coverage.summary.insurancePaidYtd.toFixed(0)}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: 'var(--text-muted)', paddingTop: 4 }}>
            <span>Last verified {coverage.verified}</span>
            <button
              type="button"
              className="bhg-text-button"
              style={{ fontSize: 11.5 }}
              onClick={() => setShowUpdateCoverage(true)}
            >
              Update insurance card &rarr;
            </button>
          </div>
        </Card>
      </div>

      {/* ── Transaction History Tabs: Claims, Payments, Statements ── */}
      <Card style={{ padding: '18px 20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`bhg-faq-filter ${activeTab === 'claims' ? 'active' : ''}`}
              onClick={() => setActiveTab('claims')}
              style={{ padding: '7px 14px', fontSize: 12, borderRadius: 8 }}
            >
              Recent Claims ({coverage.claims.length})
            </button>
            <button
              type="button"
              className={`bhg-faq-filter ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
              style={{ padding: '7px 14px', fontSize: 12, borderRadius: 8 }}
            >
              Payment History ({coverage.paymentHistory.length})
            </button>
            <button
              type="button"
              className={`bhg-faq-filter ${activeTab === 'statements' ? 'active' : ''}`}
              onClick={() => setActiveTab('statements')}
              style={{ padding: '7px 14px', fontSize: 12, borderRadius: 8 }}
            >
              Monthly Statements ({coverage.statements.length})
            </button>
          </div>

          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
            {activeTab === 'claims' && 'Click any claim to view service breakdown'}
            {activeTab === 'payments' && 'Click any payment to view official receipt'}
            {activeTab === 'statements' && 'Click any statement to view itemized monthly bill'}
          </span>
        </div>

        {/* Tab 1: Claims */}
        {activeTab === 'claims' && (
          <div>
            <div className="bhg-claims-table">
              <div className="bhg-claims-head">
                <span>Date</span><span>Service</span><span>Billed</span><span>Plan paid</span><span>Your share</span><span>Status</span>
              </div>
              {coverage.claims.map((claim) => (
                <button key={claim.id} type="button" className="bhg-claims-row" onClick={() => setSelectedClaim(claim)}>
                  <span>{claim.date}</span>
                  <span><strong>{claim.service}</strong><small>{claim.provider}</small></span>
                  <span>${claim.billed.toFixed(2)}</span>
                  <span>${claim.insurancePaid.toFixed(2)}</span>
                  <span style={{ fontWeight: claim.patientOwes > 0 ? 700 : 400, color: claim.patientOwes > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    ${claim.patientOwes.toFixed(2)}
                  </span>
                  <PillBadge tone={claimStatusTone(claim.status)}>{claim.status}</PillBadge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Payment History (Clickable to view authentic receipt) */}
        {activeTab === 'payments' && (
          <div className="bhg-payment-history">
            {coverage.paymentHistory.map((payment) => (
              <div
                key={payment.id}
                onClick={() => setSelectedReceipt(payment)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '13px 14px',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  borderRadius: 8,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                    ${payment.amount.toFixed(2)} &middot; {payment.method}
                  </strong>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{payment.detail}</div>
                  <small style={{ color: 'var(--text-muted)', fontSize: 11 }}>{payment.date} &middot; Receipt #{payment.id}</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <PillBadge tone="success">{payment.status}</PillBadge>
                  <span
                    className="bhg-button bhg-button-secondary bhg-button-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, padding: '4px 10px' }}
                  >
                    <FileText size={13} /> View Receipt
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Monthly Statements (Clickable to view authentic itemized statement) */}
        {activeTab === 'statements' && (
          <div className="bhg-statement-list">
            {coverage.statements.map((statement) => (
              <div
                key={statement.id}
                onClick={() => setSelectedStatement(statement)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '13px 14px',
                  borderBottom: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  borderRadius: 8,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{statement.period} Statement</strong>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                    Issued {statement.issued} &middot; Due {statement.due}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 750, color: 'var(--text-primary)' }}>
                    ${statement.balance.toFixed(2)}
                  </span>
                  <PillBadge tone={statement.status === 'Open' ? 'warning' : 'success'}>
                    {statement.status}
                  </PillBadge>
                  <span
                    className="bhg-button bhg-button-secondary bhg-button-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, padding: '4px 10px' }}
                  >
                    <Download size={13} /> View Statement
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Claim Breakdown Drawer ── */}
      {selectedClaim && (
        <WorkflowDrawer
          title={selectedClaim.service}
          subtitle={`Claim ${selectedClaim.id} · ${selectedClaim.date}`}
          onClose={() => setSelectedClaim(null)}
          footer={(
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setSelectedClaim(null)}>Close</button>
              {selectedClaim.patientOwes > 0 && (
                <button type="button" className="bhg-button" onClick={payBalance}>
                  <CreditCard size={15} /> Pay ${selectedClaim.patientOwes.toFixed(2)}
                </button>
              )}
            </>
          )}
        >
          <DemoBanner>Claim details are a patient-facing summary — not a full payer remittance.</DemoBanner>
          <div className="bhg-workflow-summary">
            <DetailRow label="Provider" value={selectedClaim.provider} />
            <DetailRow label="Status" value={selectedClaim.status} />
            <DetailRow label="Amount billed" value={`$${selectedClaim.billed.toFixed(2)}`} />
            <DetailRow label="Insurance paid" value={`$${selectedClaim.insurancePaid.toFixed(2)}`} />
            <DetailRow label="Your share" value={`$${selectedClaim.patientOwes.toFixed(2)}`} />
          </div>
          <div className="bhg-request-detail">
            <strong>What this means</strong>
            <p>{selectedClaim.detail}</p>
          </div>
        </WorkflowDrawer>
      )}

      {/* ── Realistic Interactive Payment Receipt Drawer (Slide-out for consistency) ── */}
      {selectedReceipt && (
        <WorkflowDrawer
          title="Official Payment Receipt"
          subtitle={`Receipt #${selectedReceipt.id} · ${selectedReceipt.date}`}
          onClose={() => setSelectedReceipt(null)}
          size="md"
          footer={(
            <>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => addToast(`Receipt #${selectedReceipt.id} downloaded as PDF.`, 'success')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Download size={14} /> Download PDF
              </button>
              <button
                type="button"
                className="bhg-button"
                onClick={() => setSelectedReceipt(null)}
              >
                Close Receipt
              </button>
            </>
          )}
        >
          <div
            style={{
              background: '#FAFCFD',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '20px 22px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>
                  Behavioral Health Group
                </div>
                <h3 style={{ margin: '2px 0 0 0', fontSize: 16, fontWeight: 750, color: 'var(--text-primary)' }}>
                  {center.name}
                </h3>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                  {center.address} &middot; {center.phone}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-block', background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 750 }}>
                  PAID IN FULL
                </span>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Receipt #{selectedReceipt.id}
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px 16px', fontSize: 12, marginBottom: 18 }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>Patient Name</span>
                <strong style={{ color: 'var(--text-primary)' }}>{patient.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>Patient ID</span>
                <strong style={{ color: 'var(--text-primary)' }}>{patient.id}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>Transaction Date</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedReceipt.date}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 11 }}>Payment Method</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedReceipt.method} (ending in ····4219)</strong>
              </div>
            </div>

            {/* Itemized Charge Box */}
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', background: 'var(--bg-alt)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <span>Item / Service Description</span>
                <span>Amount</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border-light)', fontSize: 12.5 }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedReceipt.detail}</strong>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Coverage: {coverage.payer}</div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${selectedReceipt.amount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${selectedReceipt.amount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', fontSize: 11.5, color: 'var(--text-secondary)', borderTop: '1px dashed var(--border-light)' }}>
                <span>Processing / Convenience Fee</span>
                <span>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8FAFC', borderTop: '1px solid var(--border)', fontSize: 14 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Total Amount Paid</strong>
                <strong style={{ color: '#166534', fontSize: 16 }}>${selectedReceipt.amount.toFixed(2)}</strong>
              </div>
            </div>

            {/* Official Confirmation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <CheckCircle2 size={15} style={{ color: '#166534', flexShrink: 0 }} />
              <span>Payment posted successfully. Keep this electronic receipt for your financial records or HSA/FSA documentation.</span>
            </div>
          </div>
        </WorkflowDrawer>
      )}

      {/* ── Realistic Interactive Monthly Billing Statement Drawer (Slide-out for consistency) ── */}
      {selectedStatement && (
        <WorkflowDrawer
          title={`Monthly Patient Statement — ${selectedStatement.period}`}
          subtitle={`Statement #${selectedStatement.id} · Issued ${selectedStatement.issued}`}
          onClose={() => setSelectedStatement(null)}
          size="lg"
          footer={(
            <>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => addToast(`Statement ${selectedStatement.id} downloaded as PDF.`, 'success')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Download size={14} /> Download PDF
              </button>
              {selectedStatement.balance > 0 && selectedStatement.status === 'Open' ? (
                <button
                  type="button"
                  className="bhg-button"
                  onClick={() => {
                    payBalance();
                    setSelectedStatement(null);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <CreditCard size={15} /> Pay Balance (${selectedStatement.balance.toFixed(2)})
                </button>
              ) : (
                <button type="button" className="bhg-button" onClick={() => setSelectedStatement(null)}>
                  Close Statement
                </button>
              )}
            </>
          )}
        >
          <div
            style={{
              background: '#FAFCFD',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '22px 24px',
            }}
          >
            {/* Statement Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: 16, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>
                  Behavioral Health Group
                </div>
                <h3 style={{ margin: '2px 0 0 0', fontSize: 18, fontWeight: 750, color: 'var(--text-primary)' }}>
                  Patient Billing Statement
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {center.name} &middot; {center.address}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 750, color: 'var(--text-primary)' }}>
                  Statement #{selectedStatement.id}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                  Billing Period: <strong>{selectedStatement.period}</strong>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Issued: {selectedStatement.issued}
                </div>
              </div>
            </div>

            {/* Patient & Account Info Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Patient</span>
                <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{patient.name}</strong>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>DOB: {patient.dateOfBirth}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Account / Member ID</span>
                <strong style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{patient.id}</strong>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Plan: {coverage.payer}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>Payment Due Date</span>
                <strong style={{ fontSize: 12.5, color: selectedStatement.balance > 0 ? '#B91C1C' : 'var(--text-primary)' }}>
                  {selectedStatement.due}
                </strong>
                <div style={{ marginTop: 2 }}>
                  <PillBadge tone={selectedStatement.status === 'Open' ? 'warning' : 'success'}>
                    {selectedStatement.status}
                  </PillBadge>
                </div>
              </div>
            </div>

            {/* Statement Summary Callout */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 18px',
                background: selectedStatement.balance > 0 ? '#FFFBEB' : '#F0FDF4',
                border: `1px solid ${selectedStatement.balance > 0 ? '#FDE68A' : '#BBF7D0'}`,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', color: selectedStatement.balance > 0 ? '#92400E' : '#166534' }}>
                  Total Amount {selectedStatement.balance > 0 ? 'Due' : 'Paid'}
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, color: selectedStatement.balance > 0 ? '#92400E' : '#166534', marginTop: 2 }}>
                  ${selectedStatement.balance.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>
                <div>Previous Balance: $0.00</div>
                <div>Insurance Payments (TennCare): -$382.00</div>
                <div>Patient Responsibility: ${selectedStatement.balance.toFixed(2)}</div>
              </div>
            </div>

            {/* Itemized Services Table */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 750, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>
                Itemized Services for {selectedStatement.period}
              </div>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 75px 85px 80px', gap: 8, padding: '9px 12px', background: 'var(--bg-alt)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  <span>Date</span>
                  <span>Service Description</span>
                  <span style={{ textAlign: 'right' }}>Billed</span>
                  <span style={{ textAlign: 'right' }}>Plan Paid</span>
                  <span style={{ textAlign: 'right' }}>Your Share</span>
                </div>
                {coverage.claims.slice(0, 4).map((claim) => (
                  <div
                    key={claim.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 75px 85px 80px',
                      gap: 8,
                      padding: '11px 12px',
                      borderBottom: '1px solid var(--border-light)',
                      fontSize: 12,
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', fontSize: 11.5 }}>{claim.date.split(',')[0]}</span>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{claim.service}</strong>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{claim.provider}</div>
                    </div>
                    <span style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>${claim.billed.toFixed(2)}</span>
                    <span style={{ textAlign: 'right', color: '#166534' }}>-${claim.insurancePaid.toFixed(2)}</span>
                    <span style={{ textAlign: 'right', fontWeight: 700, color: claim.patientOwes > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      ${claim.patientOwes.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assistance Reminder */}
            <div style={{ padding: '10px 14px', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>
                Need help with your balance? Sliding-scale financial assistance and state grant programs are available through counselor {financialCounselor.name} at {center.phone}.
              </span>
            </div>
          </div>
        </WorkflowDrawer>
      )}

      {/* ── Update Coverage Drawer (Slide-out matching user design) ── */}
      {showUpdateCoverage && (
        <WorkflowDrawer
          title="Update coverage"
          subtitle="Upload photos of your new card for clinic verification"
          onClose={() => setShowUpdateCoverage(false)}
          size="md"
          footer={(
            <>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => setShowUpdateCoverage(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bhg-button"
                onClick={handleSubmitCoverageUpdate}
              >
                Submit updates
              </button>
            </>
          )}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Did your plan change? Upload photos of your new card (front and back). Our team usually confirms within 2 business days.
            </p>

            {/* Front and Back Upload Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, margin: '6px 0' }}>
              {/* FRONT */}
              <div
                onClick={() => setFrontCardUploaded(!frontCardUploaded)}
                style={{
                  border: frontCardUploaded ? '2px solid #166534' : '2px dashed #94A3B8',
                  borderRadius: 14,
                  padding: '30px 14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: frontCardUploaded ? '#F0FDF4' : '#F8FAFC',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {frontCardUploaded ? (
                  <>
                    <CheckCircle2 size={32} style={{ color: '#166534' }} />
                    <strong style={{ fontSize: 12, color: '#166534', letterSpacing: '0.06em' }}>FRONT UPLOADED</strong>
                    <span style={{ fontSize: 11, color: '#166534' }}>card_front.jpg</span>
                  </>
                ) : (
                  <>
                    <Upload size={30} style={{ color: 'var(--primary)' }} />
                    <strong style={{ fontSize: 13, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>FRONT</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tap to select photo</span>
                  </>
                )}
              </div>

              {/* BACK */}
              <div
                onClick={() => setBackCardUploaded(!backCardUploaded)}
                style={{
                  border: backCardUploaded ? '2px solid #166534' : '2px dashed #94A3B8',
                  borderRadius: 14,
                  padding: '30px 14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: backCardUploaded ? '#F0FDF4' : '#F8FAFC',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {backCardUploaded ? (
                  <>
                    <CheckCircle2 size={32} style={{ color: '#166534' }} />
                    <strong style={{ fontSize: 12, color: '#166534', letterSpacing: '0.06em' }}>BACK UPLOADED</strong>
                    <span style={{ fontSize: 11, color: '#166534' }}>card_back.jpg</span>
                  </>
                ) : (
                  <>
                    <Upload size={30} style={{ color: 'var(--primary)' }} />
                    <strong style={{ fontSize: 13, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>BACK</strong>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tap to select photo</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Insurance Payer Name (Optional)" hint="e.g. TennCare, BlueCare, Wellpoint, Medicare">
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Enter insurance plan name"
                />
              </Field>
              <Field label="Member / Policy ID (Optional)" hint="Printed on the front of your card">
                <input
                  type="text"
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  placeholder="Enter Member ID"
                />
              </Field>
            </div>

            <div className="bhg-safe-callout" style={{ marginTop: 4 }}>
              <AlertCircle size={16} />
              <span>
                Your current coverage remains active in our records while your new card is verified. Your daily clinic dosing and appointments will not be interrupted.
              </span>
            </div>
          </div>
        </WorkflowDrawer>
      )}

      {/* ── Request Help Drawer (Slide-out for consistency) ── */}
      {showHelp && (
        <WorkflowDrawer
          title="Request coverage or payment help"
          subtitle={financialCounselor.name}
          onClose={() => setShowHelp(false)}
          size="md"
          footer={(
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setShowHelp(false)}>Cancel</button>
              <button type="button" className="bhg-button" onClick={submit}>Send request</button>
            </>
          )}
        >
          <DemoBanner />
          <Field label="What do you need?">
            <select value={helpType} onChange={(event) => setHelpType(event.target.value)}>
              <option>I have a question about my coverage</option>
              <option>I need to update my insurance</option>
              <option>I need help with a balance</option>
              <option>I need transportation or other support</option>
            </select>
          </Field>
          <Field label="Details">
            <textarea rows="4" value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Share any helpful details…" />
          </Field>
        </WorkflowDrawer>
      )}
    </div>
  );
}

export function Documents() {
  const { documents, patient, emergencyContact, navigate, acknowledgeDocument, addToast } = useApp();
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const acknowledge = (docId) => {
    acknowledgeDocument(docId);
    addToast('Document update electronically acknowledged and archived.', 'success');
    setSelected(null);
  };

  const filters = [
    'All',
    'Treatment Consents',
    'Verification Letters',
    'Privacy (42 CFR Part 2)',
    'Program Policies',
    'Medication Agreements',
  ];

  const categoryMap = {
    'Treatment Consents': 'Consent',
    'Verification Letters': 'Verification',
    'Privacy (42 CFR Part 2)': 'Privacy',
    'Program Policies': 'Program',
    'Medication Agreements': 'Medication',
  };

  const getDocIconConfig = (category) => {
    switch (category) {
      case 'Consent':
        return { icon: ClipboardCheck, bg: '#F0FDF4', color: '#16A34A' };
      case 'Verification':
        return { icon: FileCheck2, bg: '#FEF3C7', color: '#D97706' };
      case 'Privacy':
        return { icon: LockKeyhole, bg: '#E0F2FE', color: '#0284C7' };
      case 'Medication':
        return { icon: Pill, bg: '#EDE9FE', color: '#7C3AED' };
      case 'Program':
        return { icon: ShieldCheck, bg: '#F8FAFC', color: '#005A70' };
      default:
        return { icon: FileText, bg: '#F1F5F9', color: '#475569' };
    }
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Filter chip
      if (activeFilter !== 'All') {
        const targetCategory = categoryMap[activeFilter];
        if (doc.category !== targetCategory) return false;
      }
      // Search query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesCat = doc.category.toLowerCase().includes(q);
        const matchesId = doc.id.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesId) return false;
      }
      return true;
    });
  }, [documents, activeFilter, query]);

  return (
    <div className="bhg-page animate-fade-in">
      {/* Detail Side Drawer */}
      {selected && (
        <WorkflowDrawer
          title={selected.name}
          subtitle={`${selected.category} Document · ${selected.date}`}
          onClose={() => setSelected(null)}
          size="lg"
          footer={
            <>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              {selected.status === 'Review due' ? (
                <button
                  type="button"
                  className="bhg-button"
                  onClick={() => acknowledge(selected.id)}
                >
                  <CheckCircle2 size={14} style={{ marginRight: 6 }} /> Acknowledge & Sign Update
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="bhg-button bhg-button-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    onClick={() => window.print()}
                  >
                    <Printer size={14} /> Print
                  </button>
                  <button
                    type="button"
                    className="bhg-button"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    onClick={() => {
                      addToast(`Downloaded official copy of ${selected.name} (PDF).`, 'success');
                    }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </>
              )}
            </>
          }
        >
          <div style={{ padding: '20px 24px' }}>
            {/* Status & Date Tag */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <PillBadge tone={selected.status === 'Review due' ? 'warning' : 'success'}>
                {selected.status}
              </PillBadge>
              <span className="badge badge-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={12} /> {selected.date}
              </span>
            </div>

            {/* Provider / Facility Box */}
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 16px', border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Issuing Facility</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>BHG Knoxville Treatment Center</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Document Number</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#005A70' }}>{selected.id}</span>
              </div>
            </div>

            {/* If Verification Letter: Render Official Letterhead Preview */}
            {(selected.isLetter || selected.category === 'Verification') && (
              <div style={{ background: 'white', padding: '20px', border: '1px solid #CBD5E1', borderRadius: '8px', fontFamily: 'Georgia, serif', color: '#1E293B', marginBottom: 16 }}>
                <div style={{ borderBottom: '2px solid #005A70', paddingBottom: '10px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '15px', color: '#005A70', display: 'block' }}>BHG KNOXVILLE TREATMENT CENTER</strong>
                    <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'sans-serif' }}>Behavioral Health Group · Outpatient Opioid Treatment Program (OTP)</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', fontFamily: 'sans-serif', marginBottom: '12px' }}>
                  Date: September 16, 2026 · Patient: <strong>{patient.name}</strong> (DOB: June 18, 1988)
                </div>
                <p style={{ fontSize: '12.5px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                  This letter certifies that <strong>{patient.name}</strong> is an active patient in good standing at BHG Knoxville Treatment Center, receiving outpatient Medication-Assisted Treatment (MMT). The patient has maintained continuous attendance for <strong>{patient.daysInTreatment} days</strong>.
                </p>
                <p style={{ fontSize: '12.5px', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                  The patient maintains full compliance with observed clinic dosing, regular toxicology monitoring, and clinical counseling requirements.
                </p>
                <div style={{ paddingTop: '12px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif', fontSize: '11.5px' }}>
                  <div><strong>Dr. Marcus Hill, MD</strong><br /><span style={{ color: '#64748B' }}>Medical Director</span></div>
                  <div style={{ color: '#94A3B8', textAlign: 'right' }}>Document ID: VER-2026-9184</div>
                </div>
              </div>
            )}

            {/* Document Details Table */}
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px', border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#005A70', letterSpacing: '0.04em', marginBottom: 12 }}>
                Document Information & Signatures
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px dashed #E2E8F0', fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>Agreement Title:</span>
                  <span style={{ fontWeight: 500, color: '#0F172A', textAlign: 'right' }}>{selected.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px dashed #E2E8F0', fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>Category:</span>
                  <span style={{ fontWeight: 500, color: '#0F172A', textAlign: 'right' }}>{selected.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px dashed #E2E8F0', fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>Signed by Patient:</span>
                  <span style={{ fontWeight: 500, color: '#0F172A', textAlign: 'right' }}>{patient.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px dashed #E2E8F0', fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>Date Executed:</span>
                  <span style={{ fontWeight: 500, color: '#0F172A', textAlign: 'right' }}>{selected.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748B' }}>Audit Trail:</span>
                  <span style={{ fontWeight: 500, color: '#0F172A', textAlign: 'right' }}>Electronic Signature Captured & Verified</span>
                </div>
              </div>
            </div>

            {/* Document Content / Plain Language Summary */}
            <div style={{ background: 'white', padding: '16px', borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: 8 }}>
                Document Summary
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
                {selected.id === 'DOC-1' && 'Outlines patient rights to respectful, individualized care, grievance procedures, and responsibilities regarding clinic attendance, conduct, and treatment guidelines.'}
                {selected.id === 'DOC-2' && 'Formal informed consent for outpatient Medication-Assisted Treatment (MMT) with Methadone, covering treatment goals, potential side effects, dosing protocols, and medical oversight.'}
                {selected.id === 'DOC-3' && 'Federal 42 CFR Part 2 and HIPAA privacy disclosure notice explaining the strict legal confidentiality protecting your substance use disorder treatment records. Disclosure to outside entities strictly requires your signed revocable authorization.'}
                {selected.id === 'DOC-4' && 'Authorizes preferred methods of clinic contact (phone, SMS, secure portal) for appointment reminders, lab alerts, and center schedule changes.'}
                {selected.id === 'DOC-5' && 'Phase 2 Take-Home Agreement governing the secure locked-box storage, handling, bottle return rules, and compliance requirements for unsupervised doses.'}
                {(selected.id === 'DOC-6' || selected.category === 'Verification') && 'Official certified clinic verification on BHG letterhead confirming active enrollment in good standing, daily medication compliance, and treatment duration.'}
              </p>
              {selected.id === 'DOC-4' && selected.status === 'Review due' && (
                <div className="bhg-safe-callout" style={{ marginTop: 12 }}>
                  <AlertCircle size={18} style={{ color: '#D97706', flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                    <strong>Annual Policy Review Due:</strong> Please review your contact preferences to ensure clinic schedule updates and emergency dosing announcements reach you without delay.
                  </span>
                </div>
              )}
            </div>

            {/* Confidentiality Notice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#64748B', padding: '10px 12px', background: '#F1F5F9', borderRadius: 8 }}>
              <LockKeyhole size={14} style={{ color: '#005A70', flexShrink: 0 }} />
              <span>Permanent electronic document archived in compliance with federal 42 CFR Part 2 and HIPAA regulations.</span>
            </div>
          </div>
        </WorkflowDrawer>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-header-left">
          <h1 className="page-header-title" style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0F172A' }}>
            Forms & Documents
          </h1>
          <p className="page-header-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13.5, color: '#64748B' }}>
            Your signed treatment forms, enrollment verification letters, and 42 CFR privacy notices on file.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 260, background: 'white' }}>
          <Search size={16} color="#64748B" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms, consents, verification letters, privacy notices..."
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '13.5px' }}
          />
          {query && (
            <X size={14} style={{ cursor: 'pointer', color: '#64748B' }} onClick={() => setQuery('')} />
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div
        className="filter-bar"
        style={{
          marginBottom: 18,
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 4,
        }}
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-chip${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
            style={{
              fontSize: '12.5px',
              padding: '6px 14px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              background: activeFilter === f ? '#005A70' : 'white',
              color: activeFilter === f ? 'white' : '#475569',
              border: activeFilter === f ? '1px solid #005A70' : '1px solid #CBD5E1',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: activeFilter === f ? 600 : 500,
              transition: 'all 0.15s ease',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Documents List Card */}
      <div className="card" style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {filteredDocs.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto 12px auto', width: 48, height: 48, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} color="#64748B" />
            </div>
            <div className="empty-state-title" style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>No documents found</div>
            <div className="empty-state-desc" style={{ fontSize: 13, color: '#64748B' }}>Try changing your search term or filter selection</div>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const iconConfig = getDocIconConfig(doc.category);
            const IconComponent = iconConfig.icon;
            return (
              <div
                key={doc.id}
                className="record-item"
                onClick={() => setSelected(doc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  borderBottom: '1px solid #F1F5F9',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                {/* Category Icon */}
                <div
                  className="record-item-icon"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: iconConfig.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={20} color={iconConfig.color} />
                </div>

                {/* Title & Metadata */}
                <div className="record-item-info" style={{ flex: 1, minWidth: 0 }}>
                  <div className="record-item-title" style={{ fontSize: 14.5, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>
                    {doc.name}
                  </div>
                  <div className="record-item-meta" style={{ fontSize: 12.5, color: '#64748B', marginTop: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span>{doc.category} Document</span>
                    <span>·</span>
                    <span>{doc.date}</span>
                    <span>·</span>
                    <span>BHG Knoxville</span>
                  </div>
                </div>

                {/* Status Badge + Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  <PillBadge tone={doc.status === 'Review due' ? 'warning' : 'success'}>{doc.status}</PillBadge>
                  <ChevronRight size={16} color="#94A3B8" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 42 CFR Part 2 Educational Card if Privacy filter is selected */}
      {activeFilter === 'Privacy (42 CFR Part 2)' && (
        <div className="animate-fade-in" style={{ marginTop: '20px' }}>
          <Card style={{ marginBottom: '20px' }}>
            <SectionTitle
              title="42 CFR Part 2: Federal Privacy Protections"
              description="Your substance use disorder treatment records carry the highest legal confidentiality in the United States."
            />
            <div className="bhg-safe-callout" style={{ margin: '16px 0' }}>
              <LockKeyhole size={20} />
              <span style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Under federal law (42 CFR Part 2) and HIPAA, BHG cannot confirm or deny to an employer, family member, court, or law enforcement that you are a patient, unless you provide specific written consent.
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} style={{ color: '#16A34A' }} /> Employment Protection
                </strong>
                <p style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.5' }}>
                  Your employer cannot view your records, counseling notes, or toxicology results. Background checks cannot access your BHG enrollment.
                </p>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck2 size={18} style={{ color: '#005A70' }} /> You Control All Releases
                </strong>
                <p style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.5' }}>
                  Records can only be shared with outside doctors, courts, or family members if you sign a specific Release of Information (ROI) form.
                </p>
              </div>

              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LockKeyhole size={18} style={{ color: '#0284C7' }} /> Revoke Consent Anytime
                </strong>
                <p style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.5' }}>
                  You have the right to revoke or cancel any signed release form at any time simply by notifying the clinic front desk.
                </p>
              </div>
            </div>
          </Card>

          {emergencyContact && (
            <Card>
              <SectionTitle
                title="Authorized Emergency Contact on File"
                description="Permitted to be contacted for urgent medical emergencies only."
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', marginTop: '12px' }}>
                <div>
                  <strong style={{ fontSize: '14.5px', color: '#0F172A' }}>{emergencyContact.name}</strong>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
                    {emergencyContact.relation} · {emergencyContact.phone}
                  </div>
                </div>
                {navigate && (
                  <button
                    type="button"
                    className="bhg-button bhg-button-secondary"
                    style={{ fontSize: '12.5px' }}
                    onClick={() => navigate('profile')}
                  >
                    <UserRound size={14} style={{ marginRight: '6px' }} /> Update in Profile
                  </button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Footer Privacy Note */}
      <div className="bhg-privacy-note" style={{ marginTop: '24px' }}>
        <LockKeyhole size={17} />
        <span>Signed agreements, verification letters, and consents are confidential. Protected under federal 42 CFR Part 2 regulations.</span>
      </div>
    </div>
  );
}

/* ---------- Progress page visual sub-components ---------- */

function GoalRing({ progress: pct, size = 72, stroke = 7, color = 'var(--accent)' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${pct}% progress`} role="img" className="bhg-goal-ring">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle
        cx={cx} cy={cx} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        transform={`rotate(-90 ${cx} ${cx})`}
        className="bhg-goal-ring-arc"
      />
      <text x={cx} y={cx + 4} textAnchor="middle" className="bhg-goal-ring-pct">{pct}%</text>
    </svg>
  );
}

export function Progress() {
  const { progress, treatment, navigate } = useApp();
  const [milestoneOrder, setMilestoneOrder] = useState('journey'); // 'journey' (Start -> Latest) or 'newest' (Latest -> Start)

  const milestoneMeta = {
    'Treatment started': {
      icon: Sparkles,
      color: '#D97706',
      bg: '#FEF3C7',
      badge: 'Induction',
      stepNum: 1,
      badgeColor: '#92400E',
      badgeBg: '#FEF3C7',
    },
    '90 days in treatment': {
      icon: Target,
      color: '#7C3AED',
      bg: '#EDE9FE',
      badge: 'Stabilization',
      stepNum: 2,
      badgeColor: '#6D28D9',
      badgeBg: '#EDE9FE',
    },
    'Take-home plan reviewed': {
      icon: Pill,
      color: '#0284C7',
      bg: '#E0F2FE',
      badge: 'Phase 2',
      stepNum: 3,
      badgeColor: '#0369A1',
      badgeBg: '#E0F2FE',
    },
    'Treatment plan updated': {
      icon: CheckCircle2,
      color: '#16A34A',
      bg: '#DCFCE7',
      badge: 'Latest Milestone',
      stepNum: 4,
      badgeColor: '#15803D',
      badgeBg: '#DCFCE7',
    },
  };

  const milestonesToRender = milestoneOrder === 'journey'
    ? [...progress.milestones].reverse()
    : progress.milestones;

  return (
    <div className="bhg-page bhg-progress-page animate-fade-in">
      {/* ── Page Header ── */}
      <PageHeader
        eyebrow="My recovery"
        title="Recovery progress"
        description="Your treatment milestones, take-home schedule, and counselor visits."
        action={<PillBadge tone="primary">{treatment.phase} · 2 Take-Home Days</PillBadge>}
      />

      {/* ── Native Encouragement Banner ── */}
      <div className="bhg-encouragement-banner">
        <div className="bhg-encouragement-badge">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="bhg-encouragement-days">{progress.enrolledDays} days in continuous recovery</div>
          <div className="bhg-encouragement-sub">
            {treatment.phase} achieved · 2 weekly take-home days · 6 months strong
          </div>
        </div>
      </div>

      {/* ── Native Progress Metrics Strip ── */}
      <div className="bhg-progress-visual-strip">
        <div className="bhg-progress-visual-center-stat">
          <span className="bhg-progress-big-number">{progress.enrolledDays}</span>
          <span className="bhg-progress-big-label">Days in treatment</span>
        </div>
        <div className="bhg-progress-visual-center-stat">
          <span className="bhg-progress-big-number">{progress.attendanceRate}%</span>
          <span className="bhg-progress-big-label">Visit consistency</span>
        </div>
        <div className="bhg-progress-visual-center-stat">
          <span className="bhg-progress-big-number">{progress.counselingSessions}</span>
          <span className="bhg-progress-big-label">Counseling sessions</span>
        </div>
        <div className="bhg-progress-visual-center-stat">
          <span className="bhg-progress-big-number" style={{ color: '#16A34A' }}>Active</span>
          <span className="bhg-progress-big-label">No account holds</span>
        </div>
      </div>

      {/* ── Two-Column Core Row: Take-Home & Next Counseling Session ── */}
      <div className="bhg-two-column">
        {/* Card 1: Take-Home Schedule */}
        <Card>
          <SectionTitle
            title="Take-home schedule"
            description="Your current take-home bottle privileges and phase status."
            action={<PillBadge tone="success">Phase 2 Approved</PillBadge>}
          />

          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '13px 15px', margin: '14px 0 12px 0' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>
              Approved Take-Home Days
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
              Tuesday & Wednesday (2 bottles/week)
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>
              In-person clinic window on Monday, Thursday, Friday, Saturday & Sunday.
            </div>
          </div>

          <div style={{ background: 'var(--bg-alt)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0F172A' }}>
                Phase 3 Readiness (3 bottles/week)
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 12 }}>
                3 of 4 Met (75%)
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px', fontSize: 11.5, color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} color="#16A34A" /> <span>90+ days attendance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} color="#16A34A" /> <span>Negative UDS labs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={13} color="#16A34A" /> <span>Counseling on-track</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={13} color="#D97706" /> <span>Review due Oct 2</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Next Counseling Check-In */}
        <Card>
          <SectionTitle
            title="Next counseling session"
            description="Individual visit with your primary counselor."
            action={<PillBadge tone="primary">Confirmed</PillBadge>}
          />

          <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 15px', margin: '14px 0 12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CalendarDays size={20} color="#0284C7" />
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A' }}>
                  Thursday, September 17 at 10:30 AM
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Individual Counseling · BHG Knoxville Room 204
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingTop: 8, borderTop: '1px dashed var(--border)', color: '#475569' }}>
              <span>Primary counselor:</span>
              <strong style={{ color: '#0F172A' }}>Alicia Monroe, LPC</strong>
            </div>
          </div>

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 9, padding: '9px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={15} color="#2563EB" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: '#1E40AF', lineHeight: 1.4 }}>
              <strong>Upcoming Plan Review:</strong> Scheduled for October 2, 2026. Phase 3 take-home evaluation occurs here.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="bhg-button"
              style={{ flex: 1, justifyContent: 'center', fontSize: 12.5 }}
              onClick={() => navigate('messages')}
            >
              <MessageCircle size={14} style={{ marginRight: 6 }} /> Message counselor
            </button>
            <button
              type="button"
              className="bhg-button bhg-button-secondary"
              style={{ flex: 1, justifyContent: 'center', fontSize: 12.5 }}
              onClick={() => navigate('appointments')}
            >
              View appointments
            </button>
          </div>
        </Card>
      </div>

      {/* ── Card 3: Recovery Milestones (Horizontal Layout) ── */}
      <Card>
        <SectionTitle
          title="Recovery milestones"
          description="Key moments and achievements in your treatment journey."
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <PillBadge tone="success">4 of 4 Achieved</PillBadge>
              <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '2px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setMilestoneOrder('journey')}
                  style={{
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: milestoneOrder === 'journey' ? 700 : 500,
                    background: milestoneOrder === 'journey' ? '#FFFFFF' : 'transparent',
                    color: milestoneOrder === 'journey' ? '#0F172A' : '#64748B',
                    boxShadow: milestoneOrder === 'journey' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Journey (Start → Latest)
                </button>
                <button
                  type="button"
                  onClick={() => setMilestoneOrder('newest')}
                  style={{
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: milestoneOrder === 'newest' ? 700 : 500,
                    background: milestoneOrder === 'newest' ? '#FFFFFF' : 'transparent',
                    color: milestoneOrder === 'newest' ? '#0F172A' : '#64748B',
                    boxShadow: milestoneOrder === 'newest' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Newest first
                </button>
              </div>
            </div>
          }
        />

        <div style={{ overflowX: 'auto', paddingBottom: 4, marginTop: 4 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
              gap: 12,
              position: 'relative',
              alignItems: 'stretch',
            }}
          >
            {milestonesToRender.map((item, idx) => {
              const itemMeta = milestoneMeta[item.title] || {
                icon: CheckCircle2,
                color: '#16A34A',
                bg: '#DCFCE7',
                badge: 'Milestone',
                stepNum: idx + 1,
                badgeColor: '#15803D',
                badgeBg: '#DCFCE7',
              };
              const isLatest = item.title === 'Treatment plan updated';
              const isLast = idx === milestonesToRender.length - 1;

              return (
                <div
                  key={item.date}
                  style={{
                    position: 'relative',
                    background: isLatest ? 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)' : 'var(--bg-alt, #F8FAFC)',
                    border: isLatest ? '1.5px solid #86EFAC' : '1px solid var(--border, #E2E8F0)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isLatest ? '0 4px 14px rgba(22, 163, 74, 0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Top Row: Icon + Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: itemMeta.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <itemMeta.icon size={16} color={itemMeta.color} />
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: itemMeta.badgeBg,
                        color: itemMeta.badgeColor,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {itemMeta.badge}
                    </span>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: 10, fontWeight: 750, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                    {item.date}
                  </div>

                  {/* Title */}
                  <div style={{ fontSize: 13, fontWeight: 750, color: '#0F172A', lineHeight: 1.3, marginBottom: 4 }}>
                    {item.title}
                  </div>

                  {/* Detail */}
                  <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4, flex: 1 }}>
                    {item.detail}
                  </div>

                  {/* Footer status */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 8,
                      paddingTop: 6,
                      borderTop: '1px dashed var(--border, #E2E8F0)',
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: '#16A34A',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> Completed
                    </span>
                    <span style={{ color: '#64748B', fontSize: 10 }}>Step {itemMeta.stepNum} of 4</span>
                  </div>

                  {/* Connector arrow between cards */}
                  {milestoneOrder === 'journey' && !isLast && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: -8,
                        transform: 'translateY(-50%)',
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        color: '#64748B',
                        pointerEvents: 'none',
                      }}
                      aria-hidden="true"
                    >
                      <ArrowRight size={10} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── Privacy Note ── */}
      <div className="bhg-privacy-note" style={{ marginTop: 14 }}>
        <LockKeyhole size={15} />
        <span style={{ fontSize: 11.5 }}>
          Recovery progress and treatment records are confidential. Protected under federal 42 CFR Part 2 and HIPAA regulations.
        </span>
      </div>
    </div>
  );
}

export function Center() {
  const { center, createRequest, addToast } = useApp();
  const [showTransferDrawer, setShowTransferDrawer] = useState(false);
  const [transferType, setTransferType] = useState('permanent');
  const [destinationClinic, setDestinationClinic] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('2026-10-01');
  const [returnDate, setReturnDate] = useState('2026-10-08');
  const [transferNotes, setTransferNotes] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const mapsUrl = getCenterMapsUrl(center);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(center.address)}&output=embed`;

  const handleSubmitTransfer = () => {
    createRequest({
      type: 'Center transfer',
      title: `${transferType === 'guest' ? 'Courtesy Guest Dosing' : 'Permanent Center Transfer'}: ${destinationClinic}`,
      detail: `Type: ${transferType === 'guest' ? 'Guest Dosing' : 'Permanent Transfer'}, Target: ${destinationClinic} ${destinationCity ? `(${destinationCity})` : ''}, Effective: ${effectiveDate} ${transferType === 'guest' ? `to ${returnDate}` : ''}. Notes: ${transferNotes || 'Standard transfer'}. 42 CFR Part 2 Consent verified.`,
      page: 'center',
    });
    addToast(
      transferType === 'guest'
        ? `Courtesy guest dosing request sent for ${destinationClinic}. Coordinator will verify dosing within 24 hours.`
        : `Transfer request to ${destinationClinic} submitted. Intake coordinator will contact you.`,
      'success'
    );
    setShowTransferDrawer(false);
    setConsentChecked(false);
  };

  return (
    <div className="bhg-page bhg-center-page animate-fade-in">
      <PageHeader
        eyebrow="Support"
        title="Treatment Center"
        description="Hours, directions, and essential contact details for BHG Knoxville."
      />

      {/* ── Location & Interactive Map Hero Card ── */}
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ position: 'relative', width: '100%', height: 260, background: '#e2e8f0' }}>
          <iframe
            title={`Map — ${center.name}`}
            src={mapEmbedUrl}
            style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div
          style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            background: 'white',
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {center.name}
                </h2>
                <PillBadge tone="success">{center.status}</PillBadge>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                {center.address} &middot; <span style={{ color: 'var(--text-muted)' }}>{center.directions}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              className="bhg-button"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <Navigation size={15} /> Start GPS Directions
            </a>
            <a
              className="bhg-button bhg-button-secondary"
              href={`tel:${center.phone.replace(/\D/g, '')}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <Phone size={15} /> Call Front Desk
            </a>
          </div>
        </div>
      </Card>

      {/* ── Two-Column: Hours & Holiday Schedule ── */}
      <div className="bhg-two-column">
        {/* Card 1: Hours */}
        <Card>
          <SectionTitle
            title="Clinic & Medication Hours"
            description="Arrive early to ensure uninterrupted dosing."
          />

          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '14px 16px', margin: '14px 0 12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Medication Window Hours
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: 10 }}>
                Today Open
              </span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#0F172A' }}>
              {center.medicationWindow}
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>
              Observed clinic dosing window closes promptly at 11:30 AM under state OTP regulations.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            <DetailRow label="Counseling Hours" value={center.counselingHours} />
            <DetailRow label="Center Phone" value={center.phone} />
            <DetailRow label="Today’s Full Hours" value={center.todayHours} />
          </div>
        </Card>

        {/* Card 2: Holiday Notices & Weather Advisories */}
        <Card>
          <SectionTitle
            title="Schedule & Weather Notices"
            description="Upcoming holiday hours and clinic adjustments."
          />

          <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', margin: '14px 0 12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <CalendarDays size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: 'var(--text-primary)', display: 'block', marginBottom: 3 }}>
                  Upcoming Holiday Schedule
                </strong>
                <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {center.holidayNotice}
                </span>
              </div>
            </div>
          </div>

          <div className="bhg-safe-callout" style={{ marginTop: 12 }}>
            <AlertCircle size={16} />
            <span>
              <strong>Severe Weather Policy:</strong> If severe winter weather or storms affect Knoxville, call <strong>{center.phone}</strong> before traveling to confirm dosing window operating hours.
            </span>
          </div>
        </Card>
      </div>

      {/* ── Clinic Transfer & Courtesy Guest Dosing Card ── */}
      <Card style={{ marginTop: 18, border: '1px solid #9CCDDD', background: '#F8FCFD' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <Share2 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Moving or Traveling to Another Area?
                </h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: 6 }}>
                  115+ BHG Centers Nationwide
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45, maxWidth: 680 }}>
                BHG coordinates continuous medication access across our entire clinic network. Whether you are relocating permanently or need temporary courtesy guest dosing while traveling, our care team will transfer your records and ensure your medication is ready with zero missed doses.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="bhg-button"
            onClick={() => setShowTransferDrawer(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            <Share2 size={14} /> Request Center Transfer
          </button>
        </div>
      </Card>

      {/* ── Compact Emergency & Crisis Callout ── */}
      <div
        className="bhg-privacy-note"
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeartHandshake size={16} color="#005A70" />
          <span>
            <strong>24/7 Crisis Support:</strong> Call or text <strong>988</strong> anytime for confidential assistance. For medical emergencies, dial <strong>911</strong>.
          </span>
        </div>
        <a href="tel:988" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
          Call 988 Lifeline &rarr;
        </a>
      </div>

      {/* ── Transfer / Guest Dosing WorkflowDrawer ── */}
      {showTransferDrawer && (
        <WorkflowDrawer
          title="Transfer Treatment Center"
          subtitle="Coordinate seamless medication continuity with another BHG or certified OTP clinic"
          onClose={() => setShowTransferDrawer(false)}
          size="md"
          footer={(
            <>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => setShowTransferDrawer(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bhg-button"
                disabled={!destinationClinic || !consentChecked}
                onClick={handleSubmitTransfer}
              >
                Submit Transfer Request
              </button>
            </>
          )}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DemoBanner>
              Transfer coordination is reviewed by BHG clinical staff to ensure uninterrupted dosing.
            </DemoBanner>

            {/* Transfer Type Selector */}
            <div>
              <span style={{ fontSize: 12, fontWeight: 750, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                What type of transfer do you need?
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setTransferType('permanent')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `2px solid ${transferType === 'permanent' ? 'var(--primary)' : 'var(--border)'}`,
                    background: transferType === 'permanent' ? 'var(--primary-light)' : 'white',
                    color: transferType === 'permanent' ? 'var(--primary)' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>
                    Permanent Relocation
                  </strong>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Moving to a new city or home
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransferType('guest')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `2px solid ${transferType === 'guest' ? 'var(--primary)' : 'var(--border)'}`,
                    background: transferType === 'guest' ? 'var(--primary-light)' : 'white',
                    color: transferType === 'guest' ? 'var(--primary)' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>
                    Courtesy / Guest Dosing
                  </strong>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Temporary travel or family visit
                  </span>
                </button>
              </div>
            </div>

            {/* Destination Clinic Selection */}
            <Field label="Destination Treatment Center" hint="Select a BHG sister clinic or specify another certified OTP">
              <select
                value={destinationClinic}
                onChange={(e) => setDestinationClinic(e.target.value)}
              >
                <option value="">-- Choose destination clinic --</option>
                <option value="BHG Nashville (Downtown) — Nashville, TN">BHG Nashville (Downtown) — Nashville, TN</option>
                <option value="BHG Memphis (Midtown) — Memphis, TN">BHG Memphis (Midtown) — Memphis, TN</option>
                <option value="BHG Chattanooga — Chattanooga, TN">BHG Chattanooga — Chattanooga, TN</option>
                <option value="BHG Johnson City (Tri-Cities) — Johnson City, TN">BHG Johnson City (Tri-Cities) — Johnson City, TN</option>
                <option value="BHG Asheville — Asheville, NC">BHG Asheville — Asheville, NC</option>
                <option value="BHG Lexington — Lexington, KY">BHG Lexington — Lexington, KY</option>
                <option value="Other certified OTP clinic outside BHG network">Other certified OTP clinic outside BHG network</option>
              </select>
            </Field>

            {destinationClinic.includes('Other') && (
              <Field label="Receiving Clinic Name & City" hint="Provide the name or location of the OTP clinic you plan to visit">
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="e.g. Metro Treatment Center, Atlanta, GA"
                />
              </Field>
            )}

            {/* Dates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: transferType === 'guest' ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 12 }}>
              <Field label={transferType === 'guest' ? 'Travel Start Date' : 'Effective Relocation Date'}>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </Field>
              {transferType === 'guest' && (
                <Field label="Return Date">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </Field>
              )}
            </div>

            <Field label="Additional Notes for Care Coordinator (Optional)" hint="e.g. Travel details, preferred dosing window time">
              <textarea
                rows="2"
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                placeholder="Let your care coordinator know about your travel plans…"
              />
            </Field>

            {/* Medication Continuity Assurance Strip */}
            <div style={{ padding: '12px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, fontSize: 12, color: '#166534', lineHeight: 1.5 }}>
              <strong>Zero-Dosing Interruption Guarantee:</strong> Our clinical transfer coordinator will transmit your active <strong>Phase 2 take-home schedule (2 bottles/wk)</strong>, prescriber orders, and last verified clinic dose directly to the receiving medical team so you are cleared to dose upon arrival.
            </div>

            {/* 42 CFR Part 2 Consent Checkbox */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
                cursor: 'pointer',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                style={{ marginTop: 2, accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <span>
                <strong>42 CFR Part 2 Consent:</strong> I authorize BHG Knoxville to release my active medication dosing schedule, medical orders, and treatment records to the destination clinic for uninterrupted continuity of care.
              </span>
            </label>
          </div>
        </WorkflowDrawer>
      )}
    </div>
  );
}

export function Profile() {
  const { patient, center, updatePatient, addToast, navigate } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const openEdit = (type) => {
    setEditing(type);
    setForm({ phone: patient.phone, email: patient.email, preferredContact: patient.preferredContact, language: patient.language, address: patient.address });
  };
  const save = () => {
    updatePatient(form);
    addToast('Your profile preferences were updated.');
    setEditing(null);
  };
  return (
    <div className="bhg-page animate-fade-in">
      <PageHeader eyebrow="Account" title="Profile & privacy" description="Your personal details and communication preferences." />
      <div className="bhg-two-column">
        <Card>
          <SectionTitle title="Personal information" action={<button className="bhg-text-button" onClick={() => openEdit('profile')}>Edit</button>} />
          <DetailRow label="Full name" value={patient.name} />
          <DetailRow label="Patient ID" value={patient.id} />
          <DetailRow label="Date of birth" value={patient.dateOfBirth} />
          <DetailRow
            label="Treatment center"
            value={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <strong>{center.shortName}</strong>
                <button
                  type="button"
                  className="bhg-text-button"
                  style={{ fontSize: 11.5, padding: 0 }}
                  onClick={() => navigate('center')}
                >
                  Transfer clinic &rarr;
                </button>
              </span>
            }
          />
        </Card>
        <Card>
          <SectionTitle title="Contact preferences" action={<button className="bhg-text-button" onClick={() => openEdit('preferences')}>Manage</button>} />
          <DetailRow label="Mobile" value={patient.phone} />
          <DetailRow label="Email" value={patient.email} />
          <DetailRow label="Preferred contact" value={patient.preferredContact} />
          <DetailRow label="Language" value={patient.language} />
        </Card>
      </div>
      <Card>
        <SectionTitle title="Privacy and consent" />
        <div className="bhg-care-grid">
          <div className="bhg-care-item"><LockKeyhole size={20} /><h3>Private by design</h3><p>Your information is protected by HIPAA and applicable substance-use treatment privacy rules.</p></div>
          <div className="bhg-care-item"><FileCheck2 size={20} /><h3>You control consent</h3><p>Review signed consents and communication preferences under Forms & Documents.</p></div>
          <div className="bhg-care-item"><Activity size={20} /><h3>Secure access</h3><p>Sign out when using a shared device and never share your portal password.</p></div>
        </div>
      </Card>
      {editing && <WorkflowModal title={editing === 'profile' ? 'Update personal information' : 'Manage contact preferences'} subtitle="Changes are recorded for clinic review in this demonstration." onClose={() => setEditing(null)} footer={<><button className="bhg-button bhg-button-secondary" onClick={() => setEditing(null)}>Cancel</button><button className="bhg-button" onClick={save}>Save changes</button></>}>
        <DemoBanner />
        {editing === 'profile' && <Field label="Mailing address"><input value={form.address || ''} onChange={(event) => setForm({ ...form, address: event.target.value })} /></Field>}
        <Field label="Mobile phone"><input value={form.phone || ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
        <Field label="Email"><input type="email" value={form.email || ''} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
        <Field label="Preferred contact"><select value={form.preferredContact || ''} onChange={(event) => setForm({ ...form, preferredContact: event.target.value })}><option>Text message</option><option>Phone call</option><option>Email</option><option>Portal only</option></select></Field>
        <Field label="Preferred language"><select value={form.language || ''} onChange={(event) => setForm({ ...form, language: event.target.value })}><option>English</option><option>Spanish</option></select></Field>
      </WorkflowModal>}
    </div>
  );
}

function getNotificationIconConfig(notification) {
  const iconType = notification.iconType || '';
  const category = notification.category || '';

  if (iconType === 'calendar' || (category === 'Appointments' && iconType !== 'pill')) {
    return {
      icon: <Calendar size={20} color="#10b981" />,
      bg: '#ecfdf5',
      border: '#a7f3d0',
    };
  }
  if (iconType === 'lab' || category === 'Reports') {
    return {
      icon: <FlaskConical size={20} color="#0d9488" />,
      bg: '#f0fdfa',
      border: '#99f6e4',
    };
  }
  if (iconType === 'message' || category === 'Messages') {
    return {
      icon: <MessageCircle size={20} color="#0284c7" />,
      bg: '#f0f9ff',
      border: '#bae6fd',
    };
  }
  if (iconType === 'billing' || category === 'Billing') {
    return {
      icon: <CreditCard size={20} color="#10b981" />,
      bg: '#ecfdf5',
      border: '#a7f3d0',
    };
  }
  if (iconType === 'document' || category === 'System') {
    return {
      icon: <FileText size={20} color="#6366f1" />,
      bg: '#eef2ff',
      border: '#c7d2fe',
    };
  }
  return {
    icon: <Bell size={20} color="#d97706" />,
    bg: '#fffbeb',
    border: '#fde68a',
  };
}

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const categories = ['All', 'Reports', 'Appointments', 'Billing', 'Messages', 'System'];

  const filteredNotifications = useMemo(() => {
    return (notifications || []).filter((n) => {
      if (unreadOnly && !n.unread) return false;
      if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
      return true;
    });
  }, [notifications, unreadOnly, selectedCategory]);

  const unreadCount = useMemo(() => (notifications || []).filter((n) => n.unread).length, [notifications]);
  const totalCount = (notifications || []).length;

  return (
    <div className="bhg-page animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Header matching reference screenshot */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Alerts & Messages</div>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', color: '#0284c7', textTransform: 'uppercase', marginTop: '2px' }}>
          SYSTEM & CLINICAL NOTIFICATIONS
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Notifications
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
            {unreadCount} unread · {totalCount} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setUnreadOnly((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: unreadOnly ? '1px solid #0284c7' : '1px solid #cbd5e1',
              background: unreadOnly ? '#f0f9ff' : '#ffffff',
              color: unreadOnly ? '#0284c7' : '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Filter size={15} color={unreadOnly ? '#0284c7' : '#475569'} />
            Unread Only
          </button>
          <button
            type="button"
            onClick={() => {
              if (markAllNotificationsRead) {
                markAllNotificationsRead();
              } else {
                notifications.filter((n) => n.unread).forEach((n) => markNotificationRead(n.id));
              }
              if (addToast) addToast('All notifications marked as read.', 'success');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
          >
            <Check size={15} color="#475569" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                borderRadius: '9999px',
                padding: '6px 18px',
                fontSize: '13px',
                fontWeight: isSelected ? 600 : 500,
                border: isSelected ? '1px solid #0284c7' : '1px solid #cbd5e1',
                background: isSelected ? '#0284c7' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 1px 2px rgba(2, 132, 199, 0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = '#ffffff';
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notification Cards Container */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {filteredNotifications.length === 0 ? (
          <div style={{ padding: '56px 24px', textAlign: 'center', color: '#64748b' }}>
            <Bell size={38} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>No notifications found</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              {unreadOnly ? 'You have no unread notifications.' : 'There are no notifications matching the selected filter.'}
            </div>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const iconConfig = getNotificationIconConfig(notification);
            const isUnread = !!notification.unread;
            const isLast = index === filteredNotifications.length - 1;

            return (
              <div
                key={notification.id}
                onClick={() => {
                  markNotificationRead(notification.id);
                  if (notification.page) navigate(notification.page);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '18px 24px',
                  borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                  background: isUnread ? '#f0f7ff' : '#ffffff',
                  borderLeft: isUnread ? '4px solid #0284c7' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isUnread ? '#e2effd' : '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isUnread ? '#f0f7ff' : '#ffffff';
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: iconConfig.bg,
                    border: `1px solid ${iconConfig.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {iconConfig.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                      {notification.title}
                    </span>
                    {isUnread && (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#e0f2fe',
                          color: '#0284c7',
                          letterSpacing: '0.01em',
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569', lineHeight: 1.45 }}>
                    {notification.detail}
                  </p>
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                    {notification.time}
                  </div>
                </div>
                {isUnread && (
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      alignSelf: 'center',
                      marginLeft: 'auto',
                      flexShrink: 0,
                    }}
                    aria-label="Unread indicator"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TREATMENT RECORDS PAGE
   BHG Health Record Hub with Medication Orders, Dose History, Labs & Consents
   ══════════════════════════════════════════════════════════════════════════ */

function getLabAiSummary(record) {
  if (record.id === 'UDS-9102') {
    return {
      confidence: 98,
      headline: 'All Clear · Dosing Verified · Fully Compliant',
      points: [
        { label: 'Prescribed Medication', text: 'Positive (As Expected) — Methadone metabolite confirmed present, proving you are taking your daily dose as directed.' },
        { label: 'Illicit / Non-Prescribed Drugs', text: 'All Negative (Clean) — Zero fentanyl, heroin/morphine, oxycodone, buprenorphine, benzodiazepines, cocaine, or methamphetamine detected.' },
        { label: 'Sample Validity', text: 'Normal — Temperature (96.4°F) and creatinine levels confirmed an authentic, unaltered sample.' },
      ],
      bottomLine: 'Your recovery is fully on track! This test meets all compliance criteria and supports maintaining your Phase 2 take-home dosing schedule.',
      disclaimer: 'Generated by BHG Clinical AI Assistant for your personal recovery tracking.',
    };
  }
  if (record.id === 'UDS-8841') {
    return {
      confidence: 97,
      headline: 'Phase 2 Take-Home Eligibility Verified',
      points: [
        { label: 'Prescribed Medication', text: 'Positive (As Expected) — Daily maintenance dose confirmed in system.' },
        { label: 'Illicit / Non-Prescribed Drugs', text: 'All Negative (Clean) — No non-prescribed opioids, sedatives, or street substances found.' },
      ],
      bottomLine: 'This clean screening was the key clinical milestone that qualified you for your current 2 weekly take-home bottles.',
      disclaimer: 'Generated by BHG Clinical AI Assistant for your personal recovery tracking.',
    };
  }
  if (record.id === 'LAB-7102') {
    return {
      confidence: 99,
      headline: 'Healthy Liver & Baseline Physical Health Cleared',
      points: [
        { label: 'Liver Function (ALT & AST)', text: 'Normal (ALT: 28, AST: 24) — Your liver enzymes are healthy, confirming your body can safely process MAT medication.' },
        { label: 'Hepatitis C Screening', text: 'Non-Reactive (Negative) — No evidence of Hepatitis C infection.' },
        { label: 'Tuberculosis (TB Gold)', text: 'Negative — No active or latent tuberculosis detected.' },
        { label: 'Comprehensive Metabolic Panel', text: 'Normal limits across kidney filtration, electrolyte balance, and blood sugars.' },
      ],
      bottomLine: 'Your admission blood chemistry was completely clear, giving your physician medical clearance to initiate your outpatient treatment program.',
      disclaimer: 'Generated by BHG Clinical AI Assistant for your personal recovery tracking.',
    };
  }
  return {
    confidence: 95,
    headline: 'Laboratory Results Summary',
    points: record.details?.slice(0, 4).map((d) => ({ label: d.label, text: d.value })) || [],
    bottomLine: record.detailSummary || 'Your laboratory screening has been reviewed and archived in good standing by your care team.',
    disclaimer: 'Generated by BHG Clinical AI Assistant for your personal recovery tracking.',
  };
}

export function TreatmentRecords() {
  const {
    patient,
    treatment,
    careTeam,
    center,
    navigate,
    addToast,
    createRequest,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [showRecordsRequestModal, setShowRecordsRequestModal] = useState(false);
  const [recordsRecipient, setRecordsRecipient] = useState('Self (Personal records)');
  const [recordsNotes, setRecordsNotes] = useState('');

  const counselor = careTeam?.find((m) => m.role.toLowerCase().includes('counselor')) || careTeam?.[0];
  const doctor = careTeam?.find((m) => m.role.toLowerCase().includes('provider')) || careTeam?.[1];

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setAiSummary(null);
    setGeneratingAi(false);
  };

  const handleGenerateAiSummary = () => {
    if (!selectedRecord) return;
    setGeneratingAi(true);
    window.setTimeout(() => {
      setAiSummary(getLabAiSummary(selectedRecord));
      setGeneratingAi(false);
      addToast('AI summary generated.', 'success');
    }, 450);
  };

  const handleRequestOfficialRecords = () => {
    createRequest({
      type: 'Official records request',
      title: `Records request for ${recordsRecipient}`,
      detail: recordsNotes || 'Standard certified treatment record release.',
      page: 'records',
    });
    addToast('Your records request was submitted to the medical records department.', 'success');
    setShowRecordsRequestModal(false);
    setRecordsNotes('');
  };

  const filters = [
    'All',
    'Medication Orders',
    'Dose History',
    'Lab Results',
    'Clinical Notes',
  ];

  // Unified BHG Clinical Records Dataset
  const allRecords = useMemo(() => {
    const list = [];

    // 1. Medication Orders (orderHistory)
    orderHistory.forEach((ord) => {
      list.push({
        id: ord.id,
        category: 'medication',
        filterType: 'Medication Orders',
        icon: Pill,
        iconBg: '#EDE9FE',
        iconColor: '#7C3AED',
        title: `${ord.med} ${ord.dose} Daily Maintenance Order`,
        type: `Prescription Order · ${ord.type}`,
        date: ord.effectiveDate,
        provider: ord.prescriber,
        status: ord.status,
        statusTone: ord.status === 'Active' ? 'success' : 'neutral',
        detailSummary: ord.notes,
        details: [
          { label: 'Order Number', value: ord.id },
          { label: 'Medication & Form', value: `${ord.med} (Oral Liquid Concentrate)` },
          { label: 'Daily Dose Strength', value: ord.dose },
          { label: 'Dispensing Schedule', value: ord.type },
          { label: 'Prescribing Physician', value: `${ord.prescriber}, MD (Medical Director)` },
          { label: 'Effective Date', value: ord.effectiveDate },
          { label: 'Expiration Date', value: ord.expirationDate },
          { label: 'Physician Clinical Notes', value: ord.notes },
        ],
      });
    });

    // 2. Dose History (medicationHistory)
    medicationHistory.forEach((dose) => {
      list.push({
        id: dose.id,
        category: 'dose',
        filterType: 'Dose History',
        icon: Clock,
        iconBg: '#E0F2FE',
        iconColor: '#0284C7',
        title: `Dose Dispensed: ${dose.date} (${dose.mg} mg)`,
        type: `Dispensing Log · ${dose.visitType}`,
        date: dose.date,
        provider: dose.location,
        status: dose.status,
        statusTone: dose.status === 'Given' ? 'success' : dose.status === 'Take-home' ? 'primary' : dose.status === 'Missed' ? 'danger' : 'neutral',
        detailSummary: `Methadone ${dose.mg} mg oral suspension administration record for ${dose.date}.`,
        details: [
          { label: 'Dose Log ID', value: dose.id },
          { label: 'Date of Administration', value: dose.date },
          { label: 'Dose Quantity', value: `${dose.mg} mg oral liquid` },
          { label: 'Dispensing Modality', value: dose.visitType === 'Take-home' ? 'Take-home bottle dispensed' : 'Observed window dosing' },
          { label: 'Location / Bottle', value: dose.location },
          { label: 'Administration Status', value: dose.status },
          { label: 'Audit Verification', value: 'Electronic MAR (Medication Administration Record) Barcode Verified' },
        ],
      });
    });

    // 3. Lab & Toxicology Results (UDS)
    const udsLabs = [
      {
        id: 'UDS-9102',
        category: 'lab',
        hubTab: 'lab',
        filterType: 'Lab Results',
        icon: FlaskConical,
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        title: '8-Panel Urine Toxicology Screen (Sep 2026)',
        type: 'Lab Result · Comprehensive UDS',
        date: 'September 11, 2026',
        provider: 'Quest Diagnostics / BHG Knoxville Lab',
        status: 'Available',
        statusTone: 'success',
        detailSummary: 'Routine monthly compliance screen. Methadone metabolite confirmed present as prescribed; negative for all non-prescribed illicit substances.',
        details: [
          { label: 'Accession Number', value: 'UDS-9102-TN' },
          { label: 'Collection Timestamp', value: 'September 11, 2026 at 7:42 AM' },
          { label: 'Reviewed by Clinician', value: 'Alicia Monroe, LPC (Sep 14, 2026)' },
          { label: 'Methadone / EDDP Metabolite', value: 'Positive (Expected prescribed MAT)' },
          { label: 'Opiates (Morphine/Codeine)', value: 'Negative' },
          { label: 'Oxycodone', value: 'Negative' },
          { label: 'Fentanyl & Analogues', value: 'Negative' },
          { label: 'Buprenorphine', value: 'Negative' },
          { label: 'Benzodiazepines', value: 'Negative' },
          { label: 'Cocaine Metabolite', value: 'Negative' },
          { label: 'Amphetamines / Meth', value: 'Negative' },
          { label: 'Specimen Validity & Temp', value: 'Normal (96.4°F, Creatinine 82 mg/dL)' },
        ],
      },
      {
        id: 'UDS-8841',
        category: 'lab',
        hubTab: 'lab',
        filterType: 'Lab Results',
        icon: FlaskConical,
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        title: '8-Panel Urine Toxicology Screen (Aug 2026)',
        type: 'Lab Result · Comprehensive UDS',
        date: 'August 14, 2026',
        provider: 'Quest Diagnostics / BHG Knoxville Lab',
        status: 'Reviewed',
        statusTone: 'success',
        detailSummary: 'Expected methadone metabolite verified. Consistent with Phase 2 take-home stability criteria.',
        details: [
          { label: 'Accession Number', value: 'UDS-8841-TN' },
          { label: 'Collection Timestamp', value: 'August 14, 2026' },
          { label: 'Reviewed by Clinician', value: 'Dr. Marcus Hill, MD' },
          { label: 'Prescribed Methadone', value: 'Positive (Consistent)' },
          { label: 'Non-Prescribed Substances', value: 'None detected (Negative)' },
        ],
      },
      {
        id: 'LAB-7102',
        category: 'lab',
        hubTab: 'lab',
        filterType: 'Lab Results',
        icon: FlaskConical,
        iconBg: '#DCFCE7',
        iconColor: '#16A34A',
        title: 'Comprehensive Chemistry & Hep C Intake Panel',
        type: 'Lab Result · Blood Work & Serology',
        date: 'March 14, 2026',
        provider: 'Quest Diagnostics / BHG Lab Services',
        status: 'Reviewed',
        statusTone: 'success',
        detailSummary: 'Baseline admission blood work, complete metabolic panel (CMP), Hepatitis C antibody screening, and liver function assessment.',
        details: [
          { label: 'Accession Number', value: 'CMP-7102-TN' },
          { label: 'Collection Timestamp', value: 'March 14, 2026' },
          { label: 'Comprehensive Metabolic Panel', value: 'Normal limits' },
          { label: 'Liver Function (ALT / AST)', value: 'Normal (ALT: 28 U/L, AST: 24 U/L)' },
          { label: 'Hep C Antibody Screen', value: 'Non-reactive' },
          { label: 'TB QuantiFERON Gold', value: 'Negative' },
        ],
      },
    ];
    list.push(...udsLabs);

    // 4. Clinical & Counseling Summaries
    const clinicalNotes = [
      {
        id: 'CLIN-901',
        category: 'clinical',
        hubTab: 'clinical',
        filterType: 'Clinical Notes',
        icon: UserCheck,
        iconBg: '#DBEAFE',
        iconColor: '#2563EB',
        title: 'Individual Counseling Clinical Summary',
        type: 'Clinical Note · Counseling',
        date: 'September 3, 2026',
        provider: 'Alicia Monroe, LPC',
        status: 'Reviewed',
        statusTone: 'success',
        detailSummary: '50-minute individual counseling session. Treatment progress, coping strategies for workplace stress, and family recovery support reviewed.',
        details: [
          { label: 'Session Note ID', value: 'DS-2901' },
          { label: 'Clinician', value: 'Alicia Monroe, LPC (Primary Counselor)' },
          { label: 'Service Modality', value: 'Individual Counseling (50 min, In Person)' },
          { label: 'Treatment Phase', value: 'Phase 2 Maintenance' },
          { label: 'Clinical Assessment', value: 'Patient demonstrates solid emotional regulation and attendance consistency. No cravings reported on current 90 mg regimen.' },
          { label: 'Signatures on File', value: 'Patient & Clinician electronic signatures logged' },
        ],
      },
      {
        id: 'CLIN-807',
        category: 'clinical',
        hubTab: 'clinical',
        filterType: 'Clinical Notes',
        icon: UserCheck,
        iconBg: '#DBEAFE',
        iconColor: '#2563EB',
        title: 'Take-Home Medication Readiness Evaluation',
        type: 'Clinical Evaluation · Medical Provider',
        date: 'August 7, 2026',
        provider: 'Dr. Marcus Hill, MD',
        status: 'Reviewed',
        statusTone: 'success',
        detailSummary: 'Clinical medical evaluation for take-home bottle eligibility under SAMHSA and Tennessee state guidelines. Approved for 2 weekly take-home doses.',
        details: [
          { label: 'Evaluation ID', value: 'MED-REV-807' },
          { label: 'Evaluating Physician', value: 'Dr. Marcus Hill, MD (Medical Director)' },
          { label: 'Criteria Verified', value: 'Absence of illicit drug use, regular clinic attendance, locked home storage box verified, positive counseling engagement.' },
          { label: 'Clinical Outcome', value: 'Approved for Phase 2 Take-Home Schedule (Tuesday & Wednesday bottles)' },
        ],
      },
      {
        id: 'CLIN-314',
        category: 'clinical',
        hubTab: 'clinical',
        filterType: 'Clinical Notes',
        icon: UserCheck,
        iconBg: '#DBEAFE',
        iconColor: '#2563EB',
        title: 'Initial Medical & Clinical Intake Assessment',
        type: 'Clinical Assessment · Admission',
        date: 'March 14, 2026',
        provider: 'Dr. Marcus Hill, MD & Alicia Monroe',
        status: 'Completed',
        statusTone: 'success',
        detailSummary: 'Comprehensive clinical evaluation on admission day. Opioid Use Disorder diagnosis confirmed, medical appropriateness established for outpatient MAT.',
        details: [
          { label: 'Admission Assessment ID', value: 'INTAKE-2026-0314' },
          { label: 'Medical Director', value: 'Dr. Marcus Hill, MD' },
          { label: 'Primary Counselor', value: 'Alicia Monroe, LPC' },
          { label: 'Primary Diagnosis', value: 'Opioid Use Disorder (ICD-10 F11.20)' },
          { label: 'Care Plan Established', value: 'Individualized Opioid Treatment Plan signed and active' },
        ],
      },
    ];
    list.push(...clinicalNotes);

    return list;
  }, []);

  // Filtering Logic
  const filtered = useMemo(() => {
    return allRecords.filter((record) => {
      // Sub-filter chips
      if (activeFilter !== 'All' && record.filterType !== activeFilter) {
        return false;
      }
      // Search query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = record.title.toLowerCase().includes(q);
        const matchesType = record.type.toLowerCase().includes(q);
        const matchesProvider = record.provider.toLowerCase().includes(q);
        const matchesSummary = record.detailSummary?.toLowerCase().includes(q);
        const matchesId = record.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesType && !matchesProvider && !matchesSummary && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [allRecords, activeFilter, query]);

  const pendingReviewCount = allRecords.filter((r) => r.status === 'Review due' || r.status === 'Pending Review').length;

  return (
    <div className="bhg-page bhg-records-page animate-fade-in">
      {/* ══════ DETAIL SIDE DRAWER (PERFECTLY ALIGNED WORKFLOW DRAWER) ══════ */}
      {selectedRecord && (
        <WorkflowDrawer
          title={selectedRecord.title}
          subtitle={`${selectedRecord.type} · ${selectedRecord.date}`}
          onClose={() => {
            setSelectedRecord(null);
            setAiSummary(null);
          }}
          size="lg"
          footer={
            <>
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => {
                  setSelectedRecord(null);
                  setAiSummary(null);
                }}
              >
                Close
              </button>
              {selectedRecord.category === 'lab' && !aiSummary && (
                <button
                  type="button"
                  className="bhg-button bhg-button-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#0369A1', borderColor: '#7DD3FC', background: '#F0F9FF' }}
                  onClick={handleGenerateAiSummary}
                  disabled={generatingAi}
                >
                  <Sparkles size={14} style={{ color: '#0284C7' }} />
                  {generatingAi ? 'Analyzing...' : 'Explain with AI'}
                </button>
              )}
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => window.print()}
              >
                <Printer size={14} /> Print
              </button>
              <button
                type="button"
                className="bhg-button"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => {
                  addToast(`PDF export generated for ${selectedRecord.title}.`, 'success');
                }}
              >
                <Download size={14} /> Download PDF
              </button>
            </>
          }
        >
          <div style={{ padding: '20px 24px' }}>
            {/* Status & Date Tag */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <PillBadge tone={selectedRecord.statusTone}>{selectedRecord.status}</PillBadge>
              <span className="badge badge-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={12} /> {selectedRecord.date}
              </span>
            </div>

            {/* Provider Info Box */}
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 16px', border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Provider / Facility</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{selectedRecord.provider}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Record ID</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#005A70' }}>{selectedRecord.id}</span>
              </div>
            </div>

            {/* AI Plain-Language Explainer (For Lab & Toxicology Results) */}
            {selectedRecord.category === 'lab' && (
              <div style={{ marginBottom: 16 }}>
                {!aiSummary ? (
                  <button
                    type="button"
                    className="bhg-button"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)',
                      border: '1.5px solid #7DD3FC',
                      color: '#0369A1',
                      fontWeight: 700,
                      fontSize: 13.5,
                      borderRadius: 10,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(3, 105, 161, 0.08)',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={handleGenerateAiSummary}
                    disabled={generatingAi}
                  >
                    <Sparkles size={16} style={{ color: '#0284C7' }} />
                    {generatingAi ? 'Analyzing lab values with clinical AI...' : 'Explain with AI'}
                  </button>
                ) : (
                  <div
                    className="animate-fade-in"
                    style={{
                      background: '#F0FDF4',
                      border: '1.5px solid #86EFAC',
                      borderRadius: 12,
                      padding: '16px',
                      boxShadow: '0 3px 10px rgba(22, 163, 74, 0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13.5, color: '#166534' }}>
                        <Sparkles size={16} style={{ color: '#16A34A' }} />
                        AI Summary
                      </div>
                      <span style={{ fontSize: 11, background: '#DCFCE7', color: '#15803D', padding: '3px 9px', borderRadius: 99, fontWeight: 700 }}>
                        {aiSummary.confidence}% confidence
                      </span>
                    </div>

                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 12, lineHeight: 1.4 }}>
                      {aiSummary.headline}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                      {aiSummary.points.map((pt, idx) => (
                        <div key={idx} style={{ background: 'white', padding: '10px 12px', borderRadius: 8, border: '1px solid #DCFCE7', fontSize: 12.5, lineHeight: 1.5 }}>
                          <strong style={{ color: '#166534', display: 'block', marginBottom: 2 }}>{pt.label}:</strong>
                          <span style={{ color: '#334155' }}>{pt.text}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: '#DCFCE7', padding: '10px 12px', borderRadius: 8, fontSize: 12.5, color: '#14532D', lineHeight: 1.5, fontWeight: 600, marginBottom: 8 }}>
                      <strong>Recovery Takeaway:</strong> {aiSummary.bottomLine}
                    </div>

                    <div style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>{aiSummary.disclaimer}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clinical Details Rows */}
            <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '16px', border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#005A70', letterSpacing: '0.04em', marginBottom: 12 }}>
                Clinical Record Specifications
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedRecord.details?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: 8,
                      borderBottom: idx < selectedRecord.details.length - 1 ? '1px dashed #E2E8F0' : 'none',
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: '#64748B', flexShrink: 0, marginRight: 12 }}>{item.label}:</span>
                    <span style={{ fontWeight: 500, color: '#0F172A', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidentiality Notice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#64748B', padding: '10px 12px', background: '#F1F5F9', borderRadius: 8 }}>
              <LockKeyhole size={14} style={{ color: '#005A70', flexShrink: 0 }} />
              <span>Confidential substance use disorder patient record protected under federal 42 CFR Part 2 and HIPAA regulations.</span>
            </div>
          </div>
        </WorkflowDrawer>
      )}

      {/* ══════ PAGE HEADER ══════ */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-header-left">
          <h1 className="page-header-title" style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0F172A' }}>
            My Records
          </h1>
          <p className="page-header-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13.5, color: '#64748B' }}>
            Your health record hub · {allRecords.length} clinical records · {pendingReviewCount} pending review
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 260, background: 'white' }}>
          <Search size={16} color="#64748B" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medication orders, dose history, labs, clinical notes..."
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '13.5px' }}
          />
          {query && (
            <X size={14} style={{ cursor: 'pointer', color: '#64748B' }} onClick={() => setQuery('')} />
          )}
        </div>
        <button
          type="button"
          className="bhg-button bhg-button-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          onClick={() => setShowRecordsRequestModal(true)}
        >
          <FileText size={14} /> Request Certified Records
        </button>
      </div>

      {/* Unified Filter Chips Bar */}
      <div
        className="filter-bar"
        style={{
          marginBottom: 18,
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 4,
        }}
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-chip${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
            style={{
              fontSize: '12.5px',
              padding: '6px 14px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              background: activeFilter === f ? '#005A70' : 'white',
              color: activeFilter === f ? 'white' : '#475569',
              border: activeFilter === f ? '1px solid #005A70' : '1px solid #CBD5E1',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: activeFilter === f ? 600 : 500,
              transition: 'all 0.15s ease',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ══════ RECORDS LIST ══════ */}
      <div className="card" style={{ background: 'white', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto 12px auto', width: 48, height: 48, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={24} color="#64748B" />
            </div>
            <div className="empty-state-title" style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>No records found</div>
            <div className="empty-state-desc" style={{ fontSize: 13, color: '#64748B' }}>Try changing your search term or filter selection</div>
          </div>
        ) : (
          filtered.map((record) => (
            <div
              key={record.id}
              className="record-item"
              onClick={() => handleSelectRecord(record)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                borderBottom: '1px solid #F1F5F9',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              {/* Category Icon */}
              <div
                className="record-item-icon"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: record.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <record.icon size={20} color={record.iconColor} />
              </div>

              {/* Title & Metadata */}
              <div className="record-item-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="record-item-title" style={{ fontSize: 14.5, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>
                  {record.title}
                </div>
                <div className="record-item-meta" style={{ fontSize: 12.5, color: '#64748B', marginTop: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span>{record.type}</span>
                  <span>·</span>
                  <span>{record.date}</span>
                  <span>·</span>
                  <span>{record.provider}</span>
                  {record.category === 'lab' && (
                    <>
                      <span>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0369A1', fontWeight: 600, fontSize: 11.5, background: '#E0F2FE', padding: '1px 8px', borderRadius: 99 }}>
                        <Sparkles size={11} /> AI summary available
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badge + Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <PillBadge tone={record.statusTone}>{record.status}</PillBadge>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ══════ MODAL: REQUEST CERTIFIED RECORDS ══════ */}
      {showRecordsRequestModal && (
        <WorkflowModal
          title="Request Certified Medical Records"
          subtitle="Submit a formal records request to the BHG Health Information Management team"
          onClose={() => setShowRecordsRequestModal(false)}
          footer={
            <>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => setShowRecordsRequestModal(false)}>
                Cancel
              </button>
              <button type="button" className="bhg-button" onClick={handleRequestOfficialRecords}>
                Submit Request
              </button>
            </>
          }
        >
          <Field label="Who is this records request for?">
            <select value={recordsRecipient} onChange={(e) => setRecordsRecipient(e.target.value)}>
              <option>Self (Personal records)</option>
              <option>Outside Healthcare Provider / Physician</option>
              <option>Legal Counsel / Court / Probation</option>
              <option>Insurance / Disability Determination</option>
            </select>
          </Field>
          <Field label="Additional details or date range" hint="Include any specific dates or records needed.">
            <textarea
              rows="3"
              value={recordsNotes}
              onChange={(e) => setRecordsNotes(e.target.value)}
              placeholder="e.g., Full attendance and treatment summary for the past 6 months..."
            />
          </Field>
          <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <LockKeyhole size={14} style={{ color: '#005A70', flexShrink: 0 }} />
            <span>Records requests are processed within 2 to 5 business days in accordance with 42 CFR Part 2 and HIPAA.</span>
          </div>
        </WorkflowModal>
      )}

      {/* Footer Privacy Note */}
      <div className="bhg-privacy-note" style={{ marginTop: '24px' }}>
        <LockKeyhole size={17} />
        <span>Treatment records are confidential. Protected under federal 42 CFR Part 2 regulations.</span>
      </div>
    </div>
  );
}
