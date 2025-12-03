import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Development mode - standard React app
// Production mode - library build for embedding
const isProduction = process.env.NODE_ENV === 'production' && process.env.BUILD_TARGET === 'library'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Library mode configuration for embeddable widget
  ...(isProduction ? {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index-web-component.ts'),
        name: 'WishlistDock',
        fileName: (format) => `wishlist-dock.${format}.js`,
        formats: ['es', 'umd']
      },
      rollupOptions: {
        // Don't externalize anything - bundle everything for true embeddability
        external: [],
        output: {
          globals: {},
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'wishlist-dock.css'
            return assetInfo.name
          }
        }
      },
      cssCodeSplit: false,
      sourcemap: true,
      minify: 'terser'
    }
  } : {}),

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true
  },

  // Preview server for production build
  preview: {
    port: 4173,
    host: true
  }
})