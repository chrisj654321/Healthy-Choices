// Metro bundler config — extends Expo's default config so the prebuilt
// SQLite product catalog (assets/db/products.db, see src/data/productStore.js)
// can be bundled and resolved as an asset like an image or font.
//
// `db` is already present in Expo SDK 56's default assetExts list (confirmed
// by inspecting node_modules/expo/metro-config.js's getDefaultConfig() output
// directly), so this push is a no-op today — but it's kept explicit so this
// keeps working if a future Expo SDK bump ever drops it from the default list.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('db');

module.exports = config;
