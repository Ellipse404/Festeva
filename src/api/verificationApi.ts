import { axiosClient } from '../config';
import { VerificationResponse } from '../types';

export const verificationApi = {

  async verifyIdentity(
    aadhaarImage: string,
    selfieImage: string,
    userEmail?: string,
    userId?: string,
  ): Promise<VerificationResponse> {
    const token = localStorage.getItem('festeva_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axiosClient.post<VerificationResponse>(
      '/verification/verify-identity',
      {
        aadhaarImage,
        selfieImage,
        userEmail,
        userId,
      },
      { headers },
    );
    return response.data;
  },
};
