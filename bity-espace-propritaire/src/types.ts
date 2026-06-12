export enum ListingStatus {
  ACTIVE = 'Actif',
  PENDING = 'En attente',
  RENTED = 'Loué',
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  views: number;
  requests: number;
  image: string;
  status: ListingStatus;
  squareMeters?: number;
  tenant?: string;
}

export interface Notification {
  id: string;
  type: 'urgent' | 'important' | 'today';
  title: string;
  description: string;
  time: string;
  actionLabel?: string;
  icon: string;
}
