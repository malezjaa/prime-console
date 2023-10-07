import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  keepNames: true,
  dts: true,
  format: ["esm", "cjs"],
  external: [],
  minify: false,
});
