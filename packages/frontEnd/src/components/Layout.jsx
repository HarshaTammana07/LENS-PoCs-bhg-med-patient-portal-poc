import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ChatbotWidget from './ChatbotWidget';

function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  const icons = {
    success: <CheckCircle2 size={17} />,
    danger: <AlertCircle size={17} />,
    info: <Info size={17} />,
  };
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{icons[toast.type] || icons.success}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default function Layout({ children }) {
  const { sidebarOpen, setSidebarOpen, userRole } = useApp();
  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="bhg-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className={`page-content ${userRole === 'admin' ? 'clinician-content' : 'patient-content'}`}>{children}</main>
      </div>
      {userRole === 'patient' && <ChatbotWidget />}
      <ToastContainer />
    </div>
  );
}
