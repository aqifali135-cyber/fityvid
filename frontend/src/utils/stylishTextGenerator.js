export const STYLE_FILTERS = [
  'All',
  'Cool',
  'Fancy',
  'Cursive',
  'Bold',
  'Bubble',
  'Small',
  'Unique',
];

export const FONT_STYLE_CATEGORIES = [
  { id: 'All', label: 'All Fonts', icon: '✨', filter: 'All' },
  { id: 'Cool', label: 'Cool Fonts', icon: '😎', filter: 'Cool' },
  { id: 'Cursive', label: 'Cursive Fonts', icon: '✍️', filter: 'Cursive' },
  { id: 'Bold', label: 'Bold Fonts', icon: '𝐁', filter: 'Bold' },
  { id: 'Fancy', label: 'Fancy Fonts', icon: '💎', filter: 'Fancy' },
  { id: 'Bubble', label: 'Bubble Fonts', icon: '⭕', filter: 'Bubble' },
  { id: 'Small', label: 'Small Fonts', icon: 'ᵃ', filter: 'Small' },
  { id: 'Unique', label: 'Unique Fonts', icon: '🌟', filter: 'Unique' },
];

export const PREVIEW_TEXT = 'FityVid';

const FRAKTUR_CAP = {
  A: '\u{1D504}', B: '\u{212C}', C: '\u{1D506}', D: '\u{1D507}', E: '\u{2130}',
  F: '\u{2131}', G: '\u{1D50A}', H: '\u{210C}', I: '\u{2111}', J: '\u{1D50D}',
  K: '\u{1D50E}', L: '\u{1D50F}', M: '\u{1D510}', N: '\u{1D511}', O: '\u{1D512}',
  P: '\u{1D513}', Q: '\u{1D514}', R: '\u{211C}', S: '\u{1D516}', T: '\u{1D517}',
  U: '\u{1D518}', V: '\u{1D519}', W: '\u{1D51A}', X: '\u{1D51B}', Y: '\u{1D51C}', Z: '\u{2128}',
};

const DOUBLE_STRUCK_CAP = {
  A: '\u{1D538}', B: '\u{1D539}', C: '\u{2102}', D: '\u{1D53B}', E: '\u{1D53C}',
  F: '\u{1D53D}', G: '\u{1D53E}', H: '\u{210D}', I: '\u{1D540}', J: '\u{1D541}',
  K: '\u{1D542}', L: '\u{1D543}', M: '\u{1D544}', N: '\u{2115}', O: '\u{1D546}',
  P: '\u{2119}', Q: '\u{211A}', R: '\u{211D}', S: '\u{1D54A}', T: '\u{1D54B}',
  U: '\u{1D54C}', V: '\u{1D54D}', W: '\u{1D54E}', X: '\u{1D54F}', Y: '\u{1D550}', Z: '\u{2124}',
};

const SMALL_CAPS = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
  k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ꞯ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ',
  u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
};

const UPSIDE_DOWN = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
  k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n',
  v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', A: '∀', B: '𐐒', C: 'Ɔ', D: '◖', E: 'Ǝ',
  F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O',
  P: 'Ԁ', Q: 'Ό', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': '⇂', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', ',': "'", '?': '¿', '!': '¡', '(': ')', ')': '(', '[': ']', ']': '[',
  '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', _: '‾',
};

const CURRENCY_SYMBOLS = {
  a: '₳', b: '฿', c: '¢', d: '₫', e: '€', f: '₣', g: '₲', h: '₶', i: 'ᵢ', j: 'ⱼ',
  k: '₭', l: 'ł', m: '₥', n: '₦', o: 'ø', p: '₱', q: 'Ω', r: '₹', s: '$', t: '₮',
  u: 'ʉ', v: 'ᵥ', w: '₩', x: 'Ӿ', y: '¥', z: 'ƶ',
};

