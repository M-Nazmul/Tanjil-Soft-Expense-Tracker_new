import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  define: {
    // This allows process.env.API_KEY to work in the browser
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  }
});