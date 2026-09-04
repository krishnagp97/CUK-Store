const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["k6/homepage.ts", "k6/products.ts"],
    bundle: true,
    platform: "neutral",
    format: "esm",
    external: ["k6", "k6/*"],
    outdir: "k6",
  })
  .catch(() => process.exit(1));