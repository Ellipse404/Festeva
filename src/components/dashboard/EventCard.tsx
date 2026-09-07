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
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ConfirmationNumber as TicketIcon,
  LocalFireDepartment as FireIcon,
  Block as SoldOutIcon,
} from '@mui/icons-material';

export const EventCard: React.FC<IEventCardProps> = ({ event }) => {
  const { setSelectedEvent } = useApp();

  const formattedDate = formatDate(event.date);
  const isSoldOut = event.availableSeats === 0;
  const isLowSeats = event.availableSeats > 0 && event.availableSeats <= 10;
  const seatsBooked = (event.totalSeats || 100) - (event.availableSeats || 0);
  const percentBooked = Math.min(
    100,
    Math.round((seatsBooked / (event.totalSeats || 100)) * 100),
  );

  return (
    <Card
      elevation={2}
      className="h-full flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-md hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Poster Header */}
      <div className="relative overflow-hidden aspect-video">
        <CardMedia
          component="img"
          image={event.posterUrl}
          alt={event.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isSoldOut ? 'grayscale contrast-125 brightness-75' : ''
          }`}
        />

        {/* Category Badge Top Right */}
        <div className="absolute top-3 right-3">
          <Chip
            label={formatCategoryLabel(event.category)}
            size="small"
            className="bg-purple-600/90 text-white font-bold text-xs backdrop-blur-md shadow-md"
          />
        </div>

        {/* Seat Availability Status Chip Top Left */}
        <div className="absolute top-3 left-3">
          {isSoldOut ? (
            <Chip
              icon={<SoldOutIcon style={{ fontSize: 14, color: '#f87171' }} />}
              label="SOLD OUT"
              size="small"
              className="bg-red-950/90 text-red-300 border border-red-500/40 font-extrabold text-[11px] backdrop-blur-md shadow-md"
            />
          ) : isLowSeats ? (
            <Chip
              icon={<FireIcon style={{ fontSize: 14, color: '#fbbf24' }} />}
              label={`Only ${event.availableSeats} left!`}
              size="small"
              className="bg-amber-950/90 text-amber-300 border border-amber-500/40 font-extrabold text-[11px] backdrop-blur-md shadow-md animate-pulse"
            />
          ) : (
            <Chip
              icon={<TicketIcon style={{ fontSize: 14, color: '#34d399' }} />}
              label={`${event.availableSeats} seats left`}
              size="small"
              className="bg-slate-950/80 text-emerald-300 border border-emerald-500/30 font-extrabold text-[11px] backdrop-blur-md shadow-md"
            />
          )}
        </div>
      </div>

      <CardContent className="flex-1 p-5 space-y-3">
        <Typography variant="h6" className="font-extrabold text-white line-clamp-2 leading-snug">
          {event.title}
        </Typography>

        <Typography variant="body2" className="text-slate-400 line-clamp-2">
          {event.description}
        </Typography>

        <Stack spacing={1.2} className="text-slate-300 pt-1">
          <div className="flex items-center gap-2 text-sm text-purple-300 font-medium">
            <CalendarIcon style={{ fontSize: 18 }} />
            <span>{formattedDate} • {event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <LocationIcon style={{ fontSize: 18, color: '#ec4899' }} />
            <span className="truncate">{event.locationName} ({formatDistance(event.distanceKm)})</span>
          </div>
        </Stack>

        {/* Seat Availability Progress Indicator */}
        <div className="pt-2">
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Ticket Sales</span>
            <span className={`font-bold ${isSoldOut ? 'text-red-400' : isLowSeats ? 'text-amber-400' : 'text-emerald-400'}`}>
              {seatsBooked} / {event.totalSeats} Booked ({percentBooked}%)
            </span>
          </div>
          <LinearProgress
            variant="determinate"
            value={percentBooked}
            className={`h-1.5 rounded-full ${
              isSoldOut
                ? 'bg-red-950 [&>.MuiLinearProgress-bar]:bg-red-500'
                : isLowSeats
                ? 'bg-amber-950 [&>.MuiLinearProgress-bar]:bg-amber-500'
                : 'bg-slate-800 [&>.MuiLinearProgress-bar]:bg-emerald-500'
            }`}
          />
        </div>
      </CardContent>

      <CardActions className="p-5 pt-0 flex justify-between items-center border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2">
          <Avatar src={event.hostAvatar} alt={event.hostName} sx={{ width: 28, height: 28 }} />
          <Typography variant="caption" className="text-slate-400 font-semibold truncate max-w-[110px]">
            {event.hostName}
          </Typography>
        </div>

        <Button
          variant="contained"
          size="small"
          disabled={isSoldOut}
          onClick={() => setSelectedEvent(event)}
          className={`font-extrabold rounded-xl capitalize ${
            isSoldOut
              ? 'bg-slate-800 text-slate-500 border border-slate-700'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
          }`}
        >
          {isSoldOut ? 'Sold Out' : event.ticketPrice > 0 ? formatCurrency(event.ticketPrice) : 'Free Attend'}
        </Button>
      </CardActions>
    </Card>
  );
};
