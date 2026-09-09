/**
 * Centralized Application Common Constants
 */

export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB limit
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png'] as const,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png'] as const,
  ACCEPT_ATTRIBUTE: '.jpg,.jpeg,.png,image/jpeg,image/png',
} as const;

export const IMAGE_COMPRESSION = {
  MAX_WIDTH: 1280,
  MAX_HEIGHT: 1280,
  QUALITY: 0.82,
} as const;

export const CAMERA_CONFIG = {
  VIDEO_WIDTH_IDEAL: 1280,
  VIDEO_HEIGHT_IDEAL: 720,
} as const;
