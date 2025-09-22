import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname),
  base: mode === "prod" ? "/openseadragon-konva-layer" : "/",
  resolve: {
    alias: {
      "openseadragon-konva-layer":
        mode === "prod"
          ? path.resolve(__dirname, "../dist/konva-layer.js")
          : path.resolve(__dirname, "../src/konva-layer.ts"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
}));
