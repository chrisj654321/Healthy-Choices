const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_CONFIG = Object.freeze({
  brand: 'Food Exposé: Barcode Scanner',
  timezone: 'America/Chicago',
  weeklyTargets: { slideshows: 5, videos: 2 },
  research: {
    targetFindings: 20,
    staleAfterDays: 30,
    minimumScore: 62,
    themes: [
      'food scanner',
      'ingredient labels',
      'food additives',
      'grocery swaps',
      'parent company ownership',
      'food lobbying',
      'healthy product marketing',
    ],
  },
  deduplication: {
    recentWindowDays: 90,
    maxTextSimilarity: 0.72,
  },
  rendering: {
    width: 1080,
    height: 1920,
    safeZone: { top: 180, right: 240, bottom: 420, left: 96 },
    quality: 92,
  },
  costControls: {
    weeklyBudgetUsd: 30,
    maxSlideshowUsd: 3,
    maxVideoUsd: 8,
  },
  publishing: {
    platform: 'tiktok',
    bufferChannelId: '',
    publicAssetBaseUrl: '',
    schedulingType: 'notification',
    requireAiDisclosure: true,
    requireCommercialDisclosure: true,
  },
  reviewBoard: {
    host: '127.0.0.1',
    port: 4178,
  },
});

function deepMerge(base, override) {
  const output = { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      output[key] = deepMerge(base[key], value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

function resolvePaths(workspaceRoot = process.cwd(), factoryRootOverride) {
  const factoryRoot =
    factoryRootOverride || path.join(workspaceRoot, 'marketing', 'factory');
  return {
    workspaceRoot,
    factoryRoot,
    database: path.join(factoryRoot, 'content-factory.db'),
    config: path.join(factoryRoot, 'config.json'),
    exports: path.join(factoryRoot, 'exports'),
    packages: path.join(factoryRoot, 'packages'),
    logs: path.join(factoryRoot, 'logs'),
    backups: path.join(factoryRoot, 'backups'),
  };
}

function ensureFactoryDirectories(paths) {
  for (const directory of [
    paths.factoryRoot,
    paths.exports,
    paths.packages,
    paths.logs,
    paths.backups,
  ]) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function loadConfig(options = {}) {
  const paths = resolvePaths(options.workspaceRoot, options.factoryRoot);
  ensureFactoryDirectories(paths);

  let fileConfig = {};
  if (fs.existsSync(paths.config)) {
    fileConfig = JSON.parse(fs.readFileSync(paths.config, 'utf8'));
  }

  return {
    ...deepMerge(DEFAULT_CONFIG, fileConfig),
    paths,
  };
}

function writeDefaultConfig(options = {}) {
  const config = loadConfig(options);
  const { paths, ...persistedConfig } = config;
  fs.writeFileSync(
    config.paths.config,
    `${JSON.stringify(persistedConfig, null, 2)}\n`,
    'utf8'
  );
  return config;
}

module.exports = {
  DEFAULT_CONFIG,
  deepMerge,
  ensureFactoryDirectories,
  loadConfig,
  resolvePaths,
  writeDefaultConfig,
};
