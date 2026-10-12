// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://nfc.ciwork.co',
  compressHTML: true,
  trailingSlash: 'always',
  redirects: {
    '/form/': '/business-formation/',
    '/map-test/': '/browse-by-state/',
  },
});
