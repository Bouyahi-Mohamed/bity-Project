export interface Property {
  id: string;
  title: string;
  type: 'Logement entier' | 'Chambre en colocation' | 'Studio';
  price: number;
  location: string;
  neighborhood: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  surface: number;
  distanceToUni: number;
  transportTime: number;
  verified: boolean;
  imageUrl: string;
  features: string[];
  roommates?: {
    count: number;
    details: string;
    avatars: string[];
  };
  landlord: {
    name: string;
    avatar: string;
    memberSince: string;
    reviewsCount: number;
    score: number;
    id?: string;
  };
  description: string;
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'S+1 Moderne Centre Ville',
    type: 'Logement entier',
    price: 650,
    location: 'Tunis',
    neighborhood: 'Lafayette',
    surface: 45,
    distanceToUni: 10,
    transportTime: 2,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    features: ['45m²', '2 min', '10 min'],
    landlord: {
      name: 'Mohamed Bouyahi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      memberSince: '2021',
      reviewsCount: 12,
      score: 4.8
    },
    description: 'Superbe appartement refait à neuf, idéalement situé au cœur de Tunis. Calme et très lumineux.'
  },
  {
    id: '2',
    title: 'Chambre en Colocation',
    type: 'Chambre en colocation',
    price: 350,
    location: 'Ariana',
    neighborhood: 'El Menzah 5',
    surface: 14,
    distanceToUni: 15,
    transportTime: 5,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    features: ['3 colocataires', 'Charges incluses'],
    roommates: {
      count: 3,
      details: 'Faten, Farah, Hend • Étudiants',
      avatars: ['F', 'F', 'H']
    },
    landlord: {
      name: 'Sarah Ben Salah',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
      memberSince: '2022',
      reviewsCount: 8,
      score: 4.5
    },
    description: 'Chambre lumineuse de 14m² dans un appartement de 100m². Ambiance calme et studieuse.'
  },
  {
    id: '3',
    title: 'Studio Haut Standing',
    type: 'Logement entier',
    price: 850,
    location: 'Tunis',
    neighborhood: 'Lac 1',
    surface: 35,
    distanceToUni: 20,
    transportTime: 5,
    verified: true,
    imageUrl: 'https://images.unsplash.com/photo-1536376074432-bc12f744586c?auto=format&fit=crop&q=80&w=800',
    features: ['35m²', 'Sécurisé', 'Clim'],
    landlord: {
      name: 'Ahmed Hamza',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
      memberSince: '2020',
      reviewsCount: 25,
      score: 4.9
    },
    description: 'Studio moderne au Lac 1. Entièrement équipé avec des matériaux de qualité.'
  }
];
