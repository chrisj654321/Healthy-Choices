const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Fixes fmt consteval errors with Xcode 26 / Apple Clang 21
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (podfile.includes('Fix fmt consteval')) {
        return config;
      }

      const fmtFix = [
        '  # Fix fmt consteval errors with Xcode 26 / Apple Clang 21',
        '  installer.pods_project.targets.each do |target|',
        '    target.build_configurations.each do |config|',
        "      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'",
        "      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']",
        "      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'FMT_USE_CONSTEVAL=0'",
        '    end',
        '  end',
      ].join('\n');

      podfile = podfile.replace(
        /(post_install do \|[^|]+\|)/,
        `$1\n${fmtFix}`
      );

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
};
