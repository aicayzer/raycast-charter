// Renders one thumbnail per chart type, light and dark, into assets/charts/.
// Mermaid types use the Mermaid template; the rest use a small ECharts option.
// Both are drawn by the local Chrome through puppeteer-core from a local HTML
// page, so nothing leaves the machine. Run by hand: npm run thumbnails [id ...].
import { build } from "esbuild";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { ECHARTS_SAMPLES } from "./thumbnail-samples.mjs";

const root = resolve(new URL("..", import.meta.url).pathname);
const outDir = join(root, "assets", "charts");
const workDir = join(root, ".thumbnails");
const WIDTH = 900;
const HEIGHT = 600;
const PAD = 12;

const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
];
const chrome = CHROME_CANDIDATES.find((path) => path && existsSync(path));
if (!chrome) {
  console.error("No Chromium-based browser found. Set CHROME_BIN to one.");
  process.exit(1);
}

const only = new Set(process.argv.slice(2));

async function loadCatalogue() {
  mkdirSync(workDir, { recursive: true });
  const bundle = join(workDir, "charts.mjs");
  await build({
    entryPoints: [join(root, "src", "data", "charts.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: bundle,
    logLevel: "silent",
  });
  const { CHARTS } = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`);
  return CHARTS;
}

// The same copies the Render Chart command ships, so thumbnails match what it draws.
const mermaidScript = pathToFileURL(join(root, "assets", "vendor", "mermaid.min.js")).href;
const echartsScript = pathToFileURL(join(root, "assets", "vendor", "echarts.min.js")).href;

const stageStyle = `
  html, body { margin: 0; background: transparent; }
  #stage { width: ${WIDTH}px; height: ${HEIGHT}px; box-sizing: border-box; padding: ${PAD}px;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; }
  #stage svg { width: 100% !important; height: 100% !important; max-width: none !important; }
`;

function mermaidPage(template, dark) {
  const config = JSON.stringify({
    startOnLoad: false,
    theme: dark ? "dark" : "default",
    securityLevel: "loose",
    fontFamily: "-apple-system, Helvetica Neue, Helvetica, Arial, sans-serif",
  });
  return `<!doctype html><html><head><meta charset="utf-8"><style>${stageStyle}</style></head>
<body><div id="stage"></div>
<script src="${mermaidScript}"></script>
<script>
  window.status = "pending";
  mermaid.initialize(${config});
  mermaid.render("thumb", ${JSON.stringify(template)}).then(({ svg }) => {
    document.getElementById("stage").innerHTML = svg;
    window.status = "done";
  }).catch((error) => { window.status = "error: " + error.message; });
</script></body></html>`;
}

function echartsPage(option, dark) {
  const themed = { backgroundColor: "transparent", animation: false, ...option };
  return `<!doctype html><html><head><meta charset="utf-8"><style>${stageStyle}
  #chart { width: ${WIDTH - 2 * PAD}px; height: ${HEIGHT - 2 * PAD}px; }</style></head>
<body><div id="stage"><div id="chart"></div></div>
<script src="${echartsScript}"></script>
<script>
  window.status = "pending";
  try {
    const chart = echarts.init(document.getElementById("chart"), ${dark ? '"dark"' : "null"}, { renderer: "canvas" });
    chart.setOption(${JSON.stringify(themed)});
    window.status = "done";
  } catch (error) { window.status = "error: " + error.message; }
</script></body></html>`;
}

async function render(page, html, name, target) {
  const file = join(workDir, `${name}.html`);
  writeFileSync(file, html);
  await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.status !== "pending", { timeout: 15000 });
  const status = await page.evaluate(() => window.status);
  if (status !== "done") throw new Error(status);
  // Let fonts and the canvas settle before capture.
  await new Promise((done) => setTimeout(done, 150));
  const stage = await page.$("#stage");
  await stage.screenshot({ path: target, omitBackground: true });
}

async function main() {
  const charts = await loadCatalogue();
  mkdirSync(outDir, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  const done = [];
  const failed = [];

  try {
    for (const chart of charts) {
      if (only.size > 0 && !only.has(chart.id)) continue;
      const sample = ECHARTS_SAMPLES[chart.id];
      if (!chart.mermaid && !sample) {
        failed.push(`${chart.id}: no Mermaid template and no ECharts sample`);
        continue;
      }
      try {
        for (const dark of [false, true]) {
          const html = chart.mermaid ? mermaidPage(chart.mermaid.template, dark) : echartsPage(sample, dark);
          await render(page, html, `${chart.id}${dark ? "-dark" : ""}`, join(outDir, `${chart.id}${dark ? "@dark" : ""}.png`));
        }
        done.push(chart.id);
        console.log(`rendered ${chart.id}`);
      } catch (error) {
        failed.push(`${chart.id}: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  if (only.size === 0) {
    const known = (file) => charts.some((chart) => file === `${chart.id}.png` || file === `${chart.id}@dark.png`);
    for (const file of readdirSync(outDir)) if (!known(file)) rmSync(join(outDir, file));
  }
  const ids = readdirSync(outDir)
    .filter((file) => file.endsWith(".png") && !file.includes("@dark"))
    .map((file) => file.replace(/\.png$/, ""))
    .sort();
  writeFileSync(
    join(root, "src", "data", "thumbnails.ts"),
    `// Generated by scripts/render-thumbnails.mjs. Do not edit by hand.\n` +
      `// Chart ids that have a thumbnail at assets/charts/<id>.png (and <id>@dark.png).\n` +
      `export const THUMBNAILS: string[] = ${JSON.stringify(ids, null, 2)};\n`,
  );

  console.log(`\n${done.length} rendered, ${failed.length} failed`);
  if (failed.length > 0) {
    for (const failure of failed) console.error(`  ${failure}`);
    process.exit(1);
  }
}

await main();
