import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import svelte from '@astrojs/svelte'

import vercel from '@astrojs/vercel';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
  ],

  site: 'https://tramita.info',
  output: 'server',

  server: {
    port: 4000,
  },

  vite: {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
  },

  adapter: vercel(),
})