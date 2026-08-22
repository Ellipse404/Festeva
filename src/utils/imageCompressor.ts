import { IMAGE_COMPRESSION } from '../constants';

/**
 * Resizes and compresses a base64 image string to specified max dimensions & quality.
 * Ideal for lightweight network transmissions and fast OCR processing.
 */
export const compressImage = (
  base64Str: string,
  maxWidth: number = IMAGE_COMPRESSION.MAX_WIDTH,
  maxHeight: number = IMAGE_COMPRESSION.MAX_HEIGHT,
  quality: number = IMAGE_COMPRESSION.QUALITY,
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};
