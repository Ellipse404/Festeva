import React from 'react';
import { useApp } from '../../hooks/useApp';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Stack,
  Grid,
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  GetApp as DownloadIcon,
  AutoAwesome as SparklesIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export const MyTicketsView: React.FC = () => {
  const { tickets, setActiveNav, user, setIsAuthModalOpen } = useApp();

  if (!user.isLoggedIn) {
    return (
      <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 4, maxWidth: 600, mx: 'auto' }}>
        <TicketIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Login to View Your Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please sign in to access your booked event passes, ticket passes, and QR codes.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setIsAuthModalOpen(true)}>
          Sign In Now
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            My Attending Events & Tickets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your registered event passes and entry QR codes.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SparklesIcon />}
          onClick={() => setActiveNav('dashboard')}
        >
          Explore Events
        </Button>
      </Stack>

      {tickets.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No Tickets Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You have not purchased tickets for any events yet. Explore upcoming celebrations nearby!
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setActiveNav('dashboard')}>
            Browse Dashboard Events
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {tickets.map((tkt) => (
            <Card
              key={tkt.id}
              elevation={2}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '240px 1fr 200px' },
              }}
            >
              {/* Media Poster */}
              <Box sx={{ position: 'relative', height: '100%', minHeight: 180 }}>
                <CardMedia component="img" image={tkt.posterUrl} alt={tkt.eventTitle} sx={{ height: '100%', objectFit: 'cover' }} />
                <Chip
                  label="CONFIRMED PASS"
                  color="success"
                  size="small"
                  sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 700, fontSize: '0.7rem' }}
                />
              </Box>

              {/* Details */}
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    {tkt.eventCategory}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, mb: 1.5 }}>
                    {tkt.eventTitle}
                  </Typography>
                </Box>

                <Stack spacing={1} sx={{ color: 'text.secondary', fontSize: '0.88rem' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarIcon fontSize="small" color="primary" />
                    <Typography variant="body2">{formatDate(tkt.eventDate)} • {tkt.eventTime}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationIcon fontSize="small" color="inherit" />
                    <Typography variant="body2">{tkt.eventLocation}</Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={3} sx={{ pt: 2, borderTop: 1, borderColor: 'divider', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Quantity: <strong>{tkt.quantity} Pass(es)</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Paid: <strong style={{ color: '#10b981' }}>{formatCurrency(tkt.totalPaid)}</strong>
                  </Typography>
                </Stack>
              </CardContent>

              {/* QR Stub */}
              <Box
                sx={{
                  p: 3,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(241,245,249,0.8)',
                  borderLeft: { md: 1 },
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  textAlign: 'center',
                }}
              >
                <Box sx={{ p: 1, backgroundColor: '#ffffff', borderRadius: 2 }}>
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="#090d16">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" />
                    <rect x="40" y="10" width="10" height="10" />
                    <rect x="50" y="20" width="10" height="10" />
                    <rect x="30" y="40" width="20" height="20" />
                  </svg>
                </Box>

                <Typography variant="caption" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                  {tkt.qrCode}
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  fullWidth
                  startIcon={<DownloadIcon />}
                  onClick={() => toast.success(`Pass ${tkt.qrCode} saved for offline verification!`)}
                >
                  Download Pass
                </Button>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};
