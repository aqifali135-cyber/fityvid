export const DESIGN_TOOLS = [
  {
    id: 'profile-picture',
    label: 'Profile Picture Maker',
    icon: '👤',
    title: 'Profile Picture Maker',
    reuseImageTool: 'profile-picture',
  },
  {
    id: 'calendar-maker',
    label: 'Calendar Maker',
    icon: '📅',
    title: 'Calendar Maker',
  },
  {
    id: 'color-palette',
    label: 'Color Palette',
    icon: '🎨',
    title: 'Color Palette Generator',
  },
  {
    id: 'sharpen',
    label: 'Sharpen Image',
    icon: '✨',
    title: 'Sharpen Image',
    reuseImageTool: 'sharpen',
  },
  {
    id: 'add-text',
    label: 'Add Text to Photo',
    icon: '🅰️',
    title: 'Add Text to Photo',
    reuseImageTool: 'add-text',
  },
  {
    id: 'admaker',
    label: 'Admaker',
    icon: '📢',
    title: 'Admaker',
  },
];

export function getDesignTool(toolId) {
  return DESIGN_TOOLS.find((tool) => tool.id === toolId) || null;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getMonthName(monthIndex) {
  return MONTH_NAMES[monthIndex] || '';
}

export function buildCalendarMatrix(year, month, weekStartsOn = 'sunday') {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDay = first.getDay(); // 0 Sunday
  if (weekStartsOn === 'monday') {
    startDay = (startDay + 6) % 7;
  }

  const cells = [];
  for (let i = 0; i < startDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function getWeekdayLabels(weekStartsOn = 'sunday') {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (weekStartsOn === 'monday') {
    return [...labels.slice(1), labels[0]];
  }
  return labels;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

function hslToRgb(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHsl(r, g, b) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) * 60;
  else if (max === gg) h = ((bb - rr) / d + 2) * 60;
  else h = ((rr - gg) / d + 4) * 60;
  return { h, s: s * 100, l: l * 100 };
}

function mixHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.r + (B.r - A.r) * t, A.g + (B.g - A.g) * t, A.b + (B.b - A.b) * t);
}

export function generatePaletteFromBase(baseHex, type = 'Monochromatic') {
  const base = hexToRgb(baseHex || '#8B5CF6');
  const hsl = rgbToHsl(base.r, base.g, base.b);
  const hue = hsl.h;

  if (type === 'Complementary') {
    return [
      rgbToHex(...Object.values(hslToRgb(hue, hsl.s, clamp(hsl.l - 18, 12, 88)))),
      rgbToHex(...Object.values(hslToRgb(hue, hsl.s, hsl.l))),
      rgbToHex(...Object.values(hslToRgb(hue, clamp(hsl.s - 12, 10, 90), clamp(hsl.l + 18, 12, 92)))),
      rgbToHex(...Object.values(hslToRgb((hue + 180) % 360, hsl.s, hsl.l))),
      rgbToHex(...Object.values(hslToRgb((hue + 180) % 360, clamp(hsl.s - 10, 10, 90), clamp(hsl.l + 16, 12, 92)))),
    ];
  }

  if (type === 'Analogous') {
    return [-40, -20, 0, 20, 40].map((offset) =>
      rgbToHex(...Object.values(hslToRgb((hue + offset + 360) % 360, hsl.s, hsl.l))),
    );
  }

  if (type === 'Triadic') {
    return [0, 120, 240, 40, 200].map((offset, i) =>
      rgbToHex(
        ...Object.values(
          hslToRgb((hue + offset) % 360, clamp(hsl.s - i * 4, 15, 90), clamp(hsl.l + (i % 2 ? 8 : -6), 15, 90)),
        ),
      ),
    );
  }

  if (type === 'Pastel') {
    return [-30, -15, 0, 15, 30].map((offset) =>
      rgbToHex(...Object.values(hslToRgb((hue + offset + 360) % 360, 35, 78))),
    );
  }

  // Monochromatic
  return [-28, -14, 0, 14, 28].map((delta) =>
    rgbToHex(...Object.values(hslToRgb(hue, hsl.s, clamp(hsl.l + delta, 12, 92)))),
  );
}

export function generateRandomPalette() {
  const baseHue = Math.floor(Math.random() * 360);
  return [0, 1, 2, 3, 4].map((i) =>
    rgbToHex(
      ...Object.values(
        hslToRgb((baseHue + i * 28) % 360, 45 + (i % 3) * 10, 42 + i * 8),
      ),
    ),
  );
}

export function renderCalendarToCanvas(options) {
  const {
    year,
    month,
    title = '',
    themeColor = '#7C3AED',
    weekStartsOn = 'sunday',
    highlightDays = '',
  } = options;

  const width = 900;
  const height = 720;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // header
  ctx.fillStyle = themeColor;
  ctx.fillRect(0, 0, width, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 34px DM Sans, Arial, sans-serif';
  ctx.fillText(title || `${getMonthName(month)} ${year}`, 36, 52);
  ctx.font = '500 18px DM Sans, Arial, sans-serif';
  ctx.fillText('FityVid Calendar Maker', 36, 82);

  const weekdays = getWeekdayLabels(weekStartsOn);
  const weeks = buildCalendarMatrix(year, month, weekStartsOn);
  const highlights = new Set(
    String(highlightDays)
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((n) => Number.isFinite(n) && n > 0),
  );

  const gridX = 36;
  const gridY = 140;
  const cellW = (width - 72) / 7;
  const cellH = 78;

  weekdays.forEach((label, i) => {
    ctx.fillStyle = '#6B7280';
    ctx.font = '700 16px DM Sans, Arial, sans-serif';
    ctx.fillText(label, gridX + i * cellW + 18, gridY);
  });

  weeks.forEach((week, row) => {
    week.forEach((day, col) => {
      const x = gridX + col * cellW;
      const y = gridY + 20 + row * cellH;
      ctx.strokeStyle = '#E5E7EB';
      ctx.strokeRect(x, y, cellW, cellH);
      if (!day) return;

      if (highlights.has(day)) {
        ctx.fillStyle = mixHex(themeColor, '#ffffff', 0.82);
        ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
      }

      ctx.fillStyle = highlights.has(day) ? themeColor : '#111827';
      ctx.font = '600 20px DM Sans, Arial, sans-serif';
      ctx.fillText(String(day), x + 16, y + 34);
    });
  });

  return canvas;
}

export function renderAdToCanvas(options) {
  const {
    backgroundImage = null,
    headline = 'Your Headline',
    subheadline = 'Add a short supporting line',
    cta = 'Shop Now',
    brand = 'FityVid',
    price = '',
    themeColor = '#7C3AED',
    textColor = '#ffffff',
    layout = 'square',
    style = 'minimal',
  } = options;

  const sizes = {
    square: [1080, 1080],
    story: [1080, 1920],
    banner: [1200, 628],
  };
  const [width, height] = sizes[layout] || sizes.square;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (backgroundImage) {
    const scale = Math.max(width / backgroundImage.width, height / backgroundImage.height);
    const drawW = backgroundImage.width * scale;
    const drawH = backgroundImage.height * scale;
    ctx.drawImage(backgroundImage, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(0, 0, width, height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, themeColor);
    gradient.addColorStop(1, mixHex(themeColor, '#111827', 0.35));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  const pad = Math.round(width * 0.08);
  ctx.fillStyle = textColor;
  ctx.font = `700 ${Math.round(width * 0.035)}px DM Sans, Arial, sans-serif`;
  ctx.fillText(brand || 'Brand', pad, pad + 20);

  if (style === 'sale') {
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(pad, pad + 50, Math.round(width * 0.28), 48);
    ctx.fillStyle = '#111827';
    ctx.font = `800 ${Math.round(width * 0.03)}px DM Sans, Arial, sans-serif`;
    ctx.fillText('SALE', pad + 18, pad + 82);
  }

  const headlineSize = Math.round(width * (layout === 'banner' ? 0.055 : 0.07));
  ctx.fillStyle = textColor;
  ctx.font = `800 ${headlineSize}px DM Sans, Arial, sans-serif`;
  wrapText(ctx, headline || 'Your Headline', pad, height * 0.42, width - pad * 2, headlineSize * 1.15);

  ctx.font = `500 ${Math.round(width * 0.032)}px DM Sans, Arial, sans-serif`;
  wrapText(ctx, subheadline || '', pad, height * 0.58, width - pad * 2, Math.round(width * 0.04));

  if (price) {
    ctx.font = `800 ${Math.round(width * 0.05)}px DM Sans, Arial, sans-serif`;
    ctx.fillText(price, pad, height * 0.72);
  }

  const ctaW = Math.round(width * 0.34);
  const ctaH = Math.round(height * (layout === 'banner' ? 0.12 : 0.07));
  const ctaX = pad;
  const ctaY = height - pad - ctaH;
  ctx.fillStyle = style === 'product' ? '#22C55E' : '#ffffff';
  roundRectPath(ctx, ctaX, ctaY, ctaW, ctaH, 16);
  ctx.fill();
  ctx.fillStyle = style === 'product' ? '#052e16' : themeColor;
  ctx.font = `700 ${Math.round(width * 0.03)}px DM Sans, Arial, sans-serif`;
  ctx.fillText(cta || 'Learn More', ctaX + 28, ctaY + ctaH * 0.65);

  if (style === 'service') {
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(pad * 0.55, pad * 0.55, width - pad * 1.1, height - pad * 1.1);
  }

  return canvas;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(/\s+/).filter(Boolean);
  let line = '';
  let cursorY = y;
  words.forEach((word, index) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
    if (index === words.length - 1 && line) ctx.fillText(line, x, cursorY);
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
