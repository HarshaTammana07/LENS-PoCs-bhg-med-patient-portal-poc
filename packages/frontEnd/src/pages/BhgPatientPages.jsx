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

function getSessionNotes(appointment) {
  if (appointment?.sessionNotes) return appointment.sessionNotes;
  if (isCounselingAppointment(appointment) && appointmentTiming(appointment) === 'past') {
    return sharedCounselingSessionNotes;
  }
  return null;
}

function AppointmentCard({ appointment, onDetails, onChange }) {
  return (
    <Card className="bhg-appointment">
      <div className="bhg-date-tile">
        <span>{appointment.dateShort.split(' ')[0]}</span>
        <strong>{appointment.dateShort.split(' ')[1]}</strong>
      </div>
      <div className="bhg-appointment-main">
        <div><PillBadge tone={appointmentStatusTone(appointment.status)}>{appointment.status}</PillBadge></div>
        <h2>{appointment.title}</h2>
        <p>{appointment.provider}</p>
        <div className="bhg-meta-line">
          <span><Clock3 size={15} /> {appointment.time} · {appointment.duration}</span>
          <span><MapPin size={15} /> {appointment.location}</span>
        </div>
        <small>{appointmentTiming(appointment) === 'past' ? (appointment.visitSummary || getSessionNotes(appointment)?.focus || 'Visit completed.') : appointment.preparation}</small>
      </div>
      <div className="bhg-appointment-actions">
        {appointment.requestStatus && <PillBadge tone="warning">{appointment.requestStatus}</PillBadge>}
        <ActionButton secondary onClick={() => onDetails(appointment)}>View details</ActionButton>
        {appointmentTiming(appointment) === 'upcoming' && (
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

function RecoverySnapshot({ progress, treatment, onOpen }) {
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
      <div className="bhg-recovery-stats">
        <div><strong>{progress.enrolledDays}</strong><span>Days in treatment</span></div>
        <div><strong>{progress.attendanceRate}%</strong><span>Visit consistency</span></div>
        <div><strong>{overallProgress}%</strong><span>Goal progress</span></div>
        <div><strong>{progress.completedGoals}</strong><span>Goals completed</span></div>
      </div>
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
    navigate,
  } = useApp();
  const [showHelp, setShowHelp] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const nextStepsPreview = 3;
  const visibleSteps = showAllSteps ? requiredActions : requiredActions.slice(0, nextStepsPreview);
  const hiddenStepCount = Math.max(requiredActions.length - nextStepsPreview, 0);
  const nextAppointment = appointments[0];
  const unreadMessages = messages.filter((message) => message.unread).length;
  const latestRequest = workItems[0];
  const overallGoalProgress = Math.round(
    progress.currentGoals.reduce((sum, goal) => sum + goal.progress, 0) / progress.currentGoals.length
  );

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
              <p>{center.shortName} · Window open until 11:30 AM · {treatment.visitStatusDetail}</p>
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
          <RecoverySnapshot progress={progress} treatment={treatment} onOpen={() => navigate('progress')} />
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
  const { treatment, patient, careTeam, counseling, appointments, progress, center, labStatus, navigate } = useApp();

  const carePillars = [
    {
      title: 'Medication care',
      detail: `${treatment.medication} ${treatment.currentOrder} · ${treatment.takeHomeStatus}. Observed visits at ${center.shortName}.`,
      Icon: Pill,
      page: 'medication',
    },
    {
      title: 'Counseling',
      detail: `${counseling.plan}. Next session ${appointments[0].dateShort} at ${appointments[0].time}.`,
      Icon: MessageCircle,
      page: 'counseling',
    },
    {
      title: 'Health monitoring',
      detail: `${labStatus.latest.type} collected ${labStatus.latest.collected}. Results reviewed privately with your counselor.`,
      Icon: TestTube2,
      page: 'labs',
    },
    {
      title: 'Coverage & support',
      detail: `${treatment.payer} · ${treatment.authorization}. Financial and recovery support available through your care team.`,
      Icon: UsersRound,
      page: 'payments',
    },
  ];

  return (
    <div className="bhg-page bhg-treatment-page animate-fade-in">
      <PageHeader
        eyebrow="My care"
        title="My treatment"
        description={`Your active ${treatment.programShort} plan at ${center.shortName}.`}
        action={<PillBadge tone="success">{treatment.status} treatment</PillBadge>}
      />

      <div className="bhg-treatment-stats">
        <div><strong>{patient.daysInTreatment}</strong><span>Days in treatment</span></div>
        <div><strong>{treatment.phase}</strong><span>Current phase</span></div>
        <div><strong>2 days</strong><span>Approved take-home</span></div>
        <div><strong>{treatment.nextReview}</strong><span>Next plan review</span></div>
      </div>

      <div className="bhg-two-column bhg-two-column-wide">
        <Card className="bhg-feature-card">
          <div className="bhg-feature-heading">
            <span className="bhg-large-icon"><HeartHandshake size={25} /></span>
            <div>
              <PillBadge tone="success">{treatment.status}</PillBadge>
              <h2>{treatment.program}</h2>
              <p>Enrolled {patient.enrolledSince} · Patient ID {patient.id}</p>
            </div>
          </div>
          <div className="bhg-detail-grid bhg-detail-grid-treatment">
            <div><span>Current phase</span><strong>{treatment.phase}</strong></div>
            <div><span>Next care-plan review</span><strong>{treatment.nextReview}</strong></div>
            <div><span>Assigned counselor</span><strong>{careTeam[0].name}</strong></div>
            <div><span>Medical provider</span><strong>{treatment.prescriber}</strong></div>
            <div><span>Last plan update</span><strong>{treatment.lastPlanUpdate}</strong></div>
            <div><span>Coverage authorization</span><strong>{treatment.authorization}</strong></div>
          </div>
          <p className="bhg-treatment-note">{treatment.lastPlanFocus}</p>
        </Card>

        <Card className="bhg-treatment-phase-card">
          <SectionTitle title="What your phase means" description={`${treatment.phase} in an OTP program`} />
          <p className="bhg-body-copy">{treatment.phaseSummary}</p>
          <div className="bhg-treatment-focus">
            {progress.currentGoals.map((goal) => (
              <div key={goal.title}>
                <strong>{goal.title}</strong>
                <span>{goal.note}</span>
                <div className="bhg-progress-track"><span style={{ width: `${goal.progress}%` }} /></div>
              </div>
            ))}
          </div>
          <button type="button" className="bhg-link-row" onClick={() => navigate('progress')}>
            View full recovery progress <ArrowRight size={16} />
          </button>
        </Card>
      </div>

      <div className="bhg-two-column">
        <Card>
          <SectionTitle title="Medication & take-home plan" description="Patient view only — contact the center before any changes." />
          <DetailRow label="Medication" value={`${treatment.medication} ${treatment.currentOrder}`} />
          <DetailRow label="Prescriber" value={treatment.prescriber} />
          <DetailRow label="Order updated" value={treatment.orderUpdated} />
          <DetailRow label="Take-home days" value={treatment.takeHomeDetail} />
          <DetailRow label="Medication window" value={center.medicationWindow} />
          <button type="button" className="bhg-link-row" onClick={() => navigate('medication')}>
            View weekly medication schedule <ArrowRight size={16} />
          </button>
        </Card>

        <Card>
          <SectionTitle title="Counseling & required services" description="Clinic-managed appointments — not self-scheduled in the portal." />
          <DetailRow label="Counseling plan" value={counseling.plan} />
          <DetailRow label="Last session" value={`${counseling.lastSession.date} · ${counseling.lastSession.focus}`} />
          <DetailRow label="Next counseling visit" value={`${appointments[0].date} at ${appointments[0].time}`} />
          <DetailRow label="Next group session" value={`${appointments[1].date} · ${appointments[1].modality}`} />
          <button type="button" className="bhg-link-row" onClick={() => navigate('counseling')}>
            Open counseling details <ArrowRight size={16} />
          </button>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Upcoming treatment visits" description="Counseling, group, and provider reviews on your BHG calendar." />
        <div className="bhg-treatment-visits">
          {appointments.map((appointment) => (
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
      </Card>

      <Card>
        <SectionTitle title="Your OTP care at a glance" description="How your current BHG plan supports recovery day to day." />
        <div className="bhg-care-grid">
          {carePillars.map(({ title, detail, Icon, page }) => (
            <button type="button" className="bhg-care-item bhg-care-item-link" key={title} onClick={() => navigate(page)}>
              <Icon size={20} />
              <h3>{title}</h3>
              <p>{detail}</p>
              <span>Open <ChevronRight size={14} /></span>
            </button>
          ))}
        </div>
      </Card>

      <div className="bhg-safe-callout bhg-treatment-safety">
        <AlertCircle size={18} />
        <span>{treatment.safetyNote}</span>
      </div>
    </div>
  );
}

export function Medication() {
  const { treatment, weeklySchedule, center, navigate } = useApp();
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
          <SectionTitle title="Current medication plan" />
          <div className="bhg-medication-name">
            <span className="bhg-large-icon"><Pill size={25} /></span>
            <div><h2>{treatment.medication}</h2><p>Current order: {treatment.currentOrder}</p></div>
          </div>
          <DetailRow label="Prescriber" value={treatment.prescriber} />
          <DetailRow label="Order updated" value={treatment.orderUpdated} />
          <DetailRow label="Next review" value={treatment.nextReview} />
        </Card>
        <Card>
          <SectionTitle title="Take-home plan" />
          <h3 className="bhg-callout-title">{treatment.takeHomeStatus}</h3>
          <p className="bhg-body-copy">{treatment.takeHomeDetail}</p>
          <div className="bhg-safe-callout"><ShieldCheck size={18} /><span>{treatment.safetyNote}</span></div>
        </Card>
      </div>
      <Card>
        <SectionTitle title="This week" description={`${center.name} · ${center.medicationWindow}`} />
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
    </div>
  );
}

export function Appointments() {
  const { appointments, createRequest, addToast, navigate } = useApp();
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('details');
  const [reason, setReason] = useState('I need a different date or time');
  const [note, setNote] = useState('');
  const [aiSummary, setAiSummary] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const upcoming = appointments.filter((item) => appointmentTiming(item) === 'upcoming');
  const past = appointments.filter((item) => appointmentTiming(item) === 'past');
  const sessionNotes = selected ? getSessionNotes(selected) : null;

  const closeDrawer = () => {
    setSelected(null);
    setMode('details');
    setAiSummary(null);
    setGeneratingAi(false);
    setReason('I need a different date or time');
    setNote('');
  };

  const openAppointment = (appointment, nextMode) => {
    setSelected(appointment);
    setMode(nextMode);
    setReason('I need a different date or time');
    setNote('');
    setAiSummary(null);
    setGeneratingAi(false);
  };

  const submitChange = () => {
    createRequest({
      type: 'Appointment change',
      title: selected.title,
      detail: `${reason}${note ? ` — ${note}` : ''}`,
      appointmentId: selected.id,
      page: 'appointments',
    });
    addToast('Your appointment request was sent to the scheduling team.');
    closeDrawer();
  };

  const runAiSummary = () => {
    if (generatingAi || aiSummary || !selected?.aiDemo) return;
    setGeneratingAi(true);
    window.setTimeout(() => {
      setAiSummary(generateCounselingSessionSummary(selected));
      setGeneratingAi(false);
      addToast('AI session summary generated.', 'info');
    }, 1200);
  };

  const openFollowUp = (item) => {
    closeDrawer();
    navigate(item.page);
    addToast(item.detail, 'info');
  };

  const drawerTitle = mode === 'change' ? 'Request an appointment change' : selected?.title;
  const drawerSubtitle = selected ? `${selected.date} at ${selected.time} · ${selected.provider}` : '';

  return (
    <div className={`bhg-page bhg-appointments-page animate-fade-in ${selected ? 'drawer-open' : ''}`}>
      <PageHeader
        eyebrow="My care"
        title="Appointments"
        description="Upcoming clinic-managed visits and your previous counseling and provider appointments."
      />

      <section className="bhg-appointment-section">
        <SectionTitle title="Upcoming schedule" description="These visits are arranged by BHG staff — not self-booked in the portal." />
        <div className="bhg-stack">
          {upcoming.length ? upcoming.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onDetails={(item) => openAppointment(item, 'details')}
              onChange={(item) => openAppointment(item, 'change')}
            />
          )) : (
            <Card className="bhg-card-compact"><p className="bhg-body-copy">No upcoming appointments are scheduled right now.</p></Card>
          )}
        </div>
      </section>

      <section className="bhg-appointment-section">
        <SectionTitle title="Previous appointments" description="Completed visits with patient-facing summaries where available." />
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
                {appointmentTiming(selected) === 'upcoming' && (
                  <button type="button" className="bhg-button" onClick={() => setMode('change')}>Request a change</button>
                )}
                {selected.aiDemo && sessionNotes && (
                  <button type="button" className="bhg-button" disabled={generatingAi || Boolean(aiSummary)} onClick={runAiSummary}>
                    <Sparkles size={15} /> {generatingAi ? 'Summarizing…' : aiSummary ? 'Summary ready' : 'Summarize with AI'}
                  </button>
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
              <div className="bhg-workflow-summary">
                <DetailRow label="Status" value={selected.status} />
                <DetailRow label="Provider" value={selected.provider} />
                <DetailRow label="Location" value={selected.location} />
                <DetailRow label="Visit type" value={selected.modality} />
                <DetailRow label="Duration" value={selected.duration} />
                {appointmentTiming(selected) === 'upcoming' ? (
                  <div className="bhg-safe-callout"><CalendarDays size={18} /><span>{selected.preparation}</span></div>
                ) : selected.visitSummary ? (
                  <div className="bhg-safe-callout"><CheckCircle2 size={18} /><span>{selected.visitSummary}</span></div>
                ) : sessionNotes ? (
                  <div className="bhg-safe-callout"><MessageCircle size={18} /><span>{sessionNotes.patientSummary}</span></div>
                ) : null}
                {appointmentTiming(selected) === 'upcoming' && selected.modality === 'Telehealth' && (
                  <button type="button" className="bhg-button bhg-button-secondary" onClick={() => addToast('Telehealth device check completed.', 'success')}>
                    <Video size={16} /> Test device
                  </button>
                )}
              </div>

              {sessionNotes && (
                <div className="bhg-session-notes bhg-session-notes-panel">
                  <h3>Counseling session notes</h3>
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
                </div>
              )}

              {aiSummary && (
                <div className="bhg-ai-summary">
                  <strong><Sparkles size={15} /> AI summary · {aiSummary.confidence}% confidence</strong>
                  <p>{aiSummary.text}</p>
                  <small>{aiSummary.disclaimer}</small>
                  {aiSummary.followUps?.length > 0 && (
                    <div className="bhg-follow-up-list">
                      <strong>Suggested follow-up</strong>
                      {aiSummary.followUps.map((item) => (
                        <button key={item.id} type="button" className="bhg-follow-up-item" onClick={() => openFollowUp(item)}>
                          <span>{item.label}</span>
                          <small>{item.detail}</small>
                          <ArrowRight size={14} />
                        </button>
                      ))}
                    </div>
                  )}
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
                  <option>I cannot attend this appointment</option>
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

export function Counseling() {
  const { counseling, navigate } = useApp();
  return (
    <div className="bhg-page animate-fade-in">
      <PageHeader eyebrow="My care" title="Counseling" description="Stay connected with your counselor and recovery goals." />
      <div className="bhg-two-column">
        <Card className="bhg-feature-card">
          <PillBadge tone="primary">Next session</PillBadge>
          <h2 className="bhg-spaced-heading">{counseling.nextSession.title}</h2>
          <div className="bhg-meta-stack">
            <span><CalendarDays size={16} /> {counseling.nextSession.date} at {counseling.nextSession.time}</span>
            <span><UserRound size={16} /> {counseling.counselor.name}</span>
            <span><MapPin size={16} /> {counseling.nextSession.location}</span>
          </div>
          <ActionButton onClick={() => navigate('appointments')}>View appointment</ActionButton>
        </Card>
        <Card>
          <SectionTitle title="Counseling plan" />
          <p className="bhg-body-copy">{counseling.plan}</p>
          <DetailRow label="Last session" value={counseling.lastSession.date} />
          <DetailRow label="Session focus" value={counseling.lastSession.focus} />
        </Card>
      </div>
      <Card>
        <SectionTitle title="For your next conversation" description="Your counselor may review these topics with you." />
        <div className="bhg-topic-list">
          {counseling.upcomingTopics.map((topic) => <div key={topic}><CheckCircle2 size={17} /><span>{topic}</span></div>)}
        </div>
      </Card>
    </div>
  );
}

function labStatusTone(status) {
  if (status === 'Reviewed') return 'success';
  if (status === 'Ready to review') return 'warning';
  return 'neutral';
}

function workflowStepTone(status) {
  if (status === 'done') return 'success';
  if (status === 'current') return 'primary';
  return 'neutral';
}

export function Labs() {
  const { labStatus, navigate, addToast } = useApp();
  const [aiSummary, setAiSummary] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  const runAiSummary = () => {
    if (generatingAi || aiSummary) return;
    setGeneratingAi(true);
    window.setTimeout(() => {
      setAiSummary(generateUdsMonitoringSummary(labStatus));
      setGeneratingAi(false);
      addToast('AI monitoring summary generated.', 'info');
    }, 1100);
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

      <div className="bhg-two-column bhg-two-column-wide">
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

        <Card className="bhg-lab-workflow-card">
          <SectionTitle title="Where your screen is now" description="Status only — detailed results stay private until review." />
          <div className="bhg-lab-workflow">
            {labStatus.workflow.map((item, index) => (
              <div key={item.step} className={`bhg-lab-workflow-step ${item.status}`}>
                <div className="bhg-lab-workflow-marker">
                  {item.status === 'done' ? <CheckCircle2 size={16} /> : <span>{index + 1}</span>}
                </div>
                <div>
                  <div className="bhg-lab-workflow-head">
                    <strong>{item.step}</strong>
                    <PillBadge tone={workflowStepTone(item.status)}>
                      {item.status === 'done' ? 'Complete' : item.status === 'current' ? 'Current' : 'Upcoming'}
                    </PillBadge>
                  </div>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="bhg-two-column">
        <Card>
          <SectionTitle title="What to expect" description="How routine UDS fits into OTP treatment." />
          <div className="bhg-topic-list bhg-lab-expect-list">
            {labStatus.whatToExpect.map((item) => (
              <div key={item}><CheckCircle2 size={17} /><span>{item}</span></div>
            ))}
          </div>
          <button type="button" className="bhg-link-row" onClick={() => navigate('messages')}>
            Message your counselor with a question <ArrowRight size={16} />
          </button>
        </Card>

        <Card>
          <SectionTitle title="Your privacy" description="Why results are not displayed here." />
          <div className="bhg-safe-callout"><LockKeyhole size={18} /><span>{labStatus.privacy}</span></div>
          <ul className="bhg-lab-privacy-list">
            {labStatus.privacyPoints.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Card>
      </div>

      <Card className="bhg-lab-history-card">
        <SectionTitle title="Screening history" description="Collection dates and review status — not detailed lab values." />
        <div className="bhg-lab-history">
          {labStatus.history.map((item) => (
            <div key={item.id} className="bhg-lab-history-row">
              <div className="bhg-date-tile compact">
                <span>{item.dateShort.split(' ')[0]}</span>
                <strong>{item.dateShort.split(' ')[1]}</strong>
              </div>
              <div>
                <strong>{item.type}</strong>
                <span>{item.collection} · {item.date}</span>
                <small>{item.reviewedBy ? `Reviewed with ${item.reviewedBy} on ${item.reviewedDate}` : 'Awaiting private review with counselor'}</small>
              </div>
              <PillBadge tone={labStatusTone(item.status)}>{item.status}</PillBadge>
            </div>
          ))}
        </div>
      </Card>
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

export function Messages() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const deepLinkHandled = useRef(false);
  const { messages, markMessageRead, sendMessage, addToast } = useApp();
  const [selectedId, setSelectedId] = useState(null);
  const [compose, setCompose] = useState(false);
  const [recipient, setRecipient] = useState('Alicia Monroe · Primary Counselor');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const selected = messages.find((message) => message.id === selectedId) || null;

  const closeModal = () => {
    setCompose(false);
    setSelectedId(null);
    setBody('');
    setSubject('');
    if (location.state?.messageId) {
      routerNavigate('/messages', { replace: true, state: {} });
    }
  };

  const openThread = (message) => {
    markMessageRead(message.id);
    setSelectedId(message.id);
    setCompose(false);
    setBody('');
  };

  useEffect(() => {
    if (deepLinkHandled.current) return;
    const messageId = location.state?.messageId;
    if (!messageId) return;
    const message = messages.find((item) => item.id === messageId);
    if (!message) return;
    deepLinkHandled.current = true;
    markMessageRead(message.id);
    setSelectedId(message.id);
    setCompose(false);
    setBody('');
    routerNavigate('/messages', { replace: true, state: {} });
  }, [location.state?.messageId, messages, markMessageRead, routerNavigate]);

  const submit = (threadId) => {
    if (!body.trim() || (!threadId && !subject.trim())) return;
    sendMessage({
      recipient: threadId ? selected.from : recipient.split(' · ')[0],
      subject: threadId ? selected.subject : subject,
      body: body.trim(),
      threadId,
    });
    addToast('Your secure message was sent.');
    closeModal();
  };
  return (
    <div className="bhg-page animate-fade-in">
      <PageHeader
        eyebrow="Support"
        title="Secure messages"
        description="Non-urgent communication with your BHG care team."
        action={<ActionButton onClick={() => setCompose(true)}><MessageCircle size={16} /> New message</ActionButton>}
      />
      <Card className="bhg-message-list">
        {messages.map((message) => (
          <button key={message.id} className={`bhg-message-row ${message.unread ? 'unread' : ''}`} onClick={() => openThread(message)}>
            <div className="bhg-person-avatar small">{message.from.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
            <div className="bhg-message-body">
              <div><strong>{message.from}</strong><span>{message.time}</span></div>
              <small>{message.role}</small>
              <h3>{message.subject}</h3>
              <p>{message.preview}</p>
            </div>
            {message.unread && <span className="bhg-unread-dot" aria-label="Unread message" />}
          </button>
        ))}
      </Card>
      <div className="bhg-privacy-note"><AlertCircle size={17} /><span>Messages are not monitored continuously. Call 911 or 988 for immediate help.</span></div>
      {(compose || selected) && (
        <WorkflowModal
          title={compose ? 'New secure message' : selected.subject}
          subtitle={compose ? 'Non-urgent message to your BHG care team' : `${selected.from} · ${selected.role}`}
          onClose={closeModal}
          size="lg"
          footer={<><button type="button" className="bhg-button bhg-button-secondary" onClick={closeModal}>Cancel</button><button type="button" className="bhg-button" disabled={!body.trim() || (compose && !subject.trim())} onClick={() => submit(selected?.id)}><Send size={15} /> Send securely</button></>}
        >
          <DemoBanner />
          {selected && (
            <div className="bhg-message-thread">
              {selected.thread.map((entry) => (
                <div key={entry.id} className={entry.sender === 'You' ? 'mine' : ''}>
                  <strong>{entry.sender}<span>{entry.time}</span></strong>
                  <p>{entry.text}</p>
                </div>
              ))}
            </div>
          )}
          {compose && (
            <>
              <Field label="To">
                <select value={recipient} onChange={(event) => setRecipient(event.target.value)}>
                  <option>Alicia Monroe · Primary Counselor</option>
                  <option>Danielle Brooks · Patient Financial Counselor</option>
                  <option>BHG Knoxville · Treatment Center</option>
                </select>
              </Field>
              <Field label="Subject"><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="How can your care team help?" /></Field>
            </>
          )}
          <Field label={selected ? 'Reply' : 'Message'} hint="Messages are generally reviewed during clinic hours.">
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

export function Progress() {
  const { progress, treatment, navigate } = useApp();
  const overallProgress = Math.round(
    progress.currentGoals.reduce((sum, goal) => sum + goal.progress, 0) / progress.currentGoals.length
  );

  return (
    <div className="bhg-page bhg-progress-page animate-fade-in">
      <PageHeader
        eyebrow="My recovery"
        title="Recovery progress"
        description="A private view of the goals you set with your care team."
        action={<PillBadge tone="primary">{treatment.phase} phase</PillBadge>}
      />

      <div className="bhg-treatment-stats bhg-progress-stats">
        <div><strong>{progress.enrolledDays}</strong><span>Days in treatment</span></div>
        <div><strong>{progress.attendanceRate}%</strong><span>Visit consistency</span></div>
        <div><strong>{overallProgress}%</strong><span>Overall goal progress</span></div>
        <div><strong>{progress.counselingSessions}</strong><span>Counseling sessions</span></div>
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

      <div className="bhg-two-column">
        <Card>
          <SectionTitle title="Current goals" description="Set and reviewed with your counselor — not self-assigned in the portal." />
          <div className="bhg-goal-list bhg-goal-list-expanded">
            {progress.currentGoals.map((goal) => (
              <div key={goal.title} className="bhg-goal-item">
                <div className="bhg-goal-item-head">
                  <div>
                    <PillBadge tone="neutral">{goal.focus}</PillBadge>
                    <strong>{goal.title}</strong>
                    <span>{goal.note}</span>
                  </div>
                  <b>{goal.progress}%</b>
                </div>
                <div className="bhg-progress-track"><span style={{ width: `${goal.progress}%` }} /></div>
              </div>
            ))}
          </div>
          <button type="button" className="bhg-link-row" onClick={() => navigate('counseling')}>
            Prepare for your next counseling visit <ArrowRight size={16} />
          </button>
        </Card>

        <Card>
          <SectionTitle title="Recent milestones" description="Key moments in your treatment journey." />
          <div className="bhg-timeline">
            {progress.milestones.map((milestone) => (
              <div key={milestone.date}>
                <span />
                <div><small>{milestone.date}</small><strong>{milestone.title}</strong><p>{milestone.detail}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

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
