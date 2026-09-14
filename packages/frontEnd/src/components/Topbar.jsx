import React from 'react';
import { Bell, Menu, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

const pageTitles = {
  dashboard: ['Home', 'Your care at a glance'],
  treatment: ['My Treatment', 'Your current care plan'],
  medication: ['Medication Schedule', 'Clinic visits and take-home days'],
  appointments: ['Appointments', 'Counseling and medical visits'],
  counseling: ['Counseling', 'Support for your recovery goals'],
  labs: ['Lab & UDS', 'Private treatment monitoring'],
  progress: ['Recovery Progress', 'Goals and milestones'],
  'care-team': ['My Care Team', 'People supporting your recovery'],
  help: ['Help & FAQ', 'Common questions about treatment and the portal'],
  messages: ['Secure Messages', 'Connect with your care team'],
  center: ['Treatment Center', 'Hours, directions and contacts'],
  payments: ['Coverage & Payments', 'Insurance and balance summary'],
  documents: ['Forms & Documents', 'Consents and program information'],
  notifications: ['Notifications', 'Treatment and appointment updates'],
  profile: ['Profile & Privacy', 'Personal information and preferences'],
  'admin-dashboard': ['Operations Overview', 'BHG Knoxville Treatment Center'],
  'admin-patients': ['Patients', 'Census and program enrollment'],
  'admin-check-ins': ['Check-in & Dosing', 'Today’s medication-window queue'],
  'admin-appointments': ['Appointments', 'Clinic-managed service calendar'],
  'admin-counseling': ['Counseling', 'Darts services and documentation'],
  'admin-labs': ['UDS & Labs', 'Collection and review workflow'],
  'admin-billing': ['Coverage & Billing', 'Eligibility, authorizations, and balances'],
};

export default function Topbar() {
  const { currentPage, navigate, unreadCount, setSidebarOpen, patient, center, user, userRole } = useApp();
  const isAdmin = userRole === 'admin';
  const [title, subtitle] = pageTitles[currentPage] || pageTitles.dashboard;
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
        <a className="bhg-center-call" href={`tel:${center.phone.replace(/\D/g, '')}`}>
          <Phone size={15} />
          <span>{isAdmin ? center.shortName : 'Call center'}</span>
        </a>
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
