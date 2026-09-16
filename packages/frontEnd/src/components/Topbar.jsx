import React, { useEffect, useRef, useState } from 'react';
import { Bell, Building2, Check, ChevronDown, Menu, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pageTitles = {
  dashboard: ['Home', 'Your care at a glance'],
  treatment: ['My Treatment', 'Your current care plan'],
  medication: ['Medication Schedule', 'Clinic visits and take-home days'],
  appointments: ['Appointments', 'Counseling and medical visits'],
  counseling: ['Counseling', 'Support for your recovery goals'],
  labs: ['Lab & UDS', 'Private treatment monitoring'],
  records: ['Treatment Records', 'Medication, counseling, UDS, assessments, and consents'],
  progress: ['Recovery Progress', 'Goals and milestones'],
  'care-team': ['My Care Team', 'People supporting your recovery'],
  help: ['Help & FAQ', 'Common questions about treatment and the portal'],
  messages: ['Secure Messages', 'Counselor, billing, and center updates in one inbox'],
  center: ['Treatment Center', 'Hours, directions and contacts'],
  payments: ['Coverage & Payments', 'Insurance and balance summary'],
  documents: ['Forms & Documents', 'Consents and program information'],
  notifications: ['Notifications', 'Treatment and appointment updates'],
  profile: ['Profile & Privacy', 'Personal information and preferences'],
  'admin-dashboard': ['Clinician Dashboard', 'Caseload, schedule, and follow-up'],
  'admin-patients': ['My Caseload', 'Assigned patients and engagement'],
  'admin-check-ins': ['Medication Visit Status', 'Read-only medical-team coordination'],
  'admin-appointments': ['Appointments & Outcomes', 'Shared scheduling and missed-visit follow-up'],
  'admin-counseling': ['Counseling & Goals', 'Recovery planning and required services'],
  'admin-care-coordination': ['Care Coordination', 'Requests, referrals, and clinical routing'],
  'admin-labs': ['UDS & Labs', 'Collection and review workflow'],
};

export default function Topbar() {
  const {
    currentPage,
    navigate,
    unreadCount,
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
  const centerMenuRef = useRef(null);

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

  const selectTreatmentCenter = (id) => {
    setSelectedTreatmentCenterId(id);
    setCenterMenuOpen(false);
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
        {!isAdmin && <button className="topbar-icon-btn bhg-notification-button" onClick={() => navigate('notifications')} aria-label={`${unreadCount} unread notifications`}>
          <Bell size={19} />
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </button>}
        <button className="topbar-avatar" onClick={() => !isAdmin && navigate('profile')} title={isAdmin ? user?.name : patient.name}>
          {user?.initials || patient.initials}
        </button>
      </div>
    </header>
  );
}
