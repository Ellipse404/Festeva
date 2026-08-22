import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { MESSAGES, FILE_CONSTRAINTS, CAMERA_CONFIG } from '../../constants';
import { IIdentityVerificationModalProps } from '../../types';
import { compressImage } from '../../utils';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
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
} from '@mui/icons-material';
import toast from 'react-hot-toast';

export const IdentityVerificationModal: React.FC<IIdentityVerificationModalProps> = () => {
  const {
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    verifyUserIdentity,
    user,
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [verifiedAadhaar, setVerifiedAadhaar] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop active camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Start camera stream
  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: CAMERA_CONFIG.VIDEO_WIDTH_IDEAL },
          height: { ideal: CAMERA_CONFIG.VIDEO_HEIGHT_IDEAL },
          facingMode: step === 2 ? 'user' : 'environment',
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

  // Clean up stream when modal closes
  useEffect(() => {
    if (!isVerificationModalOpen) {
      stopCamera();
      setStep(1);
      setAadhaarImage(null);
      setSelfieImage(null);
      setIsVerifying(false);
      setVerificationSuccess(false);
    }
  }, [isVerificationModalOpen]);

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

  // Handle file uploads with 5MB & JPG/JPEG/PNG restriction + automatic image compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate File Type (JPG, JPEG, PNG only)
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isValidExt = FILE_CONSTRAINTS.ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!FILE_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(fileType as any) && !isValidExt) {
      toast.error(MESSAGES.TOAST.INVALID_FILE_TYPE);
      e.target.value = '';
      return;
    }

    // 2. Validate File Size (Maximum 5MB)
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
          /* Step 4: Verification Success Screen */
          <div className="text-center py-4">
            <CheckIcon className="text-emerald-400 text-6xl mb-4" />
            <Typography variant="h6" className="font-extrabold mb-2 text-white">
              {MESSAGES.VERIFICATION.SUCCESS_TITLE}
            </Typography>
            <Typography variant="body2" className="text-slate-300 mb-6">
              {MESSAGES.VERIFICATION.SUCCESS_SUBTITLE}
            </Typography>

            <div className="p-4 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">Status:</span>
                <Chip label="Verified" size="small" color="success" className="font-bold" />
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
          /* Step 3: Real-Time Scanning & Processing Screen */
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
          /* Step 1 & 2: Interactive Camera / Upload Capture */
          <div>
            {/* Step Stepper Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={step === 1 ? 'contained' : 'outlined'}
                color="secondary"
                fullWidth
                onClick={() => {
                  stopCamera();
                  setStep(1);
                }}
                className="rounded-xl capitalize font-bold py-2"
              >
                {MESSAGES.VERIFICATION.TAB_AADHAAR}
              </Button>
              <Button
                variant={step === 2 ? 'contained' : 'outlined'}
                color="secondary"
                fullWidth
                onClick={() => {
                  stopCamera();
                  setStep(2);
                }}
                className="rounded-xl capitalize font-bold py-2"
              >
                {MESSAGES.VERIFICATION.TAB_SELFIE}
              </Button>
            </div>

            {step === 1 ? (
              /* Step 1: Aadhaar Card Capture */
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
                    setStep(2);
                  }}
                  className="py-3 font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
                >
                  {MESSAGES.VERIFICATION.NEXT_SELFIE}
                </Button>
              </div>
            ) : (
              /* Step 2: Live Selfie Capture */
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
