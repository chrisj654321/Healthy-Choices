const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Fixes fmt consteval errors with Xcode 26 / Apple Clang 21
// by compiling the fmt pod with C++17 instead of C++20
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      const fmtFix = `
  # Fix fmt consteval errors with Xcode 26 / Apple Clang 21
  installer.pods_project.targets.each do |target|
    if target.name == 'fmt'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
  end
`;

      if (!podfile.includes('Fix fmt consteval')) {
        podfile = podfile.replace(
          /end\s*$/,
          `${fmtFix}\nend`
        );
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};
