/** Portal API client. Path-only bases resolve to current origin. */

function resolveApiBase() {
  const configured = (import.meta.env.VITE_PORTAL_API_URL || '/bhg-patientportal/api').trim();
  if (/^https?:\/\//i.test(configured)) return configured.replace(/\/$/, '');
  const path = configured.startsWith('/') ? configured : `/${configured}`;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`.replace(/\/$/, '');
  }
  return path.replace(/\/$/, '');
}

async function request(path, options = {}) {
  const res = await fetch(`${resolveApiBase()}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Portal API ${res.status}`);
  }
  return res.json();
}

export async function portalDemoLogin(email, password) {
  return request('/auth/demo-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchPortalBundle(email) {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return request(`/portal/bundle${q}`);
}

export async function patchPortalAppointment(id, patch, email) {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return request(`/portal/appointments/${encodeURIComponent(id)}${q}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
    headers: email ? { 'X-Portal-Email': email } : {},
  });
}

export async function putPortalBilling(billing) {
  return request('/portal/billing', {
    method: 'PUT',
    body: JSON.stringify(billing),
  });
}

export async function patchPortalChecklistItem(id, patch) {
  return request(`/portal/checklist/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export { resolveApiBase as PORTAL_API_BASE };
