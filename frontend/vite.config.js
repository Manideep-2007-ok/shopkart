import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the site from /<repo-name>/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/shopkart/" : "/",
  server: { port: 5173 },
}));
