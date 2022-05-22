/* eslint-disable @typescript-eslint/no-var-requires */
const solidPlugin = require('vite-plugin-solid');
const UnocssPlugin = require('@unocss/vite');

/** @type {import("@previewjs/config").PreviewConfig} */
const previewJSConfig = {
  publicDir: "public",
  wrapper: {
    path: "src/PreviewJsWrapper.tsx",
    componentName: 'PreviewJsWrapper',
  },
  alias: {
    '~': './src',
    '@': './src',
  },
  vite: {
    plugins: [
      solidPlugin(),
      UnocssPlugin.default({ /* uno.config.ts */ }),
    ],
    build: {
      target: 'esnext',
      polyfillDynamicImport: false,
    },
  },
};

module.exports = previewJSConfig;
