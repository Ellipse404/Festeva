import React, { useState, useEffect } from 'react';
import { useApp, useDebouncedCallback } from '../../hooks';
import { IHeaderProps } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';
import {
  AppBar,
  Toolbar,
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  ConfirmationNumber as TicketIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

export const Header: React.FC<IHeaderProps> = ({
  sidebarCollapsed,
  isFilterOpen,
  setIsFilterOpen,
  setMobileOpen,
}) => {
  const { user, logout, activeNav, setActiveNav, filters, setFilters, setIsAuthModalOpen, setAuthModalMode, themeMode, toggleTheme } = useApp();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Local state for instant input feedback without typing lag
  const [searchInput, setSearchInput] = useState<string>(filters.searchQuery);

  // Sync local state if filters reset externally
  useEffect(() => {
    setSearchInput(filters.searchQuery);
  }, [filters.searchQuery]);

  // Debounced callback to update global search filter after 300ms pause
  const debouncedSetFilter = useDebouncedCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    debouncedSetFilter(val);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: '100%',
          md: sidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 240px)',
        },
        ml: {
          xs: 0,
          md: sidebarCollapsed ? '72px' : '240px',
        },
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(16px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(11, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: 68,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, px: { xs: 2, sm: 3 }, height: 68 }}>
        {/* Left Section: Search & Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: 550 }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          <TextField
            fullWidth
            size="small"
            placeholder="Search events by title, venue, host..."
            value={searchInput}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '6px',
                fontSize: '0.88rem',
              },
            }}
          />

          <Button
            variant={isFilterOpen ? 'contained' : 'outlined'}
            color="primary"
            startIcon={<FilterIcon />}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderRadius: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Right Section: Host, Attend, Theme Toggle & Profile Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setActiveNav('host')}
            sx={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              fontWeight: 700,
              borderRadius: '6px',
              display: { xs: 'none', sm: 'inline-flex' },
            }}
          >
            Host Event
          </Button>

          <Button
            variant={activeNav === 'attend' ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<TicketIcon />}
            onClick={() => setActiveNav('attend')}
            sx={{
              borderRadius: '6px',
              fontWeight: 600,
              display: { xs: 'none', md: 'inline-flex' },
            }}
          >
            Attend Event
          </Button>

          <Tooltip title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} mode`}>
            <IconButton onClick={toggleTheme} color="inherit">
              {themeMode === 'dark' ? (
                <LightIcon sx={{ color: '#f59e0b' }} />
              ) : (
                <DarkIcon sx={{ color: '#6366f1' }} />
              )}
            </IconButton>
          </Tooltip>

          {user.isLoggedIn ? (
            <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }}>
              <Avatar src={user.avatar} alt={user.name} sx={{ width: 36, height: 36, border: '2px solid #6366f1' }} />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonIcon />}
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              sx={{ borderRadius: '6px' }}
            >
              Login
            </Button>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 4,
              sx: {
                minWidth: 220,
                borderRadius: '8px',
                mt: 1.5,
                p: 1,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                {user.name} {user.isVerified && <VerifiedBadge />}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
            </Box>

            <MenuItem
              onClick={() => {
                setActiveNav('settings');
                handleCloseMenu();
              }}
              sx={{ borderRadius: '6px' }}
            >
              <PersonIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
              Profile Settings
            </MenuItem>

            <MenuItem
              onClick={() => {
                setActiveNav('attend');
                handleCloseMenu();
              }}
              sx={{ borderRadius: '6px' }}
            >
              <TicketIcon fontSize="small" sx={{ mr: 1.5, color: 'secondary.main' }} />
              My Tickets
            </MenuItem>

            <MenuItem
              onClick={() => {
                logout();
                handleCloseMenu();
              }}
              sx={{ color: 'error.main', borderRadius: '6px' }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Log Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
