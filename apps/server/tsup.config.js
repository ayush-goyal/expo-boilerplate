import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  noExternal: ["@acme/api", "@acme/db"],
}));
