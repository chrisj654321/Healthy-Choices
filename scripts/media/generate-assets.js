/**
 * generate-assets.js
 * Generates all Expo required image assets from SVG:
 *   assets/icon.png           1024×1024  (App Store / Google Play icon)
 *   assets/adaptive-icon.png  1024×1024  (Android adaptive foreground)
 *   assets/splash.png         1284×2778  (iOS splash — safe area centred)
 *   assets/favicon.png          48×48    (Web favicon)
 *
 * Run once:  node scripts/media/generate-assets.js
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const ASSETS = path.join(__dirname, '..', '..', 'assets');
fs.mkdirSync(ASSETS, { recursive: true });

// ─── Brand colours ────────────────────────────────────────────────────────────
const GREEN      = '#1D9E75';
const GREEN_DARK = '#157A5A';
const GREEN_MID  = '#25B585';
const TAN        = '#D4A96A';
const TAN_DARK   = '#B8894E';
const RED        = '#E05252';
const YELLOW     = '#F5C842';

// ─── Picnic-basket SVG ────────────────────────────────────────────────────────
// Always draws at 1024 internal coordinates.
// bg: fill colour for the background rect ('white', 'none', or any hex)
// scale: wraps basket in a <g transform> so it fits within a safe zone (e.g. 0.72)
function basketSVG(size = 1024, { bg = 'white', scale = 1.0 } = {}) {
  const sc = size / 1024;
  const s  = (n) => Math.round(n * sc);

  // Centre the scaled content inside the canvas
  const tx = Math.round((size * (1 - scale)) / 2);
  const ty = Math.round((size * (1 - scale)) / 2);
  const openGroup  = scale !== 1.0 ? `<g transform="translate(${tx},${ty}) scale(${scale})">` : `<g>`;
  const closeGroup = `</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${bg}"/>
  ${openGroup}

  <!-- ── Basket body ───────────────────────────────────────────────────── -->
  <!-- Wicker base (rounded trapezoid) -->
  <path d="
    M ${s(240)} ${s(520)}
    Q ${s(230)} ${s(520)} ${s(230)} ${s(530)}
    L ${s(260)} ${s(780)}
    Q ${s(260)} ${s(800)} ${s(280)} ${s(800)}
    L ${s(744)} ${s(800)}
    Q ${s(764)} ${s(800)} ${s(764)} ${s(780)}
    L ${s(794)} ${s(530)}
    Q ${s(794)} ${s(520)} ${s(784)} ${s(520)}
    Z
  " fill="${TAN}" stroke="${TAN_DARK}" stroke-width="${s(8)}" stroke-linejoin="round"/>

  <!-- Wicker horizontal lines -->
  <line x1="${s(240)}" y1="${s(580)}" x2="${s(784)}" y2="${s(580)}" stroke="${TAN_DARK}" stroke-width="${s(5)}" stroke-linecap="round"/>
  <line x1="${s(245)}" y1="${s(640)}" x2="${s(779)}" y2="${s(640)}" stroke="${TAN_DARK}" stroke-width="${s(5)}" stroke-linecap="round"/>
  <line x1="${s(252)}" y1="${s(700)}" x2="${s(772)}" y2="${s(700)}" stroke="${TAN_DARK}" stroke-width="${s(5)}" stroke-linecap="round"/>
  <line x1="${s(258)}" y1="${s(758)}" x2="${s(766)}" y2="${s(758)}" stroke="${TAN_DARK}" stroke-width="${s(5)}" stroke-linecap="round"/>

  <!-- Wicker vertical lines -->
  <line x1="${s(320)}" y1="${s(522)}" x2="${s(296)}" y2="${s(798)}" stroke="${TAN_DARK}" stroke-width="${s(4)}" stroke-linecap="round"/>
  <line x1="${s(400)}" y1="${s(520)}" x2="${s(390)}" y2="${s(800)}" stroke="${TAN_DARK}" stroke-width="${s(4)}" stroke-linecap="round"/>
  <line x1="${s(480)}" y1="${s(520)}" x2="${s(480)}" y2="${s(800)}" stroke="${TAN_DARK}" stroke-width="${s(4)}" stroke-linecap="round"/>
  <line x1="${s(560)}" y1="${s(520)}" x2="${s(570)}" y2="${s(800)}" stroke="${TAN_DARK}" stroke-width="${s(4)}" stroke-linecap="round"/>
  <line x1="${s(640)}" y1="${s(520)}" x2="${s(656)}" y2="${s(798)}" stroke="${TAN_DARK}" stroke-width="${s(4)}" stroke-linecap="round"/>
  <line x1="${s(720)}" y1="${s(522)}" x2="${s(736)}" y2="${s(798)}" stroke="${TAN_DARK}" stroke-width="${s(4)}" stroke-linecap="round"/>

  <!-- ── Lid ──────────────────────────────────────────────────────────── -->
  <path d="
    M ${s(210)} ${s(500)}
    Q ${s(210)} ${s(480)} ${s(230)} ${s(480)}
    L ${s(794)} ${s(480)}
    Q ${s(814)} ${s(480)} ${s(814)} ${s(500)}
    L ${s(814)} ${s(540)}
    Q ${s(814)} ${s(560)} ${s(794)} ${s(560)}
    L ${s(230)} ${s(560)}
    Q ${s(210)} ${s(560)} ${s(210)} ${s(540)}
    Z
  " fill="${GREEN}" stroke="${GREEN_DARK}" stroke-width="${s(7)}" stroke-linejoin="round"/>

  <!-- Lid stripe pattern -->
  <clipPath id="lidClip">
    <path d="M ${s(210)} ${s(480)} L ${s(814)} ${s(480)} L ${s(814)} ${s(560)} L ${s(210)} ${s(560)} Z"/>
  </clipPath>
  <g clip-path="url(#lidClip)">
    <line x1="${s(270)}" y1="${s(480)}" x2="${s(270)}" y2="${s(560)}" stroke="${GREEN_MID}" stroke-width="${s(18)}" opacity="0.4"/>
    <line x1="${s(350)}" y1="${s(480)}" x2="${s(350)}" y2="${s(560)}" stroke="${GREEN_MID}" stroke-width="${s(18)}" opacity="0.4"/>
    <line x1="${s(430)}" y1="${s(480)}" x2="${s(430)}" y2="${s(560)}" stroke="${GREEN_MID}" stroke-width="${s(18)}" opacity="0.4"/>
    <line x1="${s(510)}" y1="${s(480)}" x2="${s(510)}" y2="${s(560)}" stroke="${GREEN_MID}" stroke-width="${s(18)}" opacity="0.4"/>
    <line x1="${s(590)}" y1="${s(480)}" x2="${s(590)}" y2="${s(560)}" stroke="${GREEN_MID}" stroke-width="${s(18)}" opacity="0.4"/>
    <line x1="${s(670)}" y1="${s(480)}" x2="${s(670)}" y2="${s(560)}" stroke="${GREEN_MID}" stroke-width="${s(18)}" opacity="0.4"/>
    <line x1="${s(750)}" y1="${s(480)}" x2="${s(750)}" y2="${s(560)}" stroke="${GREEN_MID}" stroke-width="${s(18)}" opacity="0.4"/>
  </g>

  <!-- ── Handle ───────────────────────────────────────────────────────── -->
  <path d="
    M ${s(340)} ${s(480)}
    C ${s(340)} ${s(350)} ${s(420)} ${s(280)} ${s(512)} ${s(280)}
    C ${s(604)} ${s(280)} ${s(684)} ${s(350)} ${s(684)} ${s(480)}
  " fill="none" stroke="${TAN_DARK}" stroke-width="${s(26)}" stroke-linecap="round"/>
  <!-- Handle highlight -->
  <path d="
    M ${s(340)} ${s(480)}
    C ${s(340)} ${s(350)} ${s(420)} ${s(280)} ${s(512)} ${s(280)}
    C ${s(604)} ${s(280)} ${s(684)} ${s(350)} ${s(684)} ${s(480)}
  " fill="none" stroke="${TAN}" stroke-width="${s(12)}" stroke-linecap="round"/>

  <!-- ── Food peeking out of top ──────────────────────────────────────── -->
  <!-- Red apple -->
  <ellipse cx="${s(390)}" cy="${s(470)}" rx="${s(46)}" ry="${s(44)}" fill="${RED}"/>
  <path d="M ${s(390)} ${s(428)} Q ${s(398)} ${s(408)} ${s(410)} ${s(420)}" stroke="${GREEN_DARK}" stroke-width="${s(6)}" fill="none" stroke-linecap="round"/>
  <!-- Apple shine -->
  <ellipse cx="${s(372)}" cy="${s(452)}" rx="${s(10)}" ry="${s(14)}" fill="white" opacity="0.35" transform="rotate(-20,${s(372)},${s(452)})"/>

  <!-- Yellow banana -->
  <path d="
    M ${s(540)} ${s(485)}
    C ${s(535)} ${s(440)} ${s(565)} ${s(415)} ${s(605)} ${s(430)}
    C ${s(640)} ${s(445)} ${s(645)} ${s(475)} ${s(625)} ${s(490)}
    C ${s(605)} ${s(500)} ${s(570)} ${s(500)} ${s(540)} ${s(485)}
  " fill="${YELLOW}" stroke="#C8A000" stroke-width="${s(4)}"/>

  <!-- Green leaf / herb sprig -->
  <ellipse cx="${s(460)}" cy="${s(460)}" rx="${s(22)}" ry="${s(36)}" fill="${GREEN}" transform="rotate(-30,${s(460)},${s(460)})"/>
  <line x1="${s(460)}" y1="${s(490)}" x2="${s(460)}" y2="${s(430)}" stroke="${GREEN_DARK}" stroke-width="${s(4)}" stroke-linecap="round" transform="rotate(-30,${s(460)},${s(460)})"/>

  <!-- ── Subtle drop shadow under basket ──────────────────────────────── -->
  <ellipse cx="${s(512)}" cy="${s(820)}" rx="${s(280)}" ry="${s(22)}" fill="#00000015"/>
  ${closeGroup}
</svg>`;
}

// ─── Splash SVG (logo centred on green background) ────────────────────────────
function splashSVG(w = 1284, h = 2778) {
  const iconSize = 320;
  const ix = (w - iconSize) / 2;
  const iy = (h - iconSize) / 2 - 60;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${GREEN}"/>
  <!-- Subtle radial glow -->
  <radialGradient id="glow" cx="50%" cy="48%" r="38%">
    <stop offset="0%" stop-color="white" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="white" stop-opacity="0"/>
  </radialGradient>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <!-- White rounded card for the icon -->
  <rect x="${ix}" y="${iy}" width="${iconSize}" height="${iconSize}" rx="72" ry="72" fill="white" opacity="0.97"/>
  <!-- Basket: scale 1024→iconSize, then translate into card position -->
  <g transform="translate(${ix},${iy}) scale(${iconSize / 1024})">
    <g transform="translate(${Math.round(1024*(1-0.82)/2)},${Math.round(1024*(1-0.82)/2)}) scale(0.82)">
      <!-- basket body -->
      <path d="M 240 520 Q 230 520 230 530 L 260 780 Q 260 800 280 800 L 744 800 Q 764 800 764 780 L 794 530 Q 794 520 784 520 Z" fill="${TAN}" stroke="${TAN_DARK}" stroke-width="8" stroke-linejoin="round"/>
      <line x1="240" y1="580" x2="784" y2="580" stroke="${TAN_DARK}" stroke-width="5" stroke-linecap="round"/>
      <line x1="245" y1="640" x2="779" y2="640" stroke="${TAN_DARK}" stroke-width="5" stroke-linecap="round"/>
      <line x1="252" y1="700" x2="772" y2="700" stroke="${TAN_DARK}" stroke-width="5" stroke-linecap="round"/>
      <line x1="258" y1="758" x2="766" y2="758" stroke="${TAN_DARK}" stroke-width="5" stroke-linecap="round"/>
      <line x1="320" y1="522" x2="296" y2="798" stroke="${TAN_DARK}" stroke-width="4" stroke-linecap="round"/>
      <line x1="400" y1="520" x2="390" y2="800" stroke="${TAN_DARK}" stroke-width="4" stroke-linecap="round"/>
      <line x1="480" y1="520" x2="480" y2="800" stroke="${TAN_DARK}" stroke-width="4" stroke-linecap="round"/>
      <line x1="560" y1="520" x2="570" y2="800" stroke="${TAN_DARK}" stroke-width="4" stroke-linecap="round"/>
      <line x1="640" y1="520" x2="656" y2="798" stroke="${TAN_DARK}" stroke-width="4" stroke-linecap="round"/>
      <line x1="720" y1="522" x2="736" y2="798" stroke="${TAN_DARK}" stroke-width="4" stroke-linecap="round"/>
      <!-- lid -->
      <path d="M 210 500 Q 210 480 230 480 L 794 480 Q 814 480 814 500 L 814 540 Q 814 560 794 560 L 230 560 Q 210 560 210 540 Z" fill="${GREEN}" stroke="${GREEN_DARK}" stroke-width="7" stroke-linejoin="round"/>
      <!-- handle -->
      <path d="M 340 480 C 340 350 420 280 512 280 C 604 280 684 350 684 480" fill="none" stroke="${TAN_DARK}" stroke-width="26" stroke-linecap="round"/>
      <path d="M 340 480 C 340 350 420 280 512 280 C 604 280 684 350 684 480" fill="none" stroke="${TAN}" stroke-width="12" stroke-linecap="round"/>
      <!-- apple -->
      <ellipse cx="390" cy="470" rx="46" ry="44" fill="${RED}"/>
      <ellipse cx="372" cy="452" rx="10" ry="14" fill="white" opacity="0.35" transform="rotate(-20,372,452)"/>
      <!-- banana -->
      <path d="M 540 485 C 535 440 565 415 605 430 C 640 445 645 475 625 490 C 605 500 570 500 540 485" fill="${YELLOW}" stroke="#C8A000" stroke-width="4"/>
      <!-- herb -->
      <ellipse cx="460" cy="460" rx="22" ry="36" fill="${GREEN}" transform="rotate(-30,460,460)"/>
    </g>
  </g>
  <!-- App name -->
  <text x="${w/2}" y="${iy + iconSize + 80}" text-anchor="middle"
        font-size="72" font-weight="700" fill="white" font-family="-apple-system, Helvetica, Arial, sans-serif"
        letter-spacing="-1">Healthy Choices</text>
  <text x="${w/2}" y="${iy + iconSize + 148}" text-anchor="middle"
        font-size="38" fill="white" font-family="-apple-system, Helvetica, Arial, sans-serif"
        opacity="0.75">Scan. Know. Choose better.</text>
</svg>`;
}

// ─── Generate ─────────────────────────────────────────────────────────────────
async function run() {
  console.log('Generating assets…');

  // icon.png  1024×1024
  await sharp(Buffer.from(basketSVG(1024)))
    .png()
    .toFile(path.join(ASSETS, 'icon.png'));
  console.log('  ✓ assets/icon.png (1024×1024)');

  // adaptive-icon.png  1024×1024 — transparent bg, scaled to 72% for Android safe zone
  await sharp(Buffer.from(basketSVG(1024, { bg: 'none', scale: 0.72 })))
    .png()
    .toFile(path.join(ASSETS, 'adaptive-icon.png'));
  console.log('  ✓ assets/adaptive-icon.png (1024×1024, transparent bg)');

  // favicon.png  48×48
  await sharp(Buffer.from(basketSVG(1024)))
    .resize(48, 48)
    .png()
    .toFile(path.join(ASSETS, 'favicon.png'));
  console.log('  ✓ assets/favicon.png (48×48)');

  // splash.png  1284×2778
  await sharp(Buffer.from(splashSVG(1284, 2778)))
    .png()
    .toFile(path.join(ASSETS, 'splash.png'));
  console.log('  ✓ assets/splash.png (1284×2778)');

  console.log('\nAll assets written to assets/');
}

run().catch((e) => { console.error(e); process.exit(1); });
