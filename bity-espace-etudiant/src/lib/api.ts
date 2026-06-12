import { Property } from '../types';

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
  const descriptionText = ad.description || '';
  // Extract surface from description if present (e.g. "45m²")
  const surfaceMatch = descriptionText.match(/\b(\d+)\s*(?:m²|m2)\b/i);
  const surface = surfaceMatch ? parseInt(surfaceMatch[1], 10) : 45;

  const titleLower = ad.title.toLowerCase();
  const type = titleLower.includes('chambre') || titleLower.includes('coloc')
    ? 'Chambre en colocation'
    : titleLower.includes('studio')
      ? 'Studio'
      : 'Logement entier';

  const landlordName = ad.owner
    ? `${ad.owner.firstName} ${ad.owner.lastName}`.trim() || 'Propriétaire Bity'
    : 'Ahmed Hamza';

  const landlordScore = ad.owner?.rankingScore || 4.8;
  const landlordCount = ad.owner?.rankingCount || 12;

  // Derive neighborhood from location (e.g. "Tunis, Lafayette" -> "Lafayette")
  const locationParts = ad.location.split(',');
  const neighborhood = locationParts.length > 1 ? locationParts[1].trim() : ad.location.trim();
  const city = locationParts[0].trim();

  return {
    id: ad._id,
    title: ad.title,
    type,
    price: ad.price,
    location: city,
    neighborhood,
    surface,
    distanceToUni: ad.distanceToFac || 10,
    transportTime: ad.transportAccess ? 2 : 12,
    verified: ad.status === 'ACTIVE',
    imageUrl: ad.image ? (ad.image.startsWith('http') ? ad.image : `http://localhost:5000${ad.image}`) : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    features: [`${surface}m²`, `${ad.distanceToFac || 10} min`, ad.transportAccess ? 'Métro' : 'Charges incluses'],
    roommates: type === 'Chambre en colocation' ? {
      count: 2,
      details: 'Faten, Farah • Étudiantes',
      avatars: ['F', 'F']
    } : undefined,
    landlord: {
      name: landlordName,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      memberSince: '2023',
      reviewsCount: landlordCount,
      score: landlordScore,
      id: ad.owner?._id || ''
    },
    description: descriptionText
  };
};
