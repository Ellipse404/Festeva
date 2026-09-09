import { axiosClient } from '../config';
import { IUserProfile, IAuthResponse, SocialProvider } from '../types';
import { ENDPOINTS } from '../constants';

export const authApi = {
  async register(name: string, email: string, password: string): Promise<IAuthResponse> {
    const response = await axiosClient.post<IAuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<IAuthResponse> {
    const response = await axiosClient.post<IAuthResponse>(ENDPOINTS.AUTH.LOGIN, {
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
  ): Promise<IAuthResponse> {
    const response = await axiosClient.post<IAuthResponse>(ENDPOINTS.AUTH.SOCIAL_LOGIN, {
      provider,
      email,
      name,
      avatar,
      providerId: providerId || `soc-${provider}-${Date.now()}`,
    });
    return response.data;
  },

  async googleLogin(idToken: string): Promise<IAuthResponse> {
    const response = await axiosClient.post<IAuthResponse>(ENDPOINTS.AUTH.GOOGLE, {
      idToken,
    });
    return response.data;
  },

  async facebookLogin(accessToken: string): Promise<IAuthResponse> {
    const response = await axiosClient.post<IAuthResponse>(ENDPOINTS.AUTH.FACEBOOK, {
      accessToken,
    });
    return response.data;
  },

  async getProfile(): Promise<IUserProfile> {
    const response = await axiosClient.get<IUserProfile>(ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
