export const IMAGE_TOOLS = [
  { id: 'profile-picture', label: 'Profile Picture Maker', icon: '👤', title: 'Profile Picture Maker' },
  { id: 'sharpen', label: 'Sharpen Image', icon: '✨', title: 'Sharpen Image' },
  { id: 'compress', label: 'Compress Image', icon: '🗜️', title: 'Compress Image' },
  { id: 'rotate', label: 'Rotate Image', icon: '🔄', title: 'Rotate Image' },
  { id: 'resize', label: 'Resize Image', icon: '📐', title: 'Resize Image' },
  { id: 'add-text', label: 'Add Text to Photo', icon: '🅰️', title: 'Add Text to Photo' },
  { id: 'crop', label: 'Crop Image', icon: '✂️', title: 'Crop Image' },
  { id: 'png-to-svg', label: 'PNG to SVG', icon: '📄', title: 'PNG to SVG' },
  { id: 'heic-to-jpg', label: 'HEIC to JPG', icon: '📷', title: 'HEIC to JPG' },
  { id: 'jpg-to-png', label: 'JPG to PNG', icon: '🖼️', title: 'JPG to PNG' },
  { id: 'png-to-jpg', label: 'PNG to JPG', icon: '🔄', title: 'PNG to JPG' },
  { id: 'color-palette', label: 'Color Palette from Image', icon: '🎨', title: 'Color Palette from Image' },
  { id: 'svg-to-png', label: 'SVG to PNG', icon: '🧿', title: 'SVG to PNG' },
  { id: 'mirror', label: 'Image Mirror', icon: '🪞', title: 'Image Mirror' },
];

export function getImageTool(toolId) {
  return IMAGE_TOOLS.find((tool) => tool.id === toolId) || null;
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to load this image.'));
    };
    img.src = url;
  });
}

export function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Unable to load this image.'));
    img.src = url;
  });
}

export function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

export function canvasToBlob(canvas, type = 'image/png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('Failed to export image.'));
        else resolve(blob);
      },
      type,
      quality,
    );
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read file.'));
    reader.readAsDataURL(file);
  });
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

export function extractColorPalette(image, count = 8) {
  const sampleSize = 120;
  const scale = Math.min(1, sampleSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const { canvas, ctx } = createCanvas(width, height);
  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  const buckets = new Map();
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 128) continue;
    const key = `${Math.round(r / 24) * 24},${Math.round(g / 24) * 24},${Math.round(b / 24) * 24}`;
    const current = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    current.r += r;
    current.g += g;
    current.b += b;
    current.n += 1;
    buckets.set(key, current);
  }

  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((item) => {
      const r = Math.round(item.r / item.n);
      const g = Math.round(item.g / item.n);
      const b = Math.round(item.b / item.n);
      return rgbToHex(r, g, b);
    });
}

export function applySharpen(image, amount = 50) {
  const strength = Math.max(0, Math.min(100, amount)) / 100;
  const { canvas, ctx } = createCanvas(image.width, image.height);
  ctx.drawImage(image, 0, 0);
  if (strength <= 0) return canvas;

  const src = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const out = ctx.createImageData(canvas.width, canvas.height);
  const w = canvas.width;
  const h = canvas.height;
  const center = 1 + 4 * strength;
  const edge = -strength;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c += 1) {
        const sample = (sx, sy) => {
          const xx = Math.min(w - 1, Math.max(0, sx));
          const yy = Math.min(h - 1, Math.max(0, sy));
          return src.data[(yy * w + xx) * 4 + c];
        };
        const value =
          sample(x, y) * center +
          sample(x - 1, y) * edge +
          sample(x + 1, y) * edge +
          sample(x, y - 1) * edge +
          sample(x, y + 1) * edge;
        out.data[i + c] = Math.max(0, Math.min(255, value));
      }
      out.data[i + 3] = src.data[i + 3];
    }
  }

  ctx.putImageData(out, 0, 0);
  return canvas;
}

export function rotateImage(image, degrees) {
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const width = Math.round(image.width * cos + image.height * sin);
  const height = Math.round(image.width * sin + image.height * cos);
  const { canvas, ctx } = createCanvas(width, height);
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  return canvas;
}

