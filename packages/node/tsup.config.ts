import { defineConfig } from "tsup";

export default defineConfig({
  tsconfig: "./tsconfig.json",
  clean: true,
  entryPoints: [
    "src/index.ts",
    ...(process.env.BENCHMARK ? ["src/benchmark.ts"] : []),
  ],
  external: ["../native/jwtrust.node"],
  treeshake: false,
  dts: true,
});
