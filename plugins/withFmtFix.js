const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        return config;
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (podfile.includes('Fix fmt consteval')) {
        return config;
      }

      const fmtFix = [
        '  # Fix fmt consteval errors with Xcode 26 / Apple Clang 21',
        '  installer.pods_project.targets.each do |target|',
        '    target.build_configurations.each do |cfg|',
        "      cfg.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -DFMT_USE_CONSTEVAL=0'",
        "      cfg.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'",
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
