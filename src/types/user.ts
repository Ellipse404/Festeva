export type AuthProvider = 'google' | 'meta' | 'email';
export type AuthMode = 'login' | 'register' | 'forgot';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location: string;
  isLoggedIn: boolean;
  provider?: AuthProvider;
}
