import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  EventItem,
  Ticket,
  UserProfile,
  FilterOptions,
  NavView,
  AppContextType,
} from "../types";
import { INITIAL_MOCK_EVENTS } from "../data/mockEvents";
import { eventsApi } from "../api/eventsApi";
import { MESSAGES } from "../constants";
import toast, { Toaster } from "react-hot-toast";

const DEFAULT_USER: UserProfile = {
  id: "usr-guest-123",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  location: "Downtown City Center",
  isLoggedIn: true,
  provider: "google",
};

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: "",
  category: "all",
  startDate: "",
  endDate: "",
  maxDistanceKm: 50,
  sortBy: "distance",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Theme State (Light vs Dark)
  const [themeMode, setThemeMode] = useState<"light" | "dark">((): "light" | "dark" => {
    const saved = localStorage.getItem("festeva_theme");
    return (saved as "light" | "dark") || "dark";
  });

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    localStorage.setItem("festeva_theme", themeMode);
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  // User State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("festeva_user");
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Tickets State
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem("festeva_tickets");
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [activeNav, setActiveNav] = useState<NavView>("dashboard");
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<
    "login" | "register" | "forgot"
  >("login");

  useEffect(() => {
    localStorage.setItem("festeva_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("festeva_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const loginWithProvider = (
    provider: "google" | "meta" | "email",
    email?: string,
    name?: string,
  ) => {
    const updated: UserProfile = {
      id: `usr-${Date.now()}`,
      name:
        name ||
        (provider === "google"
          ? "Google User"
          : provider === "meta"
            ? "Meta User"
            : "Festeva Member"),
      email: email || `${provider}.user@festeva.com`,
      avatar:
        provider === "google"
          ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      location: "Central Metro Hub",
      isLoggedIn: true,
      provider,
    };
    setUser(updated);
    setIsAuthModalOpen(false);
    toast.success(MESSAGES.TOAST.WELCOME_USER(updated.name), {
      style: {
        background: themeMode === "dark" ? "#151c2e" : "#ffffff",
        color: themeMode === "dark" ? "#f8fafc" : "#0f172a",
      },
    });
  };

  const logout = () => {
    setUser({ ...DEFAULT_USER, isLoggedIn: false });
    toast.success(MESSAGES.TOAST.LOGOUT_SUCCESS, {
      style: {
        background: themeMode === "dark" ? "#151c2e" : "#ffffff",
        color: themeMode === "dark" ? "#f8fafc" : "#0f172a",
      },
    });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    toast.success(MESSAGES.TOAST.PROFILE_SAVED);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast(MESSAGES.TOAST.FILTERS_RESET, { icon: "🔄" });
  };

  const addEvent = async (
    data: Omit<
      EventItem,
      | "id"
      | "createdAt"
      | "distanceKm"
      | "hostName"
      | "hostAvatar"
      | "hostEmail"
    >,
  ): Promise<EventItem> => {
    const fullPayload = {
      ...data,
      hostName: user.name,
      hostAvatar: user.avatar,
      hostEmail: user.email,
    };

    const res = await eventsApi.createEvent(fullPayload);
    const newEvt = res.data;
    toast.success(MESSAGES.TOAST.EVENT_PUBLISHED_LIVE(newEvt.title));
    return newEvt;
  };

  const buyTicket = (eventId: string, quantity: number, targetEvent?: EventItem | null): Ticket | null => {
    const target = targetEvent || selectedEvent;
    if (!target) {
      toast.error(MESSAGES.TOAST.TICKET_DETAILS_UNAVAILABLE);
      return null;
    }

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
      purchaseDate: new Date().toISOString().split("T")[0],
      qrCode: `FESTEVA-${Date.now()}-PASS`,
      status: "active",
    };

    setTickets((prev) => [newTicket, ...prev]);
    toast.success(MESSAGES.TOAST.TICKET_CONFIRMED(target.title));
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
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
