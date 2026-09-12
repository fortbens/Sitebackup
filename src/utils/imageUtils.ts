/**
 * Utility functions for image handling, client-side compression and resizing
 * Prevents exceeding localStorage quota (~5MB) and avoids UI freeze.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export const compressImage = (
  file: File,
  options: CompressOptions = {}
): Promise<string> => {
  const {
    maxWidth = 600,
    maxHeight = 600,
    quality = 0.85,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    // If not an image file, fail fast
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Erro ao ler o arquivo de imagem.'));
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Proportionally constrain dimensions to maxWidth x maxHeight
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original Base64 if canvas is unsupported
            resolve(result);
            return;
          }

          // If JPEG, fill white background to prevent black background on transparent PNGs
          if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          // Draw the resized image with smooth bilinear interpolation
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Generate compressed data URL
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Fallback: falha ao processar canvas, usando imagem original', err);
          resolve(result);
        }
      };

      img.onerror = () => {
        reject(new Error('Não foi possível carregar a imagem para processamento.'));
      };

      img.src = result;
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};
