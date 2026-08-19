import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Sparkles as SparklesIcon,
  Ticket as TicketIcon,
  ShieldCheck as ShieldIcon,
  Calendar as CalendarIcon,
  Star as StarIcon,
} from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';

export const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(circle at 15% 20%, rgba(168, 85, 247, 0.25) 0%, transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 65%),
          linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)
        `,
        px: { xs: 2, md: 4 },
        position: 'relative',
      }}
    >
      {/* Ambient Bokeh Particles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '30%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ py: 0 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {/* Left Column: Festive Brand & Value Proposition Showcase */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ pr: { md: 4 }, color: '#fff' }}>
              {/* Badge Pill */}
              <Chip
                icon={<SparklesIcon style={{ width: 14, height: 14, color: '#ec4899' }} />}
                label="The Premier Event Platform"
                sx={{
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  color: '#f472b6',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  mb: 2,
                  px: 1,
                  py: 1.8,
                  borderRadius: 10,
                }}
              />

              {/* Brand Title & Hero Headline */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { md: '2.8rem', lg: '3.2rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  mb: 1.5,
                }}
              >
                Celebrate Life’s{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Unforgettable
                </Box>{' '}
                Moments.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#94a3b8',
                  fontWeight: 400,
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  mb: 3,
                }}
              >
                Discover music festivals, wedding receptions, rice ceremonies, and grand galas near you. Host your own event or secure instant passes in seconds.
              </Typography>

              {/* Feature Highlights Stack */}
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2.5,
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#818cf8',
                      display: 'flex',
                    }}
                  >
                    <CalendarIcon style={{ width: 18, height: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      Vibrant Local Celebrations
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      From traditional rice ceremonies to electric concerts.
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2.5,
                      background: 'rgba(168, 85, 247, 0.15)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#c084fc',
                      display: 'flex',
                    }}
                  >
                    <TicketIcon style={{ width: 18, height: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      Instant QR Digital Passes
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Zero checkout delay with live digital pass generation.
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2.5,
                      background: 'rgba(236, 72, 153, 0.15)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      color: '#f472b6',
                      display: 'flex',
                    }}
                  >
                    <ShieldIcon style={{ width: 18, height: 18 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      Festeva Protection
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      100% verified hosts and secured ticket verification.
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              {/* Social Proof Bar */}
              <Stack direction="row" spacing={2} alignItems="center">
                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 12 } }}>
                  <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" />
                  <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" />
                  <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" />
                  <Avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" />
                </AvatarGroup>
                <Box>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} style={{ width: 14, height: 14, color: '#fbbf24', fill: '#fbbf24' }} />
                    ))}
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#fff', ml: 0.5 }}>
                      4.9 / 5.0
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                    Trusted by 50,000+ attendees & hosts
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Right Column: High-End Glassmorphic Auth Form Card */}
          <Grid item xs={12} md={6} lg={5}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 4,
                backdropFilter: 'blur(30px)',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.15)',
              }}
            >
              {/* Brand Logo Header */}
              <Box sx={{ textAlign: 'center', mb: 1.5 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Festeva
                </Typography>
              </Box>

              {/* Dynamic Reusable Auth Form */}
              <AuthForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
