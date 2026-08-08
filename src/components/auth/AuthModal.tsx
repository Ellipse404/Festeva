import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  ArrowForward as ArrowIcon,
  VerifiedUser as ShieldIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithProvider,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'forgot') {
      setResetSent(true);
      toast.success('Password reset link sent to your email!');
      return;
    }
    loginWithProvider('email', email || 'user@gathergo.com', name || 'GatherGo User');
  };

  return (
    <Dialog
      open={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
        },
      }}
    >
      <IconButton
        onClick={() => setIsAuthModalOpen(false)}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ px: 2, py: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            {authModalMode === 'login' && 'Welcome Back to Festeva'}
            {authModalMode === 'register' && 'Create Your Festeva Account'}
            {authModalMode === 'forgot' && 'Reset Your Password'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {authModalMode === 'login' && 'Discover and host unforgettable events near you.'}
            {authModalMode === 'register' && 'Start hosting, attending events and buying tickets in seconds.'}
            {authModalMode === 'forgot' && 'Enter your email address to receive password reset instructions.'}
          </Typography>
        </Box>

        {resetSent && authModalMode === 'forgot' ? (
          <Box sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 3 }}>
            <ShieldIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Reset Link Sent!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If an account exists for {email}, we have dispatched a password recovery link.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setResetSent(false);
                setAuthModalMode('login');
              }}
            >
              Back to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {authModalMode === 'register' && (
              <TextField
                fullWidth
                label="Full Name"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <TextField
              fullWidth
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {authModalMode !== 'forgot' && (
              <TextField
                fullWidth
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              endIcon={<ArrowIcon />}
              sx={{ py: 1.2, fontWeight: 700, mt: 1 }}
            >
              {authModalMode === 'login' && 'Sign In'}
              {authModalMode === 'register' && 'Create Account'}
              {authModalMode === 'forgot' && 'Send Reset Link'}
            </Button>
          </Box>
        )}

        {authModalMode !== 'forgot' && (
          <>
            <Divider sx={{ my: 3 }}>Or continue with</Divider>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={() => loginWithProvider('google')}
                startIcon={
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                }
              >
                Google
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={() => loginWithProvider('meta')}
                startIcon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                }
              >
                Meta
              </Button>
            </Stack>
          </>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          {authModalMode === 'login' ? (
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button size="small" onClick={() => setAuthModalMode('register')} sx={{ fontWeight: 700 }}>
                Register now
              </Button>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Already registered?{' '}
              <Button size="small" onClick={() => setAuthModalMode('login')} sx={{ fontWeight: 700 }}>
                Sign In
              </Button>
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
