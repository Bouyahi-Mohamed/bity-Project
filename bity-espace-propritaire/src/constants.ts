import { Property, ListingStatus, Notification } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'S+2 Moderne - La Marsa',
    location: 'Route de la Corniche',
    price: 1200,
    views: 124,
    requests: 5,
    status: ListingStatus.ACTIVE,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    squareMeters: 85,
  },
  {
    id: '2',
    title: 'Studio Étudiant - El Manar',
    location: 'Campus Universitaire',
    price: 650,
    views: 89,
    requests: 2,
    status: ListingStatus.ACTIVE,
    image: 'https://images.unsplash.com/photo-1536376074432-bf121770d48a?auto=format&fit=crop&q=80&w=800',
    squareMeters: 30,
  },
  {
    id: '3',
    title: 'Studio Centre-Ville',
    location: '15 Rue de Paris',
    price: 850,
    views: 245,
    requests: 12,
    status: ListingStatus.RENTED,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    squareMeters: 25,
    tenant: 'Thomas D.',
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Document expiré',
    description: 'Le titre de propriété pour "Appartement Centre-Ville" a expiré.',
    time: 'Action Requise',
    actionLabel: 'Mettre à jour',
    icon: 'FileWarning',
  },
  {
    id: '2',
    type: 'important',
    title: 'Rappel de visite',
    description: "Votre visite avec Nour Chatti est prévue pour aujourd'hui à 14:00.",
    time: "À l'instant",
    icon: 'Calendar',
  }
];