function mapAlphanumeric(text, upperBase, lowerBase, digitBase) {
  let out = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(upperBase + (code - 65));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(lowerBase + (code - 97));
    } else if (digitBase !== null && code >= 48 && code <= 57) {
      out += String.fromCodePoint(digitBase + (code - 48));
    } else {
      out += char;
    }
  }
  return out;
}

function mapSpecialCaps(text, capMap, lowerBase) {
  let out = '';
  for (const char of text) {
    if (char >= 'A' && char <= 'Z' && capMap[char]) {
      out += capMap[char];
    } else if (char >= 'a' && char <= 'z' && lowerBase !== null) {
      out += String.fromCodePoint(lowerBase + (char.charCodeAt(0) - 97));
    } else {
      out += char;
    }
  }
  return out;
}

function wrapText(text, left, right) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  return `${left}${trimmed}${right}`;
}

function joinChars(text, separator) {
  return [...text].join(separator);
}

function addCombining(text, mark) {
  return [...text].map((char) => (char === ' ' ? char : `${char}${mark}`)).join('');
}

function toBold(text) {
  return mapAlphanumeric(text, 0x1d400, 0x1d41a, 0x1d7ce);
}

function toItalic(text) {
  return mapAlphanumeric(text, 0x1d434, 0x1d44e, 0x1d7e2);
}

function toBoldItalic(text) {
  return mapAlphanumeric(text, 0x1d468, 0x1d482, 0x1d7ec);
}

function toSansBold(text) {
  return mapAlphanumeric(text, 0x1d5d4, 0x1d5ee, 0x1d7ec);
}

function toScript(text) {
  return mapAlphanumeric(text, 0x1d49c, 0x1d4ea, null);
}

function toScriptBold(text) {
  return mapAlphanumeric(text, 0x1d4d0, 0x1d4fa, null);
}

function toFraktur(text) {
  return mapSpecialCaps(text, FRAKTUR_CAP, 0x1d51e);
}

function toDoubleStruck(text) {
  let out = '';
  for (const char of text) {
    if (char >= 'A' && char <= 'Z' && DOUBLE_STRUCK_CAP[char]) {
      out += DOUBLE_STRUCK_CAP[char];
    } else if (char >= 'a' && char <= 'z') {
      out += String.fromCodePoint(0x1d552 + (char.charCodeAt(0) - 97));
    } else if (char >= '0' && char <= '9') {
      out += String.fromCodePoint(0x1d7d8 + (char.charCodeAt(0) - 48));
    } else {
      out += char;
    }
  }
  return out;
}

function toMonospace(text) {
  return mapAlphanumeric(text, 0x1d670, 0x1d68a, 0x1d7f6);
}

function toFullWidth(text) {
  let out = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 33 && code <= 126) {
      out += String.fromCodePoint(0xff00 + code - 0x20);
    } else if (code === 32) {
      out += '\u3000';
    } else {
      out += char;
    }
  }
  return out;
}

function toCircled(text) {
  let out = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(0x24b6 + (code - 65));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(0x24d0 + (code - 97));
    } else if (code >= 48 && code <= 57) {
      out += code === 48 ? '\u24ea' : String.fromCodePoint(0x2460 + (code - 49));
    } else {
      out += char;
    }
  }
  return out;
}

function toSquared(text) {
  let out = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(0x1f130 + (code - 65));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(0x1f150 + (code - 97));
    } else if (code >= 48 && code <= 57) {
      out += String.fromCodePoint(0x1f100 + (code - 48));
    } else {
      out += char;
    }
  }
  return out;
}

function toBubble(text) {
  return joinChars(toCircled(text), ' ');
}

function toDarkBubble(text) {
  let out = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(0x1f170 + (code - 65));
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(0x1f150 + (code - 97));
    } else {
      out += char;
    }
  }
  return out;
}

function toParenthesized(text) {
  let out = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(0x249c + (code - 97));
    } else if (code >= 65 && code <= 90) {
      out += `(${char})`;
    } else {
      out += char;
    }
  }
  return out;
}

