/**
 * Reusable API client. Uses token from localStorage. Auto-logout on 401.
 */
import { API_URL, buildAuthHeader } from './authHeader';

export function getToken() {
  return localStorage.getItem('gt_token');
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = buildAuthHeader(token);

  const r = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (r.status === 401) {
    localStorage.removeItem('gt_token');
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  if (!r.ok) {
    let err;
    try { err = await r.json(); } catch { err = { message: r.statusText }; }
    throw new Error(err.message || `HTTP ${r.status}`);
  }
  if (r.status === 204) return null;
  return r.json();
}

export async function apiGet(path) { return api(path); }
export async function apiPost(path, body) { return api(path, { method: 'POST', body }); }
export async function apiPut(path, body) { return api(path, { method: 'PUT', body }); }
export async function apiDelete(path) { return api(path, { method: 'DELETE' }); }