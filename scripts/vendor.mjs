// Copies the browser builds of Mermaid and ECharts from node_modules into
// assets/vendor, where the Render Chart command and the thumbnail script load
// them from, and converts the world-atlas countries to GeoJSON as a script that
// registers the map with ECharts. Run after bumping any of them: npm run vendor.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "assets", "vendor");
mkdirSync(outDir, { recursive: true });

const files = [
  ["mermaid", join("dist", "mermaid.min.js")],
  ["echarts", join("dist", "echarts.min.js")],
];
for (const [pkg, file] of files) {
  const { version } = JSON.parse(readFileSync(join(root, "node_modules", pkg, "package.json"), "utf8"));
  copyFileSync(join(root, "node_modules", pkg, file), join(outDir, `${pkg}.min.js`));
  console.log(`${pkg} ${version} -> assets/vendor/${pkg}.min.js`);
}

const topology = JSON.parse(readFileSync(join(root, "node_modules", "world-atlas", "countries-110m.json"), "utf8"));
const countries = feature(topology, topology.objects.countries);
const maps = { world: countries };
writeFileSync(join(outDir, "maps.js"), `window.CHARTER_MAPS = ${JSON.stringify(maps)};\n`);
console.log(`world-atlas 110m (${countries.features.length} countries) -> assets/vendor/maps.js`);
