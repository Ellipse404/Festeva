import React from 'react';
import { useApp } from '../../hooks/useApp';
import { EventCardProps } from '../../types';
import { formatDate, formatCurrency, formatCategoryLabel } from '../../utils/formatters';
import { formatDistance } from '../../utils/distance';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Avatar,
  Box,
  Stack,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { setSelectedEvent } = useApp();

  const formattedDate = formatDate(event.date);

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: '8px', // Reduced crisp border radius
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
          boxShadow: '0 10px 24px rgba(99, 102, 241, 0.2)',
        },
      }}
    >
      {/* Poster Media & Badges Overlay */}
      <Box sx={{ position: 'relative', height: 180, width: '100%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="180"
          image={event.posterUrl}
          alt={event.title}
          sx={{ transition: 'transform 0.4s ease', '&:hover': { transform: 'scale(1.06)' } }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(9,13,22,0) 0%, rgba(9,13,22,0.85) 100%)',
          }}
        />

        {/* Distance Badge */}
        <Chip
          icon={<LocationIcon sx={{ fontSize: '13px !important', color: '#06b6d4' }} />}
          label={formatDistance(event.distanceKm)}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#06b6d4',
            fontWeight: 700,
            fontSize: '0.72rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        />

        {/* Category Tag */}
        <Chip
          label={formatCategoryLabel(event.category)}
          size="small"
          color="secondary"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontWeight: 700,
            fontSize: '0.72rem',
            borderRadius: '4px',
            textTransform: 'capitalize',
          }}
        />
      </Box>

      {/* Card Content */}
      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: '1.05rem' }}>
          {event.title}
        </Typography>

        <Stack spacing={0.5} sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <CalendarIcon fontSize="small" sx={{ color: 'primary.main', fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
              {formattedDate} • {event.time}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.8}>
            <LocationIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
            <Typography variant="body2" noWrap sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
              {event.locationName}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 'auto', pt: 1 }}>
          <Avatar src={event.hostAvatar} alt={event.hostName} sx={{ width: 24, height: 24 }} />
          <Typography variant="caption" color="text.secondary">
            Hosted by <strong>{event.hostName}</strong>
          </Typography>
        </Stack>
      </CardContent>

      {/* Card Actions Footer */}
      <CardActions
        sx={{
          px: 2,
          py: 1.2,
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(248, 250, 252, 0.8)',
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.72rem' }}>
            Ticket Price
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              fontSize: '1rem',
              color: event.ticketPrice === 0 ? 'success.main' : 'secondary.main',
            }}
          >
            {formatCurrency(event.ticketPrice)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => setSelectedEvent(event)}
          sx={{ borderRadius: '6px', fontWeight: 600, fontSize: '0.82rem' }}
        >
          View & Buy
        </Button>
      </CardActions>
    </Card>
  );
};
