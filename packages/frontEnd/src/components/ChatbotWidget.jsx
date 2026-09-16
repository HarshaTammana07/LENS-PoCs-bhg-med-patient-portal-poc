import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  FileCheck2,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  Pill,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCenterMapsUrl } from '../data/bhgPatientData';

const starterPrompts = [
  'What do I need to do today?',
  'Show my medication schedule',
  'How am I doing in treatment?',
  'When is my counseling visit?',
  'What are the center hours?',
];

function buildReply(text, data) {
  const value = text.toLowerCase();

  // ── Crisis / emergency (always first) ──────────────────────────────────────
  if (/\b(suicid|kill myself|hurt myself|overdose|not want to live|crisis|emergency)\b/.test(value)) {
    return {
      tone: 'urgent',
      title: 'Immediate support is available',
      text: 'If you or someone else may be in immediate danger, call 911 now. For confidential mental health or substance-use crisis support, call or text 988 — free and available 24/7. This assistant cannot monitor emergencies.',
      actions: [
        { label: 'Call 911 — emergencies', href: 'tel:911', icon: Phone },
        { label: 'Call or text 988 — crisis line', href: 'tel:988', icon: Phone },
      ],
    };
  }

  // ── Missed / changed dose (safety) ─────────────────────────────────────────
  if (/\b(missed|skip|double|change|increase|decrease|withdrawal|sick after|feel sick).*(dose|medication)|\bmissed dose\b|\bwithdrawal\b/.test(value)) {
    return {
      tone: 'caution',
      title: 'Contact your treatment center before making any changes',
      text: `Do not skip, double, or adjust your dose without speaking to your care team first. Changes to how you take medication need to be directed by your clinical provider. Call ${data.center.name} directly — they can advise you or connect you with the dosing nurse on duty.`,
      facts: [
        { icon: Phone, label: 'Treatment center', value: data.center.phone },
        { icon: Clock3, label: 'Medication window', value: data.center.medicationWindow },
      ],
      actions: [{ label: `Call ${data.center.phone}`, href: `tel:${data.center.phone.replace(/\D/g, '')}`, icon: Phone }],
    };
  }

  // ── Rich: how am I doing / progress ────────────────────────────────────────
  if (/\b(how am i doing|my progress|doing well|how is my treatment|treatment going|am i on track)\b/.test(value)) {
    const overallPct = Math.round(
      data.progress.currentGoals.reduce((s, g) => s + g.progress, 0) / data.progress.currentGoals.length
    );
    return {
      tone: 'positive',
      title: `You are making real progress, ${data.patient.firstName}`,
      text: `You have been in treatment for ${data.progress.enrolledDays} days and your visit consistency is ${data.progress.attendanceRate}%. Your care team reviewed your plan on ${data.treatment.lastPlanUpdate} and noted: "${data.treatment.lastPlanFocus}". You have completed ${data.progress.completedGoals} goals and are ${overallPct}% toward your current goals overall.`,
      facts: [
        { icon: Activity, label: 'Visit consistency', value: `${data.progress.attendanceRate}% — ${data.labStatus.stats.complianceLabel}` },
        { icon: Target, label: 'Active goal progress', value: `${overallPct}% across ${data.progress.currentGoals.length} goals` },
        { icon: CalendarDays, label: 'Next plan review', value: data.treatment.nextReview },
      ],
      page: 'progress',
      actionLabel: 'View full recovery progress',
    };
  }

  // ── Rich: tell me about my treatment plan ──────────────────────────────────
  if (/\b(tell me about my treatment|what is my (treatment |care )?plan|my treatment plan|what treatment|explain my (treatment|care)|about my program)\b/.test(value)) {
    return {
      title: 'Your current treatment plan',
      text: `You are enrolled in the ${data.treatment.program} at ${data.center.shortName}. You are in the ${data.treatment.phase} phase — your care team is focused on medication stability, consistent counseling, and take-home readiness. Your medication is ${data.treatment.medication} ${data.treatment.currentOrder}, prescribed by ${data.treatment.prescriber}. Your plan was last reviewed on ${data.treatment.lastPlanUpdate}.`,
      facts: [
        { icon: HeartHandshake, label: 'Program', value: `${data.treatment.program} — ${data.treatment.phase} phase` },
        { icon: Pill, label: 'Medication', value: `${data.treatment.medication} ${data.treatment.currentOrder}` },
        { icon: ShieldCheck, label: 'Coverage', value: `${data.treatment.payer} — ${data.treatment.authorization}` },
        { icon: CalendarDays, label: 'Next review', value: data.treatment.nextReview },
      ],
      page: 'treatment',
      actionLabel: 'Open My Treatment',
    };
  }

  // ── Rich: next steps / action items ────────────────────────────────────────
  if (/\b(next steps|what should i do|action items|what do i need to complete|things to do|to.?do|follow.?up)\b/.test(value)) {
    const topItems = data.requiredActions.slice(0, 3);
    return {
      title: 'Your current action items',
      text: `You have ${data.requiredActions.length} items to complete or discuss with your care team. Here are the most time-sensitive ones. Your counselor may review some of these at your next visit on ${data.appointments[0]?.date}.`,
      facts: topItems.map((item) => ({
        icon: Check,
        label: item.title,
        value: `By ${item.due}`,
      })),
      page: 'dashboard',
      actionLabel: 'View all steps on Home',
    };
  }

  // ── Today's plan ────────────────────────────────────────────────────────────
  if (/\b(today|need to do|what.?s due|plan for today)\b/.test(value)) {
    return {
      title: 'Your plan for today',
      text: `Your observed medication visit is due before 11:30 AM at ${data.center.name}. Your account shows "${data.treatment.visitStatus}." You have ${data.requiredActions.length} follow-up items in the portal — the most recent is "${data.requiredActions[0]?.title}."`,
      facts: [
        { icon: Clock3, label: 'Medication window closes', value: (data.center.medicationWindow.split('\u2013')[1] || data.center.medicationWindow).trim() },
        { icon: ShieldCheck, label: 'Visit status', value: data.treatment.visitStatus },
        { icon: CalendarDays, label: 'Next counseling', value: `${data.appointments[0]?.dateShort} \u00b7 ${data.appointments[0]?.time}` },
      ],
      page: 'medication',
      actionLabel: 'View medication schedule',
    };
  }

  // ── Medication / dosing / schedule ──────────────────────────────────────────
  if (/\b(medication|methadone|buprenorphine|suboxone|take.?home|dose|dosing|schedule)\b/.test(value)) {
    return {
      title: 'Your medication schedule',
      text: `Your current order is ${data.treatment.medication} ${data.treatment.currentOrder}, prescribed by ${data.treatment.prescriber}. Your care plan includes ${data.treatment.takeHomeStatus.toLowerCase()}: ${data.treatment.takeHomeDetail} Observed visits happen during the medication window. Always arrive within the window — call the center if you may be late.`,
      facts: [
        { icon: Pill, label: 'Current medication', value: `${data.treatment.medication} \u00b7 ${data.treatment.currentOrder}` },
        { icon: CalendarDays, label: 'Approved take-home days', value: 'Tuesday and Wednesday' },
        { icon: Clock3, label: 'Observed visit window', value: data.center.medicationWindow },
      ],
      page: 'medication',
      actionLabel: 'Open medication schedule',
    };
  }

  // ── Counseling / appointments ───────────────────────────────────────────────
  if (/\b(counsel|appointment|visit|session|group|therapist)\b/.test(value)) {
    const appointment = data.appointments[0];
    return {
      title: 'Your next counseling visit',
      text: `${appointment.title} with ${appointment.provider} is confirmed for ${appointment.date} at ${appointment.time}. Counseling is a required part of your MMT care plan — attending consistently supports both your recovery and your take-home status. If you need to request a change, use the Appointments page.`,
      facts: [
        { icon: CalendarDays, label: 'Date and time', value: `${appointment.date} \u00b7 ${appointment.time}` },
        { icon: MapPin, label: 'Location', value: appointment.location },
        { icon: HeartHandshake, label: 'Your counselor', value: data.careTeam[0].name },
      ],
      page: 'appointments',
      actionLabel: 'View appointments',
    };
  }

  // ── Center hours / directions ───────────────────────────────────────────────
  if (/\b(center|hours|open|close|location|address|direction|phone|where is|how do i get)\b/.test(value)) {
    return {
      title: data.center.name,
      text: `${data.center.status} today. The medication window is ${data.center.medicationWindow} and counseling hours run ${data.center.counselingHours}. ${data.center.directions}`,
      facts: [
        { icon: MapPin, label: 'Address', value: data.center.address },
        { icon: Clock3, label: "Today's hours", value: data.center.todayHours },
        { icon: Phone, label: 'Phone', value: data.center.phone },
      ],
      actions: [
        { label: 'Get directions', href: getCenterMapsUrl(data.center), icon: MapPin },
        { label: `Call ${data.center.phone}`, href: `tel:${data.center.phone.replace(/\D/g, '')}`, icon: Phone },
      ],
      page: 'center',
      actionLabel: 'View center details',
    };
  }

  // ── Help / FAQ ──────────────────────────────────────────────────────────────
  if (/\b(faq|help center|help page|common question|how does|what is otp|what is moud)\b/.test(value)) {
    return {
      title: 'Help & FAQ',
      text: 'Browse answers about medication visits, counseling, UDS privacy, coverage, and what to do in different situations. Topics include how MMT works, take-home eligibility, and who to call.',
      page: 'help',
      actionLabel: 'Open Help & FAQ',
    };
  }

  // ── UDS / labs ──────────────────────────────────────────────────────────────
  if (/\b(uds|urine|drug screen|lab|result|test|screening)\b/.test(value)) {
    return {
      title: 'Your latest UDS status',
      text: `A ${data.labStatus.latest.type.toLowerCase()} was collected ${data.labStatus.latest.collected} and its current status is "${data.labStatus.latest.status}." UDS is a routine part of MMT care — it is reviewed privately with your counselor, not displayed in full here. Your next review is planned at your counseling session on ${data.labStatus.latest.reviewWhen}.`,
      facts: [
        { icon: CalendarDays, label: 'Collected', value: data.labStatus.latest.collected },
        { icon: HeartHandshake, label: 'Review with', value: data.labStatus.latest.reviewWith },
        { icon: Clock3, label: 'Planned review', value: data.labStatus.latest.reviewWhen },
      ],
      page: 'labs',
      actionLabel: 'Open Lab & UDS',
    };
  }

  // ── Coverage / payments ─────────────────────────────────────────────────────
  if (/\b(pay|payment|coverage|insurance|balance|bill|cost|medicaid|tenncare|hardship|financial)\b/.test(value)) {
    return {
      title: 'Coverage and payment summary',
      text: `Your ${data.coverage.payer} coverage is ${data.coverage.status.toLowerCase()} and authorized through ${data.treatment.authorization.replace('Active through ', '')}. Your current portal balance is $${data.coverage.balance.toFixed(2)}, due ${data.coverage.dueDate}. You have ${data.coverage.summary?.claimsYtd || 0} claims processed this year. If you are having difficulty with cost, your patient financial counselor ${data.careTeam[2].name} can discuss assistance options.`,
      facts: [
        { icon: ShieldCheck, label: 'Coverage status', value: `${data.coverage.status} \u00b7 verified ${data.coverage.verified}` },
        { icon: CalendarDays, label: 'Authorization through', value: data.treatment.authorization.replace('Active through ', '') },
        { icon: HeartHandshake, label: 'Financial counselor', value: data.careTeam[2].name },
      ],
      page: 'payments',
      actionLabel: 'View coverage & payments',
    };
  }

  // ── Messages / care team ────────────────────────────────────────────────────
  if (/\b(message|contact|talk to|reach|get in touch|care team|my team)\b/.test(value)) {
    return {
      title: 'Your care team',
      text: `Your primary counselor is ${data.careTeam[0].name}, available ${data.careTeam[0].nextAvailable}. Your medical provider is ${data.careTeam[1].name}. For financial questions, ${data.careTeam[2].name} can help. Secure messages are reviewed during clinic hours — not a replacement for urgent calls.`,
      facts: [
        { icon: MessageCircle, label: 'Primary counselor', value: `${data.careTeam[0].name} \u00b7 ${data.careTeam[0].nextAvailable}` },
        { icon: HeartHandshake, label: 'Medical provider', value: data.careTeam[1].name },
        { icon: Phone, label: 'Urgent questions', value: data.center.phone },
      ],
      page: 'messages',
      actionLabel: 'Open secure messages',
    };
  }

  // ── Forms / documents ───────────────────────────────────────────────────────
  if (/\b(form|document|consent|privacy|part 2|acknowledge)\b/.test(value)) {
    const due = data.documents.find((document) => document.status === 'Review due');
    return {
      title: 'Forms and documents',
      text: `You have ${data.documents.length} documents on file, including consents and privacy notices. ${due ? `"${due.name}" is currently marked for review — please acknowledge it when you have a moment.` : 'All documents are up to date — no action is needed right now.'}`,
      facts: due ? [{ icon: FileCheck2, label: 'Action needed', value: due.name }] : [],
      page: 'documents',
      actionLabel: 'View forms & documents',
    };
  }

  // ── Default fallback ────────────────────────────────────────────────────────
  return {
    title: 'How I can help',
    text: 'I can answer questions about your medication schedule, counseling visits, center hours, UDS status, care team, coverage, and forms. I cannot diagnose symptoms, change medication instructions, or respond to emergencies — call 911 for emergencies and 988 for crisis support.',
    suggestions: starterPrompts.slice(0, 5),
  };
}

