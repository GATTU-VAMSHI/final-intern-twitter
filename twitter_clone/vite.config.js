import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this is set to your desired output directory
    rollupOptions: {
      input: {
        main: 'src/main.jsx', // Entry point for your application
      },
      external: ['server/*'], // Exclude server files from the bundle
    },
  },
})