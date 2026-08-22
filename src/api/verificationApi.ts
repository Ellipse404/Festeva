import { axiosClient } from '../config';
import { IVerificationResponse } from '../types';
import { ENDPOINTS } from '../constants';

export const verificationApi = {
  /**
   * Verify identity by uploading Aadhaar Card image and Live Selfie image
   */
  async verifyIdentity(
    aadhaarImage: string,
    selfieImage: string,
    userEmail?: string,
    userId?: string,
  ): Promise<IVerificationResponse> {
    const response = await axiosClient.post<IVerificationResponse>(
      ENDPOINTS.VERIFICATION.VERIFY,
      {
        aadhaarImage,
        selfieImage,
        userEmail,
        userId,
      },
    );
    return response.data;
  },
};
