import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import UnocssPlugin from '@unocss/vite';

export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 3030,
  },
  plugins: [
    solidPlugin(),
    UnocssPlugin({ /* uno.config.ts */ }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
