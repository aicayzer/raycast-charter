import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { ChartSource } from "./source";

/** The ECharts canvas needs a size up front; Mermaid sizes its own SVG up to this width. */
export const CANVAS = { width: 900, height: 560 };
export const MAX_WIDTH = 1200;

const baseStyle = `
  html, body { margin: 0; background: transparent; }
  #stage { display: inline-block; padding: 8px;
    font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; }
`;

function mermaidPage(text: string, dark: boolean, script: string): string {
  const config = JSON.stringify({
    startOnLoad: false,
    theme: dark ? "dark" : "default",
    securityLevel: "loose",
    fontFamily: "-apple-system, Helvetica Neue, Helvetica, Arial, sans-serif",
  });
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseStyle}
  #stage { width: ${MAX_WIDTH}px; }
  #stage svg { max-width: 100%; }</style></head>
<body><div id="stage"></div>
<script src="${script}"></script>
<script>
  window.status = "pending";
  mermaid.initialize(${config});
  mermaid.render("chart", ${JSON.stringify(text)}).then(({ svg }) => {
    document.getElementById("stage").innerHTML = svg;
    window.status = "done";
  }).catch((error) => { window.status = "error: " + (error && error.message ? error.message : String(error)); });
</script></body></html>`;
}

function echartsPage(text: string, dark: boolean, script: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${baseStyle}
  #chart { width: ${CANVAS.width}px; height: ${CANVAS.height}px; }</style></head>
<body><div id="stage"><div id="chart"></div></div>
<script src="${script}"></script>
<script>
  window.status = "pending";
  try {
    const option = Object.assign({ backgroundColor: "transparent", animation: false }, ${text});
    const chart = echarts.init(document.getElementById("chart"), ${dark ? '"dark"' : "null"}, { renderer: "canvas" });
    chart.setOption(option);
    window.status = "done";
  } catch (error) { window.status = "error: " + (error && error.message ? error.message : String(error)); }
</script></body></html>`;
}

/** The page the browser loads: the vendored library plus the source, signalling through window.status. */
export function buildPage(source: ChartSource, dark: boolean, vendorDir: string): string {
  const script = pathToFileURL(join(vendorDir, `${source.kind}.min.js`)).href;
  return source.kind === "mermaid" ? mermaidPage(source.text, dark, script) : echartsPage(source.text, dark, script);
}

/** The element to capture: Mermaid's SVG at its natural size, or the ECharts canvas. */
export function captureSelector(source: ChartSource): string {
  return source.kind === "mermaid" ? "#stage svg" : "#chart";
}
