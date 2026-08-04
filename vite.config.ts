import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // en GitHub Pages la app vive bajo /<repo>/ — el workflow define BASE_PATH
  base: process.env.BASE_PATH ?? '/',
  // el dev server respeta el puerto asignado por el entorno (PORT); 5173 solo como fallback
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-mark.png', 'logo.webp'],
      workbox: {
        // canciones ABC, soundfonts y assets: todo cacheable → app 100% offline
        globPatterns: ['**/*.{js,css,html,png,webp,svg,woff,woff2,mp3,ogg}'],
        // el synth de abcjs descarga soundfonts de un CDN: cachearlos en runtime
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/paulrosen\.github\.io\/midi-js-soundfonts\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'abcjs-soundfonts',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Aprende Flauta',
        short_name: 'Flauta',
        description: 'Aprende flauta dulce, fife y traversa con digitaciones y repertorio graduado.',
        theme_color: '#b3541e',
        background_color: '#faf8f4',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'es',
        // rutas relativas: funcionan igual en raíz local y bajo /<repo>/ en Pages
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'logo-mark.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
          { src: 'logo-mark.png', sizes: '256x256', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
