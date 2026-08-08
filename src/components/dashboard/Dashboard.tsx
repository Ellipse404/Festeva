import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../hooks/useApp';
import { EventCategory, DashboardProps } from '../../types';
import { EventCard } from './EventCard';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Paper,
  Slider,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CancelOutlined as CancelIcon,
} from '@mui/icons-material';

export const Dashboard: React.FC<DashboardProps> = ({ isFilterOpen }) => {
  const { events, filters, setFilters, resetFilters } = useApp();

  const categories: { id: EventCategory; label: string }[] = [
    { id: 'all', label: '✨ All Events' },
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'reception', label: '💍 Reception' },
    { id: 'rice_ceremony', label: '🍚 Rice Ceremony' },
    { id: 'anniversary', label: '🥂 Anniversary' },
    { id: 'others', label: '🎈 Others' },
  ];

  // Infinite Scroll State Simulation
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter events based on searchQuery, category, distance, and date range
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

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filters.sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (filters.sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (filters.sortBy === 'price_asc') return a.ticketPrice - b.ticketPrice;
    if (filters.sortBy === 'price_desc') return b.ticketPrice - a.ticketPrice;
    return 0;
  });

  // Infinite Scroll Observer
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < sortedEvents.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 4, sortedEvents.length));
            setIsLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [sentinelRef, visibleCount, sortedEvents.length]);

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* Category Chips Bar - Flush with content */}
      <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1.5, mb: 2 }}>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
            color={filters.category === cat.id ? 'primary' : 'default'}
            variant={filters.category === cat.id ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 600,
              fontSize: '0.88rem',
              py: 2,
              px: 0.5,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            }}
          />
        ))}
      </Stack>

      {/* Expandable Filter Drawer Panel */}
      {isFilterOpen && (
        <Paper
          elevation={1}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '8px',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={2.5} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Sort By
              </Typography>
              <Select
                fullWidth
                size="small"
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                sx={{ mt: 0.5, borderRadius: '6px' }}
              >
                <MenuItem value="distance">📍 Distance (Nearest First)</MenuItem>
                <MenuItem value="date">📅 Event Date (Earliest First)</MenuItem>
                <MenuItem value="price_asc">💵 Price: Low to High</MenuItem>
                <MenuItem value="price_desc">💵 Price: High to Low</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Max Distance ({filters.maxDistanceKm} km)
              </Typography>
              <Slider
                value={filters.maxDistanceKm}
                onChange={(_, val) => setFilters((prev) => ({ ...prev, maxDistanceKm: val as number }))}
                min={1}
                max={50}
                valueLabelDisplay="auto"
                color="primary"
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Start Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                sx={{ mt: 0.5 }}
                InputProps={{ sx: { borderRadius: '6px' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                End Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                sx={{ mt: 0.5 }}
                InputProps={{ sx: { borderRadius: '6px' } }}
              />
            </Grid>

            <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={resetFilters}
                startIcon={<RefreshIcon />}
                fullWidth
                size="medium"
                sx={{ borderRadius: '6px' }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Heading Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
          Hosted Events Near You
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Showing {Math.min(visibleCount, sortedEvents.length)} of {sortedEvents.length} events • Sorted by distance
        </Typography>
      </Box>

      {/* Grid of Events - Flush layout with clean tight spacing */}
      {sortedEvents.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: '8px',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <CancelIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria, category filters, or distance radius.
          </Typography>
          <Button variant="contained" color="primary" onClick={resetFilters} sx={{ borderRadius: '6px' }}>
            Clear All Filters
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {sortedEvents.slice(0, visibleCount).map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4} lg={3}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>

          {/* Infinite Scroll Sentinel */}
          {visibleCount < sortedEvents.length && (
            <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              {isLoadingMore ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" color="text.secondary">
                    Loading nearby events...
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Scroll to load more events...
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
