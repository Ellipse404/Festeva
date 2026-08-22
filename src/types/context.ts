import { UserProfile, AuthProvider, SocialProvider } from "./user";
import { EventItem, FilterOptions } from "./events";
import { Ticket } from "./tickets";
import { NavView } from "./index";

export interface AppContextType {
  themeMode: "light" | "dark";
  toggleTheme: () => void;

  user: UserProfile;
  loginWithProvider: (
    provider: AuthProvider,
    email?: string,
    name?: string,
  ) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  loginWithGoogleToken: (idToken: string) => Promise<void>;
  loginWithFacebookToken: (accessToken: string) => Promise<void>;
  socialLoginUser: (
    provider: SocialProvider,
    email: string,
    name: string,
    avatar?: string,
    providerId?: string,
  ) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  addEvent: (
    eventData: Omit<
      EventItem,
      | "id"
      | "createdAt"
      | "distanceKm"
      | "hostName"
      | "hostAvatar"
      | "hostEmail"
    >,
  ) => Promise<EventItem>;

  tickets: Ticket[];
  buyTicket: (
    eventId: string,
    quantity: number,
    targetEvent?: EventItem | null,
  ) => Ticket | null;

  activeNav: NavView;
  setActiveNav: (nav: NavView) => void;

  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;

  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "register" | "forgot";
  setAuthModalMode: (mode: "login" | "register" | "forgot") => void;

  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  verifyUserIdentity: (aadhaarBase64: string, selfieBase64: string) => Promise<void>;
}
