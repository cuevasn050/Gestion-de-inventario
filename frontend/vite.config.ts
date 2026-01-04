import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Permitir todos los hosts de Render
    allowedHosts: [
      'gestion-de-inventario-aeu5.onrender.com',
      '.onrender.com',
      'localhost',
    ],
  },
})





