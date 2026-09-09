import { IEventItem } from './events';

export interface IHeaderProps {
  sidebarCollapsed: boolean;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export interface ISidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export interface IEventCardProps {
  event: IEventItem;
}

export interface IDashboardProps {
  isFilterOpen: boolean;
}

export interface IBadgeProps {
  type: 'distance' | 'category' | 'price';
  value: string | number;
  paid?: boolean;
}

export interface IVerifiedBadgeProps {
  size?: number;
  title?: string;
  className?: string;
}

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'host' | 'attend' | 'chip' | 'social' | 'close';
  children: React.ReactNode;
}

export interface IAppRoutesProps {
  isFilterOpen: boolean;
}

export interface IDashboardPageProps {
  isFilterOpen: boolean;
}

export interface IThemeContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}
