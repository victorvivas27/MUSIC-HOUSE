import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'



export default defineConfig(() => {
  return {
    base: './', 
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(new URL(import.meta.url).pathname), './src')
      }
    },
    build: {
      chunkSizeWarningLimit: 1000, // aumenta el límite antes de mostrar warning
      rollupOptions: {
        output: {
          manualChunks: {
            // separa dependencias grandes para mejorar cache y carga inicial
            react: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
            vendor: ['axios', 'sweetalert2', 'framer-motion']
          }
        }
      }
    }
  }
})
