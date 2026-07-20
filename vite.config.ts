import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Proxy authentication endpoints
      '/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // Proxy URL management endpoints
      '/urls': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      
      '/oauth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },

      '/clicks': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },

      '/stats': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },

      '/admin': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },

      '/undefined': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
  },
})
