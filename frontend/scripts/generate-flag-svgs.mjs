import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const flagsDir = path.join(__dirname, '../public/images/flags');
fs.mkdirSync(flagsDir, { recursive: true });

function svg(content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="60" height="40">${content}</svg>
`;
}

function rect(x, y, w, h, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

function stripeH(colors) {
  const h = 40 / colors.length;
  return colors.map((c, i) => rect(0, i * h, 60, h + 0.2, c)).join('');
}

function stripeV(colors) {
  const w = 60 / colors.length;
  return colors.map((c, i) => rect(i * w, 0, w + 0.2, 40, c)).join('');
}

const flags = {
  us: () => {
    const stripes = Array.from({ length: 13 }, (_, i) =>
      rect(0, (i * 40) / 13, 60, 40 / 13 + 0.2, i % 2 === 0 ? '#B22234' : '#fff'),
    ).join('');
    return svg(
      `${stripes}${rect(0, 0, 24, (40 / 13) * 7, '#3C3B6E')}<g fill="#fff">${Array.from(
        { length: 9 },
        (_, r) =>
          Array.from({ length: r % 2 ? 5 : 6 }, (_, c) => {
            const x = 2.2 + c * 3.8 + (r % 2 ? 1.9 : 0);
            const y = 2 + r * 2.8;
            return `<circle cx="${x}" cy="${y}" r="0.7"/>`;
          }).join(''),
      ).join('')}</g>`,
    );
  },
  gb: () =>
    svg(
      `${rect(0, 0, 60, 40, '#012169')}
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" stroke-width="8"/>
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" stroke-width="4"/>
      ${rect(24, 0, 12, 40, '#fff')}${rect(0, 14, 60, 12, '#fff')}
      ${rect(26, 0, 8, 40, '#C8102E')}${rect(0, 16, 60, 8, '#C8102E')}`,
    ),
  pk: () =>
    svg(
      `${rect(0, 0, 15, 40, '#fff')}${rect(15, 0, 45, 40, '#01411C')}
      <circle cx="38" cy="20" r="8" fill="#fff"/>
      <circle cx="41" cy="18" r="7" fill="#01411C"/>
      <polygon points="44,11 45.2,14.5 48.8,14.5 45.9,16.6 47,20 44,17.8 41,20 42.1,16.6 39.2,14.5 42.8,14.5" fill="#fff"/>`,
    ),
  in: () =>
    svg(
      `${stripeH(['#FF9933', '#fff', '#138808'])}
      <circle cx="30" cy="20" r="5.2" fill="none" stroke="#000080" stroke-width="1"/>
      <circle cx="30" cy="20" r="1" fill="#000080"/>
      <g stroke="#000080" stroke-width="0.6">${Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        const x2 = 30 + Math.cos(a) * 5;
        const y2 = 20 + Math.sin(a) * 5;
        return `<line x1="30" y1="20" x2="${x2}" y2="${y2}"/>`;
      }).join('')}</g>`,
    ),
  ca: () =>
    svg(
      `${stripeV(['#FF0000', '#fff', '#FF0000'])}
      <path d="M30 10 l2 5 5.5.5-4 3.5 1.5 5.5L30 21.5 25 24.5l1.5-5.5-4-3.5 5.5-.5z" fill="#FF0000"/>`,
    ),
  au: () =>
    svg(
      `${rect(0, 0, 60, 40, '#00247D')}
      ${rect(0, 0, 30, 20, '#012169')}
      <path d="M0 0 L30 20 M30 0 L0 20" stroke="#fff" stroke-width="3"/>
      <path d="M0 0 L30 20 M30 0 L0 20" stroke="#C8102E" stroke-width="1.5"/>
      ${rect(12, 0, 6, 20, '#fff')}${rect(0, 7, 30, 6, '#fff')}
      ${rect(13, 0, 4, 20, '#C8102E')}${rect(0, 8, 30, 4, '#C8102E')}
      <g fill="#fff">
        <circle cx="45" cy="10" r="1.2"/><circle cx="40" cy="16" r="1"/><circle cx="50" cy="16" r="1"/>
        <circle cx="42" cy="24" r="1"/><circle cx="48" cy="24" r="1"/><circle cx="45" cy="30" r="1.4"/>
      </g>`,
    ),
  ae: () =>
    svg(`${stripeH(['#00732F', '#fff', '#000'])}${rect(0, 0, 16, 40, '#FF0000')}`),
  sa: () =>
    svg(
      `${rect(0, 0, 60, 40, '#165d31')}
      <text x="30" y="18" text-anchor="middle" font-size="7" fill="#fff" font-family="Arial">لا إله إلا الله</text>
      <path d="M18 28 h24" stroke="#fff" stroke-width="2"/>
      <path d="M40 26 q6 2 0 6" fill="none" stroke="#fff" stroke-width="1.5"/>`,
    ),
  tr: () =>
    svg(
      `${rect(0, 0, 60, 40, '#E30A17')}
      <circle cx="26" cy="20" r="9" fill="#fff"/>
      <circle cx="29" cy="20" r="7.2" fill="#E30A17"/>
      <polygon points="36,14 37.5,18.2 42,18.2 38.4,20.8 39.8,25 36,22.2 32.2,25 33.6,20.8 30,18.2 34.5,18.2" fill="#fff"/>`,
    ),
  de: () => svg(stripeH(['#000', '#DD0000', '#FFCE00'])),
  fr: () => svg(stripeV(['#002395', '#fff', '#ED2939'])),
  it: () => svg(stripeV(['#009246', '#fff', '#CE2B37'])),
  es: () =>
    svg(
      `${rect(0, 0, 60, 10, '#AA151B')}${rect(0, 10, 60, 20, '#F1BF00')}${rect(0, 30, 60, 10, '#AA151B')}
      <rect x="14" y="14" width="10" height="12" fill="#C60B1E" stroke="#fff" stroke-width="0.5"/>`,
    ),
  br: () =>
    svg(
      `${rect(0, 0, 60, 40, '#009C3B')}
      <polygon points="30,5 55,20 30,35 5,20" fill="#FFDF00"/>
      <circle cx="30" cy="20" r="8" fill="#002776"/>
      <path d="M22 21 q8 -5 16 0" fill="none" stroke="#fff" stroke-width="1.5"/>`,
    ),
  jp: () => svg(`${rect(0, 0, 60, 40, '#fff')}<circle cx="30" cy="20" r="9" fill="#BC002D"/>`),
  cn: () =>
    svg(
      `${rect(0, 0, 60, 40, '#DE2910')}
      <polygon points="12,8 13.5,12.5 18,12.5 14.5,15.2 15.8,19.5 12,16.8 8.2,19.5 9.5,15.2 6,12.5 10.5,12.5" fill="#FFDE00"/>
      <g fill="#FFDE00">
        <circle cx="24" cy="7" r="1.2"/><circle cx="28" cy="11" r="1.2"/>
        <circle cx="28" cy="17" r="1.2"/><circle cx="24" cy="21" r="1.2"/>
      </g>`,
    ),
  kr: () =>
    svg(
      `${rect(0, 0, 60, 40, '#fff')}
      <circle cx="30" cy="20" r="8" fill="#CD2E3A"/>
      <path d="M22 20 a8 8 0 0 1 16 0" fill="#0047A0"/>
      <g stroke="#000" stroke-width="2">
        <line x1="14" y1="8" x2="20" y2="14"/><line x1="40" y1="26" x2="46" y2="32"/>
        <line x1="40" y1="8" x2="46" y2="14"/><line x1="14" y1="26" x2="20" y2="32"/>
      </g>`,
    ),
  my: () => {
    const stripes = Array.from({ length: 14 }, (_, i) =>
      rect(0, (i * 40) / 14, 60, 40 / 14 + 0.2, i % 2 === 0 ? '#CC0001' : '#fff'),
    ).join('');
    return svg(
      `${stripes}${rect(0, 0, 28, (40 / 14) * 8, '#010066')}
      <circle cx="14" cy="11.5" r="6" fill="#FFCC00"/>
      <circle cx="16.5" cy="11.5" r="5" fill="#010066"/>
      <polygon points="22,8 23,11 26,11 23.7,12.8 24.7,16 22,14 19.3,16 20.3,12.8 18,11 21,11" fill="#FFCC00"/>`,
    );
  },
  sg: () =>
    svg(
      `${rect(0, 0, 60, 20, '#ED2939')}${rect(0, 20, 60, 20, '#fff')}
      <circle cx="12" cy="10" r="5" fill="#fff"/><circle cx="14" cy="10" r="4.2" fill="#ED2939"/>
      <g fill="#fff">${[0, 1, 2, 3, 4]
        .map((i) => {
          const a = (-90 + i * 72) * (Math.PI / 180);
          return `<circle cx="${18 + Math.cos(a) * 4}" cy="${10 + Math.sin(a) * 4}" r="0.8"/>`;
        })
        .join('')}</g>`,
    ),
  za: () =>
    svg(
      `${rect(0, 0, 60, 40, '#002395')}
      ${rect(0, 0, 60, 13.3, '#DE3831')}
      ${rect(0, 26.7, 60, 13.3, '#007A4D')}
      <polygon points="0,0 24,20 0,40" fill="#000"/>
      <polygon points="0,4 20,20 0,36" fill="#FFB612"/>
      <polygon points="0,9 14,20 0,31" fill="#fff"/>
      <path d="M16 18.5 H60 V21.5 H16 Z" fill="#fff"/>
      <path d="M18 19.2 H60 V20.8 H18 Z" fill="#007A4D"/>`,
    ),
  nz: () =>
    svg(
      `${rect(0, 0, 60, 40, '#00247D')}
      ${rect(0, 0, 30, 20, '#012169')}
      <path d="M0 0 L30 20 M30 0 L0 20" stroke="#fff" stroke-width="3"/>
      <path d="M0 0 L30 20 M30 0 L0 20" stroke="#C8102E" stroke-width="1.5"/>
      ${rect(12, 0, 6, 20, '#fff')}${rect(0, 7, 30, 6, '#fff')}
      ${rect(13, 0, 4, 20, '#C8102E')}${rect(0, 8, 30, 4, '#C8102E')}
      <g fill="#CC142B">
        <circle cx="44" cy="12" r="1.4"/><circle cx="40" cy="18" r="1.1"/>
        <circle cx="50" cy="18" r="1.1"/><circle cx="45" cy="26" r="1.6"/>
      </g>`,
    ),
  qa: () =>
    svg(
      `${rect(0, 0, 60, 40, '#8A1538')}
      ${rect(0, 0, 18, 40, '#fff')}
      <path d="M18 0 l6 2.5 -6 2.5 6 2.5 -6 2.5 6 2.5 -6 2.5 6 2.5 -6 2.5 6 2.5 -6 2.5 6 2.5 -6 2.5 6 2.5 -6 2.5 6 2.5 -6 2.5" fill="#fff"/>`,
    ),
  kw: () =>
    svg(
      `${stripeH(['#007A3D', '#fff', '#CE1126'])}
      <polygon points="0,0 18,13.3 18,26.7 0,40" fill="#000"/>`,
    ),
  om: () =>
    svg(
      `${stripeH(['#fff', '#C8102E', '#00843D'])}
      ${rect(0, 0, 18, 40, '#C8102E')}
      <path d="M5 10 h8 M9 8 v10" stroke="#fff" stroke-width="1.5"/>`,
    ),
  bh: () =>
    svg(
      `${rect(0, 0, 60, 40, '#CE1126')}
      ${rect(0, 0, 18, 40, '#fff')}
      <path d="M18 0 l7 4 -7 4 7 4 -7 4 7 4 -7 4 7 4 -7 4 7 4 -7 4" fill="#fff"/>`,
    ),
  bd: () =>
    svg(`${rect(0, 0, 60, 40, '#006A4E')}<circle cx="26" cy="20" r="9" fill="#F42A41"/>`),
  lk: () =>
    svg(
      `${rect(0, 0, 10, 40, '#FFB700')}${rect(10, 0, 10, 40, '#00534E')}
      ${rect(20, 0, 40, 40, '#8D153A')}
      <rect x="26" y="8" width="28" height="24" fill="none" stroke="#FFBE29" stroke-width="2"/>
      <circle cx="40" cy="20" r="5" fill="#FFBE29"/>`,
    ),
  np: () =>
    svg(
      `${rect(0, 0, 60, 40, '#fff')}
      <path d="M8 4 L42 4 L8 22 Z" fill="#003893"/>
      <path d="M8 18 L48 18 L8 36 Z" fill="#DC143C"/>
      <circle cx="18" cy="12" r="2.4" fill="#fff"/>
      <polygon points="18,24 20,28 24,28 21,30.5 22,34.5 18,32 14,34.5 15,30.5 12,28 16,28" fill="#fff"/>`,
    ),
  af: () =>
    svg(
      `${stripeV(['#000', '#D32011', '#007A36'])}
      <circle cx="30" cy="20" r="6" fill="none" stroke="#fff" stroke-width="1.5"/>
      <path d="M27 17 h6 v6 h-6z" fill="#fff"/>`,
    ),
  id: () => svg(`${rect(0, 0, 60, 20, '#CE1126')}${rect(0, 20, 60, 20, '#fff')}`),
  ph: () =>
    svg(
      `${rect(0, 0, 60, 20, '#0038A8')}${rect(0, 20, 60, 20, '#CE1126')}
      <polygon points="0,0 24,20 0,40" fill="#fff"/>
      <circle cx="10" cy="20" r="4" fill="#FCD116"/>
      <g fill="#FCD116">${[0, 1, 2]
        .map((i) => {
          const a = (-90 + i * 120) * (Math.PI / 180);
          return `<circle cx="${10 + Math.cos(a) * 8}" cy="${20 + Math.sin(a) * 8}" r="1.2"/>`;
        })
        .join('')}</g>`,
    ),
  th: () =>
    svg(
      `${rect(0, 0, 60, 6.5, '#A51931')}${rect(0, 6.5, 60, 6.5, '#fff')}${rect(0, 13, 60, 14, '#2D2A4A')}
      ${rect(0, 27, 60, 6.5, '#fff')}${rect(0, 33.5, 60, 6.5, '#A51931')}`,
    ),
  vn: () =>
    svg(
      `${rect(0, 0, 60, 40, '#DA251D')}
      <polygon points="30,8 32.5,16.5 41.5,16.5 34.3,21.5 37,30 30,24.8 23,30 25.7,21.5 18.5,16.5 27.5,16.5" fill="#FFFF00"/>`,
    ),
  mx: () =>
    svg(
      `${stripeV(['#006847', '#fff', '#CE1126'])}
      <circle cx="30" cy="20" r="5" fill="#8B4513"/>
      <circle cx="30" cy="20" r="2.5" fill="#C4A000"/>`,
    ),
  ar: () =>
    svg(
      `${stripeH(['#74ACDF', '#fff', '#74ACDF'])}
      <circle cx="30" cy="20" r="4.5" fill="#F6B40E"/>
      <circle cx="30" cy="20" r="2.2" fill="#DB7A00"/>`,
    ),
  eg: () =>
    svg(
      `${stripeH(['#CE1126', '#fff', '#000'])}
      <path d="M26 16 h8 l-1 8 h-6z" fill="#C09300"/>
      <circle cx="30" cy="14" r="2" fill="#C09300"/>`,
    ),
  ng: () => svg(stripeV(['#008751', '#fff', '#008751'])),
  ke: () =>
    svg(
      `${stripeH(['#000', '#fff', '#BB0000', '#fff', '#006600'])}
      <ellipse cx="30" cy="20" rx="7" ry="10" fill="#fff"/>
      <ellipse cx="30" cy="20" rx="5" ry="8" fill="#000"/>
      <path d="M30 12 v16" stroke="#BB0000" stroke-width="2"/>`,
    ),
  ma: () =>
    svg(
      `${rect(0, 0, 60, 40, '#C1272D')}
      <polygon points="30,8 33,18 43,18 35,24 38,34 30,27 22,34 25,24 17,18 27,18" fill="none" stroke="#006233" stroke-width="2"/>`,
    ),
};

for (const [code, make] of Object.entries(flags)) {
  fs.writeFileSync(path.join(flagsDir, `${code}.svg`), make(), 'utf8');
}

console.log(`Wrote ${Object.keys(flags).length} flag SVGs to ${flagsDir}`);
