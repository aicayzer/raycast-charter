import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { buildPage, captureSelector, MAX_WIDTH } from "./page";
import type { ChartSource } from "./source";

export interface RenderOptions {
  executable: string;
  vendorDir: string;
  /** Where the page and the PNG are written. Older renders are cleared each time. */
  workDir: string;
  dark: boolean;
}

export interface RenderedImage {
  path: string;
  /** CSS pixels; the PNG itself is twice that. */
  width: number;
  height: number;
}

const SCALE = 2;
const TIMEOUT = 20000;

/** Name the output so each render is a new file: Raycast caches images by path. */
export function newImagePath(workDir: string): string {
  mkdirSync(workDir, { recursive: true });
  for (const entry of readdirSync(workDir)) {
    if (entry.startsWith("render-") && entry.endsWith(".png")) rmSync(join(workDir, entry), { force: true });
  }
  return join(workDir, `render-${Date.now()}.png`);
}

/** Draws the source in a headless Chromium and captures the chart element at 2x. */
export async function renderInBrowser(source: ChartSource, options: RenderOptions): Promise<RenderedImage> {
  const pagePath = join(options.workDir, "render.html");
  const imagePath = newImagePath(options.workDir);
  writeFileSync(pagePath, buildPage(source, options.dark, options.vendorDir));

  const browser = await puppeteer.launch({
    executablePath: options.executable,
    headless: true,
    timeout: TIMEOUT,
    args: ["--no-first-run", "--no-default-browser-check", "--hide-scrollbars"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: MAX_WIDTH + 32, height: 900, deviceScaleFactor: SCALE });
    await page.goto(pathToFileURL(pagePath).href, { waitUntil: "load", timeout: TIMEOUT });
    // The page reports through window.status; the functions run in the browser, where tsc cannot see it.
    await page.waitForFunction("window.status !== 'pending'", { timeout: TIMEOUT });
    const status = await page.evaluate<[], () => string>("window.status");
    if (status !== "done") throw new Error(String(status).replace(/^error: /, ""));
    // Let fonts and the canvas settle before capture.
    await new Promise((done) => setTimeout(done, 150));
    const element = await page.$(captureSelector(source));
    if (!element) throw new Error("The page drew nothing to capture.");
    const box = await element.boundingBox();
    if (!box || box.width === 0 || box.height === 0) throw new Error("The chart has no size.");
    await element.screenshot({ path: imagePath, omitBackground: true });
    return { path: imagePath, width: Math.round(box.width), height: Math.round(box.height) };
  } finally {
    await browser.close();
  }
}
