const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..', '..', '..', '..', '..');
const db = new DatabaseSync(path.join(root, 'assets', 'db', 'products.db'), { readOnly: true });

const categories = [
  'Frozen Breakfast',
  'Packaged Meals',
  'Kids Lunch',
  'Dips & Hummus',
  'Deli Meat',
  'Bread',
  'Granola',
  'Meat & Seafood / Primary Proteins',
  'Nut Butters',
  'Soups & Broths',
  'Chips & Crackers',
];

const query = db.prepare(`
  SELECT
    COUNT(1) AS total,
    SUM(CASE WHEN score >= 80 THEN 1 ELSE 0 END) AS score80Plus,
    COUNT(DISTINCT CASE WHEN score >= 80 THEN lower(trim(brand)) END) AS score80PlusBrands,
    COUNT(DISTINCT CASE WHEN score >= 80 THEN companyId END) AS score80PlusOwners,
    COUNT(DISTINCT lower(trim(brand))) AS allBrands,
    COUNT(DISTINCT companyId) AS allOwners,
    MAX(score) AS maximumScore
  FROM products
  WHERE category = ?
`);

const results = categories.map((category) => ({ category, ...query.get(category) }));
console.table(results);

const legacyCategories = db.prepare(`
  SELECT category, COUNT(1) AS count
  FROM products
  WHERE category IN ('Chips', 'Crackers', 'Deli & Lunch', 'Peanut Butter')
  GROUP BY category
`).all();

if (legacyCategories.length) {
  console.error('Legacy category records remain:', legacyCategories);
  process.exitCode = 1;
}

const plantersOwners = db.prepare(`
  SELECT DISTINCT companyId
  FROM products
  WHERE lower(trim(brand)) = 'planters'
`).all();

if (plantersOwners.length !== 1 || plantersOwners[0].companyId !== 'hormel') {
  console.error('Planters owner mapping is inconsistent:', plantersOwners);
  process.exitCode = 1;
}
