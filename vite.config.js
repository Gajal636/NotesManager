import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173
  }
})
