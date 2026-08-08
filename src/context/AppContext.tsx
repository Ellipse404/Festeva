import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EventItem, Ticket, UserProfile, FilterOptions, NavView } from '../types';
import { INITIAL_MOCK_EVENTS } from '../data/mockEvents';
import toast, { Toaster } from 'react-hot-toast';

interface AppContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;

  user: UserProfile;
  loginWithProvider: (provider: 'google' | 'meta' | 'email', email?: string, name?: string) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  events: EventItem[];
  addEvent: (eventData: Omit<EventItem, 'id' | 'createdAt' | 'distanceKm' | 'hostName' | 'hostAvatar' | 'hostEmail'>) => EventItem;

  tickets: Ticket[];
  buyTicket: (eventId: string, quantity: number) => Ticket | null;

  activeNav: NavView;
  setActiveNav: (nav: NavView) => void;

  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;

  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-guest-123',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  location: 'Downtown City Center',
  isLoggedIn: true,
  provider: 'google',
};

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  category: 'all',
  startDate: '',
  endDate: '',
  maxDistanceKm: 50,
  sortBy: 'distance',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme State (Light vs Dark)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('festeva_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('festeva_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // User State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('festeva_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Events State
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('festeva_events');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_EVENTS;
  });

  // Tickets State
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('festeva_tickets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tkt-sample-101',
        eventId: 'evt-1',
        eventTitle: 'Aarav & Priya Grand Wedding Reception',
        eventCategory: 'reception',
        eventDate: '2026-08-15',
        eventTime: '19:00',
        eventLocation: 'The Grand Pavilion Hall, Downtown',
        posterUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        quantity: 2,
        unitPrice: 50,
        totalPaid: 100,
        purchaseDate: new Date().toISOString().split('T')[0],
        qrCode: 'FESTEVA-TKT-101-PASS',
        status: 'active',
      },
    ];
  });

  const [activeNav, setActiveNav] = useState<NavView>('dashboard');
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    localStorage.setItem('festeva_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('festeva_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('festeva_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const loginWithProvider = (provider: 'google' | 'meta' | 'email', email?: string, name?: string) => {
    const updated: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (provider === 'google' ? 'Google User' : provider === 'meta' ? 'Meta User' : 'Festeva Member'),
      email: email || `${provider}.user@festeva.com`,
      avatar:
        provider === 'google'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      location: 'Central Metro Hub',
      isLoggedIn: true,
      provider,
    };
    setUser(updated);
    setIsAuthModalOpen(false);
    toast.success(`Welcome back, ${updated.name}! 🎉`, {
      style: {
        background: themeMode === 'dark' ? '#151c2e' : '#ffffff',
        color: themeMode === 'dark' ? '#f8fafc' : '#0f172a',
      },
    });
  };

  const logout = () => {
    setUser({ ...DEFAULT_USER, isLoggedIn: false });
    toast.success('Logged out successfully', {
      style: {
        background: themeMode === 'dark' ? '#151c2e' : '#ffffff',
        color: themeMode === 'dark' ? '#f8fafc' : '#0f172a',
      },
    });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    toast.success('Profile settings saved! ✨');
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast('Filters reset to default', { icon: '🔄' });
  };

  const addEvent = (
    data: Omit<EventItem, 'id' | 'createdAt' | 'distanceKm' | 'hostName' | 'hostAvatar' | 'hostEmail'>
  ): EventItem => {
    const newEvt: EventItem = {
      ...data,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      distanceKm: Number((Math.random() * 4 + 0.5).toFixed(1)),
      hostName: user.name,
      hostAvatar: user.avatar,
      hostEmail: user.email,
    };
    setEvents((prev) => [newEvt, ...prev]);
    toast.success(`Event "${newEvt.title}" is now LIVE! 🚀`);
    return newEvt;
  };

  const buyTicket = (eventId: string, quantity: number): Ticket | null => {
    const target = events.find((e) => e.id === eventId);
    if (!target || target.availableSeats < quantity) {
      toast.error('Selected quantity exceeds available seats!');
      return null;
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, availableSeats: e.availableSeats - quantity } : e))
    );

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      eventId: target.id,
      eventTitle: target.title,
      eventCategory: target.category,
      eventDate: target.date,
      eventTime: target.time,
      eventLocation: target.locationName,
      posterUrl: target.posterUrl,
      quantity,
      unitPrice: target.ticketPrice,
      totalPaid: target.ticketPrice * quantity,
      purchaseDate: new Date().toISOString().split('T')[0],
      qrCode: `FESTEVA-${Date.now()}-PASS`,
      status: 'active',
    };

    setTickets((prev) => [newTicket, ...prev]);
    toast.success(`Ticket(s) confirmed for ${target.title}! 🎟️`);
    return newTicket;
  };

  return (
    <AppContext.Provider
      value={{
        themeMode,
        toggleTheme,
        user,
        loginWithProvider,
        logout,
        updateUserProfile,
        events,
        addEvent,
        tickets,
        buyTicket,
        activeNav,
        setActiveNav,
        filters,
        setFilters,
        resetFilters,
        selectedEvent,
        setSelectedEvent,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
