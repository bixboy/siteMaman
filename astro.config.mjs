import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://main-e-merveille.fr',
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    partytown({
      config: {
        forward: ['dataLayer.push']
      }
    }),
    sitemap()
  ],
  scopedStyleStrategy: 'where'
});
