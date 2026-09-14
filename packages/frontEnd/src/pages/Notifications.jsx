import React, { useState } from 'react';
import {
  Bell, FileText, Calendar, CreditCard, MessageSquare,
  Settings, CheckCheck, Filter, FlaskConical
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const typeFilters = ['All', 'Reports', 'Appointments', 'Billing', 'Messages', 'System'];
const typeMap = { Reports: 'report', Appointments: 'appointment', Billing: 'billing', Messages: 'message', System: 'system' };

const iconMap = {
  FileText: FileText, Calendar: Calendar, CreditCard: CreditCard,
  MessageSquare: MessageSquare, Settings: Settings, Bell: Bell,
  FlaskConical: FlaskConical,
};
const colorStyle = {
  primary: { bg: 'var(--primary-light)', color: 'var(--primary)' },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  danger:  { bg: 'var(--danger-light)',  color: 'var(--danger)' },
  success: { bg: 'var(--success-light)', color: 'var(--success)' },
  accent:  { bg: 'var(--accent-light)',  color: 'var(--accent)' },
  muted:   { bg: 'var(--bg)',            color: 'var(--text-muted)' },
};

export default function Notifications() {
  const { notifications, markNotifRead, markAllRead, navigate } = useApp();
  const [filter, setFilter] = useState('All');
  const [showUnread, setShowUnread] = useState(false);

  const filtered = notifications.filter(n => {
    const matchType = filter === 'All' || (typeMap[filter] && n.type === typeMap[filter]);
    const matchRead = !showUnread || !n.read;
    return matchType && matchRead;
  });

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Notifications</h1>
          <p className="page-header-subtitle">{unread} unread · {notifications.length} total</p>
        </div>
        <div className="page-header-actions">
          <button
            className={`btn btn-sm ${showUnread ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowUnread(!showUnread)}
          >
            <Filter size={13} /> {showUnread ? 'Show All' : 'Unread Only'}
          </button>
          {unread > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
              <CheckCheck size={13} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="filter-bar">
        {typeFilters.map(f => (
          <button key={f} className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Bell size={28} /></div>
            <div className="empty-state-title">No notifications</div>
            <div className="empty-state-desc">You're all caught up! Check back later for updates.</div>
          </div>
        ) : filtered.map(n => {
          const Icon = iconMap[n.icon] || Bell;
          const cs = colorStyle[n.color] || colorStyle.primary;
          return (
            <div
              key={n.id}
              className={`notif-item${!n.read ? ' unread' : ''}`}
              onClick={() => { markNotifRead(n.id); navigate(n.link); }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: cs.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={cs.color} />
              </div>
              <div className="notif-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="notif-title">{n.title}</div>
                  {!n.read && <span className="badge badge-primary" style={{ fontSize: 10 }}>New</span>}
                </div>
                <div className="notif-desc">{n.description}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              {!n.read && <div className="notif-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
