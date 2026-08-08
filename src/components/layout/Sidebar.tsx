import React from 'react';
import { useApp } from '../../hooks/useApp';
import { SidebarProps, NavView } from '../../types';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as HostIcon,
  ConfirmationNumber as TicketIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AutoAwesome as SparklesIcon,
} from '@mui/icons-material';

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { activeNav, setActiveNav } = useApp();

  const navItems: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
    { id: 'host', label: 'Host Event', icon: <HostIcon fontSize="small" /> },
    { id: 'attend', label: 'Attend Event', icon: <TicketIcon fontSize="small" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
  ];

  const handleNavClick = (id: NavView) => {
    setActiveNav(id);
    if (mobileOpen) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Brand Header */}
      <Box
        sx={{
          height: 68,
          minHeight: 68,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          px: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          onClick={() => handleNavClick('dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            cursor: 'pointer',
          }}
        >
          <SparklesIcon sx={{ color: 'primary.main', fontSize: 24 }} />
          {(!collapsed || mobileOpen) && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                fontSize: '1.15rem',
              }}
            >
              Festeva
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ display: { xs: 'none', md: 'flex' } }}
          size="small"
        >
          {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* Navigation List - Compact fixed height, not occupying full screen */}
      <Box sx={{ p: 1.2 }}>
        <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                selected={isActive}
                sx={{
                  borderRadius: '6px', // Reduced 6px border radius
                  height: 40, // Fixed compact height
                  py: 0,
                  px: 1.5,
                  transition: 'all 0.15s ease',
                  '&.Mui-selected': {
                    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.16) 0%, rgba(139, 92, 246, 0.08) 100%)',
                    borderLeft: '3px solid #6366f1',
                    color: 'primary.main',
                    fontWeight: 700,
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: isActive ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                {(!collapsed || mobileOpen) && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem',
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer - Fixed 240px width & 100vh height */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: collapsed ? 72 : 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? 72 : 240,
            boxSizing: 'border-box',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            borderRight: 1,
            borderColor: 'divider',
            position: 'fixed',
            height: '100vh',
            top: 0,
            left: 0,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#0b0f19' : '#ffffff',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
