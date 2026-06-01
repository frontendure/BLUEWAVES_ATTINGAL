import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    splitVendorChunkPlugin(),
    prerender({
      routes: ['/', '/about', '/programs', '/membership', '/gallery', '/contact'],
      renderer: new PuppeteerRenderer({
        // Wait 3 seconds for animations or data fetching to settle
        renderAfterTime: 3000,
        // Required for sandbox environments on Netlify/CI build servers
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }),
    })
  ],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@supabase/supabase-js')) return 'supabase'
        },
      },
    },
  },
})
