import { axiosClient } from '../config';
import { IVerificationResponse, IOtpResponse } from '../types';
import { ENDPOINTS } from '../constants';

export const verificationApi = {
  /**
   * Send 6-digit OTP to mobile phone number
   */
  async sendPhoneOtp(phoneNumber: string): Promise<IOtpResponse> {
    const response = await axiosClient.post<IOtpResponse>(
      ENDPOINTS.VERIFICATION.SEND_OTP,
      { phoneNumber },
    );
    return response.data;
  },

  /**
   * Verify 6-digit OTP entered by user and persist phone verification in DB
   */
  async verifyPhoneOtp(
    phoneNumber: string,
    otp: string,
    userEmail?: string,
    userId?: string,
  ): Promise<IOtpResponse> {
    const response = await axiosClient.post<IOtpResponse>(
      ENDPOINTS.VERIFICATION.VERIFY_OTP,
      { phoneNumber, otp, userEmail, userId },
    );
    return response.data;
  },

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
