const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const fontConfigRoot = path.join(os.tmpdir(), 'food-expose-fontconfig');
const fontCache = path.join(fontConfigRoot, 'cache');
const fontConfigFile = path.join(fontConfigRoot, 'fonts.conf');
fs.mkdirSync(fontCache, { recursive: true });
fs.mkdirSync(path.join(fontConfigRoot, 'fontconfig', 'cache'), { recursive: true });
fs.mkdirSync(path.join(fontConfigRoot, '.cache', 'fontconfig'), {
  recursive: true,
});
if (!fs.existsSync(fontConfigFile)) {
  const fontDirectory = path
    .join(process.env.WINDIR || 'C:\\Windows', 'Fonts')
    .replace(/\\/g, '/');
  const cacheDirectory = fontCache.replace(/\\/g, '/');
  fs.writeFileSync(
    fontConfigFile,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontDirectory}</dir>
  <cachedir>${cacheDirectory}</cachedir>
</fontconfig>
`,
    'utf8'
  );
}
process.env.FONTCONFIG_PATH = fontConfigRoot;
process.env.FONTCONFIG_FILE = 'fonts.conf';
process.env.LOCALAPPDATA = fontConfigRoot;
process.env.XDG_CACHE_HOME = fontConfigRoot;
process.env.HOME = fontConfigRoot;

const sharp = require('sharp');

const { contentFingerprint } = require('./utils');

const THEMES = Object.freeze({
  green: {
    background: '#F4FAF7',
    panel: '#FFFFFF',
    accent: '#1D9E75',
    accentSoft: '#DDF3EA',
    text: '#12342C',
    muted: '#58726B',
  },
  warning: {
    background: '#FFF9F0',
    panel: '#FFFFFF',
    accent: '#D96B2B',
    accentSoft: '#FCE6D4',
    text: '#3A271E',
    muted: '#78655C',
  },
  evidence: {
    background: '#F4F7FB',
    panel: '#FFFFFF',
    accent: '#3568A8',
    accentSoft: '#DFEAF7',
    text: '#182B42',
    muted: '#617185',
  },
});

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxCharacters) {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => {
      if (word.length <= maxCharacters) return [word];
      const chunks = [];
      for (let index = 0; index < word.length; index += maxCharacters) {
        chunks.push(word.slice(index, index + maxCharacters));
      }
      return chunks;
    });
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function renderTextLines(lines, x, startY, options = {}) {
  const {
    fontSize = 70,
    lineHeight = Math.round(fontSize * 1.15),
    fill = '#12342C',
    weight = 700,
    maxLines = 6,
  } = options;
  return lines
    .slice(0, maxLines)
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" ` +
        `font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" ` +
        `font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`
    )
    .join('\n');
}

function buildSlideSvg(slide, config, index, total, hasSourceAsset = false) {
  const { width, height, safeZone } = config.rendering;
  const theme = THEMES[slide.theme] || THEMES.green;
  const contentWidth = width - safeZone.left - safeZone.right;
  const headlineSize =
    slide.headline.length > 100 ? 56 : slide.headline.length > 65 ? 64 : 72;
  const headlineLines = wrapText(
    slide.headline,
    Math.max(18, Math.floor(contentWidth / (headlineSize * 0.53)))
  );
  const headlineY = safeZone.top + 180;
  const bodyY =
    headlineY + headlineLines.length * Math.round(headlineSize * 1.15) + 90;
  const bodyLines = wrapText(
    slide.body || '',
    Math.max(24, Math.floor(contentWidth / 30))
  );

  const footer =
    index === total - 1
      ? 'Food Exposé'
      : `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${theme.background}" ${
      hasSourceAsset ? 'opacity="0.22"' : ''
    }/>
    ${
      hasSourceAsset
        ? `<rect width="${width}" height="${height}" fill="#102C25" opacity="0.20"/>`
        : ''
    }
    <circle cx="${width - 130}" cy="130" r="210" fill="${theme.accentSoft}" opacity="0.72"/>
    <rect x="${safeZone.left}" y="${safeZone.top}" width="${contentWidth}"
      height="${height - safeZone.top - safeZone.bottom}" rx="24" fill="${theme.panel}"/>
    <rect x="${safeZone.left + 48}" y="${safeZone.top + 54}" width="112" height="12"
      rx="6" fill="${theme.accent}"/>
    ${renderTextLines(headlineLines, safeZone.left + 48, headlineY, {
      fontSize: headlineSize,
      fill: theme.text,
      weight: 800,
      maxLines: 6,
    })}
    ${renderTextLines(bodyLines, safeZone.left + 48, bodyY, {
      fontSize: 34,
      lineHeight: 49,
      fill: theme.muted,
      weight: 500,
      maxLines: 9,
    })}
    <text x="${safeZone.left + 48}" y="${height - safeZone.bottom + 95}"
      font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700"
      fill="${theme.accent}">${escapeXml(footer)}</text>
  </svg>`;
}

async function renderSlide(slide, outputPath, config, index, total) {
  const sourceAsset =
    slide.source_asset && fs.existsSync(slide.source_asset)
      ? slide.source_asset
      : null;
  const svg = buildSlideSvg(slide, config, index, total, Boolean(sourceAsset));
  const pipeline = sourceAsset
    ? sharp(sourceAsset)
        .resize(config.rendering.width, config.rendering.height, {
          fit: 'cover',
          position: 'centre',
        })
        .composite([{ input: Buffer.from(svg), blend: 'over' }])
    : sharp(Buffer.from(svg));
  await pipeline
    .jpeg({ quality: config.rendering.quality, chromaSubsampling: '4:4:4' })
    .toFile(outputPath);
  const metadata = await sharp(outputPath).metadata();
  return {
    path: outputPath,
    width: metadata.width,
    height: metadata.height,
    hash: contentFingerprint(slide.headline, slide.body, svg),
  };
}

async function renderStoryboard(storyboard, packageDirectory, config) {
  if (!Array.isArray(storyboard) || storyboard.length < 3 || storyboard.length > 7) {
    throw new Error('A slideshow storyboard must contain 3 to 7 slides.');
  }
  fs.mkdirSync(packageDirectory, { recursive: true });
  const assets = [];
  for (let index = 0; index < storyboard.length; index += 1) {
    const outputPath = path.join(
      packageDirectory,
      `slide-${String(index + 1).padStart(2, '0')}.jpg`
    );
    assets.push(
      await renderSlide(storyboard[index], outputPath, config, index, storyboard.length)
    );
  }
  return assets;
}

module.exports = {
  THEMES,
  buildSlideSvg,
  renderSlide,
  renderStoryboard,
  wrapText,
};
