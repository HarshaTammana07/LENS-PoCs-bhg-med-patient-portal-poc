/** Demo auth session — persisted so refresh keeps the user logged in. */
const STORAGE_KEY = 'bhg-patient-portal-auth';

export const DEMO_ACCOUNTS = {
  'admin@demo.com': { role: 'admin', name: 'Justin Coran' },
  'doctor@demo.com': { role: 'doctor', name: 'Dr. Marcus Webb' },
  'patient@demo.com': { role: 'patient', name: 'Sarah Jenkins', mrn: '0630262C' },
};

export const DEMO_PASSWORD = 'Password123';

export function defaultPageForRole(role) {
  if (role === 'admin') return 'admin-dashboard';
  if (role === 'doctor') return 'doctor-dashboard';
  return 'dashboard';
}

export function loadAuthSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.user?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAuthSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function buildDemoSession(email) {
  const acct = DEMO_ACCOUNTS[email];
  if (!acct) return null;
  return {
    user: {
      id: `demo-${email.split('@')[0]}`,
      email,
      name: acct.name,
      ...(acct.mrn ? { mrn: acct.mrn } : {}),
    },
    role: acct.role,
    currentPage: defaultPageForRole(acct.role),
  };
}
