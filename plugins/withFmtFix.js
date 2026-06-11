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
        "    if target.name == 'fmt'",
        '      target.build_configurations.each do |cfg|',
        "        cfg.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'",
        "        cfg.build_settings['OTHER_CPLUSPLUSFLAGS'] = '$(inherited) -std=c++17 -DFMT_USE_CONSTEVAL=0'",
        '      end',
        '    end',
        '  end',
      ].join('\n');

      const patched = podfile.replace(
        /(post_install do \|[^|]+\|)/,
        `$1\n${fmtFix}`
      );

      // Fail the build loudly rather than silently shipping without the fix
      // if the Podfile template ever changes shape.
      if (patched === podfile) {
        throw new Error(
          'withFmtFix: could not find a `post_install do |...|` block in the ' +
          'generated Podfile. The Expo template has changed — update plugins/withFmtFix.js.'
        );
      }

      fs.writeFileSync(podfilePath, patched);
      return config;
    },
  ]);
};
