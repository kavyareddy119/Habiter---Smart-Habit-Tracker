import { supabase } from './supabase';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  habits: () => request('/api/habits'),
  createHabit: (h) => request('/api/habits', { method: 'POST', body: JSON.stringify(h) }),
  updateHabit: (id, h) => request(`/api/habits/${id}`, { method: 'PUT', body: JSON.stringify(h) }),
  deleteHabit: (id) => request(`/api/habits/${id}`, { method: 'DELETE' }),
  toggle: (id, date) => request(`/api/habits/${id}/toggle`, { method: 'POST', body: JSON.stringify({ date }) }),
  stats: () => request('/api/stats'),
};
