import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      // Use SSL in development only
      mode === 'development' && basicSsl(),
    ],
    build: {
      outDir: './docs', // Output directory for the production build
    },
    // server: {
    //   // Apply the proxy only in development mode
    //   proxy: mode === 'development' ? {
    //     '/api': {
    //       target: 'https://2ch.hk', // Target URL for API requests
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api from the path
    //     },
    //   } : undefined, // No proxy in production
    // },
    base: './', // Relative base URL
  };
});