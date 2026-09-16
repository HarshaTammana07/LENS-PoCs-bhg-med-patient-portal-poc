import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as portalData from '../data/bhgPatientData';
import { createInitialDemoState, DEMO_STATE_KEY, loadDemoState } from '../data/bhgDemoState';

const AppContext = createContext(null);
const SESSION_KEY = 'bhg-portal-session-v3';

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => loadSession()?.user || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [demoState, setDemoState] = useState(loadDemoState);

  const currentPage = location.pathname.split('/').filter(Boolean)[0] || 'dashboard';
  const isLoggedIn = Boolean(user);
  const unreadCount = demoState.notifications.filter((item) => item.unread).length;
  const unreadMessages = demoState.messages.filter((item) => item.unread).length;
  const openWorkItems = demoState.workItems.filter((item) => item.status !== 'Resolved').length;
  const requiredActions = portalData.requiredActions.filter((item) =>
    item.id !== 'action-consent' || demoState.documents.some((document) => document.id === 'DOC-4' && document.status === 'Review due')
  );

  const navigate = useCallback(
    (page, options) => {
      routerNavigate(`/${page}`, options);
      setSidebarOpen(false);
    },
    [routerNavigate]
  );

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const login = useCallback(async (email, password, requestedRole) => {
    const normalized = String(email || '').trim().toLowerCase();
    const accounts = {
      patient: {
        email: 'patient@demo.com',
        user: {
          id: portalData.patient.id,
          email: portalData.patient.email,
          name: portalData.patient.name,
          initials: portalData.patient.initials,
          role: 'patient',
          title: 'Patient',
        },
      },
      admin: {
        email: 'admin@demo.com',
        user: {
          id: 'BHG-KNOX-OPS',
          email: 'admin@demo.com',
          name: 'Morgan Reed',
          initials: 'MR',
          role: 'admin',
          title: 'Clinic Operations Manager',
        },
      },
    };
    const account = accounts[requestedRole];
    if (!account || normalized !== account.email || password !== 'Password123') {
      throw new Error(`Use ${account?.email || 'a demo account'} with password Password123.`);
    }

    const session = { user: account.user };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session.user);
    return session;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    routerNavigate('/login', { replace: true });
  }, [routerNavigate]);

  useEffect(() => {
    localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(demoState));
  }, [demoState]);

  const markNotificationRead = useCallback((id) => {
    setDemoState((state) => ({
      ...state,
      notifications: state.notifications.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    }));
  }, []);

  const markMessageRead = useCallback((id) => {
    setDemoState((state) => ({
      ...state,
      messages: state.messages.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    }));
  }, []);

  const sendMessage = useCallback(({ recipient, subject, body, threadId }) => {
    const now = 'Just now';
    const messageId = threadId || `MSG-${Date.now()}`;
    setDemoState((state) => {
      const existing = state.messages.find((item) => item.id === messageId);
      const reply = { id: `reply-${Date.now()}`, sender: 'You', time: now, text: body };
      const messages = existing
        ? state.messages.map((item) => item.id === messageId
          ? { ...item, preview: body, time: now, unread: false, thread: [...item.thread, reply] }
          : item)
        : [{
          id: messageId,
          from: recipient,
          role: 'BHG Care Team',
          subject,
          preview: body,
          time: now,
          unread: false,
          thread: [reply],
        }, ...state.messages];
      const workItem = {
        id: `REQ-${Date.now()}`,
        type: 'Patient message',
        title: subject,
        detail: body,
        patient: state.patient.name,
        created: now,
        status: 'New',
        response: '',
        messageId,
      };
      return { ...state, messages, workItems: [workItem, ...state.workItems] };
    });
  }, []);

  const addThreadReply = useCallback(({ threadId, sender, text, time = 'Just now' }) => {
    setDemoState((state) => ({
      ...state,
      messages: state.messages.map((item) => item.id === threadId
        ? {
          ...item,
          preview: text,
          time,
          unread: false,
          thread: [...item.thread, { id: `reply-${Date.now()}`, sender, time, text }],
        }
        : item),
    }));
  }, []);

  const createRequest = useCallback(({ type, title, detail, appointmentId, page = 'messages' }) => {
    const requestId = `REQ-${Date.now()}`;
    const messageId = `MSG-${Date.now()}`;
    const now = 'Just now';
    const fromName = type === 'Financial assistance' ? 'Danielle Brooks' : 'BHG Knoxville';
    const fromRole = type === 'Financial assistance' ? 'Patient Financial Counselor' : 'Treatment Center';
    const messageText = detail || title;

    setDemoState((state) => ({
      ...state,
      appointments: appointmentId
        ? state.appointments.map((item) => item.id === appointmentId ? { ...item, requestStatus: 'Request sent' } : item)
        : state.appointments,
      workItems: [{
        id: requestId,
        type,
        title,
        detail: messageText,
        patient: state.patient.name,
        created: now,
        status: 'New',
        response: '',
        appointmentId,
        messageId,
      }, ...state.workItems],
      messages: [{
        id: messageId,
        from: fromName,
        role: fromRole,
        subject: title,
        preview: messageText,
        time: now,
        unread: false,
        thread: [{ id: `reply-${Date.now()}`, sender: 'You', time: now, text: messageText }],
      }, ...state.messages],
      notifications: [{
        id: `N-${Date.now()}`,
        title: `${type} submitted`,
        detail: 'Your BHG care team received your request.',
        time: now,
        unread: true,
        page,
      }, ...state.notifications],
      activity: [{ id: `ACT-${Date.now()}`, title: `${type} submitted`, detail: messageText, time: now }, ...state.activity],
    }));
    return requestId;
  }, []);

  const updatePatient = useCallback((changes) => {
    setDemoState((state) => ({
      ...state,
      patient: { ...state.patient, ...changes },
      activity: [{ id: `ACT-${Date.now()}`, title: 'Profile updated', detail: 'Contact preferences were saved.', time: 'Just now' }, ...state.activity],
    }));
  }, []);

  const acknowledgeDocument = useCallback((id) => {
    setDemoState((state) => {
      const document = state.documents.find((item) => item.id === id);
      return {
        ...state,
        documents: state.documents.map((item) => item.id === id ? { ...item, status: 'Acknowledged', date: 'September 14, 2026' } : item),
        workItems: [{
          id: `REQ-${Date.now()}`,
          type: 'Consent update',
          title: document?.name || 'Document reviewed',
          detail: 'Patient acknowledged the updated communication preferences.',
          patient: state.patient.name,
          created: 'Just now',
          status: 'Resolved',
          response: 'Saved to the patient record.',
        }, ...state.workItems],
      };
    });
  }, []);

  const resolveWorkItem = useCallback((id, response) => {
    setDemoState((state) => {
      const request = state.workItems.find((item) => item.id === id);
      if (!request) return state;
      const now = 'Just now';
      const linkedMessage = request.messageId
        ? state.messages.find((item) => item.id === request.messageId)
        : null;
      const fromName = linkedMessage?.from
        || (request.type === 'Financial assistance' ? 'Danielle Brooks' : 'BHG Knoxville');
      const fromRole = linkedMessage?.role
        || (request.type === 'Financial assistance' ? 'Patient Financial Counselor' : 'Treatment Center');
      const reply = { id: `reply-${Date.now()}`, sender: fromName, time: now, text: response };
      const messages = linkedMessage
        ? state.messages.map((item) => item.id === request.messageId
          ? { ...item, preview: response, time: now, unread: true, thread: [...item.thread, reply] }
          : item)
        : [{
          id: `MSG-${Date.now()}`,
          from: fromName,
          role: fromRole,
          subject: `Update: ${request.title}`,
          preview: response,
          time: now,
          unread: true,
          thread: [reply],
        }, ...state.messages];

      return {
        ...state,
        workItems: state.workItems.map((item) => item.id === id ? { ...item, status: 'Resolved', response } : item),
        appointments: request.appointmentId
          ? state.appointments.map((item) => item.id === request.appointmentId ? { ...item, requestStatus: 'Clinic responded' } : item)
          : state.appointments,
        notifications: [{
          id: `N-${Date.now()}`,
          title: `${request.type} updated`,
          detail: response,
          time: now,
          unread: true,
          page: request.appointmentId ? 'appointments' : 'messages',
        }, ...state.notifications],
        messages,
      };
    });
  }, []);

  const resetDemo = useCallback(() => {
    const initial = createInitialDemoState();
    setDemoState(initial);
    localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(initial));
    addToast('Demo data has been reset.', 'info');
  }, [addToast]);

  useEffect(() => {
    if (isLoggedIn && currentPage === 'login') {
      routerNavigate(user?.role === 'admin' ? '/admin-dashboard' : '/dashboard', { replace: true });
    }
  }, [currentPage, isLoggedIn, routerNavigate, user?.role]);

  const value = useMemo(
    () => ({
      ...portalData,
      ...demoState,
      requiredActions,
      user,
      userRole: user?.role || null,
      isLoggedIn,
      currentPage,
      sidebarOpen,
      setSidebarOpen,
      toasts,
      unreadCount,
      unreadMessages,
      openWorkItems,
      navigate,
      login,
      logout,
      addToast,
      markNotificationRead,
      markMessageRead,
      sendMessage,
      addThreadReply,
      createRequest,
      updatePatient,
      acknowledgeDocument,
      resolveWorkItem,
      resetDemo,
    }),
    [
      user,
      isLoggedIn,
      currentPage,
      sidebarOpen,
      toasts,
      demoState,
      unreadCount,
      unreadMessages,
      openWorkItems,
      requiredActions,
      navigate,
      login,
      logout,
      addToast,
      markNotificationRead,
      markMessageRead,
      sendMessage,
      addThreadReply,
      createRequest,
      updatePatient,
      acknowledgeDocument,
      resolveWorkItem,
      resetDemo,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
