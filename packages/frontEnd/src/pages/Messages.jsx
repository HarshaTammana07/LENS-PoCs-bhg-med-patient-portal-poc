import React, { useState } from 'react';
import { Send, Phone, MessageSquare, ChevronRight, X, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const quickReplies = [
  'Thank you for the update!',
  'I\'ll review and get back to you.',
  'Can we schedule a callback?',
  'I have a follow-up question.',
];

export default function Messages() {
  const { addToast, userRole, conversations = [] } = useApp();
  const [convos, setConvos] = useState(() => {
    // If doctor, ONLY internal chats
    if (userRole === 'doctor') {
      return [
        { id: '101', with: 'Dr. Mitchell', role: 'Cardiology', avatar: 'DM', lastMessage: 'The patient echo looks normal.', lastTime: '10m ago', unread: 1, messages: [{id:1, sender:'them', text:'Hi, the echo results came back normal.', time:'10m ago'}] },
        { id: '102', with: 'Pharmacy Services', role: 'Internal', avatar: 'PS', lastMessage: 'Refill approved for BHG Behavioral Health South', lastTime: '1h ago', unread: 0, messages: [{id:1, sender:'them', text:'Refill approved for MRN-3928.', time:'1h ago'}] },
        { id: '103', with: 'Billing & Accounts', role: 'Support', avatar: 'BA', lastMessage: 'Claim 4022 needs a diagnosis code.', lastTime: 'Yesterday', unread: 0, messages: [{id:1, sender:'them', text:'Please attach the ICD-10 code for visit 4022.', time:'Yesterday'}] }
      ];
    }
    return conversations;
  });
  const [activeId, setActiveId] = useState(convos[0]?.id);
  const [input, setInput] = useState('');
  const [showNew, setShowNew] = useState(false);

  const openThread = (id) => {
    setActiveId(id);
    setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const active = convos.find((c) => c.id === activeId) || convos[0];

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), sender: 'me', text: text.trim(), time: 'Just now' };
    setConvos(prev => prev.map(c =>
      c.id === activeId ? { ...c, messages: [...c.messages, newMsg], lastMessage: text.trim(), lastTime: 'Just now', unread: 0 } : c
    ));
    setInput('');
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'them',
        text: 'Thank you for your message. A member of our team will follow up shortly.',
        time: 'Just now'
      };
      setConvos(prev => prev.map(c =>
        c.id === activeId ? { ...c, messages: [...c.messages, newMsg, reply] } : c
      ));
    }, 1800);
  };

  const handleCallback = () => {
    addToast('Callback request submitted. Team will contact you within 2 hours.', 'success');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Messages</h1>
          <p className="page-header-subtitle">Your Care Concierge, clinical team, and surgical prep updates in one secure inbox</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowNew(true)}>
          <Plus size={14} /> New Message
        </button>
      </div>

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">New Message</div>
              <button className="modal-close" onClick={() => setShowNew(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="input-group" style={{ marginBottom: 14 }}>
                <label className="input-label">To</label>
                <select className="select-field">
                  <option>Care Concierge: Marie Laurent</option>
                  <option>Nurse Navigator: Lisa Park</option>
                  <option>Billing & Accounts</option>
                  <option>Pre-Op Updates</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 14 }}>
                <label className="input-label">Subject</label>
                <input className="input-field" placeholder="e.g. Question about my prescription" />
              </div>
              <div className="input-group">
                <label className="input-label">Message</label>
                <textarea className="input-field" rows={4} placeholder="Type your message here..." style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowNew(false); addToast('Message sent successfully.', 'success'); }}>
                <Send size={14} /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ display: 'flex', minHeight: 600, padding: 0, overflow: 'hidden' }}>
        {/* Conversation list */}
        <div style={{ width: 280, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '16px 16px 12px', fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.6, borderBottom: '1px solid var(--border)' }}>
            Conversations
          </div>
          {convos.map(c => (
            <div
              key={c.id}
              onClick={() => openThread(c.id)}
              style={{
                padding: '14px 16px', cursor: 'pointer', transition: 'var(--transition)',
                background: c.id === activeId ? 'var(--primary-light)' : 'transparent',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', fontSize: 11 }}>
                  {c.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: c.id === activeId ? 'var(--primary)' : 'var(--text-primary)' }}>{c.with}</div>
                    {c.unread > 0 && <span className="sidebar-badge" style={{ fontSize: 10 }}>{c.unread}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{c.lastTime}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Callback option */}
          <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary btn-sm btn-full" onClick={handleCallback}>
              <Phone size={13} /> Request Callback
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', fontSize: 11 }}>
              {active.avatar}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{active.with}</div>
              <div style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                Active · {active.role}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '20px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {active?.messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                {msg.sender === 'them' && (
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 4, marginLeft: 4 }}>{active.with}</div>
                )}
                <div className={`msg-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>{msg.text}</div>
                <div className={`msg-time ${msg.sender === 'them' ? 'received' : ''}`}>{msg.time}</div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div style={{ padding: '8px 20px 4px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {quickReplies.map(r => (
              <button key={r} className="filter-chip" style={{ fontSize: 12 }} onClick={() => sendMessage(r)}>
                {r}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                className="input-field"
                rows={2}
                placeholder="Type a message..."
                style={{ flex: 1, resize: 'none' }}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              />
              <button
                className="btn btn-primary"
                style={{ height: 44, width: 44, padding: 0, flexShrink: 0 }}
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              Secure messages - typical reply within one business day.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
