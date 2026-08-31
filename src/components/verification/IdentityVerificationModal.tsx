import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { MESSAGES, FILE_CONSTRAINTS, CAMERA_CONFIG } from '../../constants';
import { IIdentityVerificationModalProps } from '../../types';
import { compressImage } from '../../utils';
import { verificationApi } from '../../api/verificationApi';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  VerifiedUser as ShieldIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckIcon,
  QrCodeScanner as QrIcon,
  Badge as BadgeIcon,
  Face as FaceIcon,
  FileUpload as UploadIcon,
  PhoneIphone as PhoneIcon,
  MarkEmailRead as OtpIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export const IdentityVerificationModal: React.FC<IIdentityVerificationModalProps> = () => {
  const {
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    verifyUserIdentity,
    updateUserProfile,
    user,
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Step 1 State: Mobile OTP Verification
  const [phoneNumber, setPhoneNumber] = useState<string>('9876543210');
  const [phoneOtp, setPhoneOtp] = useState<string>('');
  const [phoneOtpSent, setPhoneOtpSent] = useState<boolean>(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState<boolean>(false);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState<boolean>(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState<boolean>(false);
  const [phoneCountdown, setPhoneCountdown] = useState<number>(0);

  // Step 2 State: Email OTP Verification
  const [emailAddress, setEmailAddress] = useState<string>(user.email || '');
  const [emailOtp, setEmailOtp] = useState<string>('');
  const [emailOtpSent, setEmailOtpSent] = useState<boolean>(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState<boolean>(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState<boolean>(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState<boolean>(false);
  const [emailCountdown, setEmailCountdown] = useState<number>(0);

  // Step 3 & 4 State: Aadhaar Card & Selfie Capture (Optional)
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [verifiedAadhaar, setVerifiedAadhaar] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isGoogleUser = user.provider === 'google';
  const isPhoneDone = Boolean(user.isPhoneVerified || phoneOtpVerified);
  const isEmailDone = Boolean(user.isEmailVerified || isGoogleUser || emailOtpVerified);
  const isBadgeUnlocked = isPhoneDone && isEmailDone;

  // Phone OTP Countdown timer Effect
  useEffect(() => {
    let timer: any = null;
    if (phoneCountdown > 0) {
      timer = setInterval(() => {
        setPhoneCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phoneCountdown]);

  // Email OTP Countdown timer Effect
  useEffect(() => {
    let timer: any = null;
    if (emailCountdown > 0) {
      timer = setInterval(() => {
        setEmailCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [emailCountdown]);

  // Stop active camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera stream for step 3 / step 4
  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: CAMERA_CONFIG.VIDEO_WIDTH_IDEAL },
          height: { ideal: CAMERA_CONFIG.VIDEO_HEIGHT_IDEAL },
          facingMode: step === 4 ? 'user' : 'environment',
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      toast.error(MESSAGES.TOAST.CAMERA_ACCESS_ERROR);
      setCameraActive(false);
    }
  };

  // Attach media stream to video element when camera becomes active or step changes
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.warn('Camera video play error:', err);
      });
    }
  }, [cameraActive, step]);

  // Auto detect verified steps when modal opens
  useEffect(() => {
    if (isVerificationModalOpen) {
      setEmailAddress(user.email || '');

      if (user.phoneNumber) {
        const clean = user.phoneNumber.replace('+91', '').trim();
        if (clean) setPhoneNumber(clean);
      }

      const pDone = Boolean(user.isPhoneVerified || phoneOtpVerified);
      const eDone = Boolean(user.isEmailVerified || isGoogleUser || emailOtpVerified);

      if (!pDone) {
        setStep(1);
      } else if (!eDone) {
        setStep(2);
      } else {
        setStep(3); // Default to Step 3 (Aadhaar Optional) if basic verification is complete
      }
    } else {
      stopCamera();
      if (!user.isPhoneVerified) {
        setPhoneOtpSent(false);
        setPhoneOtpVerified(false);
        setPhoneOtp('');
      }
      if (!user.isEmailVerified && !isGoogleUser) {
        setEmailOtpSent(false);
        setEmailOtpVerified(false);
        setEmailOtp('');
      }
      setAadhaarImage(null);
      setSelfieImage(null);
      setIsVerifying(false);
      setVerificationSuccess(false);
    }
  }, [isVerificationModalOpen, user.isPhoneVerified, user.isEmailVerified, user.phoneNumber, user.email, isGoogleUser]);

  // Step 1: Send Mobile Phone OTP
  const handleSendPhoneOtp = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSendingPhoneOtp(true);
    try {
      await verificationApi.sendPhoneOtp(cleanPhone);
      setPhoneOtpSent(true);
      setPhoneOtp('');
      setPhoneCountdown(60);
      toast.success(MESSAGES.TOAST.OTP_SENT(cleanPhone));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send Phone OTP. Please check mobile number.');
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  // Step 1: Verify Mobile Phone OTP
  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error('Please enter the 6-digit Phone OTP code.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    setIsVerifyingPhoneOtp(true);
    try {
      const res = await verificationApi.verifyPhoneOtp(phoneNumber, phoneOtp, user.email, user.id);
      setPhoneOtpVerified(true);
      
      const newEmailVerified = Boolean(user.isEmailVerified || isGoogleUser || emailOtpVerified);
      updateUserProfile({
        isPhoneVerified: true,
        phoneNumber: `+91 ${cleanPhone}`,
        isVerified: newEmailVerified || Boolean(res.isVerified),
      });

      toast.success(MESSAGES.TOAST.OTP_VERIFIED);
      setStep(2); // Auto advance to Step 2 (Email OTP)
    } catch (err: any) {
      toast.error(err?.message || 'Invalid Phone OTP code. Please check your SMS.');
    } finally {
      setIsVerifyingPhoneOtp(false);
    }
  };

  // Step 2: Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSendingEmailOtp(true);
    try {
      await verificationApi.sendEmailOtp(emailAddress);
      setEmailOtpSent(true);
      setEmailOtp('');
      setEmailCountdown(60);
      toast.success(MESSAGES.TOAST.EMAIL_OTP_SENT(emailAddress));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send Email OTP. Please check email address.');
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  // Step 2: Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error('Please enter the 6-digit Email OTP code.');
      return;
    }

    setIsVerifyingEmailOtp(true);
    try {
      const res = await verificationApi.verifyEmailOtp(emailAddress, emailOtp, user.id);
      setEmailOtpVerified(true);
      
      const newPhoneVerified = Boolean(user.isPhoneVerified || phoneOtpVerified);
      updateUserProfile({
        isEmailVerified: true,
        email: emailAddress,
        isVerified: newPhoneVerified || Boolean(res.isVerified),
      });

      toast.success(MESSAGES.TOAST.EMAIL_OTP_VERIFIED);
      setStep(3); // Auto advance to Step 3 (Aadhaar Optional)
    } catch (err: any) {
      toast.error(err?.message || 'Invalid Email OTP code. Please check your inbox.');
    } finally {
      setIsVerifyingEmailOtp(false);
    }
  };

  // Capture photo from active camera
  const capturePhoto = async (type: 'aadhaar' | 'selfie') => {
    if (!videoRef.current || videoRef.current.videoWidth === 0) {
      toast.error(MESSAGES.TOAST.CAMERA_INITIALIZING);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const compressed = await compressImage(rawDataUrl);
      if (type === 'aadhaar') {
        setAadhaarImage(compressed);
      } else {
        setSelfieImage(compressed);
      }
      stopCamera();
    }
  };

  // Handle file uploads with 5MB restriction
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isValidExt = FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!FILE_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(fileType as any) && !isValidExt) {
      toast.error(MESSAGES.TOAST.INVALID_FILE_TYPE);
      e.target.value = '';
      return;
    }

    if (file.size > FILE_CONSTRAINTS.MAX_FILE_SIZE_BYTES) {
      toast.error(MESSAGES.TOAST.FILE_SIZE_EXCEEDED);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const rawBase64 = reader.result as string;
      const compressed = await compressImage(rawBase64);
      if (type === 'aadhaar') {
        setAadhaarImage(compressed);
      } else {
        setSelfieImage(compressed);
      }
      toast.success(MESSAGES.TOAST.IMAGE_UPLOAD_SUCCESS(type === 'aadhaar' ? 'Aadhaar Card' : 'Selfie'));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitVerification = async () => {
    if (!aadhaarImage || !selfieImage) {
      toast.error('Please capture or upload both Aadhaar card and live selfie.');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyUserIdentity(aadhaarImage, selfieImage);
      setVerificationSuccess(true);
      setVerifiedAadhaar(user.aadhaarNumber || 'XXXX XXXX 8892');
      toast.success(MESSAGES.TOAST.VERIFICATION_SUCCESS);
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setIsVerificationModalOpen(false);
  };

  return (
    <Dialog
      open={isVerificationModalOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'bg-slate-900/95 backdrop-blur-2xl border border-white/10 text-slate-100 rounded-3xl overflow-hidden',
      }}
    >
      <IconButton
        onClick={handleClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
      >
        <CloseIcon />
      </IconButton>

      <DialogContent className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Chip
            icon={<ShieldIcon style={{ width: 16, height: 16, color: '#c084fc' }} />}
            label={isBadgeUnlocked ? "Verified Account ✓" : MESSAGES.VERIFICATION.CHIP_LABEL}
            className={`font-bold mb-3 ${
              isBadgeUnlocked
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
            }`}
          />
          <Typography variant="h5" className="font-extrabold mb-1 text-white">
            {MESSAGES.VERIFICATION.TITLE}
          </Typography>
          <Typography variant="caption" className="text-slate-400">
            {MESSAGES.VERIFICATION.SUBTITLE}
          </Typography>
        </div>

        {verificationSuccess ? (
          /* Full Document Verification Success Screen */
          <div className="text-center py-4">
            <CheckIcon className="text-emerald-400 text-6xl mb-4" />
            <Typography variant="h6" className="font-extrabold mb-2 text-white">
              {MESSAGES.VERIFICATION.SUCCESS_TITLE}
            </Typography>
            <Typography variant="body2" className="text-slate-300 mb-6">
              {MESSAGES.VERIFICATION.SUCCESS_SUBTITLE}
            </Typography>

            <div className="p-4 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Status:</span>
                <Chip label="Fully Verified" size="small" color="success" className="font-bold" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Mobile Verified:</span>
                <span className="text-xs font-bold text-emerald-400">
                  {user.phoneNumber || `+91 ${phoneNumber}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Email Verified:</span>
                <span className="text-xs font-bold text-emerald-400">
                  {user.email || emailAddress}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Aadhaar Number:</span>
                <span className="text-sm font-extrabold text-white">
                  {user.aadhaarNumber || verifiedAadhaar}
                </span>
              </div>
            </div>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleClose}
              className="py-3 font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
            >
              {MESSAGES.VERIFICATION.CONTINUE_BUTTON}
            </Button>
          </div>
        ) : isVerifying ? (
          /* Processing Screen */
          <div className="text-center py-8">
            <CircularProgress size={56} className="text-purple-500 mb-6" />
            <Typography variant="h6" className="font-extrabold mb-2 text-white">
              {MESSAGES.VERIFICATION.ANALYZING_TITLE}
            </Typography>
            <Typography variant="caption" className="text-slate-300 block mb-6">
              {MESSAGES.VERIFICATION.ANALYZING_SUBTITLE}
            </Typography>

            <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
              <div className="flex items-center gap-3">
                <BadgeIcon className="text-indigo-400 text-xl" />
                <span className="text-sm text-slate-300">{MESSAGES.VERIFICATION.STEP_OCR}</span>
              </div>
              <div className="flex items-center gap-3">
                <QrIcon className="text-purple-400 text-xl" />
                <span className="text-sm text-slate-300">{MESSAGES.VERIFICATION.STEP_QR}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaceIcon className="text-pink-400 text-xl" />
                <span className="text-sm text-slate-300">{MESSAGES.VERIFICATION.STEP_FACE}</span>
              </div>
            </div>

            <LinearProgress className="mt-8 rounded-full h-1.5 bg-white/10" />
          </div>
        ) : (
          /* 4-Step Stepper Tabs */
          <div>
            <div className="grid grid-cols-4 gap-1 mb-6">
              <Button
                variant={step === 1 ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                onClick={() => {
                  stopCamera();
                  setStep(1);
                }}
                className="rounded-xl capitalize font-bold text-[10px] sm:text-xs py-2 px-1"
              >
                {MESSAGES.VERIFICATION.TAB_OTP} {isPhoneDone && '✓'}
              </Button>

              <Button
                variant={step === 2 ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                onClick={() => {
                  stopCamera();
                  setStep(2);
                }}
                className="rounded-xl capitalize font-bold text-[10px] sm:text-xs py-2 px-1"
              >
                {MESSAGES.VERIFICATION.TAB_EMAIL_OTP} {isEmailDone && '✓'}
              </Button>

              <Button
                variant={step === 3 ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                onClick={() => {
                  stopCamera();
                  setStep(3);
                }}
                className="rounded-xl capitalize font-bold text-[10px] sm:text-xs py-2 px-1"
              >
                {MESSAGES.VERIFICATION.TAB_AADHAAR} {aadhaarImage && '✓'}
              </Button>

              <Button
                variant={step === 4 ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                onClick={() => {
                  stopCamera();
                  setStep(4);
                }}
                className="rounded-xl capitalize font-bold text-[10px] sm:text-xs py-2 px-1"
              >
                {MESSAGES.VERIFICATION.TAB_SELFIE} {selfieImage && '✓'}
              </Button>
            </div>

            {/* STEP 1: MOBILE OTP VERIFICATION */}
            {step === 1 && (
              <div className="space-y-4">
                {isPhoneDone ? (
                  <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                      <CheckIcon style={{ fontSize: 32 }} />
                    </div>
                    <div>
                      <Typography variant="h6" className="font-extrabold text-white mb-1">
                        Mobile Number Verified!
                      </Typography>
                      <Typography variant="body2" className="text-emerald-300 font-extrabold">
                        {user.phoneNumber || `+91 ${phoneNumber}`}
                      </Typography>
                    </div>
                    <p className="text-xs text-slate-400">
                      Your mobile number has been authenticated via SMS OTP.
                    </p>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setStep(2)}
                      className="py-3 font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md rounded-2xl"
                    >
                      {isEmailDone ? "Proceed to Aadhaar (Optional) →" : "Proceed to Step 2 (Email OTP) →"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Typography variant="subtitle2" className="font-bold text-slate-200">
                      {MESSAGES.VERIFICATION.PHONE_LABEL}
                    </Typography>

                    <div className="flex gap-2">
                      <TextField
                        fullWidth
                        placeholder="9876543210"
                        value={phoneNumber}
                        disabled={phoneOtpSent}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <span className="text-purple-400 font-bold text-sm">+91</span>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <PhoneIcon className="text-slate-400" />
                            </InputAdornment>
                          ),
                          className: 'bg-slate-950/60 rounded-2xl text-white font-bold',
                        }}
                      />

                      <Button
                        variant="contained"
                        disabled={isSendingPhoneOtp || phoneCountdown > 0}
                        onClick={handleSendPhoneOtp}
                        className="px-5 font-extrabold whitespace-nowrap bg-purple-600 hover:bg-purple-700 rounded-2xl"
                      >
                        {isSendingPhoneOtp ? (
                          <CircularProgress size={20} className="text-white" />
                        ) : phoneCountdown > 0 ? (
                          `${phoneCountdown}s`
                        ) : (
                          MESSAGES.VERIFICATION.SEND_OTP_BTN
                        )}
                      </Button>
                    </div>

                    {phoneOtpSent && (
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                        <Typography variant="caption" className="block text-slate-300 font-medium">
                          {MESSAGES.VERIFICATION.OTP_INPUT_LABEL}
                        </Typography>

                        <TextField
                          fullWidth
                          placeholder="Enter 6-digit OTP"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: 8, fontSize: 20 } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <OtpIcon className="text-purple-400" />
                              </InputAdornment>
                            ),
                            className: 'bg-slate-950/80 rounded-2xl text-white font-extrabold',
                          }}
                        />

                        <Button
                          variant="contained"
                          fullWidth
                          disabled={isVerifyingPhoneOtp || phoneOtp.length !== 6}
                          onClick={handleVerifyPhoneOtp}
                          className="py-3 font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md rounded-2xl"
                        >
                          {isVerifyingPhoneOtp ? <CircularProgress size={24} className="text-white" /> : MESSAGES.VERIFICATION.VERIFY_OTP_BTN}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: EMAIL OTP VERIFICATION */}
            {step === 2 && (
              <div className="space-y-4">
                {isEmailDone ? (
                  <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                      <CheckIcon style={{ fontSize: 32 }} />
                    </div>
                    <div>
                      <Typography variant="h6" className="font-extrabold text-white mb-1">
                        Email Address Verified!
                      </Typography>
                      <Typography variant="body2" className="text-emerald-300 font-extrabold">
                        {user.email || emailAddress}
                      </Typography>
                    </div>
                    <p className="text-xs text-slate-400">
                      {isGoogleUser
                        ? 'Google OAuth login accounts are automatically email verified.'
                        : 'Your email address has been authenticated via Resend Email OTP.'}
                    </p>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setStep(3)}
                      className="py-3 font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md rounded-2xl"
                    >
                      Proceed to Aadhaar (Optional) →
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Typography variant="subtitle2" className="font-bold text-slate-200">
                      {MESSAGES.VERIFICATION.EMAIL_LABEL}
                    </Typography>

                    <div className="flex gap-2">
                      <TextField
                        fullWidth
                        placeholder="you@example.com"
                        value={emailAddress}
                        disabled={emailOtpSent}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon className="text-purple-400" />
                            </InputAdornment>
                          ),
                          className: 'bg-slate-950/60 rounded-2xl text-white font-bold',
                        }}
                      />

                      <Button
                        variant="contained"
                        disabled={isSendingEmailOtp || emailCountdown > 0}
                        onClick={handleSendEmailOtp}
                        className="px-4 font-extrabold whitespace-nowrap bg-purple-600 hover:bg-purple-700 rounded-2xl text-xs"
                      >
                        {isSendingEmailOtp ? (
                          <CircularProgress size={20} className="text-white" />
                        ) : emailCountdown > 0 ? (
                          `${emailCountdown}s`
                        ) : (
                          MESSAGES.VERIFICATION.SEND_EMAIL_OTP_BTN
                        )}
                      </Button>
                    </div>

                    {emailOtpSent && (
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                        <Typography variant="caption" className="block text-slate-300 font-medium">
                          {MESSAGES.VERIFICATION.OTP_INPUT_LABEL}
                        </Typography>

                        <TextField
                          fullWidth
                          placeholder="Enter 6-digit Email OTP"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: 8, fontSize: 20 } }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <OtpIcon className="text-purple-400" />
                              </InputAdornment>
                            ),
                            className: 'bg-slate-950/80 rounded-2xl text-white font-extrabold',
                          }}
                        />

                        <Button
                          variant="contained"
                          fullWidth
                          disabled={isVerifyingEmailOtp || emailOtp.length !== 6}
                          onClick={handleVerifyEmailOtp}
                          className="py-3 font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md rounded-2xl"
                        >
                          {isVerifyingEmailOtp ? <CircularProgress size={24} className="text-white" /> : MESSAGES.VERIFICATION.VERIFY_EMAIL_OTP_BTN}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: AADHAAR CARD CAPTURE (OPTIONAL) */}
            {step === 3 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="subtitle2" className="font-bold text-slate-200">
                    {MESSAGES.VERIFICATION.AADHAAR_LABEL}
                  </Typography>
                  <Chip label="Optional" size="small" className="bg-slate-800 text-slate-400 font-bold" />
                </div>

                {aadhaarImage ? (
                  <div className="text-center mb-4">
                    <img
                      src={aadhaarImage}
                      alt="Aadhaar Preview"
                      className="w-full max-h-52 object-contain rounded-2xl border-2 border-purple-500 mb-3"
                    />
                    <Button size="small" onClick={() => setAadhaarImage(null)} className="text-pink-400 hover:text-pink-300">
                      Retake / Re-upload
                    </Button>
                  </div>
                ) : (
                  <div className="mb-4">
                    {cameraActive ? (
                      <div className="relative w-full rounded-2xl overflow-hidden mb-3 bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-56 object-cover"
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => capturePhoto('aadhaar')}
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 font-bold shadow-lg"
                        >
                          Capture Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-2xl border-2 border-dashed border-white/20 bg-slate-950/60 mb-4">
                        <BadgeIcon className="text-5xl text-purple-400 mb-2" />
                        <p className="text-sm text-slate-300 mb-1">
                          {MESSAGES.VERIFICATION.AADHAAR_INSTRUCTIONS}
                        </p>
                        <p className="text-xs text-slate-400 mb-4">
                          {MESSAGES.VERIFICATION.FORMAT_SUBTITLE}
                        </p>
                        <div className="flex justify-center gap-3">
                          <Button variant="contained" startIcon={<CameraIcon />} onClick={startCamera} className="font-bold">
                            Open Camera
                          </Button>
                          <Button variant="outlined" startIcon={<UploadIcon />} component="label" className="font-bold">
                            Upload File
                            <input
                              type="file"
                              accept={FILE_CONSTRAINTS.ACCEPT_ATTRIBUTE}
                              hidden
                              onChange={(e) => handleFileUpload(e, 'aadhaar')}
                            />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      stopCamera();
                      setStep(4);
                    }}
                    className="py-3 font-bold text-slate-400 border-white/20"
                  >
                    Skip Aadhaar →
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!aadhaarImage}
                    onClick={() => {
                      stopCamera();
                      setStep(4);
                    }}
                    className="py-3 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                  >
                    Next: Live Selfie →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: LIVE SELFIE CAPTURE (OPTIONAL) */}
            {step === 4 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="subtitle2" className="font-bold text-slate-200">
                    {MESSAGES.VERIFICATION.SELFIE_LABEL}
                  </Typography>
                  <Chip label="Optional" size="small" className="bg-slate-800 text-slate-400 font-bold" />
                </div>

                {selfieImage ? (
                  <div className="text-center mb-4">
                    <img
                      src={selfieImage}
                      alt="Selfie Preview"
                      className="w-44 h-44 object-cover rounded-full border-4 border-pink-500 mx-auto mb-3 shadow-lg"
                    />
                    <Button size="small" onClick={() => setSelfieImage(null)} className="text-pink-400 hover:text-pink-300">
                      Retake / Re-upload
                    </Button>
                  </div>
                ) : (
                  <div className="mb-4">
                    {cameraActive ? (
                      <div className="relative w-full rounded-2xl overflow-hidden mb-3 bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-60 object-cover"
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => capturePhoto('selfie')}
                          className="absolute bottom-3 left-1/2 -translate-x-1/2 font-bold shadow-lg"
                        >
                          Capture Selfie
                        </Button>
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-2xl border-2 border-dashed border-white/20 bg-slate-950/60 mb-4">
                        <FaceIcon className="text-5xl text-pink-400 mb-2" />
                        <p className="text-sm text-slate-300 mb-1">
                          {MESSAGES.VERIFICATION.SELFIE_INSTRUCTIONS}
                        </p>
                        <p className="text-xs text-slate-400 mb-4">
                          {MESSAGES.VERIFICATION.FORMAT_SUBTITLE}
                        </p>
                        <div className="flex justify-center gap-3">
                          <Button variant="contained" startIcon={<CameraIcon />} onClick={startCamera} className="font-bold">
                            Open Camera
                          </Button>
                          <Button variant="outlined" startIcon={<UploadIcon />} component="label" className="font-bold">
                            Upload File
                            <input
                              type="file"
                              accept={FILE_CONSTRAINTS.ACCEPT_ATTRIBUTE}
                              hidden
                              onChange={(e) => handleFileUpload(e, 'selfie')}
                            />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {aadhaarImage && selfieImage ? (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmitVerification}
                    className="py-3 font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 shadow-xl"
                  >
                    {MESSAGES.VERIFICATION.SUBMIT_VERIFY}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleClose}
                    className="py-3 font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl"
                  >
                    Done & Close
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
