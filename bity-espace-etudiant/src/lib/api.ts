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
  // Extract surface from field or description if present
  const surfaceMatch = descriptionText.match(/\b(\d+)\s*(?:m²|m2)\b/i);
  const surface = ad.surface || (surfaceMatch ? parseInt(surfaceMatch[1], 10) : 45);

  const titleLower = ad.title?.toLowerCase() || '';
  const type = ad.propertyType || (
    titleLower.includes('chambre') || titleLower.includes('coloc')
      ? 'Chambre en colocation'
      : titleLower.includes('studio')
        ? 'Studio'
        : 'Logement entier'
  );

  const landlordName = ad.owner && typeof ad.owner === 'object'
    ? `${ad.owner.firstName || ''} ${ad.owner.lastName || ''}`.trim() || 'Nourdine Mansour'
    : (ad.title?.toLowerCase().includes('menzah') || ad._id === '6a842c331127f2b75aa49b79' ? 'Sarah Ben Salah' : 'Nourdine Mansour');

  const isSarah = landlordName.toLowerCase().includes('sarah');

  const landlordAvatar = ad.owner && typeof ad.owner === 'object' && ad.owner.avatar
    ? (ad.owner.avatar.startsWith('http') ? ad.owner.avatar : `http://localhost:5000${ad.owner.avatar}`)
    : (isSarah
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100');

  const landlordId = ad.owner
    ? (typeof ad.owner === 'object' ? ad.owner._id : ad.owner)
    : (isSarah ? 'sarah' : '6a1556a964f47245a2adcad0');

  const landlordScore = ad.owner?.rankingScore || (isSarah ? 4.8 : 4.9);
  const landlordCount = ad.owner?.rankingCount || (isSarah ? 12 : 18);

  // Derive neighborhood and city
  const locationStr = ad.location || '';
  const locationParts = locationStr.split(',');
  const neighborhood = ad.neighborhood || (locationParts.length > 1 ? locationParts[1].trim() : locationStr.trim());
  const city = ad.city || (locationParts.length > 0 ? locationParts[0].trim() : 'Tunis');

  return {
    id: ad._id,
    title: ad.title,
    type,
    price: ad.price,
    location: city,
    neighborhood,
    address: ad.address || locationStr,
    city,
    latitude: ad.latitude,
    longitude: ad.longitude,
    surface,
    distanceToUni: ad.distanceToFac || 10,
    transportTime: ad.transportAccess ? 2 : 12,
    verified: ad.status === 'ACTIVE',
    imageUrl: ad.image ? (ad.image.startsWith('http') ? ad.image : `http://localhost:5000${ad.image}`) : (ad.images && ad.images[0] ? (ad.images[0].startsWith('http') ? ad.images[0] : `http://localhost:5000${ad.images[0]}`) : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'),
    features: ad.features && ad.features.length > 0 ? ad.features : [`${surface}m²`, `${ad.distanceToFac || 10} min`, ad.transportAccess ? 'Métro' : 'Charges incluses'],
    roommates: ad.roommates || (type === 'Chambre en colocation' ? {
      count: 2,
      details: 'Faten, Farah • Étudiantes',
      avatars: ['F', 'F']
    } : undefined),
    landlord: {
      name: landlordName,
      avatar: landlordAvatar,
      memberSince: isSarah ? '2023' : '2022',
      reviewsCount: landlordCount,
      score: landlordScore,
      id: landlordId
    },
    description: descriptionText
  };
};
