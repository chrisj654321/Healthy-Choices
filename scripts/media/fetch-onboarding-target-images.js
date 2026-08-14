/**
 * fetch-onboarding-target-images.js
 *
 * Replacement pass for the onboarding product shots that came back as
 * low-quality OFF user photos. Scrapes Target search HTML for (title,
 * scene7 image id) pairs, picks the first result whose title matches the
 * product, and downloads the scene7 image as a 480px transparent PNG
 * (fmt=png-alpha) — matching the studio-cutout look of the shots we kept.
 *
 * Each candidate is saved for a manual visual review pass; nothing is
 * trusted blind. Manifest updated per download.
 *
 * Usage: node scripts/media/fetch-onboarding-target-images.js
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'assets', 'onboarding', 'products');

const TARGETS = [
  { slug: 'cheerios',     search: 'cheerios original cereal',            mustMatch: /cheerios/i, reject: /honey nut|treat|bar|oat crunch/i },
  { slug: 'doritos',      search: 'doritos nacho cheese',                mustMatch: /doritos.*nacho/i, reject: /cool ranch|flamin/i },
  { slug: 'pop-tarts',    search: 'pop tarts frosted strawberry',        mustMatch: /pop-?tarts.*strawberry/i, reject: /bites|crisps/i },
  { slug: 'oreos',        search: 'oreo chocolate sandwich cookies',     mustMatch: /oreo/i, reject: /double stuf|thins|mini|golden|mega/i },
  { slug: 'cheetos',      search: 'cheetos crunchy cheese',              mustMatch: /cheetos crunchy/i, reject: /flamin|puffs|white cheddar/i },
  { slug: 'kraft-mac',    search: 'kraft macaroni cheese original',      mustMatch: /kraft.*mac/i, reject: /cup|deluxe|spirals|shapes/i },
  { slug: 'eggo',         search: 'eggo buttermilk waffles',             mustMatch: /eggo.*buttermilk/i, reject: /mini|thick|blueberry/i },
  { slug: 'hot-pockets',  search: 'hot pockets pepperoni pizza',         mustMatch: /hot pockets.*pepperoni/i, reject: /deliwich|bites|big & bold/i },
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function extractPairs(html) {
  // Target embeds product JSON in the SSR payload; titles appear as
  // "title":"..." and images as GUEST_ ids. Pair each title with the
  // nearest-following GUEST id so ordering stays aligned with results.
  const pairs = [];
  const re = /"title":"([^"]{5,160})"|GUEST_[a-f0-9-]{36}/g;
  let pendingTitle = null;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1] !== undefined) {
      pendingTitle = m[1];
    } else if (pendingTitle) {
      pairs.push({ title: pendingTitle, id: m[0] });
      pendingTitle = null;
    }
  }
  return pairs;
}

async function main() {
  const manifestPath = path.join(ROOT, 'assets', 'onboarding', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const t of TARGETS) {
    try {
      const res = await fetch(`https://www.target.com/s?searchTerm=${encodeURIComponent(t.search)}`, {
        headers: { 'User-Agent': UA, Accept: 'text/html' },
      });
      if (!res.ok) throw new Error(`search HTTP ${res.status}`);
      const html = await res.text();
      const pairs = extractPairs(html);
      const hit = pairs.find((p) => t.mustMatch.test(p.title) && !t.reject.test(p.title));
      if (!hit) throw new Error(`no title match among ${pairs.length} results`);

      const imgUrl = `https://target.scene7.com/is/image/Target/${hit.id}?wid=480&hei=480&fmt=png-alpha`;
      const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': UA } });
      if (!imgRes.ok) throw new Error(`image HTTP ${imgRes.status}`);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      if (buf.length < 2000) throw new Error(`image too small (${buf.length}B)`);

      // Remove the old low-quality file (extension may differ)
      for (const ext of ['.jpg', '.png', '.webp']) {
        const old = path.join(OUT, t.slug + ext);
        if (fs.existsSync(old)) fs.unlinkSync(old);
      }
      const dest = path.join(OUT, t.slug + '.png');
      fs.writeFileSync(dest, buf);
      manifest.products[t.slug] = {
        dest: path.relative(ROOT, dest),
        bytes: buf.length,
        source: imgUrl,
        matchedName: hit.title,
      };
      console.log('OK ', t.slug.padEnd(12), '←', hit.title.slice(0, 60), `(${buf.length}B)`);
      await new Promise((r) => setTimeout(r, 800)); // be polite
    } catch (e) {
      console.log('FAIL', t.slug.padEnd(12), '—', e.message);
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('\nManifest updated.');
}

main().catch((e) => { console.error(e); process.exit(1); });
