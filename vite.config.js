import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // 🔥 IMPORTANTE: dominio personalizado
  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  server: {
    port: 5173,
    open: true
  },

  build: {
    outDir: 'dist',
    sourcemap: true
  }
});