/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Listing, VerificationRequest, UserProfile, Visit } from './types';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Chanbre Lumineuse-Tunis',
    location: 'Ariana, Tunis - Proche Campus El Manar',
    price: 450,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    status: 'ACTIVE',
    verified: true,
    postedBy: 'PROPRIÉTAIRE',
  },
  {
    id: '2',
    title: 'Maison dans centre ville',
    location: 'centre ville, tunis',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    status: 'SIGNALÉE',
    postedBy: 'PROPRIÉTAIRE',
  },
  {
    id: '3',
    title: 'Appartement pres IHEC',
    location: 'carthage, Tunis',
    price: 890,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
    status: 'PÉRIMÉE',
    postedBy: 'PROPRIÉTAIRE',
  },
  {
    id: '4',
    title: 'Recherche Colocataire - Campus Manar',
    location: 'El Manar, Tunis - Chambre double',
    price: 250,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    status: 'ACTIVE',
    verified: true,
    postedBy: 'ÉTUDIANT',
  },
  {
    id: '5',
    title: 'Colocation d\'Étudiants près d\'ESPRIT',
    location: 'Ghazela, Ariana',
    price: 320,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    status: 'ACTIVE',
    verified: false,
    postedBy: 'ÉTUDIANT',
  },
  {
    id: '6',
    title: 'Chambre partagée pour étudiante',
    location: 'La Marsa, Tunis',
    price: 280,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
    status: 'ACTIVE',
    verified: true,
    postedBy: 'ÉTUDIANT',
  },
];

export const MOCK_STUDENT_VERIFICATIONS: VerificationRequest[] = [
  {
    id: '1',
    name: 'Hamza Majdi',
    institution: 'Université Sesame',
    idCardImage: 'https://images.unsplash.com/photo-1610444583731-97dac0598686?auto=format&fit=crop&q=80&w=600',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Sarra Belhadj',
    institution: 'Esprit Engineering School',
    idCardImage: 'https://images.unsplash.com/photo-1627514630502-d9651588665c?auto=format&fit=crop&q=80&w=600',
    status: 'pending',
  },
];

export const MOCK_OWNER_VERIFICATIONS: VerificationRequest[] = [
  {
    id: '1',
    name: 'Sofiane Mansour',
    institution: 'Résidence El Hana, Ariana',
    idCardImage: 'https://images.unsplash.com/photo-1633519500055-6804bc5362e5?auto=format&fit=crop&q=80&w=600',
    additionalDoc: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&q=80&w=600',
    additionalDocLabel: 'JUSTIFICATIF STEG/SONEDE',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Leila Ben Salem',
    institution: 'Villa Jasmine, Sousse',
    idCardImage: 'https://images.unsplash.com/photo-1633519500055-6804bc5362e5?auto=format&fit=crop&q=80&w=600',
    additionalDoc: 'https://images.unsplash.com/photo-1586282130135-c743bc50b579?auto=format&fit=crop&q=80&w=600',
    additionalDocLabel: 'TITRE DE PROPRIÉTÉ',
    status: 'pending',
  },
];

export const MOCK_USER: UserProfile = {
  name: 'Hamza Majdi',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  isStudent: true,
  verified: true,
  rating: 4.8,
  school: 'Université Sesame',
  level: '4e année Ingénieur',
  status: 'Non-fumeur',
  interests: ['Football', 'Danse', 'Théâtre', 'E-sport'],
};

export const MOCK_FATEN: UserProfile = {
  name: 'Faten Aloui',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  isStudent: true,
  verified: true,
  rating: 4.9,
  school: 'Esprit Engineering School',
  level: '3e année Informatique',
  status: 'Non-fumeuse',
  interests: ['Musique', 'Voyage', 'Cinéma', 'Tennis'],
};

export const MOCK_FARAH: UserProfile = {
  name: 'Farah Ben Amor',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  isStudent: true,
  verified: true,
  rating: 4.7,
  school: 'Université Sesame',
  level: '2e année Design',
  status: 'Non-fumeuse',
  interests: ['Peinture', 'Photographie', 'Yoga', 'Lecture'],
};

export const MOCK_HEND: UserProfile = {
  name: 'Hend Chaabane',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  isStudent: true,
  verified: true,
  rating: 4.6,
  school: 'Faculté des Sciences de Tunis',
  level: '1ère année Mastère Biologie',
  status: 'Non-fumeuse',
  interests: ['Théâtre', 'Cuisine', 'Fitness', 'Séries TV'],
};

export const MOCK_VISITS: Visit[] = [
  {
    id: '1',
    studentName: 'Lucas Bernard',
    ownerName: 'Mme Durand',
    propertyTitle: 'Studio Lumineux - République',
    propertyLocation: '12 Rue de la Paix, Paris',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
    time: '14:30',
    date: "Aujourd'hui",
    status: 'Confirmed',
  },
  {
    id: '2',
    studentName: 'Sophie Martin',
    ownerName: 'Jean Petit',
    propertyTitle: 'T2 Moderne Canal St-Martin',
    propertyLocation: '45 Quai de Valmy, Paris',
    propertyImage: 'https://images.unsplash.com/photo-1554995207-c18c20360a59?auto=format&fit=crop&q=80&w=600',
    time: '16:00',
    date: "Aujourd'hui",
    status: 'Pending',
  },
  {
    id: '3',
    studentName: 'Thomas Müller',
    ownerName: 'Visite effectuée avec succès',
    propertyTitle: 'Visite effectuée avec succès',
    propertyLocation: '',
    propertyImage: '',
    time: '10:00',
    date: 'Terminé',
    status: 'Completed',
  },
];
