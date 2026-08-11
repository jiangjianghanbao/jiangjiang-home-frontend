import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/jiangjiang-home-frontend/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '我们的家 🏠',
        short_name: '我们的家',
        description: '余烬和乖乖的家',
        theme_color: '#fff7e6',
        background_color: '#fff7e6',
        display: 'standalone',
        start_url: '/jiangjiang-home-frontend/',
        icons: [
          { src: '/jiangjiang-home-frontend/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
  server: { port: 5173 },
});
