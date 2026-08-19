export enum SocialProviderEnum {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GMAIL = 'gmail',
}

export type SocialProvider = 'google' | 'facebook' | 'gmail';
export type AuthProvider = SocialProvider | 'meta' | 'email';
export type AuthMode = 'login' | 'register' | 'forgot';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location?: string;
  isLoggedIn: boolean;
  provider?: AuthProvider;
  providerId?: string;
  accessToken?: string;
  role?: string;
}
