export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  IMAGE_URL: /\.(jpeg|jpg|gif|png|webp|svg)$/i,
  UNDERSCORE_GLOBAL: /_/g,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  DIGITS_ONLY: /^\d+$/,
} as const;
