
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/NEXTWIN-PRO/', // IMPORTANT: Doit correspondre exactement au nom de votre dépôt GitHub
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  define: {
    // Permet d'injecter la clé API de l'environnement
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
