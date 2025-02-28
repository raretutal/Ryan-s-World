import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
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
});
