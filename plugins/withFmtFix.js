const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Fixes fmt consteval errors with Xcode 26 / Apple Clang 21
// Injects FMT_USE_CONSTEVAL=0 into the existing post_install block
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (podfile.includes('Fix fmt consteval')) {
        return config; // already patched
      }

      const fmtFix = [
        '  # Fix fmt consteval errors with Xcode 26 / Apple Clang 21',
        '  installer.pods_project.targets.each do |target|',
        "    if target.name == 'fmt'",
        '      target.build_configurations.each do |config|',
        "        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'",
        '      end',
        '    end',
        '  end',
      ].join('\n');

      // Find the post_install block and insert after its first line
      podfile = podfile.replace(
        /(post_install do \|[^|]+\|)/,
        `$1\n${fmtFix}`
      );

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
};
