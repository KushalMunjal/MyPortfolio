import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import sitemap from 'vite-plugin-sitemap';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Generates sitemap.xml automatically on build for Google Search
    sitemap({ 
      hostname: 'https://kushalmunjal.netlify.app/',
      readable: true,
      changefreq: 'weekly',
      priority: 1.0
    }),
    // Compresses your assets (JS/CSS) to Gzip/Brotli for faster loading
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true, // Automatically opens browser
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser', // Terser often produces smaller bundles than esbuild for production
    terserOptions: {
      compress: {
        drop_console: true, // Removes console.logs for a cleaner production build
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Splitting large vendor libraries (Three.js, MUI) into separate chunks
        // This makes your initial page load much faster
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, 
  },
});