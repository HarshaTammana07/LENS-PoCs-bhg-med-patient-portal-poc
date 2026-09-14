import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Clock3,
  ExternalLink,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCenterMapsUrl } from '../data/bhgPatientData';

const starterPrompts = [
  'What do I need to do today?',
  'Show my medication schedule',
  'When is my counseling visit?',
  'What are the center hours?',
  'Help with coverage or payment',
];

function buildReply(text, data) {
  const value = text.toLowerCase();

  if (/\b(suicid|kill myself|hurt myself|overdose|not want to live|crisis|emergency)\b/.test(value)) {
    return {
      tone: 'urgent',
      title: 'Immediate support is available',
      text: 'If you or someone else may be in immediate danger, call 911 now. For confidential crisis support, call or text 988. This assistant cannot monitor emergencies.',
      actions: [
        { label: 'Call 911', href: 'tel:911', icon: Phone },
        { label: 'Call or text 988', href: 'tel:988', icon: Phone },
      ],
    };
  }

  if (/\b(missed|skip|double|change|increase|decrease|withdrawal|sick after).*(dose|medication)|\bmissed dose\b/.test(value)) {
    return {
      tone: 'caution',
      title: 'Please contact your treatment center',
      text: `Do not double a dose or change how you take your medication. Call ${data.center.name} at ${data.center.phone} for instructions from your care team.`,
      actions: [{ label: `Call ${data.center.phone}`, href: `tel:${data.center.phone.replace(/\D/g, '')}`, icon: Phone }],
    };
  }

  if (/\b(today|need to do|next step|due)\b/.test(value)) {
    return {
      title: 'Your plan for today',
      text: `Your observed medication visit is due before 11:30 AM at ${data.center.name}. Your account shows “${data.treatment.visitStatus}.” You also have ${data.requiredActions.length} follow-up items in the portal.`,
      facts: [
        { icon: Clock3, label: 'Medication window', value: data.center.medicationWindow },
        { icon: ShieldCheck, label: 'Visit status', value: data.treatment.visitStatus },
      ],
      page: 'medication',
      actionLabel: 'View today’s schedule',
    };
  }

  if (/\b(medication|methadone|take.?home|dose|dosing|schedule)\b/.test(value)) {
    return {
      title: 'Your medication schedule',
      text: `Your current care plan lists ${data.treatment.medication} ${data.treatment.currentOrder} and ${data.treatment.takeHomeStatus.toLowerCase()}. Today is an observed medication visit before 11:30 AM.`,
      facts: [
        { icon: CalendarDays, label: 'Take-home days', value: 'Tuesday and Wednesday' },
        { icon: Clock3, label: 'Next observed visit', value: 'Thursday, 5:30–11:30 AM' },
      ],
      page: 'medication',
      actionLabel: 'Open medication schedule',
    };
  }

  if (/\b(counsel|appointment|visit|session|group)\b/.test(value)) {
    const appointment = data.appointments[0];
    return {
      title: 'Your next counseling visit',
      text: `${appointment.title} with ${appointment.provider} is confirmed for ${appointment.date} at ${appointment.time}.`,
      facts: [
        { icon: CalendarDays, label: 'Date and time', value: `${appointment.date} · ${appointment.time}` },
        { icon: MapPin, label: 'Location', value: appointment.location },
      ],
      page: 'appointments',
      actionLabel: 'View appointments',
    };
  }

  if (/\b(center|hours|open|close|location|address|direction|phone)\b/.test(value)) {
    return {
      title: data.center.name,
      text: `${data.center.status} today. The medication window is ${data.center.medicationWindow}. ${data.center.directions}`,
      facts: [
        { icon: MapPin, label: 'Address', value: data.center.address },
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

  if (/\b(faq|help center|help page|common question)\b/.test(value)) {
    return {
      title: 'Help & FAQ',
      text: 'Browse answers about medication visits, counseling, UDS privacy, coverage, and emergencies. For urgent medical needs, call 911 or 988.',
      page: 'help',
      actionLabel: 'Open Help & FAQ',
    };
  }

  if (/\b(uds|urine|drug screen|lab|result|test)\b/.test(value)) {
    return {
      title: 'Your latest UDS status',
      text: `A routine screen was collected ${data.labStatus.latest.collected}. Its status is “${data.labStatus.latest.status}.” Your counselor will review the result with you privately; detailed results are not displayed in chat.`,
      facts: [
        { icon: CalendarDays, label: 'Collected', value: data.labStatus.latest.collected },
        { icon: HeartHandshake, label: 'Next step', value: 'Review with your counselor' },
      ],
      page: 'labs',
      actionLabel: 'Open Lab & UDS',
    };
  }

  if (/\b(pay|payment|coverage|insurance|balance|bill|cost|medicaid|tenncare|hardship)\b/.test(value)) {
    return {
      title: 'Coverage and payment summary',
      text: `${data.coverage.payer} coverage is ${data.coverage.status.toLowerCase()}, and your portal balance is $${data.coverage.balance.toFixed(2)} due ${data.coverage.dueDate}. You have ${data.coverage.summary?.claimsYtd || 0} claims this year. If coverage changes or cost is difficult, your patient financial counselor can discuss available assistance.`,
      facts: [
        { icon: ShieldCheck, label: 'Coverage', value: `${data.coverage.status} · verified ${data.coverage.verified}` },
        { icon: HeartHandshake, label: 'Financial counselor', value: data.careTeam[2].name },
      ],
      page: 'payments',
      actionLabel: 'View coverage & payments',
    };
  }

  if (/\b(message|contact|counselor|care team|talk to)\b/.test(value)) {
    return {
      title: 'Contact your care team',
      text: `${data.careTeam[0].name} is your primary counselor. Secure messages are for non-urgent questions and may not be monitored continuously.`,
      facts: [{ icon: MessageCircle, label: 'Primary counselor', value: data.careTeam[0].name }],
      page: 'messages',
      actionLabel: 'Open secure messages',
    };
  }

  if (/\b(form|document|consent|privacy|part 2)\b/.test(value)) {
    const due = data.documents.find((document) => document.status === 'Review due');
    return {
      title: 'Forms and documents',
      text: `${data.documents.length} documents are available. ${due ? `${due.name} is due for review.` : 'No document reviews are currently due.'}`,
      page: 'documents',
      actionLabel: 'View forms & documents',
    };
  }

  return {
    title: 'How I can help',
    text: 'I can help you find your medication schedule, counseling visits, center hours, UDS status, care team, forms, and coverage information. I cannot diagnose symptoms, change medication instructions, or respond to emergencies.',
    suggestions: starterPrompts.slice(0, 4),
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
        title: `Hi ${data.patient.firstName}, I’m the BHG Support Assistant`,
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
              <small><span /> Online · Portal guidance</small>
            </div>
            <span className="bhg-chat-demo"><Sparkles size={11} /> Demo</span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </header>

          <div className="bhg-chat-notice">
            Portal guidance only · Not medical advice · Not monitored for emergencies
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
                          return <div key={fact.label}><Icon size={15} /><span><small>{fact.label}</small><b>{fact.value}</b></span></div>;
                        })}
                      </div>
                    )}
                    {message.reply.actions?.length > 0 && (
                      <div className="bhg-chat-actions">
                        {message.reply.actions.map((action) => {
                          const Icon = action.icon;
                          return <a key={action.label} href={action.href}><Icon size={15} />{action.label}<ExternalLink size={13} /></a>;
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
            {thinking && <div className="bhg-chat-thinking" aria-label="Assistant is typing"><span /><span /><span /></div>}
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
              placeholder="Ask about your schedule, visits, or care…"
              aria-label="Message BHG Support Assistant"
            />
            <button type="submit" disabled={!input.trim() || thinking} aria-label="Send message"><Send size={17} /></button>
          </form>
          <footer>For emergencies, call 911. For crisis support, call or text 988.</footer>
        </section>
      )}
    </>
  );
}
