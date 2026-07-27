import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/spendx-client-preview/",
  plugins: [react()],
  resolve: {
    alias: {
      "next/image": resolve(__dirname, "src/StaticImage.tsx"),
    },
  },
  build: {
    outDir: "static-dist",
    emptyOutDir: true,
  },
});
