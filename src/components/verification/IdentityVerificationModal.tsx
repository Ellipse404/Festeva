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
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Step 2 & 3 State: Aadhaar Card & Selfie Capture
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [verifiedAadhaar, setVerifiedAadhaar] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // OTP Countdown timer Effect
  useEffect(() => {
    let timer: any = null;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  // Stop active camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera stream for step 2 / step 3
  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: CAMERA_CONFIG.VIDEO_WIDTH_IDEAL },
          height: { ideal: CAMERA_CONFIG.VIDEO_HEIGHT_IDEAL },
          facingMode: step === 3 ? 'user' : 'environment',
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

  // Auto detect if phone is already verified when modal opens
  useEffect(() => {
    if (isVerificationModalOpen) {
      const isPhoneAlreadyVerified = Boolean(user.isPhoneVerified || otpVerified);
      if (user.phoneNumber) {
        const clean = user.phoneNumber.replace('+91', '').trim();
        if (clean) setPhoneNumber(clean);
      }

      if (isPhoneAlreadyVerified) {
        setOtpVerified(true);
        setStep(2);
      } else {
        setStep(1);
      }
    } else {
      stopCamera();
      if (!user.isPhoneVerified) {
        setStep(1);
        setOtpSent(false);
        setOtpVerified(false);
        setOtp('');
      }
      setAadhaarImage(null);
      setSelfieImage(null);
      setIsVerifying(false);
      setVerificationSuccess(false);
    }
  }, [isVerificationModalOpen, user.isPhoneVerified, user.phoneNumber]);

  // Step 1: Send OTP handler
  const handleSendOtp = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSendingOtp(true);
    try {
      await verificationApi.sendPhoneOtp(cleanPhone);
      setOtpSent(true);
      setOtp('');
      setCountdown(60);
      toast.success(MESSAGES.TOAST.OTP_SENT(cleanPhone));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send OTP. Please check mobile number.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 1: Verify OTP handler
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code sent to your phone.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    setIsVerifyingOtp(true);
    try {
      await verificationApi.verifyPhoneOtp(phoneNumber, otp, user.email, user.id);
      setOtpVerified(true);
      
      // Update persistent user profile in AppContext
      updateUserProfile({
        isPhoneVerified: true,
        phoneNumber: `+91 ${cleanPhone}`,
      });

      toast.success(MESSAGES.TOAST.OTP_VERIFIED);
      setStep(2); // Auto advance to Step 2 (Aadhaar Card)
    } catch (err: any) {
      toast.error(err?.message || 'Invalid OTP code entered. Please check your SMS.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Capture frame from active video element
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

  const isPhoneDone = Boolean(user.isPhoneVerified || otpVerified);

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
            label={MESSAGES.VERIFICATION.CHIP_LABEL}
            className="bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold mb-3"
          />
          <Typography variant="h5" className="font-extrabold mb-1 text-white">
            {MESSAGES.VERIFICATION.TITLE}
          </Typography>
          <Typography variant="caption" className="text-slate-400">
            {MESSAGES.VERIFICATION.SUBTITLE}
          </Typography>
        </div>

        {verificationSuccess ? (
          /* Verification Success Screen */
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
                <Chip label="Verified" size="small" color="success" className="font-bold" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Mobile Verified:</span>
                <span className="text-xs font-bold text-emerald-400">
                  {user.phoneNumber || `+91 ${phoneNumber}`}
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
          /* Scanning & Processing Screen */
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
          /* 3-Step Stepper Tabs */
          <div>
            <div className="grid grid-cols-3 gap-1.5 mb-6">
              <Button
                variant={step === 1 ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                onClick={() => {
                  stopCamera();
                  setStep(1);
                }}
                className="rounded-xl capitalize font-bold text-xs py-2"
              >
                {MESSAGES.VERIFICATION.TAB_OTP} {isPhoneDone && '✓'}
              </Button>
              <Button
                variant={step === 2 ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                disabled={!isPhoneDone}
                onClick={() => {
                  stopCamera();
                  setStep(2);
                }}
                className="rounded-xl capitalize font-bold text-xs py-2"
              >
                {MESSAGES.VERIFICATION.TAB_AADHAAR} {aadhaarImage && '✓'}
              </Button>
              <Button
                variant={step === 3 ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                disabled={!isPhoneDone || !aadhaarImage}
                onClick={() => {
                  stopCamera();
                  setStep(3);
                }}
                className="rounded-xl capitalize font-bold text-xs py-2"
              >
                {MESSAGES.VERIFICATION.TAB_SELFIE} {selfieImage && '✓'}
              </Button>
            </div>

            {/* STEP 1: MOBILE OTP VERIFICATION */}
            {step === 1 && (
              <div className="space-y-4">
                {isPhoneDone ? (
                  /* Verified Phone UI State */
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
                      Your mobile number has been authenticated via OTP. You can proceed directly to Aadhaar Card verification.
                    </p>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setStep(2)}
                      className="py-3 font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md rounded-2xl"
                    >
                      Proceed to Step 2 (Aadhaar Card) →
                    </Button>
                  </div>
                ) : (
                  /* Unverified Phone Input & OTP Verification Controls */
                  <div className="space-y-4">
                    <Typography variant="subtitle2" className="font-bold text-slate-200">
                      {MESSAGES.VERIFICATION.PHONE_LABEL}
                    </Typography>

                    <div className="flex gap-2">
                      <TextField
                        fullWidth
                        placeholder="9876543210"
                        value={phoneNumber}
                        disabled={otpSent}
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
                        disabled={isSendingOtp || countdown > 0}
                        onClick={handleSendOtp}
                        className="px-5 font-extrabold whitespace-nowrap bg-purple-600 hover:bg-purple-700 rounded-2xl"
                      >
                        {isSendingOtp ? (
                          <CircularProgress size={20} className="text-white" />
                        ) : countdown > 0 ? (
                          `${countdown}s`
                        ) : (
                          MESSAGES.VERIFICATION.SEND_OTP_BTN
                        )}
                      </Button>
                    </div>

                    {otpSent && (
                      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                        <Typography variant="caption" className="block text-slate-300 font-medium">
                          {MESSAGES.VERIFICATION.OTP_INPUT_LABEL}
                        </Typography>

                        <TextField
                          fullWidth
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
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
                          disabled={isVerifyingOtp || otp.length !== 6}
                          onClick={handleVerifyOtp}
                          className="py-3 font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md rounded-2xl"
                        >
                          {isVerifyingOtp ? <CircularProgress size={24} className="text-white" /> : MESSAGES.VERIFICATION.VERIFY_OTP_BTN}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: AADHAAR CARD CAPTURE */}
            {step === 2 && (
              <div>
                <Typography variant="subtitle2" className="font-bold mb-2 text-slate-200">
                  {MESSAGES.VERIFICATION.AADHAAR_LABEL}
                </Typography>

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

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!aadhaarImage}
                  onClick={() => {
                    stopCamera();
                    setStep(3);
                  }}
                  className="py-3 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                >
                  {MESSAGES.VERIFICATION.NEXT_SELFIE}
                </Button>
              </div>
            )}

            {/* STEP 3: LIVE SELFIE CAPTURE */}
            {step === 3 && (
              <div>
                <Typography variant="subtitle2" className="font-bold mb-2 text-slate-200">
                  {MESSAGES.VERIFICATION.SELFIE_LABEL}
                </Typography>

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

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!aadhaarImage || !selfieImage}
                  onClick={handleSubmitVerification}
                  className="py-3 font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 shadow-xl"
                >
                  {MESSAGES.VERIFICATION.SUBMIT_VERIFY}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
