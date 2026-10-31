import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

const spaFallbackPlugin = () => ({
  name: "spa-fallback",
  closeBundle() {
    copyFileSync(resolve("dist/index.html"), resolve("dist/404.html"));
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallbackPlugin()],
});
