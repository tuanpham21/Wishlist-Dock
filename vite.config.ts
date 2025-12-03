import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isLibrary = mode === 'library' || (process.env.BUILD_TARGET === 'library')

  return {
    plugins: [react(), tailwindcss()],

    // Define global constants for browser compatibility
    define: {
      'process.env.NODE_ENV': JSON.stringify('production')
    },

    build: isLibrary ? {
      lib: {
        entry: resolve(__dirname, 'src/index-library.ts'),
        name: 'WishlistDock',
        fileName: (format) => `wishlist-dock.${format}.js`,
        formats: ['es', 'umd']
      },
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) return 'wishlist-dock.css'
            return assetInfo.name || 'asset'
          }
        }
      },
      cssCodeSplit: false,
      sourcemap: true,
      minify: 'terser',
      emptyOutDir: true,
      target: 'esnext'
    } : {},

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
  }
})