function toSmallCaps(text) {
  return [...text].map((char) => SMALL_CAPS[char.toLowerCase()] ?? char).join('');
}

function toUpsideDown(text) {
  return [...text].reverse().map((char) => UPSIDE_DOWN[char] ?? char).join('');
}

function toAestheticSpaced(text) {
  return joinChars(toFullWidth(text), ' ');
}

function toSlashText(text) {
  return joinChars(text, '/');
}

function toUnderline(text) {
  return addCombining(text, '\u0332');
}

function toStrike(text) {
  return addCombining(text, '\u0336');
}

function toGlitchLight(text) {
  const marks = ['\u0300', '\u0301', '\u0307', '\u0308'];
  return [...text]
    .map((char, index) => (char === ' ' ? char : char + marks[index % marks.length]))
    .join('');
}

function toCurrency(text) {
  return [...text].map((char) => CURRENCY_SYMBOLS[char.toLowerCase()] ?? char).join('');
}

function toCute(text) {
  return wrapText(text, '˗ˏˋ ', ' ˎˊ˗');
}

function toMinimal(text) {
  return wrapText(text, '· ', ' ·');
}

function toWave(text) {
  return wrapText(text, '〜', '〜');
}

function toBracket(text) {
  return wrapText(text, '【', '】');
}

function toStarDecorated(text) {
  return wrapText(text, '★ ', ' ★');
}

function toHeartDecorated(text) {
  return wrapText(text, '♥ ', ' ♥');
}

function toFireDecorated(text) {
  return wrapText(text, '🔥 ', ' 🔥');
}

function toSparkleDecorated(text) {
  return wrapText(text, '✦ ', ' ✦');
}

function toArrowDecorated(text) {
  return wrapText(text, '➤ ', ' ◂');
}

function toEmojiWrapped(text) {
  return wrapText(text, '✨ ', ' ✨');
}

function toDotSpaced(text) {
  return joinChars(text, ' · ');
}

function toWideCaps(text) {
  return [...text.toUpperCase()].join('  ');
}

function toUpperCase(text) {
  return text.toUpperCase();
}

function toLowerCase(text) {
  return text.toLowerCase();
}

