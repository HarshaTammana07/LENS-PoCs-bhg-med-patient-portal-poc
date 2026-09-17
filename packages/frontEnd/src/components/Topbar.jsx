import React, { useEffect, useRef, useState } from 'react';
import { Bell, Building2, Calendar, CalendarDays, Check, ChevronDown, CreditCard, FileText, Filter, FlaskConical, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pageTitles = {
  dashboard: ['Home', 'Your care at a glance'],
  treatment: ['My Treatment', 'Your current care plan'],
  medication: ['Medication Schedule', 'Clinic visits and take-home days'],
  appointments: ['My Care', 'Visits'],
  counseling: ['My Care', 'Visits'],
  labs: ['Lab & UDS', 'Private treatment monitoring'],
  records: ['My Records', 'Medication history, labs, and clinical documents'],
  progress: ['Recovery Progress', 'Goals and milestones'],
  'care-team': ['My Care Team', 'People supporting your recovery'],
  help: ['Help & FAQ', 'Common questions about treatment and the portal'],
  messages: ['Secure Messages', 'Counselor, billing, and center updates in one inbox'],
  center: ['Treatment Center', 'Hours, directions and contacts'],
  payments: ['Coverage & Payments', 'Insurance and balance summary'],
  documents: ['Forms & Documents', 'Consents and program information'],
  profile: ['Profile & Privacy', 'Personal information and preferences'],
  'admin-dashboard': ['Clinician Dashboard', 'Caseload, schedule, and follow-up'],
  'admin-patients': ['My Caseload', 'Assigned patients and engagement'],
  'admin-messages': ['Secure Messages', 'Private patient communication and follow-up'],
  'admin-patient-profile': ['Patient Profile', 'Overview, care plan, sessions, and laboratory review'],
  'admin-check-ins': ['Medication Visit Status', 'Read-only medical-team coordination'],
  'admin-appointments': ['Sessions', 'Documentation, attendance, and completed notes'],
  'admin-session-note': ['Session Note', 'Locked, finalized clinical documentation'],
  'admin-counseling': ['Counseling & Goals', 'Recovery planning and required services'],
  'admin-care-coordination': ['Care Coordination', 'Requests, referrals, and clinical routing'],
  'admin-labs': ['UDS & Labs', 'Collection and review workflow'],
};

const CATEGORY_COLORS = {
  Appointments: { icon: <Calendar size={16} color="#10b981" />, bg: '#ecfdf5', border: '#a7f3d0' },
  Reports:      { icon: <FlaskConical size={16} color="#0d9488" />, bg: '#f0fdfa', border: '#99f6e4' },
  Messages:     { icon: <MessageCircle size={16} color="#0284c7" />, bg: '#f0f9ff', border: '#bae6fd' },
  Billing:      { icon: <CreditCard size={16} color="#10b981" />, bg: '#ecfdf5', border: '#a7f3d0' },
  System:       { icon: <FileText size={16} color="#6366f1" />, bg: '#eef2ff', border: '#c7d2fe' },
};

function getNotifIcon(notification) {
  const byType = {
    calendar: CATEGORY_COLORS.Appointments,
    lab:      CATEGORY_COLORS.Reports,
    message:  CATEGORY_COLORS.Messages,
    billing:  CATEGORY_COLORS.Billing,
    document: CATEGORY_COLORS.System,
    pill:     { icon: <Bell size={16} color="#d97706" />, bg: '#fffbeb', border: '#fde68a' },
  };
  return (
    byType[notification.iconType]
    || CATEGORY_COLORS[notification.category]
    || { icon: <Bell size={16} color="#d97706" />, bg: '#fffbeb', border: '#fde68a' }
  );
}

function NotificationPopover({ notifications, onMarkRead, onMarkAllRead, onNavigate, onClose }) {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Reports', 'Appointments', 'Billing', 'Messages', 'System'];

  const filtered = (notifications || []).filter((n) => {
    if (unreadOnly && !n.unread) return false;
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
    return true;
  });

  const unreadCount = (notifications || []).filter((n) => n.unread).length;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '420px',
        maxWidth: 'calc(100vw - 24px)',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)',
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '520px',
      }}
    >
      {/* Popover Header */}
      <div
        style={{
          padding: '16px 18px 12px',
          borderBottom: '1px solid #f1f5f9',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Notifications</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              title="Filter unread only"
              onClick={() => setUnreadOnly((v) => !v)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '7px',
                border: unreadOnly ? '1px solid #0284c7' : '1px solid #e2e8f0',
                background: unreadOnly ? '#f0f9ff' : '#f8fafc',
                color: unreadOnly ? '#0284c7' : '#475569',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Filter size={12} />
              Unread
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                title="Mark all as read"
                onClick={onMarkAllRead}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '7px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '7px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? '1px solid #0284c7' : '1px solid #e2e8f0',
                  background: isActive ? '#0284c7' : '#ffffff',
                  color: isActive ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Notification List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#94a3b8' }}>
            <Bell size={32} style={{ margin: '0 auto 10px', opacity: 0.3, display: 'block' }} />
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
              {unreadOnly ? 'No unread notifications' : 'No notifications found'}
            </div>
          </div>
        ) : (
          filtered.map((n, idx) => {
            const iconCfg = getNotifIcon(n);
            const isLast = idx === filtered.length - 1;
            return (
              <div
                key={n.id}
                onClick={() => {
                  onMarkRead(n.id);
                  if (n.page) onNavigate(n.page);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '13px 18px',
                  borderBottom: isLast ? 'none' : '1px solid #f8fafc',
                  borderLeft: n.unread ? '3px solid #0284c7' : '3px solid transparent',
                  background: n.unread ? '#f7fbff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = n.unread ? '#ebf4fd' : '#f8fafc'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = n.unread ? '#f7fbff' : '#ffffff'; }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: iconCfg.bg,
                    border: `1px solid ${iconCfg.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {iconCfg.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                      {n.title}
                    </span>
                    {n.unread && (
                      <span
                        style={{
                          padding: '1px 7px',
                          borderRadius: '9999px',
                          fontSize: '10px',
                          fontWeight: 700,
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          letterSpacing: '0.02em',
                          flexShrink: 0,
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {n.detail}
                  </p>
                  <div style={{ marginTop: '5px', fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                    {n.time}
                  </div>
                </div>

                {/* Unread dot */}
                {n.unread && (
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      alignSelf: 'center',
                      flexShrink: 0,
                    }}
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

export default function Topbar() {
  const {
    currentPage,
    navigate,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    addToast,
    setSidebarOpen,
    patient,
    center,
    user,
    userRole,
    clinicianTreatmentCenters,
    selectedTreatmentCenterId,
    setSelectedTreatmentCenterId,
    selectedTreatmentCenter,
  } = useApp();

  const isAdmin = userRole === 'admin';
  const [title, subtitle] = pageTitles[currentPage] || pageTitles.dashboard;
  const [centerMenuOpen, setCenterMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const centerMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close center dropdown on outside click / escape
  useEffect(() => {
    if (!centerMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!centerMenuRef.current?.contains(event.target)) setCenterMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setCenterMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [centerMenuOpen]);

  // Close notification popover on outside click / escape
  useEffect(() => {
    if (!notifOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!notifRef.current?.contains(event.target)) setNotifOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [notifOpen]);

  const selectTreatmentCenter = (id) => {
    setSelectedTreatmentCenterId(id);
    setCenterMenuOpen(false);
  };

  const handleMarkAllRead = () => {
    if (markAllNotificationsRead) {
      markAllNotificationsRead();
    } else if (notifications) {
      notifications.filter((n) => n.unread).forEach((n) => markNotificationRead(n.id));
    }
    if (addToast) addToast('All notifications marked as read.', 'success');
  };

  return (
    <header className="topbar">
      <button className="topbar-icon-btn bhg-mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
        <Menu size={21} />
      </button>
      <div className="topbar-breadcrumb">
        <div className="topbar-title">{title}</div>
        <div className="topbar-subtitle">{subtitle}</div>
      </div>
      <div className="topbar-actions">
        {isAdmin ? (
          <div className="bhg-center-menu" ref={centerMenuRef}>
            <button
              type="button"
              className={`bhg-center-selector${centerMenuOpen ? ' open' : ''}`}
              title="Filter Clinician Portal by treatment center"
              aria-label={`Treatment center: ${selectedTreatmentCenter.name}`}
              aria-haspopup="listbox"
              aria-expanded={centerMenuOpen}
              onClick={() => setCenterMenuOpen((value) => !value)}
            >
              <Building2 size={16} aria-hidden="true" />
              <span>{selectedTreatmentCenter.id === 'all' ? selectedTreatmentCenter.name : selectedTreatmentCenter.shortName}</span>
              <ChevronDown size={15} className="bhg-center-chevron" aria-hidden="true" />
            </button>
            {centerMenuOpen && (
              <div className="bhg-center-popover" role="listbox" aria-label="Assigned treatment centers">
                <div className="bhg-center-popover-label">View patient data for</div>
                {clinicianTreatmentCenters.map((item) => {
                  const selected = item.id === selectedTreatmentCenterId;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`bhg-center-option${selected ? ' selected' : ''}`}
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectTreatmentCenter(item.id)}
                    >
                      <span className="bhg-center-option-icon">{selected && <Check size={14} />}</span>
                      <span><strong>{item.id === 'all' ? item.name : item.shortName}</strong>{item.id !== 'all' && <small>{item.name}</small>}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <a className="bhg-center-call" href={`tel:${center.phone.replace(/\D/g, '')}`}>
            <Phone size={15} />
            <span>Call center</span>
          </a>
        )}

        {/* Notification Bell with Popover */}
        {!isAdmin && (
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              className="topbar-icon-btn bhg-notification-button"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={`${unreadCount} unread notifications`}
              aria-expanded={notifOpen}
              aria-haspopup="dialog"
            >
              <Bell size={19} />
              {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>
            {notifOpen && (
              <NotificationPopover
                notifications={notifications}
                onMarkRead={markNotificationRead}
                onMarkAllRead={handleMarkAllRead}
                onNavigate={navigate}
                onClose={() => setNotifOpen(false)}
              />
            )}
          </div>
        )}

        <button className="topbar-avatar" onClick={() => !isAdmin && navigate('profile')} title={isAdmin ? user?.name : patient.name}>
          {user?.initials || patient.initials}
        </button>
      </div>
    </header>
  );
}
