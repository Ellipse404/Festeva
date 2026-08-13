import React, { useState, useEffect, useRef } from "react";
import { useEvents, useThrottledCallback } from "../../hooks";
import { EventCategory, DashboardProps } from "../../types";
import { EventCard } from "./EventCard";
import { MESSAGES, CATEGORIES } from "../../constants";
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
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  CancelOutlined as CancelIcon,
} from "@mui/icons-material";

export const Dashboard: React.FC<DashboardProps> = ({ isFilterOpen }) => {
  const {
    events: sortedEvents,
    isLoadingEvents,
    isApiConnected,
    fetchEvents,
    filters,
    setFilters,
    resetFilters,
  } = useEvents();



  // Infinite Scroll State Simulation
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll Observer with Throttled Execution
  const handleIntersection = useThrottledCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && visibleCount < sortedEvents.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 4, sortedEvents.length));
        setIsLoadingMore(false);
      }, 600);
    }
  }, 300);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [sentinelRef, handleIntersection]);

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Category Chips Bar - Flush with content */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ overflowX: "auto", pb: 1.5, mb: 2 }}
        alignItems="center"
      >
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            onClick={() =>
              setFilters((prev) => ({ ...prev, category: cat.id }))
            }
            color={filters.category === cat.id ? "primary" : "default"}
            variant={filters.category === cat.id ? "filled" : "outlined"}
            sx={{
              fontWeight: 600,
              fontSize: "0.88rem",
              py: 2,
              px: 0.5,
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": {
                transform: "translateY(-1px)",
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
            borderRadius: "8px",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Grid container spacing={2.5} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                }}
              >
                Sort By
              </Typography>
              <Select
                fullWidth
                size="small"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                sx={{ mt: 0.5, borderRadius: "6px" }}
              >
                <MenuItem value="distance">
                  📍 Distance (Nearest First)
                </MenuItem>
                <MenuItem value="date">📅 Event Date (Earliest First)</MenuItem>
                <MenuItem value="price_asc">💵 Price: Low to High</MenuItem>
                <MenuItem value="price_desc">💵 Price: High to Low</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "text.secondary" }}
              >
                Max Distance ({filters.maxDistanceKm} km)
              </Typography>
              <Slider
                value={filters.maxDistanceKm}
                onChange={(_, val) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxDistanceKm: val as number,
                  }))
                }
                min={1}
                max={50}
                valueLabelDisplay="auto"
                color="primary"
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "text.secondary" }}
              >
                Start Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
                sx={{ mt: 0.5 }}
                InputProps={{ sx: { borderRadius: "6px" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "text.secondary" }}
              >
                End Date
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
                sx={{ mt: 0.5 }}
                InputProps={{ sx: { borderRadius: "6px" } }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={1}
              sx={{ display: "flex", alignItems: "flex-end", height: "100%" }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={resetFilters}
                startIcon={<RefreshIcon />}
                fullWidth
                size="medium"
                sx={{ borderRadius: "6px" }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Heading Header with API Status Badge */}
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
            >
              {MESSAGES.DASHBOARD.TITLE}
            </Typography>
            {isApiConnected ? (
              <Chip
                label={MESSAGES.DASHBOARD.API_CONNECTED}
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
            ) : (
              <Chip
                label={MESSAGES.DASHBOARD.API_DISCONNECTED}
                size="small"
                color="error"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {MESSAGES.DASHBOARD.SUBTITLE(
              Math.min(visibleCount, sortedEvents.length),
              sortedEvents.length,
            )}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchEvents()}
          disabled={isLoadingEvents}
          sx={{ borderRadius: "6px", fontWeight: 600 }}
        >
          {isLoadingEvents ? MESSAGES.DASHBOARD.REFRESH_SYNCING : MESSAGES.DASHBOARD.REFRESH_BUTTON}
        </Button>
      </Box>

      {/* Grid of Events - Flush layout with clean tight spacing */}
      {sortedEvents.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "8px",
            border: 1,
            borderColor: "divider",
          }}
        >
          <CancelIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {MESSAGES.ERRORS.NO_EVENTS_FOUND}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {MESSAGES.ERRORS.NO_EVENTS_SUBTITLE}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={resetFilters}
            sx={{ borderRadius: "6px" }}
          >
            {MESSAGES.DASHBOARD.CLEAR_FILTERS}
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
            <Box
              ref={sentinelRef}
              sx={{ display: "flex", justifyContent: "center", py: 4 }}
            >
              {isLoadingMore ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CircularProgress size={28} />
                  <Typography variant="body2" color="text.secondary">
                    {MESSAGES.DASHBOARD.LOADING_NEARBY}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  {MESSAGES.DASHBOARD.SCROLL_FOR_MORE}
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
