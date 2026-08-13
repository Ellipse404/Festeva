import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from './useApp';
import { EventItem } from '../types';
import { eventsApi } from '../api/eventsApi';
import { MESSAGES } from '../constants';
import { useDebounce } from './useDebounce';

export const useEvents = () => {
  const { filters, setFilters, resetFilters, addEvent } = useApp();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Debounce search query to prevent excessive API calls while user types
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 350);

  const activeFilters = useMemo(
    () => ({ ...filters, searchQuery: debouncedSearchQuery }),
    [filters, debouncedSearchQuery],
  );

  // Fetch events directly from Nest Backend API on mount & filter changes
  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setApiError(null);
    try {
      const result = await eventsApi.getEvents(activeFilters);
      setIsApiConnected(result.isConnected);
      if (result.isConnected) {
        setEvents(result.data);
      } else {
        setEvents([]);
        setApiError(result.error || MESSAGES.ERRORS.FAILED_TO_CONNECT);
      }
    } catch (err: any) {
      setIsApiConnected(false);
      setEvents([]);
      setApiError(err?.message || MESSAGES.ERRORS.FETCH_EVENTS_FAILED);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

