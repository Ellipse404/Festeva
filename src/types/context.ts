import { IUserProfile, AuthProvider, SocialProvider } from "./user";
import { IEventItem, IFilterOptions } from "./events";
import { ITicket } from "./tickets";
import { NavView } from "./index";

export interface IAppContextType {
  themeMode: "light" | "dark";
  toggleTheme: () => void;

  user: IUserProfile;
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
  updateUserProfile: (updates: Partial<IUserProfile>) => void;

  addEvent: (
    eventData: Omit<
      IEventItem,
      | "id"
      | "createdAt"
      | "distanceKm"
      | "hostName"
      | "hostAvatar"
      | "hostEmail"
    >,
  ) => Promise<IEventItem>;

  tickets: ITicket[];
  buyTicket: (
    eventId: string,
    quantity: number,
    targetEvent?: IEventItem | null,
  ) => ITicket | null;

  activeNav: NavView;
  setActiveNav: (nav: NavView) => void;

  filters: IFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<IFilterOptions>>;
  resetFilters: () => void;

  selectedEvent: IEventItem | null;
  setSelectedEvent: (event: IEventItem | null) => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "register" | "forgot";
  setAuthModalMode: (mode: "login" | "register" | "forgot") => void;

  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  verifyUserIdentity: (aadhaarBase64: string, selfieBase64: string) => Promise<void>;
}
