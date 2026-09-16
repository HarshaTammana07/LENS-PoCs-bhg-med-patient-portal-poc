import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  HeartHandshake,
  HelpCircle,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Pill,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TestTube2,
  UserRound,
  UsersRound,
  Video,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCounselingSessionSummary, generateUdsMonitoringSummary } from '../lib/aiDemo';
import { getCenterMapsUrl, sharedCounselingSessionNotes, supportFaqs } from '../data/bhgPatientData';
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

function AppointmentCard({ appointment, onDetails, onChange }) {
  const canRequestChange = appointmentTiming(appointment) === 'upcoming' && !isMedicationAppointment(appointment);

  return (
    <Card className="bhg-appointment">
      <div className="bhg-date-tile">
        <span>{appointment.dateShort.split(' ')[0]}</span>
        <strong>{appointment.dateShort.split(' ')[1]}</strong>
      </div>
      <div className="bhg-appointment-main">
        <div><PillBadge tone={appointmentStatusTone(appointment.status)}>{appointment.status}</PillBadge></div>
        <h2>{appointment.title}</h2>
        <p>{displayProviderName(appointment.provider)}</p>
        <div className="bhg-meta-line">
          <span><Clock3 size={15} /> {appointment.time} · {appointment.duration}</span>
          <span><MapPin size={15} /> {appointment.location}</span>
        </div>
        <small>{appointmentTiming(appointment) === 'past' ? (appointment.visitSummary || getSessionNotes(appointment)?.focus || 'Visit completed.') : appointment.preparation}</small>
      </div>
      <div className="bhg-appointment-actions">
        {appointment.requestStatus && <PillBadge tone="warning">{appointment.requestStatus}</PillBadge>}
        <ActionButton secondary onClick={() => onDetails(appointment)}>View details</ActionButton>
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
  const dayMap = { Mon: 'M', Tue: 'T', Wed: 'W', Thu: 'T', Fri: 'F', Sat: 'S', Sun: 'S' };
  return (
    <div className="bhg-weekly-strip" aria-label="This week's medication schedule">
      {schedule.map((item) => {
        const abbrev = dayMap[item.day.slice(0, 3)] || item.day[0];
        const tone = item.active ? 'today'
          : item.status === 'Take-home' ? 'takehome'
          : item.status === 'Closed' ? 'closed'
          : 'upcoming';
        return (
          <div key={item.date} className={`bhg-weekly-day bhg-weekly-day-${tone}`} title={`${item.day}: ${item.type}`}>
            <span className="bhg-weekly-abbrev">{abbrev}</span>
            <span className="bhg-weekly-dot" aria-hidden="true" />
            <span className="bhg-weekly-status">{item.active ? 'Today' : item.status === 'Take-home' ? 'TH' : item.status === 'Closed' ? '—' : '✓'}</span>
          </div>
        );
      })}
    </div>
  );
}

function RecoverySnapshot({ progress, treatment, weeklySchedule, onOpen }) {
  const topGoals = progress.currentGoals.slice(0, 2);
  const latestMilestone = progress.milestones[0];
  const overallProgress = Math.round(
    progress.currentGoals.reduce((sum, goal) => sum + goal.progress, 0) / progress.currentGoals.length
  );

  return (
    <button type="button" className="bhg-recovery-snapshot bhg-card bhg-card-compact" onClick={onOpen}>
      <SectionTitle
        title="Recovery at a glance"
        description={`${treatment.phase} phase · reviewed with your care team`}
        action={<span className="bhg-recovery-link">Full progress <ArrowRight size={14} /></span>}
      />

      {/* Visual row: donut + stats */}
      <div className="bhg-snapshot-visual-row">
        <AttendanceDonut rate={progress.attendanceRate} />
        <div className="bhg-snapshot-stats">
          <div><strong>{progress.enrolledDays}</strong><span>Days in treatment</span></div>
          <div><strong>{overallProgress}%</strong><span>Goal progress</span></div>
          <div><strong>{progress.completedGoals}</strong><span>Goals completed</span></div>
        </div>
      </div>

      {/* Animated weekly schedule strip */}
      {weeklySchedule && (
        <div className="bhg-snapshot-strip-wrap">
          <span className="bhg-snapshot-strip-label">This week</span>
          <WeeklyStrip schedule={weeklySchedule} />
        </div>
      )}

      <div className="bhg-recovery-goals">
        {topGoals.map((goal) => (
          <div key={goal.title} className="bhg-recovery-goal">
            <div className="bhg-recovery-goal-head">
              <strong>{goal.title}</strong>
              <span>{goal.progress}%</span>
            </div>
            <div className="bhg-progress-track"><span style={{ width: `${goal.progress}%` }} /></div>
          </div>
        ))}
      </div>
      {latestMilestone && (
        <div className="bhg-recovery-milestone">
          <Target size={15} />
          <span><strong>{latestMilestone.title}</strong> · {latestMilestone.date}</span>
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
  const isHold  = visitHoldStatus.status === 'hold';

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
    navigate,
  } = useApp();
  const [showHelp, setShowHelp] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const dashboardSteps = requiredActions.slice(0, 6);
  const nextStepsPreview = 4;
  const visibleSteps = showAllSteps ? dashboardSteps : dashboardSteps.slice(0, nextStepsPreview);
  const hiddenStepCount = Math.max(dashboardSteps.length - nextStepsPreview, 0);
  const nextAppointment = appointments[0];
  const unreadMessages = messages.filter((message) => message.unread).length;
  const latestRequest = workItems[0];
  const overallGoalProgress = Math.round(
    progress.currentGoals.reduce((sum, goal) => sum + goal.progress, 0) / progress.currentGoals.length
  );
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
            <strong>{treatment.phase}</strong>
            <span>{treatment.medication} · {treatment.status}</span>
            <ChevronRight size={16} className="bhg-metric-arrow" />
          </button>
          <button className="bhg-metric" onClick={() => navigate('progress')}>
            <span className="bhg-metric-icon"><Target size={17} /></span>
            <span className="bhg-metric-label">Recovery progress</span>
            <strong>{overallGoalProgress}%</strong>
            <span>{progress.completedGoals} goals completed</span>
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
          <Card className="bhg-card-compact bhg-dashboard-steps">
            <SectionTitle
              title="Your next steps"
              description="Items to discuss or complete with your care team."
            />
            <div className="bhg-action-list">
              {visibleSteps.map((item) => (
                <button key={item.id} className="bhg-action-row" onClick={() => navigate(item.page)}>
                  <span className="bhg-action-check"><Check size={15} /></span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span className="bhg-action-due">By {item.due}</span>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
            {hiddenStepCount > 0 && (
              <button
                type="button"
                className="bhg-steps-toggle"
                onClick={() => setShowAllSteps((open) => !open)}
                aria-expanded={showAllSteps}
              >
                {showAllSteps ? (
                  <>Show fewer steps <ChevronUp size={15} /></>
                ) : (
                  <>Show {hiddenStepCount} more step{hiddenStepCount === 1 ? '' : 's'} <ChevronDown size={15} /></>
                )}
              </button>
            )}
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
  const { treatment, patient, careTeam, counseling, appointments, center, navigate } = useApp();
  const nextVisits = appointments.filter((appointment) => appointmentTiming(appointment) === 'upcoming').slice(0, 3);

  return (
    <div className="bhg-page bhg-treatment-page animate-fade-in">
      <PageHeader
        eyebrow="My care"
        title="My treatment"
        description="Your current care plan, schedule, and care team."
        action={<PillBadge tone="success">{treatment.status} treatment</PillBadge>}
      />

      <div className="bhg-two-column">
        <Card className="bhg-feature-card">
          <div className="bhg-feature-heading">
            <span className="bhg-large-icon"><HeartHandshake size={25} /></span>
            <div>
              <PillBadge tone="success">{treatment.programShort}</PillBadge>
              <h2>{treatment.phase} care plan</h2>
              <p>Enrolled {patient.enrolledSince} · {patient.daysInTreatment} days in treatment</p>
            </div>
          </div>
          <div className="bhg-detail-grid bhg-detail-grid-treatment">
            <div><span>Program</span><strong>{treatment.programShort}</strong></div>
            <div><span>Medication</span><strong>{treatment.medication} {treatment.currentOrder}</strong></div>
            <div><span>Clinic visits</span><strong>Monday and Saturday</strong></div>
            <div><span>Take-home</span><strong>Tuesday and Wednesday</strong></div>
          </div>
          <div className="bhg-safe-callout bhg-treatment-inline-safety">
            <AlertCircle size={18} />
            <span>{treatment.safetyNote}</span>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Care team" description="The people connected to this plan." />
          <DetailRow label="Primary counselor" value={careTeam[0].name} />
          <DetailRow label="Medical provider" value={treatment.prescriber} />
          <DetailRow label="Clinic" value={`${center.shortName} · ${center.medicationWindow}`} />
          <button type="button" className="bhg-link-row" onClick={() => navigate('care-team')}>
            View care team <ArrowRight size={16} />
          </button>
        </Card>
      </div>

      <div className="bhg-two-column">
        <Card>
          <SectionTitle title="Medication schedule" description="This week's clinic and take-home routine." />
          <DetailRow label="Clinic visits" value="Monday and Saturday observed medication visits" />
          <DetailRow label="Take-home" value="Tuesday and Wednesday" />
          <DetailRow label="Medication window" value={center.medicationWindow} />
          <button type="button" className="bhg-link-row" onClick={() => navigate('medication')}>
            View weekly medication schedule <ArrowRight size={16} />
          </button>
        </Card>

        <Card>
          <SectionTitle title="Counseling" description="Your next scheduled support." />
          <DetailRow label="Counseling plan" value={counseling.plan} />
          <DetailRow label="Next counseling visit" value={`${appointments[0].date} at ${appointments[0].time}`} />
          <DetailRow label="Next group session" value={`${appointments[1].date} · ${appointments[1].modality}`} />
          <button type="button" className="bhg-link-row" onClick={() => navigate('appointments')}>
            Open counseling details <ArrowRight size={16} />
          </button>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Upcoming visits" description="The next items on your BHG calendar." />
        <div className="bhg-treatment-visits">
          {nextVisits.map((appointment) => (
            <button key={appointment.id} type="button" className="bhg-treatment-visit-row" onClick={() => navigate('appointments')}>
              <div className="bhg-date-tile compact">
                <span>{appointment.dateShort.split(' ')[0]}</span>
                <strong>{appointment.dateShort.split(' ')[1]}</strong>
              </div>
              <div>
                <strong>{appointment.title}</strong>
                <span>{appointment.time} · {appointment.provider}</span>
                <small>{appointment.location}</small>
              </div>
              <PillBadge tone={appointmentStatusTone(appointment.status)}>{appointment.status}</PillBadge>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
        <button type="button" className="bhg-link-row" onClick={() => navigate('appointments')}>
          View all visits <ArrowRight size={16} />
        </button>
      </Card>
    </div>
  );
}

export function Medication() {
  const { treatment, weeklySchedule, center, navigate, createRequest, addToast } = useApp();
  const [showReviewRequest, setShowReviewRequest] = useState(false);
  const [reviewReason, setReviewReason] = useState('I have a question about how I am feeling');
  const clinicDays = weeklySchedule.filter((item) => item.status !== 'Take-home').map((item) => item.day).join(', ');
  const takeHomeDays = weeklySchedule.filter((item) => item.status === 'Take-home').map((item) => item.day).join(', ');

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
        eyebrow="My care"
        title="Medication schedule"
        description="Your current clinic and take-home schedule for this week."
        action={<PillBadge tone="success">{treatment.visitStatus}</PillBadge>}
      />
      <div className="bhg-two-column">
        <Card className="bhg-feature-card">
          <SectionTitle title="This week's routine" description="Clinic days and take-home days at a glance." />
          <div className="bhg-medication-name">
            <span className="bhg-large-icon"><Pill size={25} /></span>
            <div><h2>{treatment.medication}</h2><p>{treatment.currentOrder} · {center.medicationWindow}</p></div>
          </div>
          <DetailRow label="Clinic visits" value={clinicDays} />
          <DetailRow label="Take-home" value={takeHomeDays || 'None this week'} />
          <DetailRow label="Location" value={center.shortName} />
        </Card>
        <Card>
          <SectionTitle title="Questions or concerns" description="Send a note if something about your medication feels different." />
          <div className="bhg-safe-callout"><ShieldCheck size={18} /><span>{treatment.safetyNote}</span></div>
          <button type="button" className="bhg-button bhg-button-secondary bhg-card-action" onClick={() => setShowReviewRequest(true)}>Request a medication review</button>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Weekly schedule" description={`${center.shortName} · ${center.medicationWindow}`} />
        <div className="bhg-schedule-list">
          {weeklySchedule.map((item) => (
            <div key={item.date} className={`bhg-schedule-row ${item.active ? 'active' : ''}`}>
              <div className="bhg-schedule-date"><strong>{item.day}</strong><span>{item.date}</span></div>
              <div className="bhg-schedule-type"><strong>{item.type}</strong><span>{item.time}</span></div>
              <PillBadge tone={item.active ? 'primary' : item.status === 'Take-home' ? 'success' : 'neutral'}>{item.status}</PillBadge>
            </div>
          ))}
        </div>
      </Card>
      <div className="bhg-info-banner">
        <AlertCircle size={18} />
        <span>Schedule questions or a missed visit? Call the center before changing your medication routine.</span>
        <button onClick={() => navigate('center')}>Contact center</button>
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
  const [sessionAiSummary, setSessionAiSummary] = useState(null);
  const [generatingSessionAi, setGeneratingSessionAi] = useState(false);
  const [reason, setReason] = useState('I need a different date or time');
  const [note, setNote] = useState('');
  const upcoming = appointments.filter((item) => appointmentTiming(item) === 'upcoming');
  const past = appointments.filter((item) => appointmentTiming(item) === 'past');
  const pendingOffers = (appointmentProposals || []).filter((item) => item.status === 'Awaiting patient response');
  const sessionNotes = selected ? getSessionNotes(selected) : null;

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
        eyebrow="My care"
        title="Visits"
        description="Counseling, group, and provider visits."
      />

      {pendingOffers.length > 0 && (
        <section className="bhg-appointment-section">
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

      <section className="bhg-appointment-section">
        <SectionTitle title="Upcoming" />
        <div className="bhg-stack">
          {upcoming.length ? upcoming.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onDetails={(item) => openAppointment(item, 'details')}
              onChange={(item) => openAppointment(item, 'change')}
            />
          )) : (
            <Card className="bhg-card-compact"><p className="bhg-body-copy">No upcoming visits are scheduled right now.</p></Card>
          )}
        </div>
      </section>

      <section className="bhg-appointment-section">
        <SectionTitle title="Previous" />
        <div className="bhg-stack">
          {past.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onDetails={(item) => openAppointment(item, 'details')}
              onChange={(item) => openAppointment(item, 'change')}
            />
          ))}
        </div>
      </section>

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
                      <button type="button" className="bhg-button bhg-button-secondary" onClick={() => addToast('Telehealth device check completed.', 'success')}>
                        <Video size={16} /> Test device
                      </button>
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
  const { labStatus, navigate, addToast } = useApp();
  const [aiSummary, setAiSummary] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);

  const runAiSummary = () => {
    if (generatingAi || aiSummary) return;
    setGeneratingAi(true);
    window.setTimeout(() => {
      setAiSummary(generateUdsMonitoringSummary(labStatus));
      setGeneratingAi(false);
      addToast('AI monitoring summary generated.', 'info');
    }, 1100);
  };

  const getScreenReviewPlan = (item) => {
    if (item.reviewPlan) return item.reviewPlan;
    if (item.reviewedBy) return `Reviewed and discussed with ${item.reviewedBy} on ${item.reviewedDate}. Care plan confirmed.`;
    return `Scheduled for private 1-on-1 review with ${labStatus.latest.reviewWith} at your upcoming counseling visit on ${labStatus.latest.reviewWhen.split(' · ')[0]}.`;
  };

  return (
    <div className="bhg-page bhg-labs-page animate-fade-in">
      <PageHeader
        eyebrow="My care"
        title="Lab & UDS"
        description="Private, supportive follow-up on routine treatment monitoring."
        action={<PillBadge tone={labStatusTone(labStatus.latest.status)}>{labStatus.latest.status}</PillBadge>}
      />

      <div className="bhg-treatment-stats bhg-labs-stats">
        <div><strong>{labStatus.stats.screensThisYear}</strong><span>Screens this year</span></div>
        <div><strong>{labStatus.stats.complianceLabel}</strong><span>Monitoring status</span></div>
        <div><strong>{labStatus.stats.lastReviewed}</strong><span>Last reviewed with you</span></div>
        <div><strong>{labStatus.stats.nextWindow}</strong><span>Next screening window</span></div>
      </div>

      <div className="bhg-two-column">
        <Card className="bhg-feature-card bhg-lab-hero">
          <div className="bhg-feature-heading">
            <span className="bhg-large-icon"><TestTube2 size={25} /></span>
            <div>
              <PillBadge tone={labStatusTone(labStatus.latest.status)}>{labStatus.latest.status}</PillBadge>
              <h2>{labStatus.latest.type}</h2>
              <p>Collected {labStatus.latest.collected}</p>
            </div>
          </div>
          <div className="bhg-detail-grid bhg-detail-grid-treatment">
            <div><span>Collection site</span><strong>{labStatus.latest.collectionSite}</strong></div>
            <div><span>Review with</span><strong>{labStatus.latest.reviewWith}</strong></div>
            <div><span>Planned review</span><strong>{labStatus.latest.reviewWhen}</strong></div>
            <div><span>Next screening</span><strong>{labStatus.nextExpected}</strong></div>
          </div>
          <p className="bhg-treatment-note">{labStatus.latest.detail}</p>
          <div className="bhg-lab-actions">
            <button type="button" className="bhg-button bhg-button-secondary" onClick={() => navigate('appointments')}>
              <CalendarDays size={15} /> View counseling visit
            </button>
            <button type="button" className="bhg-button bhg-button-secondary" onClick={() => navigate('messages')}>
              <MessageCircle size={15} /> Message care team
            </button>
            <button type="button" className="bhg-button" disabled={generatingAi || Boolean(aiSummary)} onClick={runAiSummary}>
              <Sparkles size={15} /> {generatingAi ? 'Summarizing…' : aiSummary ? 'Summary ready' : 'Explain with AI'}
            </button>
          </div>
          {aiSummary && (
            <div className="bhg-ai-summary bhg-lab-ai-summary">
              <strong><Sparkles size={15} /> AI summary · {aiSummary.confidence}% confidence</strong>
              <p>{aiSummary.text}</p>
              <small>{aiSummary.disclaimer}</small>
            </div>
          )}
        </Card>

        <Card className="bhg-lab-privacy-card">
          <SectionTitle title="Private review protocol" description="How routine screening fits into your BHG recovery plan." />
          <div className="bhg-safe-callout">
            <LockKeyhole size={18} />
            <span>Protected under 42 CFR Part 2 federal confidentiality standards. Detailed analyte values remain private to your care team.</span>
          </div>
          <div className="bhg-topic-list bhg-lab-expect-list">
            <div>
              <CheckCircle2 size={17} />
              <span><strong>1-on-1 Counselor Review:</strong> Results are discussed directly with Alicia Monroe during your scheduled session.</span>
            </div>
            <div>
              <CheckCircle2 size={17} />
              <span><strong>Supportive Care Tool:</strong> Routine UDS verifies medication safety and helps adjust your personalized treatment plan.</span>
            </div>
            <div>
              <CheckCircle2 size={17} />
              <span><strong>No Action Required:</strong> No advance preparation is needed before your routine clinic review.</span>
            </div>
          </div>
          <button type="button" className="bhg-link-row" onClick={() => navigate('appointments')}>
            Prepare for your next counseling visit <ArrowRight size={16} />
          </button>
        </Card>
      </div>

      <Card className="bhg-lab-history-card">
        <SectionTitle title="Recent screenings" description="Click any screening row to view review details, status, and care actions." />
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
                <small>{item.reviewedBy ? `Reviewed with ${item.reviewedBy} on ${item.reviewedDate}` : `Awaiting private review with ${labStatus.latest.reviewWith}`}</small>
              </div>
              <PillBadge tone={labStatusTone(item.status)}>{item.status}</PillBadge>
              <ChevronRight size={16} className="bhg-row-chevron" />
            </button>
          ))}
        </div>
      </Card>

      {selectedScreen && (
        <WorkflowDrawer
          title={`Screening details · ${selectedScreen.id}`}
          subtitle={`${selectedScreen.type} collected on ${selectedScreen.date}`}
          onClose={() => setSelectedScreen(null)}
          footer={
            <div className="bhg-drawer-actions">
              <button
                type="button"
                className="bhg-button bhg-button-secondary"
                onClick={() => {
                  setSelectedScreen(null);
                  navigate('messages');
                }}
              >
                <MessageCircle size={15} /> Message care team
              </button>
              <button
                type="button"
                className="bhg-button"
                onClick={() => {
                  setSelectedScreen(null);
                  navigate('appointments');
                }}
              >
                <CalendarDays size={15} /> View counseling visit
              </button>
            </div>
          }
        >
          <div className="bhg-screening-detail-body">
            <div className="bhg-screening-detail-header">
              <PillBadge tone={labStatusTone(selectedScreen.status)}>{selectedScreen.status}</PillBadge>
              <h3>{selectedScreen.panelName || (selectedScreen.type === 'Random UDS' ? 'Random OTP Compliance Screening' : '8-Panel Standard OTP Treatment Screen')}</h3>
              <p>Specimen ID: <strong>{selectedScreen.id}</strong></p>
            </div>

            <div className="bhg-detail-grid bhg-detail-grid-treatment">
              <div><span>Collection date</span><strong>{selectedScreen.date}</strong></div>
              <div><span>Screening type</span><strong>{selectedScreen.type}</strong></div>
              <div><span>Collection site</span><strong>{selectedScreen.collectionSite || 'BHG Knoxville · Specimen Window'}</strong></div>
              <div><span>Reviewer</span><strong>{selectedScreen.reviewedBy || labStatus.latest.reviewWith}</strong></div>
            </div>

            <div className="bhg-screening-section">
              <h4>Review status & clinical plan</h4>
              <div className="bhg-screening-plan-box">
                <CheckCircle2 size={18} className="bhg-plan-icon" />
                <div>
                  <strong>{selectedScreen.reviewedBy ? 'Reviewed & On File' : 'Pending 1-on-1 Counselor Review'}</strong>
                  <p>{getScreenReviewPlan(selectedScreen)}</p>
                </div>
              </div>
            </div>

            <div className="bhg-screening-section">
              <h4>Privacy & Confidentiality Notice</h4>
              <div className="bhg-safe-callout">
                <LockKeyhole size={18} />
                <span>{selectedScreen.privacyNote || 'Protected under 42 CFR Part 2 federal regulations. Detailed laboratory analyte breakdown remains confidential between you and your clinical care team.'}</span>
              </div>
            </div>

            <div className="bhg-screening-section">
              <h4>What this means for your care</h4>
              <ul className="bhg-lab-privacy-list">
                <li>Routine drug screening is a supportive tool in Medication-Assisted Treatment (MAT).</li>
                <li>Results are evaluated in full context with your counselor to track your recovery milestones.</li>
                <li>No disciplinary or automatic changes occur without private 1-on-1 counseling review.</li>
              </ul>
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

  return (
    <div className="bhg-page bhg-faq-page animate-fade-in">
      <PageHeader eyebrow="Support" title="Help & FAQ" description="Answers about treatment, the portal, and when to contact your care team." />

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
            All topics
          </button>
          {supportFaqs.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`bhg-faq-filter ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </Card>

      {!query && !activeCategory && (
        <div className="bhg-faq-topics">
          {supportFaqs.map((category) => (
            <button key={category.id} type="button" className="bhg-card bhg-faq-topic-card" onClick={() => setActiveCategory(category.id)}>
              <HelpCircle size={20} />
              <strong>{category.title}</strong>
              <span>{category.description}</span>
              <small>{category.faqs.length} questions</small>
            </button>
          ))}
        </div>
      )}

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
                  {isOpen && <div className="bhg-faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      {displayCategories.length === 0 && (
        <Card className="bhg-card-compact">
          <p className="bhg-body-copy">No questions matched your search. Try another keyword or contact your care team.</p>
        </Card>
      )}

      <Card>
        <SectionTitle title="Still need help?" description="Choose the safest option for your situation." />
        <div className="bhg-faq-contact-grid">
          <a href={`tel:${center.phone.replace(/\D/g, '')}`} className="bhg-faq-contact-item">
            <Phone size={18} />
            <strong>Call {center.shortName}</strong>
            <span>Medication visits and same-day treatment questions</span>
            <b>{center.phone}</b>
          </a>
          <button type="button" className="bhg-faq-contact-item" onClick={() => navigate('messages')}>
            <MessageCircle size={18} />
            <strong>Secure message</strong>
            <span>Non-urgent questions for your care team</span>
            <b>Open messages</b>
          </button>
          <a href={getCenterMapsUrl(center)} target="_blank" rel="noreferrer" className="bhg-faq-contact-item">
            <Navigation size={18} />
            <strong>Get directions</strong>
            <span>{center.address}</span>
            <b>Google Maps</b>
          </a>
          <a href="tel:988" className="bhg-faq-contact-item crisis">
            <HeartHandshake size={18} />
            <strong>Crisis support · 988</strong>
            <span>Free, confidential help 24/7 — call or text</span>
            <b>Not for emergencies</b>
          </a>
        </div>
        <div className="bhg-privacy-note"><AlertCircle size={17} /><span>For emergencies call 911. Secure messages are not monitored continuously.</span></div>
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
  const { coverage, careTeam, createRequest, addToast } = useApp();
  const [showHelp, setShowHelp] = useState(false);
  const [helpType, setHelpType] = useState('I have a question about my coverage');
  const [details, setDetails] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);

  const submit = () => {
    createRequest({ type: 'Financial assistance', title: helpType, detail: details || helpType, page: 'payments' });
    addToast('Your financial-support request was sent.');
    setShowHelp(false);
  };

  const payBalance = () => {
    addToast('Demo payment submitted. Your balance will update after processing.', 'success');
  };

  return (
    <div className="bhg-page bhg-payments-page animate-fade-in">
      <PageHeader
        eyebrow="Account"
        title="Coverage & payments"
        description="Insurance, claims, statements, and your current patient balance."
        action={<PillBadge tone={coverage.balance > 0 ? 'warning' : 'success'}>{coverage.balanceStatus}</PillBadge>}
      />

      <div className="bhg-treatment-stats bhg-payments-stats">
        <div><strong>${coverage.balance.toFixed(2)}</strong><span>Amount you owe</span></div>
        <div><strong>{coverage.summary.claimsYtd}</strong><span>Claims this year</span></div>
        <div><strong>${coverage.summary.insurancePaidYtd.toFixed(0)}</strong><span>Insurance paid YTD</span></div>
        <div><strong>{coverage.dueDate}</strong><span>Balance due date</span></div>
      </div>

      <Card className="bhg-billing-explainer">
        <AlertCircle size={18} />
        <p>
          <strong>How to read this page:</strong> Claims show services BHG billed to your plan.
          Insurance paid is what TennCare covered. Your share is copays or allowed patient responsibility still owed after claims process.
        </p>
      </Card>

      <div className="bhg-two-column bhg-two-column-wide">
        <Card className="bhg-feature-card">
          <div className="bhg-feature-heading">
            <span className="bhg-large-icon"><ShieldCheck size={25} /></span>
            <div>
              <PillBadge tone="success">{coverage.status}</PillBadge>
              <h2>{coverage.payer}</h2>
              <p>{coverage.planType}</p>
            </div>
          </div>
          <div className="bhg-detail-grid bhg-detail-grid-treatment">
            <div><span>Member ID</span><strong>{coverage.memberId}</strong></div>
            <div><span>Group number</span><strong>{coverage.groupNumber}</strong></div>
            <div><span>Last verified</span><strong>{coverage.verified}</strong></div>
            <div><span>Authorization</span><strong>{coverage.authorization}</strong></div>
            <div><span>Authorization ID</span><strong>{coverage.authorizationId}</strong></div>
            <div><span>Patient share YTD</span><strong>${coverage.summary.patientShareYtd.toFixed(2)}</strong></div>
          </div>
        </Card>

        <Card className="bhg-balance-card">
          <SectionTitle title="Patient balance" description="After insurance has processed recent claims." />
          <div className="bhg-balance">${coverage.balance.toFixed(2)}</div>
          <p className="bhg-body-copy">{coverage.nextPayment}</p>
          <DetailRow label="Due date" value={coverage.dueDate} />
          <DetailRow label="Last payment" value={`$${coverage.lastPayment.amount.toFixed(2)} on ${coverage.lastPayment.date}`} />
          <DetailRow label="Payment method" value={coverage.lastPayment.method} />
          <div className="bhg-balance-actions">
            <button type="button" className="bhg-button" onClick={payBalance} disabled={coverage.balance <= 0}>
              <CreditCard size={15} /> Pay balance
            </button>
            <ActionButton secondary onClick={() => setShowHelp(true)}>Request help</ActionButton>
          </div>
        </Card>
      </div>

      <Card className="bhg-claims-card">
        <SectionTitle title="Recent claims" description="Treatment services billed to your coverage — click a row for details." />
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
              <span>${claim.patientOwes.toFixed(2)}</span>
              <PillBadge tone={claimStatusTone(claim.status)}>{claim.status}</PillBadge>
            </button>
          ))}
        </div>
      </Card>

      <div className="bhg-two-column">
        <Card>
          <SectionTitle title="Payment history" description="Posted payments on your account." />
          <div className="bhg-payment-history">
            {coverage.paymentHistory.map((payment) => (
              <div key={payment.id} className="bhg-payment-history-row">
                <div>
                  <strong>${payment.amount.toFixed(2)} · {payment.method}</strong>
                  <span>{payment.date}</span>
                  <small>{payment.detail}</small>
                </div>
                <PillBadge tone="success">{payment.status}</PillBadge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Statements" description="Monthly patient-responsibility summaries." />
          <div className="bhg-statement-list">
            {coverage.statements.map((statement) => (
              <div key={statement.id} className="bhg-statement-row">
                <div>
                  <strong>{statement.period}</strong>
                  <span>Issued {statement.issued} · Due {statement.due}</span>
                </div>
                <div className="bhg-statement-meta">
                  <b>${statement.balance.toFixed(2)}</b>
                  <PillBadge tone={statement.status === 'Open' ? 'warning' : 'success'}>{statement.status}</PillBadge>
                </div>
                <button type="button" className="bhg-text-button" onClick={() => addToast('Demo statement PDF opened.', 'info')}>
                  <Download size={14} /> PDF
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Help with coverage or cost" />
        <p className="bhg-body-copy">{coverage.assistance}</p>
        <div className="bhg-contact-strip">
          <div className="bhg-person-avatar">{careTeam[2].initials}</div>
          <div><strong>{careTeam[2].name}</strong><span>{careTeam[2].role}</span></div>
          <ActionButton secondary onClick={() => setShowHelp(true)}>Request help</ActionButton>
        </div>
      </Card>

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

      {showHelp && (
        <WorkflowModal
          title="Request coverage or payment help"
          subtitle={careTeam[2].name}
          onClose={() => setShowHelp(false)}
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
        </WorkflowModal>
      )}
    </div>
  );
}

export function Documents() {
  const { documents, acknowledgeDocument, addToast } = useApp();
  const [selected, setSelected] = useState(null);
  const acknowledge = () => {
    acknowledgeDocument(selected.id);
    addToast('Your acknowledgment was saved.');
    setSelected(null);
  };
  return (
    <div className="bhg-page animate-fade-in">
      <PageHeader eyebrow="Account" title="Forms & documents" description="Your treatment forms, privacy notices and agreements." />
      <Card>
        <div className="bhg-document-list">
          {documents.map((document) => (
            <div className="bhg-document-row" key={document.id}>
              <span className="bhg-doc-icon"><FileText size={19} /></span>
              <div><h3>{document.name}</h3><p>{document.category} · {document.date}</p></div>
              <PillBadge tone={document.status === 'Review due' ? 'warning' : 'success'}>{document.status}</PillBadge>
              <button aria-label={`Open ${document.name}`} onClick={() => setSelected(document)}><Download size={18} /></button>
            </div>
          ))}
        </div>
      </Card>
      {selected && <WorkflowModal title={selected.name} subtitle={`${selected.category} · ${selected.date}`} onClose={() => setSelected(null)} footer={<><button className="bhg-button bhg-button-secondary" onClick={() => addToast('Demo PDF preview opened.', 'info')}>View document</button>{selected.status === 'Review due' ? <button className="bhg-button" onClick={acknowledge}>Acknowledge update</button> : <button className="bhg-button" onClick={() => setSelected(null)}>Done</button>}</>}>
        <DemoBanner />
        <div className="bhg-document-preview">
          <FileCheck2 size={28} />
          <h3>{selected.name}</h3>
          <p>This demonstration represents the patient-facing summary of the document stored with the treatment record.</p>
          <DetailRow label="Current status" value={selected.status} />
          <DetailRow label="Recorded date" value={selected.date} />
          {selected.id === 'DOC-4' && <div className="bhg-safe-callout"><LockKeyhole size={18} /><span>I agree that BHG may use my selected phone, text, and voicemail preferences to communicate about treatment operations. Sensitive details should not be included in voicemail.</span></div>}
        </div>
      </WorkflowModal>}
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

function MilestoneTimeline({ milestones }) {
  const icons = ['🏁', '⭐', '💙', '🤝', '✅'];
  return (
    <div className="bhg-milestone-timeline" aria-label="Recovery milestones">
      {milestones.map((item, i) => (
        <div key={item.date} className={`bhg-milestone-item ${i === 0 ? 'bhg-milestone-latest' : ''}`}>
          <div className="bhg-milestone-icon-col">
            <span className="bhg-milestone-icon">{icons[i % icons.length]}</span>
            {i < milestones.length - 1 && <span className="bhg-milestone-connector" aria-hidden="true" />}
          </div>
          <div className="bhg-milestone-body">
            <small>{item.date}</small>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Progress() {
  const { progress, treatment, navigate } = useApp();
  const overallProgress = Math.round(
    progress.currentGoals.reduce((sum, goal) => sum + goal.progress, 0) / progress.currentGoals.length
  );

  const ringColors = ['var(--accent)', 'var(--secondary)', '#22A06B'];

  return (
    <div className="bhg-page bhg-progress-page animate-fade-in">
      <PageHeader
        eyebrow="My recovery"
        title="Recovery progress"
        description="A private view of the goals you set with your care team."
        action={<PillBadge tone="primary">{treatment.phase} phase</PillBadge>}
      />

      {/* Visual metrics strip */}
      <div className="bhg-progress-visual-strip">
        <div className="bhg-progress-visual-stat">
          <GoalRing progress={overallProgress} size={88} stroke={8} color="var(--accent)" />
          <div><strong>{overallProgress}%</strong><span>Overall goal progress</span></div>
        </div>
        <div className="bhg-progress-visual-stat">
          <GoalRing progress={progress.attendanceRate} size={88} stroke={8} color="var(--secondary)" />
          <div><strong>{progress.attendanceRate}%</strong><span>Visit consistency</span></div>
        </div>
        <div className="bhg-progress-visual-center-stat">
          <span className="bhg-progress-big-number">{progress.enrolledDays}</span>
          <span className="bhg-progress-big-label">Days in treatment</span>
        </div>
        <div className="bhg-progress-visual-center-stat">
          <span className="bhg-progress-big-number">{progress.counselingSessions}</span>
          <span className="bhg-progress-big-label">Counseling sessions</span>
        </div>
        <div className="bhg-progress-visual-center-stat">
          <span className="bhg-progress-big-number">{progress.completedGoals}</span>
          <span className="bhg-progress-big-label">Goals completed</span>
        </div>
      </div>

      <div className="bhg-two-column bhg-two-column-wide">
        <Card className="bhg-feature-card">
          <div className="bhg-feature-heading">
            <span className="bhg-large-icon"><Target size={25} /></span>
            <div>
              <PillBadge tone="success">Active goals</PillBadge>
              <h2>{treatment.phase} recovery plan</h2>
              <p>Last reviewed {progress.lastReview} · Next review {progress.nextReview}</p>
            </div>
          </div>
          <p className="bhg-body-copy">{progress.summary}</p>
          <div className="bhg-detail-grid bhg-detail-grid-treatment">
            <div><span>Primary counselor</span><strong>{progress.counselor}</strong></div>
            <div><span>Last plan update</span><strong>{treatment.lastPlanUpdate}</strong></div>
            <div><span>Goals completed</span><strong>{progress.completedGoals} total</strong></div>
            <div><span>Current focus</span><strong>{treatment.lastPlanFocus}</strong></div>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Engagement at a glance" description="How your recovery supports connect across care." />
          <div className="bhg-progress-engagement">
            {progress.engagementAreas.map((area) => (
              <button key={area.title} type="button" className="bhg-progress-engagement-row" onClick={() => navigate(area.page)}>
                <div>
                  <strong>{area.title}</strong>
                  <span>{area.note}</span>
                </div>
                <div className="bhg-progress-engagement-meta">
                  <b>{area.metric}</b>
                  <div className="bhg-progress-track"><span style={{ width: `${area.progress}%` }} /></div>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Visual goal rings */}
      <Card>
        <SectionTitle title="Current goals" description="Set and reviewed with your counselor — not self-assigned in the portal." />
        <div className="bhg-goal-rings-grid">
          {progress.currentGoals.map((goal, i) => (
            <div key={goal.title} className="bhg-goal-ring-card">
              <GoalRing progress={goal.progress} size={80} stroke={7} color={ringColors[i % ringColors.length]} />
              <div className="bhg-goal-ring-info">
                <PillBadge tone="neutral">{goal.focus}</PillBadge>
                <strong>{goal.title}</strong>
                <span>{goal.note}</span>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="bhg-link-row" onClick={() => navigate('appointments')}>
          Prepare for your next counseling visit <ArrowRight size={16} />
        </button>
      </Card>

      {/* Visual milestone timeline + completed goals side by side */}
      <div className="bhg-two-column">
        <Card>
          <SectionTitle title="Recovery milestones" description="Key moments in your treatment journey." />
          <MilestoneTimeline milestones={progress.milestones} />
        </Card>

        <Card>
          <SectionTitle title="Completed goals" description="Earlier goals you and your care team have already achieved." />
          <div className="bhg-progress-completed">
            {progress.completedGoalsList.map((goal) => (
              <div key={goal.title} className="bhg-progress-completed-row">
                <CheckCircle2 size={18} />
                <div>
                  <strong>{goal.title}</strong>
                  <span>Completed {goal.completedDate}</span>
                  <small>{goal.note}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="bhg-safe-callout bhg-progress-privacy">
            <LockKeyhole size={18} />
            <span>Recovery progress is shared only with your authorized BHG care team. Detailed clinical notes remain in your treatment record.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function Center() {
  const { center, recoveryResources } = useApp();
  const mapsUrl = getCenterMapsUrl(center);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(center.address)}&output=embed`;

  return (
    <div className="bhg-page bhg-center-page animate-fade-in">
      <PageHeader
        eyebrow="Support"
        title="Treatment center"
        description="Hours, directions and important contact information."
        action={(
          <a className="bhg-button" href={mapsUrl} target="_blank" rel="noreferrer">
            <Navigation size={16} /> Get directions
          </a>
        )}
      />
      <Card className="bhg-center-map-card">
        <div className="bhg-center-map-frame">
          <iframe title={`Map — ${center.name}`} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
        <div className="bhg-center-map-footer">
          <div>
            <strong>{center.address}</strong>
            <span>{center.directions}</span>
          </div>
          <a className="bhg-button bhg-button-secondary" href={mapsUrl} target="_blank" rel="noreferrer">
            <Navigation size={15} /> Open in Google Maps
          </a>
        </div>
      </Card>
      <div className="bhg-two-column">
        <Card className="bhg-feature-card">
          <div className="bhg-feature-heading"><span className="bhg-large-icon"><MapPin size={25} /></span><div><PillBadge tone="success">{center.status}</PillBadge><h2>{center.name}</h2><p>{center.address}</p></div></div>
          <DetailRow label="Medication window" value={center.medicationWindow} />
          <DetailRow label="Counseling hours" value={center.counselingHours} />
          <DetailRow label="Main phone" value={center.phone} />
          <DetailRow label="Today’s hours" value={center.todayHours} />
          <p className="bhg-body-copy">{center.directions}</p>
          <a className="bhg-link-row" href={mapsUrl} target="_blank" rel="noreferrer">
            Start navigation to BHG Knoxville <ArrowRight size={16} />
          </a>
        </Card>
        <Card>
          <SectionTitle title="Schedule notice" />
          <div className="bhg-safe-callout"><CalendarDays size={18} /><span>{center.holidayNotice}</span></div>
          <p className="bhg-body-copy">Call before traveling if severe weather or an emergency may affect center hours.</p>
        </Card>
      </div>
      <Card>
        <SectionTitle title="Important contacts" />
        <div className="bhg-resource-grid">
          {recoveryResources.map((resource) => (
            <a href={resource.href} key={resource.title}><Phone size={18} /><strong>{resource.title}</strong><span>{resource.detail}</span><b>{resource.action}</b></a>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function Profile() {
  const { patient, center, updatePatient, addToast } = useApp();
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
          <DetailRow label="Treatment center" value={center.shortName} />
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

export function Notifications() {
  const { notifications, markNotificationRead, navigate } = useApp();
  return (
    <div className="bhg-page animate-fade-in">
      <PageHeader eyebrow="Account" title="Notifications" description="Important updates about your treatment and appointments." />
      <Card className="bhg-message-list">
        {notifications.map((notification) => (
          <button key={notification.id} className={`bhg-message-row ${notification.unread ? 'unread' : ''}`} onClick={() => { markNotificationRead(notification.id); navigate(notification.page); }}>
            <span className="bhg-notification-icon"><Sparkles size={18} /></span>
            <div className="bhg-message-body"><div><strong>{notification.title}</strong><span>{notification.time}</span></div><p>{notification.detail}</p></div>
            {notification.unread && <span className="bhg-unread-dot" aria-label="Unread notification" />}
          </button>
        ))}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TREATMENT RECORDS PAGE
   BHG-specific record view grounded in SAMMS tables:
   tbl_Orders, tbl_DOSE, tbl_DartsSrv, tbl_UAResults, tbl_BamForm/BamScore,
   tbl_AdmissionAssessmentSummary, tbl_CONSENTS
   ══════════════════════════════════════════════════════════════════════════ */

function RecordsTab({ id, label, icon: Icon, active, count, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={`bhg-rec-tab ${active ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      <Icon size={15} />
      <span>{label}</span>
      {count != null && <span className="bhg-rec-tab-count">{count}</span>}
    </button>
  );
}

function RecordsBadge({ status }) {
  const tone = status === 'Active' || status === 'Given' || status === 'Signed' || status === 'Acknowledged'
    ? 'success'
    : status === 'Take-home'
      ? 'takehome'
      : status === 'Missed' || status === 'Hold'
        ? 'danger'
        : status === 'Review due'
          ? 'warning'
          : 'neutral';
  return <span className={`bhg-rec-badge bhg-rec-badge-${tone}`}>{status}</span>;
}

function BamScoreBar({ score, maxScore, lower }) {
  const pct = Math.round((score / maxScore) * 100);
  // For "lower is better" subscales, good = low pct → green at left end
  // For "higher is better" subscales, good = high pct → green fill
  const fillColor = lower
    ? (pct <= 25 ? '#22A06B' : pct <= 50 ? '#f59e0b' : '#ef4444')
    : (pct >= 75 ? '#22A06B' : pct >= 50 ? '#f59e0b' : '#ef4444');

  return (
    <div className="bhg-bam-bar-wrap">
      <div className="bhg-bam-bar-track">
        <span
          className="bhg-bam-bar-fill"
          style={{ width: `${pct}%`, background: fillColor }}
        />
      </div>
      <span className="bhg-bam-bar-value">{score} / {maxScore}</span>
    </div>
  );
}

export function TreatmentRecords() {
  const {
    patient,
    treatment,
    orderHistory,
    medicationHistory,
    counselingSessions,
    bamAssessments,
    intakeSummary,
    documents,
    labStatus,
    careTeam,
    emergencyContact,
    navigate,
    addToast,
  } = useApp();

  const TABS = [
    { id: 'medication',  label: 'Medication',  icon: Pill },
    { id: 'counseling',  label: 'Counseling',  icon: MessageCircle },
    { id: 'screening',   label: 'UDS & Labs',  icon: TestTube2 },
    { id: 'assessments', label: 'Assessments', icon: Activity },
    { id: 'consents',    label: 'Consents',    icon: FileCheck2 },
  ];

  const [activeTab, setActiveTab] = useState('medication');
  const [expandedDose, setExpandedDose] = useState(false);
  const [expandedSession, setExpandedSession] = useState(null);
  const [expandedDimension, setExpandedDimension] = useState(null);

  const SHOW_DOSES = 5;
  const visibleDoses = expandedDose ? medicationHistory : medicationHistory.slice(0, SHOW_DOSES);

  return (
    <div className="bhg-page bhg-records-page animate-fade-in">
      <PageHeader
        eyebrow="My treatment"
        title="Treatment records"
        description="Your BHG treatment history — medications, counseling, drug screens, assessments, and consents."
        action={<PillBadge tone="success">{treatment.status} · {treatment.program.split('(')[0].trim()}</PillBadge>}
      />

      {/* ── Quick stats strip ── */}
      <div className="bhg-rec-stats">
        <div><strong>{patient.daysInTreatment}</strong><span>Days in treatment</span></div>
        <div><strong>{orderHistory.filter(o => o.status === 'Active').length}</strong><span>Active medication order</span></div>
        <div><strong>{counselingSessions.length}</strong><span>Counseling sessions</span></div>
        <div><strong>{labStatus.history.length}</strong><span>Drug screens on file</span></div>
        <div><strong>{bamAssessments.length}</strong><span>BAM assessments</span></div>
        <div><strong>{documents.filter(d => d.status !== 'Review due').length} / {documents.length}</strong><span>Consents current</span></div>
      </div>

      {/* ── Tab bar ── */}
      <div className="bhg-rec-tabs" role="tablist" aria-label="Treatment record sections">
        {TABS.map((tab) => (
          <RecordsTab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* ══════ TAB: MEDICATION ══════ */}
      {activeTab === 'medication' && (
        <div className="bhg-rec-panel animate-fade-in" role="tabpanel">

          {/* Current active order — featured card */}
          {orderHistory.filter(o => o.status === 'Active').map((order) => (
            <div key={order.id} className="bhg-rec-order-featured">
              <div className="bhg-rec-order-featured-left">
                <div className="bhg-rec-order-med-icon" aria-hidden="true"><Pill size={22} /></div>
                <div>
                  <div className="bhg-eyebrow">Current active order · {order.id}</div>
                  <h2>{order.med} <span>{order.dose}</span></h2>
                  <p>{order.type}</p>
                  <p className="bhg-rec-order-note">{order.notes}</p>
                </div>
              </div>
              <div className="bhg-rec-order-featured-right">
                <div><span>Prescriber</span><strong>{order.prescriber}</strong></div>
                <div><span>Effective</span><strong>{order.effectiveDate}</strong></div>
                <div><span>Authorization</span><strong>{order.expirationDate}</strong></div>
                <div><span>Status</span><RecordsBadge status={order.status} /></div>
              </div>
            </div>
          ))}

          {/* Order history */}
          <Card>
            <SectionTitle title="Medication order history" description="Orders are written by your prescriber and cannot be changed in the portal." />
            <div className="bhg-rec-order-list">
              {orderHistory.map((order) => (
                <div key={order.id} className={`bhg-rec-order-row ${order.status === 'Active' ? 'active' : ''}`}>
                  <div className="bhg-rec-order-row-left">
                    <div className="bhg-rec-order-icon-sm" aria-hidden="true">
                      {order.status === 'Active' ? <Pill size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <strong>{order.med} · {order.dose}</strong>
                      <span>{order.type}</span>
                      <small>{order.notes}</small>
                    </div>
                  </div>
                  <div className="bhg-rec-order-row-right">
                    <span>{order.effectiveDate}</span>
                    <RecordsBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent doses */}
          <Card>
            <SectionTitle
              title="Recent dose log"
              description="Observed clinic visits and approved take-home days — last 10 entries."
            />
            <div className="bhg-rec-dose-list">
              <div className="bhg-rec-dose-head">
                <span>Date</span><span>Type</span><span>Dose (mg)</span><span>Location</span><span>Status</span>
              </div>
              {visibleDoses.map((dose) => (
                <div key={dose.id} className="bhg-rec-dose-row">
                  <span>{dose.date}</span>
                  <span>{dose.visitType}</span>
                  <span><strong>{dose.mg} mg</strong></span>
                  <span>{dose.location}</span>
                  <RecordsBadge status={dose.status} />
                </div>
              ))}
            </div>
            {medicationHistory.length > SHOW_DOSES && (
              <button type="button" className="bhg-steps-toggle" onClick={() => setExpandedDose(v => !v)}>
                {expandedDose
                  ? <><ChevronUp size={14} /> Show fewer</>
                  : <><ChevronDown size={14} /> Show all {medicationHistory.length} entries</>}
              </button>
            )}
            <div className="bhg-safe-callout" style={{ marginTop: 14 }}>
              <ShieldCheck size={18} />
              <span>Contact the center before any changes to your medication routine. Your prescriber manages all dose adjustments.</span>
            </div>
          </Card>
        </div>
      )}

      {/* ══════ TAB: COUNSELING ══════ */}
      {activeTab === 'counseling' && (
        <div className="bhg-rec-panel animate-fade-in" role="tabpanel">

          {/* Stats */}
          <div className="bhg-rec-session-stats">
            <div className="bhg-rec-session-stat">
              <strong>{counselingSessions.filter(s => s.serviceType === 'Individual').length}</strong>
              <span>Individual sessions</span>
            </div>
            <div className="bhg-rec-session-stat">
              <strong>{counselingSessions.filter(s => s.serviceType === 'Group').length}</strong>
              <span>Group sessions</span>
            </div>
            <div className="bhg-rec-session-stat">
              <strong>{counselingSessions.filter(s => s.telehealth).length}</strong>
              <span>Telehealth sessions</span>
            </div>
            <div className="bhg-rec-session-stat">
              <strong>{counselingSessions.filter(s => s.patientSigned).length}</strong>
              <span>Patient-acknowledged</span>
            </div>
          </div>

          <Card>
            <SectionTitle
              title="Counseling session log"
              description="Sessions documented by your counselor in SAMMS. Patient-facing summaries only — detailed clinical notes stay in your treatment record."
            />
            <div className="bhg-rec-session-list">
              {counselingSessions.map((session) => (
                <div key={session.id} className="bhg-rec-session-row">
                  <button
                    type="button"
                    className="bhg-rec-session-header"
                    onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                    aria-expanded={expandedSession === session.id}
                  >
                    <div className="bhg-rec-session-date-tile">
                      <span>{session.dateShort.split(' ')[0]}</span>
                      <strong>{session.dateShort.split(' ')[1]}</strong>
                    </div>
                    <div className="bhg-rec-session-info">
                      <div className="bhg-rec-session-top">
                        <strong>{session.type}</strong>
                        <div className="bhg-rec-session-chips">
                          <PillBadge tone={session.serviceType === 'Group' ? 'neutral' : 'primary'}>
                            {session.serviceType}
                          </PillBadge>
                          {session.telehealth && <PillBadge tone="neutral"><Video size={11} /> Telehealth</PillBadge>}
                          {session.patientSigned && <PillBadge tone="success"><Check size={11} /> Signed</PillBadge>}
                        </div>
                      </div>
                      <span>{session.counselor} · {session.duration}</span>
                    </div>
                    {expandedSession === session.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {expandedSession === session.id && (
                    <div className="bhg-rec-session-detail">
                      <div className="bhg-rec-detail-grid">
                        <div><span>Date</span><strong>{session.date}</strong></div>
                        <div><span>Format</span><strong>{session.format}</strong></div>
                        <div><span>Duration</span><strong>{session.duration}</strong></div>
                        <div><span>Counselor</span><strong>{session.counselor}</strong></div>
                      </div>
                      <div className="bhg-rec-session-summary">
                        <strong>Session summary</strong>
                        <p>{session.summary}</p>
                      </div>
                      <DemoBanner>Patient-facing session summary only — not counselor documentation or raw clinical notes.</DemoBanner>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ══════ TAB: UDS & LABS ══════ */}
      {activeTab === 'screening' && (
        <div className="bhg-rec-panel animate-fade-in" role="tabpanel">

          <div className="bhg-rec-uds-stats">
            <div><strong>{labStatus.stats.screensThisYear}</strong><span>Screens this year</span></div>
            <div><strong>{labStatus.stats.complianceLabel}</strong><span>Monitoring status</span></div>
            <div><strong>{labStatus.history.filter(h => h.status === 'Reviewed').length}</strong><span>Reviewed with counselor</span></div>
            <div><strong>{labStatus.stats.lastReviewed}</strong><span>Last reviewed</span></div>
          </div>

          {/* Latest status card */}
          <Card className="bhg-feature-card">
            <div className="bhg-feature-heading">
              <span className="bhg-large-icon"><TestTube2 size={25} /></span>
              <div>
                <PillBadge tone="warning">{labStatus.latest.status}</PillBadge>
                <h2>{labStatus.latest.type}</h2>
                <p>Collected {labStatus.latest.collected} · {labStatus.latest.collectionSite}</p>
              </div>
            </div>
            <div className="bhg-safe-callout">
              <LockKeyhole size={18} />
              <span>{labStatus.latest.detail}</span>
            </div>
            <DetailRow label="Review with" value={labStatus.latest.reviewWith} />
            <DetailRow label="Planned at" value={labStatus.latest.reviewWhen} />
            <button type="button" className="bhg-link-row" onClick={() => navigate('labs')}>
              Open full Lab & UDS page <ArrowRight size={16} />
            </button>
          </Card>

          {/* Screen history */}
          <Card>
            <SectionTitle title="Drug screen history" description="Collection dates and review status — not analyte-level results. Results are always reviewed privately with your counselor." />
            <div className="bhg-rec-uds-list">
              <div className="bhg-rec-uds-head">
                <span>Date</span><span>Type</span><span>Status</span><span>Reviewed by</span>
              </div>
              {labStatus.history.map((item) => (
                <div key={item.id} className="bhg-rec-uds-row">
                  <span><strong>{item.dateShort}</strong><small>{item.date}</small></span>
                  <span>{item.type}</span>
                  <RecordsBadge status={item.status} />
                  <span>{item.reviewedBy ? `${item.reviewedBy} · ${item.reviewedDate}` : 'Pending review'}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="bhg-info-banner">
            <LockKeyhole size={18} />
            <span>Detailed drug screen results are protected under 42 CFR Part 2. They are reviewed with you privately — never posted in the portal.</span>
          </div>
        </div>
      )}

      {/* ══════ TAB: ASSESSMENTS ══════ */}
      {activeTab === 'assessments' && (
        <div className="bhg-rec-panel animate-fade-in" role="tabpanel">

          {/* Intake summary */}
          <Card className="bhg-feature-card">
            <SectionTitle
              title="Admission assessment"
              description={`Completed ${intakeSummary.date} · ${intakeSummary.assessedBy}`}
              action={<PillBadge tone="success">Signed {intakeSummary.patientSignedDate}</PillBadge>}
            />
            <div className="bhg-rec-intake-hero">
              <div className="bhg-rec-intake-field">
                <span>Program recommended</span><strong>{intakeSummary.recommendation}</strong>
              </div>
              <div className="bhg-rec-intake-field">
                <span>ASAM level of care</span><strong>{intakeSummary.asamLevel}</strong>
              </div>
              <div className="bhg-rec-intake-field">
                <span>COWS score at admission</span>
                <strong>{intakeSummary.cowsScore} <small>({intakeSummary.cowsInterpretation})</small></strong>
              </div>
            </div>
            <div className="bhg-rec-intake-summary">
              <strong>Clinical summary</strong>
              <p>{intakeSummary.clinicalSummary}</p>
            </div>

            {/* ASAM 6 dimensions accordion */}
            <div className="bhg-rec-asam-section">
              <div className="bhg-rec-asam-label">
                <Activity size={14} /> Six ASAM dimensions assessed at intake
              </div>
              <div className="bhg-rec-asam-grid">
                {intakeSummary.sixDimensions.map((dim, i) => (
                  <button
                    key={dim.name}
                    type="button"
                    className={`bhg-rec-asam-item ${expandedDimension === i ? 'open' : ''}`}
                    onClick={() => setExpandedDimension(expandedDimension === i ? null : i)}
                  >
                    <div className="bhg-rec-asam-item-head">
                      <span className="bhg-rec-asam-num">{i + 1}</span>
                      <span>{dim.name}</span>
                      {expandedDimension === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                    {expandedDimension === i && (
                      <p className="bhg-rec-asam-detail">{dim.summary}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* BAM assessments */}
          <Card>
            <SectionTitle
              title="Brief Addiction Monitor (BAM)"
              description="Periodic recovery check-ins completed with your counselor. Subscale scores only — individual responses stay in your clinical record."
            />
            <div className="bhg-rec-bam-list">
              {bamAssessments.map((bam) => (
                <div key={bam.id} className="bhg-rec-bam-item">
                  <div className="bhg-rec-bam-header">
                    <div className="bhg-rec-bam-date-tile">
                      <span>{bam.dateShort.split(' ')[0]}</span>
                      <strong>{bam.dateShort.split(' ')[1]}</strong>
                    </div>
                    <div className="bhg-rec-bam-meta">
                      <strong>BAM Assessment · {bam.date}</strong>
                      <span>Completed with {bam.completedWith} · {bam.interval}</span>
                    </div>
                  </div>
                  <div className="bhg-rec-bam-scores">
                    {bam.scores.map((s) => (
                      <div key={s.subscale} className="bhg-rec-bam-score-row">
                        <div className="bhg-rec-bam-score-label">
                          <span>{s.subscale}</span>
                          <small>{s.interpretation}</small>
                        </div>
                        <BamScoreBar score={s.score} maxScore={s.maxScore} lower={s.lower} />
                      </div>
                    ))}
                  </div>
                  <p className="bhg-rec-bam-note"><Sparkles size={12} /> {bam.clinicianNote}</p>
                </div>
              ))}
            </div>
            <div className="bhg-safe-callout" style={{ marginTop: 14 }}>
              <Activity size={18} />
              <span>BAM scores are reviewed with your counselor over time to track recovery progress. Individual question responses stay in your clinical record.</span>
            </div>
          </Card>
        </div>
      )}

      {/* ══════ TAB: CONSENTS ══════ */}
      {activeTab === 'consents' && (
        <div className="bhg-rec-panel animate-fade-in" role="tabpanel">

          <Card>
            <SectionTitle
              title="Consents & program documents"
              description="Documents signed or acknowledged during your enrollment at BHG Knoxville."
            />
            <div className="bhg-rec-consent-list">
              {documents.map((doc) => (
                <div key={doc.id} className={`bhg-rec-consent-row ${doc.status === 'Review due' ? 'needs-review' : ''}`}>
                  <span className="bhg-rec-consent-icon" aria-hidden="true">
                    {doc.status === 'Review due' ? <AlertCircle size={18} /> : <FileCheck2 size={18} />}
                  </span>
                  <div className="bhg-rec-consent-info">
                    <strong>{doc.name}</strong>
                    <span>{doc.category} · {doc.date}</span>
                  </div>
                  <RecordsBadge status={doc.status} />
                  <button
                    type="button"
                    className="bhg-hold-cta"
                    style={{ minWidth: 80 }}
                    onClick={() => {
                      addToast(`Demo: ${doc.name} preview opened.`, 'info');
                    }}
                  >
                    <Download size={13} /> View
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy note */}
          <Card>
            <SectionTitle title="42 CFR Part 2 privacy protection" />
            <div className="bhg-safe-callout">
              <LockKeyhole size={18} />
              <span>
                Your substance-use treatment records are protected by federal law (42 CFR Part 2) and HIPAA.
                This information cannot be shared without your written consent except in limited circumstances.
              </span>
            </div>
            <div className="bhg-rec-privacy-grid">
              <div><ShieldCheck size={16} /><strong>Confidential by law</strong><span>BHG cannot confirm or deny that you are a patient without your consent.</span></div>
              <div><FileCheck2 size={16} /><strong>You control disclosure</strong><span>You may authorize releases to family, courts, or other providers through signed consent forms.</span></div>
              <div><LockKeyhole size={16} /><strong>Substance-use specific</strong><span>These protections go further than general HIPAA for addiction treatment records.</span></div>
            </div>
          </Card>

          {/* Emergency contact */}
          <Card>
            <SectionTitle
              title="Emergency contact on file"
              description="Used for urgent clinical situations only. Update through Profile & Privacy or speak to the front desk."
            />
            <div className="bhg-rec-emergency">
              <div className="bhg-rec-emergency-info">
                <strong>{emergencyContact.name}</strong>
                <span>{emergencyContact.relation} · {emergencyContact.phone}</span>
              </div>
              <button type="button" className="bhg-button bhg-button-secondary" onClick={() => navigate('profile')}>
                <UserRound size={14} /> Update in profile
              </button>
            </div>
          </Card>
        </div>
      )}

      <div className="bhg-privacy-note">
        <LockKeyhole size={17} />
        <span>Treatment records are private. Only you and authorized BHG care team members can access this information.</span>
      </div>
    </div>
  );
}
