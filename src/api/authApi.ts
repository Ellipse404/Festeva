import { axiosClient } from '../config';
import { UserProfile, AuthResponse, SocialProvider } from '../types';

export const authApi = {

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },


  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },


  async socialLogin(
    provider: SocialProvider,
    email: string,
    name: string,
    avatar?: string,
    providerId?: string,
  ): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/social-login', {
      provider,
      email,
      name,
      avatar,
      providerId: providerId || `soc-${provider}-${Date.now()}`,
    });
    return response.data;
  },

 
  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/google', {
      idToken,
    });
    return response.data;
  },


  async facebookLogin(accessToken: string): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/facebook', {
      accessToken,
    });
    return response.data;
  },

  
  async getProfile(): Promise<UserProfile> {
    const response = await axiosClient.get<UserProfile>('/auth/me');
    return response.data;
  },
};
