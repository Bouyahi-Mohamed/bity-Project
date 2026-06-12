import { Property, ListingStatus } from '../types';

export const API_BASE = 'http://localhost:5000/api';

/** Returns stored JWT token or empty string */
export const getToken = (): string => localStorage.getItem('bity_token') || '';

/** Returns stored user object or null */
export const getUser = () => {
  const raw = localStorage.getItem('bity_user');
  return raw ? JSON.parse(raw) : null;
};

/** Authenticated fetch — automatically attaches Bearer token */
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

/** Redirect to login if no token */
export const requireAuth = () => {
  if (!getToken()) {
    window.location.href = 'http://localhost:3000';
  }
};

/** Synchronizes authentication parameters passed in URL query (cross-origin ports) */
export const syncAuthFromUrl = () => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  const urlUser = params.get('user');

  if (urlToken && urlUser) {
    localStorage.setItem('bity_token', urlToken);
    localStorage.setItem('bity_user', urlUser);

    // Clean URL query parameters without reloading
    params.delete('token');
    params.delete('user');
    const newSearch = params.toString();
    const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '');
    window.history.replaceState({}, '', newPath);
  }
};

/** Maps a backend Ad document to a frontend Property interface */
export const mapBackendAdToProperty = (ad: any): Property => {
  let status = ListingStatus.ACTIVE;
  if (ad.status === 'SIGNALÉE') {
    status = ListingStatus.PENDING;
  } else if (ad.status === 'PÉRIMÉE') {
    status = ListingStatus.RENTED;
  }

  // Generate deterministic views/requests from the ad ID to look rich
  const idHash = ad._id ? ad._id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) : 100;
  const views = 50 + (idHash % 150);
  const requests = Math.floor(views / 15);

  return {
    id: ad._id,
    title: ad.title,
    location: ad.location,
    price: ad.price,
    views,
    requests,
    image: ad.image ? (ad.image.startsWith('http') ? ad.image : `http://localhost:5000${ad.image}`) : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    status,
    squareMeters: ad.distanceToFac ? ad.distanceToFac * 10 : 35,
    tenant: status === ListingStatus.RENTED ? 'Étudiant Vérifié' : undefined
  };
};