export default function ChatbotWidget() {
  const data = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      reply: {
        title: `Hi ${data.patient.firstName}, I'm the BHG Support Assistant`,
        text: 'I can help you quickly find information already available in your patient portal. What can I help with?',
        suggestions: starterPrompts,
      },
    },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, thinking]);

  const send = (message) => {
    const clean = String(message || '').trim();
    if (!clean || thinking) return;
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, sender: 'user', text: clean },
    ]);
    setInput('');
    setThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `assistant-${Date.now()}`, sender: 'assistant', reply: buildReply(clean, data) },
      ]);
      setThinking(false);
    }, 450);
  };

  const openPage = (page) => {
    data.navigate(page);
    setOpen(false);
  };

  return (
    <>
      <button
        className={`bhg-chat-launcher ${open ? 'open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close BHG Support Assistant' : 'Open BHG Support Assistant'}
        aria-expanded={open}
      >
        {open ? <X size={23} /> : <MessageCircle size={24} />}
        {!open && <span>Ask BHG</span>}
      </button>

      {open && (
        <section className="bhg-chat-window" role="dialog" aria-label="BHG Support Assistant">
          <header className="bhg-chat-header">
            <span className="bhg-chat-avatar"><Bot size={20} /></span>
            <div>
              <strong>BHG Support Assistant</strong>
              <small><span /> Online &middot; Portal guidance</small>
            </div>
            <span className="bhg-chat-demo"><Sparkles size={11} /> Demo</span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </header>

          <div className="bhg-chat-notice">
            Portal guidance only &middot; Not medical advice &middot; Not monitored for emergencies
          </div>

          <div className="bhg-chat-messages" ref={scrollRef} aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`bhg-chat-message ${message.sender}`}>
                {message.sender === 'user' ? (
                  <div className="bhg-chat-user-bubble">{message.text}</div>
                ) : (
                  <div className={`bhg-chat-reply ${message.reply.tone || ''}`}>
                    <strong>{message.reply.title}</strong>
                    <p>{message.reply.text}</p>
                    {message.reply.facts?.length > 0 && (
                      <div className="bhg-chat-facts">
                        {message.reply.facts.map((fact) => {
                          const Icon = fact.icon;
                          return (
                            <div key={fact.label}>
                              <Icon size={15} />
                              <span><small>{fact.label}</small><b>{fact.value}</b></span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {message.reply.actions?.length > 0 && (
                      <div className="bhg-chat-actions">
                        {message.reply.actions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <a key={action.label} href={action.href}>
                              <Icon size={15} />{action.label}<ExternalLink size={13} />
                            </a>
                          );
                        })}
                      </div>
                    )}
                    {message.reply.page && (
                      <button className="bhg-chat-page-link" onClick={() => openPage(message.reply.page)}>
                        {message.reply.actionLabel} <ArrowRight size={14} />
                      </button>
                    )}
                    {message.reply.suggestions?.length > 0 && (
                      <div className="bhg-chat-suggestions">
                        {message.reply.suggestions.map((suggestion) => (
                          <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="bhg-chat-thinking" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className="bhg-chat-compose" onSubmit={(event) => { event.preventDefault(); send(input); }}>
            <textarea
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about your schedule, visits, or care\u2026"
              aria-label="Message BHG Support Assistant"
            />
            <button type="submit" disabled={!input.trim() || thinking} aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
          <footer>For emergencies, call 911. For crisis support, call or text 988.</footer>
        </section>
      )}
    </>
  );
}
