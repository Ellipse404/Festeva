import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from './useApp';
import { eventsApi } from '../api/eventsApi';
import { useDebounce } from './useDebounce';

export const useEvents = () => {
  const { filters, setFilters, resetFilters, addEvent } = useApp();

  // Debounce search query to prevent excessive API calls while user types
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 350);

  const activeFilters = useMemo(
    () => ({ ...filters, searchQuery: debouncedSearchQuery }),
    [filters, debouncedSearchQuery],
  );

  // TanStack Query for fetching events with caching and background refetching
  const {
    data: apiResult,
    isLoading: isLoadingEvents,
    error: queryError,
    refetch: fetchEvents,
  } = useQuery({
    queryKey: ['events', activeFilters.category, activeFilters.searchQuery],
    queryFn: () => eventsApi.getEvents(activeFilters),
    staleTime: 1000 * 60 * 2,
  });

  const events = apiResult?.data || [];
  const isApiConnected = apiResult?.isConnected ?? false;
  const apiError = apiResult?.error || (queryError ? String(queryError) : null);

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
    isLoadingEvents,
    isApiConnected,
    apiError,
    fetchEvents,
    addEvent,
    filters,
    setFilters,
    resetFilters,
  };
};