function toTitleCase(text) {
  return text
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

function toAlternatingCase(text) {
  let upper = true;
  return [...text]
    .map((char) => {
      if (!/[a-zA-Z]/.test(char)) return char;
      const next = upper ? char.toUpperCase() : char.toLowerCase();
      upper = !upper;
      return next;
    })
    .join('');
}

export const STYLISH_TEXT_STYLES = [
  { id: 'bold', name: 'Bold', category: 'Bold', transform: toBold },
  { id: 'italic', name: 'Italic', category: 'Fancy', transform: toItalic },
  { id: 'bold-italic', name: 'Bold Italic', category: 'Bold', transform: toBoldItalic },
  { id: 'sans-bold', name: 'Sans Bold', category: 'Bold', transform: toSansBold },
  { id: 'script', name: 'Script', category: 'Cursive', transform: toScript },
  { id: 'script-bold', name: 'Script Bold', category: 'Cursive', transform: toScriptBold },
  { id: 'fraktur', name: 'Fraktur', category: 'Fancy', transform: toFraktur },
  { id: 'double-struck', name: 'Double Struck', category: 'Cool', transform: toDoubleStruck },
  { id: 'monospace', name: 'Monospace', category: 'Cool', transform: toMonospace },
  { id: 'full-width', name: 'Full Width', category: 'Aesthetic', transform: toFullWidth },
  { id: 'circled', name: 'Circled', category: 'Symbol Text', transform: toCircled },
  { id: 'squared', name: 'Squared', category: 'Symbol Text', transform: toSquared },
  { id: 'bubble', name: 'Bubble', category: 'Text Art', transform: toBubble },
  { id: 'dark-bubble', name: 'Dark Bubble', category: 'Text Art', transform: toDarkBubble },
  { id: 'parenthesized', name: 'Parenthesized', category: 'Symbol Text', transform: toParenthesized },
  { id: 'small-caps', name: 'Small Caps', category: 'Small', transform: toSmallCaps },
  { id: 'upside-down', name: 'Upside Down', category: 'Cool', transform: toUpsideDown },
  { id: 'aesthetic-spaced', name: 'Aesthetic Spaced', category: 'Aesthetic', transform: toAestheticSpaced },
  { id: 'slash-text', name: 'Slash Text', category: 'Cool', transform: toSlashText },
  { id: 'underline', name: 'Underline', category: 'Fancy', transform: toUnderline },
  { id: 'strike', name: 'Strike', category: 'Glitch', transform: toStrike },
  { id: 'glitch-light', name: 'Glitch Light', category: 'Glitch', transform: toGlitchLight },
  { id: 'currency', name: 'Currency Symbols', category: 'Symbol Text', transform: toCurrency },
  { id: 'star-decorated', name: 'Star Decorated', category: 'Emoji', transform: toStarDecorated },
  { id: 'heart-decorated', name: 'Heart Decorated', category: 'Emoji', transform: toHeartDecorated },
  { id: 'fire-decorated', name: 'Fire Decorated', category: 'Emoji', transform: toFireDecorated },
  { id: 'sparkle-decorated', name: 'Sparkle Decorated', category: 'Emoji', transform: toSparkleDecorated },
  { id: 'arrow-decorated', name: 'Arrow Decorated', category: 'Cool', transform: toArrowDecorated },
  { id: 'emoji-wrapped', name: 'Emoji Wrapped', category: 'Emoji', transform: toEmojiWrapped },
  { id: 'cute', name: 'Cute', category: 'Aesthetic', transform: toCute },
  { id: 'minimal', name: 'Minimal', category: 'Aesthetic', transform: toMinimal },
  { id: 'wave', name: 'Wave', category: 'Aesthetic', transform: toWave },
  { id: 'bracket', name: 'Bracket Style', category: 'Text Art', transform: toBracket },
  { id: 'dot-spaced', name: 'Dot Spaced', category: 'Text Art', transform: toDotSpaced },
  { id: 'wide-caps', name: 'Wide Caps', category: 'Small', transform: toWideCaps },
  { id: 'uppercase', name: 'Uppercase', category: 'Letter Cases', transform: toUpperCase },
  { id: 'lowercase', name: 'Lowercase', category: 'Letter Cases', transform: toLowerCase },
  { id: 'title-case', name: 'Title Case', category: 'Letter Cases', transform: toTitleCase },
  { id: 'alternating-case', name: 'Alternating Case', category: 'Letter Cases', transform: toAlternatingCase },
];

export function generateStylishTextVariants(text) {
  const source = (text ?? '').trim() ? text : PREVIEW_TEXT;
  return STYLISH_TEXT_STYLES.map((style) => ({
    id: style.id,
    name: style.name,
    category: style.category,
    text: style.transform(source),
    isPreview: !(text ?? '').trim(),
  }));
}

export function filterStylishTextVariants(variants, filter) {
  if (!filter || filter === 'All') return variants;
  if (filter === 'Bubble') {
    return variants.filter(
      (variant) =>
        variant.category === 'Text Art' ||
        variant.id === 'bubble' ||
        variant.id === 'dark-bubble',
    );
  }
  if (filter === 'Unique') {
    const uniqueCategories = new Set(['Aesthetic', 'Glitch', 'Emoji', 'Symbol Text', 'Letter Cases']);
    return variants.filter((variant) => uniqueCategories.has(variant.category));
  }
  return variants.filter((variant) => variant.category === filter);
}

export function countVariantsByFilter(variants, filter) {
  return filterStylishTextVariants(variants, filter).length;
}
