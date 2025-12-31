
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Charge toutes les variables (Secrets GitHub + .env)
  const env = loadEnv(mode, process.cwd(), '');
  
  // On récupère la clé peu importe son nom (API_KEY ou VITE_API_KEY)
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    base: './',
    define: {
      // Injection critique pour que le code browser puisse lire la clé
      'process.env.API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'esbuild',
      sourcemap: false
    }
  };
});
