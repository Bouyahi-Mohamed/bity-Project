export const API_BASE = 'http://localhost:5000/api';

export const getToken = (): string => localStorage.getItem('bity_token') || '';

export const getUser = () => {
  const raw = localStorage.getItem('bity_user');
  return raw ? JSON.parse(raw) : null;
};

export const authFetch = (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
  });
};

export const requireAuth = () => {
  if (!getToken()) {
    window.location.href = 'http://localhost:3000';
  }
};
