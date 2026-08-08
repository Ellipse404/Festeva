import { EventItem } from './events';
import { NavView } from './index';

export interface HeaderProps {
  sidebarCollapsed: boolean;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export interface EventCardProps {
  event: EventItem;
}

export interface DashboardProps {
  isFilterOpen: boolean;
}

export interface BadgeProps {
  type: 'distance' | 'category' | 'price';
  value: string | number;
  paid?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'host' | 'attend' | 'chip' | 'social' | 'close';
  children: React.ReactNode;
}

export interface AppRoutesProps {
  isFilterOpen: boolean;
}

export interface DashboardPageProps {
  isFilterOpen: boolean;
}

export interface ThemeContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}
