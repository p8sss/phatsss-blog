const path = require('path');
const tailwindcss = require('@tailwindcss/postcss');

module.exports = function tailwindPlugin() {
  return {
    name: 'docusaurus-tailwindcss',
    configurePostCss(postcssOptions) {
      // Inject Tailwind's PostCSS plugin into Docusaurus' PostCSS pipeline.
      // Docusaurus does not read a project-level postcss.config.js, so we hook
      // into the `configurePostCss` plugin lifecycle instead.
      postcssOptions.plugins.unshift(tailwindcss());
      return postcssOptions;
    },
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, '../src'),
          },
        },
      };
    },
  };
};
