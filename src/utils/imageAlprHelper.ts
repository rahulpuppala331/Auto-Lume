/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoundingBox } from '../types';

/**
 * Extracts the real rectangular plate region from the user's uploaded vehicle photo
 * using high-resolution HTML5 Canvas with bilinear interpolation.
 */
export async function cropPlateFromImage(
  imageSrc: string,
  bbox: BoundingBox
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const nw = img.naturalWidth || 800;
        const nh = img.naturalHeight || 500;

        // Calculate pixel crop coordinates
        const cropX = Math.max(0, (bbox.x / 100) * nw);
        const cropY = Math.max(0, (bbox.y / 100) * nh);
        const cropW = Math.max(10, Math.min(nw - cropX, (bbox.width / 100) * nw));
        const cropH = Math.max(10, Math.min(nh - cropY, (bbox.height / 100) * nh));

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(cropW);
        canvas.height = Math.round(cropH);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve('');
          return;
        }

        // Draw the exact slice from the user's uploaded image
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

        // Apply contrast normalization for crisp plate visibility
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.25 + 128));
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.25 + 128));
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.25 + 128));
        }
        ctx.putImageData(imgData, 0, 0);

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      } catch (e) {
        console.warn('cropPlateFromImage canvas warning:', e);
        resolve('');
      }
    };

    img.onerror = () => resolve('');
    img.src = imageSrc;
  });
}

/**
 * Computes an OpenCV-style Canny edge detection / binarized mask
 * directly on the user's uploaded vehicle photo.
 */
export async function generateEdgeMaskFromImage(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 480;
        const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        // Grayscale conversion
        const gray = new Uint8Array(w * h);
        for (let i = 0; i < gray.length; i++) {
          const idx = i * 4;
          gray[i] = Math.round(0.299 * d[idx] + 0.587 * d[idx + 1] + 0.114 * d[idx + 2]);
        }

        // Simple Sobel edge mask
        const edges = new Uint8Array(w * h);
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;
            const gx =
              -gray[idx - w - 1] +
              gray[idx - w + 1] -
              2 * gray[idx - 1] +
              2 * gray[idx + 1] -
              gray[idx + w - 1] +
              gray[idx + w + 1];
            const gy =
              -gray[idx - w - 1] -
              2 * gray[idx - w] -
              gray[idx - w + 1] +
              gray[idx + w - 1] +
              2 * gray[idx + w] +
              gray[idx + w + 1];
            const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));
            edges[idx] = mag > 45 ? 255 : 0;
          }
        }

        // Render edges to canvas (green neon / cyan edge on dark background)
        for (let i = 0; i < edges.length; i++) {
          const idx = i * 4;
          const val = edges[i];
          if (val > 0) {
            d[idx] = 16;
            d[idx + 1] = 185;
            d[idx + 2] = 129;
            d[idx + 3] = 255;
          } else {
            d[idx] = 10;
            d[idx + 1] = 15;
            d[idx + 2] = 25;
            d[idx + 3] = 255;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn('generateEdgeMaskFromImage warning:', e);
        resolve('');
      }
    };

    img.onerror = () => resolve('');
    img.src = imageSrc;
  });
}
