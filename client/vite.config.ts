import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate', // Automatically updates SW in background
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Emealia',
                short_name: 'Emealia',
                description: 'Recipe Collection & Meal Planning',
                theme_color: '#28793c',
                background_color: '#28793c',
                display: 'standalone',
                icons: [
                    {
                        src: '/assets/web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable'
                    },
                    {
                        src: '/assets/web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ],
            },
            workbox: {
                // Cache all JS, CSS, HTML, and web worker bundles automatically
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
                // Ignore API sync routes so Supabase fetches always hit the network/SyncEngine
                navigateFallbackDenylist: [/^\/rest\/v1/],
            },
        }),
    ],
    resolve: {
        alias: {
            '@emealia/shared': path.resolve(__dirname, '../shared/index.ts'),
        },
    },
})
