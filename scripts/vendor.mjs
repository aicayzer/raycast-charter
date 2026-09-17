// Copies the browser builds of Mermaid and ECharts from node_modules into
// assets/vendor, where the Render Chart command and the thumbnail script load
// them from. Run after bumping either package: npm run vendor.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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
