import React, { useState } from 'react';
import { Calendar, Plus, Clock, Users, X, ChevronLeft, ChevronRight, Video, MapPin, Bell, Activity, Monitor, Shield, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EVENT_TYPES = {
  meeting:    { label: 'Executive Standup', color: 'var(--primary)', bg: 'var(--primary-light)', icon: Briefcase },
  review:     { label: 'Clinical Review',   color: 'var(--success)', bg: 'var(--success-light)', icon: Activity },
  audit:      { label: 'HIPAA/Compliance',  color: '#7c3aed',        bg: '#f5f3ff',              icon: Shield },
  training:   { label: 'Staff Education',   color: 'var(--accent)',  bg: 'var(--accent-light)',  icon: Users },
  ops:        { label: 'IT/Systems Prep',   color: 'var(--warning)', bg: 'var(--warning-light)', icon: Monitor },
};

const INITIAL_EVENTS = [
  { id: 1, title: 'Weekly Operational Standup', date: '2026-04-21', time: '09:00 AM', duration: '45m', type: 'meeting', attendees: 'Senior Leadership, Dept Heads', mode: 'Virtual · Executive Boardroom', notes: 'Review weekly KPIs, departmental capacity, and high-priority operational alerts.' },
  { id: 2, title: 'Cardiology Outcomes Review', date: '2026-04-22', time: '02:00 PM', duration: '2h', type: 'review', attendees: 'Dr. Mitchell, Cardiology Staff', mode: 'In-Person · Conference Room C', notes: 'Monthly quality metrics review for Cardiology service line.' },
  { id: 3, title: 'HIPAA Documentation Audit', date: '2026-04-24', time: '10:00 AM', duration: '3h', type: 'audit', attendees: 'Compliance Team, IT Ops', mode: 'Hybrid · Security Suite', notes: 'Quarterly review of access logs and physical data security protocols.' },
  { id: 4, title: 'EMR System Upgrade Training', date: '2026-04-25', time: '01:00 PM', duration: '1h', type: 'ops', attendees: 'Clinical Staff, IT Support', mode: 'Virtual', notes: 'Walkthrough of the upcoming v4.2 interface changes for nursing staff.' },
  { id: 5, title: 'New Nurse Onboarding (April)', date: '2026-04-28', time: '08:30 AM', duration: '4h', type: 'training', attendees: 'HR, 8 New Hires', mode: 'In-Person · Main Hall', notes: 'Orientation, EMR access setup, and facility tour for the April clinical cohort.' },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function AdminCalendar() {
  const { addToast } = useApp();
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents]       = useState(INITIAL_EVENTS);
  const [selected, setSelected]   = useState(null);
  const [viewEvent, setViewEvent] = useState(null);
  const [showNew, setShowNew]     = useState(false);
  const [newEvent, setNewEvent]   = useState({ title: '', date: '', time: '10:00 AM', duration: '1h', type: 'meeting', attendees: '', mode: 'Virtual', notes: '' });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);
  const todayStr    = `${year}-${String(month+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const eventsForDay = (day) => {
    const dStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return events.filter(e => e.date === dStr);
  };

  const saveEvent = () => {
    if (!newEvent.title || !newEvent.date) { addToast('Title and date are required.','warning'); return; }
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    setShowNew(false);
    setNewEvent({ title:'', date:'', time:'10:00 AM', duration:'1h', type:'meeting', attendees:'', mode:'Virtual', notes:'' });
    addToast('Event successfully synchronized with centralized schedule.', 'success');
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setViewEvent(null);
    addToast('Event cancelled.', 'info');
  };

  const upcomingEvents = [...events].sort((a,b) => a.date.localeCompare(b.date)).filter(e => e.date >= todayStr).slice(0, 4);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.6px', display:'flex', alignItems:'center', gap:12 }}>
            <Calendar size={28} color="var(--primary)" /> Operational Scheduler
          </h1>
          <p style={{ fontSize:13.5, color:'var(--text-muted)', marginTop:4 }}>Hospital Governance • Clinical Reviews • Administrative Master Calendar</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}><Plus size={16} /> New Event</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:28 }}>
        {/* CALENDAR GRID */}
        <div className="card" style={{ padding:0, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          {/* Month nav */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--border-light)', background: '#fcfcfd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display:'flex', gap:6 }}>
                <button className="btn btn-ghost btn-sm" style={{ width: 32, height: 32, padding: 0 }} onClick={prevMonth}><ChevronLeft size={16} /></button>
                <button className="btn btn-ghost btn-sm" style={{ width: 32, height: 32, padding: 0 }} onClick={nextMonth}><ChevronRight size={16} /></button>
              </div>
              <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', margin: 0 }}>{MONTHS[month]} {year}</h2>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }} style={{ fontSize: 11, fontWeight: 700 }}>Today</button>
          </div>

          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'var(--bg)', borderBottom:'1px solid var(--border-light)' }}>
            {DAYS.map(d => <div key={d} style={{ padding:'12px 0', textAlign:'center', fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.8 }}>{d}</div>)}
          </div>

          {/* Day cells */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background: 'var(--border-light)' }}>
            {Array.from({ length: firstDay }).map((_,i) => <div key={`empty-${i}`} style={{ minHeight:110, background:'var(--bg)', opacity:0.4 }} />)}
            {Array.from({ length: daysInMonth }).map((_,i) => {
              const day = i + 1;
              const dStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isToday = dStr === todayStr;
              const isSelected = dStr === selected;
              const dayEvents = eventsForDay(day);
              return (
                <div key={day} onClick={() => setSelected(isSelected ? null : dStr)}
                  style={{ minHeight:110, padding:'10px', background: isSelected ? '#f5f7ff' : '#fff', cursor:'pointer', position: 'relative', border: '1px solid transparent', transition: 'all 0.15s ease' }}>
                  <div style={{ width:24, height:24, borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', background: isToday ? 'var(--primary)' : 'transparent', color: isToday ? '#fff' : 'var(--text-primary)', fontSize:12, fontWeight: isToday ? 800 : 600, marginBottom:8 }}>{day}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    {dayEvents.slice(0,3).map(ev => (
                      <div key={ev.id} onClick={e => { e.stopPropagation(); setViewEvent(ev); }}
                        style={{ fontSize:10, fontWeight:700, padding:'3px 6px', borderRadius:5, background: EVENT_TYPES[ev.type]?.bg, color: EVENT_TYPES[ev.type]?.color, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', border: `1px solid ${EVENT_TYPES[ev.type]?.color}15` }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight: 700, paddingLeft: 4 }}>+{dayEvents.length-3} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* Upcoming Card */}
          <div className="card" style={{ padding:0 }}>
            <div style={{ padding:'18px 20px', borderBottom:'1px solid var(--border-light)', fontWeight:800, fontSize:14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Upcoming Cycle</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {upcomingEvents.map(ev => (
                <div key={ev.id} onClick={() => setViewEvent(ev)} style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-light)', cursor:'pointer', transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--bg)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background: EVENT_TYPES[ev.type]?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {React.createElement(EVENT_TYPES[ev.type]?.icon || Bell, { size: 16, color: EVENT_TYPES[ev.type]?.color })}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)', lineHeight:1.3 }}>{ev.title}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4, display:'flex', alignItems:'center', gap:5 }}><Clock size={10} /> {ev.time} · {ev.date}</div>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No scheduled events</div>}
            </div>
          </div>

          {/* Legend Card */}
          <div className="card" style={{ padding:22 }}>
            <h3 style={{ fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:0.5, marginBottom:16, margin: 0 }}>Lifecycle Categories</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop: 12 }}>
              {Object.entries(EVENT_TYPES).map(([k,v]) => (
                <div key={k} style={{ display:'flex', alignItems:'center', justifyContent: 'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:v.color }} />
                    <span style={{ fontSize:12, fontWeight: 600, color:'var(--text-secondary)' }}>{v.label}</span>
                  </div>
                  <span style={{ fontSize:10, background: 'var(--bg)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{events.filter(e => e.type === k).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {viewEvent && (
        <div className="modal-overlay" onClick={() => setViewEvent(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:12, background: EVENT_TYPES[viewEvent.type]?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.createElement(EVENT_TYPES[viewEvent.type]?.icon || Bell, { size: 18, color: EVENT_TYPES[viewEvent.type]?.color })}
                </div>
                <div>
                  <div className="modal-title" style={{ fontSize: 16 }}>{viewEvent.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: EVENT_TYPES[viewEvent.type]?.color, textTransform: 'uppercase' }}>{EVENT_TYPES[viewEvent.type]?.label}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setViewEvent(null)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ padding: 24, display:'flex', flexDirection:'column', gap:20 }}>
              {[
                { icon: Calendar, label: 'Schedule', val: `${viewEvent.date} @ ${viewEvent.time} (${viewEvent.duration})` },
                { icon: MapPin, label: 'Location/Mode', val: viewEvent.mode },
                { icon: Users, label: 'Key Attendees', val: viewEvent.attendees },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={15} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>{item.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ background:'var(--bg)', borderRadius:12, padding:18, border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize:11, fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:8 }}>Operational Disclosure</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{viewEvent.notes}</div>
              </div>
            </div>
            <div className="modal-footer" style={{ padding: '16px 24px', background: '#fcfcfd' }}>
              <button className="btn btn-ghost btn-sm" style={{ color:'var(--danger)', fontWeight: 700 }} onClick={() => deleteEvent(viewEvent.id)}>Delete Segment</button>
              <button className="btn btn-primary btn-sm" onClick={() => setViewEvent(null)}>Close View</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW EVENT MODAL */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Operational Event Entry</div>
              <button className="modal-close" onClick={() => setShowNew(false)}><X size={15} /></button>
            </div>
            <div className="modal-body" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Title / Operational Goal</label>
                <input className="input-field" placeholder="e.g. Q4 Financial Reconciliation" value={newEvent.title} onChange={e => setNewEvent(n => ({ ...n, title: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Event Category</label>
                <select className="input-field" value={newEvent.type} onChange={e => setNewEvent(n => ({ ...n, type: e.target.value }))}>
                  {Object.entries(EVENT_TYPES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Primary Date</label>
                <input className="input-field" type="date" value={newEvent.date} onChange={e => setNewEvent(n => ({ ...n, date: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Start Time (EST)</label>
                <input className="input-field" placeholder="09:00 AM" value={newEvent.time} onChange={e => setNewEvent(n => ({ ...n, time: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Expected Duration</label>
                <input className="input-field" placeholder="1h 30m" value={newEvent.duration} onChange={e => setNewEvent(n => ({ ...n, duration: e.target.value }))} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Mandatory Attendees</label>
                <input className="input-field" placeholder="e.g. Nursing Leads, HR, IT Director" value={newEvent.attendees} onChange={e => setNewEvent(n => ({ ...n, attendees: e.target.value }))} />
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Meeting Notes & Agenda</label>
                <textarea className="input-field" rows={3} placeholder="Add specific operational instructions..." value={newEvent.notes} onChange={e => setNewEvent(n => ({ ...n, notes: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNew(false)}>Discard</button>
              <button className="btn btn-primary btn-sm" onClick={saveEvent}>Sync with Calendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

