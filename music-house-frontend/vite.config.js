import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(() => {
  return {
    base: './', 
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      chunkSizeWarningLimit: 1000, 
      rollupOptions: {
        output: {
          manualChunks: {
           
            react: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
            vendor: ['axios', 'sweetalert2', 'framer-motion']
          }
        }
      }
    }
  }
})
