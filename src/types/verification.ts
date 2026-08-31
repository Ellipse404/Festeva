export interface IVerificationDetails {
  verifiedAt: string;
  ocrConfidence: number;
  extractedAadhaar: string;
  qrCodeDetected: boolean;
  faceMatchScore: number;
  livenessPassed: boolean;
}

export interface IVerificationResponse {
  success: boolean;
  isVerified: boolean;
  aadhaarNumber: string;
  message: string;
  details?: IVerificationDetails;
}

export interface IOtpResponse {
  success: boolean;
  message: string;
  expiresInSec?: number;
  demoOtp?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  isVerified?: boolean;
  phoneNumber?: string;
  email?: string;
}

export interface IIdentityVerificationModalProps {
  open?: boolean;
  onClose?: () => void;
}
