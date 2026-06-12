/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  status: 'ACTIVE' | 'SIGNALÉE' | 'PÉRIMÉE';
  verified?: boolean;
  postedBy?: 'PROPRIÉTAIRE' | 'ÉTUDIANT';
}

export interface VerificationRequest {
  id: string;
  name: string;
  institution: string;
  idCardImage: string;
  additionalDoc?: string;
  additionalDocLabel?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserProfile {
  name: string;
  avatar: string;
  isStudent: boolean;
  verified: boolean;
  rating: number;
  school: string;
  level: string;
  status: string;
  interests: string[];
}

export interface Visit {
  id: string;
  studentName: string;
  ownerName: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  time: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}
