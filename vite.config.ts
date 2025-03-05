import { defineConfig } from "vite";
import path from "path";
import react from '@vitejs/plugin-react';

const token = process.env.VITE_ASTRA_DB_TOKEN as string;

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
        target: 'https://17f0756f-70ba-4a49-b7b2-4b0e4850822c-us-east-2.apps.astra.datastax.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/astra/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('X-Cassandra-Token', token);
          });
        },
      },
    },
  },
});
