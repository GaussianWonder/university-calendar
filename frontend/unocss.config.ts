import { defineConfig } from "@unocss/vite";
import { presetAttributify, presetIcons, presetUno } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
  presets: [
    presetAttributify({/* preset options */}),
    presetUno(),
    presetIcons(),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
});
