import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { formatDistance } from '../../utils/distance';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Stack,
  Chip,
  Avatar,
  Divider,
  Paper,
  Theme,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon,
  ConfirmationNumber as TicketIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { MESSAGES, REGEX } from '../../constants';

export const EventDetailModal: React.FC = () => {
  const { selectedEvent, setSelectedEvent, buyTicket, user, setIsAuthModalOpen, setActiveNav } = useApp();
  const [quantity, setQuantity] = useState<number>(1);
  const [isPurchased, setIsPurchased] = useState<boolean>(false);

  if (!selectedEvent) return null;

  const formattedDate = formatDate(selectedEvent.date, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleBuy = () => {
    if (!user.isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (quantity > selectedEvent.availableSeats) {
      toast.error(MESSAGES.TOAST.SEATS_REMAINING_ERROR(selectedEvent.availableSeats));
      return;
    }

    const ticket = buyTicket(selectedEvent.id, quantity, selectedEvent);
    if (ticket) {
      setIsPurchased(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setIsPurchased(false);
    setQuantity(1);
  };

  const totalCost = selectedEvent.ticketPrice * quantity;

  const ticketSummaryItems = [
    { label: 'Date & Time:', value: `${formattedDate} at ${selectedEvent.time}` },
    { label: 'Venue:', value: selectedEvent.locationName },
  ];

  const eventMetaItems = [
    { icon: <CalendarIcon color="primary" />, label: 'Date', value: formattedDate },
    { icon: <ClockIcon color="secondary" />, label: 'Time', value: `${selectedEvent.time} GMT` },
    { icon: <LocationIcon sx={{ color: '#06b6d4' }} />, label: 'Proximity', value: formatDistance(selectedEvent.distanceKm) },
  ];

  return (
    <Dialog
      open={Boolean(selectedEvent)}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          color: '#ffffff',
          zIndex: 10,
          '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.8)' },
        }}
      >
        <CloseIcon />
      </IconButton>

      {isPurchased ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CheckIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {MESSAGES.TICKET_MODAL.SUCCESS_TITLE}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {MESSAGES.TICKET_MODAL.SUCCESS_SUBTITLE(quantity, selectedEvent.title)}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              textAlign: 'left',
              backgroundColor: (theme: Theme) =>
                theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(248, 250, 252, 0.8)',
            }}
          >
            <Stack spacing={1.5}>
              {ticketSummaryItems.map((item, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Stack>
              ))}
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Total Amount Paid:
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'success.main' }}>
                  {formatCurrency(totalCost)}
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleClose();
                setActiveNav('attend');
              }}
            >
              {MESSAGES.TICKET_MODAL.VIEW_IN_MY_TICKETS}
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              {MESSAGES.TICKET_MODAL.BROWSE_MORE}
            </Button>
          </Stack>
        </Box>
      ) : (
        <DialogContent sx={{ p: 0 }}>
          {/* Banner Media */}
          <Box sx={{ position: 'relative', height: 260, width: '100%', overflow: 'hidden' }}>
            <Box
              component="img"
              src={selectedEvent.posterUrl}
              alt={selectedEvent.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15,21,35,0.2) 0%, rgba(15,21,35,0.95) 100%)',
              }}
            />
            <Box sx={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
              <Chip
                label={selectedEvent.category.replace(REGEX.UNDERSCORE_GLOBAL, ' ')}
                color="secondary"
                size="small"
                sx={{ fontWeight: 700, mb: 1, textTransform: 'capitalize' }}
              />
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
                {selectedEvent.title}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Meta Grid */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              {eventMetaItems.map((meta, idx) => (
                <Stack key={idx} direction="row" alignItems="center" spacing={1.5}>
                  {meta.icon}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {meta.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {meta.value}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Paper>

            {/* Description & Host */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                About this Event
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {selectedEvent.description}
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar src={selectedEvent.hostAvatar} alt={selectedEvent.hostName} sx={{ width: 44, height: 44 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Event Host
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {selectedEvent.hostName}
                </Typography>
              </Box>
              <Chip icon={<VerifiedIcon />} label="Verified Host" size="small" color="info" variant="outlined" />
            </Paper>

            {/* Ticket Checkout Box */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: 1,
                borderColor: 'primary.main',
                background: (theme: Theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Price per Ticket
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
                    {formatCurrency(selectedEvent.ticketPrice)}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    Seats Availability
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedEvent.availableSeats} of {selectedEvent.totalSeats} seats left
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, px: 1.5, py: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Qty:
                  </Typography>
                  <Button size="small" onClick={() => setQuantity((q) => Math.max(1, q - 1))} sx={{ minWidth: 28 }}>
                    -
                  </Button>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, px: 1 }}>
                    {quantity}
                  </Typography>
                  <Button size="small" onClick={() => setQuantity((q) => Math.min(selectedEvent.availableSeats, q + 1))} sx={{ minWidth: 28 }}>
                    +
                  </Button>
                </Stack>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<TicketIcon />}
                  onClick={handleBuy}
                  disabled={selectedEvent.availableSeats === 0}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  {selectedEvent.availableSeats === 0
                    ? MESSAGES.TICKET_MODAL.SOLD_OUT
                    : MESSAGES.TICKET_MODAL.BUY_BUTTON(quantity, formatCurrency(totalCost))}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};