export function mirrorImage(image, horizontal = false, vertical = false) {
  const { canvas, ctx } = createCanvas(image.width, image.height);
  ctx.translate(horizontal ? image.width : 0, vertical ? image.height : 0);
  ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  ctx.drawImage(image, 0, 0);
  return canvas;
}

export function resizeImage(image, width, height) {
  const { canvas, ctx } = createCanvas(width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
}

export function cropImage(image, x, y, width, height) {
  const safeX = Math.max(0, Math.min(image.width - 1, Math.round(x)));
  const safeY = Math.max(0, Math.min(image.height - 1, Math.round(y)));
  const safeW = Math.max(1, Math.min(image.width - safeX, Math.round(width)));
  const safeH = Math.max(1, Math.min(image.height - safeY, Math.round(height)));
  const { canvas, ctx } = createCanvas(safeW, safeH);
  ctx.drawImage(image, safeX, safeY, safeW, safeH, 0, 0, safeW, safeH);
  return canvas;
}

export function addTextToImage(image, options) {
  const {
    text = '',
    fontSize = 36,
    color = '#ffffff',
    x = 40,
    y = 60,
    bold = true,
  } = options;
  const { canvas, ctx } = createCanvas(image.width, image.height);
  ctx.drawImage(image, 0, 0);
  ctx.fillStyle = color;
  ctx.font = `${bold ? '700' : '400'} ${fontSize}px DM Sans, Arial, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 4;
  ctx.fillText(text, x, y);
  return canvas;
}

export function makeProfilePicture(image, options) {
  const {
    shape = 'circle',
    background = '#ffffff',
    border = 8,
    size = 512,
  } = options;
  const { canvas, ctx } = createCanvas(size, size);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  const inset = border;
  const drawSize = size - inset * 2;
  ctx.save();
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, drawSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  } else if (shape === 'rounded') {
    const radius = drawSize * 0.18;
    roundRect(ctx, inset, inset, drawSize, drawSize, radius);
    ctx.clip();
  } else {
    ctx.beginPath();
    ctx.rect(inset, inset, drawSize, drawSize);
    ctx.clip();
  }

  const scale = Math.max(drawSize / image.width, drawSize / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  ctx.drawImage(image, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);
  ctx.restore();

  if (border > 0) {
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = border;
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, (size - border) / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape === 'rounded') {
      roundRect(ctx, border / 2, border / 2, size - border, size - border, (size - border) * 0.18);
      ctx.stroke();
    } else {
      ctx.strokeRect(border / 2, border / 2, size - border, size - border);
    }
  }

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export async function convertRasterFormat(image, type = 'image/jpeg', quality = 0.92, fillWhite = false) {
  const { canvas, ctx } = createCanvas(image.width, image.height);
  if (fillWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(image, 0, 0);
  return canvasToBlob(canvas, type, quality);
}

export async function pngToSvgWrapper(file, image) {
  const dataUrl = await fileToDataUrl(file);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${image.width}" height="${image.height}" viewBox="0 0 ${image.width} ${image.height}">
  <title>PNG embedded as SVG</title>
  <image href="${dataUrl}" width="${image.width}" height="${image.height}" />
</svg>`;
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

export async function svgFileToPng(file, outputSize = 1024) {
  const text = await file.text();
  const blob = new Blob([text], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    const image = await loadImageFromUrl(url);
    let width = image.width || outputSize;
    let height = image.height || outputSize;
    if (outputSize && outputSize !== 'original') {
      const size = Number(outputSize);
      const scale = size / Math.max(width, height);
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
    }
    const { canvas, ctx } = createCanvas(width, height);
    ctx.drawImage(image, 0, 0, width, height);
    return canvasToBlob(canvas, 'image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function tryConvertHeicToJpg(file) {
  // Prefer browser native decode where supported (no new dependency).
  try {
    const bitmap = await createImageBitmap(file);
    const { canvas, ctx } = createCanvas(bitmap.width, bitmap.height);
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close?.();
    return canvasToBlob(canvas, 'image/jpeg', 0.92);
  } catch {
    return null;
  }
}
