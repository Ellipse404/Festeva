export interface VerificationDetails {
  verifiedAt: string;
  ocrConfidence: number;
  extractedAadhaar: string;
  qrCodeDetected: boolean;
  faceMatchScore: number;
  livenessPassed: boolean;
}

export interface VerificationResponse {
  success: boolean;
  isVerified: boolean;
  aadhaarNumber: string;
  message: string;
  details?: VerificationDetails;
}

export interface IdentityVerificationModalProps {
  open?: boolean;
  onClose?: () => void;
}
