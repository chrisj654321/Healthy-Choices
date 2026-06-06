const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      console.log('[withFmtFix] Plugin is running!');
      console.log('[withFmtFix] Podfile path:', podfilePath);

      if (!fs.existsSync(podfilePath)) {
        console.log('[withFmtFix] Podfile does not exist yet, skipping.');
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');
      console.log('[withFmtFix] Podfile first 500 chars:', podfile.substring(0, 500));

      if (podfile.includes('Fix fmt consteval')) {
        console.log('[withFmtFix] Already patched, skipping.');
        return config;
      }

      const fmtFix = [
        '  # Fix fmt consteval errors with Xcode 26 / Apple Clang 21',
        '  installer.pods_project.targets.each do |target|',
        '    target.build_configurations.each do |config|',
        "      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'",
        "      defs = config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']",
        "      defs << 'FMT_USE_CONSTEVAL=0' unless defs.include?('FMT_USE_CONSTEVAL=0')",
        "      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs",
        '    end',
        '  end',
      ].join('\n');

      const matched = podfile.match(/post_install do \|[^|]+\|/);
      console.log('[withFmtFix] post_install match:', matched ? matched[0] : 'NOT FOUND');

      podfile = podfile.replace(
        /(post_install do \|[^|]+\|)/,
        `$1\n${fmtFix}`
      );

      fs.writeFileSync(podfilePath, podfile);
      console.log('[withFmtFix] Podfile patched successfully!');
      return config;
    },
  ]);
};
