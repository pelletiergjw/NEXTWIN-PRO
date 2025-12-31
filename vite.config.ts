
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  define: {
    // Permet d'injecter la clé API de l'environnement Vercel dans le bundle client
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
