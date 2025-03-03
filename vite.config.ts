import { defineConfig } from "vite";
import path from "path";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "pdfjs-dist": path.resolve(__dirname, "node_modules/pdfjs-dist"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjsWorker: ["pdfjs-dist/build/pdf.worker.entry"],
        },
      },
    },
  },
  server: {
    proxy: {
      '/astra': {
        target: 'https://9647bdff-737a-4438-9b3b-8da27a20e5e3-us-east-2.apps.astra.datastax.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/astra/, ''),
      },
    },
  },
});
