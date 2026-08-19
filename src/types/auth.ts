import { SocialProvider, AuthMode } from './user';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider?: string;
    role?: string;
    createdAt?: string;
  };
}

export interface AuthFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
  initialMode?: AuthMode;
}
