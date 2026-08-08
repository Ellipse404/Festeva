import { useApp } from './useApp';
import { sortEventsByDistance } from '../utils/distance';

export const useEvents = () => {
  const { events, addEvent, filters, setFilters, resetFilters } = useApp();

  // Filter logic
  const filteredEvents = events.filter((evt) => {
    if (filters.category !== 'all' && evt.category !== filters.category) return false;

    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchLoc = evt.locationName.toLowerCase().includes(q);
      const matchHost = evt.hostName.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchHost) return false;
    }

    if (evt.distanceKm > filters.maxDistanceKm) return false;
    if (filters.startDate && evt.date < filters.startDate) return false;
    if (filters.endDate && evt.date > filters.endDate) return false;

    return true;
  });

  // Sort logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filters.sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (filters.sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (filters.sortBy === 'price_asc') return a.ticketPrice - b.ticketPrice;
    if (filters.sortBy === 'price_desc') return b.ticketPrice - a.ticketPrice;
    return 0;
  });

  return {
    events: sortedEvents,
    rawEvents: events,
    addEvent,
    filters,
    setFilters,
    resetFilters,
  };
};
