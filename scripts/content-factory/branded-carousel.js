const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

const { loadConfig } = require('./config');

const ACCEPTED_IMAGE_ORIGINS = new Set([
  'official_brand',
  'openfoodfacts',
  'retailer',
  'founder_created',
  'licensed',
]);

const ACCEPTED_RIGHTS = new Set([
  'editorial_product_reference',
  'founder_created',
  'licensed',
  'cleared',
]);

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(value, limit) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (!line || candidate.length <= limit) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function svgText(lines, x, y, options = {}) {
  const {
    size = 28,
    lineHeight = Math.round(size * 1.12),
    fill = '#1B1B1B',
    weight = 600,
    anchor = 'start',
  } = options;
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" text-anchor="${anchor}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`
    )
    .join('\n');
}

function validateCard(card, slideIndex, cardIndex) {
  const prefix = `Slide ${slideIndex + 1}, product ${cardIndex + 1}`;
  const required = [
    'brand',
    'name',
    'variant',
    'barcode',
    'image_origin',
    'image_source_url',
    'asset_rights',
    'reason',
    'claim_ids',
  ];
  const errors = required
    .filter((field) => !card[field] || (Array.isArray(card[field]) && card[field].length === 0))
    .map((field) => `${prefix} is missing ${field}.`);
  if (!card.image_path && !card.image_url) {
    errors.push(`${prefix} needs a local image_path or an image_url.`);
  }
  if (!ACCEPTED_IMAGE_ORIGINS.has(card.image_origin)) {
    errors.push(`${prefix} has an unsupported image_origin.`);
  }
  if (!ACCEPTED_RIGHTS.has(card.asset_rights)) {
    errors.push(`${prefix} has unresolved image rights.`);
  }
  if (/\b(generic|placeholder|unbranded|unknown)\b/i.test(`${card.brand} ${card.name} ${card.variant}`)) {
    errors.push(`${prefix} cannot use a generic or placeholder product.`);
  }
  if (String(card.reason).trim().length > 86) {
    errors.push(`${prefix} reason must be 86 characters or less for a readable grid.`);
  }
  return errors;
}

function validateSpec(spec) {
  const errors = [];
  if (!spec || typeof spec !== 'object') return ['Input must be a JSON object.'];
  if (!spec.title) errors.push('Carousel needs a title.');
  if (!Array.isArray(spec.slides) || spec.slides.length < 2 || spec.slides.length > 7) {
    errors.push('Carousel needs 2-7 slides.');
  }
  for (const [slideIndex, slide] of (spec.slides || []).entries()) {
    if (!['cover', 'grid', 'split_grid', 'checklist', 'cta'].includes(slide.type)) {
      errors.push(`Slide ${slideIndex + 1} has an unsupported type.`);
      continue;
    }
    if (!slide.headline) errors.push(`Slide ${slideIndex + 1} needs a headline.`);
    if (slide.type === 'cover' && slide.cover_image_url) {
      if (!ACCEPTED_IMAGE_ORIGINS.has(slide.cover_image_origin)) {
        errors.push(`Slide ${slideIndex + 1} cover has an unsupported image origin.`);
      }
      if (spec.require_official_brand_images && slide.cover_image_origin !== 'official_brand') {
        errors.push(`Slide ${slideIndex + 1} cover must use an official brand image.`);
      }
      if (!slide.cover_image_source_url) {
        errors.push(`Slide ${slideIndex + 1} cover needs an image source URL.`);
      }
    }
    if (slide.type === 'grid' || slide.type === 'split_grid') {
      if (!['avoid', 'better', 'neutral'].includes(slide.verdict)) {
        errors.push(`Slide ${slideIndex + 1} needs verdict avoid, better, or neutral.`);
      }
      const minProducts = slide.type === 'split_grid' ? 6 : 2;
      const maxProducts = slide.type === 'split_grid' ? 6 : 12;
      if (!Array.isArray(slide.products) || slide.products.length < minProducts || slide.products.length > maxProducts) {
        errors.push(`Slide ${slideIndex + 1} needs ${slide.type === 'split_grid' ? 'exactly 6' : '2-12'} named products.`);
      }
      if (slide.type === 'split_grid' && Array.isArray(slide.products) && !slide.products.every((card) => ['SKIP', 'TRY THIS'].includes(String(card.decision || '').toUpperCase()))) {
        errors.push(`Slide ${slideIndex + 1} split grid products need a SKIP or TRY THIS decision.`);
      }
      for (const [cardIndex, card] of (slide.products || []).entries()) {
        errors.push(...validateCard(card, slideIndex, cardIndex));
        if (spec.require_official_brand_images && card.image_origin !== 'official_brand') {
          errors.push(`Slide ${slideIndex + 1}, product ${cardIndex + 1} must use an official brand image.`);
        }
      }
    }
  }
  return errors;
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: new URL(url).origin,
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin',
      },
    }, (response) => {
      if ([301, 302, 307, 308].includes(response.statusCode) && response.headers.location) {
        response.resume();
        return resolve(download(new URL(response.headers.location, url).toString(), destination));
      }
      if (response.statusCode !== 200) {
        response.resume();
        return reject(new Error(`Image request failed with HTTP ${response.statusCode}: ${url}`));
      }
      const stream = fs.createWriteStream(destination);
      response.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
      stream.on('error', reject);
    });
    request.on('error', reject);
    request.setTimeout(25000, () => request.destroy(new Error(`Image request timed out: ${url}`)));
  });
}

async function ensureProductImages(spec, outputDirectory, fetchAssets) {
  const imageDirectory = path.join(outputDirectory, 'source-images');
  fs.mkdirSync(imageDirectory, { recursive: true });
  for (const slide of spec.slides) {
    if (slide.cover_image_url) {
      const extension = path.extname(new URL(slide.cover_image_url).pathname) || '.jpg';
      const filename = `cover-${crypto.createHash('sha1').update(slide.cover_image_url).digest('hex').slice(0, 8)}${extension}`;
      const destination = path.join(imageDirectory, filename);
      if (!fs.existsSync(destination)) {
        if (!fetchAssets) throw new Error(`Missing local cover image for ${spec.title}. Run with --fetch-assets after reviewing the image source.`);
        await download(slide.cover_image_url, destination);
      }
      slide.cover_image_path = destination;
    }
    for (const card of slide.products || []) {
      if (card.image_path && fs.existsSync(card.image_path)) continue;
      if (!fetchAssets || !card.image_url) {
        throw new Error(`Missing local image for ${card.brand} ${card.name}. Run with --fetch-assets after reviewing the image source.`);
      }
      const extension = path.extname(new URL(card.image_url).pathname) || '.jpg';
      const filename = `${card.barcode}-${crypto.createHash('sha1').update(card.image_url).digest('hex').slice(0, 8)}${extension}`;
      const destination = path.join(imageDirectory, filename);
      if (!fs.existsSync(destination)) await download(card.image_url, destination);
      card.image_path = destination;
    }
  }
}

function paletteFor(verdict) {
  if (verdict === 'avoid') return { accent: '#C9362B', soft: '#FCE7E5', label: 'AVOID' };
  if (verdict === 'better') return { accent: '#16845B', soft: '#E2F4EA', label: 'BETTER CHOICES' };
  return { accent: '#234B7A', soft: '#E6EEF8', label: 'FOOD EXPOSÉ' };
}

function gridLayout(count) {
  const columns = count <= 2 ? 2 : count <= 6 ? 3 : 4;
  const rows = Math.ceil(count / columns);
  const margin = 58;
  const gap = 22;
  const width = Math.floor((1080 - margin * 2 - gap * (columns - 1)) / columns);
  const startY = 470;
  const availableHeight = 1100;
  const height = Math.floor((availableHeight - gap * (rows - 1)) / rows);
  return { columns, rows, margin, gap, width, height, startY };
}

function gridImageTopOffset(card) {
  return Number.isFinite(Number(card.score)) ? 96 : 6;
}

function gridImageHeight(grid) {
  return Math.min(560, Math.max(340, grid.height - 225));
}

function splitGridCards(slide) {
  const slots = { SKIP: 0, 'TRY THIS': 0 };
  const margin = 44;
  const gap = 18;
  const width = Math.floor((1080 - margin * 2 - gap * 2) / 3);
  return slide.products.map((card) => {
    const decision = String(card.decision || '').toUpperCase();
    const slot = slots[decision]++;
    return {
      card,
      decision,
      x: margin + slot * (width + gap),
      y: decision === 'SKIP' ? 464 : 1124,
      width,
    };
  });
}

function buildSplitGridSvg(slide) {
  const cards = splitGridCards(slide).map(({ card, decision, x, y, width }) => {
    const centerX = x + width / 2;
    const accent = decision === 'SKIP' ? '#C9362B' : '#16845B';
    const score = Number(card.score);
    const brand = wrapText(card.brand, 18).slice(0, 1);
    const name = wrapText(card.short_name || card.name, 19).slice(0, 2);
    const points = Array.isArray(card.points) && card.points.length
      ? card.points.slice(0, 3).map((point) => `• ${point}`)
      : wrapText(card.reason, 21).slice(0, 2);
    return `
      <circle cx="${centerX}" cy="${y + 238}" r="39" fill="${accent}"/>
      <text x="${centerX}" y="${y + 249}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">${score}</text>
      ${svgText(brand, centerX, y + 304, { size: 24, fill: '#27312C', weight: 800, anchor: 'middle' })}
      ${svgText(name, centerX, y + 336, { size: 23, lineHeight: 27, fill: '#27312C', weight: 700, anchor: 'middle' })}
      ${svgText(points, centerX, y + 396, { size: Array.isArray(card.points) && card.points.length ? 20 : 23, lineHeight: Array.isArray(card.points) && card.points.length ? 26 : 28, fill: accent, weight: 900, anchor: 'middle' })}
    `;
  }).join('\n');
  const headline = wrapText(slide.headline.toUpperCase(), 22).slice(0, 2);
  const headerY = headline.length === 1 ? 246 : 206;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">
      <rect width="1080" height="1920" fill="#FFFFFF"/>
      <rect x="0" y="116" width="1080" height="${headline.length === 1 ? 174 : 244}" fill="#245E9B"/>
      ${svgText(headline, 540, headerY, { size: 62, lineHeight: 68, fill: '#FFFFFF', weight: 900, anchor: 'middle' })}
      <rect x="0" y="382" width="1080" height="62" fill="#C9362B"/>
      <text x="540" y="425" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">3 TO SKIP</text>
      <rect x="0" y="1042" width="1080" height="62" fill="#16845B"/>
      <text x="540" y="1085" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="#FFFFFF">3 BETTER PICKS</text>
      ${cards}
    </svg>`;
}

