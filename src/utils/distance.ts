import { EventItem } from '../types';

/**
 * Format distance string (e.g. "1.4 km away")
 */
export const formatDistance = (distanceKm: number): string => {
  return `${distanceKm} km away`;
};

/**
 * Sort events array by distance from user location (ascending)
 */
export const sortEventsByDistance = (events: EventItem[]): EventItem[] => {
  return [...events].sort((a, b) => a.distanceKm - b.distanceKm);
};
