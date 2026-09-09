import { EventCategoryEnum, SortByEnum } from './common';

export type EventCategory = 'all' | 'birthday' | 'reception' | 'rice_ceremony' | 'anniversary' | 'others';

export interface IEventItem {
  id: string;
  title: string;
  category: Exclude<EventCategory, 'all'>;
  description: string;
  posterUrl: string;
  isGif?: boolean;
  date: string; // YYYY-MM-DD
  time: string;
  locationName: string;
  distanceKm: number;
  ticketPrice: number; // 0 = free, >0 = host set price
  availableSeats: number;
  totalSeats: number;
  hostName: string;
  hostAvatar: string;
  hostEmail?: string;
  createdAt: string;
}

export interface IFilterOptions {
  searchQuery: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  maxDistanceKm: number;
  sortBy: 'distance' | 'date' | 'price_asc' | 'price_desc';
}
