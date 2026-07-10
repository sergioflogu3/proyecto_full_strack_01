import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // ← plugin de Tailwind v4
  ],
  server: {
    port: 5173,      // forzar siempre el mismo puerto
    strictPort: true,
  },
})

