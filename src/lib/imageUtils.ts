/**
 * Check if browser supports WebP
 */
const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL("image/webp");
    resolve(dataUrl.startsWith("data:image/webp"));
  });
};

/**
 * Get optimal image format (WebP if supported, otherwise JPEG)
 */
const getOptimalFormat = async (): Promise<{ mimeType: string; extension: string }> => {
  const webpSupported = await supportsWebP();
  return webpSupported
    ? { mimeType: "image/webp", extension: "webp" }
    : { mimeType: "image/jpeg", extension: "jpg" };
};

/**
 * Compress image progressively with multiple quality levels
 */
export const compressImageProgressive = async (
  file: File | Blob,
  targetSizeKB: number = 500,
  minQuality: number = 0.5
): Promise<{ blob: Blob; quality: number; format: string }> => {
  const format = await getOptimalFormat();
  let quality = 0.9;
  let blob = await resizeAndCompress(file, 1200, 1200, quality, format.mimeType);

  // Progressively reduce quality until target size is reached
  while (blob.size > targetSizeKB * 1024 && quality > minQuality) {
    quality -= 0.1;
    blob = await resizeAndCompress(file, 1200, 1200, quality, format.mimeType);
  }

  return { blob, quality, format: format.extension };
};

/**
 * Internal function for resizing and compressing
 */
const resizeAndCompress = (
  file: File | Blob,
  maxWidth: number,
  maxHeight: number,
  quality: number,
  mimeType: string
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not create blob"));
            }
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Resize image to maximum dimensions while maintaining aspect ratio (WebP by default)
 */
export const resizeImage = async (
  file: File | Blob,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.85
): Promise<Blob> => {
  const format = await getOptimalFormat();
  return resizeAndCompress(file, maxWidth, maxHeight, quality, format.mimeType);
};

/**
 * Create a square thumbnail from an image (WebP by default)
 */
export const createThumbnail = async (
  file: File | Blob,
  size: number = 300,
  quality: number = 0.8
): Promise<Blob> => {
  const format = await getOptimalFormat();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        
        const minDim = Math.min(width, height);
        const sx = (width - minDim) / 2;
        const sy = (height - minDim) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not create blob"));
            }
          },
          format.mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Get file extension based on format
 */
export const getImageExtension = async (): Promise<string> => {
  const format = await getOptimalFormat();
  return format.extension;
};
