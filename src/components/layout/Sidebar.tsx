import React from 'react';
import { useApp } from '../../hooks/useApp';
import { ISidebarProps, NavView } from '../../types';
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

export const Sidebar: React.FC<ISidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { activeNav, setActiveNav } = useApp();

  const NAV_ITEMS: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Explore Events', icon: <DashboardIcon /> },
    { id: 'host', label: 'Host an Event', icon: <HostIcon /> },
    { id: 'attend', label: 'My Tickets', icon: <TicketIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const drawerContent = (
    <Box className="h-full flex flex-col bg-slate-900 border-r border-white/10 text-slate-100">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shrink-0">
            <SparklesIcon />
          </div>
          {!collapsed && (
            <div>
              <Typography variant="h6" className="font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
                Festeva
              </Typography>
              <Typography variant="caption" className="text-slate-400 font-medium text-[10px]">
                Event Discovery Engine
              </Typography>
            </div>
          )}
        </div>

        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hidden md:flex"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>

      {/* Nav List */}
      <List className="p-3 space-y-1.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <ListItemButton
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setMobileOpen(false);
              }}
              className={`rounded-2xl transition-all duration-200 py-3 ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <ListItemIcon className={isActive ? 'text-purple-400' : 'text-slate-400'}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ className: 'font-bold text-sm' }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        className="block md:hidden"
        PaperProps={{ className: 'w-64 bg-slate-900 border-r border-white/10' }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        className="hidden md:block transition-all duration-300"
        PaperProps={{
          className: `bg-slate-900 border-r border-white/10 transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          }`,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
