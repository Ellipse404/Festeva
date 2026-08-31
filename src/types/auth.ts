import { SocialProvider, AuthMode } from './user';

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider?: string;
    role?: string;
    createdAt?: string;
    isVerified?: boolean;
    aadhaarNumber?: string;
  };
}

export interface IAuthFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
  initialMode?: AuthMode;
}
