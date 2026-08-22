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

export interface IIdentityVerificationModalProps {
  open?: boolean;
  onClose?: () => void;
}
