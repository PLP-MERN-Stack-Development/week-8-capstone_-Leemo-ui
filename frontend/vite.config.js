import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Ensure SPA fallback to index.html
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
  },
});
