import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
  Avatar,
  Button,
  Stack,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

export const SettingsView: React.FC = () => {
  const { user, updateUserProfile } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [location, setLocation] = useState(user.location);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, location });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box sx={{ maxWidth: 750, mx: 'auto', py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Account & Profile Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your personal details, default location, and platform preferences.
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSave} elevation={2} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={3}>
          {/* User Profile Header */}
          <Stack direction="row" spacing={2.5} alignItems="center" sx={{ pb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 72, height: 72, border: 2, borderColor: 'primary.main' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Chip
                label={`Connected via ${user.provider?.toUpperCase() || 'EMAIL'}`}
                color="primary"
                size="small"
                variant="outlined"
                sx={{ mt: 1, fontWeight: 600, fontSize: '0.75rem' }}
              />
            </Box>
          </Stack>

          <TextField
            fullWidth
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
            required
          />

          <TextField
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Default City / Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon sx={{ color: '#06b6d4' }} />
                </InputAdornment>
              ),
            }}
            required
          />

          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Notifications & Alerts
            </Typography>
            <Stack spacing={1}>
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label="Email notifications for new hosted events near my location"
              />
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label="Ticket purchase confirmations and pass reminders"
              />
            </Stack>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={saved ? <CheckIcon /> : <SaveIcon />}
            sx={{ py: 1.2, fontWeight: 700, alignSelf: 'flex-start' }}
          >
            {saved ? 'Saved Changes!' : 'Save Settings'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
