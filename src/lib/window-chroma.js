/**
 * Window Chroma-Keying & Feathered Edge Processing
 * Detects green screen background in airplane window artwork and replaces with transparency
 */

export const isGreenChroma = (r, g, b) => g > 110 && g - r > 55 && g - b > 55;
export const clampColor = (val) => (val < 0 ? 0 : val > 255 ? 255 : val);

export async function renderWindowCanvas(imageSrc, canvas, maxResolution = 2752) {
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.decoding = 'async';
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Window image could not be loaded'));
      i.src = imageSrc;
    });

    const scale = Math.min(1, maxResolution / img.naturalWidth);
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const visited = new Uint8Array(width * height);
    const midY = Math.round(0.5 * height);
    const midX = Math.round(0.5 * width);

    // Find starting green pixel near center
    let seedIndex = -1;
    for (let offset = 0; offset < width / 4 && seedIndex < 0; offset += 1) {
      for (const x of [midX + offset, midX - offset]) {
        const pixelIdx = midY * width + x;
        const dIdx = 4 * pixelIdx;
        if (isGreenChroma(data[dIdx], data[dIdx + 1], data[dIdx + 2])) {
          seedIndex = pixelIdx;
          break;
        }
      }
    }

    if (seedIndex < 0) {
      console.warn('Glass center chroma not found, falling back to default image.');
      return;
    }

    // Flood fill the glass area
    const stack = new Int32Array(width * height);
    let stackPtr = 0;
    stack[stackPtr++] = seedIndex;
    visited[seedIndex] = 1;

    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let sumR = 0, sumG = 0, sumB = 0, pixelCount = 0;

    while (stackPtr > 0) {
      const idx = stack[--stackPtr];
      const curX = idx % width;
      const curY = (idx - curX) / width;
      const dIdx = 4 * idx;

      sumR += data[dIdx];
      sumG += data[dIdx + 1];
      sumB += data[dIdx + 2];
      pixelCount += 1;

      if (curX < minX) minX = curX;
      if (curX > maxX) maxX = curX;
      if (curY < minY) minY = curY;
      if (curY > maxY) maxY = curY;

      const neighbors = [
        curX > 0 ? idx - 1 : -1,
        curX < width - 1 ? idx + 1 : -1,
        curY > 0 ? idx - width : -1,
        curY < height - 1 ? idx + width : -1,
      ];

      for (const n of neighbors) {
        if (n < 0 || visited[n]) continue;
        const nD = 4 * n;
        if (isGreenChroma(data[nD], data[nD + 1], data[nD + 2])) {
          visited[n] = 1;
          stack[stackPtr++] = n;
        }
      }
    }

    const avgR = sumR / pixelCount;
    const avgG = sumG / pixelCount;
    const avgB = sumB / pixelCount;
    const greenDiff = Math.max(1, avgG - Math.max(avgR, avgB));

    const checkBorder = (x, y) => {
      for (let dy = -3; dy <= 3; dy += 1) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -3; dx <= 3; dx += 1) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          if (visited[ny * width + nx]) return true;
        }
      }
      return false;
    };

    const startX = Math.max(0, minX - 4);
    const endX = Math.min(width - 1, maxX + 4);
    const startY = Math.max(0, minY - 4);
    const endY = Math.min(height - 1, maxY + 4);

    for (let y = startY; y <= endY; y += 1) {
      for (let x = startX; x <= endX; x += 1) {
        const idx = y * width + x;
        const dIdx = 4 * idx;

        if (visited[idx]) {
          data[dIdx + 3] = 0; // Transparent glass center
          continue;
        }

        const r = data[dIdx];
        const g = data[dIdx + 1];
        const b = data[dIdx + 2];
        const localDiff = g - Math.max(r, b);

        if (localDiff <= 6 || !checkBorder(x, y)) continue;

        const spillRatio = Math.min(1, localDiff / greenDiff);
        const invRatio = 1 - spillRatio;

        if (invRatio < 0.04) {
          data[dIdx + 3] = 0;
          continue;
        }

        const fixedR = clampColor((r - spillRatio * avgR) / invRatio);
        const fixedB = clampColor((b - spillRatio * avgB) / invRatio);
        const fixedG = clampColor(Math.min((g - spillRatio * avgG) / invRatio, Math.max(fixedR, fixedB)));

        data[dIdx] = fixedR;
        data[dIdx + 1] = fixedG;
        data[dIdx + 2] = fixedB;
        data[dIdx + 3] = Math.round(255 * invRatio);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Subtle edge gradients for depth
    ctx.globalCompositeOperation = 'source-atop';
    const edgeShades = [
      [0, 0, 0, 0.08 * height, 0, 0, width, 0.08 * height],
      [0, height, 0, 0.92 * height, 0, 0.92 * height, width, 0.08 * height],
      [0, 0, 0.05 * width, 0, 0, 0, 0.05 * width, height],
      [width, 0, 0.95 * width, 0, 0.95 * width, 0, 0.05 * width, height],
    ];

    for (const [x0, y0, x1, y1, rx, ry, rw, rh] of edgeShades) {
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(rx, ry, rw, rh);
    }

    ctx.globalCompositeOperation = 'source-over';
    return { width, height };
  } catch (err) {
    console.error('Canvas processing error:', err);
    throw err;
  }
}
