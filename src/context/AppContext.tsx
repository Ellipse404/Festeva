import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  EventItem,
  Ticket,
  UserProfile,
  FilterOptions,
  NavView,
  AppContextType,
  SocialProvider,
  AuthProvider,
} from "../types";
import { eventsApi } from "../api/eventsApi";
import { authApi } from "../api/authApi";
import { verificationApi } from "../api/verificationApi";
import { MESSAGES } from "../constants";
import toast, { Toaster } from "react-hot-toast";

const DEFAULT_USER: UserProfile = {
  id: "usr-guest-123",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  location: "Downtown City Center",
  isLoggedIn: false,
  isVerified: false,
  provider: "email",
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

  // Load User Profile from JWT token on initial load
  useEffect(() => {
    const token = localStorage.getItem("festeva_token");
    if (token) {
      authApi
        .getProfile()
        .then((profile) => {
          setUser({
            ...profile,
            isLoggedIn: true,
            accessToken: token,
          });
        })
        .catch(() => {
          localStorage.removeItem("festeva_token");
          setUser(DEFAULT_USER);
        });
    }
  }, []);

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

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("festeva_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("festeva_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const handleAuthSuccess = (accessToken: string, userData: any) => {
    localStorage.setItem("festeva_token", accessToken);
    const updatedUser: UserProfile = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || DEFAULT_USER.avatar,
      provider: userData.provider || "email",
      isLoggedIn: true,
      isVerified: Boolean(userData.isVerified),
      aadhaarNumber: userData.aadhaarNumber,
      accessToken,
    };
    setUser(updatedUser);
    setIsAuthModalOpen(false);
    toast.success(MESSAGES.TOAST.WELCOME_USER(updatedUser.name), {
      style: {
        background: themeMode === "dark" ? "#151c2e" : "#ffffff",
        color: themeMode === "dark" ? "#f8fafc" : "#0f172a",
      },
    });
  };

  const registerUser = async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    handleAuthSuccess(res.accessToken, res.user);
  };

  const loginUser = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    handleAuthSuccess(res.accessToken, res.user);
  };

  const loginWithGoogleToken = async (idToken: string) => {
    const res = await authApi.googleLogin(idToken);
    handleAuthSuccess(res.accessToken, res.user);
  };

  const loginWithFacebookToken = async (accessToken: string) => {
    const res = await authApi.facebookLogin(accessToken);
    handleAuthSuccess(res.accessToken, res.user);
  };

  const socialLoginUser = async (
    provider: SocialProvider,
    email: string,
    name: string,
    avatar?: string,
    providerId?: string,
  ) => {
    const res = await authApi.socialLogin(provider, email, name, avatar, providerId);
    handleAuthSuccess(res.accessToken, res.user);
  };

  const loginWithProvider = async (
    provider: AuthProvider,
    email?: string,
    name?: string,
  ) => {
    const targetProvider: SocialProvider =
      provider === "meta" ? "facebook" : provider === "email" ? "google" : (provider as SocialProvider);
    const targetEmail = email || `user.${Date.now()}@${targetProvider}.com`;
    const targetName = name || `${targetProvider.toUpperCase()} User`;

    await socialLoginUser(targetProvider, targetEmail, targetName);
  };

  const logout = () => {
    localStorage.removeItem("festeva_token");
    setUser(DEFAULT_USER);
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

  const verifyUserIdentity = async (aadhaarBase64: string, selfieBase64: string) => {
    const res = await verificationApi.verifyIdentity(aadhaarBase64, selfieBase64, user.email, user.id);
    if (res.isVerified) {
      setUser((prev) => ({
        ...prev,
        isVerified: true,
        aadhaarNumber: res.aadhaarNumber,
      }));
    }
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
        registerUser,
        loginUser,
        loginWithGoogleToken,
        loginWithFacebookToken,
        socialLoginUser,
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
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        verifyUserIdentity,
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
