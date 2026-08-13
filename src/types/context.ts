import { UserProfile } from "./user";
import { EventItem, FilterOptions } from "./events";
import { Ticket } from "./tickets";
import { NavView } from "./index";

export interface AppContextType {
  themeMode: "light" | "dark";
  toggleTheme: () => void;

  user: UserProfile;
  loginWithProvider: (
    provider: "google" | "meta" | "email",
    email?: string,
    name?: string,
  ) => void;
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
}
