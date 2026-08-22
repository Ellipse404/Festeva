import React from 'react';
import { useApp } from '../../hooks/useApp';
import { IEventCardProps } from '../../types';
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

export const EventCard: React.FC<IEventCardProps> = ({ event }) => {
  const { setSelectedEvent } = useApp();

  const formattedDate = formatDate(event.date);

  return (
    <Card
      elevation={2}
      className="h-full flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-md hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative overflow-hidden aspect-video">
        <CardMedia
          component="img"
          image={event.posterUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Chip
            label={formatCategoryLabel(event.category)}
            size="small"
            className="bg-purple-600/90 text-white font-bold text-xs backdrop-blur-md shadow-md"
          />
        </div>
      </div>

      <CardContent className="flex-1 p-5">
        <Typography variant="h6" className="font-extrabold text-white mb-2 line-clamp-2">
          {event.title}
        </Typography>

        <Typography variant="body2" className="text-slate-400 mb-4 line-clamp-2">
          {event.description}
        </Typography>

        <Stack spacing={1.5} className="text-slate-300">
          <div className="flex items-center gap-2 text-sm text-purple-300 font-medium">
            <CalendarIcon style={{ fontSize: 18 }} />
            <span>{formattedDate} • {event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <LocationIcon style={{ fontSize: 18, color: '#ec4899' }} />
            <span className="truncate">{event.locationName} ({formatDistance(event.distanceKm)})</span>
          </div>
        </Stack>
      </CardContent>

      <CardActions className="p-5 pt-0 flex justify-between items-center border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2">
          <Avatar src={event.hostAvatar} alt={event.hostName} sx={{ width: 28, height: 28 }} />
          <Typography variant="caption" className="text-slate-400 font-semibold truncate max-w-[120px]">
            {event.hostName}
          </Typography>
        </div>

        <Button
          variant="contained"
          size="small"
          onClick={() => setSelectedEvent(event)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl capitalize"
        >
          {event.ticketPrice > 0 ? formatCurrency(event.ticketPrice) : 'Free Attend'}
        </Button>
      </CardActions>
    </Card>
  );
};
