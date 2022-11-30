import { defineConfig } from "tsup";

export default defineConfig({
  tsconfig: "./tsconfig.json",
  clean: true,
  entryPoints: ["src/index.ts", "src/benchmark.ts"],
});
