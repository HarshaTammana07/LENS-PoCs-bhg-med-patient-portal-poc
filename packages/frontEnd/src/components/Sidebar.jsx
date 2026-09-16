import React from 'react';
import {
  Bell,
  Building2,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  HeartHandshake,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Pill,
  Target,
  TestTube2,
  UserRoundCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BhgLogo } from './brand/BhgLogo';

const careNav = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'treatment', label: 'My Treatment', icon: HeartHandshake },
  { id: 'medication', label: 'Medication Schedule', icon: Pill },
  { id: 'appointments', label: 'Visits', icon: CalendarDays },
  { id: 'labs', label: 'Lab & UDS', icon: TestTube2 },
  { id: 'records', label: 'Treatment Records', icon: FileText },
  { id: 'progress', label: 'Recovery Progress', icon: Target },
];

const supportNav = [
  { id: 'care-team', label: 'My Care Team', icon: UsersRound },
  { id: 'messages', label: 'Secure Messages', icon: MessageCircle, badge: 'messages' },
  { id: 'help', label: 'Help & FAQ', icon: HelpCircle },
  { id: 'center', label: 'Treatment Center', icon: Building2 },
];

const accountNav = [
  { id: 'payments', label: 'Coverage & Payments', icon: CreditCard },
  { id: 'documents', label: 'Forms & Documents', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 'notifications' },
  { id: 'profile', label: 'Profile & Privacy', icon: UserRound },
];

const adminNav = [
  { id: 'admin-dashboard', label: 'Clinician Dashboard', icon: LayoutDashboard, badge: 'work' },
  { id: 'admin-patients', label: 'My Caseload', icon: UsersRound },
  { id: 'admin-appointments', label: 'Appointments & Outcomes', icon: CalendarDays },
  { id: 'admin-counseling', label: 'Counseling & Goals', icon: ClipboardCheck },
  { id: 'admin-care-coordination', label: 'Care Coordination', icon: HeartHandshake },
  { id: 'admin-check-ins', label: 'Medication Visit Status', icon: UserRoundCheck },
  { id: 'admin-labs', label: 'UDS & Labs', icon: TestTube2 },
];

export default function Sidebar() {
  const {
    currentPage,
    navigate,
    logout,
    sidebarOpen,
    user,
    patient,
    unreadCount,
    unreadMessages,
    workItems,
    selectedTreatmentCenterId,
    userRole,
  } = useApp();
  const isAdmin = userRole === 'admin';
  const selectedOpenWorkItems = workItems.filter((item) => item.status !== 'Resolved' && (
    selectedTreatmentCenterId === 'all' || (item.centerId || 'knoxville-bernard') === selectedTreatmentCenterId
  )).length;

  const renderItems = (items) =>
    items.map(({ id, label, icon: Icon, badge }) => {
      const count = badge === 'messages' ? unreadMessages : badge === 'notifications' ? unreadCount : badge === 'work' ? selectedOpenWorkItems : 0;
      return (
        <button
          type="button"
          key={id}
          className={`sidebar-item ${currentPage === id ? 'active' : ''}`}
          onClick={() => navigate(id)}
          aria-current={currentPage === id ? 'page' : undefined}
        >
          <Icon className="sidebar-item-icon" />
          <span>{label}</span>
          {count > 0 && <span className="sidebar-badge">{count}</span>}
        </button>
      );
    });

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <BhgLogo size="sidebar" alt="Behavioral Health Group" />
      </div>
      <div className="bhg-portal-label">{isAdmin ? 'Clinician Portal' : 'Patient Portal'}</div>
      <nav className="sidebar-nav" aria-label={isAdmin ? 'Clinician portal' : 'Patient portal'}>
        {isAdmin ? (
          <>
            <div className="sidebar-section-label">My clinical work</div>
            {renderItems(adminNav)}
          </>
        ) : (
          <>
            <div className="sidebar-section-label">My care</div>
            {renderItems(careNav)}
            <div className="sidebar-section-label">Support</div>
            {renderItems(supportNav)}
            <div className="sidebar-section-label">Account</div>
            {renderItems(accountNav)}
          </>
        )}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-user" onClick={() => !isAdmin && navigate('profile')}>
          <span className="sidebar-user-avatar">{user?.initials || patient.initials}</span>
          <span className="sidebar-user-info">
            <strong className="sidebar-user-name">{user?.name || patient.name}</strong>
            <small className="sidebar-user-id">{isAdmin ? 'Clinician' : patient.id}</small>
          </span>
        </button>
        <button className="bhg-sign-out" onClick={logout}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
