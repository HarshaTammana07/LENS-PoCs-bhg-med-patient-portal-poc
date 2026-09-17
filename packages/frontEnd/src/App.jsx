import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import {
  Appointments,
  CareTeam,
  Center,
  Dashboard,
  Documents,
  Labs,
  Medication,
  Messages,
  Notifications,
  Payments,
  Profile,
  Progress,
  SupportFaq,
  Treatment,
  TreatmentRecords,
} from './pages/BhgPatientPages';
import {
  AdminAppointments,
  AdminCareCoordination,
  AdminCheckIns,
  AdminCounseling,
  AdminDashboard,
  AdminLabs,
  AdminPatientProfile,
  AdminPatients,
  AdminSessionNote,
} from './pages/BhgAdminPages';

const ROUTER_BASENAME = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

const patientPages = {
  dashboard: <Dashboard />,
  treatment: <Treatment />,
  medication: <Medication />,
  appointments: <Appointments />,
  counseling: <Navigate to="/appointments" replace />,
  labs: <Labs />,
  'care-team': <CareTeam />,
  help: <SupportFaq />,
  messages: <Messages />,
  payments: <Payments />,
  documents: <Documents />,
  progress: <Progress />,
  records: <TreatmentRecords />,
  center: <Center />,
  profile: <Profile />,
  notifications: <Notifications />,
};

const adminPages = {
  'admin-dashboard': <AdminDashboard />,
  'admin-patients': <AdminPatients />,
  'admin-patient-profile': <AdminPatientProfile />,
  'admin-check-ins': <AdminCheckIns />,
  'admin-appointments': <AdminAppointments />,
  'admin-session-note': <AdminSessionNote />,
  'admin-counseling': <AdminCounseling />,
  'admin-labs': <AdminLabs />,
  'admin-care-coordination': <AdminCareCoordination />,
};

function ProtectedPage() {
  const { isLoggedIn, currentPage, userRole } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  const pages = userRole === 'admin' ? adminPages : patientPages;
  const home = userRole === 'admin' ? '/admin-dashboard' : '/dashboard';
  const page = pages[currentPage];
  if (!page) return <Navigate to={home} replace />;
  return <Layout>{page}</Layout>;
}

function LoginRoute() {
  const { isLoggedIn, userRole, login, addToast } = useApp();
  const navigate = useNavigate();
  if (isLoggedIn) return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;

  const handleLogin = async (email, password, role) => {
    await login(email, password, role);
    addToast(role === 'admin' ? 'Welcome to the BHG Clinician Portal.' : 'Welcome back to your BHG portal.');
    navigate(role === 'admin' ? '/admin-dashboard' : '/dashboard', { replace: true });
  };

  return <Login onLogin={handleLogin} />;
}

function AppRoutes() {
  const { isLoggedIn, userRole } = useApp();
  const home = userRole === 'admin' ? '/admin-dashboard' : '/dashboard';
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isLoggedIn ? home : '/login'} replace />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/:page" element={<ProtectedPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
