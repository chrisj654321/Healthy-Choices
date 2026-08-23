const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
const transformExports = (source) => source
  .replace(/^import\b[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm, '')
  .replace(/\bexport const\s+/g, 'const ')
  .replace(/\bexport function\s+/g, 'function ');
const stripModuleExports = (source) => source.replace(/^module\.exports\s*=\s*\{[\s\S]*?\};\s*$/m, '');

const bundle = [
  transformExports(read('src/data/ingredientCache.js')),
  transformExports(read('src/data/ingredients.js')),
  stripModuleExports(read('src/utils/ingredientNormalizer.js')),
  transformExports(read('src/utils/sourcingMatch.js')),
  transformExports(read('src/utils/scorer.js')),
  '\nmodule.exports = { scoreProduct };',
].join('\n\n');

const sandbox = { module: { exports: {} }, exports: {}, console, COMPANY_DB: {} };
vm.runInNewContext(bundle, sandbox, { filename: 'scorer-bundle.js', timeout: 30000 });

const input = process.argv[2];
if (!input) throw new Error('Usage: node score-research-candidates.js <raw-research.json>');
const research = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
for (const product of research.products || []) {
  const result = sandbox.module.exports.scoreProduct(product);
  console.log(`${product.barcode}|${result.score}|${product.name}`);
}
