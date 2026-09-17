import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite serves and builds the demo site; the library itself is built by rollup.
export default defineConfig({
  root: "demo",
  publicDir: path.resolve(__dirname, "public"),
  base: "/react-timecalendar/",
  plugins: [react()],
  css: { preprocessorOptions: { scss: { api: "modern-compiler" } } },
  build: {
    outDir: path.resolve(__dirname, "dist-demo"),
    emptyOutDir: true,
  },
  test: {
    root: __dirname,
    dir: "src",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    css: false,
  },
});