function buildGridSvg(slide, index, total) {
  const palette = paletteFor(slide.verdict);
  const accent = slide.accent || palette.accent;
  const grid = gridLayout(slide.products.length);
  const cards = slide.products.map((card, cardIndex) => {
    const column = cardIndex % grid.columns;
    const row = Math.floor(cardIndex / grid.columns);
    const x = grid.margin + column * (grid.width + grid.gap);
    const y = grid.startY + row * (grid.height + grid.gap);
    const imageHeight = gridImageHeight(grid);
    const imageTopOffset = gridImageTopOffset(card);
    const brandLines = wrapText(card.brand, grid.columns === 2 ? 25 : 19).slice(0, 1);
    const nameLines = wrapText(card.name, grid.columns === 2 ? 28 : 20).slice(0, 2);
    const detailLines = card.points || wrapText(card.reason, grid.columns === 2 ? 34 : 23).slice(0, 2);
    const centerX = x + grid.width / 2;
    const brandY = y + imageTopOffset + imageHeight + 48;
    const nameY = brandY + 34;
    const detailY = nameY + 82;
    const score = Number(card.score);
    const hasScore = Number.isFinite(score);
    const decision = String(card.decision || '').toUpperCase();
    const decisionColor = decision === 'SKIP' ? '#C9362B' : decision === 'TRY THIS' ? '#16845B' : accent;
    return `
      ${hasScore ? `<text x="${centerX}" y="${y + 36}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" fill="${decisionColor}">${escapeXml(decision)}</text><circle cx="${centerX}" cy="${y + 86}" r="43" fill="${decisionColor}"/><text x="${centerX}" y="${y + 96}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">${score}</text><text x="${centerX}" y="${y + 116}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="800" fill="#FFFFFF">/100</text>` : ''}
      ${svgText(brandLines, centerX, brandY, { size: grid.columns === 2 ? 27 : 23, fill: '#27312C', weight: 800, anchor: 'middle' })}
      ${svgText(nameLines, centerX, nameY, { size: grid.columns === 2 ? 26 : 22, lineHeight: grid.columns === 2 ? 31 : 27, fill: '#27312C', weight: 650, anchor: 'middle' })}
      ${svgText(detailLines, centerX, detailY, { size: grid.columns === 2 ? 25 : 22, lineHeight: grid.columns === 2 ? 34 : 27, fill: decisionColor, weight: 800, anchor: 'middle' })}
    `;
  }).join('\n');
  const header = wrapText(slide.headline.toUpperCase(), 22).slice(0, 2);
  const headerHeight = header.length === 1 ? 182 : 252;
  const headerY = header.length === 1 ? 260 : 210;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">
      <rect width="1080" height="1920" fill="#F8F7F3"/>
      <rect x="0" y="0" width="1080" height="288" fill="${palette.soft}"/>
      <text x="64" y="96" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="${palette.accent}">${palette.label}</text>
      ${svgText(wrapText(header, 22).slice(0, 2), 64, 166, { size: 64, lineHeight: 72, fill: '#19211D', weight: 800 })}
      <text x="64" y="1820" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#65716B">Food Exposé • turn it around</text>
      <text x="1016" y="1820" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#65716B">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</text>
      ${cards}
      <rect x="0" y="0" width="1080" height="410" fill="#FFFFFF"/>
      <rect x="0" y="126" width="1080" height="${headerHeight}" fill="${accent}"/>
      ${svgText(header, 540, headerY, { size: 60, lineHeight: 67, fill: '#FFFFFF', weight: 900, anchor: 'middle' })}
      <rect x="0" y="1700" width="1080" height="220" fill="#FFFFFF"/>
    </svg>`;
}

function buildSimpleSvg(slide) {
  const isCover = slide.type === 'cover';
  const isCta = slide.type === 'cta';
  const imageLedCover = isCover && Boolean(slide.cover_image_url);
  const imageLedCta = isCta && Boolean(slide.cta_image_path);
  const accent = slide.accent || (isCta ? '#17231D' : '#245E9B');
  const headline = wrapText(slide.headline.toUpperCase(), isCta ? 20 : 21).slice(0, 3);
  const stripHeight = headline.length === 1 ? 184 : headline.length === 2 ? 252 : 322;
  const headlineY = headline.length === 1 ? 260 : 208;
  const body = slide.items ? '' : (slide.body || '');
  const checklist = (slide.items || []).map((item, itemIndex) => {
    const y = 590 + itemIndex * 220;
    return `<circle cx="108" cy="${y - 14}" r="24" fill="${accent}"/><text x="108" y="${y - 5}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">${itemIndex + 1}</text>${svgText(wrapText(item, 25).slice(0, 2), 160, y, { size: 38, lineHeight: 47, fill: '#19211D', weight: 750 })}`;
  }).join('');
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">
      <rect width="1080" height="1920" fill="${imageLedCta ? 'none' : '#FFFFFF'}"/>
      ${imageLedCta ? '<rect width="1080" height="1160" fill="#071E15" opacity="0.56"/>' : ''}
      <rect x="0" y="126" width="1080" height="${stripHeight}" fill="${accent}" ${imageLedCta ? 'opacity="0.92"' : ''}/>
      ${svgText(headline, 540, headlineY, { size: isCta ? 66 : 64, lineHeight: 70, fill: '#FFFFFF', weight: 900, anchor: 'middle' })}
      ${imageLedCover ? '<ellipse cx="540" cy="1190" rx="390" ry="520" fill="#F1F5F2"/>' : ''}
      ${checklist}
      ${body && !imageLedCover ? svgText(wrapText(body, 26).slice(0, 3), 540, isCta ? 660 : 650, { size: 38, lineHeight: 48, fill: imageLedCta ? '#FFFFFF' : '#35443C', weight: 650, anchor: 'middle' }) : ''}
      ${isCta ? `<text x="540" y="800" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="900" fill="${imageLedCta ? '#FFFFFF' : '#245E9B'}">FOOD EXPOSÉ</text><text x="540" y="860" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="${imageLedCta ? '#FFFFFF' : '#35443C'}">Barcode Scanner</text>` : ''}
    </svg>`;
}

async function renderNormalizedPack(sourcePath, width, height) {
  return sharp(sourcePath)
    .ensureAlpha()
    .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 }, threshold: 10 })
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: false,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function renderSlide(slide, index, total, outputDirectory) {
  const outputPath = path.join(outputDirectory, `slide-${String(index + 1).padStart(2, '0')}.jpg`);
  const svg = slide.type === 'grid'
    ? buildGridSvg(slide, index, total)
    : slide.type === 'split_grid'
      ? buildSplitGridSvg(slide)
      : buildSimpleSvg(slide, index, total);
  const composites = [];
  if (slide.type === 'cta' && slide.cta_image_path) {
    composites.push({
      input: await sharp(path.resolve(slide.cta_image_path))
        .resize(1080, 1920, { fit: 'cover', position: 'centre' })
        .png()
        .toBuffer(),
      top: 0,
      left: 0,
    });
  }
  composites.push({ input: Buffer.from(svg), top: 0, left: 0 });
  if (slide.type === 'grid') {
    const grid = gridLayout(slide.products.length);
    for (const [cardIndex, card] of slide.products.entries()) {
      const column = cardIndex % grid.columns;
      const row = Math.floor(cardIndex / grid.columns);
      const left = grid.margin + column * (grid.width + grid.gap) + 8;
      const top = grid.startY + row * (grid.height + grid.gap) + gridImageTopOffset(card);
      composites.push({
        input: await renderNormalizedPack(card.image_path, grid.width - 16, gridImageHeight(grid)),
        left,
        top,
      });
    }
  }
  if (slide.type === 'split_grid') {
    for (const { card, x, y, width } of splitGridCards(slide)) {
      composites.push({
        input: await renderNormalizedPack(card.image_path, width - 26, 220),
        left: x + 13,
        top: y,
      });
    }
  }
  if (slide.type === 'cover' && slide.cover_image_path) {
    composites.push({
      input: await renderNormalizedPack(slide.cover_image_path, 620, 820),
      left: 230,
      top: 760,
    });
  }
  await sharp({ create: { width: 1080, height: 1920, channels: 4, background: '#F8F7F3' } })
    .composite(composites)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(outputPath);
  return outputPath;
}

async function renderContactSheet(slides, outputDirectory) {
  const thumbnailWidth = 270;
  const thumbnailHeight = 480;
  const columns = 4;
  const rows = Math.ceil(slides.length / columns);
  const composites = await Promise.all(slides.map(async (slidePath, index) => ({
    input: await sharp(slidePath)
      .resize(thumbnailWidth, thumbnailHeight, { fit: 'cover' })
      .jpeg({ quality: 84 })
      .toBuffer(),
    left: (index % columns) * thumbnailWidth,
    top: Math.floor(index / columns) * thumbnailHeight,
  })));
  await sharp({
    create: {
      width: columns * thumbnailWidth,
      height: rows * thumbnailHeight,
      channels: 3,
      background: '#EFF6F2',
    },
  })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(path.join(outputDirectory, 'contact-sheet.jpg'));
}

async function renderBrandedCarousel(spec, outputDirectory, options = {}) {
  const errors = validateSpec(spec);
  if (errors.length) throw new Error(errors.join('\n'));
  fs.mkdirSync(outputDirectory, { recursive: true });
  await ensureProductImages(spec, outputDirectory, Boolean(options.fetchAssets));
  const slides = [];
  for (const [index, slide] of spec.slides.entries()) {
    slides.push(await renderSlide(slide, index, spec.slides.length, outputDirectory));
  }
  await renderContactSheet(slides, outputDirectory);
  fs.writeFileSync(path.join(outputDirectory, 'manifest.json'), `${JSON.stringify({
    title: spec.title,
    format: 'branded_evidence_carousel',
    product_cards: spec.slides.flatMap((slide) => slide.products || []),
    slides,
    status: 'generated_requires_independent_review',
  }, null, 2)}\n`);
  return slides;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--fetch-assets') args.fetchAssets = true;
    if (token === '--input' || token === '--out') args[token.slice(2)] = argv[index + 1];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || !args.out) {
    throw new Error('Usage: node branded-carousel.js --input spec.json --out output-directory [--fetch-assets]');
  }
  const spec = JSON.parse(fs.readFileSync(path.resolve(args.input), 'utf8'));
  const slides = await renderBrandedCarousel(spec, path.resolve(args.out), args);
  console.log(JSON.stringify({ rendered: slides.length, output: path.resolve(args.out) }, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = {
  renderBrandedCarousel,
  validateSpec,
};
